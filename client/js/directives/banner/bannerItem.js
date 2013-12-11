(function() {
    'use strict';
    COMPONENTS.directive('bannerItem', ['bannerItemService', '$timeout',
    'editBoxUtilsService', 'domService',
    function (bIS, $timeout, editBoxUtilsService, domService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                item: '=data',
                overflow: '=',
                onItemChange: '&onChange',
                readOnly: '=',
                gridSize: '='
            },
            templateUrl: 'bannerItem.html',
            link: function link(scope, element) {

                var itemService = bIS.getTypeService(scope.item.type),
                    inputElm = $(' > input.selectHandler', element),
                    editButtonElm = $(' > button.edit', element),
                    keepItemSelected = false,
                    borderWidth = domService.getObjBorderWidth(element),
                    borders = {
                        horizontal  : borderWidth.left + borderWidth.right,
                        vertical    : borderWidth.top + borderWidth.bottom
                    };

                scope.template = getItemTemplate();
                bIS.setDomCoordinatesFromModel(scope.item, element, borders);

                if(!scope.readOnly) {
                    defineListeners();
                }

                scope.$watch('gridSize', function(newGridSize) {
                    setGridSize(newGridSize);
                    //Ensure that the banner item fits to the axis of the grid whenever it changes
                    fitToGrid();
                    //Once the boundaries of the item fit with the grid size,
                    //It's still necessary to ensure than the wrapping box is bigger than the content
                    fitToContent();
                });

                /** Private methods **/
                function getItemTemplate() {
                    var template = $(itemService.getTemplate());
                    template.addClass('item ' + scope.item.type);
                    return template;
                }

                function defineListeners() {
                    setDraggable();
                    setResizable();
                    element.click(onClickFn);
                    inputElm.focus(onFocusFn);
                    inputElm.blur(onBlurFn);
                    scope.editItem = onEditItemFn;
                }

                function setDraggable() {
                    element.draggable({
                        grid: [ scope.gridSize, scope.gridSize ],
                        start: function() {
                            select();
                        },
                        stop: function() {
                            //Update the model before propagating the changes
                            bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, borders, scope.gridSize);
                            bIS.propagateChanges(scope.onItemChange);
                        }
                    });
                }

                function removeDraggable() {
                    element.draggable( "destroy" );
                }

                function setResizable() {
                    element.resizable({
                        //aspectRatio: true,
                        grid: [scope.gridSize, scope.gridSize],
                        handles: 'ne, nw, se, sw',
                        resize: onResizeItemFn,
                        stop: onStopResizeItemFn
                    });
                }

                function onClickFn(e) {
                    if(!editBoxUtilsService.isEditBoxClicked(e)) {
                        select();
                    }
                }

                function onFocusFn() {
                    element.addClass('active');
                }

                function onBlurFn() {
                    unselect();
                }

                function onEditItemFn() {
                    keepItemSelected    = true;
                    scope.internalData  = {};
                    scope.panels        = getEditPanels();
                    scope.onSave        = onSaveEditBox;
                    scope.onClose       = onCloseEditBox;
                    showOverflow();
                    //Avoid dragging while the edit box is opened to avoid problems with content editable
                    removeDraggable();
                    editBoxUtilsService.showEditBox(scope, editButtonElm, editButtonElm);
                }

                function onResizeItemFn() {
                    if(itemService.onResizeItem) {
                        itemService.onResizeItem(scope.template);
                        scope.$apply();
                    }
                }

                function onStopResizeItemFn() {
                    bIS.refresh(scope.item, scope.template, element, borders, scope.gridSize);
                    bIS.propagateChanges(scope.onItemChange);
                }

                function select() {
                    inputElm.addClass('forceVisible');
                    inputElm.focus();
                }

                function unselect() {
                    $timeout(function() {
                        if(!keepItemSelected) {
                            element.removeClass('active');
                            inputElm.removeClass('forceVisible');
                            //Update the model before propagating the changes
                            bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, borders, scope.gridSize);
                        }
                    }, 150);
                }

                function showOverflow() {
                    scope.overflow.visible = true;
                }

                function hideOverflow() {
                    scope.overflow.visible = false;
                }

                function getEditPanels() {
                    return itemService.getEditPanels(scope.item, scope.template, element, borders);
                }

                function onSaveEditBox() {
                    bIS.propagateChanges(scope.onItemChange);
                }

                function onCloseEditBox() {
                    keepItemSelected = false;
                    unselect();
                    hideOverflow();
                    setDraggable(); //Enable dragging again once the edit box is closed
                    bIS.refresh(scope.item, scope.template, element, borders, scope.gridSize);
                    bIS.propagateChanges(scope.onItemChange);
                }

                function setGridSize(gridSize) {
                    element.draggable( "option", "grid", [ gridSize, gridSize ] );
                    element.resizable( "option", "grid", [ gridSize, gridSize ] );
                }

                function fitToGrid() {
                    scope.item.position.top     -= scope.item.position.top % scope.gridSize;
                    scope.item.position.left    -= scope.item.position.left % scope.gridSize;
                    scope.item.size.width       -= scope.item.size.width % scope.gridSize;
                    scope.item.size.height      -= scope.item.size.height % scope.gridSize;
                    bIS.setDomCoordinatesFromModel(scope.item, element, borders);
                }

                function fitToContent() {
                    //noinspection JSValidateTypes
                    scope.item.size.width    = bIS.getNormalizedSize(   scope.template.width(),
                                                                        element.width(),
                                                                        borders.horizontal,
                                                                        scope.gridSize);
                    //noinspection JSValidateTypes
                    scope.item.size.height   = bIS.getNormalizedSize(   scope.template.height(),
                                                                        element.height(),
                                                                        borders.vertical,
                                                                        scope.gridSize);
                    bIS.setDomCoordinatesFromModel(scope.item, element, borders);
                }
                /** End of private methods **/
            }
        };
    }]);
})();