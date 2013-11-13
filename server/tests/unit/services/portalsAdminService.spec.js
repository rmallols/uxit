describe('dbService', function () {
    'use strict';

    var pAS, $scope;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$httpBackend", "portalsAdminService", "dbService",
    function ($rootScope,$httpBackend,  pAS_, dbS) {
        $scope = $rootScope.$new();
        pAS = pAS_;
        loadDatabases($httpBackend, dbS, null);
        pAS.view($scope);
    }]));

    describe('view', function() {

        iit('should set the proper config object', function() {
            expect($scope.config.multiSelectable).toBe(true);
            expect($scope.config.creatable).toBe(true);
            expect($scope.config.editable).toBe(true);
            expect($scope.config.deletable).toBe(true);
        });

        iit('should set the proper template', function() {
            expect($($scope.template).hasClass('columns large-25')).toBe(true);
        });

        iit('should set the proper edit panel length', function() {
            expect($scope.onEditPanels.length).toBe(1);
        });

        iit('should set the proper edit panel data', function() {
            expect($scope.onEditPanels[0].type).toBe('editDb');
            expect($scope.onEditPanels[0].view).toBe('editDb');
            expect($scope.onEditPanels[0].src).toBe('portalsAdmin');
            expect($scope.onEditPanels[0].appBridge).toBe(true);
        });
    });
});