'use strict';
var createService   = require("./createService"),
    countService    = require("./countService"),
    getService      = require("./getService"),
    updateService   = require("./updateService"),
    dbService       = require("../dbService");

module.exports = {
    rate : function (collection, body, session, callback) {
        var query = {
            q: { $and: [{ targetId: body.target.id }, { 'create.authorId': session.user._id }]}
        };
        //Only one rate by user and target will be allowed. If it exists -> update it. Otherwise -> Create it
        getService.getFirst(collection, query, function (document) {
            var data = {rating: body.rating, targetId: body.target.id};
            if (document) {
                updateService.update(collection, document._id, data, session, function () { updateAvgRating(document.rating); });
            } else {
                createService.create(dbService.getDbConnection(), collection, data, session, function () { updateAvgRating(null); });
            }
        });

        function updateAvgRating(previousUserRating) {
            var avgRating, filter;
            getService.get(body.target.collection, body.target.id, {}, function (document) {
                filter = { targetId : body.target.id};
                countService.count(collection, filter, function (numberOfRatings) {
                    avgRating = getNewAvgRating(document.avgRating, previousUserRating, numberOfRatings);
                    updateService.update(body.target.collection, body.target.id, { avgRating: avgRating.toFixed(2) }, session,
                        function () {
                            callback({ avgRating: avgRating });
                        }
                    );
                });
            });
        }

        function getNewAvgRating(oldAvgRating, previousUserRating, numberOfRatings) {
            var avgRating, numberOfPreviousRatings;
            numberOfPreviousRatings = numberOfRatings - 1;
            //If it's the firs rating, just the the current rate as the average
            avgRating = (oldAvgRating) ? parseFloat(oldAvgRating) : body.rating;
            //If the user already entered a rating, it's necessary to drop it from the average
            if (previousUserRating && numberOfPreviousRatings > 0) {
                avgRating = (avgRating * numberOfRatings - previousUserRating) / numberOfPreviousRatings;
            }
            //At this point, the average is up to date excepting the new rate. So let's add it to get the new average
            avgRating = (avgRating * numberOfPreviousRatings + body.rating) / (numberOfPreviousRatings + 1);
            return avgRating;
        }
    }
};