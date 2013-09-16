(function() {
    COMPONENTS.directive('selectMedia', ['i18nService', function (i18nService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'selectMedia.html',
            scope: {
                internalData    : '=',
                onChange        : '='
            },
            link: function link(scope) {

                scope.internalData.mediaSizes = [
                    { id: 'original',   text: i18nService('selectMedia.size.original') },
                    { id: 'small',      text: i18nService('selectMedia.size.small') },
                    { id: 'medium',     text:i18nService('selectMedia.size.medium') },
                    { id: 'big',        text: i18nService('selectMedia.size.big') }
                ];

                scope.propagateChanges = function (media) {
                    if (scope.onChange) { scope.onChange(media); }
                };

                scope.onMediaChange = function(media) {
                    scope.propagateChanges(media);
                };
            }
        };
    }]);
})();