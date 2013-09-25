(function() {
    COMPONENTS.directive('bannerCanvas', ['$compile', 'keyboardService', function ($compile, keyboardService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'bannerCanvas.html',
            link: function link(scope, element) {

                var contentElm = $(' > .content', element),
                    gridElm = $(' > .grid', element),
                    directiveId = 'bannerCanvas';

                createGrid(50);
                registerKeyboardEvents();

                scope.addImage = function() {
                    createImage();
                };

                scope.addText = function() {
                    createText();
                };

                /** Private methods **/
                function createGrid(size) {
                    var totalCols = Math.floor(element.width()/size),
                        totalRows = Math.floor(element.height()/size),
                        colPos, rowPos;
                    for(var i = 0; i < totalCols; i++) {
                        colPos = (i + 1) * size;
                        gridElm.append('<div class="ruler col" style="top: 0px; left: ' + colPos + 'px"></div>')
                    }
                    for(var j = 0; j < totalRows; j++) {
                        rowPos = (j + 1) * size;
                        gridElm.append('<div class="ruler row" style="top: ' + rowPos + 'px; left: 0px"></div>')
                    }
                }

                function createImage() {
                    createItem('image', '/client/images/add.svg');
                }

                function createText() {
                    createItem('text', 'Ouuuh Yeaaah!');
                }

                console.log("MERGER GRID Y CONTENT; AHORA ES TODO UNO!")

                function createItem(type, value) {
                    var itemElm = $('<div banner-item type="' + type + '" value="' + value + '" overflow-visible="overflowVisible" style="top: 50px; left: 50px;"></div>');
                    gridElm.append(itemElm);
                    $compile(itemElm)(scope);
                }

                function registerKeyboardEvents() {
                    keyboardService.register('del', directiveId, function () {
                        $('.bannerItem.active').remove();
                    });
                }

                /*function unregisterKeyboardEvents() {
                    keyboardService.unregister('del', directiveId);
                }*/
                /** End of private methods **/
            }
        };
    }]);
})();