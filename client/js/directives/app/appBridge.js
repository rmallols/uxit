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
                    onLayerSave     : '=',
                    src             : '@',
                    view            : '@'
                },
                link: function link(scope, element) {

                    //var childScope = scope.$new();
                    var childScope = scope.$new(true);
                    childScope.internalData = scope.internalData;
                    childScope.model = scope.model;
                    childScope.onLayerSave = scope.onLayerSave;

                    scope.$watch('src', function(src) {

                        if(src && scope.view) {
                            childScope.src = scope.src;
                            childScope.view = scope.view;
                            executeServiceMethod(src, childScope.view)
                        }
                    });

                    /** Private methods **/
                    function executeServiceMethod(src, view) {
                        manageServiceFns(src, view);
                        compileTemplate(src, view);
                    }

                    function compileTemplate(src, view) {
                        var templateId = src + sS.capitalize(view) + '.html',
                            appElm = $($templateCache.get(templateId));
                        element.html(appElm);
                        $compile(appElm)(childScope);
                        return appElm;
                    }

                    function manageServiceFns(src, view) {
                        $timeout(function() {
                            var appService = $injector.get(src + 'Service');
                            defineOnLayerSaveFn(appService, view);
                            if(appService[view]) {
                                appService[view](childScope);
                            }
                        })
                    }

                    function defineOnLayerSaveFn(appService, view) {
                        if(childScope.onLayerSave) {
                            childScope.onLayerSave = function (callback) {
                                onLayerSave(appService, view, callback);
                            };
                        }
                    }

                    function onLayerSave(appService, view, callback) {
                        var onSaveFn = 'on' + sS.capitalize(view) + 'Save';
                        if(appService[onSaveFn]) {
                            appService[onSaveFn](childScope, function() {
                                callback();
                            });
                        }
                    }
                    /** End of private methods **/
                }
            };
        }]);
})();