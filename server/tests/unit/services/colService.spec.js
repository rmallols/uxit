describe('colService', function () {
    'use strict';
    var pageService, colService, targetRow, targetCol;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "pageService", "colService",
    function ($rootScope, $compile, $httpBackend, _pageService, _colService) {
        pageService = _pageService;
        colService = _colService;
        loadPages($httpBackend, pageService, function (loadedPages) {
            targetRow = loadedPages[1].rows[1];
            targetCol = targetRow.columns[1];
        });
    }]));

    describe('addEmptyCols', function () {
        it('should add two sibling cols (prev and next) to a given one', function () {
            var originalColSize = targetRow.columns.length, newColSize;
            colService.addEmptyCols(targetRow, targetCol, 1);
            newColSize = targetRow.columns.length;
            expect(newColSize).toBe(originalColSize + 2); //2 new columns should be added
        });
    });

    describe('deleteColAndDependencies', function () {
        it('should delete a given column and its two sibling cols (prev and next)', function () {
            var originalColSize = targetRow.columns.length, newColSize;
            colService.deleteColAndDependencies(targetRow.columns, 1);
            newColSize = targetRow.columns.length;
            expect(newColSize).toBe(originalColSize - 2); //2 columns should be deleted
        });
    });

    describe('getAffectedCol', function () {
        it('should get the affected col of a given one', function () {
            var affectedCol = colService.getAffectedCol(targetRow.columns, 1);
            expect(affectedCol).not.toBe(undefined); //If the col is not alone in the row, it should be a affected col
            expect(affectedCol.size).toBe(11);
            expect(affectedCol.apps.length).toBe(1);
        });
    });

    describe('getEmptyCol', function () {
        it('should get the proper structure of an empty col', function () {
            var emptyCol = colService.getEmptyCol();
            expect(emptyCol.size).toBe(1);
            expect(emptyCol.apps.length).toBe(0);
        });
    });
});