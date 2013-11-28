define([
    'jquery',
    'underscore',
    'backbone',
    'moment',
    'rrule',

    /* Plugins */
    'bootstrap',
    'daterangepicker',
    'datepicker',
    'icheck',
    'shortcuts'
], function ($, _, Backbone, moment, RRule) {

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


    var RepeatDialog = Backbone.View.extend({
        el: "#dialog",
        initialize: function (attrs) {
            var _this       = this;

            this.editorPanel = attrs.editorPanel;
            this.rrule       = attrs.rrule;
            this.dtstart     = attrs.dtstart;

            this.isNewRepeat = _.isNull(this.rrule);

            if (this.isNewRepeat) {
                // Initialize rrule
                this.rrule = {
                    freq: RRule.WEEKLY,
                    interval: 1,
                    byweekday: [],
                    dtstart: this.dtstart
                };

                // Add the day of the start day to by week day
                this.rrule.byweekday.push(this.rrule.dtstart.getDay());
            }

            this.$el.modal({
                backdrop: false
            });
        },

        render: function (options, callback) {
            if (!_.isUndefined(options)) {
                this.rrule = options.rrule || this.rrule;
                this.rrule.dtstart = options.dtstart || this.rrule.dtstart;
            }
            this.renderPanel();
            this.registerRepeatFreq();
            this.registerRepeatInterval();
            this.registerRepeatOn();
            this.registerRepeatEnd();
            this.registerButtons();

            this.showSummaryOnDialog();

            if (!_.isUndefined(callback) && _.isFunction(callback)) {
                callback();
            }
        },

        showSummaryOnDialog: function () {
            var text = summaryToString(this.rrule);
            this.$("#repeat-summary").html(text);
        },

        renderPanel: function () {
            var template = _.template($("#repeatDialogTemplate").html(), {
                rrule: this.rrule,
                isNewRepeat: this.isNewRepeat
            });
            this.$(".modal-content").html(template);
        },

        registerRepeatFreq: function () {
            var _this = this;

            // When frequency is changed, its value will be retrieved, and the
            // panel will be rendered to update current rrule info. 
            // 
            // Since the panel is rendered, all elements on this panel will be
            // recreated. So all listener need to be render/register again. 
            _this.$("#repeat-frequency").on("change", function () {
                _this.rrule.freq = parseInt($(this).val());
                _this.render();
            });
        },

        registerRepeatInterval: function () {
            var _this = this;

            // When interval is changed, its value will be retrieved, and the 
            // summary of the recurring event will be updated.
            _this.$("#repeat-interval").on("change", function () {
                _this.rrule.interval = parseInt($(this).val());
                _this.showSummaryOnDialog();
            });
        },

        registerRepeatOn: function () {
            var _this = this;

            this.$("#repeat-on button").on("click", function () {
                // Toggle the button
                $(this).toggleClass("active");

                // Convert from string to int
                var index = parseInt(this.getAttribute("data-index"));

                if ($(this).hasClass("active")) {
                    _this.rrule.byweekday.push(index);
                    _this.rrule.byweekday.sort();
                } else { // not checked
                    console.log(index + ": " + _this.rrule.byweekday.toString());
                    _this.rrule.byweekday = _.without(_this.rrule.byweekday, index);
                    console.log(_.without(_this.rrule.byweekday, index));

                }
                _this.showSummaryOnDialog();
            });
        },

        registerRepeatEnd: function () {
            var _this = this,
                endsNever = this.$("#repeat-ends-never"),
                endsCount = this.$("#repeat-ends-count"),
                endsCountInput = this.$("#repeat-ends-count_input"),
                endsUntil = this.$("#repeat-ends-until"),
                endsUntilInput = this.$("#repeat-ends-until_input");

            $(".modal .repeat-ends-option input").iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
                increaseArea: '20%' // optional
            });

            endsNever.on("ifChecked", function (event) {
                endsCountInput.attr("disabled", "disabled");
                endsUntilInput.attr("disabled", "disabled");
                _this.rrule["until"] = null;
                _this.rrule["count"] = null;
                _this.showSummaryOnDialog();
            });

            endsCount.on("ifChecked", function (event) {
                endsCountInput.removeAttr("disabled");
                endsUntilInput.attr("disabled", "disabled");
                _this.rrule["until"] = null;
                _this.rrule["count"] = parseInt(endsCountInput.val());
                _this.showSummaryOnDialog();
            });

            endsUntil.on("ifChecked", function (event) {
                endsUntilInput.removeAttr("disabled");
                endsCountInput.attr("disabled", "disabled");
                _this.rrule["until"] = new Date(endsUntilInput.val());
                _this.rrule["count"] = null;
                _this.showSummaryOnDialog();
            });

            endsUntilInput.datepicker({
                autoclose: true,
                startDate: _this.rrule.dtstart || _this.acalEvent.start
            }).on("changeDate", function (e) {
                _this.rrule.until = e.date;
                _this.showSummaryOnDialog();
            }).on("hide", function () {
                hidingDatepicker = true;
            });

            endsCountInput.on("change", function () {
                var count = parseInt(endsCountInput.val());

                if (count <= 0) {
                    count = 1;
                    endsCountInput.val(count);
                }

                _this.rrule["count"] = count;
                _this.showSummaryOnDialog();
            });
        },

        registerButtons: function () {
            var _this       = this,
                repeatDone  = this.$("#repeat-done"),
                repeatClose = this.$("#repeat-close"),
                isSetRepeat = !_.isNull(this.rrule);

            // Using Underscore feature that only set the variable isSetRepeat
            // to ture once
            var toSetRepeat = _.once(function () {
                isSetRepeat = true;
            });

            // Done button listener
            repeatDone.on("click", function () {
                if (RRule.WEEKLY === _this.rrule.freq && 0 === _this.rrule.byweekday.length) {
                    alert("Cannot add this repeating event without setting any by day.");
                    return;
                }

                // This method will only be called once
                toSetRepeat();

                // Trigger rrule update
                _this.editorPanel.trigger("rruleUpdate", _this.rrule);

                // Hide the dialog
                _this.$el.modal("hide");
            });

            // Close button listener
            repeatClose.on("click", function () {
                // Uncheck if the repeat is not set
                console.log(isSetRepeat);
                if (_this.isNewRepeat || !isSetRepeat) {
                    _this.editorPanel.trigger("cancelRepeat");
                }
            });
        }
    });

    return Backbone.View.extend({
        el: "#editor-panel",
        events: {
            "click #event-save": "save",
            "click #event-return": "close",
            "click #event-delete": "delete"
        },
        shortcuts: {
            "shift+enter": "save",
            "esc": "close"
        },
        initialize: function () {
            _.extend(this, new Backbone.Shortcuts);
            this.delegateShortcuts();
        },
        render: function () {
            // Show the view panel
            this.$el.show();

            // Using this.acalEvent instead of using this.model is to improve
            // the code more readable
            this.acalEvent   = this.model;
            this.rrule       = this.acalEvent.get("rrule");
            this.dtstart     = this.acalEvent.get("start");
            this.isNewRepeat = _.isNull(this.rrule);
            this.renderEditorTemplate(this.acalEvent);

            var _this = this,
                repeatDialogPanel = _this.$("#repeat-dialog"),
                hidingDatepicker = false;

            _this.registerDaterangepicker();
            _this.registerRepeatDialog();
            _this.registerCheckbox();
        },

        renderEditorTemplate: function (acalEvent) {
            // Get start
            var startTime = acalEvent.get("start").toString(),
                endTime = acalEvent.get("end") ? acalEvent.get("end").toString() : startTime;

            var dateTimeRange = moment(startTime).format("YYYY/MM/DD h:mm A") + " - " +
                moment(endTime).format("YYYY/MM/DD h:mm A");

            var dateRange = moment(startTime).format("YYYY/MM/DD") + " - " +
                moment(endTime).format("YYYY/MM/DD");

            var template = _.template($("#eventEditorTemplate").html(), {
                event: acalEvent.toJSON(),
                dateTimeRange: dateTimeRange,
                dateRange: dateRange
            });
            this.$el.html(template);
        },

        registerDaterangepicker: function () {
            var _this = this,

                // Input field of date range select
                dateTimeRangeInput = _this.$("#date-time-range"),
                dateRangeInput = _this.$("#date-range");

            dateTimeRangeInput.daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                format: "YYYY/MM/DD h:mm A"
            }, function (start, end) {
                dateRangeInput.val(start.format("YYYY/MM/DD") + " - " + end.format("YYYY/MM/DD"));
                setEventTime(start, end);
            });

            dateRangeInput.daterangepicker({
                format: "YYYY/MM/DD"
            }, function (start, end) {
                dateTimeRangeInput.val(start.format("YYYY/MM/DD h:mm A") + " - " + end.format("YYYY/MM/DD h:mm A"));
                setEventTime(start, end);
            });

            function setEventTime(start, end) {
                _this.acalEvent.set("start", new Date(start));
                _this.acalEvent.set("end", new Date(end));
            }
        },

        registerCheckbox: function () {
            var _this         = this,
                rrule         = this.acalEvent.get("rrule"),
                isSetRepeat   = !_.isNull(rrule),
                repeatSumArea = this.$("#event-repeat-summary-area"),
                repeatEdit    = this.$("#event-repeat-edit"),

                // input field of date range select
                dateTimeRangeInput = _this.$("#date-time-range"),
                dateRangeInput     = _this.$("#date-range"),

                // checkbox for all day and repeat
                allDayCheckbox = this.$("#check-allday"),
                repeatCheckbox = this.$("#check-repeat");

            registerICheck(allDayCheckbox);
            registerICheck(repeatCheckbox);

            function registerICheck(element) {
                var self = element,
                    label = self.next(),
                    label_text = label.text();

                label.remove();
                self.iCheck({
                    checkboxClass: "icheckbox_line-blue",
                    radioClass: "iradio_line-blue",
                    insert: "<div class=\"icheck_line-icon\"></div>" + label_text
                });
            };

            var registerRepeatEditBtn = _.once(function () {
                repeatEdit.on("click", function () {
                    if (!_this.isNewRepeat) {
                        _this.repeatDialog.render({dtstart: _this.acalEvent.get("start")});
                    }
                    _this.repeatDialog.$el.modal("show");
                    console.log(_this.rrule);
                });
            });

            // Using Underscore feature that only set the variable isSetRepeat
            // to ture once
            var toSetRepeat = _.once(function () {
                isSetRepeat = true;
            });

            allDayCheckbox.on("ifToggled", function () {
                dateRangeInput.toggle();
                dateTimeRangeInput.toggle();
                _this.acalEvent.set("allDay", !_this.acalEvent.get("allDay"));
            });

            repeatCheckbox.on("ifChecked", function (event) {
                if (!isSetRepeat) {
                    if (_this.isNewRepeat) {
                        _this.repeatDialog.render({dtstart: _this.acalEvent.get("start")});
                    }
                    _this.repeatDialog.$el.modal("show");
                } else {
                    repeatSumArea.show();
                }
                _this.rrule = rrule;
            });

            repeatCheckbox.on("ifUnchecked", function (event) {
                repeatSumArea.hide();
                _this.rrule = null;
            });

            if (isSetRepeat) {
                this.showSummaryOnPanel(rrule);
                repeatCheckbox.iCheck("check");
                registerRepeatEditBtn();
            }

            // listeners for 'rruleUpdate' and 'cancelRepeat' status
            // The callback function will be called when any status
            // is triggered
            this.listenTo(this, "rruleUpdate", function (newRRule) {
                toSetRepeat();

                console.log(isSetRepeat);
                _this.rrule = rrule = newRRule;
                _this.showSummaryOnPanel(rrule);
                repeatSumArea.show();
                registerRepeatEditBtn();
            });

            this.listenTo(this, "cancelRepeat", function () {
                repeatCheckbox.iCheck("uncheck");
            });
        },

        registerRepeatDialog: function () {

            /**
             * Initialize RepeatDialog
             * @type {Object}
             */
            this.repeatDialog = new RepeatDialog({
                editorPanel: this,
                rrule: this.rrule,
                dtstart: this.dtstart
            });
        },

        showSummaryOnPanel: function (rrule) {
            var text = summaryToString(rrule);
            this.$("#event-repeat-summary-text").html(text);
        },

        generateId: function () {
            return new Date().getTime().toString();
        },

        isBlank: function (str) {
            return /^\s*$/.test(str);
        },

        close: function () {
            $("#main-panel").show();
            this.calendarView.trigger("show");
            this.$el.hide();
            $(".daterangepicker").remove();
            $(".modal-body table").children().remove();
        },
        
        save: function () {
            var title = this.$("#event-title-input").val(),
                location = this.$("#event-location-input").val(),
                description = this.$("#event-description-input").val();

            if (title === "" && !confirm("Are you sure you want to save this event without title?")) {
                return;
            }

            if (!_.isNull(this.rrule)) {
                this.rrule.dtstart = this.acalEvent.get("start");
            }

            this.acalEvent.set({
                "title": title || "Untitled Event",
                "allDay": this.acalEvent.get("allDay"),
                "start": this.acalEvent.get("start"),
                "end": this.acalEvent.get("end"),
                "rrule": this.rrule,
                "last_modified": new Date(),
                "location": this.isBlank(location) ? null : location,
                "description": this.isBlank(description) ? null : description
            });

            if (this.acalEvent.isNew()) {
                this.acalEvent.set({
                    "_id": this.generateId()
                });
                this.collection.create(this.acalEvent, {
                    success: this.close()
                });
            } else {
                this.acalEvent.save({}, {
                    success: this.close()
                });
                this.collection.trigger("update", this.acalEvent);
            }
        },
        delete: function () {
            confirm("Are you sure you want to delete this event?") && this.acalEvent.destroy({
                success: this.close()
            });
        }
    });

});