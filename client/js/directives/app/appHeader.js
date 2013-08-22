(function () {
    'use strict';
    COMPONENTS.directive('appHeader', ['$rootScope', '$location', 'appService', 'portalService', 'pageService',
    'roleService', 'sessionService', 'stringService', 'editBoxUtilsService',
    function ($rootScope, $location, appService, portalService, pageService, roleService, sessionService, stringService, editBoxUtilsService) {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: '/client/html/app/appHeader.html',
                link: function link(scope, element) {

                    var appElm = element.parent(), userSession = sessionService.getUserSession();

                    scope.showHeader = function () {
                        return userSession;
                    };

                    scope.showEditActions = function () {
                        return userSession && roleService.hasCreatorRole(userSession);
                    };

                    scope.showAdminActions = function () {
                        return userSession && roleService.hasAdminRole(userSession);
                    };

                    scope.toggleHeader = function () {
                        appElm.toggleClass('enabledHeader');
                    };

                    scope.isAdmin = function () {
                        return roleService.hasAdminRole(userSession);
                    };

                    scope.getAppHelpText = function () {
                        if (scope.model && scope.appInfo && scope.appInfo.desc) {
                            var title   = '<h6>' + (scope.model.title || scope.appInfo.title) + ' app</h6>',
                                desc    = scope.appInfo.desc;
                            return title + desc;
                        }
                        return null;
                    };

                    scope.toggleFullscreen = function () {
                        if (appService.isFullscreen()) {
                            disableFullscreen();
                        }
                        else {
                            enableFullscreen();
                        }
                    };

                    scope.showEditTemplate = function () {
                        var targetObj = $('> .header > .actions > .editIcon', element);
                        scope.panels = getEditPanels();
                        scope.onSave = function () {
                            if (scope.onLayerSave) { scope.onLayerSave(); }
                            pageService.updateCurrentPage(null);
                            portalService.savePortal(null);
                        };
                        editBoxUtilsService.showEditBox(scope, targetObj, targetObj);
                    };

                    $rootScope.$on('onWindowResized', function () {
                        appService.triggerOnResizeEvent(scope.onResized);
                    });

                    scope.isTemplateFullscreen = portalService.isTemplateFullscreen();
                    $rootScope.$on('onPortalSaved', function () {
                        scope.isTemplateFullscreen = portalService.isTemplateFullscreen();
                    });

                    manageFullscreenFromSearch();
                    scope.$on('$routeUpdate', function(){
                        manageFullscreenFromSearch();
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

                    function enableFullscreen() {
                        appService.enableFullscreen(appElm, scope._id, scope.width, scope.onResized);
                    }

                    function disableFullscreen() {
                        appService.disableFullscreen(appElm, scope.onResized);
                    }

                    function manageFullscreenFromSearch() {
                        if(Number($location.search()._id) === scope._id) {
                            enableFullscreen();
                        } else if(!$location.search()._id) {
                            disableFullscreen();
                        }
                    }
                }
            };
        }]);

})();