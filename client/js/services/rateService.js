(function () {
    'use strict';
    COMPONENTS.factory('rateService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         * Rates a given item
         *
         * @param {string}      rating              The rating's value
         * @param {string}      targetId            The Id of the item that is going to be rated
         * @param {string}      targetCollection    The collection where the item to be rated is stored
         * @param {function}    callback            The function to execute once the rating has been fully done
         */
        function rate(rating, targetId, targetCollection, callback) {
            var data = {
                rating      : rating,
                target      : {
                    id          : targetId,
                    collection  : targetCollection
                }
            };
            crudService.rate(constantsService.collections.ratings, data, function (avgRating) {
                if(callback) { callback(avgRating); }
            });
        }

        return {
            rate : rate
        };
    }]);
})();
