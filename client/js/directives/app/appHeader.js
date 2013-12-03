(function () {
    'use strict';
    COMPONENTS.directive('appHeader', ['$rootScope', '$location', 'appService', 'portalService', 'pageService',
    'roleService', 'sessionService', 'stringService', 'editBoxUtilsService',
    function ($rootScope, $location, appService, portalService, pageService, roleService,
              sessionService, stringService, editBoxUtilsService) {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'appHeader.html',
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
                        toggleHeader();
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
                        hideHeader();
                    };

                    scope.showEditTemplate = function () {
                        var targetObj = $('> .header > .actions > .editIcon', element);
                        scope.panels = getEditPanels();
                        setEditBindings(scope.panels, scope.bindings);
                        scope.onSave = function () {
                            if (scope.onLayer && scope.onLayer.save) { scope.onLayer.save(); }
                            pageService.updateCurrentPage(null);
                            portalService.updatePortal(null);
                        };
                        editBoxUtilsService.showEditBox(scope, targetObj, targetObj);
                    };

                    $rootScope.$on('onWindowResized', function () {
                        appService.triggerOnResizeEvent(scope.onEvent.resize);
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
                        if (!scope.appInfo.noCustomEditPanel) {
                            panels.push({   title: 'Edit', type: scope.type + 'Edit',
                                            appBridge: true, src:scope.type, view:'edit' });
                        }
                        panels.push(
                            { title: 'Edit App', type: 'editAppGeneral'},
                            { title: 'Styles setup', type: 'editAppStyles'});
                        return panels;
                    }

                    function getCustomEditPanels() {
                        var panels = [], panelType, defaultEditPanels;
                        scope.appInfo.editPanels.forEach(function (panel) {
                            panelType = scope.type + stringService.capitalize(panel.type);
                            panels.push(
                                {   title: panel.title, type: panelType, styleClass: panel.type,
                                    appBridge: true, src:scope.type, view: panel.type
                                });
                        });
                        defaultEditPanels = getDefaultEditPanels();
                        defaultEditPanels.forEach(function (panel) {
                            panels.push(panel);
                        });
                        return panels;
                    }

                    function enableFullscreen() {
                        appService.enableFullscreen(appElm, scope._id, scope.width, scope.onEvent.resize);
                    }

                    function disableFullscreen() {
                        appService.disableFullscreen(appElm, scope.onEvent.resize);
                    }

                    function manageFullscreenFromSearch() {
                        if(Number($location.search()._id) === scope._id) {
                            enableFullscreen();
                        } else if(!$location.search()._id) {
                            disableFullscreen();
                        }
                    }

                    function toggleHeader() {
                        $('.app').not(appElm).removeClass('enabledHeader');
                        appElm.toggleClass('enabledHeader');
                    }

                    function hideHeader() { appElm.removeClass('enabledHeader'); }

                    function setEditBindings(panels, bindings) {
                        panels.forEach(function (panel) {
                            panel.bindings = bindings;
                        });
                    }
                    /** End of private methods */
                }
            };
        }]);

})();