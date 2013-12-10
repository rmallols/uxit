(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('editGeneral', ['$location', 'portalService', 'mediaService', 'metaService',
    'i18nService',
    function ($location, portalService, mediaService, metaService, i18nService) {
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
                    { title: 'editGeneral.analytics',   styleClass : 'statsIcon' },
                    { title: 'editGeneral.migration',   styleClass : 'migrationIcon' }
                ];

                scope.defaultFaviconUrl = metaService.getDefaultFaviconUrl();

                mediaService.getMedia(scope.model.faviconId, null, function (favicon) {
                    scope.favicon = favicon;
                });

                scope.updateFavicon = function (newFavicon) {
                    scope.model.faviconId = newFavicon[0]._id;
                };

                scope.onImportedPortal = function() {
                    $location.search().message = i18nService('editGeneral.migration.import.success');
                    $location.search().type = 1;
                    $location.path($location.path());
                    window.open($location.url(), '_self');
                };
            }
        };
    }]);
})(window.COMPONENTS);
