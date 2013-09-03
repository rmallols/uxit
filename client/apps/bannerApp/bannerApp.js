'use strict';
COMPONENTS.directive('bannerAppView', function (pageService, editBoxUtilsService, canvasService) {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/bannerApp/bannerAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
		link: function link(scope, element) {

            //noinspection JSUnresolvedFunction
            var canvasObj = $('canvas', element),
                canvas = new fabric.Canvas(canvasObj[0]),
                isAnyEditBoxVisible = false;

            /*function getCanvasCoordinates(canvasObj, canvasElm) {
                var scaleX = canvasElm.scaleX || 1, scaleY = canvasElm.scaleY || 1;
                return {
                    top     : canvasObj.offset().top + canvasElm.top - (canvasElm.height * scaleY) / 2,
                    left    : canvasObj.offset().left + canvasElm.left - (canvasElm.width * scaleX) / 2,
                    width   : canvasElm.width * scaleX,
                    height  : canvasElm.height * scaleY
                }
            }*/

            function showEditBox(e) {
                var canvasObj = $(e.target.canvas.wrapperEl);
                //noinspection JSUnresolvedVariable
                /*var canvasObj = $(e.target.canvas.wrapperEl),
                    canvasCoordinates = getCanvasCoordinates(canvasObj, e.target); */

                scope.panels = [{ title: 'Content', type: 'richContent' }]
                /*scope.target = {
                    coordinates : canvasCoordinates,
                    element     : element,
                    type        : 'edit'
                };*/
                scope.onSave = function (options) {
                    updateObject(e, options);
                    save();
                };
                //editBoxUtilsService.showEditBox(scope, canvasObj, e.target);
                console.log("DISABLED TILL WE DECIDE WHAT TO DO WITH IT")
            }

            function updateObject(e, options) {
                e.target.fill = options.color;
                e.target.text = options.text;
            }

            function save() {
                canvas.deactivateAll().renderAll();
                editBoxUtilsService.unblockHideEditBox();
                console.log("SAVE TEMPORALLY DISABLED TILL WE JUST SAVE THE IMPORTANT DATA, NOT THE WHOLE OBJECT!")
                pageService.updateCurrentPage(null);
            }

            function addText(options) {
                scope.model.objects.push(options);
                //noinspection JSUnresolvedFunction
                canvas.add(new fabric.Text('Testing', options));
            }

            function addObjects() {
                if (!scope.model.objects) {
                    scope.model.objects = [];
                } else {
                    for (var index in scope.model.objects) {
                        //noinspection JSHint
                        var object = scope.model.objects[index];
                        addText(object);
                    }
                }
            }

            function setCanvasSize() {
                //Set a "big" canvas width in order to avoid getting a cut canvas
                canvas.setWidth(10000);
                canvas.setHeight(element.height());
            }

            scope.addNewText = function () {
                var options = {
                    fontFamily: 'Verdana',
                    fontSize: 80,
                    left: 700,
                    top: 60,
                    fill: '#00aaef'
                    /*selectable:false*/
                };
                addText(options);
                save();
            };

            scope.addImage = function () {
                //noinspection JSUnresolvedVariable
                fabric.Image.fromURL('portal/images/logo.svg', function (img) {
                    img.set({
                        left: 250,
                        top: 80,
                        height: 20
                    });
                    img.scaleToWidth(500);
                    canvas.add(img);
                });
            };

            canvas.on('object:selected', function (e) {
                isAnyEditBoxVisible = true;
                scope.model.fill = e.target.fill;
                scope.model.text = e.target.text;
                editBoxUtilsService.blockHideEditBox();
                showEditBox(e);
            });

            canvas.on('object:modified', function (e) {
                console.log("WE WILL BE ABLE TO SAVE ONCE THE OBJECTS HAVE ID")
                //save();
            });

            canvas.on('after:render', function () {
                canvas.calcOffset(); //Force to recalculate the mouse position to avoid offsets
                if (isAnyEditBoxVisible) {
                    var activeElm = canvas.getActiveObject();
                    if (activeElm) {
                        //noinspection JSUnresolvedVariable,JSHint
                        /*var canvasObj = $(activeElm.canvas.wrapperEl),
                            canvasCoordinates = getCanvasCoordinates(canvasObj, activeElm);
                        editBoxUtilsService.moveEditBox({
                            top:canvasCoordinates.top,
                            left:canvasCoordinates.left
                        });*/
                    }
                }
            });

            canvas.on('selection:cleared', function() {
                editBoxUtilsService.unblockHideEditBox();
                canvas.off('after:render');
            });

            //noinspection JSUnresolvedFunction
            $(document).keydown(function (e) {
                var activeElm = canvas.getActiveObject();
                if (activeElm && e.which == 46) {
                    activeElm.remove();
                    editBoxUtilsService.hideEditBox();
                }
            });

            window.onresize = setCanvasSize;
            setCanvasSize();
            addObjects();
        }
	};
});
