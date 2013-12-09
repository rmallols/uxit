//noinspection JSHint
COMPONENTS.controller('ErrorCtrl', ['$scope', '$routeParams', 'i18nService',
function($scope, $routeParams, i18nService) {
    'use strict';
    $scope.errorTitle = i18nService($routeParams.title, $routeParams.targetId);
    $scope.showPortalHomeButton = $routeParams.showPortalHomeButton === 'true';
    $scope.goToPortalHome = function() {
        location.href = $routeParams.portalId;
    };
}]);
COMPONENTS.controller('LoginCtrl', ['$scope', '$routeParams', 'globalMsgService',
function($scope, $routeParams, globalMsgService) {
    'use strict';
    $scope.error = $routeParams.error;
    if ($routeParams.error) {
        //We need to execute the error handling in a new thread as the linking function
        //of the global message is executed AFTER the following code, so otherwise
        //it's still NOT subscribed to the show message event
        setTimeout(function () {
            globalMsgService.show('Invalid credentials');
            $scope.$apply();
        }, 100);
    }
}]);
COMPONENTS.controller('PortalCtrl', ['$scope', '$routeParams', 'portalService', 'roleService',
    'sessionService', 'userService', 'pageService', 'tagService', 'i18nService',
    'availableAppsService', 'metaService',
    function($scope, $routeParams, portalService, roleService, sessionService, userService,
    pageService, tagService, i18nService, availableAppsService, metaService) {
        'use strict';

        $scope.isAdmin = function () {
            return roleService.hasAdminRole(sessionService.getUserSession());
        };

        userService.loadUsers(null);    //Cache users
        pageService.loadPages(null);    //Cache pages
        roleService.loadRoles(function() {
            tagService.loadTags(null);      //Cache tags
            i18nService.loadLanguages(null);//Cache languages
            availableAppsService.loadAvailableApps(null); //Cache available apps
            sessionService.loadUserSession(function (userSession) {
                if (userSession && userSession.language) {
                    i18nService.changeLanguage(userSession.language);
                }
            });
            portalService.loadPortal($routeParams.page, function() {
                portalService.setHeader();
                metaService.setWindowDimensions();
                portalService.trackAnalytics();
            });
        });    //Cache roles
}]);
COMPONENTS.directive('login', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'login.html',
        scope: {},
		link: function link(scope) {
            scope.userSession = sessionService.getUserSession();
            scope.logout = function () {
                sessionService.logout();
            };
		}
	};
}]);

COMPONENTS.directive('pages', ['$rootScope', 'portalService', 'pageService', 'rowService', 'appService', 'roleService', 'sessionService', 'styleService',
function ($rootScope, portalService, pageService, rowService, appService, roleService, sessionService, styleService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'pages.html',
		link: function link(scope) {

            $rootScope.$on('portalLoaded', function() {
                scope.portal = portalService.getPortal();
            });

            scope.setPagesStyles = function () {
                if (scope.portal) {
                    return styleService.getNormalizedStyles(scope.portal.styles, null);
                }
                return null;
            };

            scope.getCurrentUserAdminAccessStyleClass = function () {
                return roleService.getCurrentUserAdminAccessStyleClass();
            };

            scope.isAdmin = function () { return roleService.hasAdminRole(sessionService.getUserSession()); };

            scope.isAppSortAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            scope.isAppResizeAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            /** Private methods **/
            function isAppSortAndResizeAllowed() {
                return scope.isAdmin() && !appService.isFullscreen();
            }
            /** End of private methods **/
		}
	};
}]);

(function () {
    'use strict';
    COMPONENTS.directive('addAppPanel', ['$rootScope', 'availableAppsService', 'undeployService',
    'constantsService', 'addAppService', 'statsService', 'keyboardService',
    function ($rootScope, availableAppsService, undeployService, constantsService,
    addAppService, statsService, keyboardService) {
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
                    scope.isExpandedViewVisible = true;
                    element.attr('state', expandedState);
                    getStats();
                };

                scope.hideExpandedView = function () {
                    scope.highlight = null;
                    scope.isExpandedViewVisible = false;
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

                scope.collection    = constantsService.collections.comments;
                scope.availableApps = availableAppsService.getAvailableApps();
                if(!scope.availableApps) {
                    $rootScope.$on('availableAppsLoaded', function() {
                        scope.availableApps = availableAppsService.getAvailableApps();
                    });
                }

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
                        type        : panelId,
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

COMPONENTS.directive('createContent', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'editContent.html',
        scope : {
            content : '=model'
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
        }
    };
}]);
COMPONENTS.directive('createMedia', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'createMedia.html',
        scope : {
            media : '=model'
        },
        link: function link(scope) {

            scope.multipleFilesUploaded = false;
            scope.media = [];
            scope.availableTags = tagService.getTags();

            scope.onUpload = function (uploadedMedia) {
                scope.multipleFilesUploaded = uploadedMedia.length > 1;
                scope.media = uploadedMedia;
            };

            scope.getMultipleFilesUploadedNames = function () {
                var multipleFilesUploadedNames = '';
                if (scope.multipleFilesUploaded) {
                    scope.media.forEach(function (media) {
                        multipleFilesUploadedNames += media.name + ', ';
                    });
                }
                return multipleFilesUploadedNames;
            };
        }
    };
}]);
(function() {
    'use strict';
    function createTag() {
        return {
            restrict: 'A',
            replace: false,
            templateUrl: 'editTag.html',
            scope: {
                tag: '=model'
            }
        };
    }
    var createTagArgs = [createTag];
    COMPONENTS.directive('createTag', createTagArgs);
    COMPONENTS.directive('createTags', createTagArgs);
})();
(function () {
    'use strict';
    function createUser(mediaService, roleService, tagService, i18nService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editUser.html',
            scope : {
                user : '=',
                onLayer : '='
            },
            link: function link(scope) {
                scope.availableTags     = tagService.getTags();
                scope.roles             = roleService.getRoles();
                scope.languages         = i18nService.getLanguages();
                scope.defaultAvatarUrl  = mediaService.getDefaultAvatarUrl();
                //Duplicate the array to avoid infecting the original languages object
                scope.languages = $.extend(true, [], i18nService.getLanguages());
                scope.languages.unshift({ code: '', text: i18nService('editUser.language.inheritBrowser')});
                initUserData();

                /** Private methods **/
                function initUserData() {
                    scope.user.role = 1;
                    scope.user.language = scope.languages[0].code;
                }
                /** End of private methods **/
            }
        };
    }
    var createUserArgs = ['mediaService', 'roleService', 'tagService', 'i18nService', createUser];
    COMPONENTS.directive('createUser', createUserArgs);
    COMPONENTS.directive('createUsers', createUserArgs);
})();
(function () {
    'use strict';
    COMPONENTS.directive('edit', ['$compile', 'validationService', 'keyboardService', 'stringService',
    'objectService',
    function ($compile, validationService, keyboardService, sS, oS) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'edit.html',
            replace: true,
            scope : {
                panels              : '=',
                activeTab           : '=',
                limitLayerHeight    : '@',
                onSave              : '&',
                onChange            : '&',
                onCancel            : '&'
            },
            link: function (scope, element, attrs) {

                var directiveId = 'edit' + ((attrs.type) ? '-' + attrs.type : ''), pristineBindings = [],
                    i = 0, formObjs = [], layersWrapper = $('> .content.level1 > ul', element);

                scope.showIfMultipleTabs = function () {
                    return scope.panels.length > 1;
                };

                scope.getLayerHeight = function () {
                    if (scope.limitLayerHeight) {
                        //Adjust the height limit of the layer
                        //This is thought to ensure that the editBox is smaller than the current view
                        return {
                            height: $(window).height() * 0.5
                        };
                    }
                    return null;
                };

                scope.cancel = function () {
                    //Restore the pristine state of the form
                    revertToPristineBindings();
                    //Invoke cancel callback
                    if (scope.onCancel) {
                        scope.onCancel();
                    }
                    updateFormObjs();
                    setPristine();
                };

                scope.save = function () {
                    updateFormObjs();
                    if (validationService.isFormValid(formObjs) && scope.onSave) {
                        //Emit (UP) the save event to the invoking directive (i.e. editBox)
                        //This parent directive will propagate the changes to all the children scopes (i.e. with $broadcast)
                        save();
                        //As the changes have been saved, the pristine state will be the current model state
                        //So if more changes are added and reverted afterwards, this will be the new original point
                        initPristineBindings();
                        setPristine();
                    } else {
                        validationService.setFocusOnFirstError(element);
                    }
                };

                scope.clickTab = function (tabIndex) {
                    scope.activeTab.current = tabIndex;
                    if (scope.panels[tabIndex].onTabClicked) {
                        scope.panels[tabIndex].onTabClicked(tabIndex);
                    }
                    layersWrapper.css('margin-left', '-' + (tabIndex * 100) + '%');
                    //Set a specific style class white the transition is being executed to support fine grain styles
                    setTempScrollingStyleClass();
                };

                scope.getTabClasses = function (panel, tabIndex) {
                    return (tabIndex === scope.activeTab.current) ? 'active ' + panel.ngClass : panel.ngClass;
                };

                scope.isLayerShown = function (tabIndex) {
                    return tabIndex === scope.activeTab.current;
                };

                scope.isEditedMarkVisible = function (panelForm) {
                    return scope.activeTab.current >= 0 && panelForm.$dirty;
                };

                scope.getEditedMarkColor = function (panelForm) {
                    return (panelForm.$valid) ? 'valid' : 'invalid';
                };

                initPristineBindings(); //Save the pristine state of the form
                adjustActionsTopPos();  //Avoid the situation where the actions are hidden on top

                scope.$watch('panels', function () {
                    scope.tabHeight = 100 / scope.panels.length;
                    scope.panels[0].active = true;
                    angular.forEach(scope.panels, function (panel) {
                        createEditLayer(panel);
                    });
                });

                registerKeyboardEvents();

                /** Private methods **/
                function save() {
                    var processedPanels = 0;
                    scope.panels.forEach(function (panel) {
                        panel.onLayer.save(function () {
                            processedPanels += 1;
                            if (processedPanels === scope.panels.length) {
                                scope.onSave();
                            }
                        });
                    });
                }

                function setPristine() { //Reset all the forms to their pristine state
                    //Manually set the pristine state as at the time of writing this code the $setPristine
                    //was not added to stable trunk of AngularJs. This improvement should be figured out @UXIT-126
                    formObjs.forEach(function (formObj) {
                        formObj.$dirty = false;
                        formObj.$pristine = true;
                    });
                }

                function initPristineBindings() {
                    scope.panels.forEach(function (panel, i) {
                        pristineBindings[i] = {};
                        $.extend(true, pristineBindings[i], panel.bindings);
                    });
                }

                function adjustActionsTopPos() {
                    var actionsElm = $(' > .actions', element);
                    setTimeout(function() {
                        if(actionsElm.offset().top < 0) {
                            actionsElm.css('top', 0);
                        }
                    }, 0);
                }

                function revertToPristineBindings() {
                    scope.panels.forEach(function (panel, i) {
                        panel.bindings = pristineBindings[i];
                    });
                }

                function updateFormObjs() {
                    scope.panels.forEach(function (panel) {
                        formObjs.push(scope[panel.type]);
                    });
                }

                function registerKeyboardEvents() {
                    keyboardService.register('left', directiveId, function () {
                        var newActiveTab = (scope.activeTab.current > 0) ? scope.activeTab.current - 1 : scope.panels.length - 1;
                        scope.clickTab(newActiveTab);
                        scope.$apply();
                    });
                    keyboardService.register('right', directiveId, function () {
                        var newActiveTab = (scope.activeTab.current < scope.panels.length - 1) ? scope.activeTab.current + 1 : 0;
                        scope.clickTab(newActiveTab);
                        scope.$apply();
                    });
                }

                //Set a specific style class white the transition is being executed to support fine grain styles
                function setTempScrollingStyleClass() {
                    var scrollingStyleClass = 'scrolling';
                    element.addClass(scrollingStyleClass);
                    setTimeout(function () {
                        element.removeClass(scrollingStyleClass);
                    }, window.speed);
                }

                function createEditLayer(panel) {
                    var htmlElm, directiveElement;
                    if(!panel.onLayer) {
                        panel.onLayer = {};
                    }
                    panel.onLayer.save = function(callback) { callback(); };
                    htmlElm = getEditLayerHtmlElm(panel, i);
                    directiveElement = $compile(htmlElm)(scope);
                    if (panel.active) {
                        scope.activePanel = panel;
                    }
                    layersWrapper.append(directiveElement);
                    i += 1;
                }

                function getEditLayerHtmlElm(panel, index) {
                    var directiveName, htmlElm;
                    htmlElm = getEditLayerHtmlGenericElm(panel, index);
                    if(panel.appBridge) {
                        directiveName =  'app-bridge';
                        setAppBridgeProperties(htmlElm, panel, index);
                    } else {
                        directiveName = sS.toSnakeCase(panel.type);
                        setNonAppBridgeProperties(htmlElm, panel, index);
                    }
                    htmlElm.attr(directiveName, '');
                    htmlElm.wrap('<li class="layer" ng-form name="' + panel.type + '"></li>');
                    return htmlElm.parent();
                }

                function getEditLayerHtmlGenericElm(panel, index) {
                    return $('<div id="' + panel.type + scope.$id + '" ' +
                                'on-layer="panels[' + index + '].onLayer" on-cancel="onCancel()" ' +
                                'on-change="onChange()" ux-show="isLayerShown(' + index + ')" ' +
                                'persist="true" ng-style="getLayerHeight()" ' +
                                'config="panels[' + index + '].config">' +
                            '</div>');
                }

                function setAppBridgeProperties(htmlElm, panel, index) {
                    htmlElm.attr('src', panel.src);
                    htmlElm.attr('view', panel.view);
                    htmlElm.attr('bindings', 'panels[' + index + '].bindings');
                }

                function setNonAppBridgeProperties(htmlElm, panel, index) {
                    var customBindingKeys, attrKey, attrVal;
                    if(panel.bindings) {
                        customBindingKeys = oS.getRootKeys(panel.bindings);
                        customBindingKeys.forEach(function(customBindingKey) {
                            attrKey = sS.toSnakeCase(customBindingKey);
                            attrVal = 'panels[' + index + '].bindings.' + customBindingKey;
                            htmlElm.attr(attrKey, attrVal);
                        });
                    }
                }
                /** End of private methods **/
            }
        };
    }]);
})();

COMPONENTS.directive('editAppGeneral', ['i18nService', function (i18nService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editAppGeneral.html',
        scope: {
            model   : '=',
            onLayer : '='
        },
        link: function link(scope) {
            scope.aligns = [
                { id: 'left',   text: i18nService('editApp.alignLeft') },
                { id: 'center', text: i18nService('editApp.alignCenter') },
                { id: 'right',  text: i18nService('editApp.alignRight') }
            ];
            if(!scope.model.align) {
                scope.model.align = scope.aligns[0].id;
            }
        }
	};
}]);

COMPONENTS.directive('editAppStyles', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editAppStyles.html',
        scope: {
            model       : '=',
            onLayer : '='
        }
	};
}]);

(function () {
    'use strict';
    COMPONENTS.directive('editBox', ['editBoxUtilsService', 'pageService', 'keyboardService',
    function (editBoxUtilsService, pageService, keyboardService) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'editBox.html',
            replace: true,
            scope: {
                model           : '=',
                internalData    : '=',
                panels          : '=',
                target          : '=',
                arrowPos        : '=',
                onSave          : '&',
                onChange        : '&',
                onCancel        : '&',
                onClose         : '&'
            },
            link: function (scope, element) {

                var arrowPosOptions = { top: 'top', right: 'right', bottom: 'bottom', left: 'left' },
                    directiveId     = 'editBox', mainScrollingElm = pageService.getMainScrollingElm(),
                    mainScrollingElmMarginLeft = parseInt(mainScrollingElm.css('margin-left'), 10),
                    arrowWidth = $(' > .arrow', element).width() / 2;
                scope.activeTab = { current: 0};
                scope.getStyles = function () {
                    var topPos  = scope.target.coordinates.top + (scope.target.coordinates.height / 2),
                        leftPos = (scope.arrowPos === arrowPosOptions.left)
                                    ? scope.target.coordinates.width + scope.target.coordinates.left
                                    - mainScrollingElmMarginLeft + arrowWidth
                                    : -(element.width() + scope.target.coordinates.width)
                                    + scope.target.coordinates.left - mainScrollingElmMarginLeft;
                    return {
                        top : topPos,
                        left: leftPos
                     };
                };

                scope.change = function () {
                    if (scope.onChange)  { scope.onChange(); }
                };

                scope.save = function () {
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onSave)   { scope.onSave(scope.model, scope.$id); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                scope.cancel = function () {
                    editBoxUtilsService.hideEditBox(scope.target.id);
                    if (scope.onCancel) { scope.onCancel(); }
                    if (scope.onClose)  { scope.onClose(); }
                };

                scope.getArrowPos = function () {
                    var topPos              = scope.target.coordinates.top,
                        offsetTop           = element.offset().top,
                        scrollTop           = mainScrollingElm.scrollTop();
                    return {
                        top: topPos - offsetTop -  scrollTop
                    };
                };

                function registerKeyboardEvents() {
                    keyboardService.register('ctrl+enter', directiveId, function () {
                        scope.save();
                        scope.$apply();
                    });
                    keyboardService.register('esc', directiveId, function () { //Add a app
                        scope.cancel();
                        scope.$apply();
                    });
                }

                registerKeyboardEvents();
            }
        };
    }]);
})();

COMPONENTS.directive('editContent', ['contentService', 'tagService', function (contentService, tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editContent.html',
        scope: {
            content     : '=model',
            onLayer : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.onLayer.save = function (callback) {
                contentService.updateContent(scope.content, function () {
                    callback();
                });
            };
        }
    };
}]);
COMPONENTS.directive('editContentList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editContentList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);
COMPONENTS.directive('editCurrentUser', ['$rootScope', 'userService', 'sessionService',
function ($rootScope, userService, sessionService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editCurrentUser.html',
        scope: {
            model: '=',
            onLayer : '='
        },
        link: function link(scope) {

            scope.userSession = sessionService.getUserSession();

            scope.onLayer.save = function (callback) {
                userService.updateUser(scope.userSession, function () {
                    callback();
                });
            };

            scope.logout = function () {
                sessionService.logout();
            };
        }
    };
}]);
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editGeneral', ['portalService', 'mediaService', 'metaService',
    function (portalService, mediaService, metaService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editGeneral.html',
            scope: {
                model : '='
            },
            link: function link(scope) {

                scope.$watch('model.title', function () {
                    portalService.setHeader();
                });

                scope.level2Tabs = [
                    { title: 'editGeneral.general',     styleClass : 'settingsIcon' },
                    { title: 'editGeneral.app',         styleClass : 'appIcon' },
                    { title: 'editGeneral.comments',    styleClass : 'commentsIcon' },
                    { title: 'editGeneral.email',       styleClass : 'notificationsIcon' },
                    { title: 'editGeneral.analytics',   styleClass : 'statsIcon' }
                ];

                scope.defaultFaviconUrl = metaService.getDefaultFaviconUrl();

                mediaService.getMedia(scope.model.faviconId, null, function (favicon) {
                    scope.favicon = favicon;
                });

                scope.updateFavicon = function (newFavicon) {
                    scope.model.faviconId = newFavicon[0]._id;
                };
            }
        };
    }]);
})(window.COMPONENTS);

COMPONENTS.directive('editMedia', ['mediaService', 'tagService', function (mediaService, tagService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editMedia.html',
        scope: {
            media       : '=model',
            onLayer : '='
        },
		link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.onLayer.save = function (callback) {
                mediaService.updateMedia(scope.media, function () {
                    callback();
                });
            };
            scope.onUpload = function (uploadedMedia) {
                //For any unknown reason, the uploaded media preview is not updated till the model changes
                //(executing a $apply is not enough). Due to that, it's necessary to force the document name change somehow
                scope.media.name = '';
                setTimeout(function () {
                    scope.media.name = uploadedMedia[0].name;
                    scope.$apply();
                }, 0);
            };
		}
	};
}]);

COMPONENTS.directive('editMediaList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editMediaList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                uploadable      : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editNotifications', ['emailService', 'stdService', 'userService', 'liveMessageService',
    function (emailService, stdService, userService, liveMessageService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editNotifications.html',
            scope: {
                model: '=',
                onLayer : '='
            },
            link: function link(scope) {

                scope.usersList = userService.getUsers();

                scope.level2Tabs = [
                    { title: 'editNotifications.email',         styleClass : 'notificationsIcon' },
                    { title: 'editNotifications.liveMessage',   styleClass : 'infoIcon' }
                ];

                scope.onLayer.save = function (callback) {
                    sendEmail(function () {
                        sendLiveMessage(function () {
                            scope.model.notifications = {}; //Cleanup the notifications object to avoid saving it
                            callback();
                        });
                    });
                };

                function sendEmail(callback) {
                    if (scope.model.notifications.email
                        && scope.model.notifications.email.subject && scope.model.notifications.email.text
                        && scope.model.notifications.email.selectedUsers.length > 0) {
                        var data = {
                            subject : scope.model.notifications.email.subject,
                            text    : scope.model.notifications.email.text,
                            to      : scope.model.notifications.email.selectedUsers.join(',')
                        };
                        emailService.sendEmail(data, function (result) {
                            if (result) {
                                callback();
                            } else {
                                stdService.error('There was an error sending the e-mail');
                            }
                        });
                    }
                    callback();
                }

                function sendLiveMessage(callback) {
                    if (scope.model.notifications.liveMessage
                     && scope.model.notifications.liveMessage.subject && scope.model.notifications.liveMessage.text) {
                        var data = {
                            text: scope.model.notifications.liveMessage.subject,
                            details: scope.model.notifications.liveMessage.text
                        };
                        liveMessageService.sendPublicMessage(data, function (result) {
                            if (result) {
                                callback();
                            } else {
                                stdService.error('There was an error sending the live message');
                            }
                        });
                    }
                    callback();
                }
            }
        };
    }]);
})(window.COMPONENTS);
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editPages', ['$rootScope', '$routeParams', '$location', 'portalService', 'pageService', 'validationService', '$timeout',
                                       'stringService', 'timerService', 'stdService', 'arrayService', 'constantsService', 'i18nService', 'i18nDbService',
    function ($rootScope, $routeParams, $location, portalService, pageService, validationService, $timeout,
              stringService, timerService, stdService, arrayService, constantsService, i18nService, i18nDbService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editPages.html',
            scope: {
                onLayer : '='
            },
            link: function link(scope) {

                function getCurrentPageIndex() {
                    var i, currentPage = pageService.getCurrentPage();
                    for (i = 0; i < scope.pages.length; i += 1) { if (scope.pages[i]._id === currentPage._id) { break; }}
                    return i;
                }

                function savePages(callback) {
                    var processedPages = 0;

                    //Check if all the pages have been processed, and invokes the callback in that case
                    function registerAndFinish() {
                        processedPages += 1;
                        if (processedPages === scope.pages.length) { callback(); }
                    }

                    function saveCallback(page) {
                        saveItems(page);
                        registerAndFinish();
                    }

                    function createPage(data, page) {
                        delete data.added;
                        pageService.createPage(data, function () { saveCallback(page); });
                    }

                    function deletePage(data, page) {
                        delete data.deleted;
                        pageService.deletePage(page._id, function () { saveCallback(page); });
                    }

                    function updatePage(data, page) {
                        delete data.updated;
                        pageService.updatePage(page._id, data, function () { saveCallback(page); });
                    }

                    function saveItems(parentItem) {
                        var items = (parentItem) ? parentItem.items : scope.items;
                        items.forEach(function (page) {
                            var data = $.extend(true, {}, page);
                            data.parentPageId = (parentItem) ? parentItem._id : null;
                            delete data.areSubItemsHidden; //Delete the areSubPagesHidden flag as it should not persist
                            delete data._id;
                            delete data.items;
                            if (data.added) {
                                createPage(data, page);
                            } else if (data.deleted) {
                                deletePage(data, page);
                            } else if (data.updated) {
                                updatePage(data, page);
                            } else {
                                saveCallback(page);
                            }
                        });
                    }

                    saveItems(null);
                }

                scope.registerSelectedPageChange = function () {
                    if (scope.selectedPage) { scope.selectedPage.updated = true; }
                };

                scope.onAddPage = function ($page) {
                    $page.type = scope.pageTypes[0].id;
                };

                scope.onLayer.save = function (callback) {
                    savePages(function () {
                        var currentPageIndex = getCurrentPageIndex();
                        $location.path($routeParams.portal + '/' + scope.pages[currentPageIndex].url);
                        callback();
                    });
                };

                scope.pageTypes = [
                    { id: constantsService.pageTypes.apps,          text: constantsService.pageTypes.apps },
                    { id: constantsService.pageTypes.externalLink,  text: constantsService.pageTypes.externalLink }
                ];
                scope.targets = [
                    { id: '_blank', text: i18nService('editPages.target.newTab') },
                    { id: '_self', text: i18nService('editPages.target.sameTab') }
                ];
                scope.level2Tabs = [{ title: 'General' }, { title: 'Section 2' }, { title: 'Section 3' }];
            }
        };
    }]);
})(window.COMPONENTS);

COMPONENTS.directive('editStyles', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'editStyles.html',
        scope: {
            model       : '=',
            onLayer : '='
        },
        link: function link(scope) {
            scope.level2Tabs = [
                { title: 'editStyles.portal',   styleClass : 'webIcon' },
                { title: 'editStyles.app',      styleClass : 'appIcon' }
            ];
        }
    };
}]);

COMPONENTS.directive('editTag', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editTag.html',
        scope: {
            tag         : '=model',
            onLayer : '='
        },
        link: function link(scope) {
            scope.onLayer.save = function (callback) {
                tagService.updateTag(scope.tag, function () {
                    callback();
                });
            };
        }
    };
}]);
COMPONENTS.directive('editTagList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editTagList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);
COMPONENTS.directive('editUser', ['$routeParams', 'userService', 'mediaService', 'tagService', 'roleService', 'i18nService',
function ($routeParams, userService, mediaService, tagService, roleService, i18nService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editUser.html',
        scope: {
            user        : '=model',
            onLayer     : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.roles         = roleService.getRoles();
            //Duplicate the array to avoid infecting the original languages object
            scope.languages = $.extend(true, [], i18nService.getLanguages());
            scope.languages.unshift({ code: '', text: i18nService('editUser.language.inheritBrowser')});
            scope.clickToChangePassword = true;
            scope.defaultAvatarUrl = mediaService.getDefaultAvatarUrl();
            if (scope.user) {
                if (!scope.user.media) {
                    scope.user.media = {};
                }
            }
            scope.onLayer.save = function (callback) {
                userService.updateUser(scope.user, function (result) {
                    callback(result);
                });
            };
        }
    };
}]);
COMPONENTS.directive('editUserList', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editUserList.html',
        scope: {},
        controller: ["$scope", function ($scope) {
            $scope.config = {
                editable        : true,
                selectable      : true,
                multiSelectable : true,
                deletable       : true,
                creatable       : true
            };
        }]
    };
}]);
COMPONENTS.directive('stats', ['$rootScope', 'statsService', 'roleService', 'constantsService',
function($rootScope, statsService, roleService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'stats.html',
        scope: {},
        link: function link(scope) {

            var filter;

            function normalizeTimeTmpDelete(stats) {
                stats.forEach(function (stat) {
                    if (!stat['create.date']) { stat['create.date'] = '2013-04-01T22:00:00.000Z'; }
                });
            }

            function normalizeUserData(stats) {
                var normalizedData = [];
                stats.forEach(function (stat) {
                    if(normalizeUserData.create) {
                        normalizedData.push({
                            label: (stat.create.author) ? stat.create.author.fullName : undefined,
                            value: stat.count
                        });
                    }
                });
                return normalizedData;
            }

            function normalizeUsersPerRoleData(stats) {
                var roleObj, normalizedData = [];
                stats.forEach(function (stat) {
                    roleObj = roleService.getRole(stat.role);
                    normalizedData.push({
                        label : (roleObj) ? roleObj.title : 'undefined',
                        value: stat.count
                    });
                });
                return normalizedData;
            }

            statsService.loadStats(constantsService.collections.content, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.newsPerDay = stats;
            });

            statsService.loadStats(constantsService.collections.users, {}, function (stats) {
                normalizeTimeTmpDelete(stats);
                scope.usersPerDay = stats;
            });

            filter = { groupBy : 'create.authorId'};
            statsService.loadStats(constantsService.collections.content, filter, function (stats) {
                scope.contentPerUser = normalizeUserData(stats);
            });

            filter = { groupBy : 'role'};
            statsService.loadStats(constantsService.collections.users, filter, function (stats) {
                scope.usersPerRole = normalizeUsersPerRoleData(stats);
            });

            filter = { groupBy : 'create.authorId'};
            statsService.loadStats(constantsService.collections.comments, filter, function (stats) {
                scope.commentsPerUser = normalizeUserData(stats);
            });
        }
    };
}]);
COMPONENTS.directive('styles', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'styles.html',
        scope: {
            model : '=styles'
        },
        link: function link() {
        }
    };
}]);

COMPONENTS.directive('verticalTabs', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template:   '<ul class="tabs level2">' +
                        '<li class="button {{tab.styleClass}}" ng-repeat="tab in tabs" ng-class="isCurrentLayer($index)" ' +
                        'ng-click="setCurrentLayer($index)">' +
                            '<label i18n="{{tab.title}}"></label>' +
                        '</li>' +
                    '</ul>',
        scope: {
            tabs: '=verticalTabs'
        },
        link: function link(scope) {

            scope.isCurrentLayer = function (layer) {
                if (layer === scope.activePanel) {
                    return 'active';
                }
                return null;
            };

            scope.setCurrentLayer = function (tabIndex) {
                scope.activePanel = tabIndex;
                $('.content.level2 > ul').css('top', '-' + (tabIndex * 100) + '%');
            };

            scope.activePanel = 0;
        }
    };
}]);
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

                scope.setAppStyles = function () {
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
                    return (array) ? array.model[array.index[matcher]] : null;
                }

                function setSharedBindings() {
                    scope.bindings.model = scope.model;
                    scope.bindings.internalData = scope.internalData;
                }
            }
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.directive('appBridge', ['$injector', '$compile', '$timeout', '$templateCache',
    'objectService', 'stringService',
    function ($injector, $compile, $timeout, $templateCache, oS, sS) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    bindings        : '=',
                    config          : '=',
                    onLayer         : '=',
                    onEvent         : '=',
                    src             : '@',
                    view            : '@'
                },
                link: function link(scope, element) {

                    var childScope;
                    scope.$watch('src', function(newSrc) {
                        if(newSrc) {
                            childScope = scope.$new(true);
                            $timeout(function() {
                                inheritParentScopeModel();
                                if(childScope.src && childScope.view) {
                                    executeServiceMethod(childScope.src, childScope.view);
                                }
                            });
                        }
                    });

                    /** Private methods **/
                    function inheritParentScopeModel() {
                        childScope.internalData = scope.internalData;
                        childScope.model        = scope.model;
                        childScope.onLayer      = scope.onLayer;
                        childScope.src          = scope.src;
                        childScope.view         = scope.view;
                        childScope.onEvent      = scope.onEvent;
                        setCustomBindings(childScope, scope.bindings);
                    }

                    function setCustomBindings(childScope, bindings) {
                        var customBindingKeys;
                        if(bindings) {
                            customBindingKeys = oS.getRootKeys(bindings);
                            customBindingKeys.forEach(function(customBindingKey) {
                                childScope[customBindingKey] = scope.bindings[customBindingKey];
                            });
                        }
                    }

                    function executeServiceMethod(src, view) {
                        var appElm = compileTemplate(src, view);
                        manageServiceFns(src, view, appElm);
                    }

                    function compileTemplate(src, view) {
                        var templateId  = src + sS.capitalize(view),
                            appElm      = $($templateCache.get(src + sS.capitalize(view)  + '.html'));
                        element.html(appElm);
                        element.addClass(templateId);
                        $compile(appElm)(childScope);
                        return appElm;
                    }

                    function manageServiceFns(src, view, appElm) {
                        var appService = $injector.get(src + 'Service');
                        defineViewFn(appService, view, appElm);
                        defineOnLayerSaveFn(appService, view);
                        defineOnResizeFn(appService, appElm);
                    }

                    function defineOnLayerSaveFn(appService, view) {
                        var onSaveFn = 'on' + sS.capitalize(view) + 'Save';
                        if(childScope.onLayer && childScope.onLayer.save && appService[onSaveFn]) {
                            childScope.onLayer.save = function (callback) {
                                appService[onSaveFn](childScope, function() {
                                    callback();
                                });
                            };
                        }
                    }

                    function defineViewFn(appService, view, appElm) {
                        if(appService[view]) {
                            appService[view](childScope, appElm);
                        }
                    }

                    function defineOnResizeFn(appService, appElm) {
                        if(childScope.onEvent) {
                            childScope.onEvent.resize = function() {
                                var onResizeFn = 'onResize';
                                if(appService[onResizeFn]) {
                                    appService[onResizeFn](childScope, appElm);
                                }
                            };
                        }
                    }
                    /** End of private methods **/
                }
            };
        }]);
})();
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
(function() {
    COMPONENTS.directive('bannerCanvas', ['$compile', 'timerService', 'arrayService', 'keyboardService',
    'roleService', 'sessionService', 'bannerItemService',
    function ($compile, timerService, arrayService, keyboardService, roleService, sessionService,
      bannerItemService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'bannerCanvas.html',
            scope: {
                model: '=ngModel',
                onChange: '&'
            },
            link: function link(scope, element) {

                var gridElm     = $(' > .grid', element),
                    directiveId = 'bannerCanvas',
                    gridSize    = 50,
                    totalCols   = Math.floor(element.width() / gridSize),
                    totalRows   = Math.floor(element.height() / gridSize),
                    userSession = sessionService.getUserSession(),
                    isCreator   = roleService.hasCreatorRole(userSession);

                createGrid();
                registerKeyboardEvents();

                if(!scope.model) {
                    scope.model = [];
                }

                scope.overflow = { visible: false };
                scope.items = {
                    index: {},
                    data: scope.model
                };

                scope.addItem = addItem;

                scope.onItemChange = function() {
                    propagateChanges();
                };

                scope.isReadOnly = function() {
                    return !isCreator || element.attr('readonly') || element.attr('disabled');
                };

                /** Private methods **/
                function createGrid() {
                        var colPos, rowPos;
                    for(var i = 0; i < totalCols; i++) {
                        colPos = (i + 1) * gridSize;
                        gridElm.append('<div class="ruler col" style="top: 0; left: ' + colPos + 'px"></div>');
                    }
                    for(var j = 0; j < totalRows; j++) {
                        rowPos = (j + 1) * gridSize;
                        gridElm.append('<div class="ruler row" style="top: ' + rowPos + 'px; left: 0"></div>');
                    }
                }

                function addItem(type) {
                    createItem(type, bannerItemService.getDefaultValue(type));
                }

                function createItem(type, value) {
                    var itemId  = timerService.getRandomNumber(), itemSize = 2 * gridSize,
                        topPos  = Math.floor(Math.random() * totalRows - 1) * gridSize,
                        leftPos = Math.floor(Math.random() * totalCols - 1) * gridSize;
                    scope.items.index[itemId] = scope.items.data.length;
                    scope.items.data.push({
                        id: itemId,
                        type: type,
                        value: value,
                        size: { width: itemSize, height: itemSize },
                        position: { //Set a random position for the new item
                            top : (topPos > 0) ? topPos : 0,
                            left: (leftPos > 0) ? leftPos : 0
                        }
                    });
                    propagateChanges();
                }

                function registerKeyboardEvents() {
                    keyboardService.register('del', directiveId, function () {
                        deleteSelectedItems();
                        scope.$apply();
                    });
                }

                function deleteSelectedItems() {
                    $('.bannerItem.active').each(function() {
                        var itemId      = $(this).attr('id'),
                            itemIndex   = scope.items.index[itemId];
                        delete scope.items.index[itemId];
                        arrayService.delete(scope.items.data, itemIndex);
                        updateIndexes();
                    });
                    propagateChanges();
                }

                function updateIndexes() {
                    angular.forEach(scope.items.data, function(item, $index) {
                        scope.items.index[item.id] = $index;
                    });
                }

                function propagateChanges() {
                    if(scope.onChange) {
                        scope.onChange();
                    }
                }
                /** End of private methods **/
            }
        };
    }]);
})();
(function() {
    COMPONENTS.directive('bannerItem', ['bannerItemService', '$timeout',
    'editBoxUtilsService', 'domService',
    function (bIS, $timeout, editBoxUtilsService, domService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            scope: {
                item: '=data',
                overflow: '=',
                onItemChange: '&onChange',
                readOnly: '='
            },
            templateUrl: 'bannerItem.html',
            controller: function controller() {

            },
            link: function link(scope, element) {

                var itemService = bIS.getTypeService(scope.item.type),
                    inputElm = $(' > input.selectHandler', element),
                    editButtonElm = $(' > button.edit', element),
                    keepItemSelected = false,
                    borderWidth = domService.getObjBorderWidth(element),
                    gridSize = bIS.getGridSize(),
                    borders = {
                        horizontal  : borderWidth.left + borderWidth.right,
                        vertical    : borderWidth.top + borderWidth.bottom
                    };

                scope.template = getItemTemplate();
                bIS.setDomCoordinatesFromModel(scope.item, element, borders);

                if(!scope.readOnly) {
                    defineListeners();
                }

                /** Private methods **/
                function getItemTemplate() {
                    var template = $(itemService.getTemplate());
                    template.addClass('item ' + scope.item.type);
                    return template;
                }

                function defineListeners() {
                    setDraggable();
                    setResizable();
                    element.click(onClickFn);
                    inputElm.focus(onFocusFn);
                    inputElm.blur(onBlurFn);
                    scope.editItem = onEditItemFn;
                }

                function setDraggable() {
                    element.draggable({
                        grid: [ gridSize,gridSize ],
                        start: function() {
                            select();
                        },
                        stop: function() {
                            //Update the model before propagating the changes
                            bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, borders);
                            bIS.propagateChanges(scope.onItemChange);
                        }
                    });
                }

                function removeDraggable() {
                    element.draggable( "destroy" );
                }

                function setResizable() {
                    element.resizable({
                        //aspectRatio: true,
                        grid: gridSize,
                        handles: 'ne, nw, se, sw',
                        resize: onResizeItemFn,
                        stop: onStopResizeItemFn
                    });
                }

                function onClickFn(e) {
                    if(!editBoxUtilsService.isEditBoxClicked(e)) {
                        select();
                    }
                }

                function onFocusFn() {
                    element.addClass('active');
                }

                function onBlurFn() {
                    unselect();
                }

                function onEditItemFn() {
                    keepItemSelected    = true;
                    scope.internalData  = {};
                    scope.panels        = getEditPanels();
                    scope.onSave        = onSaveEditBox;
                    scope.onClose       = onCloseEditBox;
                    showOverflow();
                    //Avoid dragging while the edit box is opened to avoid problems with content editable
                    removeDraggable();
                    editBoxUtilsService.showEditBox(scope, editButtonElm, editButtonElm);
                }

                function onResizeItemFn() {
                    if(itemService.onResizeItem) {
                        itemService.onResizeItem(scope.template);
                        scope.$apply();
                    }
                }

                function onStopResizeItemFn() {
                    bIS.refresh(scope.item, scope.template, element, borders);
                    bIS.propagateChanges(scope.onItemChange);
                }

                function select() {
                    inputElm.addClass('forceVisible');
                    inputElm.focus();
                }

                function unselect() {
                    $timeout(function() {
                        if(!keepItemSelected) {
                            element.removeClass('active');
                            inputElm.removeClass('forceVisible');
                            //Update the model before propagating the changes
                            bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, borders);
                        }
                    }, 150);
                }

                function showOverflow() {
                    scope.overflow.visible = true;
                }

                function hideOverflow() {
                    scope.overflow.visible = false;
                }

                function getEditPanels() {
                    return itemService.getEditPanels(scope.item, scope.template, element, borders);
                }

                function onSaveEditBox() {
                    bIS.propagateChanges(scope.onItemChange);
                }

                function onCloseEditBox() {
                    keepItemSelected = false;
                    unselect();
                    hideOverflow();
                    setDraggable(); //Enable dragging again once the edit box is closed
                    bIS.refresh(scope.item, scope.template, element, borders);
                    bIS.propagateChanges(scope.onItemChange);
                }
                /** End of private methods **/
            }
        };
    }]);
})();
COMPONENTS.directive('lineChart', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		template: ' <div class="lineChart chart" ng-style="getChartSize()" ng-show="data.length > 0"></div>',
        scope: {
            data : '='
        },
		link: function link(scope, element) {

            var elmWidth = element.width();
            scope.$watch('data', function (newVal, oldVal) {
                if (sessionService.isUserLogged() && newVal && newVal !== oldVal) {
                    element.html('');
                    if (scope.data.length > 0) {
                        //noinspection JSHint
                        new Morris.Line({
                            // ID of the element in which to draw the chart.
                            element: element,
                            // Chart data records -- each entry in this array corresponds to a point on the chart.
                            data: scope.data,
                            // The name of the data record attribute that contains x-values.
                            xkey: 'create.date',
                            // A list of names of data record attributes that contain y-values.
                            ykeys: ['count'],
                            // Labels for the ykeys -- will be displayed when you hover over the chart.
                            labels: ['count'],
                            lineColors: ['#32b4e4']
                        });
                    }
                }
            }, true);

            scope.getChartSize = function() {
                return {
                    width   : elmWidth,
                    height  : elmWidth * 0.45
                };
            };
		}
	};
}]);

