(function () {
    'use strict';
    COMPONENTS.factory('rateService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         *
         *
         * @param rating
         * @param targetId
         * @param targetCollection
         * @param callback
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
