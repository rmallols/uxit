(function () {
    'use strict';

    COMPONENTS.factory('bannerTextService', ['bannerItemService', function (bIS) {

        /**
         * Gets the Html template of the text item
         *
         * @returns {string} The Html template of the text item
         */
        function getTemplate() {
            return '<div><label i18n-db="item.value"></label></div>';
        }

        /**
         * Gets the default value of the text item
         *
         * @returns {string} The default value of the text item
         */
        function getDefaultValue() {
            return 'menzit portal!';
        }

        /**
         * Gets the edit panels of the given text item
         *
         * @param {object}  item        The model of the text item which edit panels
         *                              are going to be retrieved
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the edit element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the text element is
         * @param {object}  borders     The object that contains the information about
         *                              the vertical and horizontal border widths
         * @param {number}  gridSize    The width of the grid the element is
         * @returns {Array}             The array of edit panels of the given text item
         */
        function getEditPanels(item, contentElm, boxElm, borders, gridSize) {
            return  [
                {
                    title: 'Content',
                    appBridge: true,
                    src:'bannerText',
                    view:'editText',
                    bindings: {
                        item: item
                    },
                    onLayer: {
                        change: function () {
                            bIS.refresh(item, contentElm, boxElm, borders, gridSize);
                        }
                    }
                }
            ];
        }

        /**
         * Executes the controller business logic of the bannerTextEditText template
         *
         * @param {object} scope The scope of the bannerTextEditText template
         */
        function editText(scope) {
            scope.contentChanged = function() {
                scope.onLayer.change();
            };
        }

        /** Private methods **/
        /** End of private methods **/

        return {
            getTemplate     : getTemplate,
            getDefaultValue : getDefaultValue,
            getEditPanels   : getEditPanels,
            editText        : editText
        };
    }]);
})();
