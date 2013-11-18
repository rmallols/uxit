'use strict';
var getService  = require("./getService");

module.exports = {

    getStats : function (dbCon, collection, query, session, callback) {
        var key = {}, condition, initial, reduceFn, finalizeFn, command, options, callbackFn;
        if (query.groupBy) { key[query.groupBy] = 1; }
        else { key['create.date'] = 1; } //By default, group by creation date
        /*var keyf = function (doc) {
            var date = new Date(doc.create.date),
                dateKey = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + '';
            return {'day': dateKey};
        };*/
        condition   = query.cond;
        initial     = { count: 0 };
        reduceFn    = function (obj, prev) { prev.count += 1; };
        finalizeFn  = function (curr, result) { };
        command     = true;
        options     = {};
        callbackFn  = function(err, stats) {
            var processedItems = 0;
            if(stats.length > 0) {
                stats.forEach(function (stat) {
                    getService.setJoins(dbCon, stat, function() {
                        processedItems++;
                        if(processedItems === stats.length) {
                            callback(stats);
                        }
                    });
                });
            } else {
                callback(stats);
            }
        };
        dbCon.collection(collection).group( key, condition, initial, reduceFn, finalizeFn, command,
                                            options, callbackFn);
    }
};