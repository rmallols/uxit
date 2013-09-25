(function() {
    COMPONENTS.directive('bannerItem', ['$timeout', 'mediaService', 'editBoxUtilsService',
    function ($timeout, mediaService, editBoxUtilsService) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            scope: {
                type: '@',
                value: '@',
                overflowVisible: '='
            },
            templateUrl: 'bannerItem.html',
            link: function link(scope, element) {

                var inputElm = $(' > input.selectHandler', element),
                    editButtonElm = $(' > button.edit', element),
                    originalBoxSize = getBoxSize(),
                    keepItemSelected = false;

                element.draggable({
                    grid: [ 50,50 ],
                    start: function() {
                        start();
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
                    }
                });

                element.click(function() {
                    start();
                });

                inputElm.focus(function() {
                    element.addClass('active');
                });

                inputElm.blur(function() {
                    stop();
                });

                scope.editItem = function() {
                    keepItemSelected = true;
                    var defaultPanels = [{ title: 'Select media', type: 'selectMedia' }];
                    scope.internalData = {};
                    scope.panels = defaultPanels;
                    scope.onSave = function() {
                        console.log("SAVE!");
                    };
                    scope.onCancel = function() {
                        console.log("CANCEL");
                    };
                    scope.onChange = function(model, id, selectedMedia) {
                        scope.value = mediaService.getDownloadUrl(selectedMedia);
                    };
                    scope.onClose = function() {
                        keepItemSelected = false;
                        stop();
                        hideOverflow();
                    };
                    showOverflow();
                    editBoxUtilsService.showEditBox(scope, editButtonElm, editButtonElm);
                };

                /** Private methods **/
                function start() {
                    inputElm.addClass('forceVisible');
                    inputElm.focus();
                }

                function stop() {
                    $timeout(function() {
                        if(!keepItemSelected) {
                            element.removeClass('active');
                            inputElm.removeClass('forceVisible');
                        }
                    }, window.speed);
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
                /** End of private methods **/
            }
        };
    }]);
})();