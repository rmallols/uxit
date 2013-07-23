COMPONENTS.directive('rating', ['crudService', 'constantsService', function (crudService, constantsService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            rating              : '=',
            targetId            : '=',
            targetCollection    : '@',
            starSize            : '@height'
        },
		templateUrl: '/client/html/input/rating.html',
		link: function link(scope) {

            scope.$watch('rating', function () {
                initRating();
            });

            scope.$watch('targetId', function () {
                initRating();
            });

            scope.hoverRate = function (rating) {
                scope.rateOnHover = rating;
            };

            scope.clearHoverRate = function () {
                scope.rateOnHover = 0;
            };

            scope.getStarStyleClass = function (rating, desc) {
                var hover = (rating <= scope.rateOnHover) ? 'hoverState' : '';
                return desc + '-rated ' + hover;
            };

            scope.rate = function (rating) {
                var data = {
                    rating      : rating,
                    target      : {
                        id          : scope.targetId,
                        collection  : scope.targetCollection
                    }
                };
                crudService.rate(constantsService.collections.ratings, data, function (avgRating) {
                    scope.rating = avgRating.avgRating;
                    normalizeRating();
                });
            };

            scope.getStarSize = function() {
                var defaultSize = 24;
                return {
                    width   : scope.starSize || defaultSize,
                    height  : scope.starSize || defaultSize
                };
            };

            function initRating() {
                scope.normalizedRating = [];
                scope.rateOnHover = 0;
                normalizeRating();
            }

            function normalizeRating() {
                var maxRate = 5, i;
                for (i = 0; i < maxRate; i += 1) {
                    scope.normalizedRating[i] = (scope.rating > i && scope.rating >= i + 1)
                        ? 'full'
                        : (scope.rating > i)
                        ? 'half'
                        : 'none';
                }
            }
		}
	};
}]);
