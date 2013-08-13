(function () {
    'use strict';
    COMPONENTS.factory('sortableAppService', ['$rootScope', '$timeout', 'portalService', 'pageService', 'rowService', 'colService', 'arrayService', 'keyboardService',
    function ($rootScope, $timeout, portalService, pageService, rowService, colService, arrayService, keyboardService) {

        var originalElm, isUpdateBlocked = false, options;

        /**
         * Triggers the sort event
         *
         * @param {object} ui   The object that holds the information about the item that will be sorted
         */
        function start(ui) {
            $('html').addClass('sorting');
            originalElm = $(ui.item).parent();
            isUpdateBlocked = !$(ui.item).hasClass('new');
            registerKeyboardEvents();
        }

        /**
         * Executes the update action
         *
         * @param {object} ui   The object that holds the information about the item that will be sorted
         */
        function update(ui) {
            var rows = $rootScope.portal.template.rows;
            setOptions(rows, originalElm, $(ui.item));
            if (isUpdateTime()) {
                updateIfThereIsSpace();
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }
            isUpdateBlocked = false;
        }

        /**
         * Finishes the sort event
         *
         */
        function stop() {
            unregisterKeyboardEvents();
            $('html').removeClass('sorting');
        }

        /** Private methods **/
        function isUpdateTime() {
            return colService.areSameCol(options.originalCol, options.dropCol) || !isUpdateBlocked || options.isNewItem;
        }

        function registerKeyboardEvents() {
            keyboardService.register('esc', 'sortableApp', function () {
                $('[sortable-app]').trigger('mouseup');
            });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', 'sortableApp');
        }

        function updateIfThereIsSpace() {
            if (!rowService.isAvailableSpaceInRow(options.dropRow, options.dropCol, options.affectedDropCol)) {
                blockUpdate();
            } else {
                $timeout(function () {
                    executeUpdate();
                }, 0);
            }
        }

        function setOptions(rows, originalElm, droppedElm) {
            options = {};
            options.isNewItem           = droppedElm.attr('sortable-add-app') !== undefined;
            options.rows                = rows;
            options.droppedElm          = droppedElm;
            options.originalColIndex    = originalElm.closest('.columns').prevAll('.columns').size();
            options.dropColIndex        = droppedElm.closest('.columns').prevAll('.columns').size();
            options.originalRowIndex    = originalElm.closest('.rows').prevAll('.rows').size();
            options.originalAppIndex    = originalElm.prevAll('.app').size();
            options.dropRowIndex        = droppedElm.closest('.rows').prevAll('.rows').size();
            options.dropAppIndex        = droppedElm.prevAll('.app').size();
            //options.originalRow         = options.rows[options.originalRowIndex];
            options.originalRow         = originalElm.closest('.rows').scope().row;
            //options.dropRow             = options.rows[options.dropRowIndex];
            options.dropRow             = droppedElm.closest('.rows').scope().row;
            options.dropCol             = options.dropRow.columns[options.dropColIndex];
            options.originalCol         = options.originalRow.columns[options.originalColIndex];
            options.elmHasChangedRow    = options.originalRow.$$hashKey !== options.dropRow.$$hashKey;
            options.affectedDropCol     = colService.getAffectedCol(options.dropRow.columns, options.dropColIndex);
            options.affectedOriginalCol = (options.elmHasChangedRow)
                ? colService.getAffectedCol(options.originalRow.columns, options.originalColIndex)
                : options.affectedDropCol;
            console.log("x0", options.originalRow, options.originalColIndex)
            return options;
        }

        function blockUpdate() {
            deleteNewDroppedElm(options.dropCol, options.droppedElm, options.dropAppIndex);
            $timeout(function () { //It's necessary to delete the dropped item in a new thread
                arrayService.delete(options.dropCol.apps, options.dropAppIndex);
            });
        }

        function executeUpdate() {
            console.log("updating2...");
            if (options.isNewItem) { //That's a new item that comes from drag and drop
                deleteNewDroppedElm(options.dropCol, options.droppedElm, options.dropAppIndex);
            }
            updateConsideringRowChange(); //New and / or old column were empty -> resize is required
            decorateDropRow(); //New column handling
            //For some reason, in some cases the dragging app is not deleted, so it's necessary to explicitly delete it
            deleteGhostApp();
            pageService.updateCurrentPage(null);
            portalService.savePortal(null);
        }

        function updateConsideringRowChange() {
            if (options.isNewItem || options.dropCol.apps.length === 1 || options.originalCol.apps.length === 0) {
                if (options.isNewItem || options.elmHasChangedRow) {
                    updateWithRowChange();
                } else {
                    updateWithoutRowChange();
                }
            }
        }

        function updateWithRowChange() {
            if (rowService.isDropRowEmpty(options.dropRow)) {
                addEmptyRows();
            }
            if (options.affectedDropCol && options.dropCol.apps.length > 0) {
                updateWithRowChangeNonEmptyOriginalColumn();
            } else if (options.affectedOriginalCol) {
                updateWithRowChangeEmptyOriginalColumn();
            }
        }

        function updateWithRowChangeEmptyOriginalColumn() {
            var availableWidth = options.affectedOriginalCol.size + options.originalCol.size;
            options.affectedOriginalCol.size = availableWidth + 1;
        }

        function updateWithRowChangeNonEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.affectedDropCol.size;
            options.dropCol.size = Math.ceil(availableWidth / 2) + 1;
            options.affectedDropCol.size = Math.floor(availableWidth / 2) - 1;
            if (options.affectedOriginalCol && !options.originalCol.apps.length) {
                availableWidth = options.affectedOriginalCol.size + options.originalCol.size;
                options.affectedOriginalCol.size = availableWidth + 1;
            }
        }

        function updateWithoutRowChange() {
            if (options.affectedDropCol && options.originalCol.apps.length) {  //The old column not is empty!!
                updateWithoutRowChangeNonEmptyOriginalColumn();
            } else { //The old column is empty!!
                updateWithoutRowChangeEmptyOriginalColumn();
            }
        }

        function updateWithoutRowChangeEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.originalCol.size;
            options.dropCol.size = availableWidth + 1;
        }

        function updateWithoutRowChangeNonEmptyOriginalColumn() {
            var availableWidth = options.dropCol.size + options.affectedDropCol.size;
            if (options.affectedDropCol.$$hashKey !== options.dropCol.$$hashKey) {
                options.dropCol.size = Math.ceil(availableWidth / 2) + 1;
                options.affectedDropCol.size = Math.floor(availableWidth / 2) - 1;
            }
        }

        function addEmptyRows() {
            rowService.addEmptyRow(options.rows, options.dropRowIndex);
            rowService.addEmptyRow(options.rows, options.dropRowIndex + 2);
            //If the two new rows were added before the original row is,
            //it's necessary to increase the pointer to the original row index as well
            if (options.dropRowIndex < options.originalRowIndex) {
                options.originalRowIndex += 2;
            }
        }

        function decorateDropRow() {
            if (options.dropCol.apps.length === 1) { //There's just the new dropped item
                colService.addEmptyCols(options.dropRow, options.dropCol, options.dropColIndex);
            }
            colService.normalizeEmptyCols(options.originalRow);
            if (rowService.isOriginalRowEmpty(options.originalRow)) {
                rowService.deleteRowAndDependencies(options.rows, options.originalRowIndex);
            }
        }

        function deleteGhostApp() {
            if ((options.droppedElm.siblings('[app]:not(:empty)').size() + 1) > options.dropCol.apps.length) {
                options.droppedElm.remove();
            }
        }

        function deleteNewDroppedElm(dropCol, droppedElm, dropAppIndex) {
            dropCol.apps.forEach(function (item, index) {
                if (!item) {
                    arrayService.delete(dropCol.apps, index);
                }
            });
            arrayService.add(dropCol.apps, { type: droppedElm.attr('type') }, dropAppIndex);
            droppedElm.remove();
        }
        /** End private methods **/

        return {
            start: start,
            update: update,
            stop: stop
        };
    }]);
})();