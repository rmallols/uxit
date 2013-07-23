(function () {
    'use strict';
    COMPONENTS.directive('resizableApp', ['resizableAppService', function (resizableAppService) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element, attrs) {

                function instantiateResizableApp() {
                    element.resizable({
                        handles: 'e, w',
                        start: function (event) {
                            resizableAppService.start($(this), event);
                        },
                        resize: function () {
                            resizableAppService.resize($(this));
                        }
                    });
                }

                attrs.$observe('resizableApp', function (newVal) {
                    if (newVal === 'true') { //Block the resize capability if the user doesn't have permissions enough
                        instantiateResizableApp();
                    }
                });
            }
        };
    }]);
})();