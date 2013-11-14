describe('dbService', function () {
    'use strict';

    var pAS, $scope;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$httpBackend", "portalsAdminService", "dbService",
    function ($rootScope,$httpBackend,  pAS_, dbS) {
        $scope          = $rootScope.$new();
        $scope.model    = { name: 'testPortal' };
        pAS             = pAS_;
        loadDatabases($httpBackend, dbS, null);
    }]));

    describe('view', function() {

        beforeEach(function() {
            pAS.view($scope);
        });

        it('should set the proper config object', function() {
            expect($scope.config.multiSelectable).toBe(true);
            expect($scope.config.creatable).toBe(true);
            expect($scope.config.editable).toBe(true);
            expect($scope.config.deletable).toBe(true);
        });

        it('should set the proper template', function() {
            expect($($scope.template).hasClass('columns large-25')).toBe(true);
        });

        describe('edit panel', function() {

            it('should set the proper edit panel length', function() {
                expect($scope.onEditPanels.length).toBe(1);
            });

            it('should set the proper edit panel data', function() {
                expect($scope.onEditPanels[0].type).toBe('editDb');
                expect($scope.onEditPanels[0].view).toBe('editDb');
                expect($scope.onEditPanels[0].src).toBe('portalsAdmin');
                expect($scope.onEditPanels[0].appBridge).toBe(true);
            });
        });

        describe('create panel', function() {

            it('should set the proper create panel length', function() {
                expect($scope.onCreatePanels.length).toBe(1);
            });

            it('should set the proper edit panel data', function() {
                expect($scope.onCreatePanels[0].type).toBe('createDb');
                expect($scope.onCreatePanels[0].view).toBe('createDb');
                expect($scope.onCreatePanels[0].src).toBe('portalsAdmin');
                expect($scope.onCreatePanels[0].appBridge).toBe(true);
            });
        });
    });

    describe('editDb', function() {

        beforeEach(function() {
            pAS.editDb($scope);
        });

        it('should initialize the typedName variable', function() {
            expect($scope.model.typedName).not.toBeUndefined();
            expect($scope.model.typedName).toBe($scope.model.name);
        });
    });
});