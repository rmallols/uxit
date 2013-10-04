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

                    scope.$watch('src', function(src) {
                        if(src && scope.view) {
                            executeServiceMethod(src, scope.view)
                        }
                    });

                    /** Private methods **/
                    function executeServiceMethod(src, view) {
                        manageServiceFns(src, view);
                        compileTemplate(src, view);
                    }

                    function compileTemplate(src, view) {

                        console.log("ALERTA!!! la idea de trabajar con template cache puede ser buena para así compilarlo con el scope que nos de la gana " +
                            "y enviar ese mismo scope a los servicios. Parece que funciona, aunque, para mayor limpieza, seguramente todas estas operaciones" +
                            "se deberían hacer sobre un nuevo scope con .$new() para que cada layer tuviera su propio scope y no trabajar directamente con el raiz")


                        var templateId = src + sS.capitalize(view) + '.html',
                            appElm = $($templateCache.get(templateId));



                        element.html(appElm);
                        $compile(appElm)(scope);
                        return appElm;
                    }

                    function manageServiceFns(src, view) {
                        $timeout(function() {
                            var appService = $injector.get(src + 'Service');
                            defineOnLayerSaveFn(appService, scope, view);
                            if(appService[view]) {
                                appService[view](scope);
                            }
                        })
                    }

                    function defineOnLayerSaveFn(appService, appScope, view) {
                        if(scope.onLayerSave) {
                            scope.onLayerSave = function (callback) {
                                onLayerSave(appService, appScope, view, callback);
                            };
                        }
                    }

                    function onLayerSave(appService, appScope, view, callback) {
                        var onSaveFn = 'on' + sS.capitalize(view) + 'Save';
                        if(appService[onSaveFn]) {
                            appService[onSaveFn](appScope, function() {
                                callback();
                            });
                        }
                    }
                    /** End of private methods **/
                }
            };
        }]);
})();