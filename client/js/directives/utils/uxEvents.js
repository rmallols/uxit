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
        events = ['change', 'keyup'];
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