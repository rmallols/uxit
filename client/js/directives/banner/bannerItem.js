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
                onItemChange: '&onChange'
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
                originalBoxSize = getBoxSize(); //Calculate the original box size once the DOM is ready

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

                element.click(function() {
                    select();
                });

                inputElm.focus(function() {
                    element.addClass('active');
                });

                inputElm.blur(function() {
                    unselect();
                });

                scope.editItem = function() {
                    keepItemSelected = true;
                    var defaultPanels = [{ title: 'Select media', type: 'selectMedia' }];
                    scope.internalData = {};
                    scope.panels = defaultPanels;
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
                };

                /** Private methods **/
                function setDomCoordinatesFromModel() {
                    element.css('width', scope.item.size.width - horizontalBorderWidth);
                    element.css('height', scope.item.size.height - verticalBorderWidth);
                    element.css('top', scope.item.position.top);
                    element.css('left', scope.item.position.left);
                }

                function setModelCoordinatesFromDom() {
                    scope.item.size.width    = parseInt(element.css('width')) + horizontalBorderWidth;
                    scope.item.size.height   = parseInt(element.css('height')) + verticalBorderWidth;
                    scope.item.position.top  = parseInt(element.css('top'));
                    scope.item.position.left = parseInt(element.css('left'));
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
                /** End of private methods **/
            }
        };
    }]);
})();