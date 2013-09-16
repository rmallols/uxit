(function () {
    'use strict';
    COMPONENTS.directive('backupTitle', ['$rootScope', '$compile', function ($rootScope, $compile) {
        return {
            restrict: 'A',
            compile: function (tElement, tAttrs) {
                tElement.attr('title', tAttrs.backupTitle);
                tElement.removeAttr('backup-title');
                return function link(scope, element) {
                    element.data('backup-title', true);
                    $compile(element)(scope);
                };
            }
        };
    }]);

    COMPONENTS.directive('title', ['$rootScope', '$compile', 'tooltipService',
    function ($rootScope, $compile, tooltipService) {
        return {
            restrict: 'A',
            priority: -1,
            compile: function (tElement, tAttrs) {
                //noinspection JSUnresolvedVariable
                if(tAttrs.confirmAction) {
                    tAttrs.keepTitleOnTooltipHover = 'true';
                }
                return function link(scope, element, attrs) {

                    var isDialog = false;

                    if(element.data('backup-title')) {
                        element.attr('backup-title', attrs.title);
                    }

                    scope.executeConfirmAction = function(actionToExecute) {
                        scope.$eval(actionToExecute);
                    };

                    attrs.$observe('title', function (newVal) {
                        initialize(newVal);
                    });

                    attrs.$observe('confirmAction', function (newVal) {
                        if(newVal) {
                            element.click(function() {
                                showConfirmMessage();
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
                        var customOptions = {};
                        tooltipService.initialize(element, title, customOptions, isHtml);
                    }

                    function setTitle(newTitle) {
                        tooltipService.setTitle(newTitle, element, false);
                    }

                    function showConfirmMessage() {
                        //noinspection JSUnresolvedVariable
                        var labelHtml   = '<label i18n="' + (attrs.confirmText || 'areYouSure') + '"></label>',
                            buttonHtml  = '<button class="okIcon" ng-click="executeConfirmAction(\'' + attrs.confirmAction + '\')"></button>',
                            messageHtml = '<div class="confirmText">' + labelHtml + buttonHtml + '</div>';
                        var messageObj  = $compile($(messageHtml))(scope);
                        scope.$apply();
                        initialize(messageObj, true);
                        tooltipService.show(element);
                        isDialog = true;
                    }
                    /** End of private methods **/
                };

            }
        };
    }]);
})();