COMPONENTS.directive('pieChart', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		template: ' <div class="pieChart chart" ng-style="getChartSize()" ng-show="data.length > 0"></div>',
        scope: {
            data : '='
        },
		link: function link(scope, element) {

            var elmWidth = element.width();

            scope.$watch('data', function (newVal, oldVal) {
                if (sessionService.isUserLogged() && newVal && newVal !== oldVal) {
                    element.html('');
                    if (scope.data.length > 0) {
                        //noinspection JSHint
                        new Morris.Donut({
                            element: element,
                            data: scope.data
                        });
                    }
                }
            }, true);

            scope.getChartSize = function() {
                var boxSize     = elmWidth * 0.6,
                    marginLeft  = (elmWidth - boxSize) / 2;
                return {
                    width       : boxSize,
                    height      : boxSize,
                    marginLeft  : marginLeft
                };
            };
		}
	};
}]);

(function ()  {
    'use strict';
    COMPONENTS.directive('comment', ['$compile', 'portalService', 'dateService', 'objectService', 'mediaService',
                                    'commentsService', 'constantsService', 'tooltipService', 'sessionService',
    function ($compile, portalService, dateService, objectService, mediaService, commentsService, constantsService,
              tooltipService, sessionService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                comment: '='
            },
            templateUrl: 'comment.html',
            link: function link(scope, element) {

                var repliesHtml =   '<comments target-id="comment._id" parent-comment="comment" hide-add="hideAdd" ' +
                                    'placeholder="comments.addReply.placeholder"></comments>';

                $('.repliesWrapper', element).replaceWith($compile(repliesHtml)(scope));

                scope.hideAdd = true;
                scope.comment.isEditable = false;
                scope.isLoggedUser = sessionService.isUserLogged();
                scope.isSelfActionAllowed = isSelfActionAllowed();
                scope.getDownloadUrl = function (media) {
                    return (media) ? mediaService.getDownloadUrl(media) : false;
                };

                scope.getFormattedDate = function () {
                    return dateService.getFormattedDate(scope.comment.create.date);
                };

                scope.showRatings = function () {
                    return (!objectService.isEmpty(scope.allowRatings))
                        ? scope.allowRatings
                        : portalService.getPortal().comments.allowRatings;
                };

                scope.toggleReply = function() {
                    scope.hideAdd = scope.hideAdd !== true;
                };

                scope.toggleEdit = function() {
                    scope.comment.isEditable = scope.comment.isEditable !== true;
                };

                scope.updateComment = function() {
                    commentsService.updateComment(scope.comment._id, { text: scope.comment.text});
                };

                scope.deleteComment = function() {
                    deleteCommentRecursively(scope.comment);
                    tooltipService.hide();
                };

                /** Private methods **/
                function deleteComment(comment) {
                    commentsService.deleteComment(comment._id, function() {
                        comment.deleted = true;
                    });
                }

                function deleteCommentRecursively(comment) {
                    if(comment.comments && comment.comments.length) {
                        comment.comments.forEach(function(comment) {
                            deleteCommentRecursively(comment);
                        });
                    }
                    deleteComment(comment);
                }

                function isSelfActionAllowed() {
                    return scope.isLoggedUser && scope.comment.create.author._id === sessionService.getUserSession()._id;
                }
                /** End of private methods **/
            }
        };
    }]);
})();
(function ()  {
    'use strict';
    COMPONENTS.directive('comments', ['commentsService', 'sessionService', 'mediaService',
    function (commentsService, sessionService, mediaService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                targetId        : '=',
                onAdd           : '=',
                allowRatings    : '=',
                parentComment   : '=',
                hideAdd         : '=',
                placeholder     : '@'
            },
            templateUrl: 'comments.html',
            link: function link(scope) {

                scope.loggedUser = sessionService.isUserLogged();

                scope.$watch('targetId', function (newVal) {
                    if (newVal) {
                        commentsService.loadComments(scope.targetId, function(comments) {
                            scope.comments = comments.results;
                            if(scope.parentComment) {
                                //noinspection JSPrimitiveTypeWrapperUsage
                                scope.parentComment.comments = scope.comments;
                            }
                        });
                    }
                });

                scope.createComment = function () {
                    commentsService.createComment(scope.newCommentText, scope.targetId, function(newComment) {
                        scope.newCommentText = ''; //Clean the comment field
                        sessionService.addSessionDataToModel(newComment); //Add media info to the newly created comment
                        scope.comments.push(newComment);
                        if(scope.hideAdd !== undefined) {
                            scope.hideAdd = true;
                        }
                        if (scope.onAdd) {
                            scope.onAdd();
                        }
                    });
                };

                scope.getUserAvatarUrl = function () {
                    return (sessionService.isUserLogged())
                        ? mediaService.getDownloadUrl(sessionService.getUserSession().media) : false;
                };
            }
        };
    }]);
})();

(function() {
    'use strict';
    COMPONENTS.directive('contentEditable', [ 'caretService', 'roleService', 'sessionService', 'mediaService',
    'contentEditableService', 'contentEditableRichContentService', 'contentEditableSelectMediaService',
    function (caretService, roleService, sessionService, mediaService, contentEditableService,
              contentEditableRichContentService, contentEditableSelectMediaService) {
        return {
            priority: -1,
            require: 'ngModel',
            scope : {
                contentEditable : '=',
                content         : '=ngModel',
                customPanels    : '=panels',
                options         : '=',
                placeholder     : '@',
                onBlur          : '&',
                uxChange        : '&'
            },
            replace: true,
            templateUrl: 'contentEditable.html',
            link: function (scope, element, attrs, ngModelCtrl) {

                var cEDomObj = $(' > .editableArea > [contenteditable]', element),
                    userSession = sessionService.getUserSession();

                scope.isCreator = function () { return roleService.hasCreatorRole(userSession); };

                // view -> model
                scope.onKeyup = function () {
                    contentEditableService.updateValue(scope, cEDomObj, ngModelCtrl);
                    scope.showEditBox();
                };

                scope.isEditable = function() {
                    //noinspection JSValidateTypes
                    var hasRights = (scope.contentEditable !== undefined) ? scope.contentEditable : scope.isCreator();
                    return hasRights && !element.attr('readonly') && !element.attr('disabled');
                };

                scope.$watch('content', function () {
                    //Update the DOM just if it's an external change of the model
                    //(i.e. cleaning the box after adding a comment)
                    //In practise, that means to update it if it's not being modified by the user,
                    //so it doesn't have the focus at this moment
                    if (!cEDomObj.is(':focus')) {
                        cEDomObj.html((scope.content) ? scope.content : ''); //Set the view value
                        //compile the links to get their tooltip
                        contentEditableService.compileElement(scope, $('a, img', cEDomObj));
                    }
                    contentEditableService.handlePlaceholder(scope);
                });

                scope.showEditBox = function () {
                    contentEditableRichContentService.showEditBox(scope, cEDomObj, ngModelCtrl);
                };

                scope.showEditBox2 = function (sMDomObj) {
                    contentEditableSelectMediaService.showEditBox(scope, cEDomObj, sMDomObj, ngModelCtrl);
                };

                scope.onClose = function() {
                    scope.showActions = false;
                };

                scope.$watch('newMedia', function(newVal) {
                    var imageId, imageObj, downloadUrl = mediaService.getDownloadUrl(newVal);
                    if(newVal && newVal._id) {
                        imageId = caretService.insertImage(downloadUrl, cEDomObj, 'onMediaClick');
                        imageObj = $('#' + imageId, cEDomObj);
                        contentEditableService.compileElement(scope, imageObj);
                        contentEditableService.updateValue(scope, cEDomObj, ngModelCtrl);
                    }
                });

                cEDomObj.focus(function () {
                    scope.showActions = true;
                });

                scope.onMediaClick = function(mediaId) {
                    var imageObj = $('#' + mediaId, cEDomObj);
                    scope.showEditBox2(imageObj);
                };

                cEDomObj.blur(function () {
                    contentEditableService.propagateChanges(scope);
                });

                //noinspection JSUnresolvedVariable
                if (scope.options && scope.options.allowMultiLine === false) {
                    //noinspection JSUnresolvedFunction
                    cEDomObj.keypress(function (e) { return e.which !== 13; });
                }

                /** Private methods **/
                /** End of private methods **/
            }
        };
    }]);
})();
(function() {
    COMPONENTS.directive('richContent', ['pageService', 'constantsService', 'textSelectionService', 'stringService',
                                         'i18nService',
    function (pageService, constantsService, textSelectionService, stringService, i18nService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'richContent.html',
            scope: {
                style       : '=',
                model       : '=',
                config      : '=',
                onChange    : '&',
                onLayer     : '='
            },
            link: function link(scope) {

                scope.linkTypes = [
                    { id: 'internal',  text: i18nService('richContent.link.internal') },
                    { id: 'external', text: i18nService('richContent.link.external') }
                ];

                scope.propagateChanges = function () {
                    if (scope.onLayer && scope.onLayer.change) { scope.onLayer.change(scope.model); }
                    if (scope.onChange) { scope.onChange(); }
                };

                scope.setHeading = function() {
                    setHeading(scope.heading);
                };

                scope.setInternalLink = function () {
                    setLink(scope.internalLink, '_self');
                };

                scope.setExternalLink = function() {
                    setLink(stringService.normalizeExternalUrl(scope.externalLink), '_blank');
                };

                /** Private methods **/
                function getSelectedHeading() {
                    var headingId = textSelectionService.getSelectedHeadingId();
                    if(headingId) {
                        scope.heading = headingId;
                    }
                }
                function getSelectedLink() {
                    var linkId = textSelectionService.getSelectedLinkId();
                    if(stringService.isExternalUrl(linkId)) {
                        scope.externalLink = linkId;
                        scope.linkType = scope.linkTypes[1].id;
                    } else {
                        scope.internalLink = linkId;
                        scope.linkType = scope.linkTypes[0].id;
                    }
                }

                function setLink(link, target) {
                    if (link) {
                        textSelectionService.setLink({
                            id      : link,
                            href    : link,
                            title   : '<a href="' + link + '" target="' + target + '">' + link + '</a>',
                            target  : target
                        });
                    }
                }

                function setHeading(heading) {
                    textSelectionService.setHeading(heading);
                }

                function setHeadingOptions() {
                    scope.headingOptions = [
                        {value: 'normal',   text: 'Normal'},
                        {value: 'heading1', text: 'Heading 1'},
                        {value: 'heading2', text: 'Heading 2'},
                        {value: 'heading3', text: 'Heading 3'}
                    ];
                }

                function getPagesList() {
                    scope.pagesList = pageService.getPages();
                }

                /** End of private methods **/
                setHeadingOptions();
                getSelectedHeading();
                getSelectedLink();
                getPagesList();
            }
        };
    }]);
})();
(function() {
    COMPONENTS.directive('selectMedia', ['i18nService', function (i18nService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'selectMedia.html',
            scope: {
                mediaSize       : '=',
                config          : '=',
                onChange        : '&',
                onLayer         : '='
            },
            link: function link(scope) {

                scope.mediaSizes = [
                    { id: 'original',   text: i18nService('selectMedia.size.original') },
                    { id: 'small',      text: i18nService('selectMedia.size.small') },
                    { id: 'medium',     text:i18nService('selectMedia.size.medium') },
                    { id: 'big',        text: i18nService('selectMedia.size.big') }
                ];

                scope.propagateChanges = function (media) {
                    scope.onLayer.change(media, scope.mediaSize);
                    //if (scope.onChange) { scope.onChange({$data: media}); }
                };

                scope.onMediaChange = function($media) {
                    scope.propagateChanges($media);
                };
            }
        };
    }]);
})();
(function() {
    COMPONENTS.directive('toggleStyle', ['$timeout', function ($timeout) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            template: '<button ng-click="toggleState()" ng-class="{active:isActive()}" on-change="propagateChanges()"></button>',
            scope: {
                model       : '=ngModel',
                onChange    : '&'
            },
            link: function link(scope, element, attrs) {

                scope.toggleState = function () {
                    /** @namespace attrs.inactiveWhen */
                    /** @namespace attrs.activeWhen */
                    scope.model = (!scope.isActive()) ? attrs.activeWhen : attrs.inactiveWhen || '';
                    //Due to some strange reason, it's possible that at this moment the model has not been update yet,
                    //so the onChange method propagates the old one. We execute the callback in a new thread to avoid this
                    $timeout(function () { if (scope.onChange) { scope.onChange(); }}, 0);
                };

                scope.isActive = function () {
                    return scope.model === attrs.activeWhen;
                };
            }
        };
    }]);
})();
COMPONENTS.directive('globalMsg', ['$rootScope', 'globalMsgService', 'domService',
function ($rootScope, globalMsgService, domService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {},
        template:   '<div id="globalMsg" ng-class="getActiveStyleClass()">' +
                        '<div class="text">' +
                            '<label>{{globalMsg.text}}</label> ' +
                            '<a href="#" ng-show="globalMsg.details" ng-click="toggleDetails()">[Details]</a>' +
                            '<div class="details" ng-show="isDetailsVisible"><label>{{globalMsg.details}}</label></div>' +
                        '</div>' +
                        '<div class="actions"><button class="removeIcon" ng-click="hide()"></button></div>' +
                    '</div>',
		link: function link(scope) {

            globalMsgService.onShow(function (text, details) {
                //Show the global message if it was not visible already
                if (!scope.globalMsg) {
                    scope.globalMsg = {
                        text: text,
                        details: details
                    };
                    //Maybe the loading message is visible, so it's necessary to remove it
                    domService.removeLoadingFeedback($('body'));
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                }
            });

            globalMsgService.onHide(function () {
                delete scope.globalMsg;
            });

            scope.isDetailsVisible = false;

            scope.hide = function () {
                globalMsgService.hide();
            };

            scope.getActiveStyleClass = function () {
                return (scope.globalMsg) ? 'active' : '';
            };

            scope.toggleDetails = function () {
                scope.isDetailsVisible = scope.isDetailsVisible === false;
            };
		}
	};
}]);

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

COMPONENTS.directive('urlToken', ['i18nDbService', 'stringService', function (i18nDS, stringService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            input   : '=',
            output  : '='
        },
        template: '<label>{{output}}</label>',
		link: function link(scope) {
            scope.$watch('input', function(newVal) {
                var updatedInput, output;
                if(newVal !== undefined) {
                    updatedInput = (i18nDS.hasI18nStructure(newVal))
                                    ? i18nDS.getI18nProperty(newVal).text
                                    : newVal;
                    output = stringService.replaceToken(updatedInput, ' ', '-', false);
                    scope.output = stringService.toCamelCase(output);
                }
            }, true);
		}
	};
}]);

(function () {
    'use strict';
    COMPONENTS.directive('i18n', ['$rootScope', 'i18nService', function ($rootScope, i18nService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                i18n: '@'
            },
            template: '<label>{{label}}</label>',
            link: function link(scope) {

                scope.$watch('i18n', function () {
                    setLabelValue();
                });

                $rootScope.$on('languageChanged', function () {
                    setLabelValue();
                });

                function setLabelValue() {
                    scope.label = i18nService(scope.i18n);
                }
            }
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.directive('i18nDb', ['$rootScope', 'i18nService', 'i18nDbService',
    function ($rootScope, i18nService, i18nDbService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                i18nDb: '='
            },
            template: '<label ng-bind-html-unsafe="label.text"></label>',
            link: function link(scope) {

                function updateLabel() {
                    if (scope.i18nDb) {
                        scope.label = i18nDbService.getI18nProperty(scope.i18nDb);
                    }
                }

                updateLabel();
                scope.$watch('i18nDb', function () {
                    updateLabel();
                });
                $rootScope.$on('languageChanged', function () {
                    updateLabel();
                });
            }
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.directive('i18nDbInput', ['$rootScope', '$compile', 'i18nService', 'i18nDbService', 'stringService', 'objectService',
    function ($rootScope, $compile, i18nService, i18nDbService, stringService, objectService) {
        var i18nPreffix = '_i18n_';
        return {
            priority: 1000,
            restrict: 'A',
            replace: true,
            transclude: 'element',
            controller: ['$scope', '$element', '$attrs', '$transclude', '$compile',
                function ($scope, $element, $attrs, $transclude, $compile) {
                    this.i18nNgModel = stringService.replaceToken(i18nPreffix + $attrs.ngModel, '\\.', '_');
                    $element.removeAttr('i18n-db-input');
                    $element.attr('ng-model', this.i18nNgModel + '.text');
                    $compile($element)($scope);
                }],
            template: '<input />',
            link: function (scope, element, attrs, controller) {

                var hasI18nStructure, isDisabled, originalModelLeafPointer,
                    defaultLanguage = i18nService.getDefaultLanguage(), ngModelLevels = attrs.ngModel.split('.'),
                    originalModelParentLeafPointer, leafProp, currentLanguage, creatingFromCustomLanguage;

                //Bind with the click function in a new thread as otherwise some components
                //could not have been initialized yet
                setTimeout(function() {
                    element.click(function () {
                        currentLanguage = i18nService.getCurrentLanguage();
                        if (isDisabled) {
                            isDisabled = false;
                            $(this).removeAttr('readonly');
                            originalModelLeafPointer[currentLanguage] = {};
                            originalModelLeafPointer[currentLanguage].text = originalModelLeafPointer[defaultLanguage].text;
                            scope[controller.i18nNgModel] = originalModelLeafPointer[currentLanguage];
                            scope.$apply();
                        }
                    });
                });

                scope.$watch(attrs.ngModel, function (newVal) {
                    updateModel(newVal);
                });

                $rootScope.$on('languageChanged', function (e, newLanguage) {
                    currentLanguage = newLanguage;
                    updateNgModel(scope.$eval(attrs.ngModel));
                });

                function updateModel(newVal) {
                    currentLanguage     = i18nService.getCurrentLanguage();
                    hasI18nStructure    = i18nDbService.hasI18nStructure(newVal);
                    setOriginalModelPointers(newVal, hasI18nStructure);
                    if (!hasI18nStructure) {
                        initI18nStructure(newVal);
                    }
                    updateNgModel(newVal);
                    hasI18nStructure = true;
                }

                function updateNgModel(newVal) {
                    if ((currentLanguage === defaultLanguage) || creatingFromCustomLanguage) {
                        updateEditableNgModel(defaultLanguage);
                    } else if (i18nDbService.hasI18nStructure(newVal)) {
                        updateEditableNgModel(currentLanguage);
                    } else {
                        updateReadonlyNgModel();
                    }
                }

                function updateEditableNgModel(language) {
                    scope[controller.i18nNgModel] = originalModelLeafPointer[language];
                    isDisabled = false;
                    element.removeAttr('readonly');
                }

                function updateReadonlyNgModel() {
                    scope[controller.i18nNgModel] = originalModelLeafPointer[defaultLanguage];
                    isDisabled = true;
                    element.attr('readonly', 'readonly');
                }

                function initLeafStructure() {
                    originalModelParentLeafPointer[leafProp] = {};
                    originalModelParentLeafPointer[leafProp][defaultLanguage] = {};
                    originalModelLeafPointer = originalModelParentLeafPointer[leafProp];
                }

                function initDefaultLanguageStructure(newVal) {
                    originalModelLeafPointer[defaultLanguage] = {};
                    originalModelLeafPointer[defaultLanguage].text = newVal;
                }

                function initI18nStructure(newVal) {
                    //If the leaf object was a primitive one (i.e. a string), we should get its parent object
                    //and initialize a new object in order to keep the double binding
                    if (!objectService.isObject(newVal)) {
                        initLeafStructure();
                        initDefaultLanguageStructure(newVal);
                        if (currentLanguage !== defaultLanguage) {
                            creatingFromCustomLanguage = true;
                        }
                    } else {
                        creatingFromCustomLanguage = false;
                    }
                }

                function setOriginalModelPointers(newVal, hasI18nStructure) {
                    if (!hasI18nStructure) { //Create the pointer to the leaf objects
                        setOriginalModelInitPointers();
                    } else {  //The pointers are already created, so we just need to point to the leafs
                        setOriginalModelModifiedPointers(newVal);
                    }
                }

                function setOriginalModelInitPointers() {
                    if (!scope[ngModelLevels[0]]) { scope[ngModelLevels[0]] = {}; }
                    scope[i18nPreffix + ngModelLevels[0]] = {};
                    originalModelLeafPointer = scope[ngModelLevels[0]];
                    for (var i = 1; i < ngModelLevels.length; i += 1) {
                        if (!originalModelLeafPointer[ngModelLevels[i]]) {
                            originalModelLeafPointer[ngModelLevels[i]] = {};
                        }
                        originalModelParentLeafPointer = originalModelLeafPointer;
                        originalModelLeafPointer = originalModelLeafPointer[ngModelLevels[i]];
                        if (i === ngModelLevels.length - 1) { leafProp = ngModelLevels[i]; }
                    }
                }

                function setOriginalModelModifiedPointers(newVal) {
                    originalModelLeafPointer = newVal;
                }
            }
        };
    }]);
})();
COMPONENTS.directive('autoComplete', ['$rootScope', 'tagService', 'constantsService', 'i18nService', 'i18nDbService',
function ($rootScope, tagService, constantsService, i18nService, i18nDbService) {
    'use strict';
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="autoCompleteContainer"><input type="hidden" /></div>',
        require: '?ngModel',
        scope: {
            model       : '=ngModel',
            options     : '=ngOptions',
            multiple    : '@',
            placeholder : '@',
            labelKey    : '@',
            valueKey    : '@',
            onChange    : '=uxChange'
        },
        link: function link(scope, element, attrs, ctrl) {

            var autoCompleteObj = $(' > input[type="hidden"]', element);
            if (!attrs.valueKey) { attrs.valueKey = '_id'; }  //By default, use the _id tag as the export value

            autoCompleteObj.on("change", function (e) {
                onChange(e);
            });

            scope.$watch('options', function () {
                regenerateComponent();
            }, true /*Compare object for equality rather than for reference*/);

            /** Private methods **/
            function onChange(e) {
                if (e.added && e.added.newItem) {
                    delete e.added.newItem;
                    //Save the newly added element
                    tagService.createTag(e.added.text, function (newTag) {
                        e.val[e.val.length - 1] = newTag[attrs.valueKey];
                        updateModel(e.val);
                    });
                } else {
                    updateModel((e.val.length > 0) ? e.val : undefined);
                }
                if (scope.onChange) { scope.onChange(); }
            }

            function regenerateComponent() {
                if (scope.model) {
                    ctrl.$setViewValue(scope.model);
                }
                var setup = getSetup();
                autoCompleteObj.select2(setup).select2("val", scope.model); //It's necessary to provide a default value
            }

            function getSetup() {
                //noinspection JSValidateTypes
                return {
                    data                : { results: scope.options, text: getText },
                    multiple            : attrs.multiple === 'true',
                    placeholder         : i18nService(attrs.placeholder),
                    minimumInputLength  : 0,
                    id                  : getId,
                    createSearchChoice  : createSearchChoice,
                    initSelection       : initSelection,
                    formatResult        : formatResult,
                    formatSelection     : formatSelection
                };
            }

            function updateModel(newVal) {
                scope.model = newVal;
                ctrl.$setViewValue(scope.model);
                if (!$rootScope.$$phase) {
                    scope.$apply();
                }
            }

            function getText(item) {
                var labelKey = i18nDbService.getI18nProperty(item[attrs.labelKey]).text;
                return labelKey || '';
            }

            function getId(item) {
                return item[attrs.valueKey];
            }

            function createSearchChoice(term, data) {
                if ($(data).filter(function () {
                    var labelKey = i18nDbService.getI18nProperty(this[attrs.labelKey]).text;
                    return parseInt(labelKey.localeCompare(term), 10) === 0;
                }).length === 0) {
                    var choiceObj = {};
                    choiceObj.newItem = true;
                    choiceObj[attrs.valueKey] = term;   //Reserved attribute
                    choiceObj[attrs.labelKey] = term;
                    return choiceObj;
                }
                return null;
            }

            function initSelection(element, callback) {
                var data = [], ids = element.val().split(","), id;
                $(ids).each(function () {
                    id = this;
                    $(scope.options).each(function () {
                        if (parseInt(id.localeCompare("" + this[attrs.valueKey]), 10) === 0) {
                            //noinspection JSValidateTypes
                            if (attrs.multiple === 'true') {
                                data.push(this);
                            } else {
                                data = this;
                            }
                        }
                    });
                });
                callback(data);
            }

            function formatResult(item) {
                var labelKey = i18nDbService.getI18nProperty(item[attrs.labelKey]).text,
                    htmlMarkup = '<label>' + labelKey + '</label>';
                if (item.newItem) {
                    htmlMarkup += ' <i>(New item)</i>';
                }
                return htmlMarkup;
            }

            function formatSelection(item) {
                return i18nDbService.getI18nProperty(item[attrs.labelKey]).text;
            }
            /** End of private methods **/
        }
    };
}]);


COMPONENTS.directive('checkbox', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    'use strict';
    return {
        require: 'ngModel',
        restrict: 'A',
        replace: true,
        template:   '<div class="checkContainer">' +
                        '<input tabindex="{{tabindex}}" type="checkbox" id="checkbox{{$id}}">' +
                        '<label for="checkbox{{$id}}" ng-show="label" title="{{title}}" i18n-title>' +
                            '<label i18n="{{label}}"></label>' +
                        '</label>' +
                    '</div>',
        scope: {
            ngModel             : '=',
            ngClick             : '&ngClick',
            label               : '@',
            tabindex            : '@',
            title               : '@',
            blockUpdateModel    : '@' //Avoid updating the model
        },
        link: function link(scope, element, attrs, ngModelCtrl) {

            var externalModelChange = false;

            //The plugins needs to be instantiated in a new thread, as otherwise its works clicking on the input
            //but clicking on the label performs strangely as the reference to its input is not always satisfied
            $timeout(function () {
                element.iCheck({
                    checkboxClass: 'check icheckbox_square-blue',
                    increaseArea: '20%' // optional
                });
                if (scope.ngModel) { element.iCheck('check');
                } else { element.iCheck('uncheck'); }
            }, 0);

            scope.$watch('ngModel', function (newVal) {
                //Whenever the model changes externally, we need to visually update the component
                //The problem is that this update process will trigger the ifChecked / ifUnchecked methods
                //which will try to update again the model by themselves, causing a circular, infinite loop.
                //Consequently, it's necessary to distinguish when to update the model and when not from there
                //noinspection JSUnusedAssignment
                externalModelChange = true;
                element.iCheck((newVal) ? 'check' : 'uncheck');
                //Close the mutex after some courtesy delay
                setTimeout(function () {
                    externalModelChange = false;
                }, 0);
            });

            element.on('ifChecked', function () {
                updateState(true);
            });

            element.on('ifUnchecked', function () {
                updateState(false);
            });

            function updateState(newState) {
                //Update the model and side effects (i.e. ngClick callback, if case)
                //just if the change comes directly from the checkbox, not from a external source
                if (!externalModelChange) {
                    //In some situations, it could be interesting avoid updating the model
                    //whenever the state of the checkbox changes.
                    //This is mainly about the ng-click event, that can wire a function that will change
                    //the model by its own. It the model is updated here, that function will receive the opposite state
                    //so the toggle will probably do nothing
                    if (scope.blockUpdateModel !== 'true') {
                        scope.ngModel = newState;
                        //If the value has actually changed, propagate the view value change  to the ng-form controller
                        //so he'll set the $dirty state to the form
                        ngModelCtrl.$setViewValue(scope.ngModel);
                    }
                    if (!$rootScope.$$phase) { scope.$apply(); }
                    if (scope.ngClick) { scope.ngClick(); }
                }
            }
        }
    };
}]);

COMPONENTS.directive('colorPicker', ['styleService', 'i18nService', function (styleService, i18nService) {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        template:   '<div class="colorPicker">' +
                        '<input type="text" placeholder="{{getI18nPlaceholder()}}"/>' +
                        '<div class="transparentToggle" checkbox ng-model="isTransparent" label="colorPicker.transparent" ' +
                        'ng-click="toggleTransparent()" />' +
                    '</div>',
        scope: {
            model       : '=ngModel',
            placeholder : '@',
            onChange    : '&'
        },
		link: function link(scope, element, attrs, ngModelCtrl) {

            var rgbObj = null, inputElm = $(' > input[type="text"]', element);
            if (scope.model) {
                if(scope.model === 'transparent') { //Initialize the transparency, if case
                    scope.isTransparent = true;
                }
                rgbObj = styleService.rgbStrToRgbObj(scope.model);
                if (rgbObj) {
                    scope.model = styleService.rgbObjToHexStr(rgbObj);
                }
            }

            inputElm.minicolors({
                letterCase: 'uppercase',
                animationSpeed: 0,
                showSpeed: 0,
                hideSpeed: 0,
                show: function () {
                    removeTransparentColor();
                    $(this).focus();
                },
                changeDelay: 10, //Give some time margin to ensure that the change() callback takes the new value
                change: function (hex) {
                    //Normalize the model format to avoid problems with the lowercase translations
                    if(!scope.model) { scope.model = ''; }
                    //If the value has actually changed, propagate the view value change  to the ng-form controller
                    //so he'll set the $dirty state to the form
                    if (hex.toLowerCase() !== scope.model.toLowerCase()) {
                        ngModelCtrl.$setViewValue(scope.model);
                    }
                    scope.model = hex;
                    scope.$apply();
                    if (scope.onChange) { scope.onChange(); }
                }
            });

            //We're manually setting the default value of the component as the built-in 'defaultValue' option
            //makes the component perform in a strange way
            scope.$watch('model', function (newVal) {
                //Wrap the plugin in a try-catch statement as for some unknown reason sometimes the settings
                //don't arrive to the minicolor plugin so it throwns an error
                if(scope.isTransparent) { //Check if the current value is set to 'transparent'
                    try { inputElm.minicolors('value', ''); }
                    catch (ex) {}
                    setTransparentColor();
                } else {
                    try { inputElm.minicolors('value', newVal); }
                    catch (ex) {}
                }
            });

            scope.getI18nPlaceholder = function () {
                return i18nService(scope.placeholder);
            };

            scope.toggleTransparent = function() {
                if(scope.isTransparent) {
                    setTransparentColor();
                } else {
                    removeTransparentColor();
                }
                scope.$apply();
            };

            /** Private methods **/
            function setTransparentColor() {
                scope.isTransparent = true;
                scope.model = 'transparent';
                inputElm.attr('readonly', 'readonly');
            }

            function removeTransparentColor() {
                scope.isTransparent = false;
                scope.model = '';
                inputElm.removeAttr('readonly');
            }
		}
	};
}]);

COMPONENTS.directive('date', [function () {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        template: '<input type="text" ui-date="dateOptions" ui-date-format="yy-mm-dd" />',
        controller: ['$scope', function($scope) {
            $scope.dateOptions = {
                dateFormat: 'dd-mm-yy',
                changeYear: true,
                showAnim: false
            };
        }]
	};
}]);

(function() {
    'use strict';
    COMPONENTS.directive('fileUploader', ['$rootScope', 'globalMsgService', function ($rootScope, globalMsgService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'fileUploader.html',
            scope: {
                model           : '=ngModel',
                endpoint        : '@',
                onUpload        : '&',
                defaultMediaUrl : '=',
                multiple        : '@',
                preview         : '@'
            },
            link: function link(scope, element) {

                scope.selectFile = function () {
                    $('input[type="file"]', element).click();
                };

                scope.submit = function () {
                    //Submit in progress...
                    element.ajaxSubmit({
                        error: function (xhr) {
                            globalMsgService.show(xhr.responseText);
                        },
                        success: function (uploadedFile) {
                            success(uploadedFile);
                        }
                    });
                    //It's necessary to return false in order to avoid page refresh
                    return false;
                };

                /** Private methods **/
                function success(file) {
                    if (scope.model) {
                        scope.model = file[0];
                    }
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                    if (scope.onUpload) {
                        scope.onUpload({
                            $uploadedFile: file
                        });
                    }
                }
                /** End of private methods **/
            }
        };
    }]);
})();

(function() {
    'use strict';
    COMPONENTS.directive('password', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            templateUrl: 'password.html',
            scope: {
                model: '=ngModel',
                clickToChange: '='
            },
            link: function (scope) {
                scope.togglePassword = function() {
                    scope.changePasswordActive = scope.changePasswordActive !== true;
                    if(!scope.hangePasswordActive) {
                        scope.model = null;
                    }
                };
            }
        };
    }]);
})();
COMPONENTS.directive('radio', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
	'use strict';
    return {
        require: 'ngModel',
		restrict: 'A',
        replace: true,
        template:   '<div class="checkContainer">' +
                        '<input tabindex="{{tabindex}}" type="radio" id="radio{{$id}}" name="{{name}}">' +
                        '<label for="radio{{$id}}" ng-show="label" title="{{title}}" i18n-title>' +
                            '<label i18n="{{label}}"></label>' +
                        '</label>' +
                    '</div>',
        scope: {
            ngModel : '=',
            name    : '@',
            label   : '@',
            tabindex: '@',
            title   : '@'
        },
		link: function link(scope, element, attrs, ngModelCtrl) {

            var externalModelChange = false;

            //The plugins needs to be instantiated in a new thread, as otherwise its works clicking on the input
            //but clicking on the label performs strangely as the reference to its input is not always satisfied
            $timeout(function () {
                element.iCheck({
                    radioClass: 'check iradio_square-blue',
                    increaseArea: '20%' // optional
                });
            }, 0);
            if (scope.ngModel === attrs.value) {
                $(' > input', element).attr('checked', true);
            }

            element.on('ifChecked', function () {
                updateState(attrs.value);
            });

            function updateState(newState) {
                //Update the model and side effects (i.e. ngClick callback, if case)
                //just if the change comes directly from the checkbox, not from a external source
                if (newState && !externalModelChange) {
                    //In some situations, it could be interesting avoid updating the model
                    //whenever the state of the checkbox changes.
                    //This is mainly about the ng-click event, that can wire a function that will change
                    //the model by its own. It the model is updated here, that function will receive the opposite state
                    //so the toggle will probably do nothing
                    if (scope.blockUpdateModel !== 'true') {
                        scope.ngModel = newState;
                        //If the value has actually changed, propagate the view value change  to the ng-form controller
                        //so he'll set the $dirty state to the form
                        ngModelCtrl.$setViewValue(scope.ngModel);
                    }
                    if (scope.ngClick) { scope.ngClick(); }
                    if (!$rootScope.$$phase) { scope.$apply(); }
                }
            }
		}
	};
}]);

COMPONENTS.directive('rating', ['rateService', 'sessionService', function (rateService, sessionService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            rating              : '=',
            targetId            : '=',
            targetAuthorId      : '=',
            targetCollection    : '@',
            starSize            : '@height'
        },
		templateUrl: 'rating.html',
		link: function link(scope) {

            var ratingAllowed;

            scope.$watch('rating', function () {
                initRating();
            });

            scope.$watch('targetId', function () {
                initRating();
            });

            scope.$watch('targetAuthorId', function () {
                setRatingAllowed();
            });

            scope.hoverRate = function (rating) {
                if(ratingAllowed) {
                    scope.rateOnHover = rating;
                }
            };

            scope.clearHoverRate = function () {
                scope.rateOnHover = 0;
            };

            scope.getStarStyleClass = function (rating, desc) {
                var hover = (rating <= scope.rateOnHover) ? 'hoverState' : '';
                return desc + '-rated ' + hover;
            };

            scope.rate = function (rating) {
                if(ratingAllowed) {
                    rateService.rate(rating, scope.targetId, scope.targetCollection, function (avgRating) {
                        scope.rating = avgRating.avgRating;
                        normalizeRating();
                    });
                }
            };

            scope.getStarSize = function() {
                var defaultSize = 24;
                return {
                    width   : scope.starSize || defaultSize,
                    height  : scope.starSize || defaultSize
                };
            };

            /** Private methods **/
            function isRatingAllowed() {
                var isUserLogged = sessionService.isUserLogged(),
                    isSessionUserTargetUser = isUserLogged && scope.targetAuthorId === sessionService.getUserSession()._id;
                return isUserLogged && (!scope.targetAuthorId || !isSessionUserTargetUser);
            }

            function setRatingAllowed() {
                ratingAllowed = isRatingAllowed();
            }

            function initRating() {
                scope.normalizedRating = [];
                scope.rateOnHover = 0;
                normalizeRating();
            }

            function normalizeRating() {
                var maxRate = 5, i;
                for (i = 0; i < maxRate; i += 1) {
                    scope.normalizedRating[i] = (scope.rating > i && scope.rating >= i + 1)
                        ? 'full'
                        : (scope.rating > i)
                        ? 'half'
                        : 'none';
                }
            }
            /** End of private methods **/
		}
	};
}]);

