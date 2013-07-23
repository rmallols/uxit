COMPONENTS.directive('pieChart', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		template: ' <div class="pieChart chart" ng-style="getChartSize()" ng-show="data.length > 0"></div>',
        scope: {
            data : '='
        },
		link: function link(scope, element) {

            var elmWidth = element.width();

            scope.$watch('data', function (newVal, oldVal) {
                if (sessionService.isUserLogged() && newVal && newVal !== oldVal) {
                    element.html('');
                    if (scope.data.length > 0) {
                        //noinspection JSHint
                        new Morris.Donut({
                            element: element,
                            data: scope.data
                        });
                    }
                }
            }, true);

            scope.getChartSize = function() {
                var boxSize     = elmWidth * 0.6,
                    marginLeft  = (elmWidth - boxSize) / 2;
                return {
                    width       : boxSize,
                    height      : boxSize,
                    marginLeft  : marginLeft
                };
            };
		}
	};
}]);
