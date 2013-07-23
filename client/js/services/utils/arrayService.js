(function (Array) {
    'use strict';

    COMPONENTS.factory('arrayService', [function () {

        /**
         * Determines if the type of the given object is an array or not
         *
         * @param   {object}    obj The object to be analyzed
         * @returns {boolean}       True if the the type of the object is an array. Fanse otherwise
         */
        function isArray(obj) {
            return obj instanceof Array;
        }

        /**
         *  Adds an element to an array
         *
         * @param   {Array} array   The target array where the new item is going to be added
         * @param   {*}     element The new item that is going to be added
         * @param   {int}   index   The position where the new item is going to be added
         * @returns {Array}         The input array with the new item already added to it
         */
        function add(array, element, index) {
            array.splice(index, 0, element);
            return array;
        }

        /**
         * Copies totally or partially a given array
         *
         * @param   {Array} sourceArray The array that is being to be copied
         * @param   {int}   startIndex  From which position (optional) the source array is going to be copied
         * @param   {int}   length      The number of array items that are going to be copied
         * @returns {Array}             The copied array
         */
        function copy(sourceArray, startIndex, length) {
            var destArray = [], i;
            startIndex = startIndex || 0;
            length = length || sourceArray.length;
            for (i = startIndex; i < startIndex + length; i += 1) {
                destArray.push(sourceArray[i]);
            }
            return destArray;
        }

        /**
         * Moves an item of a given array
         *
         * @param {Array}   array       The array that contains the item that is going to be moved
         * @param {int}     oldIndex    The original position of the item
         * @param {int}     newIndex    The target position of the item
         * @returns {Array}             The array with the already moved item
         */
        function move(array, oldIndex, newIndex) {
            if (newIndex >= array.length) {
                var k = newIndex - array.length;
                while ((k -= 1) + 1) {
                    array.push(undefined);
                }
            }
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
            return array;
        }

        /**
         * Removes an item from a given array
         *
         * @param   {Array} array   The array that contains the item that is going to be removed
         * @param   {int}   index   The index position that is going to be removed
         * @returns {Array}         The array without the item in the removed index position
         */
        function remove(array, index) {
            array.splice(index, 1);
            return array;
        }

        return {
            isArray: isArray,
            add: add,
            copy: copy,
            move: move,
            delete: remove
        };
    }]);
})(window.Array);
