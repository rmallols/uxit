(function() {
    'use strict';
    COMPONENTS.directive('contentEditable', ['$rootScope', '$timeout', '$compile', 'textSelectionService', 'caretService',
        'domService', 'roleService', 'sessionService', 'editBoxUtilsService', 'mediaService', 'styleService', 'tooltipService',
        function ($rootScope, $timeout, $compile, textSelectionService, caretService, domService, roleService, sessionService,
                  editBoxUtilsService, mediaService, styleService, tooltipService) {
            return {
                priority: -1,
                require: 'ngModel',
                scope : {
                    contentEditable : '=',
                    content         : '=ngModel',
                    customPanels    : '=panels',
                    type            : '=',
                    options         : '=',
                    onBlur          : '=',
                    placeholder     : '@',
                    uxChange        : '=uxChange'
                },
                replace: true,
                templateUrl: '/client/html/contentEditable/contentEditable.html',
                link: function (scope, element, attrs, ctrl) {

                    var contentEditableObj = $(' > .editableArea > [contenteditable]', element),
                        userSession = sessionService.getUserSession();

                    scope.isAdmin = function () { return roleService.hasAdminRole(userSession); };

                    // view -> model
                    scope.onKeyup = function () {
                        updateValue();
                        scope.showEditBox();
                    };

                    scope.isEditable = function() {
                        var hasRights = (scope.contentEditable !== undefined) ? scope.contentEditable : scope.isAdmin();
                        return hasRights && !contentEditableObj.attr('readonly') && !contentEditableObj.attr('disabled');
                    };

                    scope.$watch('content', function () {
                        //Update the DOM just if it's an external change of the model
                        //(i.e. cleaning the box after adding a comment)
                        //In practise, that means to update it if it's not being modified by the user,
                        //so it doesn't have the focus at this moment
                        if (!contentEditableObj.is(':focus')) {
                            contentEditableObj.html((scope.content) ? scope.content : ''); //Set the view value
                            compileElement($('a, img', contentEditableObj)); //compile the links to get their tooltip
                        }
                        handlePlaceholder();
                    });

                    scope.showEditBox = function () {
                        if (scope.isEditable() && textSelectionService.isSelection()) {
                            var selectedTextDomObj = textSelectionService.getSelectedTextDomObj(),
                                defaultPanels = [{ title: 'Content', type: 'richContent' }];
                            scope.model = styleService.getComputedStyleInRange(contentEditableObj, selectedTextDomObj);
                            forceTextSelection();
                            scope.panels = (scope.customPanels) ? scope.customPanels : defaultPanels;
                            scope.onSave = onSaveEditBox;
                            scope.onCancel = onCancelEditBox;
                            scope.onChange = onChangeEditBox;
                            editBoxUtilsService.showEditBox(scope, contentEditableObj, selectedTextDomObj);
                            scope.showActions = true;
                        }
                    };

                    scope.showEditBox2 = function (selectedMediaDomObj) {
                        var defaultPanels = [{ title: 'Select media', type: 'selectMedia' }];
                        if (scope.isEditable()) {
                            scope.internalData = {
                                mediaSize: getMediaSize(selectedMediaDomObj)
                            };
                            selectItem(selectedMediaDomObj);
                            scope.panels = (scope.customPanels) ? scope.customPanels : defaultPanels;
                            scope.onSave = function() {
                                onSaveEditBox2(selectedMediaDomObj);
                            };
                            scope.onCancel = function() {
                                onCancelEditBox2(selectedMediaDomObj);
                            };
                            scope.onChange = function() {
                                onChangeEditBox2(selectedMediaDomObj);
                            };
                            editBoxUtilsService.showEditBox(scope, contentEditableObj, selectedMediaDomObj);
                            scope.showActions = true;
                        }
                    };

                    scope.onClose = function() {
                        scope.showActions = false;
                    };

                    scope.$watch('newMedia', function(newVal) {
                        var imageId, imageObj, downloadUrl = mediaService.getDownloadUrl(newVal);
                        if(newVal && newVal._id) {
                            imageId = caretService.insertImage(downloadUrl, contentEditableObj, 'onMediaClick');
                            imageObj = $('#' + imageId, contentEditableObj);
                            compileElement(imageObj);
                            updateValue();
                        }
                    });

                    contentEditableObj.focus(function () {
                        scope.showActions = true;
                    });

                    scope.onMediaClick = function(mediaId) {
                        var imageObj = $('#' + mediaId, contentEditableObj);
                        scope.showEditBox2(imageObj);
                    };

                    contentEditableObj.blur(function () {
                        propagateChanges();
                    });

                    //noinspection JSUnresolvedVariable
                    if (scope.options && scope.options.allowMultiLine === false) {
                        //noinspection JSUnresolvedFunction
                        contentEditableObj.keypress(function (e) { return e.which !== 13; });
                    }

                    /** Private methods **/
                    function updateValue() {
                        if (contentEditableObj.html() === '<br>') { contentEditableObj.html(''); }
                        scope.content = contentEditableObj.html();     //Set the model value
                        handlePlaceholder();
                        ctrl.$setViewValue(scope.content);
                        if (scope.uxChange) { scope.uxChange(); }
                    }

                    function propagateChanges() {
                        //It's necessary to execute the blur actions with some delay to ensure the model is up to date before
                        //For instance, without it the showActions flag will be set to false immediately,
                        //and so the action buttons will never be reached as their keyup event is fired after this blur one
                        $timeout(function() {
                            if (!editBoxUtilsService.isAnyEditBoxVisible()) {
                                scope.showActions = false;
                                if (scope.onBlur) {
                                    scope.onBlur();
                                }
                            }
                        }, 250);
                    }

                    function forceTextSelection() {
                        textSelectionService.setFakeSelection();
                        textSelectionService.saveSelection(); //Save the current text selection to be able to restore if afterwards
                    }

                    function handlePlaceholder() {
                        scope.showPlaceholder = (scope.content === undefined || scope.content === '');
                    }

                    function setLinkTitles() {
                        var selLinkDomObj = textSelectionService.getSelectedLink(),
                            newTitle = selLinkDomObj.attr('title');
                        if(selLinkDomObj.size()) { //Update titles just if the edited element is as link
                            if(tooltipService.exists(selLinkDomObj)) {
                                updateLinkTitle(selLinkDomObj, newTitle); //If the link already existed, update it
                            } else {
                                compileElement(selLinkDomObj); //If the link has just been created, compile it
                            }
                            //Save a backup of the title so it would be regenerated afterwards if necessary
                            tooltipService.backupTitle(selLinkDomObj, newTitle);
                        }
                    }

                    function compileElement(elmObj) {
                        $compile(elmObj)(scope);
                    }

                    function updateLinkTitle(linkObj, newTitle) {
                        tooltipService.setTitle(newTitle, linkObj, true);
                        linkObj.removeAttr('title');
                    }

                    function onSaveEditBox() {
                        setLinkTitles(); //Set the titles of the links with the tooltip directive
                        textSelectionService.removeSelection(); //Remove text selection, if case
                        updateValue();
                        propagateChanges();
                    }

                    function onCancelEditBox() {
                        textSelectionService.removeSelection(); //Remove text selection, if case
                        propagateChanges();
                    }

                    function onChangeEditBox(styles) {
                        textSelectionService.restoreSelection(); //Restore saved selection
                        textSelectionService.setStylesToSelection(styles); //Apply styles physically
                        updateValue();
                    }

                    function onSaveEditBox2(selectedMediaDomObj) {
                        unselectItem(selectedMediaDomObj);
                        updateValue();
                        propagateChanges();
                    }

                    function onCancelEditBox2(selectedMediaDomObj) {
                        unselectItem(selectedMediaDomObj);
                    }

                    function onChangeEditBox2(selectedMediaDomObj) {
                        setMediaSize(selectedMediaDomObj, scope.internalData.mediaSize);
                    }

                    function selectItem(domObj) {
                        domObj.addClass('active');
                    }

                    function unselectItem(domObj) {
                        domObj.removeClass('active');
                    }

                    function setMediaSize(selectedMediaDomObj, mediaSize) {
                        selectedMediaDomObj.attr('size', mediaSize);
                    }

                    function getMediaSize(selectedMediaDomObj) {
                        return selectedMediaDomObj.attr('size');
                    }
                    /** End of private methods **/
                }
            };
        }]);
})();