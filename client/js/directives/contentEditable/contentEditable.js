(function() {
    'use strict';
    COMPONENTS.directive('contentEditable', [ 'caretService', 'roleService', 'sessionService', 'mediaService',
    'contentEditableService', 'contentEditableRichContentService', 'contentEditableSelectMediaService',
    function (caretService, roleService, sessionService, mediaService, contentEditableService,
              contentEditableRichContentService, contentEditableSelectMediaService) {
        return {
            priority: -1,
            require: 'ngModel',
            scope : {
                contentEditable : '=',
                content         : '=ngModel',
                customPanels    : '=panels',
                options         : '=',
                placeholder     : '@',
                onBlur          : '&',
                uxChange        : '&'
            },
            replace: true,
            templateUrl: 'contentEditable.html',
            link: function (scope, element, attrs, ngModelCtrl) {

                var cEDomObj = $(' > .editableArea > [contenteditable]', element),
                    userSession = sessionService.getUserSession();

                scope.isCreator = function () { return roleService.hasCreatorRole(userSession); };

                // view -> model
                scope.onKeyup = function () {
                    contentEditableService.updateValue(scope, cEDomObj, ngModelCtrl);
                    scope.showEditBox();
                };

                scope.isEditable = function() {
                    //noinspection JSValidateTypes
                    var hasRights = (scope.contentEditable !== undefined) ? scope.contentEditable : scope.isCreator();
                    return hasRights && !element.attr('readonly') && !element.attr('disabled');
                };

                scope.$watch('content', function () {
                    //Update the DOM just if it's an external change of the model
                    //(i.e. cleaning the box after adding a comment)
                    //In practise, that means to update it if it's not being modified by the user,
                    //so it doesn't have the focus at this moment
                    if (!cEDomObj.is(':focus')) {
                        cEDomObj.html((scope.content) ? scope.content : ''); //Set the view value
                        //compile the links to get their tooltip
                        contentEditableService.compileElement(scope, $('a, img', cEDomObj));
                    }
                    contentEditableService.handlePlaceholder(scope);
                });

                scope.showEditBox = function () {
                    contentEditableRichContentService.showEditBox(scope, cEDomObj, ngModelCtrl);
                };

                scope.showEditBox2 = function (sMDomObj) {
                    contentEditableSelectMediaService.showEditBox(scope, cEDomObj, sMDomObj, ngModelCtrl);
                };

                scope.onClose = function() {
                    scope.showActions = false;
                };

                scope.$watch('newMedia', function(newVal) {
                    var imageId, imageObj, downloadUrl = mediaService.getDownloadUrl(newVal);
                    if(newVal && newVal._id) {
                        imageId = caretService.insertImage(downloadUrl, cEDomObj, 'onMediaClick');
                        imageObj = $('#' + imageId, cEDomObj);
                        contentEditableService.compileElement(scope, imageObj);
                        contentEditableService.updateValue(scope, cEDomObj, ngModelCtrl);
                    }
                });

                cEDomObj.focus(function () {
                    scope.showActions = true;
                });

                scope.onMediaClick = function(mediaId) {
                    var imageObj = $('#' + mediaId, cEDomObj);
                    scope.showEditBox2(imageObj);
                };

                cEDomObj.blur(function () {
                    contentEditableService.propagateChanges(scope);
                });

                //noinspection JSUnresolvedVariable
                if (scope.options && scope.options.allowMultiLine === false) {
                    //noinspection JSUnresolvedFunction
                    cEDomObj.keypress(function (e) { return e.which !== 13; });
                }

                /** Private methods **/
                /** End of private methods **/
            }
        };
    }]);
})();