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
            var hasOwnProperty = Object.prototype.hasOwnProperty; // Speed up calls to hasOwnProperty
            // null and undefined are empty
            if (object === null || object === undefined) return true;
            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (object.length && object.length > 0)    return false;
            if (object.length === 0)  return true;
            for (var key in object) {
                if (hasOwnProperty.call(object, key))    return false;
            }
            // Doesn't handle toString and toValue enumeration bugs in IE < 9
            return true;
        }

        return {
            isObject: isObject,
            isEmpty: isEmpty
        };
    }]);
})();
