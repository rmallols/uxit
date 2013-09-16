(function () {
    'use strict';
    COMPONENTS.directive('addAppPanel', ['availableAppsService', 'undeployService', 'constantsService', 'addAppService', 'statsService', 'keyboardService',
    function (availableAppsService, undeployService, constantsService, addAppService, statsService, keyboardService) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'addAppPanel.html',
            replace: true,
            link: function (scope, element) {

                var activeAppId = 0, collapsedState = 'collapsed', expandedState = 'expanded',
                    directiveId = 'addAppPanel';

                scope.showExpandedView = function (availableApp) {
                    function getStats() {
                        var filter = { cond : { targetId: scope.highlight._id }};
                        statsService.loadStats(constantsService.collections.comments, filter, function (stats) {
                            scope.highlight.stats = stats;
                        });
                    }

                    scope.onAddedComment = function () { getStats(); };
                    scope.highlight             = availableApp;
                    scope.highlight.collection  = constantsService.collections.availableApps;
                    element.attr('state', expandedState);
                    getStats();
                };

                scope.hideExpandedView = function () {
                    scope.highlight = null;
                    element.attr('state', collapsedState);
                };

                scope.toggleExpandedView = function (availableApp) {
                    if (scope.highlight &&  scope.highlight.id === availableApp.id) {
                        scope.hideExpandedView();
                    } else {
                        scope.showExpandedView(availableApp);
                    }
                };

                scope.getBlockStyleClass = function (appId) {
                    return (element.attr('state') === expandedState && scope.highlight && appId === scope.highlight.id)
                        ? 'highlight' : '';
                };

                scope.getAppClasses = function (appId) {
                    return (appId === activeAppId) ? 'hoverState' : '';
                };

                scope.undeploy = function () {
                    undeployService.undeploy(scope.highlight);
                    scope.hideExpandedView();
                    availableAppsService.loadAvailableApps(function (availableApps) {
                        scope.availableApps = availableApps;
                    });
                };

                //Reload the list of available apps every time new apps are added
                scope.onAvailableAppDeployed = function () {
                    availableAppsService.loadAvailableApps(function (availableApps) {
                        scope.availableApps = availableApps;
                    });
                };

                scope.collection = constantsService.collections.comments;
                scope.availableApps = availableAppsService.getAvailableApps();

                function registerKeyboardEvents() {
                    keyboardService.register(['tab', 'down'], directiveId, function () {
                        activeAppId = (activeAppId < scope.availableApps.model.length - 1) ? activeAppId + 1 : 0;
                        scope.$apply();
                    });
                    keyboardService.register(['shift+tab', 'up'], directiveId, function () {
                        activeAppId = (activeAppId > 0) ? activeAppId - 1 : scope.availableApps.model.length - 1;
                        scope.$apply();
                    });
                    keyboardService.register('enter', directiveId, function () {
                        scope.showExpandedView(scope.availableApps.model[activeAppId]);
                    });
                }

                registerKeyboardEvents();
            }
        };
    }]);
})();
