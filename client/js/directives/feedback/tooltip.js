(function () {
    'use strict';
    COMPONENTS.directive('title', ['$rootScope', '$compile', 'tooltipService',
    function ($rootScope, $compile, tooltipService) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                if(tAttrs.titleShowConfirm) {
                    tAttrs.keepTitleOnTooltipHover = 'true';
                }
                return function link(scope, element, attrs) {

                    var isDialog = false;

                    attrs.$observe('title', function (newVal) {
                        initialize(newVal);
                    });

                    scope.$watch(attrs.titleShowConfirm, function(newVal) {
                        if(newVal) {
                            var message = $compile($('<div>' + attrs.titleTextConfirm + '</div>'))(scope);
                            initialize(message);
                            tooltipService.show(element);
                            isDialog = true;
                        } else {
                            setTitle(attrs.title);
                            isDialog = false;
                        }
                    });

                    tooltipService.onClose(element, function() {
                        if(isDialog) {
                            scope[attrs.titleShowConfirm] = false;
                            scope.$apply();
                        }
                    });

                    $rootScope.$on('languageChanged', function () {
                        setTitle(attrs.title);
                    });

                    /** Private methods **/
                    function initialize(title) {
                        var options = {
                            mouseOnToPopup: attrs.keepTitleOnTooltipHover === 'true'
                        };
                        tooltipService.initialize(element, title, options);
                    }

                    function setTitle(newTitle) {
                        tooltipService.setTitle(newTitle, element);
                    }
                    /** End of private methods **/
                };

            }
        };
    }]);
})();
