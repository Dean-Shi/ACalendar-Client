/*
 *  Router
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/Calendar',
    'views/EventEditor',
    'collections/Events'
], function ($, _, Backbone, CalendarView, EventEditorView, Events) {
    return Backbone.Router.extend({
        routes: {
            // Default
            "*actions": "index",
            "editor": "editor"
        },

        initialize: function () {
        },

        index: function () {
            new CalendarView({collection: new Events()});
        },

        editor: function () {
            new EventEditorView();
        }
    });
});