COMPONENTS.directive('contentList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'contentList.html',
        scope : {
            _id     : '=id',
            config  : '='
        },
		link: function link(scope) {
            scope.items         = [];
            scope.collection    = constantsService.collections.content;
            scope.searchTargets = ['title', 'summary', 'content'];
            scope.onEditPanels  = [{ title: 'Edit content', type: 'editContent'}];
            scope.template      =   '<h3><a href="#"><label i18n-db="item.title"></label></a></h3>' +
                                    '<div class="summary" i18n-db="item.summary"></div>' +
                                    '<div list-expanded-view>' +
                                        '<div class="content" i18n-db="item.content"></div>' +
                                    '</div>' +
                                    '{{item.update.date}}';
		}
	};
}]);

(function() {
    'use strict';
    COMPONENTS.directive('createItem', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: false,
            template: '<div></div>',
            scope: {
                collection: '=',
                data: '=',
                onLayer: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {
                var collection = scope.collection,
                    layerElm = $('<div create-' + collection + ' model="data" on-layer="onLayer" class="cf"></div>');
                element.html(layerElm);
                $compile(layerElm)(scope);
            }
        };
    }]);
})();
(function() {
    COMPONENTS.directive('createItemButton', ['editBoxUtilsService', function (editBoxUtilsService) {
        return {
            restrict: 'A',
            scope: {
                collection: '=',
                onCreatePanels: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {

                var createItemDefBinding = {};

                scope.createItem = function () {
                    createItem();
                };

                /** Private methods **/
                function createItem() {
                    scope.panels = getCreatePanels();
                    setSharedBindings(scope.panels);
                    scope.onSave = function() {
                        scope.onCreate({$item: createItemDefBinding});
                    };
                    editBoxUtilsService.showEditBox(scope, element, element);
                }

                function getCreatePanels() {
                    var panels;
                    if(scope.onCreatePanels) { //If custom panels are defined for creation, use them
                        panels = scope.onCreatePanels;
                    } else { //Otherwise, use the default create panels
                        panels = [{ title: 'Create item', type: 'createItem' }];
                    }
                    return panels;
                }

                function setSharedBindings(panels) {
                    panels.forEach(function (panel) {
                        if(!panel.bindings) {
                            panel.bindings = {};
                        }
                        panel.bindings.collection = scope.collection;
                        panel.bindings.data = createItemDefBinding;
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})();
(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', '$compile', '$timeout', 'rowService', 'listService', 'listSelectService',
    'roleService', 'sessionService', 'objectService', 'tooltipService', 'arrayService',
    function ($rootScope, $location, $compile, $timeout, rowService, listService, listSelectService,
              roleService, sessionService, objectService, tooltipService, arrayService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'list.html',
            scope : {
                items           : '=list',
                collection      : '=',
                config          : '=',
                projection      : '=',
                currentPage     : '=',
                transcludedData : '=',
                onCreatePanels  : '=',
                onEditPanels    : '=',
                template        : '=',
                onSelect        : '&',
                onCreate        : '&',
                onEdit          : '&',
                onDelete        : '&',
                onSearch        : '&',
                dbSource        : '@'
            },
            link: function link(scope, element) {

                scope.isPageActionsTop = function () {
                    var pageActionPos = listService.getDefaultValue('pageActionPos', scope.config),
                        normalizedPageActionPos = Number(pageActionPos);
                    return normalizedPageActionPos === 0 || normalizedPageActionPos === 2;
                };

                scope.isPageActionsBottom = function () {
                    var pageActionPos = listService.getDefaultValue('pageActionPos', scope.config),
                        normalizedPageActionPos = Number(pageActionPos);
                    return normalizedPageActionPos === 1 || normalizedPageActionPos === 2;
                };

                scope.select = function (item) {
                    listSelectService.selectItem(scope, item);
                };

                scope.unselect = function (item) {
                    listSelectService.unselectItem(scope, item);
                };

                scope.clickOnItem = function (item, $index, $event, editOnSelect) {
                    listSelectService.clickOnItem(scope, element, item, $index, $event, editOnSelect);
                };

                scope.getWrapperClass = function () {
                    var isSelectable    = (scope.isSelectable()) ? 'selectable' : '',
                        isEditable      = (scope.isEditable()) ? 'editable' : '';
                    return isSelectable +  ' '  + isEditable;
                };

                scope.getItemStyleClasses = function (item) {
                    var maxColSize      = rowService.getMaxSlots(),
                        viewMode        = (scope.detailId) ? 'detailView': 'listView',
                        itemClassesObj  = {},
                        colWidthStyleClass;
                    scope.colWidth      = (scope.config.columns)
                                            ? Math.floor(maxColSize / scope.config.columns)
                                            : maxColSize;
                    colWidthStyleClass = 'large-' + scope.colWidth;
                    itemClassesObj[colWidthStyleClass]  = true;
                    itemClassesObj.active               = item.isSelected;
                    itemClassesObj[viewMode]            = true;
                    itemClassesObj.boxedItems           = scope.config.boxedItems;
                    itemClassesObj.multiSelectable      = scope.isMultiSelectable();
                    return itemClassesObj;
                };

                scope.createItem = function(item) {
                    scope.onCreate({$item: item});
                };

                scope.deleteItem = function (id) {
                    if(scope.isMultiSelectable()) {
                        listSelectService.dropFromSelectedList(scope, id);
                    }
                    deleteItemFromList(id);
                    tooltipService.hide();
                    scope.onDelete({$id: id});
                };

                scope.deleteDetailId = function() {
                    $location.search('detailId', null);
                };

                scope.isSearchable = function () { return listService.getDefaultValue('searchable', scope.config); };
                scope.isSelectable = function () { return scope.isSingleSelectable() || scope.isMultiSelectable(); };
                scope.isSingleSelectable = function () { return allowIfHasAdminRole(scope.config.selectable); };
                scope.isMultiSelectable = function () { return allowIfHasAdminRole(scope.config.multiSelectable); };
                scope.isEditable = function () { return allowIfHasAdminRole(scope.config.editable); };
                scope.isDeletable = function () { return allowIfHasAdminRole(scope.config.deletable); };
                scope.isCreatable = function () { return allowIfHasAdminRole(scope.config.creatable); };

                scope.getFilter = function() {
                    return (scope.dbSource == 'true') ? '' : scope.searchText;
                };

                scope.executeSearch = function() {
                    scope.onSearch({$text: scope.searchText});
                };

                scope.setItemHeight = function() {
                    return (scope.config.boxedItems) ? { height: getItemsHeight() } : {};
                };

                scope.page = 0;
                if(scope.currentPage !== undefined) { scope.currentPage = scope.page; }

                listService.setDetailId(scope, $location.search().detailId);
                scope.$on('$routeUpdate', function(){
                    listService.setDetailId(scope, $location.search().detailId);
                });

                /** Private methods **/
                function allowIfHasAdminRole(action) { return (isAdmin()) ? action : false; }

                function isAdmin() {
                    var userSession = sessionService.getUserSession();
                    return roleService.hasAdminRole(userSession);
                }

                function getItemsHeight() {
                    var rowSlots     = rowService.getMaxSlots(),
                        itemsPerFile = Math.floor(rowSlots / scope.colWidth);
                    return element.width() / itemsPerFile;
                }

                function deleteItemFromList(id) {
                    scope.items.forEach(function (item, index) {
                        if(item._id === id) {
                            arrayService.delete(scope.items, index);
                        }
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);

(function (Number) {
    'use strict';
    COMPONENTS.directive('listActions', ['arrayService', 'listService',
    function (arrayService, listService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'listActions.html',
            link: function link(scope) {

                scope.getPrevPage = function () {
                    scope.currentPage -= 1;
                    scope.loadList();
                };

                scope.getNextPage = function () {
                    scope.currentPage += 1;
                    scope.loadList();
                };

                scope.showPrevPageLink = function () {
                    return listService.getDefaultValue('pageSize', scope.config) && scope.currentPage > 0;
                };

                scope.showNextPageLink = function () {
                    var pageSize = Number(listService.getDefaultValue('pageSize', scope.config));
                    return (scope.currentPage + 1) * pageSize < scope.totalSize;
                };

                scope.toggleSelectAll = function () {
                    if (scope.selectedIds && scope.items.length === scope.selectedIds.length) {
                        unselectAll();
                    } else {
                        selectAll();
                    }
                };

                scope.deleteSelected = function () {
                    deleteSelected();
                };

                /** Private methods **/
                function selectAll() {
                    scope.items.forEach(function (item) {
                        scope.select(item);
                    });
                }

                function unselectAll() {
                    scope.items.forEach(function (item) {
                        scope.unselect(item);
                    });
                }

                function deleteSelected() {
                    var selectedIds = arrayService.copy(scope.selectedIds);
                    selectedIds.forEach(function (id) {
                        scope.deleteItem(id);
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Number);
(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('listDb', ['$rootScope', '$location', 'rowService', 'listService', 'listDbService',
    function ($rootScope, $location, rowService, listService, listDbService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'listDb.html',
            scope : {
                _id             : '=id',   //???
                collection      : '=',
                exportedItems   : '=list',
                config          : '=',
                projection      : '=',
                searchTargets   : '=',
                template        : '=',
                transcludedData : '=',
                onCreatePanels  : '=',
                onEditPanels    : '=',
                onSelect        : '&'
            },
            link: function link(scope) {

                scope.currentPage = 0;
                scope.searchText = '';

                scope.loadList = function () {
                    loadList();
                };

                scope.createItem = function (item) {
                    listDbService.createItem(scope.collection, item);
                };

                scope.deleteItem = function (id) {
                    listDbService.deleteItem(scope.collection, id);
                    scope.loadList();
                };

                scope.onSearch = function($text) {
                    scope.searchText = $text;
                    scope.loadList();
                };

                scope.selectItem = function(item) {
                    scope.onSelect({$item: item});
                };

                //Load the list just once some meaningful data is provided as otherwise the current directive
                //could try to get data before it's provided from the invoking function
                scope.$watch('collection', function () {
                    scope.loadList();
                    //Reload changes everytime the change flag is received
                    $rootScope.$on(scope.collection + 'Changed', function () { scope.loadList(); });
                });

                /** Private methods **/
                function loadList() {
                    var options = {
                        collection      : scope.collection,
                        searchText      : scope.searchText,
                        searchTargets   : scope.searchTargets,
                        currentPage     : scope.currentPage,
                        pageSize        : listService.getDefaultValue('pageSize', scope.config),
                        skip            : listService.getDefaultValue('skip', scope.config),
                        sort            : listService.getDefaultValue('sort', scope.config),
                        projection      : scope.projection
                    };
                    listDbService.loadList(options, function(list) {
                        scope.totalSize = list.totalSize;
                        scope.items = list.results;
                        if(scope.exportedItems) {
                            scope.exportedItems = scope.items;
                        }
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);
COMPONENTS.directive('listEdit', ['rowService', 'tagService', function (rowService, tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'listEdit.html',
        link: function link(scope) {

            scope.availableTags = tagService.getTags();

            scope.sortTypes = {
                field : [
                    { id: 'create.date',     text: 'Create date' },
                    { id: 'update.date',     text: 'Update date' },
                    { id: 'create.author',   text: 'Create author' },
                    { id: 'update.author',   text: 'Update author' }
                ],
                order : [
                    { id: '1',  text: 'Asc' },
                    { id: '-1', text: 'Desc' }
                ]
            };

            if (!scope.model.sort) {
                scope.model.sort = {
                    field: scope.sortTypes.field[0].id,
                    order: scope.sortTypes.order[1].id
                };
            }

            scope.columnOptions = [];
            //noinspection JSHint
            for (var index = 0; index < rowService.getMaxSlots(); index += 1) {
                scope.columnOptions.push({value: index + 1, text: index + 1});
            }
            if (!scope.model.columns) {
                scope.model.columns = 1;
            }
        }
    };
}]);
(function () {
    'use strict';
    COMPONENTS.directive('listExpandedView', [function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<div ng-show="detailId"><div ng-transclude></div></div>'
        };
    }]);
})();
COMPONENTS.directive('mediaList', ['$rootScope', 'mediaService', 'constantsService',
function ($rootScope, mediaService, constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
        scope : {
            config: '=',
            onSelect: '&'
        },
		templateUrl: 'mediaList.html',
		link: function link(scope) {

            scope.items         = [];
            scope.collection    = constantsService.collections.media;
            //We're interested in the metadata of the image, but not on the binary data
            scope.projection    = { data: 0 };
            scope.searchTargets = ['name'];
            scope.onEditPanels  = [{ title: 'Edit media', type: 'editMedia'}];
            scope.template      = '<img ng-src="{{transcludedData.getDownloadUrl(item)}}" ' +
                                  'title="{{transcludedData.getMediaTitle(item)}}" ' +
                                  'class="cursorPointer" edit-on-click="true" />';

            scope.$watch('config', function(newConfig) {
                newConfig.boxedItems = true;
                if(newConfig && !newConfig.columns) {
                    newConfig.columns = 4;
                }
            });

            scope.onUpload = function() {
                $rootScope.$broadcast('mediaChanged', 'create'); //Propagate the media create event
                scope.$apply();
            };


            scope.selectItem = function(item) {
                scope.onSelect({$item: item});
            };

            scope.transcludedData = {};
            scope.transcludedData.getDownloadUrl = function (media) {
                return mediaService.getDownloadUrl(media);
            };

            scope.transcludedData.getMediaTitle = function (media) {
                return mediaService.getMediaHtmlDetails(media);
            };
		}
	};
}]);

(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('nestedItems', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            terminal: true,
            scope : {
                items: '=',
                selectedItem: '=',
                onSelect: '&',
                onAdd: '&',
                onDelete: '&',
                sortableOptions: '='
            },
            link: function link(scope, element) {

                /* PRIVATE METHODS */
                function emitFn(fn, item) {
                    if (scope[fn]) {
                        scope[fn]({$item: item});
                    }
                }
                /* END PRIVATE METHODS */

                scope.selectItem    = function (item) { emitFn('onSelect', item); };
                scope.addItem       = function (item) { emitFn('onAdd', item); };
                scope.deleteItem    = function (item) { emitFn('onDelete', item); };
                scope.emitSelect    = function (item) { emitFn('onSelect', item); };
                scope.emitAdd       = function (item) { emitFn('onAdd', item); };
                scope.emitDelete    = function (item) { emitFn('onDelete', item); };

                scope.toggleSubItems = function (item) {
                    item.areSubItemsHidden = item.areSubItemsHidden !== true;
                };

                scope.getToggleSubItemsIcon = function (item) {
                    return item.areSubItemsHidden !== true ? 'downIcon' : 'rightIcon';
                };

                scope.$watch('sortableOptions', function (newVal) {
                    if (newVal) {
                        //The template has to be defined asyncrhonously because of its recursive nature
                        var template =  '<ul ui-sortable="sortableOptions" ng-model="items" class="items">' +
                                            '<li ng-repeat="item in items" class="item" ng-class="{hasSubItems:item.items.length}"' +
                                            'ng-show="!item.deleted">' +
                                                '<div class="box" ng-class="{selected:item._id == selectedItem._id, collapsed:item.areSubItemsHidden}">' +
                                                    '<div class="sortingBox"></div>' +
                                                    '<button class="toggleSubItems small" ng-click="toggleSubItems(item)" ' +
                                                    'ng-show="item.items.length" ng-class="getToggleSubItemsIcon(item)"></button>' +
                                                    '<div ng-click="selectItem(item)"><label i18n-db="item.text"></label></div>' +
                                                    '<div class="actions">' +
                                                        '<button class="addIcon" ng-click="addItem(item)"></button>' +
                                                        '<button class="removeIcon" ng-click="deleteItem(item)"></button>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="subItemsContainer" ng-class="{hasSubItems:item.items.length}" ' +
                                                'ng-show="!item.areSubItemsHidden">' +
                                                    '<nested-items items="item.items" on-select="emitSelect($item)" ' +
                                                    'on-add="emitAdd($item)" on-delete="emitDelete($item)" ' +
                                                    'selected-item="selectedItem" sortable-options="sortableOptions"></nested-items>' +
                                                '</div>' +
                                            '</li>' +
                                        '</ul>';
                        element.append(template);
                        $compile(element.contents())(scope);
                    }
                });
            }
        };
    }]);
})(window.COMPONENTS);
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('nestedItemsWrapper', ['globalMsgService', 'i18nService', 'timerService', '$timeout',
    function (globalMsgService, i18nService, timerService, $timeout) {
        return {
            //require: 'selectedItem',
            restrict: 'E',
            replace: true,
            template:   '<div>' +
                '<nested-items items="items" sortable-options="sortableOptions" selected-item="selectedItem" ' +
                'on-select="onSelectItem($item)" on-add="onAddItem($item)" on-delete="onDeleteItem($item)"></nested-items>' +
                '<button class="addIcon floatRight" ng-click="addRootItem()"></button>' +
                '</div>',
            scope: {
                items: '=',
                selectedItem: '=',
                onSelect: '&',
                onAdd: '&'
            },
            link: function link(scope) {

                /* PRIVATE METHODS */
                function addItem(siblingItems) {
                    var newItem = {
                        _id     : timerService.getRandomNumber(),
                        text    : i18nService('editPages.newPage'),
                        items   : [],
                        position: scope.items.length,
                        added   : true
                    };
                    siblingItems.push(newItem);
                    scope.onSelectItem(newItem);
                    if (scope.onAdd) {
                        scope.onAdd({$item: newItem});
                    }
                }

                function deleteItem(item) {
                    item.deleted = true;
                    if (item.items) { //Recursively delete all the subitems as well
                        item.items.forEach(function (item) {
                            deleteItem(item);
                        });
                    }
                }

                function undeleteItem(item) {
                    item.deleted = false;
                    if (item.items) { //Recursively undelete all the subitems as well
                        item.items.forEach(function (item) {
                            undeleteItem(item);
                        });
                    }
                }

                function getNonDeletedItems(items) {
                    var nonDeletedItems = [];
                    items.forEach(function (item) {
                        if (!item.deleted) {
                            nonDeletedItems.push(item);
                            getNonDeletedItems(item.items).forEach(function (item) {
                                nonDeletedItems.push(item);
                            });
                        }
                    });
                    return nonDeletedItems;
                }

                function onUpdate() {
                    //It's necessary to apply a delay before marking all items
                    //as updated as otherwise the changes won't be applied
                    $timeout(function () {
                        markAllItemsAsUpdated();
                    }, 0);
                }

                function markAllItemsAsUpdated(items, accumulativeIndex) {
                    if (items) {
                        accumulativeIndex += 1;
                    } else {
                        items = scope.items;
                        accumulativeIndex = 0;
                    }
                    items.forEach(function (item, index) {
                        item.updated = true;
                        item.position = index + accumulativeIndex;
                        markAllItemsAsUpdated(item.items, item.position);
                    });
                }
                /* END PRIVATE METHODS */

                scope.sortableOptions = {
                    items               : 'li',
                    connectWith         : '[ui-sortable]',
                    placeholder         : 'sortingPlaceholder',
                    forceHelperSize     : true,
                    forcePlaceholderSize: true,
                    tolerance           : 'pointer',
                    cursorAt            : { top: 0, left: 0 },
                    handle              : '.sortingBox',
                    update              : onUpdate
                };

                scope.onSelectItem = function (item) {
                    if (scope.onSelect) {
                        scope.onSelect({$item: item});
                    }
                };

                scope.addRootItem = function () {
                    addItem(scope.items);
                };

                scope.onAddItem = function (item) {
                    addItem(item.items);
                };

                scope.onDeleteItem = function (item) {
                    var canBeDeleted, nonDeletedItemFound = false;
                    deleteItem(item);
                    canBeDeleted = getNonDeletedItems(scope.items).length > 0;
                    if (canBeDeleted) {
                        if (item._id === scope.selectedItem._id) {
                            scope.items.forEach(function (item) {
                                if (!item.deleted && !nonDeletedItemFound) {
                                    scope.selectedItem = item;
                                    nonDeletedItemFound = true;
                                }
                            });
                        }
                    } else {
                        undeleteItem(item);
                        globalMsgService.show(i18nService('editPages.cannotDeletePage'));
                    }
                };
            }
        };
    }]);
})(window.COMPONENTS);
(function () {
    'use strict';
    COMPONENTS.directive('nestedPagesWrapper', ['pageService', 'rowService', '$timeout',
    function (pageService, rowService, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template:   '<div>' +
                            '<nested-items-wrapper items="items" on-select="onSelect($item)" selected-item="selectedItem"' +
                            'on-add="onAddPage($item)"></nested-items-wrapper>' +
                        '</div>',
            scope: {
                pages: '=',
                items: '=',
                selectedItem: '=',
                onAdd: '&'
            },
            link: function link(scope) {

                /* PRIVATE METHODS */
                function getParentItem(parentId, parentItem) {
                    var matchedItem = null,
                        items = (parentItem) ? parentItem.items : scope.items;
                    items.forEach(function (candidateParentItem) {
                        if (candidateParentItem._id === parentId) {
                            matchedItem = candidateParentItem;
                        } else if (!matchedItem) {
                            matchedItem = getParentItem(parentId, candidateParentItem);
                        }
                    });
                    return matchedItem;
                }

                //The pages are stored flay way,
                //so it's necessary to create a hierarchical structure to ease the subpages handling
                function normalizeItems(pages) {
                    scope.pages = pages;
                    scope.items = [];
                    scope.pages.forEach(function (page) {
                        page.items = [];
                        if (!page.parentPageId) {
                            scope.items.push(page);
                        } else {
                            var parentItem = getParentItem(page.parentPageId);
                            parentItem.items.push(page);
                        }
                    });
                    selectFirstPage(); //By default, select the first page
                }

                function selectFirstPage() {
                    //We're selecting the new page in a new thready in order to allow other actions to be executed first
                    //For instance, if any of the properties set inside of the selectedItem object has to be init
                    //by the i18n component, we're letting this process to be executed before
                    //so once the page is selected, its structure will be fully ready
                    $timeout(function () {
                        scope.selectedItem = scope.items[0];
                    });
                }
                /* END PRIVATE METHODS */

                var pages;
                scope.selectedItem = {};
                scope.onSelect = function (page) {
                    scope.selectedItem = page;
                };

                scope.onAddPage = function (page) {
                    page.description = '';
                    //Initialize the rows structure to ensure that the apps will be able to be dropped there
                    page.rows = [rowService.getEmptyRow()];
                    if (scope.onAdd) { scope.onAdd({$page: page}); }
                };

                pages = pageService.getPages(); //Get all the pages in 'flat' mode
                normalizeItems(pages);          //Provide a hierarchical structure to ease the subpages handling
            }
        };
    }]);
})();
COMPONENTS.directive('tagList', ['constantsService', function (constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'tagList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            scope.items         = [];
            scope.collection    = constantsService.collections.tags;
            scope.searchTargets = ['text'];
            scope.onEditPanels  = [{ title: 'Edit tag', type: 'editTag'}];
		}
	};
}]);

COMPONENTS.directive('userList', ['$rootScope', 'mediaService', 'userService', 'constantsService', 'listDbService',
function ($rootScope, mediaService, userService, constantsService, listDbService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'userList.html',
        scope : {
            config: '='
        },
		link: function link(scope) {
            var newUserBindings = { user: {} };
            getUserList();
            scope.collection = constantsService.collections.users;
            scope.onCreatePanels = [{ title: 'Create user', type: 'createUser', bindings: newUserBindings}];
            scope.onEditPanels = [{ title: 'Edit users', type: 'editUser'}];
            scope.onCreate = function() { onCreate(newUserBindings); };
            scope.onDelete = onDelete;
            scope.transcludedData = {};
            scope.transcludedData.getUserAvatarUrl = getUserAvatarUrl;
            scope.template = getTemplate();
            $rootScope.$on(scope.collection + 'Changed', function () { loadUserList(); });
            scope.config.pageActionPos = 0;

            /** Private methods**/
            function getUserList() {
                scope.userList = userService.getUsers();
            }

            function loadUserList() {
                userService.loadUsers(function(users) {
                    scope.userList = users;
                });
            }

            function onCreate(bindings) {
                userService.createUser(bindings.user, function() {
                    bindings.user = {};
                    loadUserList();
                });
            }

            function onDelete(userId) {
                listDbService.deleteItem(scope.collection, userId);
                loadUserList();
            }

            function getUserAvatarUrl(item) {
                return (item.media) ? mediaService.getDownloadUrl(item.media)
                                    : mediaService.getDefaultAvatarUrl();
            }

            function getTemplate() {
                return  '<div class="avatar columns large-3">' +
                            '<img ng-src="{{transcludedData.getUserAvatarUrl(item)}}" />' +
                        '</div>' +
                        '<div class="columns large-22">' +
                            '<h3><a href="#">{{item.fullName}}</a></h3>' +
                            '<div list-expanded-view class="email" ng-bind-html-unsafe="item.email"></div>' +
                            '{{item.create.date}}' +
                        '</div>';
            }
            /** End of private methods**/
		}
	};
}]);

(function () {
    'use strict';
    COMPONENTS.directive('mediaPicker', ['$rootScope', 'editBoxUtilsService', 'mediaService',
    function ($rootScope, editBoxUtilsService, mediaService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model           : '=ngModel',
                endpoint        : '@',
                onUpload        : '=',
                onMediaChange   : '&onChange',
                onMediaClose    : '&onClose',
                defaultMediaUrl : '=',
                preview         : '@'
            },
            templateUrl: 'mediaPicker.html',
            link: function link(scope, element) {

                scope.getDownloadUrl = function (file) {
                    if (file && file._id) { //There's a dynamic file to show
                        return mediaService.getDownloadUrl(file);
                    } else if (scope.defaultMediaUrl) { //There's a default file to show
                        return scope.defaultMediaUrl;
                    }
                    return null;
                };

                scope.getFileTitle = function (file) {
                    return mediaService.getMediaHtmlDetails(file);
                };

                scope.selectFromMediaList = function() {
                    scope.panels = [{
                        title: 'Media list selection',
                        type: 'mediaListPicker',
                        onLayer: {
                            change: function(selectedMedia) {
                                success(selectedMedia);
                            }
                        }
                    }];
                    scope.onClose = function() {
                        if(scope.onMediaClose) {
                            scope.onMediaClose();
                        }
                    };
                    editBoxUtilsService.showEditBox(scope, element, $('button', element));
                };

                scope.deleteSelection = function() {
                    success(null);
                };

                /** Private methods **/
                function success(file) {
                    if (scope.model) {
                        scope.model = file;
                    }
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                    if (scope.onUpload) {
                        scope.onUpload(file);
                    }
                    if(scope.onMediaChange) {
                        scope.onMediaChange({$media: file});
                    }
                }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('mediaListPicker', [function () {
        return {
            restrict: 'A',
            replace: false,
            template: '<media-list config="config" on-select="onSelect($item)"></media-list>',
            scope: {
                onLayer     : '='
            },
            link: function link(scope) {
                scope.config = {
                    selectable  : true,
                    uploadable  : true,
                    columns     : 2
                };
                scope.onSelect = function (selectedMedia) {
                    scope.onLayer.change(selectedMedia);
                };
            }
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.directive('resizableApp', ['resizableAppService', function (resizableAppService) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element, attrs) {

                var hasBeenInitialized = false;

                attrs.$observe('resizableApp', function (newVal) {
                    if (newVal === 'true') { //Block the resize capability if the user doesn't have permissions enough
                        hasBeenInitialized = true;
                        enableResizableApp();
                    } else if(hasBeenInitialized) {
                        disableResizableApp();
                    }
                });

                /** Private methods **/
                function enableResizableApp() {
                    element.resizable({
                        handles: 'e, w',
                        start: function (event) {
                            resizableAppService.start($(this), event);
                        },
                        resize: function () {
                            resizableAppService.resize($(this));
                        }
                    });
                }

                function disableResizableApp() {
                    element.resizable('destroy');
                }
                /** End of private methods **/
            }
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.directive('sortableAddApp', ['keyboardService', '$timeout', function (keyboardService, $timeout) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element) {

                function start(ui) {
                    //Force the size of the dragging element to be as it originally was
                    $(ui.helper).css({width: element.outerWidth(), height: element.outerHeight()});
                    registerKeyboardEvents();
                }

                function stop() {
                    unregisterKeyboardEvents();
                }

                function registerKeyboardEvents() {
                    keyboardService.register('esc', 'sortableAddApp', function () {
                        element.trigger('mouseup');
                    });
                }

                function unregisterKeyboardEvents() {
                    keyboardService.unregister('esc', 'sortableAddApp');
                }

                $timeout(function () {
                    element.draggable({
                        helper              : 'clone',
                        connectToSortable   : '[sortable-app]',
                        forceHelperSize     : true,
                        tolerance           : 'pointer',
                        cursorAt            : { top: 0, left: 0 },
                        start: function (event, ui) {
                            start(ui);
                        },
                        stop: function () {
                            stop();
                        }
                    });
                }, 0);
            }
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.directive('sortableApp', ['pageService', 'sortableAppService', function (pageService, sortableAppService) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element, attrs) {

                var sortableWrapElm = element.closest('[sortable-app]');
                scope.sortableOptions = {};

                function instantiateSortableApp() {
                    scope.sortableOptions = {
                        items               : '.app',
                        /*handle              : '.content',*/
                        cancel              : '.content > *',
                        connectWith         : '[sortable-app]',
                        placeholder         : 'sortingPlaceholder',
                        tolerance           : 'pointer',
                        cursorAt            : { top: 0, left: 0 },
                        start: function (event, ui) {
                            sortableAppService.start(ui);
                        },
                        update: function (event, ui) {
                            sortableAppService.update(ui);
                        },
                        stop: function () {
                            sortableAppService.stop();
                        }
                    };
                }

                instantiateSortableApp();

                attrs.$observe('sortableApp', function (newVal) {
                    if (newVal !== 'true') { //Block the sort capability if the user doesn't have permissions enough
                        sortableWrapElm.sortable('disable');
                    } else {
                        sortableWrapElm.sortable('enable');
                    }
                });
            }
        };
    }]);
})();
(function (document) {
    'use strict';
    COMPONENTS.directive('boxSortable', ['keyboardService', function (keyboardService) {
        return {
            restrict: 'A',
            transclude: true,
            template: '<ul class="sortable" ng-transclude></ul>',
            scope: {
                onChange        : '=uxChange',
                handle          : '@',
                connectWith     : '@'
            },
            replace: true,
            link: function link(scope, element, attrs) {

                var updateFn = function () { if (scope.onChange) { scope.onChange(); }},
                    sortingElms = (attrs.connectWith) ? $(attrs.connectWith) : element;

                element.sortable({
                    placeholder: "sortingPlaceholder",
                    forceHelperSize: true,
                    forcePlaceholderSize: true,
                    connectWith: attrs.connectWith,
                    tolerance: 'pointer',
                    handle: attrs.handle || '',
                    cursorAt: { top: 0, left: 0 },
                    start: function (/*event, ui*/) {
                        sortingElms.addClass('sorting');
                        //Wire the 'esc' event with the cancellation of the sorting changes
                        keyboardService.register('esc', 'boxSortable', function () {
                            //It's necessary to manually define what is considered as a cancellation
                            element.sortable('option',  'update', function () { return false; });
                            $(document).trigger("mouseup");
                            //Therefore, it's necessary to restore the 'update' event
                            element.sortable('option',  'update', function () { updateFn(); });
                        });
                    },
                    stop: function (event, ui) {
                        sortingElms.removeClass('sorting');
                        //Once the sorting process stops, the 'esc' event is unregistered to allow being triggered by others
                        keyboardService.unregister('esc', 'boxSortable');
                    },
                    update: updateFn
                });
                element.disableSelection();
            }
        };
    }]);
})(window.document);

(function() {
    COMPONENTS.directive('multipleFiles', [function () {
        'use strict';
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {
                attrs.$observe('multipleFiles', function(newVal) {
                    if(newVal === 'true') {
                        element.attr('multiple', '');
                    } else {
                        element.removeAttr('multiple');
                    }
                });
            }
        };
    }]);
})();
(function () {
    'use strict';
    //IMPORTANT: The capitalize method is already defined in an angularJs service.
    //However, it's duplicated here as we cannot have access to these service from an inmediate function
    //In a clean way, without penaltying the performance
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //noinspection JSHint
    var forEach = angular.forEach,
        events = ['change', 'keyup', 'blur'];
    forEach(events, function eventHandler(event) {
        var directiveName = 'ux' + capitalize(event);
        COMPONENTS.directive(directiveName, ['$parse', function ($parse) {
            return function (scope, elm, attrs) {
                var fn = $parse(attrs[directiveName]);
                elm.bind(event, function (e) {
                    scope.$apply(function () {
                        fn(scope, {$event: e});
                    });
                });
            };
        }]);
    });
}());
(function () {
    'use strict';

    COMPONENTS.directive('uxShow', ['constantsService', function (constantsService) {
        return {
            terminal    : true,
            transclude  : 'element',
            priority    : 100,
            restrict    : 'A',
            compile     : function (tElement, tAttrs, transclude) {
                return function (scope, iElement, iAttr) {

                    var contentElm, contentScope;

                    //Watch all the changes on the ux-show="" expression
                    scope.$watch(iAttr.uxShow, function ifWatchAction(expValue) {
                        if (expValue) { //The expression has been evaluated to true -> show the transcluded content
                            showContent();
                        } else { //The expression has been evaluated to false -> remove the transcluded content
                            hideContent();
                        }
                    });

                    //Show the content of the wrapping element
                    function showContent() {
                        //Created a new scope for the transcluded content
                        contentScope = scope.$new();
                        //Compile the child content, taking the new scope as model reference
                        transclude(contentScope, function (clonedElm) {
                            iElement.after(clonedElm);
                            //Here's the tricky part. At this moment and due to some really strange reason,
                            //if the show element has been retrieved asyncronously (i.e. in the edit box),
                            //the clonedElm is still NOT in the DOM, so we cannot save the reference to it
                            //We need to wait 'some' time till some moment we guess it's already in the DOM
                            //RISK: If the show condition changes too fast (faster than the setTimeout delay)
                            //the hideContent() method will arrive before the contentElm reference is created.
                            //Consequently, the shown element won't be removed, and if it's shown again afterwards
                            //it will be shown twice. This situation could happen, for instance, if a user keeps
                            //the 'left' or 'right' keys in a edit box tabs too fast
                            //To avoid this problem, we match the delay with the minimum keyboard interval
                            setTimeout(function () {
                                contentElm = iElement.next();
                            }, constantsService.keyboardInterval);
                        });
                    }

                    //Hide the content of the wrapping element
                    function hideContent() {
                        //If the DOM content element exits, remove it
                        if (contentElm) {
                            contentElm.remove();
                            contentElm = null;
                        }
                        //Same with the scope of the content element
                        if (contentScope) {
                            contentScope.$destroy();
                            contentScope = null;
                        }
                    }
                };
            }
        };
    }]);
})();
(function() {
    'use strict';
    COMPONENTS.directive('uxTransclude', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                template: '=uxTransclude'
            },
            link: function link(scope, element) {

                scope.$watch('template', function(newVal) {
                    if(newVal) {
                        var newContent = $(newVal);
                        element.html(newContent);
                        $compile(newContent)(scope.$parent);
                    }
                });
            }
        };
    }]);
})();
COMPONENTS.directive('emailMandatory', ['emailService', 'validationService', function (emailService, validationService) {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'Please enter a valid e-mail', validationKey = 'emailMandatory',
                validationFn    = function (viewValue) {
                    return !viewValue || viewValue === '' || emailService.validateEmail(viewValue);
                };
            validationService.setupValidation(value, element, ctrl, validationTitle, null, validationKey, validationFn);
        }
    };
}]);
COMPONENTS.directive('mandatory', ['validationService', function (validationService) {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'This field is required', validationKey = 'mandatory',
                validationFn    = function (viewValue) {
                    return viewValue && viewValue !== '';
                };
            validationService.setupValidation(value, element, ctrl, validationTitle, null, validationKey, validationFn);
        }
    };
}]);
COMPONENTS.directive('passwordMandatory', ['$compile', 'validationService', function ($compile, validationService) {
    'use strict';
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var value = scope.$eval(attrs.ngModel),
                validationTitle = 'Password must meet the following requirements', validationKey = 'passwordMandatory',
                errorHtmlDetails =  '<ul>' +
                    '<li ng-class="pwdHasLetter">At least <strong>one letter</strong></li>' +
                    '<li ng-class="pwdHasNumber">At least <strong>one number</strong></li>' +
                    '<li ng-class="pwdValidLength">At least <strong>8 characters long</strong></li>' +
                    '</ul>',
                compiledErrorHtmlDetails = $compile(errorHtmlDetails)(scope),
                validationFn = function (viewValue) {
                    if(!viewValue) {
                       return true;
                    } else {
                        scope.pwdValidLength = (viewValue && viewValue.length >= 8  ? 'valid' : undefined);
                        scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                        scope.pwdHasNumber = (viewValue && /\d/.test(viewValue))    ? 'valid' : undefined;
                        return scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber;
                    }
                };
            validationService.setupValidation(value, element, ctrl, validationTitle,
                compiledErrorHtmlDetails, validationKey, validationFn);
        }
    };
}]);
(function () {
    'use strict';

    COMPONENTS.factory('ajaxService', ['$http', 'loadingService', function ($http, loadingService) {

        /**
         * Executes an ajax request to the backend
         *
         * @param {object} options The options for the request setup (url, method, data...)
         */
        function ajax(options) {
            var settings = {
                url: options.url,
                method: options.method || 'GET',
                data: (options) ? options.data : {}
            };
            //Normalize the URL if the parameters are going to be sent as query string
            if (settings.data && settings.method === 'GET') {
                settings.url = settings.url + '?' + decodeURIComponent($.param(settings.data)); //JSON -> query string
            }
            loadingService.start();
            $http(settings).success(
            function (data/*, status, headers, config*/) {
                if (options.success) {
                    options.success(data);
                }
            }).error(function (data/*, status, headers, config*/) {
                if (options.error) {
                    options.error(data);
                }
            });
            loadingService.done();
        }

        return {
            ajax: ajax
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('availableAppsService', ['$rootScope', 'crudService', 'constantsService',
    function ($rootScope, crudService, constantsService) {

        var availableApps, categories = [];

        /**
         * Loads the available apps from the repository
         *
         * @param {function} callback function with the retrieved available apps list
         */
        function loadAvailableApps(callback) {
            var filter  = { sort: { field: 'category', order : '-1' } };
            crudService.get(constantsService.collections.availableApps, null, filter, function (availableApps) {
                setAvailableApps(availableApps.results);
                $rootScope.$broadcast('availableAppsLoaded');
                if (callback) { callback(getAvailableApps()); }
            });
        }

        /**
         * Gets the previously loaded available apps
         *
         * @returns {object} The arrays of indexes and available apps
         */
        function getAvailableApps() {
            return availableApps;
        }

        /**
         * Gets the current categories of apps
         *
         * @returns {Array} The list of available categories
         */
        function getCategories() {
            return categories;
        }

        /** Private methods **/
        function setAvailableApps(retrievedAvailableApps) {
            var index = 0;
            //Store an index of model to ease the access afterwards (for instance, from the portlet directive)
            availableApps = {
                index   : {},
                model   : []
            };
            retrievedAvailableApps.forEach(function (retrievedAvailableApp) {
                categorizeApp(retrievedAvailableApp);
                availableApps.index[retrievedAvailableApp.id] = index;
                availableApps.model.push(retrievedAvailableApp);
                index += 1;
            });
        }

        function categorizeApp(availableApp) {
            if (!availableApp.category) { //Set the default category, if the app hasn't it
                availableApp.category = constantsService.defaultCategory;
            }
            if (!categories[availableApp.category]) { //Identify the first app of its category
                categories[availableApp.category] = true;
                availableApp.firstInCategory = true;
            }
        }
        /** End of private methods **/

        return {
            loadAvailableApps: loadAvailableApps,
            getAvailableApps: getAvailableApps,
            getCategories: getCategories
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('commentsService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         *
         *
         * @param targetId
         * @param callback
         */
        function loadComments(targetId, callback) {
            var filter = {
                q       : { targetId : targetId },
                sort    : { field: 'create.date', order : '1' }
            };
            crudService.get(constantsService.collections.comments, null, filter, function (comments) {
                if(callback) { callback(comments); }
            });
        }

        /**
         *
         *
         * @param newCommentText
         * @param targetId
         * @param callback
         */
        function createComment(newCommentText, targetId, callback) {
            var data = { text : newCommentText, targetId : targetId };
            crudService.create(constantsService.collections.comments, data, function (newComment) {
                if(callback) { callback(newComment); }
            });
        }

        /**
         *
         *
         * @param commentId
         * @param data
         * @param callback
         */
        function updateComment(commentId, data, callback) {
            crudService.update(constantsService.collections.comments, commentId, data, function(updatedComment) {
                if(callback) { callback(updatedComment); }
            });
        }

        /**
         *
         *
         * @param commentId
         * @param callback
         */
        function deleteComment(commentId, callback) {
            crudService.delete(constantsService.collections.comments, commentId, function() {
                if(callback) { callback(); }
            });
        }

        return {
            loadComments : loadComments,
            createComment: createComment,
            updateComment: updateComment,
            deleteComment: deleteComment
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('constantsService', [function () {
        return {
            appKey          : 'app',
            appsPath        : '/client/apps',
            defaultCategory : 'Others',
            collections     : {
                portal              : 'portal',
                pages               : 'pages',
                availableApps       : 'availableApps',
                content             : 'content',
                media               : 'media',
                users               : 'users',
                roles               : 'roles',
                comments            : 'comments',
                ratings             : 'ratings',
                tags                : 'tags',
                languages           : 'languages'
            },
            roles           : {
                guest       : 'guest',
                reader      : 'reader',
                creator     : 'creator',
                admin       : 'admin',
                superAdmin  : 'superAdmin'
            },
            templates		: {
                view		: 'view',
                edit		: 'edit',
                help		: 'help'
            },
            renderTypes     : {
                dom         : 'dom',
                canvas      : 'canvas'
            },
            pageTypes       : {
                apps        : 'apps',
                externalLink: 'externalLink'
            },
            blurOpacity     : 0.3,
            keyboardInterval: 100, //minimum time between different keyboard events
            defaultFontSize : 16
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('contentService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         * Creates a new content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been created
         */
        function createContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.create(constantsService.collections.content, data, function (newContent) {
                    if (callback) {
                        callback(newContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Updates an existing content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been updated
         */
        function updateContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.update(constantsService.collections.content, content._id, data, function (updatedContent) {
                    if (callback) {
                        callback(updatedContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Gets content item(s)
         *
         * @param {string}      contentId   The Id of the content that is going to be retrieved.
         *                                  If not defined, multiple results could be retrieved
         * @param {object}      params      The params to execute a more fine grained query
         * @param {function}    callback    The function that will be executed once the content has been retrieved
         */
        function getContent(contentId, params, callback) {
            if(!params) { params = {}; }
            crudService.get(constantsService.collections.content, contentId, params, function (content) {
                if (callback) {
                    callback(content);
                }
            });
        }

        return {
            createContent: createContent,
            updateContent: updateContent,
            getContent: getContent
        };
    }]);
})();

(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('crudService', ['$rootScope', 'ajaxService', 'constantsService',
    function ($rootScope, ajaxService, constantsService) {

        /**
         * Executes a create request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be created willl be stored
         * @param {object}      data                The content to be created
         * @param {function}    callback            The function that will be executed once the content has been created
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function create(collection, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : 'rest/' + collection + '/create',
                data	: data,
                method  : 'POST',
                success	: function (result) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', 'create');
                    }
                    if (callback) {
                        callback(result);
                    }
                }
            });
        }

        /**
         * Executes a get request to the backend
         *
         * @param {string}      collection  The name of the collection where the content to be retrieved is stored
         * @param {string}      id          The unique identifier of the content to be retrieved
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the content has been retrieved
         */
        function get(collection, id, data, callback) {
            ajaxService.ajax({
                url     : 'rest/' + collection + ((id) ? '/' + id : ''),
                data	: (data) ? data : {},
                method  : 'GET',
                success	: function (retrievedItem) {
                    if (callback) {
                        callback(retrievedItem);
                    }
                }
            });
        }

        /**
         * Executes an update request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be updated is stored
         * @param {string}      id                  The unique identifier of the content to be updated
         * @param {object}      data                The additional attributes to allow a more fine grained query
         * @param {function}    callback            The function that will be executed once the content has been updated
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function update(collection, id, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : 'rest/' + collection + '/' + id + '/update',
                data	: data,
                method  : 'PUT',
                success	: function (updatedItem) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', id);
                    }
                    if (callback) {
                        callback(updatedItem);
                    }
                }
            });
        }

        /**
         * Executes a delete request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be deleted is stored
         * @param {string}      id                  The unique identifier of the content to be deleted
         * @param {function}    callback            The function that will be executed once the content has been deleted
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function remove(collection, id, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : 'rest/' + collection + '/' + id + '/delete',
                method  : 'DELETE',
                success	: function (result) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', id);
                    }
                    if (callback) {
                        callback(result);
                    }
                }
            });
        }

        /**
         * Retrieves the stats of a given resource
         *
         * @param {string}      collection  The name of the collection that will serve the stats about
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the stats have been retrieved
         */
        function getStats(collection, data, callback) {
            ajaxService.ajax({
                url     : 'rest/' + collection + '/getStats',
                data	: (data) ? data : {},
                method  : 'GET',
                success	: function (newItem) {
                    if (callback) {
                        callback(newItem);
                    }
                }
            });
        }

        /**
         * Rates a given resource
         *
         * @param {string}      collection  The name of the collection that will be rated
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the rate process is complete
         */
        function rate(collection, data, callback) {
            ajaxService.ajax({
                url     : 'rest/' + collection + '/rate',
                data	: data,
                method  : 'POST',
                success	: function (newItem) {
                    if (callback) {
                        callback(newItem);
                    }
                }
            });
        }

        /**
         * Undeploys an existing app
         *
         * @param {string}      id                  The unique identifier of the app that is going to be undeployed
         * @param {object}      data                The additional attributes to allow a more fine grained query
         * @param {function}    callback            The function that will be executed once the app has been undeployed
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function undeployApp(id, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : 'rest/' + constantsService.collections.availableApps + '/' + id + '/undeploy',
                data	: data,
                method  : 'POST',
                success	: function () {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(constantsService.collections.availableApps + 'Undeployed', data.id);
                    }
                    if (callback) {
                        callback({});
                    }
                }
            });
        }

        return {
            create          : create,
            get             : get,
            update          : update,
            delete          : remove,
            getStats        : getStats,
            rate            : rate,
            undeployApp     : undeployApp
        };
    }]);
})(window.COMPONENTS);
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('dbService', ['crudService', function (crudService) {

        var databasesKey = 'databases';

        /**
         * Retrieves the databases available in the system
         *
         * @param {function} callback The function that will be executed once the databases have been retrieved
         */
        function loadDatabases(callback) {
            crudService.get(databasesKey, null, null, function(databases) {
                if(callback) {
                    callback(databases);
                }
            });
        }

        /**
         * Creates a databases available in the system
         *
         * @param {object}      data        The info of the database that is going to be created
         * @param {function}    callback    The function that will be executed once the databases have been retrieved
         */
        function createDatabase(data, callback) {
            crudService.create(databasesKey, data, function(databases) {
                if(callback) {
                    callback(databases);
                }
            });
        }

        /**
         * Updates the database available in the system
         *
         * @param {string}      databaseId  The id of the database that is going to be deleted
         * @param {object}      data        The info of the database that is going to be updated
         * @param {function}    callback    The function that will be executed once the database have been updated
         */
        function updateDatabase(databaseId, data, callback) {
            crudService.update(databasesKey, databaseId, data, function(result) {
                if(callback) {
                    callback(result);
                }
            });
        }

        /**
         * Physically deletes a given database
         *
         * @param {string}      databaseId  The id of the database that is going to be deleted
         * @param {function}    callback    The function that will be executed once the database have been deleted
         */
        function deleteDatabase(databaseId, callback) {
            crudService.delete(databasesKey, databaseId, function(result) {
                if(callback) {
                    callback(result);
                }
            });
        }

        /**
         * Generates a database selector that will execute an insesitive search based on the given selector
         *
         * @param {*}                               selector    The matching object that will be used as a filter
         * @param {boolean}                         exact       True if the selector is exact. False if it's approximate
         * @returns {{$regex: *, $options: string}}             The normalized database selector to perform an insensitive  query
         */
        function getInsensitiveSelector(selector, exact) {
            var regexSelector = (exact) ? '^' + selector + '$' : selector;
            return { $regex: regexSelector, $options: 'i' };
        }

        /**
         * Generates a database selector that will execute an inexact search based on the given selector
         *
         * @param {*}                               selector    The matching object that will be used as a filter
         * @returns {{$regex: *, $options: string}}             The normalized database selector to perform an inexact  query
         */
        function getInexactSelector(selector) {
            return { $regex: '^.*' + selector + '.*', $options: 'i' };
        }

        return {
            loadDatabases: loadDatabases,
            createDatabase: createDatabase,
            updateDatabase: updateDatabase,
            deleteDatabase: deleteDatabase,
            getInsensitiveSelector: getInsensitiveSelector,
            getInexactSelector: getInexactSelector
        };
    }]);
})(window.COMPONENTS);

(function () {
    'use strict';
    COMPONENTS.factory('metaService', ['$rootScope', 'pageService', 'mediaService', 'i18nDbService', 'timerService',
    function ($rootScope, pageService, mediaService, i18nDbService, timerService) {

        var windowDimensions;

        /**
         * Sets the header information of the portal (page title, favicon...)
         *
         * @param {string} portalTitle  The title of the portal
         * @param {string} faviconId    The identifier of the favicon of the portal
         */
        function setHeader(portalTitle, faviconId) {
            setTitle(portalTitle);
            setFavicon(faviconId);
        }

        /**
         * Caches the window dimensions (width and height)
         */
        function setWindowDimensions() {
            windowDimensions = { width: $(window).width(), height: $(window).height() };
            $(window).resize(function () { //Auto-update the window dimensions object everytime the window is resized
                //The resize event could be triggered multiple times unnecessary, so from a performance perspective,
                //it's necessary to update the dimensions just once each time the window is actually resized
                if ($(this).width() !== windowDimensions.width || $(this).height() !== windowDimensions.height) {
                    windowDimensions = { width: $(this).width(), height: $(this).height() };
                    $rootScope.$broadcast('onWindowResized', windowDimensions);
                }
            });
        }

        /**
         * Retrieves the cached window dimensions (width and height)
         *
         * @returns {object} The windows width and height
         */
        function getWindowDimensions() {
            return windowDimensions;
        }

        /**
         * Registers portal stats through Google Analytics
         */
        function trackAnalytics(trackingCode) {
            if (trackingCode) {
                //noinspection JSUnresolvedVariable
                var _gaq = _gaq || [], ga, s;
                _gaq.push(['_setAccount', trackingCode]);
                _gaq.push(['_trackPageview']);
                ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            }
        }

        /**
         * Gets the URL of the default favicon image
         *
         */
        function getDefaultFaviconUrl() {
            return '/client/images/favicon.ico';
        }

        /* PRIVATE METHODS */
        function setTitle(portalTitle) {
            var currentPage = pageService.getCurrentPage();
            document.title = i18nDbService.getI18nProperty(currentPage.text).text + ' | ' + portalTitle;
        }

        function setDefaultFavicon() {
            var faviconUrl = getDefaultFaviconUrl();
            $("#favicon").attr('href', faviconUrl);
        }

        function setCustomFavicon(faviconId) {
            mediaService.getMedia(faviconId, null, function (favicon) {
                var faviconUrl = mediaService.getDownloadUrl(favicon) + '?v=' + timerService.getRandomNumber();
                $("#favicon").attr('href', faviconUrl);
            });
        }

        function setFavicon(faviconId) {
            if (faviconId) {
                setCustomFavicon(faviconId);
            } else {
                setDefaultFavicon();
            }
        }
        /* END OF PRIVATE METHODS */

        return {
            setHeader : setHeader,
            setWindowDimensions: setWindowDimensions,
            getWindowDimensions: getWindowDimensions,
            getDefaultFaviconUrl: getDefaultFaviconUrl,
            trackAnalytics: trackAnalytics
        };
    }]);
})();

(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('pageService', ['$rootScope', 'crudService', 'rowService', 'constantsService',
    function ($rootScope, crudService, rowService, constantsService) {

        var pages, currentPage;

        /**
         * Loads the available pages in the system
         *
         * @param {function} callback The function to execute once the pages have been fully loaded
         */
        function loadPages(callback) {
            var params = {
                sort        : { field: 'position', order : '1' }
            };
            crudService.get(constantsService.collections.pages, null, params, function (returnedPages) {
                pages = returnedPages.results;
                if (callback) { callback(getPages()); }
            });
        }

        /**
         * Gets the previously loaded pages
         *
         * @returns {array} The array of previously loaded pages
         */
        function getPages() {
            return pages;
        }

        /**
         * Gets a page based on its unique Url
         *
         * @param   {string} url    The Url that identifies the page that is going to be retrieved
         * @returns {object}        The page identified by the given Url
         */
        function getPage(url) {
            var matchedPage = null;
            pages.forEach(function (page) {
                if ((page.url.toLowerCase() === url.toLowerCase()) && !matchedPage) {
                    matchedPage = page;
                }
            });
            return matchedPage;
        }

        /**
         * Creates a new page
         *
         * @param {object}      data        The info of the new page
         * @param {function}    callback    The function to execute once the page has been fully created
         */
        function createPage(data, callback) {
            crudService.create(constantsService.collections.pages, data, function () {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', 'create');
                    if (callback) { callback(); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         * Updates an existing page
         *
         * @param {string}      pageId      The Id of the page that is going to be updated
         * @param {object}      data        The new information of the page
         * @param {function}    callback    The function to execute once the page has been fully updated
         */
        function updatePage(pageId, data, callback) {
            crudService.update(constantsService.collections.pages, pageId, data, function (data) {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', pageId);
                    if (callback) { callback(data); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         * Updates the current page
         *
         * @param {function}    callback    The function to execute once the current page has been fully updated
         */
        function updateCurrentPage(callback) {
            var currentPage = getCurrentPage();
            updatePage(currentPage._id, currentPage, function (data) {
                if (callback) { callback(data); }
            });
        }

        /**
         * Deletes a given page
         *
         * @param {string}      pageId      The Id of the page that is going to be deleted
         * @param {function}    callback    The function to execute once the page has been fully deleted
         */
        function deletePage(pageId, callback) {
            crudService.delete(constantsService.collections.pages, pageId, function () {
                loadPages(function () {
                    $rootScope.$broadcast(constantsService.collections.pages + 'Changed', pageId);
                    if (callback) { callback(); }
                });
            }, true); //Stop propagating the page change event as it's necessary to manually trigger it afterwards
        }

        /**
         * Gets the current page
         *
         * @returns {object} The information of the current page
         */
        function getCurrentPage() {
            return currentPage;
        }

        /**
         * Updates the current page
         *
         * @param {object} newCurrentPage The page that is going to be set as the new current one
         */
        function setCurrentPage(newCurrentPage) {
            currentPage = newCurrentPage;
        }

        /**
         * Determines if a page is the child of other one
         * @param  {object}     subPage The page that is going to be analyzed if it belongs to a parent page or not
         * @param   {object}    page    The page that is going to be analyzed if it's the parent one or not
         * @returns {boolean}           The result of the analysis: true if both pages are related. False otherwise
         */
        function isSubPageOf(subPage, page) { return subPage.parentPageId === page._id; }

        /**
         * Determines the main scrolling element of the page
         *
         * @returns {jQuery} The pointer to the DOM object where the scrolling area is
         */
        function getMainScrollingElm() {
            return $('ul.pages');
        }

        return {
            loadPages: loadPages,
            getPages: getPages,
            getPage: getPage,
            createPage: createPage,
            updatePage: updatePage,
            updateCurrentPage: updateCurrentPage,
            deletePage: deletePage,
            getCurrentPage: getCurrentPage,
            setCurrentPage: setCurrentPage,
            isSubPageOf: isSubPageOf,
            getMainScrollingElm: getMainScrollingElm
        };
    }]);
})(window.COMPONENTS);

(function () {
    'use strict';
    COMPONENTS.factory('portalService', ['$rootScope', 'pageService', 'crudService', 'constantsService', 'domService', 'metaService',
    function ($rootScope, pageService, crudService, constantsService, domService, metaService) {

        var portal = {};

        /**
         * Loads the current portal data in the context of a given page
         *
         * @param {string}      pageId      The identifier of the page which data is going to be retrieved
         * @param {function}    callback    The callback function to be executed once the process finishes
         */
        function loadPortal(pageId, callback) {
            var bodyObj;
            bodyObj = $('body');
            domService.addLoadingFeedback(bodyObj);
            crudService.get(constantsService.collections.portal, null, null, function (loadedPortal) {
                var pageModel = pageService.getPage(pageId);
                domService.removeLoadingFeedback(bodyObj);
                portal = loadedPortal.results[0];
                updatePageDataFromTemplate(portal, pageModel.rows);
                pageService.setCurrentPage(pageModel);
                $rootScope.$broadcast('portalLoaded');
                if (callback) { callback(portal); }
            });
        }

        /**
         * Gets the current portal data
         *
         * @returns {object} The current portal data
         */
        function getPortal() {
            return portal;
        }

        /**
         * Saves the current portal model
         *
         * @param {function} callback The function to execute once the portal has been fully saved
         */
        function updatePortal(callback) {
            //The user handling will have to be refactored at UXIT-273
            var portalData;
            portalData = angular.copy(portal);
            delete portalData.user;
            updatePageDataFromTemplate(portalData, []);
            crudService.update(constantsService.collections.portal, portalData._id, portalData, function (data) {
                $rootScope.$broadcast('onPortalSaved');
                setHeader(); //Reload the headers as they could have changed
                if (callback) {
                    callback(data);
                }
            });
        }

        /**
         * Updates the current pages data defined in the context of the template structure.
         * The goal is to isolate the template structure knowledge from other resources
         *
         * @param {object} portal   The object that contains the portal data
         * @param {object} pageData The new pages data that is considered to be outside of the template structure (that's the page instance data)
         */
        function updatePageDataFromTemplate(portal, pageData) {
            portal.template.rows[1].columns[0].rows = pageData;
        }

        /**
         * Determines if the fullscreen mode is using the HTML5 API or not
         *
         * @returns {boolean} True if the fullscreen mode is real. False otherwise
         */
        function isRealFullscreen() {
            return portal.fullscreenMode === 'real';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the browser
         *
         * @returns {boolean} True if the fullscreen mode is maximized. False otherwise
         */
        function isMaximizedFullscreen() {
            return portal.fullscreenMode === 'maximized';
        }

        /**
         * Determines if the fullscreen mode is using all the available space in the non-templated area
         *
         * @returns {boolean} True if the fullscreen mode is template. False otherwise
         */
        function isTemplateFullscreen() {
            return portal.fullscreenMode === 'template';
        }

        /**
         * Sets the header information of the portal (page title, favicon...)
         *
         */
        function setHeader() {
            metaService.setHeader(portal.title, portal.faviconId);
        }

        /**
         * Registers portal stats through Google Analytics
         *
         */
        function trackAnalytics() {
            //noinspection JSUnresolvedVariable
            metaService.trackAnalytics(portal.trackingCode);
        }

        return {
            loadPortal: loadPortal,
            getPortal: getPortal,
            updatePortal: updatePortal,
            updatePageDataFromTemplate: updatePageDataFromTemplate,
            isRealFullscreen: isRealFullscreen,
            isMaximizedFullscreen: isMaximizedFullscreen,
            isTemplateFullscreen: isTemplateFullscreen,
            setHeader: setHeader,
            trackAnalytics: trackAnalytics,
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.service('portalsAdminService', ['dbService', function (dbService) {

        function view(scope) {

            var newDb = {};

            dbService.loadDatabases(function (databases) {
                updateModel(databases);
            });

            scope.config = {
                multiSelectable : true,
                creatable       : true,
                editable        : true,
                deletable       : true
            };

            scope.onCreatePanels    = getCreatePanels();
            scope.onEditPanels      = getEditPanels();
            scope.onCreate          = function() { onCreateDb(newDb); };
            scope.onEdit            = function() { onEditDb(scope.onEditPanels[0].bindings.model); };
            scope.onDelete          = function(dbId) { onDeleteDb(dbId); };
            scope.template          = getTemplate();
            scope.transcludedData   = {};

            /** Private methods**/
            function getCreatePanels() {
                return [{
                    title: 'Create database', type: 'editDb',
                    src:'portalsAdmin', view:'editDb', appBridge: true,
                    bindings: {
                        model: newDb
                    }
                }];
            }

            function getEditPanels() {
                return [{
                    title: 'Edit database', type: 'editDb',
                    src:'portalsAdmin', view:'editDb', appBridge: true,
                    bindings : {
                        model: scope.model
                    }
                }];
            }

            function updateModel(databases) {
                scope.databases = databases.results;
            }

            function onCreateDb(database) {
                dbService.createDatabase(database, function(databases) {
                    updateModel(databases);
                });
            }

            function onEditDb(database) {
                dbService.updateDatabase(database._id, database);
            }

            function onDeleteDb(databaseId) {
                dbService.deleteDatabase(databaseId, function(databases) {
                    updateModel(databases);
                });
            }

            function getTemplate() {
                return  '<div class="columns large-25">' +
                    '<h5>{{item.name}}</h5>' +
                    'Size on disk; {{item.sizeOnDisk}} - empty: {{item.empty}}' +
                    '</div>';
            }
            /** Private methods**/
        }

        function createDb(scope) {}
		
		function editDb(scope) {
            if(scope.model) {
                scope.model.typedName = scope.model.name;
            }
        }

        return {
            view: view,
            createDb: createDb,
            editDb: editDb
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('rateService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         * Rates a given item
         *
         * @param {string}      rating              The rating's value
         * @param {string}      targetId            The Id of the item that is going to be rated
         * @param {string}      targetCollection    The collection where the item to be rated is stored
         * @param {function}    callback            The function to execute once the rating has been fully done
         */
        function rate(rating, targetId, targetCollection, callback) {
            var data = {
                rating      : rating,
                target      : {
                    id          : targetId,
                    collection  : targetCollection
                }
            };
            crudService.rate(constantsService.collections.ratings, data, function (avgRating) {
                if(callback) { callback(avgRating); }
            });
        }

        return {
            rate : rate
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('roleService', ['$rootScope', 'sessionService', 'crudService',
    'constantsService', 'i18nService',
    function ($rootScope, sessionService, crudService, constantsService, i18nS) {

        var keyBasedRoles,      //Store an associative array to make the role validation process as easy as possible
            indexBasedRoles;    //Store the public, index-based role data

        $rootScope.$on('languageChanged', function() {
            regenerateRoleKeys();
        });

        /**
         * Loads all the system roles from the backend
         *
         * @param {function} callback Method to be executed once the roles have been fully retrieved
         */
        function loadRoles(callback) {
            var params = { sort: { field: 'karma', order : '1' }};
            crudService.get(constantsService.collections.roles, null, params, function (serverRoles) {
                normalizeRoles(serverRoles.results);
                if (callback) { callback(getRoles()); }
            });
        }

        /**
         * Gets all the system roles
         *
         * @returns {array} The array of system roles
         */
        function getRoles() {
            return indexBasedRoles;
        }

        /**
         * Gets a specific role based on its karma
         *
         * @param   {number}    karma The karma identifier of the role that is going to be retrieved
         * @returns {object}    The role with all the information according to the karma selector
         */
        function getRole(karma) {
            return indexBasedRoles[karma];
        }

        /**
         * Determines if the user has guest role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has guest role. False otherwise
         */
        function hasGuestRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.guest].karma : false;
        }

        /**
         * Determines if the user has reader role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has reader role. False otherwise
         */
        function hasReaderRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.reader].karma : false;
        }

        /**
         * Determines if the user has creator role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has creator role. False otherwise
         */
        function hasCreatorRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.creator].karma : false;
        }

        /**
         * Determines if the user has admin role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has admin role. False otherwise
         */
        function hasAdminRole(user) {
            return (user && keyBasedRoles && user) ? user.role >= keyBasedRoles[constantsService.roles.admin].karma : false;
        }

        /**
         * Determines if the user has super admin role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has super admin role. False otherwise
         */
        function hasSuperAdminRole(user) {
            return (user && keyBasedRoles && user) ? user.role >= keyBasedRoles[constantsService.roles.superAdmin].karma : false;
        }

        /**
         * Gets the admin style class of the current user
         *
         * @returns {string} A key that identifies that the current user has the admin role. Empty string otherwise
         */
        function getCurrentUserAdminAccessStyleClass() {
            return hasAdminRole(sessionService.getUserSession()) ? 'adminAccess' : '';
        }

        /** Private methods **/
        function normalizeRoles(roles) {
            //Initialize the array just once the service is done in order to ease the has*Role actions checks
            keyBasedRoles = [];
            indexBasedRoles = [];
            roles.forEach(function(role) {
                var roleItem = {
                    code        : role.code,
                    karma       : role.karma,
                    title       : i18nS('role.' + role.code),
                    description : i18nS('role.' + role.code + '.description')
                };
                keyBasedRoles[role.code] = roleItem;
                indexBasedRoles.push(roleItem);
            });
        }

        function regenerateRoleKeys() {
            indexBasedRoles.forEach(function(role, index) {
                var title                   = i18nS('role.' + role.code),
                    description             = i18nS('role.' + role.code + '.description'),
                    keyBasedRole            = keyBasedRoles[role.code],
                    indexBasedRole          = indexBasedRoles[index];
                keyBasedRole.title          = title;
                indexBasedRole.title        = title;
                keyBasedRole.description    = description;
                indexBasedRole.description  = description;
            });
        }
        /** End of private methods **/

        return {
            loadRoles           : loadRoles,
            getRoles            : getRoles,
            getRole             : getRole,
            hasGuestRole        : hasGuestRole,
            hasReaderRole       : hasReaderRole,
            hasCreatorRole      : hasCreatorRole,
            hasAdminRole        : hasAdminRole,
            hasSuperAdminRole   : hasSuperAdminRole,
            getCurrentUserAdminAccessStyleClass : getCurrentUserAdminAccessStyleClass
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('sessionService', ['$rootScope', '$routeParams', 'ajaxService', 'objectService',
    function ($rootScope, $routeParams, ajaxService, objectService) {

        var userSession;

        /**
         * Loads the currently logged user session
         *
         * @param {function} callback The function to execute once the session has been fully loaded
         */
        function loadUserSession(callback) {
            ajaxService.ajax({
                url     : 'rest/getSession/',
                method  : 'POST',
                data    : {},
                success	: function (loadedUserSession) {
                    setUserSession(loadedUserSession);
                    if (callback) {
                        callback(getUserSession());
                    }
                }
            });
        }

        /**
         * Gets the session of the currently logged user
         *
         * @returns {object} The info of the session of the currently logged user
         */
        function getUserSession() {
            return userSession;
        }

        /**
         * Attachs session information to a given model object
         *
         * @param {object} model The object where the session data is going to be attached
         */
        function addSessionDataToModel(model) {
            model.create.author = getUserSession();
            delete model.create.authorId;
        }

        /**
         * Determines if the current user is logged or not
         *
         * @returns {boolean} True if the current user is logged. False otherwise
         */
        function isUserLogged() {
            var userSession = getUserSession();
            return !objectService.isEmpty(userSession);
        }

        /**
         * Closes the session of the current user
         */
        function logout() {
            window.open('logout', '_self');
        }

        /** Private methods **/
        function setUserSession(loadedUserSession) {
            if (loadedUserSession) {
                userSession = loadedUserSession;
            } else {
                userSession = null;
            }
        }
        /** End of private methods **/

        return {
            //login: login,
            loadUserSession         : loadUserSession,
            getUserSession          : getUserSession,
            addSessionDataToModel   : addSessionDataToModel,
            isUserLogged            : isUserLogged,
            logout                  : logout
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('statsService', ['crudService', function (crudService) {

        /**
         * Loads the stats of a given collection
         *
         * @param {string}      collection  The target collection where the stats are going to be retrieved from
         * @param {object}      filter      The settings to execute a fine grained query
         * @param {function}    callback    The function to execute once the stats have been fully loaded
         */
        function loadStats(collection, filter, callback) {
            crudService.getStats(collection, filter, function (stats) {
                if(callback) { callback(stats); }
            });
        }

        return {
            loadStats : loadStats
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('tagService', ['crudService', 'constantsService', function (crudService, constantsService) {

        var tags;

        /**
         * Loads the available tags in the system
         *
         * @param {function} callback The function to be executed once all the tags have been fully loaded
         */
        function loadTags(callback) {
            crudService.get(constantsService.collections.tags, null, {}, function (tagsObj) {
                tags = tagsObj.results;
                if (callback) { callback(getTags()); }
            });
        }

        /**
         * Creates a new tag
         *
         * @param {string}      text        The text that represents the new tag
         * @param {function}    callback    The function to be executed once the tag has been fully created
         */
        function createTag(text, callback) {
            crudService.create(constantsService.collections.tags, { text: text }, function (newTag) {
                if (callback) { callback(newTag); }
            });
        }

        /**
         * Updates an existing tag
         *
         * @param {object}      tag         The object that represents the tag that is going to be updated
         * @param {function}    callback    The function to execute once the tag has been fully updated
         */
        function updateTag(tag, callback) {
            var data = { text : tag.text };
            crudService.update(constantsService.collections.tags, tag._id, data, function (updatedTag) {
                if (callback) {
                    callback(updatedTag);
                }
            });
        }

        /**
         * Gets all the previously loaded tags
         *
         * @returns {array} The array of tags that have been previously loaded
         */
        function getTags() {
            return tags;
        }

        return {
            loadTags    : loadTags,
            createTag   : createTag,
            getTags     : getTags,
            updateTag   : updateTag
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('undeployService', ['crudService', function (crudService) {

        /**
         * Undeploys an app from the system
         *
         * @param {object}      appObj      The object that represents the app that is going to be undeployed
         * @param {function}    callback    The function to be executed once the app has been fully undeployed
         */
        function undeploy(appObj, callback) {
            crudService.undeployApp(appObj._id, appObj, function () {
                if (callback) {
                    callback();
                }
            });
        }

        return {
            undeploy: undeploy
        };
    }]);
})();

(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('userService', ['portalService', 'sessionService', 'crudService', '$routeParams', 'constantsService',
    function (portalService, sessionService, crudService, $routeParams, constantsService) {

        var users;

        /**
         * Loads all the available users in the system
         *
         * @param {function} callback The function to be executed once all the users have been fully loaded
         */
        function loadUsers(callback) {
            var params = {
                projection  : { password: 0 } //Avoid sending the password to the frontend
            };
            crudService.get(constantsService.collections.users, null, params, function (returnedUsers) {
                users = returnedUsers.results;
                if (callback) { callback(getUsers()); }
            });
        }

        /**
         * Gets the previously loaded users
         *
         * @returns {array} The array with all the previously loaded users
         */
        function getUsers() {
            return users;
        }

        /**
         * Creates a new user
         *
         * @param {object}      user        The object that stores the new user information
         * @param {function}    callback    The function to be executed once the user has been fully created
         */
        function createUser(user, callback) {
            var data;
            if (user.fullName || user.email || user.password) {
                data = {
                    fullName    : user.fullName,
                    email       : user.email,
                    password    : user.password,
                    role        : user.role,
                    language    : user.language,
                    tags        : user.tags,
                    birthDate   : user.birthDate
                };
                data.mediaId = (user.media && user.media._id) ? user.media._id : null;
                crudService.create(constantsService.collections.users, data, function (newUser) {
                    if (callback) {
                        callback(newUser);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Updates an existing user
         *
         * @param {object}      user        The object that stores the existing user information
         * @param {function}    callback    The function to be executed once the user has been fully updated
         */
        function updateUser(user, callback) {
            var data;
            if (user.fullName || user.email || user.password) {
                data = {
                    fullName    : user.fullName,
                    email       : user.email,
                    role        : user.role,
                    language    : user.language,
                    tags        : user.tags,
                    birthDate   : user.birthDate
                };
                data.mediaId = (user.media && user.media._id) ? user.media._id : null;
                if (user.password) { //Update the password, just in case it's being entered by the user
                    data.password = user.password;
                }
                crudService.update(constantsService.collections.users, user._id, data, function (updatedUser) {
                    if (callback) {
                        callback(updatedUser);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        return {
            loadUsers: loadUsers,
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser
        };
    }]);
})(window.COMPONENTS);

(function () {
    'use strict';
    COMPONENTS.factory('addAppService', ['pageService', 'domService', function (pageService, domService) {

        var addAppPanelActive = false;

        /**
         *  Shows the add app panel
         *
         */
        function showAddAppPanel() {
            var addAppPanelObj  = $('#addAppPanel'),
                wrapperObj      = pageService.getMainScrollingElm();
            addAppPanelObj.attr('state', 'collapsed');
            wrapperObj.addClass('addAppPanelOpen');
            addAppPanelActive = true;
        }

        /**
         * Hides the add app panel
         *
         */
        function hideAddAppPanel() {
            var addAppPanelObj  = $('#addAppPanel'),
                wrapperObj      = pageService.getMainScrollingElm();
            if (addAppPanelActive) {
                addAppPanelActive = false;
                addAppPanelObj.attr('state', 'hidden');
                wrapperObj.removeClass('addAppPanelOpen');
            }
        }

        /**
         * Toggles the add app panel
         *
         */
        function toggleAddAppPanel() {
            if (addAppPanelActive) {
                hideAddAppPanel();
            } else {
                showAddAppPanel();
            }
        }

        /**
         * Determines if the add app panel is visible or not
         *
         * @returns {boolean} True if the add app panel is visible. False otherwise
         */
        function isAddAppPanelActive() {
            return addAppPanelActive;
        }

        return {
            showAddAppPanel     : showAddAppPanel,
            hideAddAppPanel     : hideAddAppPanel,
            toggleAddAppPanel   : toggleAddAppPanel,
            isAddAppPanelActive : isAddAppPanelActive
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('appService', ['$rootScope', '$location', 'portalService', 'pageService', 'rowService',
    'colService', 'arrayService', 'keyboardService',
    function ($rootScope, $location, portalService, pageService, rowService, colService, arrayService, keyboardService) {

        var fullscreen, directiveId = 'app', previousSize;

        /**
         *  Enables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that is being fullscreened
         * @param {number}      _id         The ID of the app that is being fullscreened
         * @param {number}      currentSize The current size of the columns that is wrapping the app that is being fullscreened
         * @param {function}    onResize    The callback function to be executed once the app that is being fullscreened
         */
        function enableFullscreen(element, _id, currentSize, onResize) {
            if(!isFullscreen()) {
                $('html').addClass('fullscreen');
                fullscreen = true;
                if (portalService.isRealFullscreen()) {
                    enableRealFullscreen(element, onResize);
                } else if(portalService.isMaximizedFullscreen()) {
                    enableMaximizedFullscreen(element, _id);
                } else if(portalService.isTemplateFullscreen()) {
                    enableTemplateFullscreen(element, _id, currentSize);
                }
                triggerOnResizeEvent(onResize);
                registerKeyboardEvents(element, onResize);
            }
        }

        /**
         *  Disables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that was fullscreened
         * @param {function}    onResize   The callback function to be executed once the app that was fullscreened
         */
        function disableFullscreen(element, onResize) {
            $('html').removeClass('fullscreen');
            fullscreen = false;
            if (portalService.isRealFullscreen()) {
                disableRealFullscreen(element);
            } else if(portalService.isMaximizedFullscreen()) {
                disableMaximizedFullscreen(element);
            } else if(portalService.isTemplateFullscreen()) {
                disableTemplateFullscreen(element);
            }
            triggerOnResizeEvent(onResize);
            unregisterKeyboardEvents();
        }

        /**
         * Determines if there's any fullscreen app or not
         *
         * @returns {boolean} True if there's any app fullscreen. False otherwise
         */
        function isFullscreen() {
            return fullscreen;
        }

        /**
         * Triggers the onResize event of an app
         *
         * @param {function} onResizeEvent The function to be triggered
         */
        function triggerOnResizeEvent(onResizeEvent) {
            //Give some delay to the onResize callback as it could be affected by the asnync html5 fullscreen event
            if (onResizeEvent) {
                setTimeout(function () { onResizeEvent(); }, 100);
            }
        }

        /**
         * Deletes a given app
         *
         * @param {object}  appElm      The pointer to the DOM object where the app that is going to be deleted id
         * @param {number}  appIndex    The index of the app in the context of the column where it is
         */
        function deleteApp(appElm, appIndex) {
            var columnScope = angular.element(appElm.closest('.columns')).scope(),
                apps = columnScope.column.apps,
                rowScope = columnScope.$parent,
                columns = rowScope.row.columns,
                rows = rowService.getWrappingRows(rowScope, portalService.getPortal().template.rows);
            arrayService.delete(apps, appIndex);
            if (apps.length === 0) {
                colService.deleteColAndDependencies(columns, columnScope.$index);
                if (columns.length === 1 && !rowService.isTemplateRow(rowScope.row)) {
                    rowService.deleteRowAndDependencies(rows, rowScope.$index);
                }
            }
            pageService.updateCurrentPage(null);
            portalService.updatePortal(null);
        }

        /**
         * Gets the pointer to the DOM element where the root node of the app is from a given element
         *
         * @param   {object}    elem    The pointer to the DOM element of the root node of the app
         * @returns {object}            The pointer to the DOM element of an internal node of the app
         */
        function getAppRootElem(elem) {
            return elem.closest('.app');
        }

        /** Private methods **/
        function enableRealFullscreen(element, onResize) {
            $('html').addClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('realFullscreen');
            element.fullScreen(true);
            //If 'ESC' key is pressed, the app event won't be called in HTML5 fullscreen mode
            //Consequently, we need to manually disable the fullscreen state is it's not longer fullscreen
            $(document).bind("fullscreenchange", function () {
                if (!$(document).fullScreen()) {
                    disableFullscreen(element, onResize);
                }
            });
        }

        function disableRealFullscreen(element) {
            $('html').removeClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('realFullscreen');
            element.fullScreen(false);
            $(document).unbind("fullscreenchange");
        }

        function enableMaximizedFullscreen(element, _id) {
            $('html').addClass('appMaximizedFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('maximizedFullscreen');
            updateSearchId(_id);
        }

        function disableMaximizedFullscreen(element) {
            $('html').removeClass('appMaximizedFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('maximizedFullscreen');
            updateSearchId(null);
        }

        function enableTemplateFullscreen(element, _id, currentSize) {
            var columns = element.closest('.columns');
            columns.addClass('colFullscreen large-23');
            columns.prev('.columns').addClass('colFullscreen');
            columns.next('.columns').addClass('colFullscreen');
            previousSize = currentSize;
            $('html').addClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('templateFullscreen');
            updateSearchId(_id);
        }

        function disableTemplateFullscreen(element) {
            $('.colFullscreen.large-23').removeClass('large-23').addClass('large-' + previousSize);
            $('.colFullscreen').removeClass('colFullscreen');
            $('html').removeClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('templateFullscreen');
            updateSearchId(null);
        }

        function registerKeyboardEvents(element, onResize) {
            keyboardService.register('esc', directiveId, function () {
                disableFullscreen(element, onResize);
                $rootScope.$apply();
            });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', directiveId);
        }

        function updateSearchId(_id) {
            $location.search('_id', _id);
        }
        /** End of private methods **/

        return {
            enableFullscreen    : enableFullscreen,
            disableFullscreen   : disableFullscreen,
            isFullscreen        : isFullscreen,
            triggerOnResizeEvent: triggerOnResizeEvent,
            deleteApp           : deleteApp,
            getAppRootElem      : getAppRootElem
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.factory('resizableAppService', ['portalService', 'pageService', 'rowService',
    function (portalService, pageService, rowService) {

        var cols = rowService.getMaxSlots(), previousSize, resizingColumnScope, affectedColumn;

        /**
         * Triggers the resize event (mousedown)
         *
         * @param {object} resizingDomObj   The pointer to the DOM object that will be resized
         * @param {object} event            The mouse(down) event that has been triggered
         */
        function start(resizingDomObj, event) {
            var row = resizingDomObj.closest('.rows'), size = row.width() / cols;
            previousSize = resizingDomObj.width();
            resizingColumnScope = angular.element(resizingDomObj).scope();
            setAffectedColumn(resizingDomObj, event);
            resizingDomObj.resizable('option', 'grid', size);
        }

        /**
         * Executes the resize action
         *
         * @param {object} resizingDomObj   The pointer to the DOM object that is being resized
         */
        function resize(resizingDomObj) {
            var hasBeenReduced = resizingDomObj.width() < previousSize;
            if (affectedColumn) {
                setNewColSizes(hasBeenReduced);
            }
            previousSize = resizingDomObj.width(); //Update the previous size value
            resizingDomObj.removeAttr('style'); //Remove the style data added by the resizable plugin
            //Update the scope of the whole row so both the resizing and the affected cols changes will be executed
            resizingColumnScope.$parent.$apply();
            pageService.updateCurrentPage(null);
            portalService.updatePortal(null);
        }

        /** Private methods **/
        function setAffectedColumn(resizingDomObj, event) {
            var index = resizingColumnScope.$index;
            //noinspection JSUnresolvedVariable
            if (event.clientX > resizingDomObj.offset().left + resizingDomObj.width() / 2) { //Resize from east
                setNextAffectedColumn(index);
            } else { //Resize from west
                setPrevAffectedColumn(index);
            }
        }

        function setNextAffectedColumn(resizingColumnIndex) {
            var nextColumn = resizingColumnScope.$parent.row.columns[resizingColumnIndex + 1];
            affectedColumn = (shouldResizeNextColumn(resizingColumnIndex, nextColumn))
                ? nextColumn : resizingColumnScope.$parent.row.columns[resizingColumnIndex + 2];
        }

        function setPrevAffectedColumn(resizingColumnIndex) {
            var prevColumn = resizingColumnScope.$parent.row.columns[resizingColumnIndex - 1];
            affectedColumn = (shouldResizePrevColumn(resizingColumnIndex, prevColumn))
                ? prevColumn : resizingColumnScope.$parent.row.columns[resizingColumnIndex - 2];
        }

        function shouldResizePrevColumn(resizingColumnIndex, prevColumn) {
            return resizingColumnIndex === 1 || prevColumn.size > 1;
        }

        function shouldResizeNextColumn(resizingColumnIndex, nextColumn) {
            return resizingColumnIndex === resizingColumnScope.$parent.row.columns.length - 2 || nextColumn.size > 1;
        }

        function setNewColSizes(hasBeenReduced) {
            if (hasBeenReduced && resizingColumnScope.column.size > 1) { //Reduce resizing column
                resizingColumnScope.column.size = resizingColumnScope.column.size - 1;
                affectedColumn.size = affectedColumn.size + 1;
            } else if (affectedColumn.size > 1) { //Increase resizing column
                resizingColumnScope.column.size = resizingColumnScope.column.size + 1;
                affectedColumn.size = affectedColumn.size - 1;
            }
        }
        /** End private methods **/

        return {
            start: start,
            resize: resize
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.factory('sortableAppService', ['$rootScope', '$timeout', 'portalService', 'pageService', 'rowService',
    'colService', 'arrayService', 'keyboardService', 'timerService',
    function ($rootScope, $timeout, portalService, pageService, rowService, colService, arrayService, keyboardService, timerService) {

        var originalElm, isUpdateBlocked = false, options;

        /**
         * Triggers the sort event
         *
         * @param {object} ui   The object that holds the information about the item that will be sorted
         */
        function start(ui) {
            $('html').addClass('sorting');
            originalElm = $(ui.item).parent();
            isUpdateBlocked = !$(ui.item).hasClass('new');
            registerKeyboardEvents();
        }

        /**
         * Executes the update action
         *
         * @param {object} ui   The object that holds the information about the item that will be sorted
         */
        function update(ui) {
            setOptions(originalElm, $(ui.item));
            if (isUpdateTime()) {
                updateIfThereIsSpace();
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }
            isUpdateBlocked = false;
        }

        /**
         * Finishes the sort event
         *
         */
        function stop() {
            unregisterKeyboardEvents();
            $('html').removeClass('sorting');
        }

        /** Private methods **/
        function isUpdateTime() {
            return colService.areSameCol(options.originalCol, options.dropCol) || !isUpdateBlocked || options.isNewItem;
        }

        function registerKeyboardEvents() {
            keyboardService.register('esc', 'sortableApp', function () {
                $('[sortable-app]').trigger('mouseup');
            });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', 'sortableApp');
        }

        function updateIfThereIsSpace() {
            if (!rowService.isAvailableSpaceInRow(options.dropRow, options.dropCol, options.affectedDropCol)) {
                blockUpdate();
            } else {
                $timeout(function () {
                    executeUpdate();
                }, 0);
            }
        }

        function setOptions(originalElm, droppedElm) {
            var wrappingRows = portalService.getPortal().template.rows;
            options = {};
            options.isNewItem               = droppedElm.attr('sortable-add-app') !== undefined;
            options.wrapperOriginalRowScope = angular.element(originalElm.closest('.rows')).scope();
            options.wrapperDropRowScope     = angular.element(droppedElm.closest('.rows')).scope();
            options.originalRows            = rowService.getWrappingRows(options.wrapperOriginalRowScope, wrappingRows);
            options.dropRows                = rowService.getWrappingRows(options.wrapperDropRowScope, wrappingRows);
            options.droppedElm              = droppedElm;
            options.originalColIndex        = originalElm.closest('.columns').prevAll('.columns').size();
            options.dropColIndex            = droppedElm.closest('.columns').prevAll('.columns').size();
            options.originalRowIndex        = originalElm.closest('.rows').prevAll('.rows').size();
            options.originalAppIndex        = originalElm.prevAll('.app').size();
            options.dropRowIndex            = droppedElm.closest('.rows').prevAll('.rows').size();
            options.dropAppIndex            = droppedElm.prevAll('.app').size();
            options.originalRow             = originalElm.closest('.rows').scope().row;
            options.dropRow                 = droppedElm.closest('.rows').scope().row;
            options.dropCol                 = options.dropRow.columns[options.dropColIndex];
            options.originalCol             = options.originalRow.columns[options.originalColIndex];
            options.elmHasChangedRow        = options.originalRow.$$hashKey !== options.dropRow.$$hashKey;
            options.affectedDropCol         = colService.getAffectedCol(options.dropRow.columns, options.dropColIndex);
            options.affectedOriginalCol     = (options.elmHasChangedRow)
                ? colService.getAffectedCol(options.originalRow.columns, options.originalColIndex)
                : options.affectedDropCol;
            return options;
        }

        function blockUpdate() {
            deleteNewDroppedElm(options.dropCol, options.droppedElm, options.dropAppIndex);
            $timeout(function () { //It's necessary to delete the dropped item in a new thread
                arrayService.delete(options.dropCol.apps, options.dropAppIndex);
            });
        }

        function executeUpdate() {
            if (options.isNewItem) { //That's a new item that comes from drag and drop
                deleteNewDroppedElm(options.dropCol, options.droppedElm, options.dropAppIndex);
            }
            updateConsideringRowChange(); //New and / or old column were empty -> resize is required
            decorateDropRow(); //New row handling
            //For some reason, in some cases the dragging app is not deleted, so it's necessary to explicitly delete it
            deleteGhostApp();
            pageService.updateCurrentPage(null);
            portalService.updatePortal(null);
        }

        function updateConsideringRowChange() {
            if (options.isNewItem || options.dropCol.apps.length === 1 || options.originalCol.apps.length === 0) {
                if (options.isNewItem || options.elmHasChangedRow) {
                    updateWithRowChange();
                } else {
                    updateWithoutRowChange();
                }
            }
        }

        function updateWithRowChange() {
            if (rowService.isDropRowEmpty(options.dropRow) && !rowService.isTemplateRow(options.wrapperDropRowScope.row)) {
                addEmptyRows();
            }
            if (options.affectedDropCol && options.dropCol.apps.length > 0) {
                updateWithRowChangeNonEmptyOriginalColumn();
            } else if (options.affectedOriginalCol) {
                updateWithRowChangeEmptyOriginalColumn();
            }
        }

        function updateWithRowChangeEmptyOriginalColumn() {
            var availableWidth = options.affectedOriginalCol.size + options.originalCol.size;
            options.affectedOriginalCol.size = availableWidth + 1;
        }

        function updateWithRowChangeNonEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.affectedDropCol.size;
            options.dropCol.size = Math.ceil(availableWidth / 2) + 1;
            options.affectedDropCol.size = Math.floor(availableWidth / 2) - 1;
            if (options.affectedOriginalCol && !options.originalCol.apps.length) {
                availableWidth = options.affectedOriginalCol.size + options.originalCol.size;
                options.affectedOriginalCol.size = availableWidth + 1;
            }
        }

        function updateWithoutRowChange() {
            if (options.affectedDropCol && options.originalCol.apps.length) {  //The old column not is empty!!
                updateWithoutRowChangeNonEmptyOriginalColumn();
            } else { //The old column is empty!!
                updateWithoutRowChangeEmptyOriginalColumn();
            }
        }

        function updateWithoutRowChangeEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.originalCol.size;
            options.dropCol.size = availableWidth + 1;
        }

        function updateWithoutRowChangeNonEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.affectedDropCol.size;
            if (options.affectedDropCol.$$hashKey !== options.dropCol.$$hashKey) {
                options.dropCol.size = Math.ceil(availableWidth / 2) + 1;
                options.affectedDropCol.size = Math.floor(availableWidth / 2) - 1;
            }
        }

        function addEmptyRows() {
            rowService.addEmptyRow(options.dropRows, options.dropRowIndex);
            rowService.addEmptyRow(options.dropRows, options.dropRowIndex + 2);
            //If the two new rows were added before the original row is,
            //it's necessary to increase the pointer to the original row index as well
            if (options.dropRowIndex < options.originalRowIndex) {
                options.originalRowIndex += 2;
            }
        }

        function decorateDropRow() {
            if (options.dropCol.apps.length === 1) { //There's just the new dropped item
                colService.addEmptyCols(options.dropRow, options.dropCol, options.dropColIndex);
            }
            colService.normalizeEmptyCols(options.originalRow);
            if (rowService.isOriginalRowEmpty(options.originalRow)
            && !rowService.isTemplateRow(options.wrapperOriginalRowScope.row)) {
                rowService.deleteRowAndDependencies(options.originalRows, options.originalRowIndex);
            }
        }

        function deleteGhostApp() {
            if ((options.droppedElm.siblings('[app]:not(:empty)').size() + 1) > options.dropCol.apps.length) {
                options.droppedElm.remove();
            }
        }

        function deleteNewDroppedElm(dropCol, droppedElm, dropAppIndex) {
            dropCol.apps.forEach(function (item, index) {
                if (!item) {
                    arrayService.delete(dropCol.apps, index);
                }
            });
            arrayService.add(dropCol.apps, { type: droppedElm.attr('type'), id: timerService.getRandomNumber() }, dropAppIndex);
            droppedElm.remove();
        }
        /** End private methods **/

        return {
            start: start,
            update: update,
            stop: stop
        };
    }]);
})();
(function () {
    'use strict';

    COMPONENTS.factory('bannerItemService', ['$rootScope', '$injector', 'stringService',
    function ($rootScope, $injector, stringService) {

        var gridSize = 50;

        /**
         * Gets the grid size that represents the minimum position change of each item
         *
         * @returns {number} The grid size
         */
        function getGridSize() {
            return gridSize;
        }

        /**
         * Gets the default value of a given type
         *
         * @param   {string} type   The identifier of the type which default value is going to be retrieved
         * @returns {string}        The default value of the given type
         */
        function getDefaultValue(type) {
            var itemService = getTypeService(type);
            return itemService.getDefaultValue();
        }

        /**
         * Gets the service of the given type
         *
         * @param   {string}    type    The identifier of the type which service is going to be retrieved
         * @returns {object}            The service of the given type
         */
        function getTypeService(type) {
            var serviceName = getServiceName(type);
            return $injector.get(serviceName);
        }

        /**
         * Updates the DOM based on the given model infornation
         *
         * @param {object}  item    The model of the element that is going to update the DOM
         * @param {object}  boxElm  The pointer to the DOM object where the content of the element is
         * @param {object}  borders The object that contains the information about
         *                          the vertical and horizontal border widths
         */
        function setDomCoordinatesFromModel(item, boxElm, borders) {
            boxElm.css('width', item.size.width - borders.horizontal);
            boxElm.css('height', item.size.height - borders.vertical);
            boxElm.css('top', item.position.top);
            boxElm.css('left', item.position.left);
        }

        /**
         * Updates the DOM based on the given DOM information
         *
         * @param {object}  item        The model of the element that is going to he updated
         *                              according to the DOM information
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the element is
         * @param {object}  borders     The object that contains the information about
         *                              the vertical and horizontal border widths
         */
        function setModelCoordinatesFromDom(item, contentElm, boxElm, borders) {
            item.size.width    = getNormalizedSize(contentElm.width(), boxElm.width(), borders.horizontal);
            item.size.height   = getNormalizedSize(contentElm.height(), boxElm.height(), borders.vertical);
            item.position.top  = parseInt(boxElm.css('top'), 10);
            item.position.left = parseInt(boxElm.css('left'), 10);
            if(!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        /**
         * Updates the view and the model according to the state of the item
         *
         * @param {object}  item        The model of the element
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the element is
         * @param {object}  borders     The object that contains the information about
         *                              the vertical and horizontal border widths
         */
        function refresh(item, contentElm, boxElm, borders) {
            //Update the model before propagating the changes
            setModelCoordinatesFromDom(item, contentElm, boxElm, borders);
            //Here, the model is updated, but its still necessary to update the DOM
            //in order to get the changes refreshed
            setDomCoordinatesFromModel(item, boxElm, borders);
        }

        /**
         * Propagates the changes to the parent scope
         *
         * @param {function} onChangeFn The function to be executed
         */
        function propagateChanges(onChangeFn) {
            if(onChangeFn) {
                onChangeFn();
            }
        }

        /** Private methods **/
        function getNormalizedSize(contentSize, boxSize, borderBox) {
            if(contentSize > boxSize) {
                var heightSlots = Math.ceil(contentSize / gridSize);
                return heightSlots * gridSize;
            }
            return boxSize + borderBox;
        }

        function getServiceName(type) {
            return 'banner' + stringService.capitalize(type) + 'Service';
        }
        /** End of private methods **/

        return {
            getGridSize: getGridSize,
            getDefaultValue: getDefaultValue,
            getTypeService: getTypeService,
            refresh: refresh,
            setDomCoordinatesFromModel: setDomCoordinatesFromModel,
            setModelCoordinatesFromDom: setModelCoordinatesFromDom,
            propagateChanges: propagateChanges
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('emailService', ['ajaxService', function (ajaxService) {

        /**
         * Validates a given email
         *
         * @param   {string}    email The email string to be validated
         * @returns {boolean}   True if the string is valid. False otherwise
         */
        function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }

        /**
         * Sends an email
         * @param {object}  data        The details of the email (addressee(s), title, content...)
         * @param           callback    The method to execute once the message is sent
         */
        function sendEmail(data, callback) {
            ajaxService.ajax({
                url     : 'rest/sendEmail',
                method  : 'POST',
                data    : data,
                success	: function (response) {
                    if (callback) {
                        callback(response);
                    }
                }
            });
        }

        return {
            validateEmail: validateEmail,
            sendEmail: sendEmail
        };
    }]);
})();

(function (io) {
    'use strict';
    COMPONENTS.factory('liveMessageService', [function () {

        var socket = io.connect(window.location.origin);

        socket.on('publicMessageReceived', function (data) {
            //stdService.error(data.text, data.details);
            alert("msg received" + data.text + ' - ' + data.details);
        });

        /**
         * Sends a public portal message to all the connected users
         * @param {object}  data        The details of the message that is going to be shown (title and details)
         * @param           callback    The method to execute once the message is sent
         */
        function sendPublicMessage(data, callback) {
            socket.emit('publicMessage', data, function (result) {
                if (callback) { callback(result); }
            });
        }

        return {
            sendPublicMessage: sendPublicMessage
        };
    }]);
})(window.io);

(function () {
    'use strict';

    COMPONENTS.factory('contentEditableRichContentService', ['contentEditableService', 'editBoxUtilsService',
    'textSelectionService', 'tooltipService', 'styleService',
    function (contentEditableService, editBoxUtilsService, textSelectionService, tooltipService, styleService) {

        /**
         * Shows the edit box in order to modify the styles of the currently selected text
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function showEditBox(cEScope, cEDomObj, ngModelCtrl) {
            if (cEScope.isEditable() && textSelectionService.isSelection()) {
                var selectedTextDomObj = textSelectionService.getSelectedTextDomObj(), defaultPanels;
                cEScope.style = styleService.getComputedStyleInRange(cEDomObj, selectedTextDomObj);
                defaultPanels = [{ title: 'Content', type: 'richContent', bindings: { style: cEScope.style} }];
                forceTextSelection();
                cEScope.panels = (cEScope.customPanels) ? cEScope.customPanels : defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(cEScope);
                };
                cEScope.onChange = function() {
                    onChangeEditBox(cEScope, cEDomObj, ngModelCtrl, cEScope.style);
                };
                editBoxUtilsService.showEditBox(cEScope, cEDomObj, selectedTextDomObj);
                cEScope.showActions = true;
            }
        }

        /** Private methods **/
        function onSaveEditBox(cEScope, cEDomObj, ngModelCtrl) {
            setLinkTitles(cEScope); //Set the titles of the links with the tooltip directive
            textSelectionService.removeSelection(); //Remove text selection, if case
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
            contentEditableService.propagateChanges(cEScope);
        }

        function onCancelEditBox(cEScope) {
            textSelectionService.removeSelection(); //Remove text selection, if case
            contentEditableService.propagateChanges(cEScope);
        }

        function onChangeEditBox(cEScope, cEDomObj, ngModelCtrl, styles) {
            textSelectionService.restoreSelection(); //Restore saved selection
            textSelectionService.setStylesToSelection(styles); //Apply styles physically
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
        }

        function forceTextSelection() {
            textSelectionService.setFakeSelection();
            textSelectionService.saveSelection(); //Save the current text selection to be able to restore if afterwards
        }

        function setLinkTitles(cEScope) {
            var selLinkDomObj = textSelectionService.getSelectedLink(),
                newTitle = selLinkDomObj.attr('title');
            if(selLinkDomObj.size()) { //Update titles just if the edited element is as link
                if(tooltipService.exists(selLinkDomObj)) {
                    updateLinkTitle(selLinkDomObj, newTitle); //If the link already existed, update it
                } else { //If the link has just been created, compile it
                    contentEditableService.compileElement(cEScope, selLinkDomObj);
                }
                //Save a backup of the title so it would be regenerated afterwards if necessary
                tooltipService.backupTitle(selLinkDomObj, newTitle);
            }
        }

        function updateLinkTitle(linkObj, newTitle) {
            tooltipService.setTitle(newTitle, linkObj, true);
            linkObj.removeAttr('title');
        }
        /** End of private methods **/

        return {
            showEditBox: showEditBox
        };
    }]);
})();
(function () {
    'use strict';

    COMPONENTS.factory('contentEditableSelectMediaService', ['contentEditableService', 'editBoxUtilsService', 'mediaService',
    function (contentEditableService, editBoxUtilsService, mediaService) {
        
        /**
         * Shows the edit box in order to modify the properties of the currently selected media (source, size...)
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} sMDomObj     The pointer to the DOM object where the selected text is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function showEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl) {
            var defaultPanels = [{
                title: 'Select media',
                type: 'selectMedia',
                bindings: {
                    mediaSize: getMediaSize(sMDomObj)
                },
                onLayer: {
                    change: function(newMedia, mediaSize) {
                        setMediaSrc(sMDomObj, newMedia);
                        setMediaSize(sMDomObj, mediaSize);
                    }
                }}];
            if (cEScope.isEditable()) {
                unselectItem($('img.active', cEDomObj));
                editBoxUtilsService.hideEditBox(cEScope.$id);
                selectItem(sMDomObj);
                cEScope.panels = defaultPanels;
                cEScope.onSave = function() {
                    onSaveEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl);
                };
                cEScope.onCancel = function() {
                    onCancelEditBox(sMDomObj);
                };
                editBoxUtilsService.showEditBox(cEScope, cEDomObj, sMDomObj);
                cEScope.showActions = true;
            }
        }

        /** Private methods **/
        function onSaveEditBox(cEScope, cEDomObj, sMDomObj, ngModelCtrl) {
            unselectItem(sMDomObj);
            contentEditableService.updateValue(cEScope, cEDomObj, ngModelCtrl);
            contentEditableService.propagateChanges(cEScope);
        }

        function onCancelEditBox(sMDomObj) {
            unselectItem(sMDomObj);
        }

        function selectItem(domObj) {
            domObj.addClass('active');
        }

        function unselectItem(domObj) {
            domObj.removeClass('active');
        }

        function setMediaSrc(sMDomObj, sMData) {
            if(sMData) {
                sMDomObj.attr('src', mediaService.getDownloadUrl(sMData));
            }
        }

        function setMediaSize(sMDomObj, mediaSize) {
            sMDomObj.attr('size', mediaSize);
        }

        function getMediaSize(sMDomObj) {
            return sMDomObj.attr('size');
        }
        /** End of private methods **/

        return {
            showEditBox: showEditBox
        };
    }]);
})();
(function () {
    'use strict';

    COMPONENTS.factory('contentEditableService', ['$compile', '$timeout', 'editBoxUtilsService',
    function ($compile, $timeout, editBoxUtilsService) {

        /**
         * Updates the model, sending the uxChange event
         *
         * @param {object} cEScope      The scope of the content editable component
         * @param {object} cEDomObj     The pointer to the DOM object where the content editable is
         * @param {object} ngModelCtrl  The controller of the ng-model directive attached to the content editable component
         */
        function updateValue(cEScope, cEDomObj, ngModelCtrl) {
            if (cEDomObj.html() === '<br>') { cEDomObj.html(''); }
            cEScope.content = cEDomObj.html();     //Set the model value
            handlePlaceholder(cEScope);
            ngModelCtrl.$setViewValue(cEScope.content);
            if (cEScope.uxChange) { cEScope.uxChange(); }
        }

        /**
         * Propagates the blur event. In practice, this means to finish editing the content of the content editable component
         *
         * @param {object} cEScope The scope of the content editable component
         */
        function propagateChanges(cEScope) {
            //It's necessary to execute the blur actions with some delay to ensure the model is up to date before
            //For instance, without it the showActions flag will be set to false immediately,
            //and so the action buttons will never be reached as their keyup event is fired after this blur one
            $timeout(function() {
                if (!editBoxUtilsService.isAnyEditBoxVisible()) {
                    cEScope.showActions = false;
                    if (cEScope.onBlur) {
                        cEScope.onBlur();
                    }
                }
            }, 250);
        }

        /**
         * Determines if the placeholder of the content editable component has to be shown or hidden depending on the content
         *
         * @param {object} cEScope The scope of the content editable component
         */
        function handlePlaceholder(cEScope) {
            cEScope.showPlaceholder = (cEScope.content === undefined || cEScope.content === '');
        }

        /**
         * Compiles a piece of DOM
         *
         * @param {object} cEScope  The scope of the content editable component
         * @param {object} elmObj   The pointer to the DOM object where the content editable is
         */
        function compileElement(cEScope, elmObj) {
            $compile(elmObj)(cEScope);
        }

        /** Private methods **/

        /** End of private methods **/

        return {
            updateValue: updateValue,
            propagateChanges: propagateChanges,
            handlePlaceholder: handlePlaceholder,
            compileElement: compileElement
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.factory('globalMsgService', [function () {

        var onShowObservers = [], onHideObservers = [];

        /**
         * Shows the global message
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed,
         *                          that will be shown just whenever the user will click in the 'show details' link
         */
        function show(text, details) {
            var normalizedMessage = normalizeMessage(text, details);
            onShowObservers.forEach(function (onShowObserver) {
                onShowObserver(normalizedMessage.text, normalizedMessage.details);
            });
        }

        /**
         * Hides the global message
         *
         */
        function hide() {
            onHideObservers.forEach(function (onHideObserver) {
                onHideObserver();
            });
        }

        /**
         * Triggers a given observer event whenever the global message is shown
         *
         * @param {function} observer The function to be executed whenever the global message is shown
         */
        function onShow(observer) {
            onShowObservers.push(observer);
        }

        /**
         * Triggers a given observer event whenever the global message is hidden
         *
         * @param {function} observer The function to be executed whenever the global message is hidden
         */
        function onHide(observer) {
            onHideObservers.push(observer);
        }

        /** Private methods **/
        function normalizeMessage(text, details) {
            var normalizedMessage = {};
            try {
                normalizedMessage = $.parseJSON(text);
            } catch(ex) {
                normalizedMessage = { text: text, details: details };
            }
            return normalizedMessage;
        }
        /** End of private methods **/

        return {
            show: show,
            hide: hide,
            onShow: onShow,
            onHide: onHide
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('loadingService', [function () {

        NProgress.configure({ trickleRate: 0.1, trickleSpeed: 0 });

        /**
         * Starts the loading visual reference
         *
         */
        function start() {
            NProgress.start();
        }

        /**
         * Ends the loading visual reference
         *
         */
        function done() {
            NProgress.done();
        }

        return {
            start: start,
            done: done
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('stdService', ['globalMsgService', function (globalMsgService) {

        /**
         * Shows a warn message on the browser console
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed
         */
        function warn(text, details) {
            console.warn("[WARN] " + text, details);
        }

        /**
         * Shows an error message on the browser console and on the global service mechanism
         *
         * @param {string} text     Main text of to be displayed
         * @param {string} details  Secondary text to be displayed
         */
        function error(text, details) {
            console.error("[ERROR] " + text, details);
            globalMsgService.show(text, details);
        }

        /**
         * Shows a todo message on the browser console
         *
         * @param {string} text Main text of to be displayed
         */
        function todo(text) {
            console.log("[TODO] " + text);
        }

        return {
            warn: warn,
            error: error,
            todo: todo
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('tooltipService', ['i18nService', 'i18nDbService', function (i18nService, i18nDbService) {

        /**
         * Initializes the title attribute of a given DOM object
         *
         * @param {object}  element         The pointer to the DOM object where the title is going to be attached
         * @param {string}  title           The text that is going to be set as the new title of the DOM object
         * @param {object}  customOptions   Title options (positions, fades...)
         * @param {boolean} isHtml          True if the text is going to be displayed as rich, HTML format. False otherwise
         */
        function initialize(element, title, customOptions, isHtml) {
            element.powerTip(customOptions);
            setTitle(title, element, isHtml);
            element.removeAttr('title');
        }

        /**
         * Shows the title of a given DOM object
         *
         * @param {object} element The pointer to the DOM object where the title is going to be shown
         */
        function show(element) {
            if(exists(element)) {
                $.powerTip.show(element);
            }
        }

        /**
         * Hides all the currently alive titles
         *
         */
        function hide() {
            try {
                $.powerTip.hide(null, true);
            } catch(e) {}
        }

        /**
         * Executes a callback function whenever the title attached to a DOM object is closed
         *
         * @param {object}      element     The pointer to the DOM object where the event is going to be triggered
         * @param {function}    callback    The function to execute whenever the title attached to the DOM object is closed
         */
        function onClose(element, callback) {
            element.on({
                powerTipClose: function() {
                    if(callback) { callback(); }
                }
            });
        }

        /**
         * Gets the title default options
         *
         * @returns {{smartPlacement: boolean, fadeInTime: number, fadeOutTime: number, closeDelay: number, mouseOnToPopup: boolean}}
         * The title default options
         */
        function getDefaults() {
            return {
                smartPlacement : true,
                fadeInTime: 0,
                fadeOutTime: 0,
                closeDelay: 200,
                mouseOnToPopup : true
            };
        }

        /**
         * Determines if the tooltip has been already attached to the given element
         *
         * @param   {object}    element The pointer to the DOM object where the element that is going to be analyzed is
         * @returns {boolean}           True if the given element already has the tooltip attached to it. False otherwise
         */
        function exists(element) {
            return element.data('powertip');
        }

        /**
         * Stores a backup ot the tooltip. This could be necessary in some cases as the tooltip component
         * deletes the 'title' attribute. Consequently, if the DOM element is saved (i.e. from content-editable)
         * next time it's compiled it won't have the 'title' attribute, and so the tooltip won't be applied there.
         * In practice, there's a backup-title directive that re-enables the original and so it's compiled as usual
         *
         * @param {object} element  The pointer to the DOM object where the title that is going to be backuped is
         * @param {string} title    The title that is going to be backuped
         */
        function backupTitle(element, title) {
            element.attr('backup-title', title);
        }

        /** Private methods **/

        /**
         * Updates the title attribute of a given DOM object
         *
         * @param {string}  newTitle    The text that is going to be set as the new title of the DOM object
         * @param {object}  element     The pointer to the DOM object where the title is going to be attached
         * @param {boolean} isHtml      True if the text is going to be displayed as rich, HTML format. False otherwise
         */
        function setTitle(newTitle, element, isHtml) {
            var hasI18nTitle = element.attr('i18n-title'), hasI18nDbTitle = element.attr('i18n-db-title');
            if(isHtml) { //The data comes as HTML, so as it doesn't make sense do to anything with it, display it as it is
                element.data('powertip', newTitle);
            } else if (hasI18nTitle !== undefined) { //i18n value
                element.data('powertip', i18nService(newTitle));
            } else if (hasI18nDbTitle !== undefined) { //i18n-db value
                try { //The title could be a JSON object for i18n pourposes, so it's necessary to get the proper language
                    element.data('powertip', i18nDbService.getI18nProperty(jQuery.parseJSON(newTitle)).text);
                } catch(ex) { //If the title is not JSON object based (i18ndb is not ready yet, just display the value as it is
                    element.data('powertip', newTitle);
                }
            } else { //Plain value
                element.data('powertip', newTitle);
            }
        }
        /** End of private methods **/

        return {
            initialize: initialize,
            show: show,
            hide: hide,
            onClose: onClose,
            getDefaults: getDefaults,
            exists: exists,
            backupTitle: backupTitle
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('i18nDbService', ['i18nService', 'objectService', function (i18nService, objectService) {

        /**
         * Gets the i18n value of a given object
         *
         * @param   {object}    obj The object that holds the i18n information in all the available languages
         * @returns {object}        The {text: value} format object with the value of the current or default language
         */
        function getI18nProperty(obj) {
            var currentLanguage = i18nService.getCurrentLanguage(),
                defaultLanguage = i18nService.getDefaultLanguage();
            //The i18n structure will be set if it has not been defined yet
            return (obj && objectService.isObject(obj)) ? (obj[currentLanguage] || obj[defaultLanguage]) : {text: obj};
        }

        /**
         * Determines if a given object has or not i18n structure
         *
         * @param   {object}    obj The object that is going to be analyzed
         * @returns {boolean}       True if the given object has i18n structure. False otherwise
         */
        function hasI18nStructure(obj) {
            var currentLanguage = i18nService.getCurrentLanguage();
            return obj && obj[currentLanguage] !== undefined;
        }

        /**
         * Initializes the i18n structure of a given object
         *
         * @param   {object}  obj   The object that holds the value that is going to be normalized into i18n format
         * @returns {object}        The object with the i18n format ({defaultLanguage: { text: value}}}
         */
        function setInitI18nStructure(obj) {
            var objText = obj;
            obj = {};
            obj[i18nService.getDefaultLanguage()] = {
                text: objText
            };
            return obj;
        }

        return {
            getI18nProperty: getI18nProperty,
            hasI18nStructure: hasI18nStructure,
            setInitI18nStructure: setInitI18nStructure
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('i18nService', ['$rootScope', 'crudService', 'constantsService',
    function ($rootScope, crudService, constantsService) {

        /** Private methods **/
        function getBrowserLanguage() {
            return (navigator.language || navigator.userLanguage).split('-')[0];
        }
        /** End private methods **/

        var languages,
            userLanguage    = getBrowserLanguage(),
            defaultLanguage = 'en',
            settings = {
                name: 'messages',
                path: '/client/messages/',
                mode: 'map',
                language: userLanguage,
                callback: function () {}
            };

        $.i18n.properties(settings);

        /**
         * Retrieves the i18n value of a given key
         *
         * @returns {Function} The function that returns the value of the given key
         */
        function i18n() {
            return $.i18n.prop.apply($.i18n, arguments);
        }

        /**
         * Loads all the available languages in the system
         *
         * @param {function} callback The function to execute once all the languages have been loaded
         */
        i18n.loadLanguages = function (callback) {
            crudService.get(constantsService.collections.languages, null, {}, function (loadedLanguages) {
                languages = loadedLanguages.results;
                if (callback) { callback(i18n.getLanguages()); }
            });
        };

        /**
         * Gets all the loaded languages
         *
         * @returns {array} The array with the loaded languages
         */
        i18n.getLanguages = function () {
            return languages;
        };

        /**
         * Gets the current language
         *
         * @returns {string} The current language code
         */
        i18n.getCurrentLanguage = function () {
            return settings.language;
        };

        /**
         * Gets the default language
         *
         * @returns {string} The default language code
         */
        i18n.getDefaultLanguage = function () {
            return defaultLanguage;
        };

        /**
         * Changes the language code
         *
         * @param {string} langCode The language that is going to be set as the current one
         */
        i18n.changeLanguage = function changeLanguage(langCode) {
            var datePickerLangCode;
            if (langCode !== settings.language) {
                settings.language = langCode;
                $.i18n.properties(settings);
                datePickerLangCode = (langCode === defaultLanguage) ? '' : langCode;
                $.datepicker.setDefaults( $.datepicker.regional[datePickerLangCode] );
                $rootScope.$broadcast('languageChanged', langCode);
            }
        };

        return i18n;
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('colService', ['$rootScope', 'rowService', 'arrayService',
    function ($rootScope, rowService, arrayService) {

        /**
         * Normalizes the structure of a given row
         *
         * @param {object} row  The row that is going to be normalized
         */
        function normalizeEmptyCols(row) {
            for (var i = 0; i < row.columns.length; i += 1) {
                if (normalizeEmptyCol(row.columns, i)) { //If a col was normalized, start the process again
                    normalizeEmptyCols(row);
                }
            }
            //If there's just one column alive, force it to fit all the available space in the row
            if(row.columns.length === 1) {
                row.columns[0].size = rowService.getMaxSlots();
            }
        }

        /**
         * Adds empty columns as siblings of a given one
         *
         * @param {object}  dropRow      The row where the column where the empty columns are going to be added is
         * @param {object}  dropCol      The column where the empty columns are going to be added
         * @param {integer} dropColIndex The index of the column where the empty columns are going to be added
         */
        function addEmptyCols(dropRow, dropCol, dropColIndex) {
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex);
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex + 2);
            dropCol.size = dropCol.size -= 2;
        }

        /**
         * Deletes not only a given column but also its empty siblings
         *
         * @param {object}  columns     The array with the columns were the one that is going to be deleted is
         * @param {integer} columnIndex The index of the column that is going to be deleted
         */
        function deleteColAndDependencies(columns, columnIndex) {
            var affectedCol = getAffectedCol(columns, columnIndex), availableWidth;
            if (affectedCol) {
                availableWidth = columns[columnIndex].size + affectedCol.size;
                affectedCol.size = availableWidth + 1;
            }
            arrayService.delete(columns, columnIndex);
            arrayService.delete(columns, columnIndex);
            if(!affectedCol) { //If there's just one column alive, force it to fit all the available space in the row
                columns[0].size = rowService.getMaxSlots();
            }
        }

        /**
         * Gets the 'affected' column of a given one in order to apply actions such are sort or resize
         *
         * @param columns       The array with the columns were the one that is going to be targeted is
         * @param dropColIndex  The index of the column that is going to be targeted
         * @returns {object}    The 'affected' column
         */
        function getAffectedCol(columns, dropColIndex) {
            var affectedDropCol;
            affectedDropCol = getAffectedNextCol(columns, dropColIndex);
            if (!affectedDropCol) {
                affectedDropCol = getAffectedPrevCol(columns, dropColIndex);
            }
            return affectedDropCol;
        }

        /**
         * Gets the format of an empty column
         *
         * @returns {{size: number, apps: Array}} The empty column
         */
        function getEmptyCol() {
            return { size: 1, apps: [] };
        }

        /**
         * Determines if two columns are actually the same or not
         *
         * @param   {object}    column1 The first column to be analyzed
         * @param   {object}    column2 The second column to be analyzed
         * @returns {boolean}           True if both columns are the same. False otherwise
         */
        function areSameCol(column1, column2) {
            return column1.$$hashKey === column2.$$hashKey;
        }

        /** Private methods **/
        function getAffectedNextCol(columns, dropColIndex) {
            var affectedDropCol, i;
            for (i  = dropColIndex + 1; i < columns.length; i += 1) {
                if (columns[i].size >= 3) {
                    affectedDropCol = columns[i];
                    break;
                }
            }
            return affectedDropCol;
        }

        function getAffectedPrevCol(columns, dropColIndex) {
            var affectedDropCol, i;
            for (i  = dropColIndex - 1; i >= 0; i -= 1) {
                if (columns[i].size >= 3) {
                    affectedDropCol = columns[i];
                    break;
                }
            }
            return affectedDropCol;
        }

        function normalizeEmptyCol(cols, colIndex) {
            var col = cols[colIndex], nextCol = cols[colIndex + 1];
            if (col.apps.length === 0 && col.size > 1) {
                col.size = 1;
            }
            if (nextCol && col.apps.length === 0 && nextCol.apps.length === 0) {
                arrayService.delete(cols, colIndex);
                return true;
            }
            return null;
        }
        /** End private methods **/

        return {
            normalizeEmptyCols: normalizeEmptyCols,
            addEmptyCols: addEmptyCols,
            deleteColAndDependencies: deleteColAndDependencies,
            getAffectedCol: getAffectedCol,
            getEmptyCol: getEmptyCol,
            areSameCol: areSameCol
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.factory('rowService', ['arrayService', function (arrayService) {

        var maxSlots = 25;

        /**
         * Gets the total amount of slots available for each row
         *
         * @returns {number}
         */
        function getMaxSlots() {
            return maxSlots;
        }

        /**
         * Determines if there's available space in a row or not
         *
         * @param   {object}    dropRow         The row to be analyzed if there's available space or not
         * @param   {object}    dropCol         The col that is being dropped or not
         * @param   {object}    affectedDropCol The affected col of the dropped one
         * @returns {boolean}                   True if there's available space or not in the row
         */
        function isAvailableSpaceInRow(dropRow, dropCol, affectedDropCol) {
            return affectedDropCol || dropRow.columns.length === 1 || dropCol.apps.length > 1;
        }

        /**
         * Determines if a given row is empty or not
         *
         * @param   {object}    originalRow The row that is being to be analyzed
         * @returns {boolean}               True if the row is empty. False otherwise
         */
        function isOriginalRowEmpty(originalRow) {
            return originalRow.columns.length === 1 && originalRow.columns[0].apps.length === 0;
        }

        /**
         * Determines if a given row is empty or not
         *
         * @param   {object}    dropRow The row that is being to be analyzed
         * @returns {boolean}           True if the row is empty. False otherwise
         */
        function isDropRowEmpty(dropRow) {
            return dropRow.columns.length === 1 && dropRow.columns[0].apps.length === 1;
        }

        /**
         * Adds a row and an empty sibling row
         *
         * @param {object}  rows        The array with the rows where the new one is going to be placed
         * @param {number}  newRowPos   The position of the new row
         */
        function addRowAndDependencies(rows, newRowPos) {
            var newRow = {columns: [
                {size: 1,  apps: []}, {size: getMaxSlots() - 2, apps: [{ type: 'menuApp' }]}, {size: 1,  apps: []}
            ]};
            arrayService.add(rows, newRow, newRowPos);
            addEmptyRow(rows, newRowPos + 1);
        }

        /**
         * Adds an empty row on a given position
         *
         * @param {object}  rows            The array with the rows where the new one is going to be placed
         * @param {number}  dropRowIndex    The position of the new row
         */
        function addEmptyRow(rows, dropRowIndex) {
            arrayService.add(rows, getEmptyRow(), dropRowIndex);
        }

        /**
         * Gets the format of an empty row
         *
         * @returns {{columns: Array}}
         */
        function getEmptyRow() {
            return { columns: [{size: getMaxSlots(), apps: []}]};
        }

        /**
         * Deletes a row and the sibling empty one
         *
         * @param {object}  rows        The array with the rows where the given one is going to be deleted
         * @param {integer} rowIndex    The index of the row that is going to be deleted
         */
        function deleteRowAndDependencies(rows, rowIndex) {
            if(rows.length > 1) {
                arrayService.delete(rows, rowIndex);
            }
            if(rows.length > 1) {
                arrayService.delete(rows, rowIndex);
            }
        }

        /**
         * Gets the rows of a given row scope. This method is useful in order to isolate resources from being aware of
         * the different rows wrapping objects (i.e. template vs page rows)
         *
         * @param   {object}  rowScope  The scope of the row
         * @param   {array}   rows      The root array of rows
         * @returns {array}             The array that contains the rows of the given scope
         */
        function getWrappingRows(rowScope, rows) {
            return (rowScope.row.template) ? rows : rows[1].columns[0].rows;
        }

        /**
         * Determines if a given row is part of the template structure or not
         *
         * @param {object} row  The row that could be part of the template structure or not
         * @returns {boolean}   True if the given row is part of the template structure. False otherwise
         */
        function isTemplateRow(row) {
            return row.template;
        }

        return {
            getMaxSlots: getMaxSlots,
            isAvailableSpaceInRow: isAvailableSpaceInRow,
            isOriginalRowEmpty: isOriginalRowEmpty,
            isDropRowEmpty: isDropRowEmpty,
            addRowAndDependencies: addRowAndDependencies,
            addEmptyRow: addEmptyRow,
            getEmptyRow: getEmptyRow,
            deleteRowAndDependencies: deleteRowAndDependencies,
            getWrappingRows: getWrappingRows,
            isTemplateRow: isTemplateRow
        };
    }]);
})();
(function () {
    'use strict';
    COMPONENTS.factory('listDbService', ['$injector', 'crudService', 'dbService', 'i18nService',
    'stringService',
    function ($injector, crudService, dbService, i18nService, stringService) {

        /**
         * Gets a list of items from a given collection
         *
         * @param {object}      options     The settings that will define the query to execute (collection, filters...)
         * @param {function}    callback    The function to execute once the list has been loaded
         */
        function loadList(options, callback) {
            var filter = {
                q           :   { $and: [
                                    { $or: getFilterOptions(options.searchText, options.searchTargets) },
                                    { $or: getTagOptions(options.tags) }
                                ]},
                currentPage :   options.currentPage,
                pageSize    :   options.pageSize,
                skip        :   options.skip,
                sort        :   options.sort,
                projection  :   options.projection
            };
            crudService.get(options.collection, null, filter, function (list) {
                if(callback) { callback(list); }
            });
        }

        /**
         * Creates a new item to the list
         *
         * @param {string} collection   The collection where the item to be created is
         * @param {string} item         The object that is going to be created
         */
        function createItem(collection, item) {
            var collectionService = $injector.get(collection + 'Service'),
                createFn = 'create' + stringService.capitalize(collection);
            if(collectionService[createFn]) { //Try to find a create specific method on the service
                collectionService[createFn](item);
            } else { //Use the generic create method if the specific one has not been found
                crudService.create(collection, item);
            }
        }

        /**
         * Deletes an item from the list
         *
         * @param {string} collection   The collection where the item to be removed is
         * @param {string} itemId       The Id of the item that is going to be removed
         */
        function deleteItem(collection, itemId) {
            crudService.delete(collection, itemId, null);
        }

        /** Private methods **/
        function getFilterOptions(searchText, searchTargets) {
            var filterOptions = [], currentLanguage = i18nService.getCurrentLanguage(),
                inexactSelector = dbService.getInexactSelector(searchText);
            searchTargets.forEach(function (searchTarget) {
                var filterOption = {}, i18nFilterOption = {}, i18nSearchTarget;
                filterOption[searchTarget] = inexactSelector;
                filterOptions.push(filterOption);     //Add plain text filter
                i18nSearchTarget = searchTarget + '.' + currentLanguage + '.text';
                i18nFilterOption[i18nSearchTarget] = inexactSelector;
                filterOptions.push(i18nFilterOption); //Add i18n text filter
            });
            return filterOptions;
        }

        function getTagOptions(tags) {
            var tagOptions = [];
            if (tags) {
                tags.forEach(function (tag) {
                    tagOptions[tagOptions.length] = { tag: tag };
                });
            }
            return tagOptions;
        }
        /** End of private methods **/

        return {
            loadList : loadList,
            createItem: createItem,
            deleteItem: deleteItem
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('listSelectService', ['$rootScope', '$location', 'listService',
    'editBoxUtilsService', 'arrayService', 'stdService',
    function ($rootScope, $location, listService, editBoxUtilsService, arrayService, stdService) {

        /**
         * Action to execute whenever an item is clicked
         *
         * @param {object}  listScope       The scope of the list
         * @param {object}  element         The pointer to the DOM object where the list is
         * @param {object}  item            The model of the clicked item
         * @param {number}  $index          The numeric index of the clicked item in the list where it is
         * @param {object}  $event          The object with the data of the click event
         * @param {boolean} editOnSelect    The flag to identify if the item has to be edited while selecting or not
         */
        function clickOnItem(listScope, element, item, $index, $event, editOnSelect) {
            checkItemId(item);
            if (listScope.isSelectable() || listScope.isEditable()) {
                handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event);
            } else {
                handleNavigationMechanism(listScope, item);
            }
            handleCustomSelectionMechanism(listScope, item, $index);
        }

        /**
         * Selects a given item
         *
         * @param {object}  listScope   The scope of the list
         * @param {object}  item        The model of the element that is going to be selected
         */
        function selectItem(listScope, item) {
            checkItemId(item);
            if (listScope.isMultiSelectable()) {
                if (!listScope.selectedIds) { listScope.selectedIds = []; }
                if (!item.isSelected) { //Select the item if it wasn't selected before
                    listScope.selectedIds.push(item._id);
                }
            }
            else if (listScope.isSingleSelectable()) {
                listScope.selectedIds = item._id;
                if (listScope.lastSelectedItem) {
                    listScope.lastSelectedItem.isSelected = false;
                }
            }
            listScope.lastSelectedItem = item;
            item.isSelected = true;
            if(!$rootScope.$$phase) {
                listScope.$apply();
            }
        }

        /**
         * Unselects a given item
         *
         * @param {object}  listScope   The scope of the list
         * @param {object}  item        The model of the element that is going to be unselected
         */
        function unselectItem(listScope, item) {
            checkItemId(item);
            if (listScope.isMultiSelectable()) {
                if (item.isSelected) {
                    dropFromSelectedList(listScope, item._id);
                }
            }
            else if (listScope.isSingleSelectable()) {
                listScope.selectedIds = null; }
            item.isSelected = false;
            if(!$rootScope.$$phase) {
                listScope.$apply();
            }
        }

        /**
         * Drops a given item from the selected list
         *
         * @param {object}  listScope   The scope of the list
         * @param {string}  id          The Id of the item that is going to be dropped from the list of selected items
         */
        function dropFromSelectedList(listScope, id) {
            var itemSelectedPos = getItemSelectedPos(listScope, id);
            //Delete the item from the selected items list, just if it was actually selected
            if (itemSelectedPos !== undefined) {
                arrayService.delete(listScope.selectedIds, itemSelectedPos);
            }
        }

        /** Private methods **/
        function checkItemId(item) {
            if(!item._id) {
                stdService.error('The matched element has to contain an _id attribute');
            }
        }

        function handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event) {
            if (!item.isSelected) {
                listScope.select(item);
                if (listScope.isEditable() && editOnSelect) { showEditBox(listScope, element, item); }
                //Close edit box it the user click has been outside of it
            } else if (!$event || !editBoxUtilsService.isEditBoxClicked($event)) {
                listScope.unselect(item);
                if (listScope.isEditable()) { hideSiblingEditBox(); }
            }
        }

        function handleCustomSelectionMechanism(listScope, item) {
            listScope.onSelect({$item: item});
        }

        function handleNavigationMechanism(listScope, item) {
            listService.setDetailId(listScope, item._id);
            $location.search('detailId', item._id);
        }

        function getItemSelectedPos(listScope, itemId) {
            var itemSelectedPos = null, i;
            if (listScope.selectedIds) {
                for (i = 0; i < listScope.selectedIds.length; i += 1) {
                    if (listScope.selectedIds[i] === itemId) {
                        itemSelectedPos = i;
                        break;
                    }
                }
            }
            return itemSelectedPos;
        }

        function showEditBox(listScope, element, item) {
            var targetObj = $('#' + item._id + ' > *:first-child', element);
            hideSiblingEditBox(element); //Hide any other previous instance of the edit box component
            listScope.panels = listScope.onEditPanels;
            listScope.panels.forEach(function(panel) {
                if(!panel.bindings) { panel.bindings = {}; }
                panel.bindings.model = item;
            });
            listScope.onSave = function() { listScope.onEdit({$item: listScope.model}); };
            listScope.onClose = function () { listScope.unselect(item); };
            editBoxUtilsService.showEditBox(listScope, targetObj, targetObj);
        }

        function hideSiblingEditBox(element) {
            var parentEditBox, siblingEditBoxId;
            if(element) {
                parentEditBox = element.closest('.editBox');
                siblingEditBoxId = $('.editBox', parentEditBox).attr('id');
                if(siblingEditBoxId) {
                    editBoxUtilsService.hideEditBox(siblingEditBoxId);
                }
            }
        }
        /** End of private methods **/

        return {
            clickOnItem: clickOnItem,
            selectItem: selectItem,
            unselectItem: unselectItem,
            dropFromSelectedList: dropFromSelectedList
        };
    }]);
})();

(function () {
    'use strict';
    COMPONENTS.factory('listService', [function () {

        var defaultOptions = {  pageSize: 10, skip: 0, pageActionPos: 2, searchable : true,
                                sort: { field: 'create.date', order : '1' } };

        /**
         * Gets the default value of a given property
         *
         * @param   {string} prop   The property of which the default value is going to be retrieved
         * @param   {object} config The object that stores the list setup
         * @returns {*}             The default value of the given property
         */
        function getDefaultValue(prop, config) {
            return (config[prop] !== undefined) ? config[prop] : defaultOptions[prop];
        }

        /**
         * Stores the item that is going to be detailed following the master-detail view approach
         *
         * @param {object}  listScope   The scope of the list
         * @param {string}  detailId    The Id of the element that is going to be detailed
         */
        function setDetailId(listScope, detailId) {
            listScope.detailId = detailId;
        }

        return {
            setDetailId: setDetailId,
            getDefaultValue: getDefaultValue
        };
    }]);
})();

(function (Array) {
    'use strict';

    COMPONENTS.factory('arrayService', [function () {

        /**
         * Determines if the type of the given object is an array or not
         *
         * @param   {object}    obj The object to be analyzed
         * @returns {boolean}       True if the the type of the object is an array. Fanse otherwise
         */
        function isArray(obj) {
            return obj instanceof Array;
        }

        /**
         *  Adds an element to an array
         *
         * @param   {Array} array   The target array where the new item is going to be added
         * @param   {*}     element The new item that is going to be added
         * @param   {int}   index   The position where the new item is going to be added
         * @returns {Array}         The input array with the new item already added to it
         */
        function add(array, element, index) {
            array.splice(index, 0, element);
            return array;
        }

        /**
         * Copies totally or partially a given array
         *
         * @param   {Array} sourceArray The array that is being to be copied
         * @param   {int}   startIndex  From which position (optional) the source array is going to be copied
         * @param   {int}   length      The number of array items that are going to be copied
         * @returns {Array}             The copied array
         */
        function copy(sourceArray, startIndex, length) {
            var destArray = [], i;
            startIndex = startIndex || 0;
            length = length || sourceArray.length;
            for (i = startIndex; i < startIndex + length; i += 1) {
                destArray.push(sourceArray[i]);
            }
            return destArray;
        }

        /**
         * Moves an item of a given array
         *
         * @param {Array}   array       The array that contains the item that is going to be moved
         * @param {int}     oldIndex    The original position of the item
         * @param {int}     newIndex    The target position of the item
         * @returns {Array}             The array with the already moved item
         */
        function move(array, oldIndex, newIndex) {
            if (newIndex >= array.length) {
                var k = newIndex - array.length;
                while ((k -= 1) + 1) {
                    array.push(undefined);
                }
            }
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
            return array;
        }

        /**
         * Removes an item from a given array
         *
         * @param   {Array} array   The array that contains the item that is going to be removed
         * @param   {int}   index   The index position that is going to be removed
         * @returns {Array}         The array without the item in the removed index position
         */
        function remove(array, index) {
            array.splice(index, 1);
            return array;
        }

        return {
            isArray: isArray,
            add: add,
            copy: copy,
            move: move,
            delete: remove
        };
    }]);
})(window.Array);

(function () {
    'use strict';

    COMPONENTS.factory('caretService', ['timerService', function (timerService) {

        /**
         * Inserts an image based on the given Url on the current caret position
         *
         * @param   {string}    url                 The Url where the image is
         * @param   {object}    contentEditableObj  The content editable object where the caret is
         * @param   {string}    onClickFn           The scope reference of the function to execute whenever the image is clicked
         * @return  {int}                           The Id of the the image that has just been created
         */
        function insertImage(url, contentEditableObj, onClickFn) {
            var  id = timerService.getRandomNumber(),
                clickFn = (onClickFn) ? 'ng-click="' + onClickFn + '(' + id + ')' : '';
            insertHtml('<img id="' + id + '" src="' + url + '" ' + clickFn + '"/>', contentEditableObj);
            return id;
        }

        /** Private methods **/
        function insertHtml(html, contentEditableObj) {
            contentEditableObj.focus();
            pasteHtml(html, false);
        }

        function pasteHtml(html, selectPastedContent) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    // Range.createContextualFragment() would be useful here but is only relatively recently standardized
                    // and is not supported in some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    var firstNode = frag.firstChild;
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        if (selectPastedContent) {
                            range.setStartBefore(firstNode);
                        } else {
                            range.collapse(true);
                        }
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if ( (sel = document.selection) && sel.type != "Control") {
                // IE < 9
                var originalRange = sel.createRange();
                originalRange.collapse(true);
                sel.createRange().pasteHTML(html);
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
        /** End of private methods **/

        return {
            insertImage: insertImage
        };
    }]);
})();
(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('dateService', [function () {

        /**
         * Normalizes the date format, setting always two digits for days and months tokens
         *
         * @param   {date}      date    The date to be formatted, with {m}m-{d}d-{yy}yy format
         * @returns {string}            The formatted date, with dd-mm-yyyy format
         */
        function getFormattedDate(date) {

            function normalizeDateToken(token) {
                return ("0" + token).slice(-2);
            }

            var dateObj, day, month, year;
            dateObj = new Date(date);
            day     = normalizeDateToken(dateObj.getDate());
            month   = normalizeDateToken(dateObj.getMonth() + 1); //Months are zero based
            year    = dateObj.getFullYear();
            return day + "-" + month + "-" + year;
        }

        return {
            getFormattedDate: getFormattedDate
        };
    }]);
})(window.COMPONENTS);

(function () {
    'use strict';

    COMPONENTS.factory('domService', ['pageService', function (pageService) {

        /**
         * Gets the coordinates of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the coordinates are required
         * @returns {object}        The DOM object coordinates (top, left, width, height)
         */
        function getCoordinates(obj) {
            return {
                top     : obj.offset().top + pageService.getMainScrollingElm().scrollTop(),
                left    : obj.offset().left,
                width   : obj.outerWidth(),
                height  : obj.outerHeight()
            };
        }

        /**
         * Gets the internal padding of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the padding attributes are required
         * @returns {object}        The DOM object padding (top, right, bottom, left)
         */
        function getObjPadding(obj) {
            return {
                top     : parseInt(obj.css('paddingTop'), 10),
                right   : parseInt(obj.css('paddingRight'), 10),
                bottom  : parseInt(obj.css('paddingBottom'), 10),
                left    : parseInt(obj.css('paddingLeft'), 10)
            };
        }

        /**
         * Gets the border width of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the border width attributes are required
         * @returns {object}        The DOM object border (top, right, bottom, left)
         */
        function getObjBorderWidth(obj) {
            return {
                top     : parseInt(obj.css('borderTopWidth'), 10),
                right   : parseInt(obj.css('borderRightWidth'), 10),
                bottom  : parseInt(obj.css('borderBottomWidth'), 10),
                left    : parseInt(obj.css('borderLeftWidth'), 10)
            };
        }

        /**
         * Gets the type of a given DOM object pointer
         *
         * @param   {object} obj    The DOM object pointer of which the type is required
         * @returns {string}        The element type of the DOM object pointer
         */
        function getElementType(obj) {
            return obj[0].tagName.toLowerCase();
        }

        /**
         * Gets the percent of the HTML of a given CSS property
         *
         * @param   {object} dest           The DOM object pointer of which the CSS property is going to be analyzed
         * @param   {string} cssProperty    The snaked-case CSS property to be evaluated
         * @returns {number}                The global percent of the CSS property related
         */
        function getDomPercent(dest, cssProperty) {
            if (!(dest instanceof jQuery)) {
                dest = $(dest);
            }
            return Math.round(parseInt(dest.css(cssProperty), 10) * 100 / $('html').width());
        }

        /**
         * Adds a visual loading marker to the given DOM object pointer
         *
         * @param {object} domObject the DOM object pointer that is going to receive the visual loading marker
         */
        function addLoadingFeedback(domObject) {
            domObject.addClass('loading');
        }

        /**
         * Removes the visual loading marker to the given DOM object pointer
         *
         * @param {object} domObject the DOM object pointer that is going to drop the visual loading marker
         */
        function removeLoadingFeedback(domObject) {
            domObject.removeClass('loading');
        }

        /**
         * Converts a jQuery DOM object into a plain string
         *
         * @param   {object}    domObj  The pointer to the DOM object that is going to be converted
         * @returns {string}            The converted string
         */
        function convertDomObjToStr(domObj) {
            return $('<div>').append(domObj.clone()).html();
        }

        return {
            getCoordinates: getCoordinates,
            getObjPadding: getObjPadding,
            getObjBorderWidth: getObjBorderWidth,
            getElementType: getElementType,
            getDomPercent: getDomPercent,
            addLoadingFeedback: addLoadingFeedback,
            removeLoadingFeedback: removeLoadingFeedback,
            convertDomObjToStr: convertDomObjToStr
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('editBoxUtilsService', ['$compile', 'pageService', 'domService', 'keyboardService',
    function ($compile, pageService, domService, keyboardService) {

        var isHideActionBlocked = false, isMoving = false, serviceId = 'editBoxUtilsService';

        /**
         * Shows the edit box
         *
         * @param {object} scope            The model of the DOM object where the edit bot will be attached to
         * @param {object} element          The pointer to the DOM object where the edit bot will be attached to
         * @param {object} selectedDomObj   The pointer to the DOM object of the selected text, if case
         */
        function showEditBox(scope, element, selectedDomObj) {
            function setTargetSettings() {
                //Add relative position to the parent element of the edit box
                //To force the [0,0] axis at its beginning and make the position placement easier afterwards
                element.parent().css('position', 'relative');
                //Save the ID of the invoking element to allow fine grain control from it afterwards
                scope.target = {
                    id          : scope.$id,
                    element     : element,
                    coordinates : (selectedDomObj)
                                    ? domService.getCoordinates(selectedDomObj)
                                    : domService.getCoordinates(element)
                };
            }

            function setArrowPos() {

                function isTargetObjLeftPlaced() {
                    return selectedDomObj.offset().left + (scope.target.coordinates.width / 2) < $(window).width() / 2;
                }

                scope.arrowPos = isTargetObjLeftPlaced() ? 'left' : 'right';
            }

            function addEditBoxToDom() {
                if (!scope.model) { scope.model = {}; }
                var editBoxObj;
                editBoxObj = $('<edit-box panels="panels" arrow-pos="arrowPos" ' +
                    'on-save="onSave()" on-change="onChange()" on-cancel="onCancel()" ' +
                    'on-close="onClose()" target="target"></edit-box>');
                pageService.getMainScrollingElm().append(editBoxObj);
                $compile(editBoxObj)(scope);
                return editBoxObj;
            }

            function safeUnblockEditBox() {
                setTimeout(function () {
                    if (!isMoving) {
                        unblockHideEditBox(); //Enable the hide action again after some small piece of time
                    }
                }, 100);
            }

            var editBoxObj;
            if(!isEditBoxVisible(element)) {
                setTargetSettings();
                setArrowPos();
                blockHideEditBox();     //Block the hide action to avoid flickering efect from portal directive
                editBoxObj = addEditBoxToDom();
                safeUnblockEditBox();   //Unblock the hidding action
                addOverlay(editBoxObj);
            }
        }

        /**
         * Hides the edit box
         *
         * @param {string} textBoxId Id of the edit box that is going to be closed.If not given, all edit boxes are closed
         */
        function hideEditBox(textBoxId) {
            var editBoxObj;
            if (!isHideActionBlocked) { //Hide the edit box if the mutex is not enabled
                if (textBoxId) {
                    editBoxObj = $('#' + textBoxId);
                } else {
                    editBoxObj = $('.editBox').remove();
                }
                removeOverlay(editBoxObj);
                unregisterKeyboardEvents();
                editBoxObj.remove();
            }

            function unregisterKeyboardEvents() {
                keyboardService.unregister('esc', serviceId);
                //Unregister the edit events as well
                keyboardService.unregister('left', 'edit');
                keyboardService.unregister('right', 'edit');
            }
        }

        /**
         * Gets the edit box visibility status, considering all the instances
         *
         * @returns {boolean} True if there is at least one edit box visible. False otherwise
         */
        function isAnyEditBoxVisible() {
            return $('.editBox').size() > 0;
        }

        /**
         *
         *
         * @param   {object}    event   The event that owns the click action
         * @returns {boolean}           True if the click was done inside of an edit box. False otherwise
         */
        function isEditBoxClicked(event) {
            return $(event.target).closest('.editBox').size() > 0;
        }

        /**
         * Disables the possibility to hide the edit box
         *
         */
        function blockHideEditBox() {
            isHideActionBlocked = true;
        }

        /**
         * Enables the possibility to hide the edit box
         *
         */
        function unblockHideEditBox() {
            isHideActionBlocked = false;
        }

        /** Private methods **/
        function addOverlay(editBoxObj) {
            var scrollingAreaHeight = pageService.getMainScrollingElm()[0].scrollHeight;
            editBoxObj.before('<div class="overlay" style="height:' + scrollingAreaHeight + '"></div>');
        }

        function removeOverlay(editBoxObj) {
            editBoxObj.prev('.overlay').remove();
        }

        function isEditBoxVisible(element) {
            return element.next('.editBox').size() > 0;
        }
        /** End of private methods **/

        return {
            showEditBox         : showEditBox,
            hideEditBox         : hideEditBox,
            isAnyEditBoxVisible : isAnyEditBoxVisible,
            isEditBoxClicked    : isEditBoxClicked,
            blockHideEditBox    : blockHideEditBox,
            unblockHideEditBox  : unblockHideEditBox
        };
    }]);
})();

(function (Mousetrap) {
    'use strict';
    COMPONENTS.factory('keyboardService', ['arrayService', 'stringService', 'constantsService',
    function (arrayService, stringService, constantsService) {

        var bindFns = [], //Stack of functions
            blockShortcut = false;

        /**
         * Registers a new global keyboard event
         *
         * @param {*}           shortcut    The keyboard shortcut that is going to be registered. Can be single on an array
         * @param {string}      source      The component type that is going to register the shortcut
         * @param {function}    bindFn      The function to execute every time the shortcut is typed
         */
        function register(shortcut, source, bindFn) {

            function stackAndBind(shortcut, source, bindFn) {
                var normalizedShortcut = normalizeShortcut(shortcut);
                if (!bindFns[normalizedShortcut]) { bindFns[normalizedShortcut] = []; }
                //Add the binding function to the top of the stack
                bindFns[normalizedShortcut].push({ fn: bindFn, source: source});
                bind(normalizedShortcut, bindFn);
            }

            if (arrayService.isArray(shortcut)) {
                shortcut.forEach(function (shortcutInstance) {
                    stackAndBind(shortcutInstance, source, bindFn);
                });
            } else {
                stackAndBind(shortcut, source, bindFn);
            }
        }

        /**
         * Unregisters a new global keyboard event
         *
         * @param {string} shortcut The keyboard shortcut that is going to be unregistered
         * @param {string} source   The component type that is going to unregister the shortcut
         */
        function unregister(shortcut, source) {

            function unstackAndUnbind(shortcut, source) {
                var normalizedShortcut = normalizeShortcut(shortcut), bindFnsShortcut = bindFns[normalizedShortcut];
                if (bindFnsShortcut && bindFnsShortcut[bindFnsShortcut.length - 1]
                && source === bindFnsShortcut[bindFnsShortcut.length - 1].source) {
                    //Remove the unbinded function from the stack
                    arrayService.delete(bindFnsShortcut, bindFnsShortcut.length - 1);
                    unbind(normalizedShortcut);
                }
            }

            if (arrayService.isArray(shortcut)) {
                shortcut.forEach(function (shortcutInstance) {
                    unstackAndUnbind(shortcutInstance, source);
                });
            } else {
                unstackAndUnbind(shortcut, source);
            }
        }

        function bind(shortcut, bindFn) {
            //Normalize the binding function, adding a return false to avoid default browser actions
            var normalizedBindFn = function () {
                if (!blockShortcut) {
                    bindFn();
                    blockShortcut = true;
                    setTimeout(function () {
                        blockShortcut = false;
                    }, constantsService.keyboardInterval);
                }
                return false;
            };
            //Use "bindGlobal" instead of "bind" to enable events even inside of inputs
            //This has been DISABLED as causes a lot of problem.
            //For instance, it blocks the keyboard navigation in forms using the TAB key,
            //and blocks the possibility to type ENTER for a break line in a rich editor
            Mousetrap.bind(shortcut, normalizedBindFn);
        }

        function unbind(shortcut) {
            var bindFnsShortcut = bindFns[shortcut];
            Mousetrap.unbind(shortcut);
            if (bindFnsShortcut.length) { //If there're more function in the stack, revive the latest defined one
                bind(shortcut, bindFnsShortcut[bindFnsShortcut.length - 1].fn);
            }
        }

        function normalizeShortcut(shortcut) {
            return stringService.replaceToken(shortcut, ' ', '');
        }

        return {
            register: register,
            unregister: unregister
        };
    }]);
})(window.Mousetrap);

(function () {
    'use strict';

    COMPONENTS.factory('mediaService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         *  Creates new media item(s)
         *
         * @param {array}               mediaList   The list with the items that are going to be created
         * @param {function({object})}  callback    The returning function with the newly created media object
         */
        function createMedia(mediaList, callback) {
            var processedItems = 0;
            mediaList.forEach(function (media) {
                media.tags = mediaList.tags;
                updateMedia(media, function (newMedia) {
                    processedItems += 1;
                    if (callback && processedItems === mediaList.length) {
                        callback(newMedia);
                    }
                });
            });
        }

        /**
         *  Updates an existing media item
         *
         * @param   {object}                media       The media item that is going to be updated
         * @param   {function({object})}    callback    The returning function with the updated media object
         */
        function updateMedia(media, callback) {
            var data;
            if (media) {
                data = {
                    name    : media.name,
                    tags    : media.tags
                };
                crudService.update(constantsService.collections.media, media._id, data, function (newMedia) {
                    if (callback) { callback(newMedia); }
                });
            } else {
                if (callback) { callback({}); }
            }
        }

        /**
         * Gets a media object from its Id
         *
         * @param {string}              mediaId     The Id of the media which object is going to be retrieved
         *                                          If not defined, multiple results could be retrieved
         * @param {object}              params      The params to execute a more fine grained query
         * @param {function({object})}  callback    The returning function with the media object
         */
        function getMedia(mediaId, params, callback) {
            if(!params) { params = {}; }
            params.projection = { data: 0 }; //We're interested in the metadata of the image, but not on the binary data
            crudService.get(constantsService.collections.media, mediaId, params, function (media) {
                if (callback) { callback(media); }
            });
        }

        /**
         * Gets the download URL of given media object, based on it's Id and it's name
         *
         * @param   {object} media  The media of which the download URL is going to be retrieved
         * @returns {*}             The download URL if the media object is valid. Null otherwise
         */
        function getDownloadUrl(media) {
            //noinspection JSHint
            if(media && media._id) {
                return 'media/' + media._id + '/' + media.name;
            }
            return null;
        }

        /**
         * Get the Html details snippet of a given media object
         *
         * @param   {object} media  The media of which the Html details snippet is going to be retrieved
         * @returns {string}        The Html details snippet
         */
        function getMediaHtmlDetails(media) {

            function getFriendlyMediaSize(size) {

                function normalizeDecimals(size) {
                    return (Math.floor(size*10)) / 10;
                }

                var gB = 1073741824, mB = 1048576, kB = 1024, friendlyMediaSize;
                if(size > gB) {
                    friendlyMediaSize =  normalizeDecimals(size / gB) + ' GB';
                } else if(size > mB) {
                    friendlyMediaSize =  normalizeDecimals(size / mB) + ' MB';
                } else if(size > kB) {
                    friendlyMediaSize =  normalizeDecimals(size / kB) + ' KB';
                } else {
                    friendlyMediaSize =  size + ' bytes';
                }
                return friendlyMediaSize;
            }
            if(media && media._id) {
                var downloadUrl = getDownloadUrl(media);
                var size = getFriendlyMediaSize(media.size);
                var dimensions = media.width + 'x' + media.height;
                return '<a href="' + downloadUrl + '" target="_blank">' + media.name + '</a><br/>(' + dimensions + ', ' + size + ')';
            }
        }

        /**
         * Gets the default avatar URL
         *
         * @returns {string} The default avatar URL
         */
        function getDefaultAvatarUrl() {
            return '/client/images/user.svg';
        }

        return {
            createMedia         : createMedia,
            updateMedia         : updateMedia,
            getMedia            : getMedia,
            getDownloadUrl      : getDownloadUrl,
            getMediaHtmlDetails : getMediaHtmlDetails,
            getDefaultAvatarUrl : getDefaultAvatarUrl
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('objectService', [function () {

        /**
         * Determines if a given item is an object or not
         *
         * @param   {*}         item    The element that is going to be analyzed if it's an object or not
         * @returns {boolean}           True if the given element is an object, False otherwise
         */
        function isObject(item) {
            return typeof(item) === 'object';
        }

        /**
         * Determines if the given string is empty or not
         *
         * @param   {object}    object  The string that is going to determine if it's empty or not
         * @returns {boolean}           True if the string is empty. False otherwise
         */
        function isEmpty(object) {
            var hasOwnProperty = Object.prototype.hasOwnProperty; // Speed up calls to hasOwnProperty
            // null and undefined are empty
            if (object === null || object === undefined) return true;
            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (object.length && object.length > 0)    return false;
            if (object.length === 0)  return true;
            for (var key in object) {
                if (hasOwnProperty.call(object, key))    return false;
            }
            // Doesn't handle toString and toValue enumeration bugs in IE < 9
            return true;
        }

        function getRootKeys(object) {
            var keys = [];
            for(var key in object) {
                if(object.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        }

        return {
            isObject    : isObject,
            isEmpty     : isEmpty,
            getRootKeys : getRootKeys
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('stringService', [function () {

        /**
         * Replaces a source token with a new one of a given string
         *
         * @param   {string}    string      The string that is going to be modified
         * @param   {string}    sourceToken The original token that is going to be replaced
         * @param   {string}    targetToken The new token that is going to replace the original one
         * @param   {boolean}   escape      The flag that decides if the source string has to be scaped or not
         * @returns {string}                The string with the switched tokens
         */
        function replaceToken(string, sourceToken, targetToken, escape) {
            var re = new RegExp(sourceToken, "g");
            if(escape) { string = escapeRegExp(string); }
            return (string) ? string.replace(re, targetToken) : '';
        }

        /**
         * Capitalizes the given string
         *
         * @param   {string} string The string that is going to be capitalized
         * @returns {string}        The capitalized string
         */
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        /**
         * Decapitalizes the given string
         *
         * @param   {string} string The string that is going to be decapitalized
         * @returns {string}        The decapitalized string
         */
        function decapitalize(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        }

        /**
         * Converts a given string to snake case notation
         *
         * @param   {string} string The string that is going to be converted to snake case notation
         * @returns {string}        The snaked case string
         */
        function toSnakeCase(string) {
            return string.replace(/[A-Z]/g, function (letter, pos) {
                return (pos ? '-' : '') + letter.toLowerCase();
            });
        }

        /**
         * Converts a given string to camel case notation
         *
         * @param   {string} string The string that is going to be converted to camel case notation
         * @returns {string}        The cameled case string
         */
        function toCamelCase(string) {
            return string.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).replace(/^moz([A-Z])/, 'Moz$1'); //Mozilla hack
        }

        /**
         * Trims a given string
         * @param   {string} string The string that is going to be trimmed
         * @returns {string}        The trimmed string
         */
        function trim(string) {
            return $.trim(string);
        }

        /**
         * Determines if the given string is an external url or not
         *
         * @param   {string} url    The string that is going to determine if it's an external url or not
         * @returns {*}             True if the string is an external url. False otherwise
         */
        function isExternalUrl(url) {
            //noinspection JSValidateTypes
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
                regex = new RegExp(expression);
            if(!url) {
                return false;
            }
            return url.match(regex) !== null;
        }

        /**
         * Normalizes the format of a given external url, adding the http:// preffix, if necessary
         *
         * @param   {string} url    The url that is going to be normalized
         * @returns {string}        The normalized url
         */
        function normalizeExternalUrl(url) {
            return (url.indexOf('http://') < 0) ? 'http://' + url : url;
        }

        /** Private methods **/
        function escapeRegExp(string) {
            return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }

        return {
            replaceToken: replaceToken,
            capitalize: capitalize,
            decapitalize: decapitalize,
            toSnakeCase: toSnakeCase,
            toCamelCase: toCamelCase,
            trim: trim,
            isExternalUrl: isExternalUrl,
            normalizeExternalUrl: normalizeExternalUrl
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('styleService', ['stringService', function (stringService) {

        /**
         * Normalizes the styles properties of a given CSS style model
         *
         * @param   {object} sourceMdl  The model that contains the source styles
         * @param   {object} destMdl    The model where the styles will be copied to
         * @returns {object}            The target styles with the styles copied from source to target
         */
        function getNormalizedStyles(sourceMdl, destMdl) {
            var styleKey, styleValue;
            if (!destMdl) {
                destMdl = {};
            }
            for (styleKey in sourceMdl) {
                if (sourceMdl.hasOwnProperty(styleKey)) {
                    styleValue = sourceMdl[styleKey];
                    if (styleValue) {
                        //noinspection JSUnfilteredForInLoop
                        destMdl[styleKey] = sourceMdl[styleKey];
                    }
                }
            }
            return destMdl;
        }

        /**
         * Gets the CSS actual styles of an object starting from a given ancestor element
         *
         * @param   {object} rootObj    The pointer to the DOM object where the root element is
         *                              (the calculations start from there, without considering it)
         * @param   {object} leafObj    The pointer to the DOM object of which the styles are going to be retrieved
         * @returns {object}            The computed styles of the leaf object calculating taking as reference the root object
         */
        function getComputedStyleInRange(rootObj, leafObj) {
            var stylesArray = [], stylesObj = {}, styleObj, stylePropArray, stylePropIndex, styleKeyValueArray,
                stylesArrayIndex, normalizedKey, normalizedValue;
            while (leafObj[0] !== rootObj[0]) {
                styleObj = {};
                if (leafObj.attr('style') !== undefined) {
                    stylePropArray = leafObj.attr('style').split(';');
                    for (stylePropIndex in stylePropArray) {
                        if (stylePropArray.hasOwnProperty(stylePropIndex)) {
                            styleKeyValueArray = stylePropArray[stylePropIndex].split(':');
                            if (styleKeyValueArray[0] !== '' && styleKeyValueArray[0] !== undefined) {
                                normalizedKey   = stringService.trim(stringService.toCamelCase(styleKeyValueArray[0]));
                                normalizedValue = stringService.trim(styleKeyValueArray[1]);
                                styleObj[normalizedKey] = normalizedValue;
                            }
                        }
                    }
                    stylesArray.unshift(styleObj);
                }
                leafObj = leafObj.parent();
            }
            for (stylesArrayIndex in stylesArray) {
                if (stylesArray.hasOwnProperty(stylesArrayIndex)) {
                    stylesObj = $.extend(true, stylesObj, stylesArray[stylesArrayIndex]);
                }
            }
            return stylesObj;
        }

        /**
         * Converts a rgb string ('rgb(r,g,b)') into a rgb obj ({r:'r',g:'g',b:'b'})
         *
         * @param   {string} rgbStr The source rgb string that is going to be converted into a rgb object
         * @returns {object}        The resulting rgb object
         */
        function rgbStrToRgbObj(rgbStr) {
            var beginIdx    = rgbStr.indexOf('(') + 1,
                endIdx      = rgbStr.indexOf(')') - rgbStr.indexOf('(') - 1,
                rgbArray = rgbStr.substr(beginIdx, endIdx).split(',');
            if (rgbArray.length === 3) {
                return {
                    r : Number(stringService.trim(rgbArray[0])),
                    g : Number(stringService.trim(rgbArray[1])),
                    b : Number(stringService.trim(rgbArray[2]))
                };
            }
            return null;
        }

        /**
         * Converts a rgb object into a hexadecimal string
         *
         * @param   {object} rgbObj The source rgb object
         * @returns {string}        The hexadecimal string
         */
        function rgbObjToHexStr(rgbObj) {

            function componentToHex(c) {
                //noinspection JSCheckFunctionSignatures
                var hex = c.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }

            return ("#" + componentToHex(rgbObj.r) + componentToHex(rgbObj.g) + componentToHex(rgbObj.b)).toUpperCase();
        }

        return {
            getNormalizedStyles: getNormalizedStyles,
            getComputedStyleInRange: getComputedStyleInRange,
            rgbStrToRgbObj: rgbStrToRgbObj,
            rgbObjToHexStr: rgbObjToHexStr
        };
    }]);
})();

(function () {
    'use strict';

    COMPONENTS.factory('textSelectionService', [function () {

        //noinspection JSUnresolvedVariable
        var savedSel = false, rangyPlgn = rangy,  keys = { link: 'link', heading: 'heading' };

        /**
         * Saves the current selection
         *
         */
        function saveSelection() {
            savedSel = rangyPlgn.saveSelection();
        }

        /**
         *  Simulates the selection through CSS styles.
         *
         */
        function setFakeSelection() {
            var selectedTextDomObj = getSelectedTextDomObj();
            selectedTextDomObj.attr('fakeSelection', 'true');
        }

        /**
         * Gets a pointer to the DOM object that wraps the current selection
         *
         * @returns {object} The pointer to the DOM object with the selection
         */
        function getSelectedTextDomObj() {
            rangyPlgn.init();
            var randomCssClass = "rangyTemp_" + (+new Date()),
                classApplier = rangyPlgn.createCssClassApplier(randomCssClass, true);
            classApplier.applyToSelection();
            return $("." + randomCssClass).removeClass(randomCssClass);
        }

        /**
         * Determines if there's or not an active selection
         *
         * @returns {boolean} True if there's any active selection in the page. False otherwise
         */
        function isSelection() {
            var sel = rangyPlgn.getSelection();
            //noinspection JSHint
            return sel._ranges.length > 0 && sel._ranges[0].startOffset != sel._ranges[0].endOffset;
        }

        /**
         * Determines if there's or not an active fake selection
         *
         * @returns {boolean} True if there's any active fake selection in the page. False otherwise
         */
        function isFakeSelection() {
            return $('[fakeSelection]').size() > 0;
        }

        /**
         * Adds styles to the current selection
         *
         * @param {object} styles The object that contains the CSS styles that are going to be applied to the selection
         */
        function setStylesToSelection(styles) {
            var selectedTextDomObj = getSelectedTextDomObj();
            selectedTextDomObj.css(styles);
        }

        /**
         * Restores a previously saved selection
         *
         */
        function restoreSelection() {
            if(savedSel) {
                rangyPlgn.restoreSelection(savedSel);
            }
            //Every time the selection is restored, we'll save it again so it will be possible to restore it afterwards
            saveSelection();
        }

        /**
         * Sets link to the current selection (add / update actions)
         *
         * @param {object} linkOptions The object that contains all the link attributes (id, target, url...)
         */
        function setLink(linkOptions) {
            setDomObj('a', keys.link, linkOptions);
        }

        /**
         * Sets heading style to the current selection (add / update actions)
         *
         * @param {string} headingType The string that represents the type (size) of the heading
         */
        function setHeading(headingType) {
            setDomObj('div', keys.heading, { id: headingType });
        }

        /**
         * Gets the reference to the pointer to the DOM object of the closest heading of the current selection
         *
         * @returns {string} The Id of the selected heading
         */
        function getSelectedHeadingId() {
            return getSelectedId(keys.heading);
        }

        /**
         * Gets the pointer to the DOM object of the closest link of the current selection
         *
         * @returns {object} The pointer to the DOM object of the closest link of the current selection
         */
        function getSelectedLink() {
            return getSelectedTextDomObj().closest('.' + keys.link);
        }

        /**
         * Gets the reference to the pointer to the DOM object of the closest link of the current selection
         *
         * @returns {string} The Id of the selected link
         */
        function getSelectedLinkId() {
            return getSelectedId(keys.link);
        }

        /**
         * Removes the current selection from the page (actual + fake)
         *
         */
        function removeSelection() {
            //noinspection JSUnresolvedVariable
            var sel = rangyPlgn.getSelection();
            if(isSelection() || isFakeSelection()) {
                sel.removeAllRanges();
                var fakeSelectionObj = $('[fakeSelection]');
                //Remove the <span> wrapper if no styles are applied
                if(fakeSelectionObj.attr('style') === '') {
                    fakeSelectionObj.replaceWith(fakeSelectionObj.html());
                } else {
                    fakeSelectionObj.removeAttr('fakeSelection'); //Also remove the text selection simulation
                }
            }
        }

        /** Private methods **/
        function getSelectedId(key) {
            return getSelectedTextDomObj().closest('.' + key).attr('id');
        }

        function setDomObj(type, key, options) {
            restoreSelection();
            var existingLinkObj = getSelectedTextDomObj().closest('.' + key);
            var existsLink = existingLinkObj.length > 0;
            if(existsLink) { //If the link was there before, we'll update its attributes
                existingLinkObj.attr(options);
            } else { //The link is going to be created by the first time
                var classApplier = rangyPlgn.createCssClassApplier(key, {
                    elementTagName      : type,
                    elementProperties   : options
                });
                classApplier.applyToSelection();
            }
            restoreSelection();
        }
        /** End of private methods **/

        return {
            saveSelection:saveSelection,
            setFakeSelection:setFakeSelection,
            getSelectedTextDomObj:getSelectedTextDomObj,
            isSelection:isSelection,
            isFakeSelection:isFakeSelection,
            setStylesToSelection:setStylesToSelection,
            restoreSelection:restoreSelection,
            removeSelection:removeSelection,
            setLink: setLink,
            setHeading: setHeading,
            getSelectedLink: getSelectedLink,
            getSelectedHeadingId: getSelectedHeadingId,
            getSelectedLinkId: getSelectedLinkId
        };
    }]);
})();

(function (clearInterval) {
    'use strict';

    COMPONENTS.factory('timerService', [function () {

        /**
         * (Re)sets the timer that executes a given function
         *
         * @param   {int}       transitionTimer The pointer to the timer
         * @param   {object}    method          The function that is going to be executed every time interval
         * @param   {int}       timer           The time interval
         * @returns {int}                       The ID of the interval reference
         */
        function updateInterval(transitionTimer, method, timer) {
            clearInterval(transitionTimer);
            transitionTimer = setInterval(method, timer);
            return transitionTimer;
        }

        /**
         * Provides a unique integer based on the current datetime as seed
         *
         * @returns {int} The unique integer
         */
        function getRandomNumber() {
            var now = new Date();
            return now.getTime();
        }

        return {
            updateInterval: updateInterval,
            getRandomNumber : getRandomNumber
        };
    }]);
})(window.clearInterval);

(function (undefined) {
    'use strict';

    COMPONENTS.factory('validationService', [function () {

        /**
         * Determines if a given form(s) is/are valid or not
         *
         * @param {*} formObjs A form (or an array of forms) that represent the ng-form object
         * @returns {boolean} True if the form (or group of forms) is valid. False otherwise
         */
        function isFormValid(formObjs) {

            function validateForm(formObj) {
                return formObj.$pristine || (formObj.$dirty && formObj.$valid);
            }

            var isValid = true;
            if ($.isArray(formObjs)) {
                formObjs.forEach(function (formObj) {
                    //The form will be valid just if all the subforms are valid
                    isValid *= validateForm(formObj);
                });
            } else {
                isValid = validateForm(formObjs);
            }
            return isValid;
        }

        /**
         * Sets the focus on the first invalid model binded field
         *
         * @param {object} wrapperObj The pointer to the DOM objects that wraps the scope of the invalid field search
         */
        function setFocusOnFirstError(wrapperObj) {
            $('.ng-invalid[ng-model]:first', wrapperObj).focus().addClass('forceMessage');
        }

        /**
         * Defines the validation mechanism of a given component
         *
         * @param {*}           defValue            The default value of the component
         * @param {object}      element             The pointer to the component DOM object
         * @param {object}      ctrl                The ng-model controller of the component
         * @param {string}      errorTitle          The message to be shown each time the component is invalid
         * @param {string}      errorHtmlDetails    The details to be appended to the message
         * @param {string}      validationKey       The identifier of the validation chain attached to the component
         * @param {function}    validationFn        The method that will decide if the current state of the component is valid or not
         */
        function setupValidation(defValue, element, ctrl, errorTitle, errorHtmlDetails, validationKey, validationFn) {

            function addHelpMessage(inputObj, errorTitle, errorHtmlDetails) {
                if (!inputObj.data('decorated')) {
                    inputObj.wrap('<div class="positionRelative"></div>');
                    //The previous wrap sentence will cause the blur of the field, so, if it had before, it has to be focused again
                    inputObj.after('<div class="input-help"></div>');
                    setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails);
                }
                inputObj.data('decorated', true); //Mark the input as already decorated
            }

            function updateHelpMessage(inputObj, errorTitle, errorHtmlDetails) {
                setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails);
            }

            function setHelpMessageContent(inputObj, errorTitle, errorHtmlDetails) {
                var inputHelpObj = inputObj.next('.input-help'), detailsObj;
                inputHelpObj.empty();
                inputHelpObj.prepend('<div class="title">' + errorTitle + '</div>');
                if (errorHtmlDetails) { //Add details to the help bubble, if case
                    detailsObj = $('<div class="details"></div>');
                    inputHelpObj.append(detailsObj);
                    detailsObj.html(errorHtmlDetails);
                }
            }

            addHelpMessage(element, errorTitle, errorHtmlDetails);
            ctrl.$setValidity(validationKey, validationFn(defValue)); //Set the default validation status

            var validator = function (newValue) {
                if (validationFn(newValue)) {
                    ctrl.$setValidity(validationKey, true);
                    return newValue;
                } else {
                    ctrl.$setValidity(validationKey, false);
                    updateHelpMessage(element, errorTitle, errorHtmlDetails);
                    return undefined;
                }
            };
            ctrl.$formatters.push(validator);
            //noinspection JSUnresolvedFunction
            ctrl.$parsers.unshift(validator);
        }

        return {
            isFormValid: isFormValid,
            setFocusOnFirstError: setFocusOnFirstError,
            setupValidation: setupValidation
        };
    }]);
})(window.undefined);

(function (window, angular) {
    'use strict';

    angular.module('errorModule', ['components']).config(['$httpProvider', '$provide',
    function ($httpProvider, $provide) {

        /* Client side error interceptor */
        $provide.provider('$exceptionHandler', function CustomExceptionHandlerProvider() {
            this.$get = ['stdService', function (stdService) {
                return function (exception) {
                    stdService.error(exception.message, exception.stack);
                };
            }];
        });

        /* HTTP error interceptor */
        $provide.factory('customHttpErrorInterceptor', ['stdService', 'globalMsgService', function customHttpErrorInterceptor(stdService, globalMsgService) {

            function success(response) {
                //globalMsgService.hide();
                return response;
            }

            function error(response) {
                stdService.error(response.data);
            }

            return function (promise) {
                return promise.then(success, error);
            };
        }]);

        $httpProvider.responseInterceptors.push('customHttpErrorInterceptor');
    }]);
})(window, window.angular);





angular.module('templates-main', ['bannerAppEdit.html', 'bannerAppHelp.html', 'bannerAppView.html', 'contentListAppAdd.html', 'contentListAppEdit.html', 'contentListAppHelp.html', 'contentListAppView.html', 'iframeAppEdit.html', 'iframeAppHelp.html', 'iframeAppView.html', 'imageAppEdit.html', 'imageAppHelp.html', 'imageAppView.html', 'languageSelectAppEdit.html', 'languageSelectAppHelp.html', 'languageSelectAppView.html', 'linksAppEdit.html', 'linksAppHelp.html', 'linksAppView.html', 'loginAppEdit.html', 'loginAppHelp.html', 'loginAppView.html', 'mapAppEdit.html', 'mapAppHelp.html', 'mapAppView.html', 'mediaCarouselAppEdit.html', 'mediaCarouselAppHelp.html', 'mediaCarouselAppSelectMedia.html', 'mediaCarouselAppView.html', 'mediaListAppAdd.html', 'mediaListAppEdit.html', 'mediaListAppHelp.html', 'mediaListAppView.html', 'menuAppEdit.html', 'menuAppHelp.html', 'menuAppView.html', 'portalsAdminAppHelp.html', 'portalsAdminAppView.html', 'example.html', 'slidesAppCreateSlide.html', 'slidesAppEdit.html', 'slidesAppEditSlide.html', 'slidesAppHelp.html', 'slidesAppView.html', 'socialAppEdit.html', 'socialAppHelp.html', 'socialAppView.html', 'staticContentAppAdd.html', 'staticContentAppEdit.html', 'staticContentAppHelp.html', 'staticContentAppSelectContent.html', 'staticContentAppView.html', 'userListAppAdd.html', 'userListAppEdit.html', 'userListAppHelp.html', 'userListAppView.html', 'videoAppEdit.html', 'videoAppHelp.html', 'videoAppView.html', 'webGlAppEdit.html', 'webGlAppHelp.html', 'webGlAppView.html', 'addAppPanel.html', 'adminPanel.html', 'createMedia.html', 'edit.html', 'editAppGeneral.html', 'editAppStyles.html', 'editBox.html', 'editContent.html', 'editContentList.html', 'editCurrentUser.html', 'editGeneral.html', 'editMedia.html', 'editMediaList.html', 'editNotifications.html', 'editPages.html', 'editStyles.html', 'editTag.html', 'editTagList.html', 'editUser.html', 'editUserList.html', 'portalsAdminEditDb.html', 'portalsAdminView.html', 'stats.html', 'styles.html', 'app.html', 'appHeader.html', 'bannerCanvas.html', 'bannerItem.html', 'bannerTextEditText.html', 'comment.html', 'comments.html', 'contentEditable.html', 'richContent.html', 'selectMedia.html', 'fileUploader.html', 'password.html', 'rating.html', 'contentList.html', 'list.html', 'listDb.html', 'mediaList.html', 'tagList.html', 'userList.html', 'login.html', 'mediaPicker.html', 'pages.html', 'errorPage.html', 'loginPage.html', 'portalPage.html', 'listActions.html', 'listEdit.html']);

angular.module("bannerAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppEdit.html",
    "<div>Test edit page</div>");
}]);

angular.module("bannerAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("bannerAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppView.html",
    "<div>\n" +
    "    <div banner-canvas ng-model=\"model.items\" on-change=\"onModelChange()\"></div>\n" +
    "</div>");
}]);

angular.module("contentListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppAdd.html",
    "<div>\n" +
    "    <div create-content model=\"content\"></div>\n" +
    "</div>");
}]);

angular.module("contentListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("contentListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppHelp.html",
    "<b>This is</b>The HELP! page of CONTENT LIST :)");
}]);

angular.module("contentListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppView.html",
    "<div>\n" +
    "    <content-list id=\"_id\" config=\"model\"></content-list>\n" +
    "</div>");
}]);

angular.module("iframeAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppEdit.html",
    "<div>\n" +
    "    <div>URL: <input type=\"text\" ng-model=\"internalData.url\"></textarea></div>\n" +
    "    <div>Height: <input type=\"text\" ng-model=\"internalData.height\"></textarea></div>\n" +
    "</div>");
}]);

angular.module("iframeAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("iframeAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppView.html",
    "<div>\n" +
    "    <iframe width=\"100%\" ng-show=\"model.url\" height=\"{{model.height}}\" src=\"{{model.url}}\" frameborder=\"0\"\n" +
    "            allowfullscreen></iframe>\n" +
    "    <div ng-show=\"!model.url\"><i>There isn't any content to show</i></div>\n" +
    "</div>");
}]);

angular.module("imageAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppEdit.html",
    "<div>\n" +
    "    <media-list config=\"config\" on-select=\"onSelect($item)\"></media-list>\n" +
    "</div>");
}]);

angular.module("imageAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("imageAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppView.html",
    "<div>\n" +
    "    <img ux-show=\"model.mediaId\" ng-src=\"{{getDownloadUrl()}}\" title=\"{{getMediaTitle()}}\" />\n" +
    "    <div ux-show=\"!model.mediaId\"><em>Please select an image from the gallery</em></div>\n" +
    "</div>");
}]);

angular.module("languageSelectAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppEdit.html",
    "<div>\n" +
    "    Hello edit!\n" +
    "</div>");
}]);

angular.module("languageSelectAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("languageSelectAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppView.html",
    "<div>\n" +
    "    <div ng-repeat=\"language in languages\" class=\"flag {{language.code}}\" ng-click=\"selectLanguage(language.code)\"\n" +
    "         ng-class=\"{current: isCurrentLanguage(language.code)}\" title=\"{{language.text}}\">\n" +
    "        <img ng-src=\"/client/images/flags/{{language.code}}.svg\" />\n" +
    "     </div>\n" +
    "</div>");
}]);

angular.module("linksAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppEdit.html",
    "<div><h6>Text</h6></div>\n" +
    "<div><h6>URL<h6></div>\n" +
    "<ul sortable=\"model.links\">\n" +
    "	<li ng-repeat=\"link in model.links\" class=\"cf\">\n" +
    "		<div><input type=\"text\" ng-model=\"link.text\"/></div>\n" +
    "		<div><input type=\"text\" ng-model=\"link.url\"/></div>\n" +
    "		<div><button class=\"removeIcon\" ng-click=\"removeItemFromModel($index, model.links)\">Remove</button></div>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "<div class=\"actions\">\n" +
    "	<button class=\"addIcon\" ng-click=\"addItemToModel(model.links)\">+</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("linksAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppHelp.html",
    "<b>This is</b>The HELP! page :) of the Links app\n" +
    "<ul>\n" +
    "	<li>V1</li>\n" +
    "	<li>V2</li>\n" +
    "	<li>V3</li>\n" +
    "</ul>");
}]);

angular.module("linksAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppView.html",
    "<div>\n" +
    "    <div ng-repeat=\"link in model.links\"><a href=\"{{link.url}}\" target=\"_blank\">{{link.text}}</a></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("loginAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppEdit.html",
    "Video ID:\n" +
    "<input type=\"text\" ng-model=\"model.videoId\"></textarea>\n" +
    "Height:\n" +
    "<input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "");
}]);

angular.module("loginAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("loginAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppView.html",
    "<div>\n" +
    "    <login></login>\n" +
    "</div>");
}]);

angular.module("mapAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppEdit.html",
    "<div>\n" +
    "    Height:\n" +
    "    <input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "    Map URL:\n" +
    "    <input type=\"text\" ng-model=\"model.url\"></textarea>\n" +
    "</div>\n" +
    "");
}]);

angular.module("mapAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("mapAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppView.html",
    "<iframe width=\"100%\" height=\"{{model.height}}\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\"\n" +
    "        marginwidth=\"0\" src=\"{{model.url}}&amp;output=embed\"></iframe>\n" +
    "");
}]);

angular.module("mediaCarouselAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppEdit.html",
    "<div>\n" +
    "     <label>Time between slides (milliseconds):<input type=\"text\" ng-model=\"model.timer\"/></label>\n" +
    "    <label>\n" +
    "        Legend pos:\n" +
    "        <select ng-model=\"model.navigationPos\" ng-options=\"obj.value as obj.text for obj in navigationPos\"></select>\n" +
    "    </label>\n" +
    "</div>");
}]);

angular.module("mediaCarouselAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("mediaCarouselAppSelectMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppSelectMedia.html",
    "<div>\n" +
    "    <div edit-media-list selected=\"model.selectedMedia\"></div>\n" +
    "</div>");
}]);

angular.module("mediaCarouselAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppView.html",
    "<div>\n" +
    "    <div class=\"navigationContainer {{model.navigationPos}}\">\n" +
    "        <div class=\"navigatorOverlay\"></div>\n" +
    "        <div class=\"navigator cf\" ng-style=\"setNavigatorCenterPos()\">\n" +
    "            <img class=\"mediaThumbnail\" ng-repeat=\"media in internalData.mediaList\" ng-click=\"internalData.goToMedia($index)\"\n" +
    "                 ng-class=\"getMediaThumbnailSelectedClass($index)\" ng-src=\"{{getDownloadUrl($index)}}\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{getDownloadUrl(internalData.currentMediaIndex)}}\" />\n" +
    "</div>");
}]);

angular.module("mediaListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppAdd.html",
    "<div>\n" +
    "    <div create-media model=\"media\"></div>\n" +
    "</div>");
}]);

angular.module("mediaListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("mediaListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppHelp.html",
    "<b>This is</b>The HELP! page of CONTENT LIST :)");
}]);

angular.module("mediaListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppView.html",
    "<div>\n" +
    "    <media-list config=\"model\"></media-list>\n" +
    "</div>");
}]);

angular.module("menuAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppEdit.html",
    "<!--<div><h6>Text</h6></div>\n" +
    "<div><h6>Page<h6></div>\n" +
    "<div><h6>Layout<h6></div>\n" +
    "<ul sortable=model.pages\">\n" +
    "	<li ng-repeat=\"page in edit.portal.pages\" class=\"cf page\">\n" +
    "		<div><input type=\"text\" ng-model=\"page.text\"></div>\n" +
    "		<div><input type=\"text\" ng-model=\"page.page\"/></div>\n" +
    "		<div class=\"actions\">\n" +
    "			<button class=\"changeLayout\">L</button>\n" +
    "			<button class=\"remove\" ng-click=\"removeItemFromModel($index, edit.portal.pages)\"></button>\n" +
    "		</div>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "<div class=\"actions\">\n" +
    "	<button class=\"add\" ng-click=\"addItemToModel(edit.portal.pages)\">+</button>\n" +
    "</div>-->\n" +
    "");
}]);

angular.module("menuAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppHelp.html",
    "<b>This is</b>The HELP! page :) <h6>of the Menu app</h6>\n" +
    "<ul>\n" +
    "	<li>V4</li>\n" +
    "	<li>V5</li>\n" +
    "	<li>V6</li>\n" +
    "</ul>");
}]);

angular.module("menuAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppView.html",
    "<div>\n" +
    "    <ul class=\"pagesMenu\">\n" +
    "        <li ng-repeat=\"page in pages\" class=\"page\" ng-class=\"getPageStyleClass(page)\" ng-show=\"!page.parentPageId\">\n" +
    "            <h6>\n" +
    "                <a href=\"{{getPageUrl(page)}}\" target=\"{{getPageTarget(page)}}\" title=\"{{page.description}}\" i18n-db-title>\n" +
    "                    <button class=\"toggleSubPages downIcon small\" ng-show=\"hasSubPages(page)\"></button>\n" +
    "                    <label i18n-db=\"page.text\"></label>\n" +
    "                </a>\n" +
    "            </h6>\n" +
    "            <div class=\"subPagesMenuContainer\">\n" +
    "                <ul class=\"subPagesMenu\" ng-show=\"page.hasSubPages\">\n" +
    "                    <li ng-repeat=\"subPage in pages\" class=\"page\" ng-class=\"getPageStyleClass(subPage)\"\n" +
    "                        ux-show=\"isSubPageOf(subPage, page)\">\n" +
    "                        <h6>\n" +
    "                            <a href=\"{{getPageUrl(subPage)}}\" target=\"{{getPageTarget(subPage)}}\" title=\"{{subPage.description}}\" i18n-db-title>\n" +
    "                                <label i18n-db=\"subPage.text\"></label>\n" +
    "                            </a>\n" +
    "                        </h6>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("portalsAdminAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("portalsAdminAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminAppView.html",
    "<div>\n" +
    "    <div app-bridge src=\"portalsAdmin\" view=\"view\"></div>\n" +
    "</div>");
}]);

angular.module("example.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("example.html",
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "\n" +
    "	<head>\n" +
    "		<meta charset=\"utf-8\">\n" +
    "\n" +
    "		<title>reveal.js - Markdown Demo</title>\n" +
    "\n" +
    "		<link rel=\"stylesheet\" href=\"../../css/reveal.css\">\n" +
    "		<link rel=\"stylesheet\" href=\"../../css/theme/default.css\" id=\"theme\">\n" +
    "	</head>\n" +
    "\n" +
    "	<body>\n" +
    "\n" +
    "		<div class=\"reveal\">\n" +
    "\n" +
    "			<div class=\"slides\">\n" +
    "\n" +
    "                <!-- Use external markdown resource, separate slides by three newlines; vertical slides by two newlines -->\n" +
    "                <section data-markdown=\"example.md\" data-separator=\"^\\n\\n\\n\" data-vertical=\"^\\n\\n\"></section>\n" +
    "\n" +
    "                <!-- Slides are separated by three dashes (quick 'n dirty regular expression) -->\n" +
    "                <section data-markdown data-separator=\"---\">\n" +
    "                    <script type=\"text/template\">\n" +
    "                        ## Demo 1\n" +
    "                        Slide 1\n" +
    "                        ---\n" +
    "                        ## Demo 1\n" +
    "                        Slide 2\n" +
    "                        ---\n" +
    "                        ## Demo 1\n" +
    "                        Slide 3\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "                <!-- Slides are separated by newline + three dashes + newline, vertical slides identical but two dashes -->\n" +
    "                <section data-markdown data-separator=\"^\\n---\\n$\" data-vertical=\"^\\n--\\n$\">\n" +
    "                    <script type=\"text/template\">\n" +
    "                        ## Demo 2\n" +
    "                        Slide 1.1\n" +
    "\n" +
    "                        --\n" +
    "\n" +
    "                        ## Demo 2\n" +
    "                        Slide 1.2\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        ## Demo 2\n" +
    "                        Slide 2\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "                <!-- No \"extra\" slides, since there are no separators defined (so they'll become horizontal rulers) -->\n" +
    "                <section data-markdown>\n" +
    "                    <script type=\"text/template\">\n" +
    "                        A\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        B\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        C\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "            </div>\n" +
    "		</div>\n" +
    "\n" +
    "		<script src=\"../../lib/js/head.min.js\"></script>\n" +
    "		<script src=\"../../js/reveal.js\"></script>\n" +
    "\n" +
    "		<script>\n" +
    "\n" +
    "			Reveal.initialize({\n" +
    "				controls: true,\n" +
    "				progress: true,\n" +
    "				history: true,\n" +
    "				center: true,\n" +
    "\n" +
    "				theme: Reveal.getQueryHash().theme,\n" +
    "				transition: Reveal.getQueryHash().transition || 'default',\n" +
    "\n" +
    "				// Optional libraries used to extend on reveal.js\n" +
    "				dependencies: [\n" +
    "					{ src: '../../lib/js/classList.js', condition: function() { return !document.body.classList; } },\n" +
    "					{ src: 'marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
    "                    { src: 'markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
    "					{ src: '../notes/notes.js' }\n" +
    "				]\n" +
    "			});\n" +
    "\n" +
    "		</script>\n" +
    "\n" +
    "	</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("slidesAppCreateSlide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppCreateSlide.html",
    "<div>\n" +
    "    Create: <div content-editable ng-model=\"model.content\" i18n-db-input></div>\n" +
    "</div>");
}]);

angular.module("slidesAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppEdit.html",
    "<div>\n" +
    "    <div list=\"model.slides\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         template=\"template\" on-create=\"onCreate()\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("slidesAppEditSlide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppEditSlide.html",
    "<div>\n" +
    "    <div content-editable ng-model=\"model.content\" i18n-db-input></div>\n" +
    "</div>");
}]);

angular.module("slidesAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("slidesAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppView.html",
    "<div>\n" +
    "    <div class=\"reveal\">\n" +
    "        <div class=\"slides\">\n" +
    "            <section ng-repeat=\"slide in model.slides\" ng-show=\"show\" class=\"slide\">\n" +
    "                <label i18n-db=\"slide.content\"></label>\n" +
    "            </section>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("socialAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppEdit.html",
    "<div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.email\" label=\"Show e-mail?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.email\" ng-show=\"model.show.email\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.facebook\" label=\"Show Facebook?\"/></div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.facebook\" ng-show=\"model.show.facebook\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.twitter\" label=\"Show Twitter?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.twitter\" ng-show=\"model.show.twitter\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.linkedIn\" label=\"Show LinkedIn?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.linkedIn\" ng-show=\"model.show.linkedIn\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-25\">\n" +
    "        Icon size:\n" +
    "        <select ng-model=\"model.iconSize\" ng-options=\"obj.id as obj.text for obj in internalData.iconSizes\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("socialAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("socialAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppView.html",
    "<div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.email\">\n" +
    "       <a ng-href=\"mailto:{{model.email}}\" target=\"_blank\"><img src=\"/client/images/email2.svg\" title=\"e-mail\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.facebook\">\n" +
    "        <a ng-href=\"{{model.facebook}}\" target=\"_blank\"><img src=\"/client/images/facebook.svg\" title=\"Facebook\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.twitter\">\n" +
    "        <a ng-href=\"{{model.twitter}}\" target=\"_blank\"><img src=\"/client/images/twitter.svg\" title=\"Twitter\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.linkedIn\">\n" +
    "        <a ng-href=\"{{model.linkedIn}}\" target=\"_blank\"><img src=\"/client/images/linkedin.svg\" title=\"LinkedIn\" /></a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staticContentAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppAdd.html",
    "<div>\n" +
    "    <div create-content model=\"content\"></div>\n" +
    "    <input checkbox ng-model=\"internalData.displayAddedContent\" label=\"Display added?\" />\n" +
    "</div>");
}]);

angular.module("staticContentAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppEdit.html",
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label>General</label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showTitles\" label=\"Show titles\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showComments\" label=\"Show comments\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label>Ratings</label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showRatings\" label=\"Show ratings\"/>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showCommentsRatings\" label=\"Show comments ratings\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staticContentAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("staticContentAppSelectContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppSelectContent.html",
    "<div>\n" +
    "    <auto-complete ng-model=\"model.selectedContentId\" ng-options=\"contentList\" label-key=\"title\"\n" +
    "                   placeholder=\"Start typing to select content...\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staticContentAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppView.html",
    "<div>\n" +
    "    <div ng-show=\"!model.selectedContentId\"><em>Please select a content from the edit panel</em></div>\n" +
    "    <div ng-show=\"model.selectedContentId\">\n" +
    "        <div class=\"contentHeader cf\">\n" +
    "            <h3 ng-show=\"model.showTitles\" class=\"title\">\n" +
    "                <a href=\"#\">\n" +
    "                    <div content-editable ng-model=\"internalData.title\" type=\"type\"\n" +
    "                         on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "                </a>\n" +
    "            </h3>\n" +
    "            <div rating=\"internalData.avgRating\" target-id=\"model.selectedContentId\" target-collection=\"content\"\n" +
    "                 target-author-id=\"internalData.create.author._id\" ux-show=\"model.showRatings\"></div>\n" +
    "        </div>\n" +
    "        <div content-editable ng-model=\"internalData.summary\" type=\"type\"\n" +
    "             on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "        <div content-editable ng-model=\"internalData.content\" type=\"type\"\n" +
    "             on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "        <comments target-id=\"model.selectedContentId\" placeholder=\"comments.addComment.placeholder\"\n" +
    "                  ux-show=\"model.showComments\" allow-ratings=\"model.showCommentsRatings\"></comments>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("userListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppAdd.html",
    "<div>\n" +
    "    <div create-user model=\"user\"></div>\n" +
    "</div>");
}]);

angular.module("userListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("userListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppHelp.html",
    "<b>This is</b>The HELP! page of USER LIST :)");
}]);

angular.module("userListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppView.html",
    "<div>\n" +
    "    <user-list config=\"model\"></user-list>\n" +
    "</div>");
}]);

angular.module("videoAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppEdit.html",
    "<div>\n" +
    "    Video ID:\n" +
    "    <input type=\"text\" ng-model=\"model.videoId\"></textarea>\n" +
    "    Height:\n" +
    "    <input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "</div>\n" +
    "");
}]);

angular.module("videoAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("videoAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppView.html",
    "<iframe width=\"100%\" height=\"{{model.height}}\" src=\"http://www.youtube.com/embed/{{model.videoId}}\"\n" +
    "        frameborder=\"0\" allowfullscreen></iframe>");
}]);

angular.module("webGlAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppEdit.html",
    "<div>3D Edit</div>");
}]);

angular.module("webGlAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("webGlAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppView.html",
    "<div></div>");
}]);

angular.module("addAppPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("addAppPanel.html",
    "<div id=\"addAppPanel\" class=\"addAppPanel\" state=\"hidden\">\n" +
    "    <div class=\"collapsedView\">\n" +
    "        <file-uploader endpoint=\"rest/availableApps/deploy/\" on-upload=\"onAvailableAppDeployed()\"></file-uploader>\n" +
    "        <div class=\"filterContainer\"><input type=\"text\" ng-model=\"filter\"></div>\n" +
    "        <ul class=\"apps\">\n" +
    "            <div ng-repeat=\"availableApp in availableApps.model | filter: filter\" ng-class=\"getBlockStyleClass(availableApp.id)\">\n" +
    "                <div class=\"category\" ng-show=\"availableApp.firstInCategory\">{{availableApp.category}}</div>\n" +
    "                <li sortable-add-app class=\"newItem\" type=\"{{availableApp.id}}\" ng-class=\"getAppClasses($index)\">\n" +
    "                    <div class=\"text\">{{availableApp.title}}</div>\n" +
    "                    <button class=\"infoIcon\" ng-click=\"toggleExpandedView(availableApp)\"></button>\n" +
    "                </li>\n" +
    "            </div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"expandedView\" ux-show=\"isExpandedViewVisible\">\n" +
    "        <div class=\"content\">\n" +
    "            <div class=\"header\">\n" +
    "                <div class=\"main\">\n" +
    "                    <h3 class=\"title\">{{highlight.title}}</h3>\n" +
    "                    <div rating=\"highlight.avgRating\" target-id=\"highlight._id\" target-collection=\"{{highlight.collection}}\" height=\"32\"></div>\n" +
    "                    <div class=\"actions\">\n" +
    "                        <button class=\"addIcon\">Add!</button>\n" +
    "                        <button class=\"removeIcon\" ng-click=\"undeploy()\"><label i18n=\"app.remove\"></label></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"metadata\">\n" +
    "                    <label class=\"key\" i18n=\"addApp.version\"></label>: <label class=\"value\">{{highlight.version}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.category\"></label>: <label class=\"value\">{{highlight.category}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.creationDate\"></label>: <label class=\"value\">{{highlight.create.date}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.provider\"></label>: <label class=\"value\">{{highlight.provider}}</label>\n" +
    "                </div>\n" +
    "                <div class=\"description\">{{highlight.desc}}</div>\n" +
    "            </div>\n" +
    "            <div class=\"preview\" app-container>\n" +
    "                <div app ng-class=\"highlight.id\" model=\"highlight.model\" type=\"highlight.id\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"details\">\n" +
    "                <line-chart data=\"highlight.stats\"></line-chart>\n" +
    "                <comments target-id=\"highlight._id\" placeholder=\"addApp.addComment\" on-add=\"onAddedComment\"></comments>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("adminPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("adminPanel.html",
    "<div class=\"admin cf\">\n" +
    "    <add-app-panel></add-app-panel>\n" +
    "    <edit ux-show=\"panels.length\" edit=\"edit\" panels=\"panels\" on-cancel=\"onCancel()\" on-save=\"onSave()\"\n" +
    "          active-tab=\"activeTab\" limit-layer-height=\"false\"></edit>\n" +
    "</div>\n" +
    "");
}]);

angular.module("createMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("createMedia.html",
    "<div>\n" +
    "    Name:\n" +
    "    <div ng-show=\"multipleFilesUploaded\">{{getMultipleFilesUploadedNames()}}</div>\n" +
    "    <input type=\"text\" ng-model=\"media[0].name\" mandatory ng-show=\"!multipleFilesUploaded\" />\n" +
    "    content: <file-uploader on-upload=\"onUpload()\"></file-uploader>\n" +
    "    Tags:\n" +
    "    <auto-complete ng-model=\"media.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("edit.html",
    "<div class=\"edit cf\">\n" +
    "    <div class=\"actions\">\n" +
    "        <button class=\"saveIcon\" ng-click=\"save()\"></button>\n" +
    "        <button class=\"cancelIcon\" ng-click=\"cancel()\"></button>\n" +
    "    </div>\n" +
    "	<ul class=\"tabs level1\" ng-show=\"showIfMultipleTabs()\">\n" +
    "		<li ng-repeat=\"panel in panels\" style=\"height:{{tabHeight}}%\" ng-style=\"panel.ngStyleFn()\" ng-click=\"clickTab($index)\"\n" +
    "            class=\"tab button\" ng-class=\"getTabClasses(panel, $index)\" title=\"{{panel.description}}\" i18n-title>\n" +
    "            <label i18n=\"{{panel.title}}\"></label>\n" +
    "            <label ux-show=\"isEditedMarkVisible($parent[panel.type])\" ng-class=\"getEditedMarkColor($parent[panel.type])\"\n" +
    "                   class=\"jsitedMark\">*</label>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div class=\"content level1\" ng-show=\"activeTab.current >= 0\" ng-style=\"setMaxHeightContent()\">\n" +
    "		<ul></ul>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editAppGeneral.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editAppGeneral.html",
    "<div class=\"cf\">\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label i18n=\"editApp.general\"></label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showTitle\" label=\"editApp.showAppTitles\"/>\n" +
    "        </div>\n" +
    "        <label i18n=\"editApp.align\"></label>\n" +
    "        <select ng-model=\"model.align\" ng-options=\"obj.id as obj.text for obj in aligns\"></select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editAppStyles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editAppStyles.html",
    "<div>\n" +
    "    <div styles=\"model.styles\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editBox.html",
    "<div id=\"{{target.id}}\" class=\"editBox cf\" arrowPos=\"{{arrowPos}}\" ng-style=\"getStyles()\" type=\"{{target.type}}\"\n" +
    "    ng-class=\"{multiLayer: panels.length > 1}\">\n" +
    "    <div class=\"content cf\">\n" +
    "        <edit panels=\"panels\" active-tab=\"activeTab\" on-save=\"save()\" on-change=\"change()\"\n" +
    "              on-cancel=\"cancel()\" limit-layer-height=\"true\"></edit>\n" +
    "    </div>\n" +
    "    <div class=\"arrow\" ng-style=\"getArrowPos()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editContent.html",
    "<div>\n" +
    "    <label i18n=\"editContent.title\"></label>: <input type=\"text\" ng-model=\"content.title\" i18n-db-input mandatory />\n" +
    "    <label i18n=\"editContent.summary\"></label>: <div content-editable ng-model=\"content.summary\" type=\"type\" i18n-db-input></div>\n" +
    "    <label i18n=\"editContent.content\"></label>: <div content-editable ng-model=\"content.content\" type=\"type\" i18n-db-input></div>\n" +
    "    <label i18n=\"tags\"></label>:\n" +
    "    <auto-complete ng-model=\"content.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "</div>");
}]);

angular.module("editContentList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editContentList.html",
    "<div>\n" +
    "    <content-list config=\"config\"></content-list>\n" +
    "</div>");
}]);

angular.module("editCurrentUser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editCurrentUser.html",
    "<div>\n" +
    "    <div class=\"actions\">\n" +
    "        <button ng-click=\"logout()\">Logout</button>\n" +
    "    </div>\n" +
    "    <div edit-user model=\"userSession\" on-layer=\"onLayer\" class=\"clearBoth\"></div>\n" +
    "</div>");
}]);

angular.module("editGeneral.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editGeneral.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.portalTitle\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.title\" mandatory /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.portalDescription\"></label>\n" +
    "                    <div><textarea content-editable ng-model=\"model.desc\"></textarea></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.favicon\"></label>\n" +
    "                    <file-uploader preview=\"true\" ng-model=\"favicon\" on-upload=\"updateFavicon($uploadedFile)\"\n" +
    "                                   default-media-url=\"defaultFaviconUrl\"></file-uploader>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <h5><label i18n=\"editGeneral.general.fullscreenMode\"></label></h5>\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.real\"\n" +
    "                    value=\"real\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.real.desc\" i18n-title />\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.maximized\"\n" +
    "                    value=\"maximized\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.maximized.desc\" i18n-title />\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.template\"\n" +
    "                    value=\"template\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.template.desc\" i18n-title />\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div edit-app-general model=\"model.app\"></div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <input checkbox ng-model=\"model.comments.allowRatings\" label=\"editGeneral.comments.allowRatings\" />\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-8\">\n" +
    "                    <label i18n=\"editGeneral.email.sourceAddress\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.email.user\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-8\">\n" +
    "                    <label i18n=\"editGeneral.email.sourcePassword\"></label>\n" +
    "                    <div><input type=\"password\" ng-model=\"model.email.password\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-7\">\n" +
    "                    <label i18n=\"editGeneral.email.host\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.email.host\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-2\">\n" +
    "                    <label>SSL?:</label>\n" +
    "                    <input checkbox ng-model=\"model.email.ssl\" />\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-8 textAlignRight\">\n" +
    "                    <label i18n=\"editGeneral.statistics.trackingCode\"></label>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <div><input type=\"text\" ng-model=\"model.trackingCode\" /></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>\n" +
    "\n" +
    "");
}]);

angular.module("editMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editMedia.html",
    "<div>\n" +
    "    <label i18n=\"editMedia.name\"></label>: <input type=\"text\" ng-model=\"media.name\" mandatory ng-show=\"!multipleFilesUploaded\" />\n" +
    "    <label i18n=\"editMedia.content\"></label>: <file-uploader on-upload=\"onUpload()\" endpoint=\"media/upload/{{media._id}}\"></file-uploader>\n" +
    "    <label i18n=\"tags\"></label>:\n" +
    "    <auto-complete ng-model=\"media.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"tags.placeholder\" multiple=\"true\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editMediaList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editMediaList.html",
    "<div>\n" +
    "    <media-list config=\"config\"></media-list>\n" +
    "</div>");
}]);

angular.module("editNotifications.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editNotifications.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"block\">\n" +
    "                    <h4><label i18n=\"editNotifications.email.selectAddressees\"></label></h4>\n" +
    "                    <auto-complete ng-model=\"model.notifications.email.selectedUsers\" ng-options=\"usersList\" label-key=\"fullName\" value-key=\"email\"\n" +
    "                                   placeholder=\"editNotifications.email.typeToGetUsers\" multiple=\"true\"></auto-complete>\n" +
    "                </div>\n" +
    "                <div class=\"block\">\n" +
    "                    <h4><label i18n=\"editNotifications.email.writeMessage\"></label></h4>\n" +
    "                    <h6><label i18n=\"editNotifications.title\"></label></h6>\n" +
    "                    <input type=\"text\" ng-model=\"model.notifications.email.subject\" />\n" +
    "                    <h6><label i18n=\"editNotifications.content\"></label></h6>\n" +
    "                    <div content-editable ng-model=\"model.notifications.email.text\" class=\"content\"></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <h6><i><label i18n=\"editNotifications.liveMessage.sendMessage\"></label></i></h6>\n" +
    "                <div class=\"block\">\n" +
    "                    <h6><label i18n=\"editNotifications.title\"></label></h6>\n" +
    "                    <input type=\"text\" ng-model=\"model.notifications.liveMessage.subject\" />\n" +
    "                    <h6><label i18n=\"editNotifications.content\"></label></h6>\n" +
    "                    <div content-editable ng-model=\"model.notifications.liveMessage.text\" class=\"content\"></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>");
}]);

angular.module("editPages.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editPages.html",
    "<li class=\"hasSubmenu\">\n" +
    "	<div class=\"submenu\">\n" +
    "        <nested-pages-wrapper pages=\"pages\" items=\"items\" selected-item=\"selectedPage\" on-add=\"onAddPage($page)\"></nested-pages-wrapper>\n" +
    "	</div>\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "	<div class=\"content level2\">\n" +
    "        <ul ng-form=\"editPages\">\n" +
    "            <li class=\"layer\" id=\"currentLayout{{$id}}\">\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.id\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    /<label url-token input=\"selectedPage.text\" output=\"selectedPage.url\"></label>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.text\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <input type=\"text\" ng-model=\"selectedPage.text\" i18n-db-input mandatory\n" +
    "                           placeholder=\"editPages.text.placeholder\" />\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.description\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <textarea content-editable ng-model=\"selectedPage.description\" i18n-db-input\n" +
    "                              ux-change=\"registerSelectedPageChange()\" placeholder=\"editPages.description.placeholder\"></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.type\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <select ng-model=\"selectedPage.type\" ng-options=\"obj.id as obj.text for obj in pageTypes\"\n" +
    "                            ng-change=\"registerSelectedPageChange()\"></select>\n" +
    "                </div>\n" +
    "                <div ux-show=\"selectedPage.type=='externalLink'\">\n" +
    "                    <div class=\"columns large-8 textAlignRight\"><label i18n=\"editPages.url\"></label></div>\n" +
    "                    <div class=\"columns large-11\">\n" +
    "                        <input type=\"text\" ng-model=\"selectedPage.externalLinkUrl\" mandatory ng-change=\"registerSelectedPageChange()\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"columns large-2 textAlignRight\"><label i18n=\"editPages.target\"></label></div>\n" +
    "                    <div class=\"columns large-4\">\n" +
    "                        <select ng-model=\"selectedPage.target\" ng-options=\"obj.id as obj.text for obj in targets\"\n" +
    "                                ng-change=\"registerSelectedPageChange()\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\" id=\"changeLayout{{$id}}\">\n" +
    "                <padding>\n" +
    "                    34\n" +
    "                </padding>\n" +
    "            </li>\n" +
    "            <li class=\"layer\" id=\"section2c{{$id}}\">\n" +
    "                <padding>\n" +
    "                    <h2>Section 6</h2>\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse et turpis sed metus fermentum pellentesque. Vestibulum auctor neque ac nunc elementum malesuada. Praesent non est sed libero vestibulum consectetuer. Sed vehicula. Vivamus quis tellus sit amet erat ultrices luctus. Fusce a ligula. Fusce viverra libero vitae velit. Aenean bibendum nibh non lorem. Suspendisse quis velit. Integer sit amet lacus. Curabitur tristique. Morbi eu lectus. Vestibulum tristique aliquam quam. Sed neque.</p>\n" +
    "                    <p>Nulla facilisi. Quisque eleifend libero. Sed eros. Morbi vel leo. Morbi varius tincidunt sem. Nam sodales volutpat velit. Suspendisse potenti. Duis vehicula pede non nisi. Proin elit pede</p>\n" +
    "                </padding>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "	</div>\n" +
    "</li>\n" +
    "");
}]);

angular.module("editStyles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editStyles.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div styles=\"model.styles\"></div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div styles=\"model.app.styles\"></div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>\n" +
    "");
}]);

