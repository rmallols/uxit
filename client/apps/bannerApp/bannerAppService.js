(function () {
    'use strict';
    COMPONENTS.service('bannerAppService', ['pageService', function (pageService) {

        function view(scope) {
            scope.onModelChange = function() {
                pageService.updateCurrentPage(null);
            };
        }

        function edit(scope) {
            scope.gridSizes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
        }

        return {
            view: view,
            edit: edit
        };
    }]);
})();
