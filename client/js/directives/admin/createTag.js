(function() {
    'use strict';
    function createTag() {
        return {
            restrict: 'A',
            replace: false,
            templateUrl: 'editTag.html',
            scope: {
                tag: '=model'
            }
        };
    }
    var createTagArgs = [createTag];
    COMPONENTS.directive('createTag', createTagArgs);
    COMPONENTS.directive('createTags', createTagArgs);
})();