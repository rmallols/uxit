(function() {
    'use strict';
    COMPONENTS.directive('uxTransclude', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                template: '=uxTransclude'
            },
            link: function link(scope, element) {
                var newContent = $(scope.template);
                element.html(newContent);
                $compile(newContent)(scope.$parent);
            }
        };
    }]);
})();