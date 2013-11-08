(function() {
    COMPONENTS.directive('bannerItem', ['$rootScope', '$timeout', '$injector', 'editBoxUtilsService',
    'domService', 'stringService',
    function ($rootScope, $timeout, $injector, editBoxUtilsService, domService, stringService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            scope: {
                item: '=data',
                overflow: '=',
                onItemChange: '&onChange',
                readOnly: '='
            },
            templateUrl: 'bannerItem.html',
            controller: function controller() {

            },
            link: function link(scope, element) {

                var itemServiceId = 'banner' + stringService.capitalize(scope.item.type) + 'Service',
                    itemService = $injector.get(itemServiceId),
                    inputElm = $(' > input.selectHandler', element),
                    editButtonElm = $(' > button.edit', element),
                    keepItemSelected = false,
                    borderWidth = domService.getObjBorderWidth(element),
                    horizontalBorderWidth = borderWidth.left + borderWidth.right,
                    verticalBorderWidth = borderWidth.top + borderWidth.bottom,
                    gridSize = 50,
                    oldBoxSize;

                scope.template = getItemTemplate();
                initItemModel();
                setDomCoordinatesFromModel();

                if(!scope.readOnly) {
                    defineListeners();
                }

                /** Private methods **/
                function getItemTemplate() {
                    var template = $(itemService.getTemplate());
                    template.addClass('item ' + scope.item.type);
                    return template;
                }

                function initItemModel() {
                    if(itemService.initItemModel) {
                        itemService.initItemModel(scope.item);
                    }
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
                        grid: [ gridSize,gridSize ],
                        start: function() {
                            select();
                        },
                        stop: function() {
                            setModelCoordinatesFromDom(); //Update the model before propagating the changes
                            propagateChanges();
                        }
                    });
                }

                function removeDraggable() {
                    element.draggable( "destroy" );
                }

                function setResizable() {
                    oldBoxSize = getBoxSize(); //Calculate the original box size once the DOM is ready
                    element.resizable({
                        //aspectRatio: true,
                        grid: gridSize,
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
                    keepItemSelected = true;
                    scope.internalData = {};
                    scope.panels = getEditPanels();
                    scope.onSave = function() {
                        propagateChanges();
                    };
                    scope.onClose = function() {
                        keepItemSelected = false;
                        unselect();
                        hideOverflow();
                        setDraggable(); //Enable dragging again once the edit box is closed


                        console.log("ESTO ESTÁ DUPLICADO DE onStopResizeItemFn, NORMALIZARLO!!!")
                        setModelCoordinatesFromDom(); //Update the model before propagating the changes
                        //Here, the model is updated, but its still necessary to update the DOM
                        //in order to get the changes refreshed
                        setDomCoordinatesFromModel();
                        propagateChanges();
                    };
                    showOverflow();
                    //Avoid dragging while the edit box is opened to avoid problems with content editable
                    removeDraggable();
                    editBoxUtilsService.showEditBox(scope, editButtonElm, editButtonElm);
                }

                function onResizeItemFn() {
                    var newBoxSize;
                    if(itemService.onResizeItem) {
                        newBoxSize  = getBoxSize();
                        itemService.onResizeItem(scope.template, scope.item, newBoxSize, oldBoxSize);
                        oldBoxSize = getBoxSize(); //Recalculate the box size
                        scope.$apply();
                    }
                }

                function onStopResizeItemFn() {
                    setModelCoordinatesFromDom(); //Update the model before propagating the changes
                    //Here, the model is updated, but its still necessary to update the DOM
                    //in order to get the changes refreshed
                    setDomCoordinatesFromModel();
                    propagateChanges();
                }

                function setDomCoordinatesFromModel() {
                    console.log("setting!", scope.item.size.width);
                    element.css('width', scope.item.size.width - horizontalBorderWidth);
                    element.css('height', scope.item.size.height - verticalBorderWidth);
                    element.css('top', scope.item.position.top);
                    element.css('left', scope.item.position.left);
                }

                function setModelCoordinatesFromDom() {
                    scope.item.size.width    = getNormalizedSize(scope.template.width());
                    scope.item.size.height   = getNormalizedSize(scope.template.height());
                    scope.item.position.top  = parseInt(element.css('top'), 10);
                    scope.item.position.left = parseInt(element.css('left'), 10);
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                }

                function getNormalizedSize(currentSize) {
                    var heightSlots = Math.ceil(currentSize / gridSize);
                    return heightSlots * gridSize;
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
                            setModelCoordinatesFromDom(); //Update the model before propagating the changes
                        }
                    }, 150);
                }

                function getBoxSize() {
                     return element.width() * element.height();
                }

                function showOverflow() {
                    scope.overflow.visible = true;
                }

                function hideOverflow() {
                    scope.overflow.visible = false;
                }

                function propagateChanges() {
                    if(scope.onItemChange) {
                        scope.onItemChange();
                    }
                }

                function getEditPanels() {
                    return itemService.getEditPanels(scope.item, scope.template);
                }
                /** End of private methods **/
            }
        };
    }]);
})();