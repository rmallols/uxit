COMPONENTS.directive('editLanguage', ['i18nService', function (i18nService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editLanguage.html',
        scope: {
            language    : '=model',
            onLayer     : '='
        },
        link: function link(scope) {
            scope.onLayer.save = function (callback) {
                i18nService.updateLanguage(scope.language, function (result) {
                    callback(result);
                });
            };
        }
    };
}]);