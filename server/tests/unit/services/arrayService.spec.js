describe('arrayService', function () {
    'use strict';
    var arrayService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "arrayService", function ($rootScope, arrayService_) {
            arrayService = arrayService_;
    }]));

    describe('isArray', function() {
        it('[should detect an empty array as valid', function() {
            var arrayObj = [],
                isArray = arrayService.isArray(arrayObj);
            expect(isArray).toBe(true);
        });
        it('should detect a string array as valid', function() {
            var arrayObj = ['abc', 'def'],
                isArray = arrayService.isArray(arrayObj);
            expect(isArray).toBe(true);
        });
        it('should detect an object array as valid', function() {
            var arrayObj = [{}, { abc: 'def'}],
                isArray = arrayService.isArray(arrayObj);
            expect(isArray).toBe(true);
        });
        it('should detect an invalid object array (string) as invalid', function() {
            var arrayObj = 'abc def',
                isArray = arrayService.isArray(arrayObj);
            expect(isArray).toBe(false);
        });
        it('should detect an invalid object array (object) as invalid', function() {
            var arrayObj = { abc: 'def'},
                isArray = arrayService.isArray(arrayObj);
            expect(isArray).toBe(false);
        });
    });

    describe('add', function() {
        it('should add an element to an array - length test', function() {
            var arrayObj    = ['abc', 'def'],
                newItem     = 'ghi';
            arrayService.add(arrayObj, newItem, 2);
            expect(arrayObj.length).toBe(3);
        });
        it('should add an element to an array - initial position test', function() {
            var arrayObj    = ['abc', 'def'],
                newItem     = 'ghi';
            arrayService.add(arrayObj, newItem, 0);
            expect(arrayObj[0]).toBe(newItem);
        });
        it('should add an element to an array - middle position test', function() {
            var arrayObj    = ['abc', 'def'],
                newItem     = 'ghi';
            arrayService.add(arrayObj, newItem, 1);
            expect(arrayObj[1]).toBe(newItem);
        });
        it('should add an element to an array - final position test', function() {
            var arrayObj    = ['abc', 'def'],
                newItem     = 'ghi';
            arrayService.add(arrayObj, newItem, 2);
            expect(arrayObj[2]).toBe(newItem);
        });        
    });

    describe('copy', function() {
        it('should fully copy an array', function() {
            var arrayObj    = ['abc', 'def'],
                copyArrayObj = arrayService.copy(arrayObj);
            expect(copyArrayObj.toString()).toBe(arrayObj.toString());
        });
        it('should copy the first part of an array', function() {
            var arrayObj        = ['abc', 'def', 'ghi'],
                copyArrayObj    = arrayService.copy(arrayObj, 0, 1);
            expect(copyArrayObj.length).toBe(1);
            expect(copyArrayObj.toString()).toBe(arrayObj[0].toString());
        });
        it('should copy the last part of an array', function() {
            var arrayObj        = ['abc', 'def', 'ghi'],
                copyArrayObj    = arrayService.copy(arrayObj, 1, 1);
            expect(copyArrayObj.length).toBe(1);
            expect(copyArrayObj.toString()).toBe(arrayObj[1].toString());
        }); 
    });

    describe('move', function() {
        it('should switch the position of an element of an array', function() {
            var arrayObj        = ['abc', 'def', 'ghi'],
                moveArrayObj    = arrayService.move(arrayObj, 0, 2);
            expect(moveArrayObj[2]).toBe('abc');
        });
    });

    describe('delete', function() {
        it('should remove an element of an array', function() {
            var arrayObj        = ['abc', 'def', 'ghi'],
                removeArrayObj  = arrayService.delete(arrayObj, 1);
            expect(removeArrayObj.length).toBe(2);
            expect(removeArrayObj[0]).toBe('abc');
            expect(removeArrayObj[1]).toBe('ghi');
        });
    });
});