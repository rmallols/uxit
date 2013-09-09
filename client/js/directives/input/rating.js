COMPONENTS.directive('rating', ['rateService', 'sessionService', function (rateService, sessionService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            rating              : '=',
            targetId            : '=',
            targetAuthorId      : '=',
            targetCollection    : '@',
            starSize            : '@height'
        },
		templateUrl: '/client/html/input/rating.html',
		link: function link(scope) {

            var ratingAllowed;

            scope.$watch('rating', function () {
                initRating();
            });

            scope.$watch('targetId', function () {
                initRating();
            });

            scope.$watch('targetAuthorId', function () {
                setRatingAllowed();
            });

            scope.hoverRate = function (rating) {
                if(ratingAllowed) {
                    scope.rateOnHover = rating;
                }
            };

            scope.clearHoverRate = function () {
                scope.rateOnHover = 0;
            };

            scope.getStarStyleClass = function (rating, desc) {
                var hover = (rating <= scope.rateOnHover) ? 'hoverState' : '';
                return desc + '-rated ' + hover;
            };

            scope.rate = function (rating) {
                if(ratingAllowed) {
                    rateService.rate(rating, scope.targetId, scope.targetCollection, function (avgRating) {
                        scope.rating = avgRating.avgRating;
                        normalizeRating();
                    });
                }
            };

            scope.getStarSize = function() {
                var defaultSize = 24;
                return {
                    width   : scope.starSize || defaultSize,
                    height  : scope.starSize || defaultSize
                };
            };

            /** Private methods **/
            function isRatingAllowed() {
                var isUserLogged = sessionService.isUserLogged(),
                    isSessionUserTargetUser = isUserLogged && scope.targetAuthorId === sessionService.getUserSession()._id;
                return isUserLogged && (!scope.targetAuthorId || !isSessionUserTargetUser);
            }

            function setRatingAllowed() {
                ratingAllowed = isRatingAllowed()
            }

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
            /** End of private methods **/
		}
	};
}]);
