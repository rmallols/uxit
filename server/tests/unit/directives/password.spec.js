describe('password directive', function () {

    var $rootScope, $scope, $compile, $timeout, compile, template, objectService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "objectService", "$timeout",
    function ($rootScope_, $compile_, $document_, objectService_, $timeout_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $timeout        = $timeout_;
        compile         = compileFn($compile_, $scope, $document_);
        template        = '<input password ng-model="user.password" click-to-change="clickToChangePassword" />';
    }]));

    describe('DOM structure', function() {

        it('should have the link to switch the password change as a direct child of the root element', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: false});
            $rootScope.$digest();
            expect($(' > a', passwordDirective).length).toBe(1);
        });

        it('should have a single password input to set the password as a direct child of the root element', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: false});
            $rootScope.$digest();
            expect($('input[type="password"]', passwordDirective).length).toBe(1);
        });

        it('should have the password mandatory validation attribute', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: false});
            $rootScope.$digest();
            expect($('input[type="password"]', passwordDirective).attr('password-mandatory')).not.toBe(undefined);
        });

        it('should have the ng-model attribute', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: false});
            $rootScope.$digest();
            expect($('input[type="password"]', passwordDirective).attr('ng-model')).not.toBe(undefined);
        });
    });

    describe('DOM visibility', function() {

        it('should not show the click to change stuff (and show the input) if it has not been explicitly defined', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: false});
            $rootScope.$digest();
            expect($('> a', passwordDirective).is(':visible')).toBe(false);
            expect($('input[type="password"]', passwordDirective).is(':visible')).toBe(true);
        });


        it('should show the click to change stuff (and hide the input) if it has been explicitly defined', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: true});
            $rootScope.$digest();
            expect($('> a', passwordDirective).is(':visible')).toBe(true);
            expect($('input[type="password"]', passwordDirective).is(':visible')).toBe(false);
        });

        it('should show the password change label by default if it has been explicitly defined', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: true});
            $rootScope.$digest();
            expect($('> a > label.change', passwordDirective).is(':visible')).toBe(true);
            expect($('> a > label.cancelChanges', passwordDirective).is(':visible')).toBe(false);
        });
    });

    describe('DOM visibility changes', function() {

        it('should show the cancel password  changes label if it has been explicitly defined and it\'s active', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: true});
            $rootScope.$digest();
            $('> a', passwordDirective).click();
            expect($('> a > label.change', passwordDirective).is(':visible')).toBe(false);
            expect($('> a > label.cancelChanges', passwordDirective).is(':visible')).toBe(true);
        });

        it('should show the password input if the change has been explicitly defined and it\'s active', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: true});
            $rootScope.$digest();
            $('> a', passwordDirective).click();
            expect($('input[type="password"]', passwordDirective).is(':visible')).toBe(true);
        });

        it('should revert to the original state if the change has been explicitly defined and it\'s not active anymore', function () {
            var passwordDirective = compile(template, {user:{ password: ''}, clickToChangePassword: true});
            $rootScope.$digest();
            $('> a', passwordDirective).click();
            $('> a', passwordDirective).click();
            expect($('> a > label.change', passwordDirective).is(':visible')).toBe(true);
            expect($('> a > label.cancelChanges', passwordDirective).is(':visible')).toBe(false);
        });
    });
});