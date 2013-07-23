(function () {
    'use strict';

    COMPONENTS.directive('uxShow', ['constantsService', function (constantsService) {
        return {
            terminal    : true,
            transclude  : 'element',
            priority    : 100,
            restrict    : 'A',
            compile     : function (tElement, tAttrs, transclude) {
                return function (scope, iElement, iAttr) {

                    var contentElm, contentScope;

                    //Watch all the changes on the ux-show="" expression
                    scope.$watch(iAttr.uxShow, function ifWatchAction(expValue) {
                        if (expValue) { //The expression has been evaluated to true -> show the transcluded content
                            showContent();
                        } else { //The expression has been evaluated to false -> remove the transcluded content
                            hideContent();
                        }
                    });

                    //Show the content of the wrapping element
                    function showContent() {
                        //Created a new scope for the transcluded content
                        contentScope = scope.$new();
                        //Compile the child content, taking the new scope as model reference
                        transclude(contentScope, function (clonedElm) {
                            iElement.after(clonedElm);
                            //Here's the tricky part. At this moment and due to some really strange reason,
                            //if the show element has been retrieved asyncronously (i.e. in the edit box),
                            //the clonedElm is still NOT in the DOM, so we cannot save the reference to it
                            //We need to wait 'some' time till some moment we guess it's already in the DOM
                            //RISK: If the show condition changes too fast (faster than the setTimeout delay)
                            //the hideContent() method will arrive before the contentElm reference is created.
                            //Consequently, the shown element won't be removed, and if it's shown again afterwards
                            //it will be shown twice. This situation could happen, for instance, if a user keeps
                            //the 'left' or 'right' keys in a edit box tabs too fast
                            //To avoid this problem, we match the delay with the minimum keyboard interval
                            setTimeout(function () {
                                contentElm = iElement.next();
                            }, constantsService.keyboardInterval);
                        });
                    }

                    //Hide the content of the wrapping element
                    function hideContent() {
                        //If the DOM content element exits, remove it
                        if (contentElm) {
                            contentElm.remove();
                            contentElm = null;
                        }
                        //Same with the scope of the content element
                        if (contentScope) {
                            contentScope.$destroy();
                            contentScope = null;
                        }
                    }
                };
            }
        };
    }]);
})();