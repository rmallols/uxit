(function () {
    'use strict';
    COMPONENTS.factory('colService', ['$rootScope', 'rowService', 'arrayService',
    function ($rootScope, rowService, arrayService) {

        /**
         * Normalizes the structure of a given row
         *
         * @param {object} row  The row that is going to be normalized
         */
        function normalizeEmptyCols(row) {
            for (var i = 0; i < row.columns.length; i += 1) {
                if (normalizeEmptyCol(row.columns, i)) { //If a col was normalized, start the process again
                    normalizeEmptyCols(row);
                }
            }
        }

        /**
         * Adds empty columns as siblings of a given one
         *
         * @param {object}  dropRow      The row where the column where the empty columns are going to be added is
         * @param {object}  dropCol      The column where the empty columns are going to be added
         * @param {integer} dropColIndex The index of the column where the empty columns are going to be added
         */
        function addEmptyCols(dropRow, dropCol, dropColIndex) {
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex);
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex + 2);
            dropCol.size = dropCol.size -= 2;
        }

        /**
         * Deletes not only a given column but also its empty siblings
         *
         * @param {object}  columns     The array with the columns were the one that is going to be deleted is
         * @param {integer} columnIndex The index of the column that is going to be deleted
         */
        function deleteColAndDependencies(columns, columnIndex) {
            var affectedCol = getAffectedCol(columns, columnIndex), availableWidth;
            if (affectedCol) {
                availableWidth = columns[columnIndex].size + affectedCol.size;
                affectedCol.size = availableWidth + 1;
            }
            arrayService.delete(columns, columnIndex);
            arrayService.delete(columns, columnIndex);
            if(!affectedCol) { //If there's just one column alive, force it to fit all the available space in the row
                columns[0].size = rowService.getMaxSlots();
            }
        }

        /**
         * Gets the 'affected' column of a given one in order to apply actions such are sort or resize
         *
         * @param columns       The array with the columns were the one that is going to be targeted is
         * @param dropColIndex  The index of the column that is going to be targeted
         * @returns {object}    The 'affected' column
         */
        function getAffectedCol(columns, dropColIndex) {
            var affectedDropCol;
            affectedDropCol = getAffectedNextCol(columns, dropColIndex);
            if (!affectedDropCol) {
                affectedDropCol = getAffectedPrevCol(columns, dropColIndex);
            }
            return affectedDropCol;
        }

        /**
         * Gets the format of an empty column
         *
         * @returns {{size: number, apps: Array}} The empty column
         */
        function getEmptyCol() {
            return { size: 1, apps: [] };
        }

        /**
         * Determines if two columns are actually the same or not
         *
         * @param   {object}    column1 The first column to be analyzed
         * @param   {object}    column2 The second column to be analyzed
         * @returns {boolean}           True if both columns are the same. False otherwise
         */
        function areSameCol(column1, column2) {
            return column1.$$hashKey === column2.$$hashKey;
        }

        /** Private methods **/
        function getAffectedNextCol(columns, dropColIndex) {
            var affectedDropCol, i;
            for (i  = dropColIndex + 1; i < columns.length; i += 1) {
                if (columns[i].size >= 3) {
                    affectedDropCol = columns[i];
                    break;
                }
            }
            return affectedDropCol;
        }

        function getAffectedPrevCol(columns, dropColIndex) {
            var affectedDropCol, i;
            for (i  = dropColIndex - 1; i >= 0; i -= 1) {
                if (columns[i].size >= 3) {
                    affectedDropCol = columns[i];
                    break;
                }
            }
            return affectedDropCol;
        }

        function normalizeEmptyCol(cols, colIndex) {
            var col = cols[colIndex], nextCol = cols[colIndex + 1];
            if (col.apps.length === 0 && col.size > 1) {
                col.size = 1;
            }
            if (nextCol && col.apps.length === 0 && nextCol.apps.length === 0) {
                arrayService.delete(cols, colIndex);
                return true;
            }
            return null;
        }
        /** End private methods **/

        return {
            normalizeEmptyCols: normalizeEmptyCols,
            addEmptyCols: addEmptyCols,
            deleteColAndDependencies: deleteColAndDependencies,
            getAffectedCol: getAffectedCol,
            getEmptyCol: getEmptyCol,
            areSameCol: areSameCol
        };
    }]);
})();