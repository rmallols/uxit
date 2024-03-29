(function () {
    'use strict';

    COMPONENTS.factory('caretService', ['timerService', function (timerService) {

        /**
         * Inserts an image based on the given Url on the current caret position
         *
         * @param   {string}    url                 The Url where the image is
         * @param   {object}    contentEditableObj  The content editable object where the caret is
         * @param   {string}    onClickFn           The scope reference of the function to execute whenever the image is clicked
         * @return  {int}                           The Id of the the image that has just been created
         */
        function insertImage(url, contentEditableObj, onClickFn) {
            var  id = timerService.getRandomNumber(),
                clickFn = (onClickFn) ? 'ng-click="' + onClickFn + '(' + id + ')' : '';
            insertHtml('<img id="' + id + '" src="' + url + '" ' + clickFn + '"/>', contentEditableObj);
            return id;
        }

        /** Private methods **/
        function insertHtml(html, contentEditableObj) {
            contentEditableObj.focus();
            pasteHtml(html, false);
        }

        function pasteHtml(html, selectPastedContent) {
            var sel, range;
            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    // Range.createContextualFragment() would be useful here but is only relatively recently standardized
                    // and is not supported in some browsers (IE9, for one)
                    var el = document.createElement("div");
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    var firstNode = frag.firstChild;
                    range.insertNode(frag);

                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        if (selectPastedContent) {
                            range.setStartBefore(firstNode);
                        } else {
                            range.collapse(true);
                        }
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            } else if ( (sel = document.selection) && sel.type != "Control") {
                // IE < 9
                var originalRange = sel.createRange();
                originalRange.collapse(true);
                sel.createRange().pasteHTML(html);
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
        /** End of private methods **/

        return {
            insertImage: insertImage
        };
    }]);
})();