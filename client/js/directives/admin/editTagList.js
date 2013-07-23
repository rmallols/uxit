COMPONENTS.directive('editTagList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/editTagList.html',
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