COMPONENTS.directive('styles', ['mediaService', 'i18nService', 'constantsService', function (mS, i18nS, cS) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'styles.html',
        scope: {
            model   : '=styles',
            target  : '@'
        },
        controller: ['$scope', function($scope) {
            $scope.aligns = {
                vertical: [
                    { id: 'top',    text: i18nS('position.vertical.top') },
                    { id: 'center', text: i18nS('position.vertical.center') },
                    { id: 'bottom', text: i18nS('position.vertical.bottom') }
                ],
                horizontal: [
                    { id: 'left',   text: i18nS('position.horizontal.left') },
                    { id: 'center', text: i18nS('position.horizontal.center') },
                    { id: 'right',  text: i18nS('position.horizontal.right') }
                ]
            };
        }],
        link: function(scope) {

            scope.isPortalTarget = function() {
                return scope.target === cS.stylesTarget.portal;
            };

            scope.isAppTarget = function() {
                return scope.target === cS.stylesTarget.app;
            };

            scope.changeLogoId = function(selectedMedia) {
                if(selectedMedia) {
                    scope.model.logoId = selectedMedia._id;
                } else {
                    delete scope.model.logoId;
                }
            };

            if(scope.model && scope.model.logoId) {
                mS.getMedia(scope.model.logoId, null, function(media) {
                    scope.logo = media;
                });
            }


        }
    };
}]);
