'use strict';
var cacheService    = require("../cacheService"),
    dbService       = require("../dbService");
module.exports = {
    getStats : function (collection, query, session, callback) {
        var key = {}; //Specify the grouping key
        if (query.groupBy) { key[query.groupBy] = 1; }
        else { key['create.date'] = 1; } //By default, group by creation date
        dbService.getDbConnection().collection(collection).group({
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
            stats.forEach(function (stat) {
                cacheService.setJoins(stat);
            });
            callback(stats);
        });
    }
};