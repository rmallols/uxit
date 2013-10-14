COMPONENTS.directive('editContent', ['contentService', 'tagService', function (contentService, tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editContent.html',
        scope: {
            content     : '=model',
            onLayer : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.onLayer.save = function (callback) {
                contentService.updateContent(scope.content, function () {
                    callback();
                });
            };
        }
    };
}]);