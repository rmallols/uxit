(function () {
    'use strict';
    COMPONENTS.directive('appHeader', ['$rootScope', 'appService', 'pageService', 'roleService', 'stringService', 'editBoxUtilsService',
    function ($rootScope, appService, pageService, roleService, stringService, editBoxUtilsService) {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: '/client/html/app/appHeader.html',
                link: function link(scope, element) {

                    var appElm = element.parent();

                    scope.showHeader = function () {
                        return $rootScope.globalSettings.showAppHeader && $rootScope.portal.user;
                    };

                    scope.showEditActions = function () {
                        return $rootScope.portal.user && roleService.hasCreatorRole($rootScope.portal.user);
                    };

                    scope.showAdminActions = function () {
                        return $rootScope.portal.user && roleService.hasAdminRole($rootScope.portal.user);
                    };

                    scope.toggleHeader = function () {
                        appElm.toggleClass('enabledHeader');
                    };

                    scope.isAdmin = function () {
                        return roleService.hasAdminRole($rootScope.portal.user);
                    };

                    scope.getAppHelpText = function () {
                        if (scope.model && scope.appInfo && scope.appInfo.desc) {
                            var title   = '<h6>' + (scope.model.title || scope.appInfo.title) + ' app</h6>',
                                desc    = scope.appInfo.desc;
                            return title + desc;
                        }
                        return null;
                    };

                    scope.toggleMaximized = function () {
                        if (appService.isMaximized()) {
                            appService.disableMaximized(appElm, scope.onResized);
                        }
                        else {
                            appService.enableMaximized(appElm, scope.onResized);
                        }
                    };

                    scope.showEditTemplate = function () {
                        var targetObj = $('> .header > .actions > .editIcon', element);
                        scope.panels = getEditPanels();
                        scope.onSave = function () {
                            if (scope.onLayerSave) { scope.onLayerSave(); }
                            pageService.updateCurrentPage(null);
                        };
                        editBoxUtilsService.showEditBox(scope, targetObj, targetObj);
                    };

                    $rootScope.$on('onWindowResized', function () {
                        appService.triggerOnResizeEvent(scope.onResized);
                    });

                    /** Private methods */
                    function getEditPanels() {
                        //noinspection JSUnresolvedVariable
                        if (scope.appInfo.editPanels)   { return getCustomEditPanels(); }
                        else                            { return getDefaultEditPanels(); }
                    }

                    function getDefaultEditPanels() {
                        var panels = [];
                        //noinspection JSUnresolvedVariable
                        if (!scope.appInfo.noCustomEditPanel) { panels.push({ title: 'Edit', type: scope.type + 'Edit' }); }
                        panels.push({ title: 'Edit App', type: 'editAppGeneral'}, { title: 'Styles setup', type: 'editAppStyles'});
                        return panels;
                    }

                    function getCustomEditPanels() {
                        var panels = [], panelType, defaultEditPanels;
                        scope.appInfo.editPanels.forEach(function (panel) {
                            panelType = scope.type + stringService.capitalize(panel.type);
                            panels.push({ title: panel.title, type: panelType, styleClass: panel.type });
                        });
                        defaultEditPanels = getDefaultEditPanels();
                        defaultEditPanels.forEach(function (panel) {
                            panels.push(panel);
                        });
                        return panels;
                    }
                }
            };
        }]);

})();