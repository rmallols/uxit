'use strict';
var getService  = require("./getService"),
    dbService   = require("../dbService");
module.exports = {

    getStats : function (dbCon, collection, query, session, callback) {
        var key = {}; //Specify the grouping key
        if (query.groupBy) { key[query.groupBy] = 1; }
        else { key['create.date'] = 1; } //By default, group by creation date
        dbCon.collection(collection).group({
            keyf: function (doc) {
                var date = new Date(doc.create.date),
                    dateKey = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + '';
                return {'day': dateKey};
            },
            //key: key,
            key: key,
            cond: query.cond,
            initial: {count: 0},
            reduce: function (obj, prev) { prev.count += 1; }
        }, function (err, stats) {
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
        });
    }
};