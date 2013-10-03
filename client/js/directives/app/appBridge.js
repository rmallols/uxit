(function () {
    'use strict';
    COMPONENTS.directive('appBridge', ['$injector', '$compile', 'stringService', function ($injector, $compile, sS) {
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
                    console.log("OOOUT", scope.src, scope.view);

                    setTimeout(function() {
                        console.log("OOOUT2", scope.src, scope.view);



                        var appService, appContent = $('<div ng-include="templateId"></div>');
                        if(scope.src && scope.view) {
                            console.log("IIIN!!")
                            appService = $injector.get(scope.src + 'Service');
                            scope.templateId = scope.src + sS.capitalize(scope.view) + '.html';
                            element.html(appContent);
                            $compile(appContent)(scope);
                            appService.view(scope);
                        }

                        scope.$apply();
                    }, 1000)
                }
            };
        }]);
})();