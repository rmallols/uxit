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

        /**
         * Determines if the given string is empty or not
         *
         * @param   {string}    object  The string that is going to determine if it's empty or not
         * @returns {boolean}           True if the string is empty. False otherwise
         */
        function isEmpty(object) {
            return object === '' || object === null || object === undefined;
        }

        return {
            isObject: isObject,
            isEmpty: isEmpty
        };
    }]);
})();
