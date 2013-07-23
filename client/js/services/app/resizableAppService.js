(function () {
    'use strict';
    COMPONENTS.factory('resizableAppService', ['pageService', 'rowService', function (pageService, rowService) {

        var cols = rowService.getMaxSlots(), previousSize, resizingColumnScope, affectedColumn;

        /**
         * Triggers the resize event (mousedown)
         *
         * @param {object} resizingDomObj   The pointer to the DOM object that will be resized
         * @param {object} event            The mouse(down) event that has been triggered
         */
        function start(resizingDomObj, event) {
            var row = resizingDomObj.closest('.rows'), size = row.width() / cols;
            previousSize = resizingDomObj.width();
            resizingColumnScope = angular.element(resizingDomObj).scope();
            setAffectedColumn(resizingDomObj, event);
            resizingDomObj.resizable('option', 'grid', size);
        }

        /**
         * Executes the resize action
         *
         * @param {object} resizingDomObj   The pointer to the DOM object that is being resized
         */
        function resize(resizingDomObj) {
            var hasBeenReduced = resizingDomObj.width() < previousSize;
            if (affectedColumn) {
                setNewColSizes(hasBeenReduced);
            }
            previousSize = resizingDomObj.width(); //Update the previous size value
            resizingDomObj.removeAttr('style'); //Remove the style data added by the resizable plugin
            //Update the scope of the whole row so both the resizing and the affected cols changes will be executed
            resizingColumnScope.$parent.$apply();
            pageService.updateCurrentPage(null);
        }

        /** Private methods **/
        function setAffectedColumn(resizingDomObj, event) {
            var index = resizingColumnScope.$index;
            //noinspection JSUnresolvedVariable
            if (event.clientX > resizingDomObj.offset().left + resizingDomObj.width() / 2) { //Resize from east
                setNextAffectedColumn(index);
            } else { //Resize from west
                setPrevAffectedColumn(index);
            }
        }

        function setNextAffectedColumn(resizingColumnIndex) {
            var nextColumn = resizingColumnScope.$parent.row.columns[resizingColumnIndex + 1];
            affectedColumn = (shouldResizeNextColumn(resizingColumnIndex, nextColumn))
                ? nextColumn : resizingColumnScope.$parent.row.columns[resizingColumnIndex + 2];
        }

        function setPrevAffectedColumn(resizingColumnIndex) {
            var prevColumn = resizingColumnScope.$parent.row.columns[resizingColumnIndex - 1];
            affectedColumn = (shouldResizePrevColumn(resizingColumnIndex, prevColumn))
                ? prevColumn : resizingColumnScope.$parent.row.columns[resizingColumnIndex - 2];
        }

        function shouldResizePrevColumn(resizingColumnIndex, prevColumn) {
            return resizingColumnIndex === 1 || prevColumn.size > 1;
        }

        function shouldResizeNextColumn(resizingColumnIndex, nextColumn) {
            return resizingColumnIndex === resizingColumnScope.$parent.row.columns.length - 2 || nextColumn.size > 1;
        }

        function setNewColSizes(hasBeenReduced) {
            if (hasBeenReduced && resizingColumnScope.column.size > 1) { //Reduce resizing column
                resizingColumnScope.column.size = resizingColumnScope.column.size - 1;
                affectedColumn.size = affectedColumn.size + 1;
            } else if (affectedColumn.size > 1) { //Increase resizing column
                resizingColumnScope.column.size = resizingColumnScope.column.size + 1;
                affectedColumn.size = affectedColumn.size - 1;
            }
        }
        /** End private methods **/

        return {
            start: start,
            resize: resize
        };
    }]);
})();