(function () {
    'use strict';
    COMPONENTS.service('userListAppService', ['userService', function (userService) {

        function view(scope) {
        }

        function add(scope) {
        }

        function onAddSave(scope, callback) {

            setTimeout(function() {
                console.log("CH", scope.user);
            }, 2000)

            userService.createUser(scope.user, function () {
                callback();
            });
        }

        function edit(scope) {
        }

        return {
            view        : view,
            add         : add,
            onAddSave   : onAddSave,
            edit        : edit
        };
    }]);
})();
