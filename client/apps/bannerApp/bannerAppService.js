(function () {
    'use strict';
    COMPONENTS.service('bannerAppService', ['pageService', function (pageService) {

        function view(scope) {
            scope.onModelChange = function() {
                pageService.updateCurrentPage(null);
            }
        }

        return {
            view: view
        };
    }]);
})();
