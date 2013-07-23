COMPONENTS.directive('editContent', ['contentService', 'tagService', function (contentService, tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/editContent.html',
        scope: {
            content     : '=model',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.onLayerSave = function (callback) {
                contentService.updateContent(scope.content, function () {
                    callback();
                });
            };
        }
    };
}]);