define([
    'jquery',
    'underscore',
    'backbone',
    'rrule',
    'views/EventEditor',
    'models/Event',
    'collections/Events',
    'moment',

    /* Modules*/
    'modules/Backbone.sync',

    /* Plugins */
    'fullCalendar',
    'bootstrap',
    'jqueryui',
    'qtip',
    'datepicker',
    'shortcuts'
], function ($, _, Backbone, RRule, EventEditorView, Event, Events, moment) {
    "use strict";

    var summaryToString = function (rrule) {
        var summaryText = "";
        var intervalLabel = ["years", "months", "weeks", "days"];
        var frequency = ["Annually", "Monthly", "Weekly", "Daily"];
        var WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // In the summary, the interval will be displayed first
        if (rrule.interval === 1) {
            summaryText += frequency[rrule.freq];
        } else {
            summaryText += "Every " + rrule.interval + " " + intervalLabel[rrule.freq];
        }

        // Print the format for each frequence
        if (RRule.WEEKLY === rrule.freq) {
            summaryText += " on ";
            if (rrule.byweekday.length === WEEKDAY.length) {
                summaryText += "all days";
            } else if (rrule.byweekday.length === 0) {
                summaryText += "[Missing days]";
            } else {
                var l = rrule.byweekday.length - 1;
                for (var i = 0; i < l; i++) {
                    var index = rrule.byweekday[i];
                    summaryText += WEEKDAY[index] + ", ";
                }
                var index = rrule.byweekday[l];
                summaryText += WEEKDAY[index];
            }
        } else if (RRule.MONTHLY === rrule.freq) {
            summaryText += " on day ";
            var onDay = rrule.dtstart;
            summaryText += onDay.getDate();
        } else if (RRule.YEARLY === rrule.freq) {
            summaryText += " on ";
            var onDay = rrule.dtstart;
            summaryText += MONTH[onDay.getMonth()] + " " + onDay.getDate();
        }

        if (rrule.count) { // rrule has count
            if (rrule.count === 1) {
                summaryText = "Once";
            } else {
                summaryText += ", " + rrule.count + " times";
            }
        } else if (rrule.until) { // rrule has until
            summaryText += ", until " + new Date(rrule.until).toDateString();
        }
        return summaryText;
    };

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
            if (!_.isUndefined(this.event.rrule) && !_.isNull(this.event.rrule)) {
                this.event.summaryToString = summaryToString(this.event.rrule);
            }
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
        shortcuts: {
            "w": "weekView",
            "d": "dayView",
            "m": "monthView",
            "t": "today",
            "up": "scrollUp",
            "down": "scrollDown",
            "right": "nextPage",
            "left": "prePage"
        },
        initialize: function(){
            _.bindAll(this, "select", 
                            "unselect",
                            "loading",
                            "eventRender",
                            "eventDragStart",
                            "eventResizeStart",
                            "eventDrop",
                            "eventResize",
                            "eventClick",
                            "viewDisplay"
                            );

            this.eventResizing = false;
            this.elementArray = {};
            this.tooltip = new Tooltip();
            this.eventEditorView = new EventEditorView();
            _.extend(this, new Backbone.Shortcuts);
            this.delegateShortcuts();

            this.render();
        },
        render: function() {
            var _this = this;

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
                height: $(window).height() - 10,
                timeFormat: "h:mmtt{ - h:mmtt}",
                editable: true,
                selectable: true,
                selectHelper: true,
                select: this.select,
                slotMinutes: 30,
                unselect: this.unselect,
                unselectCancel: ".qtip",
                loading: this.loading,
                eventResizeStart: this.eventResizeStart,
                eventDragStart: this.eventDragStart, 
                eventClick: this.eventClick,
                eventDrop: this.eventDrop,
                eventResize: this.eventResize,
                eventRender: this.eventRender,
                eventAfterAllRender: this.eventAfterAllRender,
                viewDisplay: this.viewDisplay
            });
            
            this.tooltip.collection = this.eventEditorView.collection = this.collection;
            this.tooltip.calendarView = this.eventEditorView.calendarView = this;
            this.tooltip.eventEditorView = this.eventEditorView;

            $("#mini-calendar").datepicker({
                autoclose: true,
            }).on("changeDate", function (e) {
                _this.$el.fullCalendar("gotoDate", e.date);
                _this.$el.fullCalendar("changeView", "agendaDay");
            });

            this.resizeCalendar();
            this.agendaTable = $("table.fc-agenda-slots:visible").parent().parent();

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
                _this.resizeCalendar();
                _this.$el.fullCalendar("rerenderEvents");
            });
        },
        weekView: function () {
            this.$el.fullCalendar("changeView", "agendaWeek");
            this.hideQtip();
        },

        dayView: function () {
            this.$el.fullCalendar("changeView", "agendaDay");
            this.hideQtip();
        },

        monthView: function () {
            this.$el.fullCalendar("changeView", "month");
            this.hideQtip();
        },

        today: function () {
            this.$el.fullCalendar("today");
        },

        scrollUp: function () {
            var agendaTable = $("table.fc-agenda-slots:visible").parent().parent();
            agendaTable.scrollTop(agendaTable.scrollTop() - 42);
        },

        scrollDown: function () {
            var agendaTable = $("table.fc-agenda-slots:visible").parent().parent();
            agendaTable.scrollTop(agendaTable.scrollTop() + 42);
        },

        nextPage: function () {
            this.$el.fullCalendar("next");
        },

        prePage: function () {
            this.$el.fullCalendar("prev");
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
            this.$el.fullCalendar("option", "height", $(window).height() - 10);
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
                acalEvent.save({start: event.start, end: event.end, allDay: event.allDay, rrule: rrule});
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
        viewDisplay: function () {
            if (!_.isUndefined(this.timelineInterval)) {
                window.clearInterval(this.timelineInterval);
            }
            var calendar = this.$el;
            this.timelineInterval = window.setInterval(setTimeline, 1000);
            try {
                setTimeline(this.$el);
            } catch (err) { }

            function setTimeline () {
                var curTime = new Date();
                if(curTime.getHours() == 0 && curTime.getMinutes() <= 5) // Because I am calling this function every 5 minutes
                {// the day has changed
                    var todayElem = $(".fc-today");
                    todayElem.removeClass("fc-today");
                    todayElem.removeClass("fc-state-highlight");
                    
                    todayElem.next().addClass("fc-today");
                    todayElem.next().addClass("fc-state-highlight");
                }
                
                var parentDiv = $(".fc-agenda-slots:visible").parent();
                var timeline = parentDiv.children(".timeline");
                var currentHours   = curTime.getHours();
                var timeDisplay = moment().format("h:mm:ss a");
                var timelineText = '<span style="position:absolute;' + (currentHours > 12 && "margin-top:-23px") + '">' + timeDisplay + '</span>';
                if (timeline.length == 0) { //if timeline isn't there, add it
                    timeline = $("<div>").addClass("timeline").html(timelineText);
                    parentDiv.prepend(timeline);
                }

                var curCalView = calendar.fullCalendar("getView");
                if (curCalView.visStart < curTime && curCalView.visEnd > curTime) {
                    timeline.show();
                } else {
                    timeline.hide();
                }
            
                var curSeconds = (curTime.getHours() * 60 * 60) + (curTime.getMinutes() * 60) + curTime.getSeconds();
                var percentOfDay = curSeconds / 86400; //24 * 60 * 60 = 86400, # of seconds in a day
                var topLoc = Math.floor(parentDiv.height() * percentOfDay);
            
                timeline.css({"top" : topLoc + "px", "padding-bottom" : "10px"}).html(timelineText);

                if (curCalView.name == "agendaWeek") { //week view, don't want the timeline to go the whole way across
                    var dayCol = $(".fc-today:visible");
                    if(dayCol.position() != null)
                    {
                        var left = dayCol.position().left + 1;
                        var width = dayCol.width();
                        timeline.css({
                            left: left + "px",
                            width: width + "px"
                        });
                    }
                }
            }
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
            var _this = this;

            // it will not be fired
            element.on("dblclick", function() {
                _this.hideView();
                _this.eventEditorView.model = _this.collection.get(event._id);
                _this.eventEditorView.render();
            });

            var format = this.getPopoverFormat(event.start, event.end, event.allDay);
            var content = '<h3>' + event.title + '</h3>' + '<p><b>Date:</b> ' + format.startTime + (event.end && format.endTime || "") + '</p>';

            var qtipID = event._id + (event.rrule ? "-" + event.start.getTime() : "");

            if (!_.isUndefined(this.elementArray[qtipID])) {
                 this.elementArray[qtipID].destroy(true);
            }
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
        showAdvanceEditor: function (eventID) {
            this.hideView();
            this.eventEditorView.model = _this.collection.get(eventID);
            this.eventEditorView.render();
        },
        eventAfterAllRender: function () {
        },
        hideTooltip: function () {
            this.tooltip.hide();
        },
        hideQtip: function (event) {
            //var selector = "#qtip-" + event._id + (event.rrule ? "-" + event.start.getTime() : "");
            //$(selector).qtip().hide();
            for (var qtipID in this.elementArray) {
                this.elementArray[qtipID].hide();
            }
        }
    });
});