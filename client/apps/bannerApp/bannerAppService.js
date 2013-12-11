(function () {
    'use strict';
    COMPONENTS.service('bannerAppService', ['pageService', function (pageService) {

        function view(scope) {
            scope.onModelChange = function() {
                pageService.updateCurrentPage(null);
            };
        }

        function edit(scope) {
            scope.gridSizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        }

        return {
            view: view,
            edit: edit
        };
    }]);
})();
