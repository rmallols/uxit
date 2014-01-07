(function() {
    'use strict';
    COMPONENTS.directive('backgroundImage', ['mediaService', function (mediaService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'backgroundImage.html',
            scope: {
                background: '=ngModel'
            },
            link: function link(scope) {

                scope.position = {
                    top: [
                        { id: 'top',    text: 'Topxxx' },
                        { id: 'center', text: 'Centerxxx' },
                        { id: 'bottom', text: 'Bottomxxx' }
                    ],
                    left: [
                        { id: 'left',   text: 'Leftxxx' },
                        { id: 'center', text: 'Centerxxx' },
                        { id: 'right',  text: 'Rightxxx' }
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
            }
        };
    }]);
})();
