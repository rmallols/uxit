(function() {
    'use strict';
    COMPONENTS.directive('background', ['mediaService', 'objectService', 'i18nService',
    function (mediaService, objectService, i18nS) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'background.html',
            scope: {
                background: '=ngModel'
            },
            link: function link(scope) {

                scope.position = {
                    top: [
                        { id: 'top',    text: i18nS('position.vertical.top') },
                        { id: 'center', text: i18nS('position.vertical.center') },
                        { id: 'bottom', text: i18nS('position.vertical.bottom') }
                    ],
                    left: [
                        { id: 'left',   text: i18nS('position.horizontal.left') },
                        { id: 'center', text: i18nS('position.horizontal.center') },
                        { id: 'right',  text: i18nS('position.horizontal.right') }
                    ]
                };

                if(!scope.background) {
                    scope.background = {
                        position: {
                            top : scope.position.top[0].id,
                            left: scope.position.left[0].id
                        }
                    };
                }

                if(scope.background.src) {
                    mediaService.getMedia(scope.background.src, null, function(media) {
                        scope.backgroundSrc = media;
                    });
                }

                scope.changeMediaId = function(selectedMedia) {
                    if(selectedMedia) {
                        scope.background.src = selectedMedia._id;
                    } else {
                        delete scope.background.src;
                    }
                };

                scope.existsSrc = function() {
                    return !objectService.isEmpty(scope.backgroundSrc);
                };
            }
        };
    }]);
})();
