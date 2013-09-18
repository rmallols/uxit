describe('caret service', function () {

    var $rootScope, $scope, $compile, $httpBackend, sessionService, roleService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "$httpBackend", "sessionService", "roleService",
    function ($rootScope_, $compile_, $document_, $httpBackend_, sessionService_, roleService_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope, $document_);
        $httpBackend    = $httpBackend_;
        sessionService  = sessionService_;
        roleService     = roleService_;
    }]));

    describe('root element', function () {

        it('should have the content-editable attribute', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'});
            $rootScope.$digest();
            expect(contentEditableDirective.attr('content-editable')).toBe('');
        });

        it('should have the proper ng-model attribute', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'});
            $rootScope.$digest();
            expect(contentEditableDirective.attr('ng-model')).toBe('content');
        });
    });

    describe('actions area', function () {

        it('should have the actions area wrapper', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                actionsArea;
            $rootScope.$digest();
            actionsArea = $(' > .actionsArea', contentEditableDirective);
            expect(actionsArea.length).toBe(1);
        });

        it('should have the mediaPicker area wrapper', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                mediaPicker;
            $rootScope.$digest();
            mediaPicker = $(' > .actionsArea > .mediaPicker', contentEditableDirective);
            expect(mediaPicker.length).toBe(1);
        });

        xit('should have the actions area wrapper', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                actionsArea;
            $rootScope.$digest();
            actionsArea = $(' > .actionsArea', contentEditableDirective);
            expect(actionsArea.length).toBe(1);
        });
    });

    describe('editable area', function () {

        it('should have the editable area wrapper', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                editableArea;
            $rootScope.$digest();
            editableArea = $(' > .editableArea', contentEditableDirective);
            expect(editableArea.length).toBe(1);
        });

        it('should have the contenteditable element', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.length).toBe(1);
        });
    });

    describe('"editability" of the component', function () {

        it('should set the "editability" of the contenteditable element to false by default', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.attr('contenteditable')).toBe('false');
        });

        it('should set the "editability" of the contenteditable element to true if the user is logged as admin', function () {
            loadRoles($httpBackend, roleService, null);
            loadUserSession($httpBackend, sessionService, true, null);
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.attr('contenteditable')).toBe('true');
        });

        it('should set the "editability" of the contenteditable element to false if the user is logged as non admin', function () {
            loadRoles($httpBackend, roleService, null);
            loadUserSession($httpBackend, sessionService, true, null);
            var useSession = sessionService.getUserSession();
            useSession.role = 2;
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.attr('contenteditable')).toBe('false');
        });

        it('should set the "editability" of the contenteditable element to false if the user is logged as admin but the component is set as readonly', function () {
            loadRoles($httpBackend, roleService, null);
            loadUserSession($httpBackend, sessionService, true, null);
            var template =  '<div content-editable ng-model="content" readonly></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.attr('contenteditable')).toBe('false');
        });

        it('should set the "editability" of the contenteditable element to false if the user is logged as admin but the component is set as disabled', function () {
            loadRoles($httpBackend, roleService, null);
            loadUserSession($httpBackend, sessionService, true, null);
            var template =  '<div content-editable ng-model="content" disabled></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.attr('contenteditable')).toBe('false');
        });
    });

    describe('content of the component', function () {

        it('should set the proper content to the component', function () {
            var template    =  '<div content-editable ng-model="content"></div>',
                scope       =  { content: 'test content'},
                contentEditableDirective = $compile(template, scope),
                contentEditable;
            $rootScope.$digest();
            contentEditable = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            expect(contentEditable.text()).toBe(scope.content);
        });
    });

    describe('placeholder', function () {

        it('should define a placeholder element', function () {
            var template    =  '<div content-editable ng-model="content"></div>',
                scope       =  { content: 'test content'},
                contentEditableDirective = $compile(template, scope),
                placeholder;
            $rootScope.$digest();
            placeholder = $(' > .editableArea > .placeholder', contentEditableDirective);
            expect(placeholder.length).toBe(1);
        });

        it('should not show the placeholder element by default', function () {
            var template    =  '<div content-editable ng-model="content"></div>',
                scope       =  { content: 'test content'},
                contentEditableDirective = $compile(template, scope),
                placeholder;
            $rootScope.$digest();
            placeholder = $(' > .editableArea > .placeholder', contentEditableDirective);
            expect(placeholder.is(':visible')).toBe(false);
        });

        it('should not show the placeholder element if it\'s defined but the content is not empty', function () {
            var template    =  '<div content-editable ng-model="content" placeholder="Test placeholder"></div>',
                scope       =  { content: 'test content'},
                contentEditableDirective = $compile(template, scope),
                placeholder;
            $rootScope.$digest();
            placeholder = $(' > .editableArea > .placeholder', contentEditableDirective);
            expect(placeholder.is(':visible')).toBe(false);
        });

        it('should show the placeholder element if it\'s defined and the content is empty', function () {
            var template    =  '<div content-editable ng-model="content" placeholder="Test placeholder"></div>',
                scope       =  { content: ''},
                contentEditableDirective = $compile(template, scope),
                placeholder;
            $rootScope.$digest();
            placeholder = $(' > .editableArea > .placeholder', contentEditableDirective);
            expect(placeholder.is(':visible')).toBe(true);
        });

        it('should set the proper value to the placeholder', function () {
            var placeholderValue = 'Test placeholder',
                template    =  '<div content-editable ng-model="content" placeholder="' + placeholderValue + '"></div>',
                scope       =  { content: ''},
                contentEditableDirective = $compile(template, scope),
                placeholder;
            $rootScope.$digest();
            placeholder = $(' > .editableArea > .placeholder', contentEditableDirective);
            expect(trim(placeholder.text())).toBe('[' + placeholderValue + ']');
        });
    });
});