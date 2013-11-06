COMPONENTS.directive('date', [function () {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        //template: '<input type="text" ui-date="dateOptions" ui-date-format="mm-dd-yy" />',
        template: '<div ui-date="dateOptions" ui-date-format="mm-dd-yy" ></div>',
        controller: ['$scope', function($scope) {
            $scope.dateOptions = {
                dateFormat: 'dd-mm-yy',
                changeYear: true
            };
        }]
	};
}]);
