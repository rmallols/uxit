(function () {
    'use strict';
    COMPONENTS.directive('adminPanel', ['$rootScope', '$location', 'portalService', 'addAppService', 'mediaService',
    'sessionService', 'keyboardService', '$timeout',
    function ($rootScope, $location, portalService, addAppService, mediaService, sessionService, keyboardService, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'adminPanel.html',
            replace: true,
            scope: {},
            link: function (scope, element) {

                var currentTabIndex, ngStyleAvatarFn, directiveId = 'adminPanel',
                    userSession = sessionService.getUserSession();

                scope.activeTab = { current: '-1' };

                function toggle(tabIndex) {
                    if (tabIndex !== currentTabIndex) {
                        show(tabIndex);
                    } else {
                        hide();
                        inactiveTab();
                    }
                }

                function toggleAddAppPanel() {
                    hide();
                    addAppService.toggleAddAppPanel();
                    if (addAppService.isAddAppPanelActive()) {
                        keyboardService.register('esc', directiveId, function () {
                            addAppService.hideAddAppPanel();
                            inactiveTab();
                            scope.$apply();
                        });
                    } else {
                        inactiveTab();
                    }
                }

                function show(tabIndex) {
                    currentTabIndex = tabIndex;
                    element.removeClass('hide').addClass('show');
                    if (addAppService.isAddAppPanelActive()) {
                        addAppService.hideAddAppPanel();
                    }
                    $location.search({}); //Remove any URL parameter to avoid potential conflicts i.e. with the lists
                    registerKeyboardEvents();
                }

                function hide() {
                    currentTabIndex = null;
                    element.removeClass('show').addClass('hide');
                    unregisterKeyboardEvents();
                }

                function inactiveTab() {
                    //As soon as the active tab is reset, the directives are deleted
                    //Some processes could be still in progress (for instance, the $watch that updates the portal title)
                    //so it's necessary to add some delay to the inactivation process to have time enough
                    //to update these ongoing processes
                    $timeout(function() {
                        scope.activeTab.current = -1;
                    }, 0);
                }

                function registerKeyboardEvents() {
                    keyboardService.register('ctrl+a', directiveId, function () {
                        scope.activeTab.current = 0;
                        toggleAddAppPanel();
                        scope.$apply();
                    });
                    keyboardService.register('ctrl+enter', directiveId, function () {
                        scope.onSave();
                        scope.$apply();
                    });
                    keyboardService.register('esc', directiveId, function () {
                        scope.onCancel();
                        scope.$apply();
                    });
                }

                function unregisterKeyboardEvents() {
                    keyboardService.unregister('ctrl+a', directiveId);
                    keyboardService.unregister('ctrl+enter', directiveId);
                    keyboardService.unregister('esc', directiveId);
                }

                ngStyleAvatarFn = function () {
                    var userAvatarUrl;
                    if (userSession) {
                        userAvatarUrl = mediaService.getDownloadUrl(userSession.media);
                        return { backgroundImage: 'url("' + userAvatarUrl + '")' };
                    }
                    return null;
                };

                $rootScope.$on('portalLoaded', function() {
                    scope.portal = portalService.getPortal();
                    addPanels();
                });

                inactiveTab();

                scope.onCancel = function () {
                    hide();
                    inactiveTab();
                };

                scope.onSave = function () {
                    portalService.updatePortal(function () {
                        hide();
                        inactiveTab();
                    });
                };

                /** Private methods **/
                function addPanels() {
                    scope.panels = [];
                    addPanel('addApp', 'addIcon', toggleAddAppPanel);
                    addPanel('editGeneral', 'settingsIcon', toggle);
                    addPanel('editStyles', 'stylesIcon', toggle);
                    addPanel('editContentList', 'contentIcon hideEditedMark', toggle);
                    addPanel('editUserList', 'userIcon hideEditedMark', toggle);
                    addPanel('editMediaList', 'mediaIcon hideEditedMark', toggle);
                    addPanel('editPages', 'pageIcon', toggle);
                    addPanel('editTagList', 'tagsIcon hideEditedMark', toggle);
                    addPanel('editNotifications', 'notificationsIcon', toggle);
                    addPanel('stats', 'statsIcon', toggle);
                    addPanel('editCurrentUser', 'currentUser', toggle, ngStyleAvatarFn);
                }

                function addPanel(panelId, styleClasses, onTabClickedFn, ngStyleFn) {
                    var prefix = 'adminPanel.', title = prefix + panelId,
                        description = title + '.desc', bindings = { model: scope.portal };
                    scope.panels.push({
                        title       : title,
                        description : description,
                        src         : panelId,
                        ngClass     : styleClasses,
                        ngStyleFn   : ngStyleFn,
                        onTabClicked: onTabClickedFn,
                        bindings    : bindings
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
}());
