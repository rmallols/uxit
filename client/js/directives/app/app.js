(function () {
    'use strict';
    COMPONENTS.directive('app', ['$rootScope', '$compile', 'pageService', 'styleService', 'appService',
                                'availableAppsService', 'constantsService', 'stringService', 'roleService',
    function factory($rootScope, $compile, pageService, styleService, appService, availableAppsService,
                     constantsService, stringService, roleService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: '/client/html/app/app.html',
            scope: {
                type    : '=',
                model   : '=',
                width   : '=',
                rowIndex: '=',
                colIndex: '=',
                appIndex: '='
            },
            link: function link(scope, element) {

                var hasWidthChanged = false;

                scope.setViewTemplate = function () {
                    var directiveName = stringService.toSnakeCase(scope.type),
                        template = '<div ' + directiveName + '-view model="model" ' +
                                    'internal-data="internalData" on-layer-save="onLayerSave" on-resized="onResized"></div>',
                        compiledTemplates = $compile(template)(scope);
                    $('> .content > [data]', element).html('').append(compiledTemplates);
                };

                scope.setAppStyles = function () {
                    if (scope.model && $rootScope.portal) {
                        //1. Set the default app styles from the portal settings
                        var styles  = styleService.getNormalizedStyles($rootScope.portal.app.styles, null);
                        //2. Overwrite the app styles with the app specific settings
                        styles = styleService.getNormalizedStyles(scope.model.styles, styles);
                        return styles;
                    }
                    return null;
                };

                scope.isTitleVisible = function () {
                    //noinspection JSUnresolvedVariable
                    if (scope.model && scope.model.showTitle !== undefined) {
                        //noinspection JSUnresolvedVariable
                        return scope.model.showTitle;
                    }
                    //noinspection JSUnresolvedVariable
                    return ($rootScope.portal.app) ? $rootScope.portal.app.showTitle : false;
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
                        if (appService.isMaximized()) {
                            appService.disableMaximized(element, scope.onResized);
                        }
                        pageService.deleteApp(scope.rowIndex, scope.colIndex, scope.appIndex);
                        $(this).remove();
                    });
                };

                scope.getAdminAccessStyleClass = function () { return roleService.getAdminAccessStyleClass(); };

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
