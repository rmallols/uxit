(function () {
    'use strict';

    COMPONENTS.factory('objectService', [function () {

        /**
         * Determines if a given item is an object or not
         *
         * @param   {*}         item    The element that is going to be analyzed if it's an object or not
         * @returns {boolean}           True if the given element is an object, False otherwise
         */
        function isObject(item) {
            return typeof(item) === 'object';
        }

        return {
            isObject: isObject
        };
    }]);
})();
