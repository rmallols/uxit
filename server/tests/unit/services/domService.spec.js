describe('dom service', function () {

    var domService, template, domProps, bodyElm, templateStr;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["domService", function (domService_) {
        bodyElm     = $('body');
        domService  = domService_;
        templateStr = '<div style="position: absolute;"></div>';
        template    = $(templateStr);
        domProps    = {
            coordinates : {top: 75, left: 25, width: 150, height: 200},
            padding     : {paddingTop: 10, paddingRight: 20, paddingBottom: 0, paddingLeft: 65},
            borderWidth : {borderStyle: 'solid', borderTopWidth: 5, borderRightWidth: 3, borderBottomWidth: 1, borderLeftWidth: 12}
        };
        bodyElm.css({ margin: 0}); //Normalize the page margins
        bodyElm.html(template); //Add the template to the DOM
    }]));

    describe('getCoordinates', function () {

        it('should get [0, 0] as the default coordinates (position and size)', function () {
            var coordinates = domService.getCoordinates(template);
            expect(coordinates.top).toBe(0);
            expect(coordinates.left).toBe(0);
            expect(coordinates.width).toBe(0);
            expect(coordinates.height).toBe(0);
        });

        it('should get the custom coordinates if they\'re defined (position and size)', function () {
            var coordinates;
            template.css(domProps.coordinates);
            coordinates = domService.getCoordinates(template);
            expect(coordinates.top).toBe(domProps.coordinates.top);
            expect(coordinates.left).toBe(domProps.coordinates.left);
            expect(coordinates.width).toBe(domProps.coordinates.width);
            expect(coordinates.height).toBe(domProps.coordinates.height);
        });
    });

    describe('getObjPadding', function () {

        it('should get 0 as the default padding', function () {
            var padding = domService.getObjPadding(template);
            expect(padding.top).toBe(0);
            expect(padding.right).toBe(0);
            expect(padding.bottom).toBe(0);
            expect(padding.left).toBe(0);
        });

        it('should get the custom padding if it\'s defined', function () {
            var padding;
            template.css(domProps.padding);
            padding = domService.getObjPadding(template);
            expect(padding.top).toBe(domProps.padding.paddingTop);
            expect(padding.right).toBe(domProps.padding.paddingRight);
            expect(padding.bottom).toBe(domProps.padding.paddingBottom);
            expect(padding.left).toBe(domProps.padding.paddingLeft);
        });
    });

    describe('getObjBorderWidth', function () {

        it('should get 0 as the default border width', function () {
            var borderWidth = domService.getObjBorderWidth(template);
            expect(borderWidth.top).toBe(0);
            expect(borderWidth.right).toBe(0);
            expect(borderWidth.bottom).toBe(0);
            expect(borderWidth.left).toBe(0);
        });

        it('should get the custom padding if it\'s defined', function () {
            var borderWidth;
            template.css(domProps.borderWidth);
            borderWidth = domService.getObjBorderWidth(template);
            expect(borderWidth.top).toBe(domProps.borderWidth.borderTopWidth);
            expect(borderWidth.right).toBe(domProps.borderWidth.borderRightWidth);
            expect(borderWidth.bottom).toBe(domProps.borderWidth.borderBottomWidth);
            expect(borderWidth.left).toBe(domProps.borderWidth.borderLeftWidth);
        });
    });

    describe('getElementType', function () {

        it('should detect element types', function () {
            expect(domService.getElementType(template)).toBe('div');
            expect(domService.getElementType($('<input type="text" />'))).toBe('input');
            expect(domService.getElementType($('<textarea>test</textarea>'))).toBe('textarea');
            expect(domService.getElementType($('<a href="#"></a>'))).toBe('a');
            expect(domService.getElementType($('<span>test</span>'))).toBe('span');
            expect(domService.getElementType($('<label>test</label>'))).toBe('label');
            expect(domService.getElementType($('<button>test</button>'))).toBe('button');
            expect(domService.getElementType($('<select><option>1</option></select>'))).toBe('select');
        });
    });

    describe('getDomPercent', function () {

        it('should get 0 as the default dom percent width', function () {
            expect(domService.getDomPercent(template, 'width')).toBe(0);
        });

        it('should detect element types', function () {
            template.css(domProps.coordinates);
            expect(domService.getDomPercent(template, 'width')).toBe(getWidthpercent());
        });

        function getWidthpercent() {
            return Math.round(template.width() * 100 / bodyElm.width());
        }
    });

    describe('addLoadingFeedback', function () {

        it('should not have the loading styleclass by default', function () {
            expect(template.hasClass('loading')).toBe(false);
        });

        it('should have the loading styleclass once it has been added', function () {
            domService.addLoadingFeedback(template);
            expect(template.hasClass('loading')).toBe(true);
        });
    });

    describe('removeLoadingFeedback', function () {

        it('should not have the loading styleclass once it has been remove', function () {
            domService.addLoadingFeedback(template);
            domService.removeLoadingFeedback(template);
            expect(template.hasClass('loading')).toBe(false);
        });
    });

    describe('convertDomObjToStr', function () {

        it('should convert a given DOM object into a string', function () {
            var testTemplateStr = templateStr;
            expect(domService.convertDomObjToStr(template)).toBe(testTemplateStr);
            testTemplateStr = '<div><label>Test label</label><button>Test button</button></div>';
            expect(domService.convertDomObjToStr($(testTemplateStr))).toBe(testTemplateStr);
        });
    });
});