define([
    'jquery',
    'underscore',
    'backbone',
    'rrule',
    'views/EventEditor',
    'models/Event',
    'collections/Events',

    /* Modules*/
    'modules/Backbone.sync',

    /* Plugins */
    'fullCalendar',
    'bootstrap',
    'jqueryui',
    'qtip',
    'datepicker'
], function ($, _, Backbone, RRule, EventEditorView, Event, Events) {
    "use strict";

    var Tooltip = Backbone.View.extend({
        initialize: function () {
            var _this = this;
            this.$el = $("<div/>").qtip({
                id: "tooltip",
                prerender: true,
                content: {
                    text: "",
                    title: "New Event",
                    button: "Close"
                },
                position: {
                    my: "bottom center",
                    at: "top center",
                    viewport: $(window),
                    target: "event"
                },
                events: {
                    render: function(event, api) {
                        $(window).on('keydown', function(e) {
                            if (e.keyCode === 27) {
                                api.hide(e);
                            }
                        });
                    },
                    hide: function (event, api) {
                        api.elements.tooltip.stop(1,1);
                        _this.calendarView.$el.fullCalendar("unselect");
                    }
                },
                hide: false,
                style: "qtip-bootstrap"
            }).qtip("api");
        },
        render: function (jsEvent) {
            this.$el.elements.tooltip.stop(1, 1);
            this.$el.reposition(jsEvent).toggle(true, jsEvent);
            this.listener();
        },
        set: function (start, end, allDay, content) {
            this.start  = start;
            this.end    = end;
            this.allDay = allDay;
            this.$el.set({
                "content.text": content
            });
        },
        isBlank: function (str) {
            return /^\s*$/.test(str);
        },
        hide: function () {
            this.$el.toggle(false);
        },
        generateId: function () {
            return new Date().getTime().toString();
        },
        listener: function () {
            // TODO: Optimize the logic
            //       use fixed content rather than insert content each time
            //       it is rendared=
            // console.log(JSON.stringify(this.eventEditorView.collection));

            var _this = this;
            var tooltipInner  = $("#qtip-tooltip");
            var titleInput    = tooltipInner.find("#tooltip-title-input").focus();
            var createButton  = tooltipInner.find("#tooltip-create-event");
            var cancelButton  = tooltipInner.find("#tooltip-cancel");
            var advanceEditor = tooltipInner.find("#advanced-edit");

            function createEventCallBack () {
                var titleVal = titleInput.val();

                if (_this.isBlank(titleVal)) {
                    alert("Event title cannot be an empty or blank string.");
                    return;
                }

                var fcEvent = {
                    _id: _this.generateId(),
                    title: titleVal,
                    allDay: _this.allDay,
                    start: _this.start,
                    end: _this.end,
                    rrule: null,
                    last_modified: new Date()
                };

                _this.collection.create(new Event(fcEvent), {success: _this.hide()});
                console.log(_this.collection.toJSON());
            }

            createButton.on("click", createEventCallBack);

            titleInput.on("keydown", function (e) {
                if (e.keyCode === 13) {
                    createEventCallBack();
                }
            });

            advanceEditor.on("click", function () {
                var titleVal = titleInput.val();
                var fcEvent = {
                    _id: null,
                    title: titleVal,
                    allDay: _this.allDay,
                    start: _this.start,
                    end: _this.end,
                    rrule: null,
                    last_modified: null
                };
                console.log(_this.calendar);
                _this.calendarView.hideView();
                _this.eventEditorView.model = new Event(fcEvent);
                _this.eventEditorView.render();
                _this.hide();
            });

            cancelButton.on("click", function () {
                _this.hide();
            });
        }
    });

    var InfoDialog = Backbone.View.extend({
        el: "#dialog",
        initialize: function (attr) {
            this.$el.modal({
                backdrop: false
            });

            this.event = attr.toJSON();
            this.render();
            this.show();
        },

        render: function () {
            var template = _.template($("#infoDialogTemplate").html(), {
                event: this.event
            });
            this.$(".modal-content").html(template);
        },

        show: function () {
            this.$el.modal("show");
        }
    });

    return Backbone.View.extend({
        el: "#calendar",
        initialize: function(){
            _.bindAll(this, "select", 
                            "unselect",
                            "loading",
                            "eventRender",
                            "eventDragStart",
                            "eventResizeStart",
                            "eventDrop",
                            "eventResize",
                            "eventClick"
                            );

            this.eventResizing = false;
            this.elementArray = [];
            this.tooltip = new Tooltip();
            this.eventEditorView = new EventEditorView();

            $("#mini-calendar").datepicker({
                autoclose: true,
            });
            this.render();
        },
        render: function() {

            // this.onloading = {
            //     pleaseWaitDiv: $('#pleaseWaitDialog'),

            //     showPleaseWait: function() {
            //         this.pleaseWaitDiv.modal("show");
            //     },
            //     hidePleaseWait: function () {
            //         this.pleaseWaitDiv.modal("hide");
            //     }
            // };

            this.$el.fullCalendar({
                header: {
                    left: "prev,next today title",
                    right: "month,agendaWeek,agendaDay"
                },
                height: $(window).height() - 80,
                timeFormat: "h:mmtt{ - h:mmtt}",
                editable: true,
                selectable: true,
                selectHelper: true,
                select: this.select,
                slotMinutes: 15,
                unselect: this.unselect,
                unselectCancel: ".qtip",
                loading: this.loading,
                eventResizeStart: this.eventResizeStart,
                eventDragStart: this.eventDragStart, 
                eventClick: this.eventClick,
                eventDrop: this.eventDrop,
                eventResize: this.eventResize,
                eventRender: this.eventRender,
                eventAfterAllRender: this.eventAfterAllRender
            });
            
            this.tooltip.collection = this.eventEditorView.collection = this.collection;
            this.tooltip.calendarView = this.eventEditorView.calendarView = this;
            this.tooltip.eventEditorView = this.eventEditorView;

            var _this = this;
            this.collection.fetch({
                success: function (records) {
                    console.log(records.toJSON());

                    _this.listenTo(_this.collection, "add update destroy", function (acalEvent) {
                        var id = acalEvent.get("id");
                        var rrule = acalEvent.get("rrule");
                        _this.$el.fullCalendar("refetchEvents");
                    });
                    _this.renderEvents();
                }
            });
            this.on("show", this.showView);

            $(window).on("resize", function () {
                // There might be a bug in fullCalendar lib that if resizing event is
                // triggered, this call back function is called as well.
                if (_this.eventResizing) return;
                //setTimeline();
                _this.resizeCalendar();
                _this.destroyQtip();
                _this.$el.fullCalendar("rerenderEvents");
            });
        },

        showView: function () {
            this.$el.show();
            //this.destroyQtip();
            this.resizeCalendar();
        },

        hideView: function () {
            //this.$el.hide();
            $("#main-panel").hide();
        },

        resizeCalendar: function () {
            this.$el.fullCalendar("option", "height", $(window).height() - 80);
        },

        renderEvents: function () {
            var _this = this;

            var source = {
                events: function(start, end, callback) {
                    var regularEvents = [];
                    var recurringEvents = [];

                    _this.collection.filter(function (event) {
                        if (event.get("rrule") == null) {
                            regularEvents.push(event.toJSON());
                        } else {
                            recurringEvents.push(event.toJSON());
                        }
                    });

                    for (var i = recurringEvents.length - 1; i >= 0; i--) {
                        var repeatingEvent = recurringEvents[i];
                        var rule = new RRule(repeatingEvent.rrule);
                        var occurrences = rule.between(start, end, true);
                        var duration = repeatingEvent.end ? repeatingEvent.end.getTime() - repeatingEvent.start.getTime() : 0;

                        for (var j = occurrences.length - 1; j >= 0; j--) {
                            var event = _.clone(repeatingEvent);
                            event.start = occurrences[j];
                            event.end = new Date(event.start.getTime() + duration);
                            _this.$el.fullCalendar("renderEvent", event);
                        };
                    };
                    callback(regularEvents);
                },
                color: "",
                textColor: ""
            }

            this.$el.fullCalendar("addEventSource", source);
        },

        select: function (start, end, allDay, jsEvent) {
            var _this = this;
            var format = this.getPopoverFormat(start, end, allDay);

            var content = '<table>' +
                              '<tbody>' +
                                '<tr>' +
                                  '<th>Date:  </th>' +
                                  '<td id="tooltip-date">' + format.startTime + format.endTime + '</td>' +
                                '</tr>' +
                                '<tr>' +
                                  '<th>Title: </th>' +
                                  '<td><input id="tooltip-title-input" type="text" class="form-control"></td>' +
                                '</tr>' +
                                '<tr>' +
                                  '<td colspan="2">' +
                                    '<button id="tooltip-create-event" type="button" class="btn btn-xs btn-primary">Create</button>' +
                                    '<button id="tooltip-cancel" type="button" class="btn btn-xs btn-default">Cancel</button>' +
                                    '<a href="javascript:void(0)" id="advanced-edit">Advanced Edit</a>' +
                                  '</td>' +
                                '</tr>' +
                              '</tbody>' +
                            '</table>';
            
            this.tooltip.set(start, end, allDay, content);
            this.tooltip.render(jsEvent);
        },
        unselect: function () {
            this.hideTooltip();
        },
        loading: function (bool) {
            if (bool) {
                // console.log("loading");
                //this.onloading.showPleaseWait();
            }
            else {
                // console.log("finished");
                //this.onloading.hidePleaseWait();
            }
        },
        eventClick: function (event) {
            var acalEvent = this.collection.get(event._id);
            var format = this.getPopoverFormat(event.start, event.end, event.allDay);
            acalEvent.set("date", format.startTime + (event.end && format.endTime || ""));
            this.hideQtip(event);
            new InfoDialog(acalEvent);
        },
        eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {
            this.eventDropOrResize(event, revertFunc);
        },
        eventResize: function (event, dayDelta, minuteDelta, revertFunc) {
            this.eventDropOrResize(event, revertFunc);
            this.eventResizing = false;
        },
        eventDropOrResize: function (event, revertFunc) {
            // if (confirm("Are you sure about this change?")) {
            //     // Lookup the model that has the ID of the event and update its attributes
                var acalEvent = this.collection.get(event._id);
                var rrule = acalEvent.get("rrule");

                if (!_.isNull(rrule)) {
                    rrule.dtstart = event.start;
                }

                this.collection.get(event._id).save({start: event.start, end: event.end, rrule: rrule});
            // }
            // else {
            //     revertFunc();
            // }
        },
        eventResizeStart: function (event) {
            this.hideQtip(event);
            this.eventResizing = true;
        },
        eventDragStart: function (event) {
            this.hideQtip(event);
        },
        getPopoverFormat: function (start, end, allDay) {
            var startTime = new Date(start),
                endTime = new Date(end),
                startTimeFormat = "ddd, MMMM d",
                endTimeFormat   = "";

            if (end && (!allDay || startTime.getDate() != endTime.getDate())) {
                endTimeFormat = " - ";

                if (startTime.getFullYear() != endTime.getFullYear()) {
                    endTimeFormat += startTimeFormat += ", yyyy";
                }
                else if (startTime.getDate()  != endTime.getDate() || 
                         startTime.getMonth() != endTime.getMonth()) {
                    endTimeFormat += startTimeFormat;
                } 
            }
            
            if (!allDay) {
                startTimeFormat += ", h(:mm)tt";
                endTimeFormat   += "h(:mm)tt";
            }

            startTime = $.fullCalendar.formatDate(startTime, startTimeFormat);
            endTime   = $.fullCalendar.formatDate(endTime, endTimeFormat);

            return {
                startTime: startTime,
                endTime: endTime
            };
        },
        eventRender: function (event, element) {
            var format = this.getPopoverFormat(event.start, event.end, event.allDay);
            var content = '<h3>' + event.title + '</h3>' + '<p><b>Date:</b> ' + format.startTime + (event.end && format.endTime || "") + '</p>';

            var qtipID = event._id + (event.rrule ? "-" + event.start.getTime() : "");
            if (!_.isUndefined(this.elementArray[qtipID])) {
                 this.elementArray[qtipID].destroy(true);
            }
            var _this = this;
            var qtipElement = element.qtip({
                id: qtipID,
                content: {
                    title: event.title + '<div class="pull-right"><a class="qtip-edit" title="Edit" aria-label="Edit" role="button"><span class="glyphicon glyphicon-edit"></span></a><a class="qtip-delete" title="Delete" aria-label="Delete" role="button" style="margin-left: 5px"><span class="glyphicon glyphicon-trash"></span></a></div>',
                    text: content
                },
                position: {
                    my: "bottom center",
                    at: "top center",
                    viewport: $(window)
                },
                events: {
                    render: function (event, api) {
                        var eventID = api.id.replace(/-.*/, "");
                        $(this).on("click", ".qtip-edit", function() {
                            api.toggle(false);
                            _this.hideView();
                            _this.tooltip.hide();
                            _this.eventEditorView.model = _this.collection.get(eventID);
                            _this.eventEditorView.render();
                        });

                        $(this).on("click", ".qtip-delete", function() {
                            confirm("Are you sure you want to delete this event?") && _this.collection.get(eventID).destroy({success: api.destroy(true)});
                        });
                    }
                },
                // Allow the user the mouseover the tooltip without it hiding
                hide: { fixed: true, delay: 100 },
                style:  "qtip-bootstrap"
            }).qtip("api");

            this.elementArray[qtipID] = qtipElement;
        },
        eventAfterAllRender: function () {
            console.log("all render");
        },
        hideTooltip: function () {
            this.tooltip.hide();
        },
        hideQtip: function (event) {
            var selector = "#qtip-" + event._id + (event.rrule ? "-" + event.start.getTime() : "");
            $(selector).qtip().hide();
        },
        destroyQtip: function () {
            var qtipElement;
            while (qtipElement = this.elementArray.pop()) {
                qtipElement.destroy(true);
            }
        }
    });
});