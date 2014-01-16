(function() {
    'use strict';
    COMPONENTS.directive('bannerItem', ['bannerItemService', '$timeout', 'editBoxUtilsService',
    function (bIS, $timeout, editBoxUtilsService) {
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

                var itemService         = bIS.getTypeService(scope.item.type),
                    inputElm            = $(' input.selectHandler', element),
                    editButtonElm       = $(' button.edit', element),
                    keepItemSelected    = false,
                    bCElm               = element.parent(),
                    bCDimensions, gridPxSize;

                scope.invisible = true;
                scope.$evalAsync(function() {
                    init();
                });

                scope.$watch('gridSize', onGridSizeChanged);

                /** Private methods **/
                function init() {
                    scope.template = getItemTemplate();
                    if(!scope.item.size) { scope.item.size = getDefaultItemDimensions(); }
                    bIS.setDomCoordinatesFromModel(scope.item, element);
                    scope.invisible = false;
                }

                function onGridSizeChanged(newGridSize, oldGridSize) {
                    if(!scope.readOnly) {
                        setDrawingSizes(newGridSize);
                        defineListeners();
                        //Ensure that the banner item fits to the axis of the grid whenever it changes
                        if(oldGridSize && oldGridSize !== newGridSize) {
                            fitToGrid();
                        }
                    }
                }

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
                        grid    : [ gridPxSize.width, gridPxSize.height ],
                        start   : onStartDragItemFn,
                        stop    : onStopDragItemFn
                    });
                }

                function removeDraggable() { element.draggable( "destroy" ); }

                function setResizable() {
                    element.resizable({
                        grid    : [ gridPxSize.width, gridPxSize.height ],
                        handles : 'ne, nw, se, sw',
                        resize  : onResizeItemFn,
                        stop    : onStopResizeItemFn
                    });
                }

                function onClickFn(e) {
                    if(!editBoxUtilsService.isEditBoxClicked(e)) {
                        select();
                    }
                }

                function onFocusFn() { element.addClass('active'); }

                function onBlurFn() { unselect(); }

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

                function onStartDragItemFn() { select(); }

                function onStopDragItemFn() {
                    bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, scope.gridSize, bCDimensions);
                    bIS.propagateChanges(scope.onItemChange);
                }

                function onResizeItemFn() {
                    if(itemService.onResizeItem) {
                        itemService.onResizeItem(scope.template);
                        scope.$apply();
                    }
                }

                function onStopResizeItemFn() {
                    bIS.refresh(scope.item, scope.template, element, scope.gridSize, bCDimensions);
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
                            bIS.setModelCoordinatesFromDom(scope.item, scope.template, element, scope.gridSize, bCDimensions);
                        }
                    }, 150);
                }

                function showOverflow() { scope.overflow.visible = true; }

                function hideOverflow() { scope.overflow.visible = false; }

                function getEditPanels() {
                    return itemService.getEditPanels(scope.item, scope.template, element, scope.gridSize, bCDimensions);
                }

                function onSaveEditBox() {
                    bIS.propagateChanges(scope.onItemChange);
                }

                function onCloseEditBox() {
                    keepItemSelected = false;
                    unselect();
                    hideOverflow();
                    setDraggable(); //Enable dragging again once the edit box is closed
                    bIS.refresh(scope.item, scope.template, element, scope.gridSize, bCDimensions);
                    bIS.propagateChanges(scope.onItemChange);
                }

                function setDrawingSizes(gridSize) {
                    var totalSlots = 100 / gridSize;
                    bCDimensions = { width: bCElm.width(), height: bCElm.height() };
                    gridPxSize = { width: bCDimensions.width / totalSlots, height: bCDimensions.height / totalSlots };
                }

                function fitToGrid() {
                    scope.item.position.top     -= scope.item.position.top % scope.gridSize;
                    scope.item.position.left    -= scope.item.position.left % scope.gridSize;
                    scope.item.size.width       -= scope.item.size.width % scope.gridSize;
                    scope.item.size.height      -= scope.item.size.height % scope.gridSize;
                    //Just in the corner case the size is 0, set is to the minimum (the grid size)
                    if(scope.item.size.width === 0)     { scope.item.size.width = scope.gridSize; }
                    if(scope.item.size.height === 0)    { scope.item.size.height = scope.gridSize; }
                    bIS.setDomCoordinatesFromModel(scope.item, element);
                }

                function getDefaultItemDimensions() {
                    var defaultItemSize = bIS.getDefaultItemSize(scope.gridSize);
                    return { width:  defaultItemSize, height: defaultItemSize };
                }
                /** End of private methods **/
            }
        };
    }]);
})();