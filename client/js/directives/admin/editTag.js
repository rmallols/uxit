COMPONENTS.directive('editTag', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editTag.html',
        scope: {
            tag         : '=model',
            onLayer : '='
        },
        link: function link(scope) {
            scope.onLayer.save = function (callback) {
                tagService.updateTag(scope.tag, function () {
                    callback();
                });
            };
        }
    };
}]);