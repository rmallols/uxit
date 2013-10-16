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
            compile: function () {

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
                            initialize(attrs.title);
                            if(!$rootScope.$$phase) {
                                scope.$apply();
                            }
                        }
                    });

                    $rootScope.$on('languageChanged', function () {
                        initialize(attrs.title);
                    });

                    /** Private methods **/
                    function initialize(title, customOptions, isHtml) {
                        var options = {
                            fadeInTime: 0,
                            fadeOutTime: 0,
                            smartPlacement: true,
                            mouseOnToPopup: true
                        };
                        angular.extend(options, customOptions);
                        tooltipService.initialize(element, title, options, isHtml);
                    }

                    function showConfirmMessage() {
                        //noinspection JSUnresolvedVariable
                        var labelHtml   = '<label i18n="' + (attrs.confirmText || 'areYouSure') + '"></label>',
                            ngClickFn   = 'executeConfirmAction(\'' + attrs.confirmAction + '\')',
                            buttonHtml  = '<button class="okIcon" ng-click="' + ngClickFn + '"></button>',
                            messageHtml = '<div class="confirmText">' + labelHtml + buttonHtml + '</div>',
                            messageObj  = $compile($(messageHtml))(scope),
                            customOptions = { manual: true };
                        scope.$apply();
                        tooltipService.hide();
                        initialize(messageObj, customOptions, true);
                        tooltipService.show(element);
                        isDialog = true;
                    }
                    /** End of private methods **/
                };

            }
        };
    }]);
})();
