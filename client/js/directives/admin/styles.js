COMPONENTS.directive('styles', ['mediaService', 'constantsService', function (mS, cS) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'styles.html',
        scope: {
            model   : '=styles',
            target  : '@'
        },
        link: function(scope) {

            scope.isPortalTarget = function() {
                return scope.target === cS.stylesTarget.portal;
            };

            scope.isAppTarget = function() {
                return scope.target === cS.stylesTarget.app;
            };

            if(scope.model.logoId) {
                mS.getMedia(scope.model.logoId, null, function(media) {
                    scope.logo = media;
                });
            }

            scope.changeLogoId = function(selectedMedia) {
                if(selectedMedia) {
                    scope.model.logoId = selectedMedia._id;
                } else {
                    delete scope.model.logoId;
                }
            };
        }
    };
}]);
