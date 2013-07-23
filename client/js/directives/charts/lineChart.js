COMPONENTS.directive('lineChart', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		template: ' <div class="lineChart chart" ng-style="getChartSize()" ng-show="data.length > 0"></div>',
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
                        new Morris.Line({
                            // ID of the element in which to draw the chart.
                            element: element,
                            // Chart data records -- each entry in this array corresponds to a point on the chart.
                            data: scope.data,
                            // The name of the data record attribute that contains x-values.
                            xkey: 'create.date',
                            // A list of names of data record attributes that contain y-values.
                            ykeys: ['count'],
                            // Labels for the ykeys -- will be displayed when you hover over the chart.
                            labels: ['count'],
                            lineColors: ['#32b4e4']
                        });
                    }
                }
            }, true);

            scope.getChartSize = function() {
                return {
                    width   : elmWidth,
                    height  : elmWidth * 0.45
                };
            };
		}
	};
}]);
