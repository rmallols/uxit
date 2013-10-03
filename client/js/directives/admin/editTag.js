COMPONENTS.directive('editTag', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editTag.html',
        scope: {
            tag         : '=model',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.onLayerSave = function (callback) {
                tagService.updateTag(scope.tag, function () {
                    callback();
                });
            };
        }
    };
}]);