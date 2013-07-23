(function () {
    'use strict';
    COMPONENTS.factory('colService', ['$rootScope', 'arrayService', function ($rootScope, arrayService) {

        function normalizeEmptyCols(row) {
            for (var i = 0; i < row.columns.length; i += 1) {
                if (normalizeEmptyCol(row.columns, i)) { //If a col was normalized, start the process again
                    normalizeEmptyCols(row);
                }
            }
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

        function addEmptyCols(dropRow, dropCol, dropColIndex) {
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex);
            arrayService.add(dropRow.columns, getEmptyCol(), dropColIndex + 2);
            dropCol.size = dropCol.size -= 2;
        }

        function deleteColAndDependencies(columns, columnIndex) {
            var affectedCol = getAffectedCol(columns, columnIndex), availableWidth;
            if (affectedCol) {
                availableWidth = columns[columnIndex].size + affectedCol.size;
                affectedCol.size = availableWidth + 1;
            }
            arrayService.delete(columns, columnIndex);
            arrayService.delete(columns, columnIndex);
        }

        function getAffectedCol(columns, dropColIndex) {
            var affectedDropCol;
            affectedDropCol = getAffectedNextCol(columns, dropColIndex);
            if (!affectedDropCol) {
                affectedDropCol = getAffectedPrevCol(columns, dropColIndex);
            }
            return affectedDropCol;
        }

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

        function getEmptyCol() {
            return { size: 1, apps: [] };
        }

        function areSameCol(column1, column2) {
            return column1.$$hashKey === column2.$$hashKey;
        }

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