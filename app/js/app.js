define([
    'jquery',
    'backbone',
    'routers/router',
], function ($, Backbone, Router) {
    return {
        init: function () {
            new Router;
            Backbone.history.start();
        },
        setupPrint: function () {
            var calendar = $("#calendar");
            var miniCal = $("#mini-calendar").parent();
            var w = calendar.css("width");

            var beforePrint = function() {
                // Prepare calendar for printing
                miniCal.hide();
                calendar.css("width", "1010");
                calendar.fullCalendar("render");
            };
            var afterPrint = function() {
                // Reverse the width of calendar
                miniCal.show();
                calendar.css("width", w);
                calendar.fullCalendar("render");
            };
            if (window.matchMedia) {
                var mediaQueryList = window.matchMedia("print");
                mediaQueryList.addListener(function(mql) {
                    if (mql.matches) {
                        beforePrint();
                    } else {
                        afterPrint();
                    }
                });
            }
            window.onbeforeprint = beforePrint;
            window.onafterprint = afterPrint;
        }
    };
});