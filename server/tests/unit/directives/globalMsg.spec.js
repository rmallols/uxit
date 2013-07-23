describe('globalMsg directive', function () {

    var $rootScope, $scope, $compile, globalMsgService, globalMsgDirective, title, details;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$compile", "globalMsgService",
        function ($rootScope_, $compile_, globalMsgService_) {
            $rootScope = $rootScope_;
            $scope = $rootScope_.$new();
            $compile = $compile_;
            globalMsgService = globalMsgService_;
            globalMsgDirective = $compile('<div global-msg></div>')($scope);
            title = 'Testing title';
            details = 'Testing details';
        }]));

    it('should have the globalMsg Id', function () {
        expect(globalMsgDirective.attr('id')).toBe('globalMsg');
    });

    it('should not have the active class by default', function () {
        var isActive;
        $rootScope.$digest();
        isActive = globalMsgDirective.hasClass('active');
        expect(isActive).toBe(false);
    });

    it('should have the active class whenever the show service is invoked', function () {
        var isActive;
        globalMsgService.show(title, details);
        $rootScope.$digest();
        isActive = globalMsgDirective.hasClass('active');
        expect(isActive).toBe(true);
    });

    it('should have the proper title', function () {
        var directiveTitle;
        globalMsgService.show(title, details);
        $rootScope.$digest();
        directiveTitle = $(' > .text > label', globalMsgDirective).text();
        expect(directiveTitle).toBe(title);
    });

    it('should have the proper details', function () {
        var directiveDetails;
        globalMsgService.show(title, details);
        $rootScope.$digest();
        directiveDetails = $(' > .text > .details > label', globalMsgDirective).text();
        expect(directiveDetails).toBe(details);
    });

    it('should not show the details by default', function () {
        var childScope;
        globalMsgService.show(title, details);
        $rootScope.$digest();
        childScope = globalMsgDirective.scope();
        expect(childScope.isDetailsVisible).toBe(false);
    });

    it('should show the details once the details link is clicked', function () {
        var childScope, linkDomObj;
        globalMsgService.show(title, details);
        linkDomObj = $(' > .text > a', globalMsgDirective);
        linkDomObj.click();
        $rootScope.$digest();
        childScope = globalMsgDirective.scope();
        expect(childScope.isDetailsVisible).toBe(true);
    });

    it('should hide the details once the details link is clicked twice', function () {
        var childScope, linkDomObj;
        globalMsgService.show(title, details);
        linkDomObj = $(' > .text > a', globalMsgDirective);
        linkDomObj.click();
        linkDomObj.click();
        $rootScope.$digest();
        childScope = globalMsgDirective.scope();
        expect(childScope.isDetailsVisible).toBe(false);
    });
});