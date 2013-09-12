(function() {
    COMPONENTS.directive('selectMedia', [function () {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/client/html/contentEditable/selectMedia.html',
            scope: {
                model       : '=',
                onChange    : '='
            },
            link: function link(scope) {
                console.log("SSELECT MEDIA!")
            }
        };
    }]);
})();