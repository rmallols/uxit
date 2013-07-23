COMPONENTS.directive('editMediaList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/editMediaList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                uploadable      : true,
                deletable       : true
            };
        }]
    };
}]);