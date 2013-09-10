describe('checkbox directive', function () {

    var $rootScope, $scope, $compile, $timeout, compile, template, checkSelector, objectService;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "objectService", "$timeout",
    function ($rootScope_, $compile_, objectService_, $timeout_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $timeout        = $timeout_;
        objectService   = objectService_;
        compile         = compileFn($compile_, $scope);
        template        = '<div checkbox ng-model="ngModel" label="{{label}}"></div>';
        checkSelector   = ' > .check.icheckbox_square-blue';
    }]));

    it('should have a wrapping class', function () {
        var checkboxDirective = compile(template, {ngModel:'', label:''});
        expect(checkboxDirective.hasClass('checkContainer')).toBe(true);
    });

    it('should have an Id', function () {
        var checkboxDirective = compile(template, {ngModel:'', label:''});
        expect(objectService.isEmpty($('input', checkboxDirective).attr('id'))).toBe(false);
    });

    it('should have the proper stylesheet class', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:true, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        expect(wrapper.size()).toBe(1);
    });

    it('should mark as checked the component whenever the model is set to true', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:true, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        expect(wrapper.hasClass('checked')).toBe(true);
    });

    it('should mark as unchecked the component whenever the model is set to false', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        expect(wrapper.hasClass('checked')).toBe(false);
    });

    it('should mark as checked the component whenever the model is set to false but it\'s clicked afterwards', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        $('ins', checkboxDirective).click();
        expect(wrapper.hasClass('checked')).toBe(true);
    });

    it('should mark as unchecked the component whenever the model is set to true but it\'s clicked afterwards', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:true, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        $('ins', checkboxDirective).click();
        expect(wrapper.hasClass('checked')).toBe(false);
    });

    it('should mark as unchecked the component whenever the model is set to false but it\'s clicked afterwards twice', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        $('ins', checkboxDirective).click();
        $('ins', checkboxDirective).click();
        expect(wrapper.hasClass('checked')).toBe(false);
    });

    it('should mark as checked the component whenever the model is set to true but it\'s clicked afterwards twice', function () {
        var checkboxDirective, wrapper;
        checkboxDirective = compile(template, {ngModel:true, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        $('ins', checkboxDirective).click();
        $('ins', checkboxDirective).click();
        expect(wrapper.hasClass('checked')).toBe(true);
    });

    it('should display the label just after the checkbox', function () {
        var checkboxDirective, wrapper, labelObj;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        labelObj = wrapper.next();
        expect(labelObj.is('label')).toBe(true);
        expect(labelObj.attr('for') !== undefined).toBe(true);
    });

    it('should wire the label with the input', function () {
        var checkboxDirective, wrapper, labelObj;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        labelObj = wrapper.next();
        expect(labelObj.attr('for') === $('input', wrapper).attr('id')).toBe(true);
    });

    it('should use ng-show instead of ux-show to avoid problems with the ID of the scope', function () {
        var checkboxDirective, wrapper, labelObj;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        labelObj = wrapper.next();
        expect(labelObj.attr('ng-show') !== undefined).toBe(true);
        expect(labelObj.attr('ux-show') === undefined).toBe(true);
    });

    it('should nest labels avoid problems with the ID of the scope', function () {
        var checkboxDirective, wrapper, labelObj;
        checkboxDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, checkboxDirective);
        labelObj = wrapper.next();
        expect($(' > label', labelObj).size()).toBe(1);
    });
});