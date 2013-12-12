describe('listService', function () {
    'use strict';
    var $scope, listService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "listService", function ($rootScope, listService_) {
        $scope = $rootScope.$new();
        listService = listService_;
    }]));

    describe('getDefaultValue', function() {

        describe('pageSize', function() {

            it('Should get the system default page size value ' +
                'if it has not been explicitly overwritten ', function() {
                var config = {},
                    defVal = listService.getDefaultValue('pageSize', config);
                expect(defVal).toBe(10);
            });

            it('Should get the custom default page size value ' +
                'if it has been explicitly overwritten ', function() {
                var config = { pageSize: 20 },
                    defVal = listService.getDefaultValue('pageSize', config);
                expect(defVal).toBe(config.pageSize);
            });
        });

        describe('skip', function() {

            it('Should get the system default skip value ' +
                'if it has not been explicitly overwritten ', function() {
                var config = {},
                    defVal = listService.getDefaultValue('skip', config);
                expect(defVal).toBe(0);
            });

            it('Should get the custom default skip value ' +
                'if it has been explicitly overwritten ', function() {
                var config = { skip: 5 },
                    defVal = listService.getDefaultValue('skip', config);
                expect(defVal).toBe(config.skip);
            });
        });

        describe('pageActionPos', function() {

            it('Should get the system default page action pos value ' +
                'if it has not been explicitly overwritten ', function() {
                var config = {},
                    defVal = listService.getDefaultValue('pageActionPos', config);
                expect(defVal).toBe(2);
            });

            it('Should get the custom default page action pos value ' +
                'if it has been explicitly overwritten ', function() {
                var config = { pageActionPos: 1 },
                    defVal = listService.getDefaultValue('pageActionPos', config);
                expect(defVal).toBe(config.pageActionPos);
            });
        });

        describe('searchable', function() {

            it('Should get the system default searchable value ' +
                'if it has not been explicitly overwritten ', function() {
                var config = {},
                    defVal = listService.getDefaultValue('searchable', config);
                expect(defVal).toBe(true);
            });

            it('Should get the custom default searchable value ' +
                'if it has been explicitly overwritten ', function() {
                var config = { searchable: false },
                    defVal = listService.getDefaultValue('searchable', config);
                expect(defVal).toBe(config.searchable);
            });
        });

        describe('sort', function() {

            it('Should get the system default sort value ' +
                'if it has not been explicitly overwritten ', function() {
                var config = {},
                    defVal = listService.getDefaultValue('sort', config);
                expect(defVal.field).toBe('create.date');
                expect(defVal.order).toBe('1');
            });

            it('Should get the custom default sort value ' +
                'if it has been explicitly overwritten ', function() {
                var config = { sort: { field: 'update.date', order: '-1' }},
                    defVal = listService.getDefaultValue('sort', config);
                expect(defVal.field).toBe(config.sort.field);
                expect(defVal.order).toBe(config.sort.order);
            });
        });
    });

    describe('setDetailId', function() {

        it('Should get the given id value to the given scope as the "detailId" attribute ', function() {
            var detailId = '012345';
            listService.setDetailId($scope, detailId);
            expect($scope.detailId).toBe(detailId);
        });
    });
});