(function() {
    COMPONENTS.directive('bannerCanvas', ['$rootScope', '$compile', 'keyboardService',
    function ($rootScope, $compile, keyboardService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'bannerCanvas.html',
            scope: {
                model: '=ngModel'
            },
            link: function link(scope, element) {

                var gridElm = $(' > .grid', element),
                    directiveId = 'bannerCanvas'

                createGrid(50);
                registerKeyboardEvents();

                scope.addImage = function() {
                    createImage();
                };

                scope.addText = function() {
                    createText();
                };

                scope.onItemChange = function() {
                    console.log("ON ITEM CHANGE!");
                    //console.log(domService.convertDomObjToStr(data));
                    $('[banner-item]', gridElm).each(function() {
                        console.log("READY TO MODEL", $(this)[0])

                    });
                    scope.model = 'AAA';
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                };

                /** Private methods **/
                function createGrid(size) {
                    var totalCols = Math.floor(element.width()/size),
                        totalRows = Math.floor(element.height()/size),
                        colPos, rowPos;
                    for(var i = 0; i < totalCols; i++) {
                        colPos = (i + 1) * size;
                        gridElm.append('<div class="ruler col" style="top: 0; left: ' + colPos + 'px"></div>')
                    }
                    for(var j = 0; j < totalRows; j++) {
                        rowPos = (j + 1) * size;
                        gridElm.append('<div class="ruler row" style="top: ' + rowPos + 'px; left: 0"></div>')
                    }
                }

                function createImage() {
                    createItem('image', '/client/images/add.svg');
                }

                function createText() {
                    createItem('text', 'Ouuuh Yeaaah!');
                }

                function createItem(type, value) {
                    var itemElm = $('<div banner-item on-change="onItemChange()" type="' + type + '" value="' + value + '" ' +
                                    'overflow-visible="overflowVisible"></div>');
                    gridElm.append(itemElm);
                    $compile(itemElm)(scope);
                }

                function registerKeyboardEvents() {
                    keyboardService.register('del', directiveId, function () {
                        $('.bannerItem.active').remove();
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})();