angular.module("editTag.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editTag.html",
    "<div>\n" +
    "    <div class=\"columns large-8 textAlignRight\"><label i18n=\"editTag.tagName\"></label>:</div>\n" +
    "    <div class=\"columns large-16\"><input type=\"text\" ng-model=\"tag.text\" mandatory /></div>\n" +
    "</div>");
}]);

angular.module("editTagList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editTagList.html",
    "<div>\n" +
    "    <tag-list config=\"config\"></tag-list>\n" +
    "</div>");
}]);

angular.module("editUser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editUser.html",
    "<div>\n" +
    "    <div class=\"columns large-8\">\n" +
    "        <media-picker preview=\"true\" ng-model=\"user.media\" default-media-url=\"defaultAvatarUrl\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <div><label i18n=\"editUser.fullName\"></label>: <input type=\"text\" ng-model=\"user.fullName\" mandatory /></div>\n" +
    "        <div><label i18n=\"editUser.email\"></label>: <input type=\"text\" ng-model=\"user.email\" email-mandatory mandatory /></div>\n" +
    "        <div><label i18n=\"editUser.birthDate\"></label>: <input date ng-model=\"user.birthDate\" /></div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.password\"></label>:\n" +
    "            <input password ng-model=\"user.password\" click-to-change=\"clickToChangePassword\" />\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.role\"></label>\n" +
    "            <select ng-model=\"user.role\" ng-options=\"obj.karma as obj.title for obj in roles\"></select>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.language\"></label>\n" +
    "            <select ng-model=\"user.language\" ng-options=\"obj.code as obj.text for obj in languages\"></select>\n" +
    "        </div>\n" +
    "        <div><label i18n=\"tags\"></label>:\n" +
    "            <auto-complete ng-model=\"user.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                           placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("editUserList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editUserList.html",
    "<div>\n" +
    "    <user-list config=\"config\"></user-list>\n" +
    "</div>");
}]);

