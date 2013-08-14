(function () {
    'use strict';
    COMPONENTS.factory('rowService', ['arrayService', function (arrayService) {

        var maxSlots = 25;

        /**
         * Gets the total amount of slots available for each row
         *
         * @returns {number}
         */
        function getMaxSlots() {
            return maxSlots;
        }

        /**
         * Determines if there's available space in a row or not
         *
         * @param   {object}    dropRow         The row to be analyzed if there's available space or not
         * @param   {object}    dropCol         The col that is being dropped or not
         * @param   {object}    affectedDropCol The affected col of the dropped one
         * @returns {boolean}                   True if there's available space or not in the row
         */
        function isAvailableSpaceInRow(dropRow, dropCol, affectedDropCol) {
            return affectedDropCol || dropRow.columns.length === 1 || dropCol.apps.length > 1;
        }

        /**
         * Determines if a given row is empty or not
         *
         * @param   {object}    originalRow The row that is being to be analyzed
         * @returns {boolean}               True if the row is empty. False otherwise
         */
        function isOriginalRowEmpty(originalRow) {
            return originalRow.columns.length === 1 && originalRow.columns[0].apps.length === 0;
        }

        /**
         * Determines if a given row is empty or not
         *
         * @param   {object}    dropRow The row that is being to be analyzed
         * @returns {boolean}           True if the row is empty. False otherwise
         */
        function isDropRowEmpty(dropRow) {
            return dropRow.columns.length === 1 && dropRow.columns[0].apps.length === 1;
        }

        /**
         * Adds a row and an empty sibling row
         *
         * @param {object}  rows        The array with the rows where the new one is going to be placed
         * @param {number}  newRowPos   The position of the new row
         */
        function addRowAndDependencies(rows, newRowPos) {
            var newRow = {columns: [
                {size: 1,  apps: []}, {size: getMaxSlots() - 2, apps: [{ type: 'menuApp' }]}, {size: 1,  apps: []}
            ]};
            arrayService.add(rows, newRow, newRowPos);
            addEmptyRow(rows, newRowPos + 1);
        }

        /**
         * Adds an empty row on a given position
         *
         * @param {object}  rows            The array with the rows where the new one is going to be placed
         * @param {number}  dropRowIndex    The position of the new row
         */
        function addEmptyRow(rows, dropRowIndex) {
            arrayService.add(rows, getEmptyRow(), dropRowIndex);
        }

        /**
         * Gets the format of an empty row
         *
         * @returns {{columns: Array}}
         */
        function getEmptyRow() {
            return { columns: [{size: getMaxSlots(), apps: []}]};
        }

        /**
         * Deletes a row and the sibling empty one
         *
         * @param {object}  rows        The array with the rows where the given one is going to be deleted
         * @param {integer} rowIndex    The index of the row that is going to be deleted
         */
        function deleteRowAndDependencies(rows, rowIndex) {
            if(rows.length > 1) {
                arrayService.delete(rows, rowIndex);
            }
            if(rows.length > 1) {
                arrayService.delete(rows, rowIndex);
            }
        }

        return {
            getMaxSlots: getMaxSlots,
            isAvailableSpaceInRow: isAvailableSpaceInRow,
            isOriginalRowEmpty: isOriginalRowEmpty,
            isDropRowEmpty: isDropRowEmpty,
            addRowAndDependencies: addRowAndDependencies,
            addEmptyRow: addEmptyRow,
            getEmptyRow: getEmptyRow,
            deleteRowAndDependencies: deleteRowAndDependencies
        };
    }]);
})();