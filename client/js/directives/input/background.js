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
                        { id: 'top',    text: i18nS('editStyles.background.position.options.top.top') },
                        { id: 'center', text: i18nS('editStyles.background.position.options.top.center') },
                        { id: 'bottom', text: i18nS('editStyles.background.position.options.top.bottom') }
                    ],
                    left: [
                        { id: 'left',   text: i18nS('editStyles.background.position.options.left.left') },
                        { id: 'center', text: i18nS('editStyles.background.position.options.left.center') },
                        { id: 'right',  text: i18nS('editStyles.background.position.options.left.right') }
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
