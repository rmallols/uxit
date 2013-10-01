describe('styleService', function () {
    'use strict';
    var styleService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "styleService", function ($rootScope, styleService_) {
        styleService = styleService_;
    }]));

    describe('getComputedStyleInRange', function() {

        var domElm, rootElm, leafElm, computedStyles;
        domElm = $( '<div>' +
                        '<div class="root" style="color: red; font-size: 14px;">' +
                            '<div class="parent" style="color: green; border-width: 1px;">' +
                                '<div class="child" style="color: blue; position: relative;"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
        rootElm = domElm;
        leafElm = $('.child', domElm);

        it('should detect the proper styles of a given leaf element taking as a reference ' +
        'a given root element - the property is defined at multiple levels', function() {
            computedStyles = styleService.getComputedStyleInRange(rootElm, leafElm);
            expect(computedStyles.color).toBe('blue');
        });

        it('should detect the proper styles of a given leaf element taking as a reference ' +
        'a given root element - the property is defined just at root level', function() {
            computedStyles = styleService.getComputedStyleInRange(rootElm, leafElm);
            expect(computedStyles.fontSize).toBe('14px');
        });

        it('should detect the proper styles of a given leaf element taking as a reference ' +
        'a given root element - the property is defined just at an intermediate level', function() {
            computedStyles = styleService.getComputedStyleInRange(rootElm, leafElm);
            expect(computedStyles.borderWidth).toBe('1px');
        });

        it('should not detect any kind of styles of a given leaf element taking as a reference ' +
            'a given root element - the property is not defined anywhere', function() {
            computedStyles = styleService.getComputedStyleInRange(rootElm, leafElm);
            expect(computedStyles.display).toBe(undefined);
        });
    });

    describe('rgbStrToRgbObj', function() {

        it('should convert a rgb string into a rgb object - no spaces in the string expression', function() {
            var rgbStr = 'rgb(122,216,8)';
            expect(styleService.rgbStrToRgbObj(rgbStr).r).toBe(122);
            expect(styleService.rgbStrToRgbObj(rgbStr).g).toBe(216);
            expect(styleService.rgbStrToRgbObj(rgbStr).b).toBe(8);
        });

        it('should convert a rgb string into a rgb object - spaces in the string expression', function() {
            var rgbStr = 'rgb ( 122, 216, 8 )';
            expect(styleService.rgbStrToRgbObj(rgbStr).r).toBe(122);
            expect(styleService.rgbStrToRgbObj(rgbStr).g).toBe(216);
            expect(styleService.rgbStrToRgbObj(rgbStr).b).toBe(8);
        });
    });

    describe('rgbObjToHexStr', function() {

        it('should convert to an hexadecimal value a given RGB object - RGB values set as numbers', function() {
            var rgbObj = { r: 122, g: 216, b: 8 };
            expect(styleService.rgbObjToHexStr(rgbObj)).toBe('#7AD808');
        });
    });
});