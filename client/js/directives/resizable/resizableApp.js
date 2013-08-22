(function () {
    'use strict';
    COMPONENTS.directive('resizableApp', ['resizableAppService', function (resizableAppService) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element, attrs) {

                var hasBeenInitialized = false;

                attrs.$observe('resizableApp', function (newVal) {
                    if (newVal === 'true') { //Block the resize capability if the user doesn't have permissions enough
                        hasBeenInitialized = true;
                        enableResizableApp();
                    } else if(hasBeenInitialized) {
                        disableResizableApp();
                    }
                });

                /** Private methods **/
                function enableResizableApp() {
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

                function disableResizableApp() {
                    element.resizable('destroy');
                }
                /** End of private methods **/
            }
        };
    }]);
})();