angular.module("portalsAdminEditDb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminEditDb.html",
    "<div>\n" +
    "    --{{model}}\n" +
    "    <div class=\"cf\">\n" +
    "        <div class=\"columns large-10\">Portal Url</div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <label url-token input=\"model.typedName\" output=\"model.name\"></label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <div class=\"columns large-10\">Database name:<br/>(Without spaces)</div>\n" +
    "        <div class=\"columns large-15\"><input type=\"text\" ng-model=\"model.typedName\" /></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("portalsAdminView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminView.html",
    "<div>\n" +
    "    <div list=\"databases\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         on-create=\"onCreate($item)\" on-edit=\"onEdit($item)\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("stats.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("stats.html",
    "<div>\n" +
    "    <div class=\"columns large-12 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdNewsPerDay\"></label></h4>\n" +
    "        <line-chart data=\"newsPerDay\"></line-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-12 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdUsersPerDay\"></label></h4>\n" +
    "        <line-chart data=\"usersPerDay\"></line-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdContentPerUser\"></label></h4>\n" +
    "        <pie-chart data=\"contentPerUser\"></pie-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.usersPerRole\"></label></h4>\n" +
    "        <pie-chart data=\"usersPerRole\"></pie-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.commentsPerUser\"></label></h4>\n" +
    "        <pie-chart data=\"commentsPerUser\"></pie-chart>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("styles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("styles.html",
    "<div>\n" +
    "    <div class=\"cf\">\n" +
    "        <label i18n=\"editStyles.backgroundColor\"></label>\n" +
    "        <div>\n" +
    "            <input color-picker placeholder=\"Specify the color\" ng-model=\"model.backgroundColor\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <label i18n=\"editStyles.fontColor\"></label>\n" +
    "        <div>\n" +
    "            <input color-picker placeholder=\"Specify the color\" ng-model=\"model.color\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <label i18n=\"editStyles.padding\"></label>\n" +
    "        <div><input type=\"text\" ng-model=\"model.padding\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <label i18n=\"editStyles.fontSize\"></label>\n" +
    "        <div><input type=\"text\" ng-model=\"model.fontSize\"/></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app.html",
    "<div class=\"app {{type}} {{getCurrentUserAdminAccessStyleClass()}} cf\" ng-style=\"setAppStyles()\">\n" +
    "    <div app-header class=\"cf\"></div>\n" +
    "	<div class=\"content cf\">\n" +
    "        <div class=\"title\" ng-show=\"isTitleVisible()\"><h5>{{model.title || appInfo.title}}</h5></div>\n" +
    "        <div class=\"align\" ng-class=\"{alignCenter: model.align=='center', alignRight: model.align=='right'}\">\n" +
    "            <div app-bridge bindings=\"bindings\" src=\"{{type}}\" view=\"{{view}}\" on-event=\"onEvent\"></div>\n" +
    "        </div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("appHeader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("appHeader.html",
    "<div>\n" +
    "    <div class=\"headerToggle\" ng-click=\"toggleHeader()\" ng-show=\"showAdminActions()\"></div>\n" +
    "    <div class=\"header cf\" ng-show=\"showHeader()\" title=\"{{getAppHelpText()}}\">\n" +
    "        <div class=\"title\">\n" +
    "            <h5>{{model.title || appInfo.title}}</h5>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button class=\"editIcon\" ng-click=\"showEditTemplate()\" ng-show=\"showEditActions()\" title=\"app.edit\" i18n-title></button>\n" +
    "            <button class=\"fullscreenIcon\" ng-click=\"toggleFullscreen()\" ng-show=\"showAdminActions()\" title=\"app.fullscreen\"\n" +
    "                    ng-disabled=\"templateApp=='true' && isTemplateFullscreen\" i18n-title></button>\n" +
    "            <button class=\"removeIcon\" ng-click=\"removeApp()\" ng-show=\"showAdminActions()\" title=\"app.remove\" i18n-title></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerCanvas.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerCanvas.html",
    "<div class=\"bannerCanvas\" ng-class=\"{readOnly: isReadOnly()}\">\n" +
    "    <div class=\"addArea\" ux-show=\"!isReadOnly()\">\n" +
    "        <button class=\"addImage addIcon\" ng-click=\"addItem('image')\">Add image</button>\n" +
    "        <button class=\"addText addIcon\" ng-click=\"addItem('text')\">Add text</button>\n" +
    "    </div>\n" +
    "    <div class=\"grid\" ng-class=\"{overflowVisible: overflow.visible}\">\n" +
    "        <div banner-item ng-repeat=\"item in items.data\" data=\"item\" on-change=\"onItemChange()\"\n" +
    "             overflow=\"overflow\" read-only=\"isReadOnly()\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerItem.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerItem.html",
    "<div id=\"{{item.id}}\" class=\"bannerItem\" ng-class=\"{readOnly: readOnly}\">\n" +
    "    <button class=\"edit editIcon\" ng-click=\"editItem()\"></button>\n" +
    "    <div ux-transclude=\"template\"></div>\n" +
    "    <input type=\"text\" class=\"selectHandler mousetrap\" />\n" +
    "</div>");
}]);

