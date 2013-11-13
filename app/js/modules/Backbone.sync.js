define([
    'underscore',
    'backbone',
    'bongo'
], function (_, Backbone, bongo) {

    /**
     *  Initialize IndexedDB
     *
     *  @param {String} name The db name
     *  @param {Array} collections The schema/table name
     */
    bongo.db({
        name: "calendar",
        collections: ["local"]
    });

    /**
     *  Override Backbone.sync function
     *
     *  @method methodName
     *  @param {String} method: "create" - create a new event
     *                          "read"   - get a event or events
     *                          "update" - update a event or events
     *                          "delete" - delete a event or events
     *  @param {Object} model An event model
     *  @param {Object} options Additional options such as DB name and 
     *                          collection name
     *  @return {Object} Returns Event or events have been synchronized
     *
     *  TODO: add userid when send data to server
     *
     */
    Backbone.sync = function (method, model, options) {

        /**
         * Convert model to JSON
         */
        var event = model.toJSON();

        /**
         * Open indexedDB
         */
        var indexedDB = bongo.db("calendar").collection("local");

        /**
         *  Load events from the indexedDB.
         */
        var read = function () {
            // socket.emit(method, { event: event });
            var result = null;
            indexedDB.find({
                //id: 0
                // start: { $gte: event.start },
                // end:   { $lte: event.end }
            }).toArray(function (error, records) {
                // Success 
                if (!error) {
                    options.success(records);
                }
            });
        }; 

        /**
         *  Save a new model or an existing model to the server.
         */
        var createOrUpdate = function (method) {
            // socket.emit(method, { event: event });
            indexedDB.save(event, function (error, id) {
                // Success
                if (!error) {
                    console.log(method + " event in db: " + id);
                    options.success(event);
                }
            });
        };  

        /**
         *  Delete an event from the indexedDB and the server.
         */
        var destroy = function () {
            // socket.emit("delete", { eventID: event._id });
            indexedDB.remove(event._id.toString(), function (error) {
                // Success
                if (!error) {
                    console.log("delete event in db: " + event._id);
                }
            });
        };             

        // entry point for method
        switch (method) {
            case "create":
            case "update":
                createOrUpdate(method);
                break;
            case "read":
                read();
                break;
            case "delete":
                destroy();
        }
    };
});