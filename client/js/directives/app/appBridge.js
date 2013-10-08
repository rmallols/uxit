(function () {
    'use strict';
    COMPONENTS.directive('appBridge', ['$injector', '$compile', '$timeout', '$templateCache', 'stringService',
    function ($injector, $compile, $timeout, $templateCache, sS) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    model           : '=',
                    internalData    : '=',
                    onLayer         : '=',
                    src             : '@',
                    view            : '@'
                },
                link: function link(scope, element) {

                    var childScope = scope.$new(true);

                    $timeout(function() {
                        inheritParentScopeModel();
                        if(childScope.src && childScope.view) {
                            executeServiceMethod(childScope.src, childScope.view)
                        }
                    });

                    /** Private methods **/
                    function inheritParentScopeModel() {
                        childScope.internalData = scope.internalData;
                        childScope.model = scope.model;
                        childScope.onLayer = scope.onLayer;
                        childScope.src = scope.src;
                        childScope.view = scope.view;
                    }

                    function executeServiceMethod(src, view) {
                        var appElm = compileTemplate(src, view);
                        manageServiceFns(src, view, appElm);
                    }

                    function compileTemplate(src, view) {
                        var templateId = src + sS.capitalize(view) + '.html',
                            appElm = $($templateCache.get(templateId));
                        element.html(appElm);
                        $compile(appElm)(childScope);
                        return appElm;
                    }

                    function manageServiceFns(src, view, appElm) {
                        var appService = $injector.get(src + 'Service');
                        defineOnLayerSaveFn(appService, view);
                        if(appService[view]) {
                            appService[view](childScope, appElm);
                        }
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
                    /** End of private methods **/
                }
            };
        }]);
})();