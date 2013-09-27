(function() {
    COMPONENTS.directive('bannerCanvas', ['$compile', 'timerService', 'keyboardService',
    function ($compile, timerService, keyboardService) {
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
                    directiveId = 'bannerCanvas',
                    gridSize = 50,
                    totalCols = Math.floor(element.width() / gridSize),
                    totalRows = Math.floor(element.height() / gridSize);

                createGrid();
                registerKeyboardEvents();

                scope.items = {
                    index: {},
                    data: []
                };

                scope.model = scope.items.data;

                scope.addImage = function() {
                    createImage();
                };

                scope.addText = function() {
                    createText();
                };

                /** Private methods **/
                function createGrid() {
                        var colPos, rowPos;
                    for(var i = 0; i < totalCols; i++) {
                        colPos = (i + 1) * gridSize;
                        gridElm.append('<div class="ruler col" style="top: 0; left: ' + colPos + 'px"></div>')
                    }
                    for(var j = 0; j < totalRows; j++) {
                        rowPos = (j + 1) * gridSize;
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
                    var itemId  = timerService.getRandomNumber(), itemSize = 2 * gridSize,
                        topPos  = Math.floor(Math.random() * totalRows - 1) * gridSize,
                        leftPos = Math.floor(Math.random() * totalCols - 1) * gridSize;
                    scope.items.index[itemId] = scope.items.data.length;
                    scope.items.data.push({
                        id: itemId,
                        type: type,
                        value: value,
                        size: { width: itemSize, height: itemSize },
                        position: { //Set a random position for the new item
                            top : (topPos > 0) ? topPos : 0,
                            left: (leftPos > 0) ? leftPos : 0
                        }
                    })
                }

                function registerKeyboardEvents() {
                    keyboardService.register('del', directiveId, function () {
                        console.log("DELETE IN PROGRESS!");
                        $('.bannerItem.active').each(function() {
                            var itemId      = $(this).attr('id'),
                                itemIndex   = scope.items.index[itemId];

                        });
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})();