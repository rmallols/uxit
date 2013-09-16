COMPONENTS.directive('createContent', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'editContent.html',
        scope : {
            content : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
        }
    };
}]);