angular.module("bannerTextEditText.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerTextEditText.html",
    "<div>\n" +
    "    <div content-editable ng-model=\"item.value\" i18n-db-input ux-change=\"contentChanged()\"></div>\n" +
    "</div>");
}]);

angular.module("comment.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment.html",
    "<li class=\"comment cf\" ng-hide=\"comment.deleted\">\n" +
    "    <img class=\"avatar\" ng-src=\"{{getDownloadUrl(comment.create.author.media)}}\" />\n" +
    "    <div class=\"metaData avatarSibling\">\n" +
    "        <div class=\"header\">\n" +
    "            <div class=\"floatLeft\">\n" +
    "                <div class=\"author\"><a href=\"#\">{{comment.create.author.fullName}}</a></div>\n" +
    "            </div>\n" +
    "            <div class=\"floatRight\">\n" +
    "                <div class=\"date\">{{getFormattedDate()}}</div>\n" +
    "                <div rating=\"comment.avgRating\" target-id=\"comment._id\" target-author-id=\"comment.create.author._id\"\n" +
    "                     target-collection=\"comments\" height=\"16\" ux-show=\"showRatings()\"></div>\n" +
    "                <button class=\"toggleReply replyIcon small\" ng-click=\"toggleReply()\" i18n-title title=\"comments.addReply\"\n" +
    "                        ng-show=\"isLoggedUser\"></button>\n" +
    "                <button class=\"toggleEdit editIcon small\" ng-click=\"toggleEdit()\" i18n-title title=\"comments.edit\"\n" +
    "                        ng-show=\"isSelfActionAllowed\"></button>\n" +
    "                <button class=\"deleteComment removeIcon small\" i18n-title title=\"comments.deleteComment\"\n" +
    "                        confirm-action=\"deleteComment()\" ng-show=\"isSelfActionAllowed\"></button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div content-editable=\"comment.isEditable\" ng-model=\"comment.text\" type=\"type\"\n" +
    "             on-blur=\"updateComment()\" class=\"message\"></div>\n" +
    "        <div class=\"repliesWrapper\"></div>\n" +
    "    </div>\n" +
    "</li>");
}]);

