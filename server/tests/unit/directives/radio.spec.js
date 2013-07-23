describe('radio directive', function () {
    'use strict';
    var $rootScope, $scope, $compile, $timeout, compile, template, checkSelector, stringService;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "stringService", "$timeout",
    function ($rootScope_, $compile_, stringService_, $timeout_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $timeout        = $timeout_;
        stringService   = stringService_;
        compile         = compileFn($compile_, $scope);
        template        =   '<div radio ng-model="ngModel" label="{{label}}" value="v1" name="bla"></div>' +
                            '<div radio ng-model="ngModel" label="{{label}}" value="v2" name="bla"></div>' +
                            '<div radio ng-model="ngModel" label="{{label}}" value="v3" name="bla"></div>';
        checkSelector   = ' > .check.iradio_square-blue';
    }]));

    it('should have a wrapping class', function () {
        var radioDirective = compile(template, {ngModel:'', label:''});
        expect(radioDirective.hasClass('checkContainer')).toBe(true);
    });

    it('should have an Id', function () {
        var radioDirective = compile(template, {ngModel:'', label:''});
        expect(stringService.isEmpty($('input', radioDirective).attr('id'))).toBe(false);
    });

    it('should have the proper stylesheet class', function () {
        var radioDirective, wrapper;
        radioDirective = compile(template, {ngModel:true, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, radioDirective);
        expect(wrapper.size()).toBe(3);
    });

    it('should mark as checked the option of the component that is defined in the model', function () {
        var radioDirective, firstOption, secondOption, thirdOption;
        radioDirective = compile(template, {ngModel:'v1', label:'bla'});
        $timeout.flush();
        firstOption     = $($(checkSelector, radioDirective)[0]);
        secondOption    = $($(checkSelector, radioDirective)[1]);
        thirdOption     = $($(checkSelector, radioDirective)[2]);
        expect(firstOption.hasClass('checked')).toBe(true);
        expect(secondOption.hasClass('checked')).toBe(false);
        expect(thirdOption.hasClass('checked')).toBe(false);
    });

    it('should mark as checked the option of the component that has been clicked', function () {
        var radioDirective, secondOption, thirdOption;
        radioDirective = compile(template, {ngModel:'v1', label:'bla'});
        $timeout.flush();
        secondOption    = $($(checkSelector, radioDirective)[1]);
        thirdOption     = $($(checkSelector, radioDirective)[2]);
        expect(angular.element(radioDirective).scope().ngModel).toBe('v1');
        $('ins', secondOption).click();
        expect(angular.element(radioDirective).scope().ngModel).toBe('v2');
        $('ins', thirdOption).click();
        expect(angular.element(radioDirective).scope().ngModel).toBe('v3');
    });

    it('should display the label just after the radio', function () {
        var radioDirective, wrapper, labelObj;
        radioDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, radioDirective);
        labelObj = wrapper.next();
        expect(labelObj.is('label')).toBe(true);
        expect(labelObj.attr('for') !== undefined).toBe(true);
    });

    it('should wire the label with the input', function () {
        var radioDirective, wrapper, labelObj;
        radioDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, radioDirective);
        labelObj = wrapper.next();
        expect(labelObj.attr('for') === $('input', wrapper).attr('id')).toBe(true);
    });

    it('should use ng-show instead of ux-show to avoid problems with the ID of the scope', function () {
        var radioDirective, wrapper, labelObj;
        radioDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, radioDirective);
        labelObj = wrapper.next();
        expect(labelObj.attr('ng-show') !== undefined).toBe(true);
        expect(labelObj.attr('ux-show') === undefined).toBe(true);
    });

    it('should nest labels avoid problems with the ID of the scope', function () {
        var radioDirective, wrapper, labelObj;
        radioDirective = compile(template, {ngModel:false, label:'bla'});
        $timeout.flush();
        wrapper = $(checkSelector, radioDirective);
        labelObj = wrapper.next();
        expect($(' > label', labelObj).size()).toBe(3);
    });
});