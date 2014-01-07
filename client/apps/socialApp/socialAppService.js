(function () {
    'use strict';
    COMPONENTS.service('socialAppService', [function () {

        function view(scope) {
        }

        function edit(scope) {
            scope.internalData.iconSizes = [
                { id: 'small',  text: 'Small' },
                { id: 'medium', text: 'Medium' },
                { id: 'big',    text: 'Big' }
            ];
        }

        return {
            view: view,
            edit: edit
        };
    }]);
})();
