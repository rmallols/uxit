(function() {
    'use strict';
    COMPONENTS.directive('uxTransclude', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                template: '=uxTransclude'
            },
            link: function link(scope, element) {

                scope.$watch('template', function(newVal) {
                    if(newVal) {
                        var newContent = $(newVal);
                        element.html(newContent);
                        $compile(newContent)(scope.$parent);
                    }
                });
            }
        };
    }]);
})();