(function() {
    COMPONENTS.directive('selectMedia', ['i18nService', function (i18nService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'selectMedia.html',
            scope: {
                mediaSize       : '=',
                config          : '=',
                onChange        : '&',
                onLayer         : '='
            },
            link: function link(scope) {

                scope.mediaSizes = [
                    { id: 'original',   text: i18nService('selectMedia.size.original') },
                    { id: 'small',      text: i18nService('selectMedia.size.small') },
                    { id: 'medium',     text:i18nService('selectMedia.size.medium') },
                    { id: 'big',        text: i18nService('selectMedia.size.big') }
                ];

                scope.propagateChanges = function (media) {
                    scope.onLayer.change(media, scope.mediaSize);
                    //if (scope.onChange) { scope.onChange({$data: media}); }
                };

                scope.onMediaChange = function($media) {
                    scope.propagateChanges($media);
                };
            }
        };
    }]);
})();