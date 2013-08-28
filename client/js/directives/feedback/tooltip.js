(function () {
    'use strict';
    COMPONENTS.directive('title', ['$rootScope', '$compile', 'tooltipService',
    function ($rootScope, $compile, tooltipService) {
        return {
            restrict: 'A',
            priority: -1,
            compile: function (tElement, tAttrs) {
                //noinspection JSUnresolvedVariable
                if(tAttrs.titleClick) {
                    tAttrs.keepTitleOnTooltipHover = 'true';
                }
                return function link(scope, element, attrs) {

                    var isDialog = false;

                    attrs.$observe('title', function (newVal) {
                        initialize(newVal);
                    });

                    attrs.$observe('titleClick', function (newVal) {
                        if(newVal) {
                            element.click(function() {
                                //noinspection JSUnresolvedVariable
                                var messageObj  = $compile($('<div>' + attrs.titleClick + '</div>'))(scope);
                                scope.$apply();
                                initialize(messageObj, true);
                                tooltipService.show(element);
                                isDialog = true;
                            });
                        }
                    });

                    tooltipService.onClose(element, function() {
                        if(isDialog) {
                            isDialog = false;
                            setTitle(attrs.title);
                            if(!$rootScope.$$phase) {
                                scope.$apply();
                            }
                        }
                    });

                    $rootScope.$on('languageChanged', function () {
                        setTitle(attrs.title);
                    });

                    /** Private methods **/
                    function initialize(title, isHtml) {
                        var options = {
                            mouseOnToPopup: attrs.keepTitleOnTooltipHover === 'true'
                        };
                        tooltipService.initialize(element, title, options, isHtml);
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
