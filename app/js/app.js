define([
    'backbone',
    'routers/router',
], function (Backbone, Router) {
    return {
        init: function () {
            new Router;
            Backbone.history.start();
        },
        setupPrint: function () {
        	var calendar = $("#calendar");
	        var w = calendar.css("width");

            var beforePrint = function() {
                // prepare calendar for printing
                calendar.css("width", "999");
                calendar.fullCalendar("render");
            };
            var afterPrint = function() {
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