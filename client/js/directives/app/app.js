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
            link: function link(scope, element) {

                var hasWidthChanged = false;

                scope.setViewTemplate = function () {
                    var directiveName = stringService.toSnakeCase(scope.type),
                        template = '<div ' + directiveName + '-view id="_id" model="model" ' +
                                    'internal-data="internalData" on-layer-save="onLayerSave" on-resized="onResized"></div>',
                        compiledTemplates = $compile(template)(scope);
                    $('> .content > [data]', element).html('').append(compiledTemplates);
                };

                scope.setAppStyles = function () {
                    if (scope.model && portalService.getPortal()) {
                        //1. Set the default app styles from the portal settings
                        var styles  = styleService.getNormalizedStyles(portalService.getPortal().app.styles, null);
                        //2. Overwrite the app styles with the app specific settings
                        styles = styleService.getNormalizedStyles(scope.model.styles, styles);
                        return styles;
                    }
                    return null;
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

                scope.getAppStyleSheet = function () {
                    var appPath = constantsService.appsPath + '/' + scope.type + '/', sheetName = scope.type + '.less',
                        sheetPath = appPath + sheetName, link = $('<link rel="stylesheet" type="text/less" href="' + sheetPath + '" />');
                    //noinspection JSHint
                    less.sheets.push(link[0]);
                    less.refresh();
                };

                scope.removeApp = function () {
                    element.hide("explode", { direction: "horizontal" }, window.speed, function () {
                        if (appService.isFullscreen()) {
                            appService.disableFullscreen(element, scope.onResized);
                        }
                        portalService.deleteApp(element, scope.$parent.$index);
                        $(this).remove();
                    });
                };

                scope.getCurrentUserAdminAccessStyleClass = function () { return roleService.getCurrentUserAdminAccessStyleClass(); };

                scope.$watch('type', function (newVal) {
                    if (newVal) {
                        initModel();
                    }
                });

                scope.$watch('width', function (newVal) {
                    if (newVal) {
                        if (hasWidthChanged) { //The width has changed -> trigger resize event
                            appService.triggerOnResizeEvent(scope.onResized);
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
                    scope.internalData = {};
                    scope.setViewTemplate();
                    scope.getAppStyleSheet();
                    element.addClass(scope.type);
                }

                function getModelFromIndex(array, matcher) {
                    return (array) ? array.model[array.index[matcher]] : null;
                }
            }
        };
    }]);
})();
