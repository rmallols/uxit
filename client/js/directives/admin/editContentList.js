COMPONENTS.directive('editContentList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editContentList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);