angular.module("comments.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comments.html",
    "<div class=\"comments\">\n" +
    "    <h5 class=\"title\" ng-hide=\"parentComment\"><label i18n=\"comments\"></label></h5>\n" +
    "    <div ng-show=\"comments.length == 0 && !parentComment\" class=\"noComments\">\n" +
    "        <label i18n=\"comments.noItems\"></label>\n" +
    "    </div>\n" +
    "    <ul ng-show=\"comments.length > 0\">\n" +
    "        <li ng-repeat=\"comment in comments\" comment=\"comment\"></li>\n" +
    "    </ul>\n" +
    "    <div class=\"cf\" ng-hide=\"hideAdd || !loggedUser\">\n" +
    "        <img class=\"avatar\" ng-src=\"{{getUserAvatarUrl()}}\" />\n" +
    "        <textarea content-editable ng-model=\"newCommentText\" class=\"newCommentInput avatarSibling\" placeholder=\"{{placeholder}}\"></textarea>\n" +
    "        <button class=\"addIcon createComment floatRight\" ng-click=\"createComment()\">\n" +
    "            <label i18n=\"{{placeholder}}\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("contentEditable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentEditable.html",
    "<div>\n" +
    "    <div class=\"actionsArea\" ng-show=\"isEditable() && showActions\" >\n" +
    "        <media-picker ng-model=\"newMedia\" multiple=\"false\" on-close=\"onClose()\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"editableArea\">\n" +
    "        <div ux-keyup=\"onKeyup()\" ng-mouseup=\"showEditBox()\" contenteditable=\"{{isEditable()}}\"></div>\n" +
    "        <div class=\"placeholder\" ng-show=\"placeholder && showPlaceholder\">\n" +
    "            <label i18n=\"{{placeholder}}\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"background\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("richContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("richContent.html",
    "<div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.color\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <input color-picker placeholder=\"richContent.color.placeholder\" ng-model=\"style.color\" on-change=\"propagateChanges()\" />\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.style\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <button toggle-style ng-model=\"style.fontWeight\" active-when=\"bold\" inactive-when=\"normal\" class=\"boldIcon\"></button>\n" +
    "        <button toggle-style ng-model=\"style.fontStyle\" active-when=\"italic\" inactive-when=\"normal\" class=\"italicIcon\"></button>\n" +
    "        <button toggle-style ng-model=\"style.textDecoration\" active-when=\"underline\" inactive-when=\"none\" class=\"underlineIcon\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.size\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <select ng-model=\"heading\" ng-init=\"heading=heading||'normal'\"\n" +
    "                ng-options=\"obj.value as obj.text for obj in headingOptions\" ng-change=\"setHeading()\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.link\"></label></div>\n" +
    "    <div class=\"columns large-6\">\n" +
    "        <select ng-model=\"linkType\" ng-init=\"linkType=linkType||'internal'\" ng-options=\"obj.id as obj.text for obj in linkTypes\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-10\">\n" +
    "        <div ng-show=\"linkType=='internal'\" >\n" +
    "            <auto-complete ng-model=\"internalLink\" ng-options=\"pagesList\" label-key=\"text\" value-key=\"url\"\n" +
    "                           ux-change=\"setInternalLink()\" placeholder=\"richContent.link.placeholder\"></auto-complete>\n" +
    "        </div>\n" +
    "        <input type=\"text\" ng-model=\"externalLink\" ux-blur=\"setExternalLink()\" ng-show=\"linkType=='external'\" />\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("selectMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("selectMedia.html",
    "<div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-10 textAlignRight\">\n" +
    "            <label i18n=\"selectMedia.source\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <media-picker ng-model=\"internalData.updatedMedia\" multiple=\"false\" on-change=\"onMediaChange($media)\"></media-picker>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"config.editSize==false\">\n" +
    "        <div class=\"columns large-10 textAlignRight\">\n" +
    "            <label i18n=\"selectMedia.size\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <select ng-model=\"mediaSize\" ng-init=\"mediaSize=mediaSize||'original'\"\n" +
    "                    ng-options=\"obj.id as obj.text for obj in mediaSizes\" ng-change=\"propagateChanges()\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("fileUploader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("fileUploader.html",
    "<form enctype=\"multipart/form-data\" action=\"{{endpoint||'media/upload/'}}\" method=\"post\" class=\"fileUploader\">\n" +
    "    <input type=\"file\" ng-model=\"files\" ux-change=\"submit()\" name=\"upload\" multiple-files=\"{{multiple}}\" />\n" +
    "</form>");
}]);

