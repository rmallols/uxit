(function() {
    COMPONENTS.directive('multipleFiles', [function () {
        'use strict';
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {

                attrs.$observe('multipleFiles', function(newVal) {
                    if(attrs.multipleFiles === 'true') {
                        element.attr('multiple', '');
                    } else {
                        element.removeAttr('multiple');
                    }
                })



            }
        };
    }]);
})();