requirejs.config({
    paths: {
        jquery: [
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min',
            'vendor/jquery/jquery.min'
        ],
        jqueryui: [
            'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min',
            'libs/jquery/jquery-ui.custom.min'
        ],
        underscore: [
            'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
            'vendor/underscore/underscore-min'
        ],
        backbone: [
            'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
            'vendor/backbone/backbone-min'
        ],
        bootstrap: [
            'http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.0/js/bootstrap.min',
            'vendor/bootstrap/dist/js/bootstrap.min'
        ],
        fullCalendar: [
            'http://cdnjs.cloudflare.com/ajax/libs/fullcalendar/1.6.4/fullcalendar.min',
            'vendor/fullcalendar/fullCalendar.min'
        ],
        moment: [
            'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.1.0/moment.min',
            'vendor/momentjs/min/moment.min'
        ],
        datepicker: [
            'http://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.2.0/js/bootstrap-datepicker.min',
            'vendor/bootstrap-datepicker/js/bootstrap-datepicker'
        ],
        rrule : 'libs/rrule',
        daterangepicker: 'vendor/bootstrap-daterangepicker/daterangepicker',
        qtip: 'vendor/qtip2/jquery.qtip.min',
        icheck: 'vendor/jquery-icheck/jquery.icheck.min',
        bongo: 'vendor/bongo.js/dist/bongo.min',
        keymaster: 'libs/keymaster.min',

        templates: '../templates'
    },

    shim: {
        underscore: {
            exports: '_'
        },

        backbone: {
            deps: [ 'underscore', 'jquery' ],
            exports: 'Backbone'
        },
        'fullCalendar': [ 'jquery' ],
        'bootstrap': [ 'jquery' ],
        'daterangepicker': [ 'jquery', 'moment' ],
        'datepicker': [ 'jquery' ],
        'icheck': [ 'jquery' ],
        'keymaster': {
            exports: 'key'
        }
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

requirejs([
    'app'
], function (App) {
    App.init();
    App.setupPrint();
});