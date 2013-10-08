(function () {
    'use strict';
    COMPONENTS.directive('edit', ['$rootScope', '$compile', 'portalService', 'validationService', 'keyboardService', 'stringService',
        function ($rootScope, $compile, portalService, validationService, keyboardService, stringService) {
            return {
                restrict: 'E',
                require: 'ngModel',
                transclude: true,
                templateUrl: 'edit.html',
                replace: true,
                scope : {
                    model               : '=ngModel',
                    internalData        : '=',
                    panels              : '=',
                    activeTab           : '=',
                    limitLayerHeight    : '@',
                    onSave              : '&',
                    onChange            : '&',
                    onCancel            : '&'
                },
                link: function (scope, element, attrs) {

                    var directiveId = 'edit' + ((attrs.type) ? '-' + attrs.type : ''), i = 0, pristineModel = {},
                        pristineInternalData = {}, formObjs = [], layersWrapper = $('> .content.level1 > ul', element);

                    scope.showIfMultipleTabs = function () {
                        return scope.panels.length > 1;
                    };

                    scope.getLayerHeight = function () {
                        if (scope.limitLayerHeight) {
                            //Adjust the height limit of the layer
                            //This is thought to ensure that the editBox is smaller than the current view
                            return {
                                //maxHeight: $(window).height() * 0.6
                                height: $(window).height() * 0.5
                            };
                        }
                        return null;
                    };

                    scope.cancel = function () {
                        //Restore the pristine state of the form
                        $.extend(true, scope.model, pristineModel);
                        $.extend(true, scope.internalData, pristineInternalData);
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
                            $.extend(true, pristineModel, scope.model);
                            $.extend(true, pristineInternalData, scope.internalData);
                            setPristine();
                        } else {
                            validationService.setFocusOnFirstError(element);
                        }
                    };

                    scope.clickTab = function (tabIndex) {
                        scope.activeTab = tabIndex;
                        if (scope.panels[tabIndex].onTabClicked) {
                            scope.panels[tabIndex].onTabClicked(tabIndex);
                        }
                        layersWrapper.css('margin-left', '-' + (tabIndex * 100) + '%');
                        //Set a specific style class white the transition is being executed to support fine grain styles
                        setTempScrollingStyleClass();
                    };

                    scope.getTabClasses = function (panel, tabIndex) {
                        return (tabIndex === scope.activeTab) ? 'active ' + panel.ngClass : panel.ngClass;
                    };

                    scope.isLayerShown = function (tabIndex) {
                        return tabIndex === scope.activeTab;
                    };

                    scope.isEditedMarkVisible = function (panelForm) {
                        return scope.activeTab >= 0 && panelForm.$dirty;
                    };

                    scope.getEditedMarkColor = function (panelForm) {
                        return (panelForm.$valid) ? 'valid' : 'invalid';
                    };

                    //Save the pristine state of the form
                    scope.$watch('model', function (newVal) {
                        if (newVal) { $.extend(true, pristineModel, scope.model); }
                    });

                    scope.$watch('internalData', function (newVal) {
                        if (newVal) { $.extend(true, pristineInternalData, scope.internalData); }
                    });

                    scope.$watch('panels', function () {
                        scope.tabWidth = 100 / scope.panels.length;
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

                    function updateFormObjs() {
                        scope.panels.forEach(function (panel) {
                            formObjs.push(scope[panel.type]);
                        });
                    }

                    function registerKeyboardEvents() {
                        keyboardService.register('left', directiveId, function () {
                            var newActiveTab = (scope.activeTab > 0) ? scope.activeTab - 1 : scope.panels.length - 1;
                            scope.clickTab(newActiveTab);
                            scope.$apply();
                        });
                        keyboardService.register('right', directiveId, function () {
                            var newActiveTab = (scope.activeTab < scope.panels.length - 1) ? scope.activeTab + 1 : 0;
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
                        panel.onLayer = {};
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
                        htmlElm = $('<div id="' + panel.type + scope.$id + '" ' +
                                        'model="model" ng-style="getLayerHeight()" internal-data="internalData" ' +
                                        'on-layer="panels[' + index + '].onLayer" on-cancel="onCancel()" ' +
                                        'on-change="onChange()" ux-show="isLayerShown(' + index + ')" ' +
                                        'persist="true">' +
                                    '</div>');
                        if(panel.appBridge) {
                            directiveName =  'app-bridge';
                            htmlElm.attr('src', panel.src);
                            htmlElm.attr('view', panel.view);
                        } else {
                            directiveName = stringService.toSnakeCase(panel.type);
                        }
                        htmlElm.attr(directiveName, '');
                        htmlElm.wrap('<li class="layer" ng-form name="' + panel.type + '"></li>');
                        return htmlElm.parent();
                    }
                    /** End of private methods **/
                }
            };
        }]);
})();
