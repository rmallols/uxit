COMPONENTS.directive('editUserList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editUserList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                uploadable      : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);