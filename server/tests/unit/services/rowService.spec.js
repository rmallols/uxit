describe('rowService', function () {
    'use strict';
    var pageService, rowService, pages;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "pageService", "rowService",
    function ($rootScope, $compile, $httpBackend, _pageService, _rowService) {
        pageService = _pageService;
        rowService = _rowService;
        loadPages($httpBackend, pageService, function (loadedPages) {
            pages = loadedPages;
        });
    }]));

    describe('isOriginalRowEmpty', function () {
        it('should mark an empty original row as empty, if case', function () {
            expect(rowService.isOriginalRowEmpty(pages[0].rows[0])).toBe(true);
            expect(rowService.isOriginalRowEmpty(pages[0].rows[1])).toBe(false);
        });
    });

    describe('isDropRowEmpty', function () {
        it('should mark an empty drop row as empty, if case', function () {
            expect(rowService.isDropRowEmpty(pages[0].rows[0])).toBe(false);
            expect(rowService.isDropRowEmpty(pages[0].rows[1])).toBe(false);
        });
    });

    describe('addRowAndDependencies', function () {
        it('should add a new row and dependencies', function () {
            var originalRowsSize = pages[0].rows.length, newRowsSize;
            rowService.addRowAndDependencies(pages[0].rows, 1);
            newRowsSize = pages[0].rows.length;
            expect(newRowsSize).toBe(originalRowsSize + 2); //The new row and an empty one should be added
        });
    });

    describe('addEmptyRow', function () {
        it('should add a new row and dependencies', function () {
            var originalRowsSize = pages[0].rows.length, newRowsSize, newRowPos = 1;
            rowService.addEmptyRow(pages[0].rows, newRowPos);
            newRowsSize = pages[0].rows.length;
            expect(newRowsSize).toBe(originalRowsSize + 1);
            expect(pages[0].rows[newRowPos].columns.length).toBe(1);
            expect(pages[0].rows[newRowPos].columns[0].size).toBe(rowService.getMaxSlots());
        });
    });

    describe('getEmptyRow', function () {
        it('should get the proper format of an empty row', function () {
            var emptyRow = rowService.getEmptyRow();
            expect(emptyRow.columns.length).toBe(1);
            expect(emptyRow.columns[0].size).toBe(rowService.getMaxSlots());
            expect(emptyRow.columns[0].apps.length).toBe(0);
        });
    });

    describe('deleteRowAndDependencies', function () {
        it('should delete a given row and its dependencies', function () {
            var originalRowsSize = pages[0].rows.length, newRowsSize;
            rowService.deleteRowAndDependencies(pages[0].rows, 1);
            newRowsSize = pages[0].rows.length;
            //The deleted row and its sibling empty one should be deleted
            expect(newRowsSize).toBe(originalRowsSize - 2);
        });
    });
});