angular.module("password.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("password.html",
    "<div>\n" +
    "    <a href=\"#\" ng-click=\"togglePassword()\" ng-show=\"clickToChange\">\n" +
    "        <label class=\"change\" ng-show=\"!changePasswordActive\"><label i18n=\"password.change\"></label></label>\n" +
    "        <label class=\"cancelChanges\" ng-show=\"changePasswordActive\"><label i18n=\"password.cancelChanges\"></label></label>\n" +
    "    </a>\n" +
    "    <input ng-show=\"changePasswordActive  || !clickToChange\" type=\"password\" ng-model=\"model\" password-mandatory />\n" +
    "</div>");
}]);

angular.module("rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("rating.html",
    "<ul class=\"rating\">\n" +
    "    <li ng-repeat=\"rating in normalizedRating\" ng-click=\"rate($index+1)\" ng-class=\"getStarStyleClass($index+1, rating)\"\n" +
    "        ng-mouseenter=\"hoverRate($index+1)\" ng-mouseleave=\"clearHoverRate()\">\n" +
    "            <div class=\"star\" ng-style=\"getStarSize()\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("contentList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentList.html",
    "<div>\n" +
    "    <div list-db=\"items\" id=\"_id\" collection=\"collection\" config=\"config\" template=\"template\"\n" +
    "         on-edit-panels=\"onEditPanels\" search-targets=\"searchTargets\" config=\"config\"></div>\n" +
    "</div>");
}]);

angular.module("list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list.html",
    "<div ng-class=\"getWrapperClass()\">\n" +
    "    <div class=\"searchArea\" ng-show=\"isSearchable() && !detailId\">\n" +
    "        <label i18n=\"list.search\"></label>\n" +
    "        <input type=\"text\" ng-model=\"searchText\" ux-keyup=\"executeSearch()\"/>\n" +
    "    </div>\n" +
    "    <div ng-show=\"isPageActionsTop()\" list-actions class=\"top\" collection=\"collection\"></div>\n" +
    "    <div class=\"noItems\" ng-show=\"items.length == 0\"><i><label i18n=\"list.noItems\"></label></i></div>\n" +
    "    <div ng-show=\"items.length > 0\" ng-hide=\"detailId && detailId!=item._id\" id=\"{{item._id}}\"\n" +
    "         ng-repeat=\"item in items | filter: getFilter()\" class=\"item columns\"\n" +
    "         ng-class=\"getItemStyleClasses(item)\" ng-style=\"setItemHeight()\">\n" +
    "        <div class=\"selectFromCheckbox\" ng-show=\"isMultiSelectable()\">\n" +
    "            <input checkbox class=\"white\" ng-model=\"item.isSelected\" ng-click=\"clickOnItem(item, $index, $event, false)\"\n" +
    "                   block-update-model=\"true\" />\n" +
    "        </div>\n" +
    "        <div class=\"text\" ng-click=\"clickOnItem(item, $index, $event, true)\">\n" +
    "             <div ux-transclude=\"template\"></div>\n" +
    "         </div>\n" +
    "        <button class=\"remove removeIcon\" ng-click=\"clickOnItem(item, $index, $event, false)\" ng-show=\"isDeletable()\"\n" +
    "                title confirm-action=\"deleteItem(item._id)\">\n" +
    "            <label i18n=\"list.deleteItem\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <a href=\"#\" class=\"detailArea floatRight\" ng-show=\"detailId\" ng-click=\"deleteDetailId()\">\n" +
    "        &lt;&lt; <label i18n=\"list.goBack\"></label>\n" +
    "    </a>\n" +
    "    <div ng-show=\"isPageActionsBottom()\" list-actions class=\"bottom\" collection=\"collection\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("listDb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listDb.html",
    "<div>\n" +
    "    <div list=\"items\" collection=\"collection\" id=\"_id\" config=\"config\" projection=\"projection\"\n" +
    "         transcluded-data=\"transcludedData\" on-search=\"onSearch($text)\" on-select=\"selectItem($item)\"\n" +
    "         on-create=\"createItem($item)\" on-delete=\"deleteItem($id)\" current-page=\"currentPage\"\n" +
    "         db-source=\"true\" template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"></div>\n" +
    "</div>");
}]);

angular.module("mediaList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaList.html",
    "<div>\n" +
    "    <file-uploader ux-show=\"config.uploadable\" on-upload=\"onUpload()\" multiple=\"true\"></file-uploader>\n" +
    "    <div list-db=\"items\" collection=\"collection\" config=\"config\" projection=\"projection\"\n" +
    "         template=\"template\" on-edit-panels=\"onEditPanels\" search-targets=\"searchTargets\"\n" +
    "         transcluded-data=\"transcludedData\" on-select=\"selectItem($item)\">\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("tagList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tagList.html",
    "<div>\n" +
    "    <div list-db=\"items\" collection=\"collection\" config=\"config\" on-edit-panels=\"onEditPanels\"\n" +
    "         search-targets=\"searchTargets\">\n" +
    "        <h3><a href=\"#\">{{item.text}}</a></h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("userList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userList.html",
    "<div class=\"userList\">\n" +
    "    <div list=\"userList\" collection=\"collection\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         on-create=\"onCreate($item)\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login.html",
    "<div>\n" +
    "    <div ng-show=\"userSession\">\n" +
    "        Hello, {{userSession.fullName}}. [<a href=\"#\" ng-click=\"logout()\">Logout</a>]\n" +
    "    </div>\n" +
    "    <form class=\"login cf\" action=\"rest/login\" method=\"POST\" ng-show=\"!userSession\">\n" +
    "        <div class=\"user columns large-12\">\n" +
    "            <div class=\"label columns large-8 textAlignRight\">E-mail:</div><div class=\"field columns large-16\">\n" +
    "            <input type=\"text\" name=\"email\" ng-model=\"email\" />\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        <div class=\"password columns large-11\">\n" +
    "            <div class=\"label columns large-8 textAlignRight\">Password:</div><div class=\"field columns large-16\">\n" +
    "            <input type=\"password\" name=\"password\" ng-model=\"password\" />\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        <!--<div class=\"remember rows\">\n" +
    "            <input checkbox ng-model=\"remember\" label=\"Remember\" />\n" +
    "        </div>-->\n" +
    "        <div class=\"submit columns large-2\">\n" +
    "            <button type=\"submit\" class=\"okIcon floatRight\"></button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("mediaPicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaPicker.html",
    "<div class=\"mediaPicker\">\n" +
    "    <button class=\"mediaIcon\" ng-click=\"selectFromMediaList()\">\n" +
    "        <label i18n=\"fileUploader.selectFromMediaList\"></label>\n" +
    "    </button>\n" +
    "    <img class=\"current\" ng-src=\"{{getDownloadUrl(model)}}\" ng-show=\"preview=='true'\" title=\"{{getFileTitle(model)}}\" />\n" +
    "    <button class=\"removeIcon small\" ng-click=\"deleteSelection()\" ng-show=\"model._id\">\n" +
    "        <label i18n=\"fileUploader.deleteSelection\"></label>\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("pages.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages.html",
    "<ul class=\"pages\" ng-style=\"setPagesStyles()\" ng-class=\"getCurrentUserAdminAccessStyleClass()\">\n" +
    "    <li ng-repeat=\"row in portal.template.rows\" class=\"rows\">\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"column in row.columns\" resizable-app=\"{{isAppResizeAllowed()}}\" class=\"columns large-{{column.size}}\"\n" +
    "                ng-class=\"{template: column.apps}\">\n" +
    "                <ul ux-show=\"column.apps\" sortable-app=\"{{isAppSortAllowed()}}\" ui-sortable=\"sortableOptions\"\n" +
    "                    ng-model=\"column.apps\" class=\"appContainer\">\n" +
    "                    <li app=\"app.id\" ng-repeat=\"app in column.apps\" model=\"app.model\" type=\"app.type\" template-app=\"true\" width=\"column.size\"></li>\n" +
    "                </ul>\n" +
    "                <ul ux-show=\"column.rows\">\n" +
    "                    <li ng-repeat=\"row in column.rows\" class=\"rows\">\n" +
    "                        <ul>\n" +
    "                            <li ng-repeat=\"column in row.columns\" resizable-app=\"{{isAppResizeAllowed()}}\" class=\"columns large-{{column.size}} page\" >\n" +
    "                                <ul sortable-app=\"{{isAppSortAllowed()}}\" ui-sortable=\"sortableOptions\" ng-model=\"column.apps\" class=\"appContainer\">\n" +
    "                                    <li app=\"app.id\" ng-repeat=\"app in column.apps\" model=\"app.model\" type=\"app.type\" template-app=\"false\" width=\"column.size\"></li>\n" +
    "                                </ul>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("errorPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("errorPage.html",
    "<div class=\"errorPage\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"inner\">\n" +
    "            <div class=\"cf\">\n" +
    "                <img class=\"columns large-8\" src=\"/client/images/error.png\"/>\n" +
    "                <div class=\"text columns large-17\">\n" +
    "                    <h2 class=\"title\" ng-bind=\"errorTitle\"></h2>\n" +
    "                    <button class=\"addIcon\" ng-click=\"goToPortalHome()\" ng-show=\"showPortalHomeButton\">\n" +
    "                        <label i18n=\"errorPage.goToPortalHome\"></label>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("loginPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginPage.html",
    "<div global-msg></div>\n" +
    "<div class=\"loginPage\">\n" +
    "    <img src=\"/client/images/logo.svg\"/>\n" +
    "    <login></login>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("portalPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalPage.html",
    "<div global-msg></div>\n" +
    "<admin-panel ux-show=\"isAdmin()\"></admin-panel>\n" +
    "<pages></pages>");
}]);

angular.module("listActions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listActions.html",
    "<div class=\"cf\">\n" +
    "    <div class=\"leftActions floatLeft onSelectActions\" ng-show=\"isMultiSelectable() && items.length\">\n" +
    "        <button class=\"okIcon\" ng-click=\"toggleSelectAll()\">\n" +
    "            <label i18n=\"list.selectItems\"></label>\n" +
    "        </button>\n" +
    "        <button class=\"removeIcon\" ng-click=\"deleteSelected()\" ng-show=\"selectedIds.length && isDeletable()\">\n" +
    "            <label i18n=\"list.deleteSelected\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"leftActions floatLeft createActions\" ng-show=\"isCreatable()\">\n" +
    "        <button create-item-button class=\"addIcon\" ng-click=\"createItem()\" collection=\"collection\"\n" +
    "                on-create=\"createItem($item)\" on-create-panels=\"onCreatePanels\">\n" +
    "            <label i18n=\"list.createItem\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"rightActions floatRight getPageActions\" ng-show=\"showPrevPageLink()||showNextPageLink()\">\n" +
    "        <button class=\"getPrevPage\" ng-click=\"getPrevPage()\" ng-show=\"showPrevPageLink()\">&lt;</button>\n" +
    "        <button class=\"getNextPage\" ng-click=\"getNextPage()\" ng-show=\"showNextPageLink()\">&gt;</button>\n" +
    "    </div>\n" +
    "    <div class=\"selectedItems\">\n" +
    "        <label ng-class=\"{show: selectedIds.length}\">{{selectedIds.length}} <label i18n=\"list.selectedItems\"></label></label>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("listEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listEdit.html",
    "<div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-25\"><input checkbox ng-model=\"model.searchable\" label=\"Enable search\"/></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Page size:</div>\n" +
    "        <div class=\"columns large-12\"><input type=\"text\" ng-model=\"model.pageSize\" /></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Skip:</div>\n" +
    "        <div class=\"columns large-12\"><input type=\"text\" ng-model=\"model.skip\" /></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Sort field:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.sort.field\" ng-options=\"obj.id as obj.text for obj in sortTypes.field\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Sort order:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.sort.order\" ng-options=\"obj.id as obj.text for obj in sortTypes.order\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <label>\n" +
    "        Pagination position:\n" +
    "        <select ng-model=\"model.pageActionPos\" >\n" +
    "            <option value=\"0\">Top</option>\n" +
    "            <option value=\"1\">bottom</option>\n" +
    "            <option value=\"2\">topAndBottom</option>\n" +
    "        </select>\n" +
    "    </label>\n" +
    "\n" +
    "    Filter:\n" +
    "    <auto-complete ng-model=\"model.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Select tags to filter\" multiple=\"true\"></auto-complete>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Columns:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.columns\" ng-options=\"obj.value as obj.text for obj in columnOptions\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
