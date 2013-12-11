(function() {
    COMPONENTS.directive('bannerCanvas', ['$compile', 'timerService', 'arrayService', 'keyboardService',
    'roleService', 'sessionService', 'bannerItemService',
    function ($compile, timerService, arrayService, keyboardService, roleService, sessionService,
      bannerItemService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'bannerCanvas.html',
            scope: {
                model: '=ngModel',
                height: '=',
                gridSize: '=',
                onChange: '&'
            },
            link: function link(scope, element) {

                var gridElm     = $(' > .grid', element),
                    directiveId = 'bannerCanvas',
                    userSession = sessionService.getUserSession(),
                    isCreator   = roleService.hasCreatorRole(userSession),
                    totalCols, totalRows;

                scope.$watch('gridSize', createGrid);
                scope.$watch('height', createGrid);

                registerKeyboardEvents();

                if(!scope.model) {
                    scope.model = [];
                }

                scope.overflow = { visible: false };
                scope.items = {
                    index: {},
                    data: scope.model
                };

                scope.addItem = addItem;

                scope.onItemChange = function() {
                    propagateChanges();
                };

                scope.isReadOnly = function() {
                    return !isCreator || element.attr('readonly') || element.attr('disabled');
                };

                scope.getCanvasHeight = function() {
                    return {
                        height: scope.height
                    };
                };

                /** Private methods **/
                function createGrid() {
                    $('.ruler', element).remove();
                    totalCols   = Math.floor(element.width() / scope.gridSize);
                    totalRows   = Math.floor(scope.height / scope.gridSize);
                    createGridCols();
                    createGridRows();
                }

                function createGridCols() {
                    var colPos;
                    for(var i = 0; i < totalCols; i++) {
                        colPos = (i + 1) * scope.gridSize;
                        gridElm.append('<div class="ruler col" style="top: 0; left: ' + colPos + 'px"></div>');
                    }
                }

                function createGridRows() {
                    var rowPos;
                    for(var i = 0; i < totalRows; i++) {
                        rowPos = (i + 1) * scope.gridSize;
                        gridElm.append('<div class="ruler row" style="top: ' + rowPos + 'px; left: 0"></div>');
                    }
                }

                function addItem(type) {
                    createItem(type, bannerItemService.getDefaultValue(type));
                }

                function createItem(type, value) {
                    var itemId  = timerService.getRandomNumber(), itemSize = 2 * scope.gridSize,
                        topPos  = Math.floor(Math.random() * totalRows - 1) * scope.gridSize,
                        leftPos = Math.floor(Math.random() * totalCols - 1) * scope.gridSize;
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
                    });
                    propagateChanges();
                }

                function registerKeyboardEvents() {
                    keyboardService.register('del', directiveId, function () {
                        deleteSelectedItems();
                        scope.$apply();
                    });
                }

                function deleteSelectedItems() {
                    $('.bannerItem.active').each(function() {
                        var itemId      = $(this).attr('id'),
                            itemIndex   = scope.items.index[itemId];
                        delete scope.items.index[itemId];
                        arrayService.delete(scope.items.data, itemIndex);
                        updateIndexes();
                    });
                    propagateChanges();
                }

                function updateIndexes() {
                    angular.forEach(scope.items.data, function(item, $index) {
                        scope.items.index[item.id] = $index;
                    });
                }

                function propagateChanges() {
                    if(scope.onChange) {
                        scope.onChange();
                    }
                }
                /** End of private methods **/
            }
        };
    }]);
})();