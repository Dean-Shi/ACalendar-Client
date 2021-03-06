requirejs.config({
    paths: {
        jquery: [
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min',
            'vendor/jquery/jquery.min'
        ],
        jqueryui: 'libs/jquery-ui.custom.min',
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
        bootstrapselect: 'http://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.4.1/bootstrap-select.min',
        rrule : 'libs/rrule',
        daterangepicker: 'vendor/bootstrap-daterangepicker/daterangepicker',
        qtip: 'vendor/qtip2/jquery.qtip.min',
        icheck: 'vendor/jquery-icheck/jquery.icheck.min',
        bongo: 'vendor/bongo.js/dist/bongo.min',
        keymaster: 'libs/keymaster.min',
        shortcuts: 'libs/backbone.shortcuts.min',

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

        jqueryui: [ 'jquery' ],
        'fullCalendar': [ 'jquery' ],
        'bootstrap': [ 'jquery' ],
        'daterangepicker': [ 'jquery', 'moment' ],
        'datepicker': [ 'jquery' ],
        'icheck': [ 'jquery' ],
        'keymaster': {
            exports: 'key'
        },
        'bootstrapselect': [ 'jquery' ],
        'shortcuts': [ 'underscore', 'backbone', 'keymaster' ]
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

requirejs([
    'app'
], function (App) {
    App.init();
    App.setupPrint();
});