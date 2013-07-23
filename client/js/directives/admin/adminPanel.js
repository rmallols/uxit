(function () {
    'use strict';
    COMPONENTS.directive('adminPanel', ['$rootScope', 'portalService', 'addAppService', 'mediaService', 'keyboardService', '$timeout',
    function ($rootScope, portalService, addAppService, mediaService, keyboardService, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/client/html/admin/adminPanel.html',
            replace: true,
            scope: {},
            link: function (scope, element) {

                var currentTabIndex, ngStyleAvatarFn, directiveId = 'adminPanel';

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

                    function registerKeyboardEvents() {
                        keyboardService.register('ctrl+a', directiveId, function () {
                            scope.activeTab = 0;
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

                    currentTabIndex = tabIndex;
                    element.removeClass('hide').addClass('show');
                    if (addAppService.isAddAppPanelActive()) {
                        addAppService.hideAddAppPanel();
                    }
                    registerKeyboardEvents();
                }

                function hide() {

                    function unregisterKeyboardEvents() {
                        keyboardService.unregister('ctrl+a', directiveId);
                        keyboardService.unregister('ctrl+enter', directiveId);
                        keyboardService.unregister('esc', directiveId);
                    }

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
                        scope.activeTab = -1;
                    }, 0);
                }

                ngStyleAvatarFn = function () {
                    if ($rootScope.portal.user) {
                        return { backgroundImage: 'url("' + mediaService.getDownloadUrl($rootScope.portal.user.media) + '")' };
                    }
                    return null;
                };

                //ngStyleAvatar = { backgroundImage: 'url("' + mediaService.getDownloadUrl($rootScope.portal.user.media) + '")' };
                //noinspection JSHint
                scope.panels = [
                    {
                        title: 'adminPanel.addApp', description: 'adminPanel.addApp.desc',
                        type: 'addApp',             ngClass: 'addIcon',             onTabClicked: toggleAddAppPanel
                    },{
                        title: 'adminPanel.settings',description: 'adminPanel.settings.desc',
                        type: 'editGeneral',        ngClass: 'settingsIcon',        onTabClicked: toggle
                    },{
                        title: 'adminPanel.styles', description: 'adminPanel.styles.desc',
                        type: 'editStyles',         ngClass: 'stylesIcon',          onTabClicked: toggle
                    },{
                        title: 'adminPanel.content',description: 'adminPanel.content.desc',
                        type: 'editContentList',    ngClass: 'contentIcon hideEditedMark', onTabClicked: toggle
                    },{
                        title: 'adminPanel.users',  description: 'adminPanel.users.desc',
                        type: 'editUserList',       ngClass: 'userIcon hideEditedMark', onTabClicked: toggle
                    },{
                        title: 'adminPanel.media',  description: 'adminPanel.media.desc',
                        type: 'editMediaList',      ngClass: 'mediaIcon hideEditedMark', onTabClicked: toggle
                    },{
                        title: 'adminPanel.pages',  description: 'adminPanel.pages.desc',
                        type: 'editPages',          ngClass: 'pageIcon',            onTabClicked: toggle
                    },{
                        title: 'tags',              description: 'adminPanel.tags.desc',
                        type: 'editTagList',        ngClass: 'tagsIcon hideEditedMark', onTabClicked: toggle
                    },
                    {
                        title: 'adminPanel.notifications', description: 'adminPanel.notifications.desc',
                        type: 'editNotifications',  ngClass: 'notificationsIcon',   onTabClicked: toggle
                    },{
                        title: 'adminPanel.stats',  description: 'adminPanel.stats.desc',
                        type: 'stats',              ngClass: 'statsIcon',           onTabClicked: toggle
                    },{
                        title: 'adminPanel.you',    description: 'adminPanel.you.desc',
                        type: 'editCurrentUser',    ngStyle: ngStyleAvatarFn,       onTabClicked: toggle
                    }
                ];

                inactiveTab();

                scope.onCancel = function () {
                    hide();
                    inactiveTab();
                };

                scope.onSave = function () {
                    portalService.savePortal(function () {
                        hide();
                        inactiveTab();
                    });
                };
            }
        };
    }]);
}());
