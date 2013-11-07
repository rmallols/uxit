(function () {
    'use strict';
    COMPONENTS.directive('appBridge', ['$injector', '$compile', '$timeout', '$templateCache',
    'stringService',
    function ($injector, $compile, $timeout, $templateCache, sS) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    model           : '=',
                    internalData    : '=',
                    config          : '=',
                    onLayer         : '=',
                    onEvent         : '=',
                    src             : '@',
                    view            : '@'
                },
                link: function link(scope, element) {

                    var childScope = scope.$new(true);

                    $timeout(function() {
                        inheritParentScopeModel();
                        if(childScope.src && childScope.view) {
                            executeServiceMethod(childScope.src, childScope.view);
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