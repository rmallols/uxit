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
                    view            : '@',
                    ctrl            : '@'
                },
                link: function link(scope, element) {

                    var childScope;
                    scope.$watch('src', function(newSrc) {
                        if(newSrc) {
                            childScope = scope.$new(true);
                            $timeout(function() {
                                inheritParentScopeModel();
                                if(childScope.src && childScope.view) {
                                    executeServiceMethod(childScope.src, childScope.view, childScope.ctrl);
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
                        childScope.ctrl         = scope.ctrl;
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

                    function executeServiceMethod(src, view, ctrl) {
                        var appElm = compileTemplate(src, view);
                        manageServiceFns(src, view, ctrl, appElm);
                    }

                    function compileTemplate(src, view) {
                        var templateId  = src + sS.capitalize(view),
                            appElm      = $($templateCache.get(src + sS.capitalize(view)  + '.html'));
                        element.html(appElm);
                        element.addClass(templateId);
                        $compile(appElm)(childScope);
                        return appElm;
                    }

                    function manageServiceFns(src, view, ctrl, appElm) {
                        var appService = $injector.get(src + 'Service');
                        defineViewFn(appService, view, ctrl, appElm);
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

                    function defineViewFn(appService, view, ctrl, appElm) {
                        var viewFn = ctrl || view; //Allow custom controller functions
                        if(appService[viewFn]) {
                            appService[viewFn](childScope, appElm);
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