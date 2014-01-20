(function () {
    'use strict';
    COMPONENTS.directive('app', ['$rootScope', '$compile', 'portalService', 'styleService', 'appService',
                                'availableAppsService', 'constantsService', 'stringService', 'roleService',
    function factory($rootScope, $compile, portalService, styleService, appService, availableAppsService,
                     constantsService, stringService, roleService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app.html',
            scope: {
                _id         : '=app',
                type        : '=',
                model       : '=',
                width       : '=',
                templateApp : '@'
            },
            controller: ['$scope', function controller($scope) {
                //Initialize the app bridge resources in the controller instead of
                //in the link function in order to ensure they're available in the bridge app
                $scope.view = 'view';
                $scope.bindings = {};
                $scope.onEvent = {};
                $scope.internalData = {};
            }],
            link: function link(scope, element) {

                var hasWidthChanged = false;
                element.addClass(scope.type);

                scope.getAppStyles = function () {
                    var portal = portalService.getPortal();
                    if (scope.model && portal) {
                        //1. Set the default app styles from the portal settings
                        var styles  = styleService.getNormalizedStyles(portal.app.styles, null);
                        //2. Overwrite the app styles with the app specific settings
                        styles = styleService.getNormalizedStyles(scope.model.styles, styles);
                        return styles;
                    }
                    return null;
                };

                scope.getAppAlignment = function () {
                    var align = {}, hAlignStyleClass, vAlignStyleClass;
                    if(scope.model && scope.model.styles && scope.model.styles.align) {
                        hAlignStyleClass = 'alignHorizontally' +
                            stringService.capitalize(scope.model.styles.align.horizontal);
                        vAlignStyleClass = 'alignVertically' +
                            stringService.capitalize(scope.model.styles.align.vertical);
                        align[hAlignStyleClass]  = true;
                        align[vAlignStyleClass]    = true;
                    }
                    return align;
                };

                scope.isTitleVisible = function () {
                    var portal = portalService.getPortal();
                    //noinspection JSUnresolvedVariable
                    if (scope.model && scope.model.showTitle !== undefined) {
                        //noinspection JSUnresolvedVariable
                        return scope.model.showTitle;
                    }
                    //noinspection JSUnresolvedVariable
                    return (portal.app) ? portal.app.showTitle : false;
                };

                scope.removeApp = function () {
                    element.hide("explode", { direction: "horizontal" }, window.speed, function () {
                        if (appService.isFullscreen()) {
                            appService.disableFullscreen(element, scope.onEvent.resize);
                        }
                        appService.deleteApp(element, scope.$parent.$index);
                        $(this).remove();
                    });
                };

                scope.getAppStyleClasses = function() {
                    var appStyleClasses = {};
                    appStyleClasses[scope.type] = true;
                    appStyleClasses[roleService.getCurrentUserAdminAccessStyleClass()] = true;
                    if(scope.model && scope.model.styles && scope.model.styles.height) {
                        appStyleClasses.fixedHeight = true;
                    }
                    return appStyleClasses;
                };

                scope.getCurrentUserAdminAccessStyleClass = function () {
                    return roleService.getCurrentUserAdminAccessStyleClass();
                };

                scope.$watch('type', function (newVal) {
                    if (newVal) {
                        initModel();
                    }
                });

                scope.$watch('width', function (newVal) {
                    if (newVal) {
                        if (hasWidthChanged) { //The width has changed -> trigger resize event
                            appService.triggerOnResizeEvent(scope.onEvent.resize);
                        } else { //The first time is the init, not the resizing one
                            hasWidthChanged = true;
                        }
                    }
                });

                $rootScope.$on(constantsService.collections.availableApps + 'Undeployed', function (event, type) {
                    if (type === scope.type) { scope.removeApp(); }
                });

                element.mouseenter(function() {
                    element.addClass('hover');
                });

                element.mouseleave(function() {
                    element.removeClass('hover');
                });

                /** Private methods **/
                function initModel() {
                    //Wait till the available apps data has been retrieved
                    var availableApps;
                    availableApps = availableAppsService.getAvailableApps();
                    //Get the app info outside of the app object as it's just for readonly purposes
                    scope.appInfo = getModelFromIndex(availableApps, scope.type);
                    //noinspection JSUnresolvedVariable
                    if (!scope.model && scope.appInfo) { //For new app, initialize app model structure
                        //noinspection JSUnresolvedVariable
                        scope.model = scope.appInfo.defaultModel || {}; //Set default model, if case
                    }
                    setSharedBindings();
                }

                function getModelFromIndex(array, matcher) {
                    //Return a new element to avoid memory references
                    return (array) ? $.extend(true, {}, array.model[array.index[matcher]]) : null;
                }

                function setSharedBindings() {
                    scope.bindings.model = scope.model;
                    scope.bindings.internalData = scope.internalData;
                }
            }
        };
    }]);
})();
