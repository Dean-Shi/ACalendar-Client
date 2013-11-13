/**
 *  Event Collection
 */
define([
    'backbone',
    'models/Event'
], function (Backbone, Event) {
    return Backbone.Collection.extend({
        model: Event,
        url: 'event'
    }); 
});