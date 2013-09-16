(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editGeneral', ['portalService', 'mediaService', function (portalService, mediaService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'editGeneral.html',
            scope: {
                model : '='
            },
            link: function link(scope) {

                scope.$watch('model.title', function () {
                    portalService.setHeader();
                });

                scope.level2Tabs = [
                    { title: 'editGeneral.general',     styleClass : 'settingsIcon' },
                    { title: 'editGeneral.app',         styleClass : 'appIcon' },
                    { title: 'editGeneral.comments',    styleClass : 'commentsIcon' },
                    { title: 'editGeneral.email',       styleClass : 'notificationsIcon' },
                    { title: 'editGeneral.analytics',   styleClass : 'statsIcon' }
                ];

                scope.defaultFaviconUrl = portalService.getDefaultFaviconUrl();

                mediaService.getMedia(scope.model.faviconId, null, function (favicon) {
                    scope.favicon = favicon;
                });

                scope.updateFavicon = function (newFavicon) {
                    scope.model.faviconId = newFavicon[0]._id;
                };
            }
        };
    }]);
})(window.COMPONENTS);
