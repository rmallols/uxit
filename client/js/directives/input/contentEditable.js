(function() {
    'use strict';
    COMPONENTS.directive('contentEditable', ['$rootScope', 'textSelectionService', 'domService', 'roleService',
        'sessionService', 'editBoxUtilsService', 'styleService',
        function ($rootScope, textSelectionService, domService, roleService, sessionService, editBoxUtilsService, styleService) {
            return {
                priority: -1,
                require: 'ngModel',
                scope : {
                    content         : '=ngModel',
                    customPanels    : '=panels',
                    type            : '=',
                    options         : '=',
                    onBlur          : '=',
                    placeholder     : '@',
                    uxChange        : '=uxChange'
                },
                replace: true,
                templateUrl: '/client/html/input/contentEditable.html',
                link: function (scope, element, attrs, ctrl) {

                    var contentEditableObj = $(' > [contenteditable]', element),
                        userSession = sessionService.getUserSession();

                    scope.isAdmin = function () { return roleService.hasAdminRole(userSession); };

                    // view -> model
                    scope.onKeyup = function () { updateValue(); };

                    scope.isEditable = function() {
                        return scope.isAdmin() && !contentEditableObj.attr('readonly') && !contentEditableObj.attr('disabled');
                    };

                    scope.$watch('content', function () {
                        //Update the DOM just if it's an external change of the model
                        //(i.e. cleaning the box after adding a comment)
                        //In practise, that means to update it if it's not being modified by the user,
                        //so it doesn't have the focus at this moment
                        if (!contentEditableObj.is(':focus')) {
                            contentEditableObj.html(scope.content || ''); //Set the view value
                        }
                        handlePlaceholder();
                    });

                    scope.showEditBox = function () {
                        if (scope.isAdmin() && textSelectionService.isSelection()) {
                            var selectedTextDomObj = textSelectionService.getSelectedTextDomObj(),
                                defaultPanels = [{ title: 'Content', type: 'richContent' }];
                            scope.model = styleService.getComputedStyleInRange(contentEditableObj, selectedTextDomObj);
                            forceTextSelection();
                            scope.panels = (scope.customPanels) ? scope.customPanels : defaultPanels;
                            scope.onSave = function (/*styles*/) {
                                textSelectionService.removeSelection(); //Remove text selection, if case
                                updateValue();
                                //Send the blur event in a new thread as otherwise maybe the content has not been update yet
                                //So the content could be saved with the fake selection still active,
                                //so the selectin would persist forever
                                setTimeout(function () { contentEditableObj.blur(); }, 0);
                            };
                            scope.onCancel = function (/*styles*/) {
                                textSelectionService.removeSelection(); //Remove text selection, if case
                                contentEditableObj.blur();
                            };
                            scope.onChange = function (styles) {
                                textSelectionService.restoreSelection(); //Restore saved selection
                                textSelectionService.setStylesToSelection(styles); //Apply styles physically
                                updateValue();
                            };
                            editBoxUtilsService.showEditBox(scope, contentEditableObj, selectedTextDomObj);
                        }
                    };

                    contentEditableObj.blur(function () {
                        if (!editBoxUtilsService.isEditBoxVisible()) {
                            if (scope.onBlur) {
                                scope.onBlur();
                            }
                        }
                    });

                    //noinspection JSUnresolvedVariable
                    if (scope.options && scope.options.allowMultiLine === false) {
                        //noinspection JSUnresolvedFunction
                        contentEditableObj.keypress(function (e) { return e.which !== 13; });
                    }

                    function updateValue() {
                        if (contentEditableObj.html() === '<br>') { contentEditableObj.html(''); }
                        scope.content = contentEditableObj.html();     //Set the model value
                        handlePlaceholder();
                        ctrl.$setViewValue(scope.content);
                        if (scope.uxChange) { scope.uxChange(); }
                    }

                    function forceTextSelection() {
                        textSelectionService.setFakeSelection();
                        textSelectionService.saveSelection(); //Save the current text selection to be able to restore if afterwards
                    }

                    function handlePlaceholder() {
                        scope.showPlaceholder = (scope.content === undefined || scope.content === '');
                    }
                }
            };
        }]);
})();