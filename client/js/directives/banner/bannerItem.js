(function() {
    COMPONENTS.directive('bannerItem', ['$rootScope', '$timeout', 'mediaService', 'editBoxUtilsService', 'domService',
    function ($rootScope, $timeout, mediaService, editBoxUtilsService, domService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            scope: {
                item: '=data',
                overflowVisible: '=',
                onItemChange: '&onChange',
                readOnly: '='
            },
            templateUrl: 'bannerItem.html',
            link: function link(scope, element) {

                var inputElm = $(' > input.selectHandler', element),
                    editButtonElm = $(' > button.edit', element),
                    keepItemSelected = false,
                    borderWidth = domService.getObjBorderWidth(element),
                    horizontalBorderWidth = borderWidth.left + borderWidth.right,
                    verticalBorderWidth = borderWidth.top + borderWidth.bottom,
                    originalBoxSize;

                setDomCoordinatesFromModel();

                if(!scope.readOnly) {
                    defineListeners();
                }

                scope.isImage   = function() { return scope.item.type === 'image' };
                scope.isText    = function() { return scope.item.type === 'text' };

                /** Private methods **/
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
                        grid: [ 50,50 ],
                        start: function() {
                            select();
                        },
                        stop: function() {
                            setModelCoordinatesFromDom(); //Update the model before propagating the changes
                            propagateChanges();
                        }
                    });
                }

                function setResizable() {
                    originalBoxSize = getBoxSize(); //Calculate the original box size once the DOM is ready
                    element.resizable({
                        //aspectRatio: true,
                        grid: 50,
                        handles: 'ne, nw, se, sw',
                        resize: function() {
                            var newBoxSize  = getBoxSize(),
                                newFontSize = (newBoxSize / originalBoxSize) * 100;
                            element.css('font-size', newFontSize + '%');
                        },
                        stop: function() {
                            setModelCoordinatesFromDom(); //Update the model before propagating the changes
                            propagateChanges();
                        }
                    });
                }

                function onClickFn() {
                    select();
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
                    scope.onChange = function(model, id, selectedMedia) {
                        scope.item.value = mediaService.getDownloadUrl(selectedMedia);
                    };
                    scope.onSave = function() {
                        propagateChanges();
                    };
                    scope.onClose = function() {
                        keepItemSelected = false;
                        unselect();
                        hideOverflow();
                    };
                    showOverflow();
                    editBoxUtilsService.showEditBox(scope, editButtonElm, editButtonElm);
                }

                function setDomCoordinatesFromModel() {
                    element.css('width', scope.item.size.width - horizontalBorderWidth);
                    element.css('height', scope.item.size.height - verticalBorderWidth);
                    element.css('top', scope.item.position.top);
                    element.css('left', scope.item.position.left);
                }

                function setModelCoordinatesFromDom() {
                    scope.item.size.width    = parseInt(element.css('width'), 10) + horizontalBorderWidth;
                    scope.item.size.height   = parseInt(element.css('height'), 10) + verticalBorderWidth;
                    scope.item.position.top  = parseInt(element.css('top'), 10);
                    scope.item.position.left = parseInt(element.css('left'), 10);
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
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
                    scope.overflowVisible = true;
                }

                function hideOverflow() {
                    scope.overflowVisible = false;
                }

                function propagateChanges() {
                    if(scope.onItemChange) {
                        scope.onItemChange();
                    }
                }

                function getEditPanels() {
                    var editPanels;
                    if(scope.isImage()) {
                        editPanels = [{ title: 'Select media', type: 'selectMedia',
                                        config: { editSize: false } }]
                    } else if(scope.isText()) {
                        editPanels = [{ title: 'Edit text', type: 'selectMedia',
                                        config: { editSize: false } }]
                        console.log("WIRE HERE WITH CONTENT EDIT AND EDIT STYLES!!!");
                    }
                    return editPanels;
                }
                /** End of private methods **/
            }
        };
    }]);
})();