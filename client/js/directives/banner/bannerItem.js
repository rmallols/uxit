(function() {
    COMPONENTS.directive('bannerItem', ['bannerItemService', '$timeout',
    'editBoxUtilsService', 'domService',
    function (bIS, $timeout, editBoxUtilsService, domService) {
        'use strict';
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

                    var offsetLeft  = element.position().left % scope.gridSize,
                        offsetTop   = element.position().top % scope.gridSize;
                    element.css('left', element.position().left - offsetLeft);
                    element.css('top', element.position().top - offsetTop);
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
                        grid: scope.gridSize,
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
                }
                /** End of private methods **/
            }
        };
    }]);
})();