(function () {
    'use strict';
    COMPONENTS.factory('rowService', ['arrayService', function (arrayService) {

        var maxSlots = 25;

        function getMaxSlots() {
            return maxSlots;
        }

        function isAvailableSpaceInRow(dropRow, dropCol, affectedDropCol) {
            return affectedDropCol || dropRow.columns.length === 1 || dropCol.apps.length > 1;
        }

        function isOriginalRowEmpty(originalRow) {
            return originalRow.columns.length === 1 && originalRow.columns[0].apps.length === 0;
        }

        function isDropRowEmpty(dropRow) {
            return dropRow.columns.length === 1 && dropRow.columns[0].apps.length === 1;
        }

        function addRowAndDependencies(rows, newRowPos) {
            var newRow = {columns: [
                {size: 1,  apps: []}, {size: getMaxSlots() - 2, apps: [{ type: 'menuApp' }]}, {size: 1,  apps: []}
            ]};
            arrayService.add(rows, newRow, newRowPos);
            addEmptyRow(rows, newRowPos + 1);
        }

        function addEmptyRow(rows, dropRowIndex) {
            arrayService.add(rows, getEmptyRow(), dropRowIndex);
        }

        function getEmptyRow() {
            return { columns: [{size: getMaxSlots(), apps: []}]};
        }

        function deleteRowAndDependencies(rows, rowIndex) {
            arrayService.delete(rows, rowIndex);
            arrayService.delete(rows, rowIndex);
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