(function () {
    'use strict';
    COMPONENTS.service('userListAppService', [function () {

        function view(scope) {
        }

        function add(scope) {
            scope.onLayerSave = function (callback) {
                userService.createUser(scope.user, function () {
                    callback();
                });
            };
        }

        function edit(scope) {
        }

        return {
            view    : view,
            add     : add,
            edit    : edit
        };
    }]);
})();
