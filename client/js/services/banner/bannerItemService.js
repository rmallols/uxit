(function () {
    'use strict';

    COMPONENTS.factory('bannerItemService', ['$rootScope', '$injector', 'stringService',
    function ($rootScope, $injector, stringService) {

        var gridSize = 50;

        /**
         * Gets the grid size that represents the minimum position change of each item
         *
         * @returns {number} The grid size
         */
        function getGridSize() {
            return gridSize;
        }

        /**
         * Gets the default value of a given type
         *
         * @param   {string} type   The identifier of the type which default value is going to be retrieved
         * @returns {string}        The default value of the given type
         */
        function getDefaultValue(type) {
            var itemService = getTypeService(type);
            return itemService.getDefaultValue();
        }

        /**
         * Gets the service of the given type
         *
         * @param   {string}    type    The identifier of the type which service is going to be retrieved
         * @returns {object}            The service of the given type
         */
        function getTypeService(type) {
            var serviceName = getServiceName(type);
            return $injector.get(serviceName);
        }

        /**
         * Updates the DOM based on the given model infornation
         *
         * @param {object}  item    The model of the element that is going to update the DOM
         * @param {object}  boxElm  The pointer to the DOM object where the content of the element is
         * @param {object}  borders The object that contains the information about
         *                          the vertical and horizontal border widths
         */
        function setDomCoordinatesFromModel(item, boxElm, borders) {
            boxElm.css('width', item.size.width - borders.horizontal);
            boxElm.css('height', item.size.height - borders.vertical);
            boxElm.css('top', item.position.top);
            boxElm.css('left', item.position.left);
        }

        /**
         * Updates the DOM based on the given DOM information
         *
         * @param {object}  item        The model of the element that is going to he updated
         *                              according to the DOM information
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the element is
         * @param {object}  borders     The object that contains the information about
         *                              the vertical and horizontal border widths
         */
        function setModelCoordinatesFromDom(item, contentElm, boxElm, borders) {
            item.size.width    = getNormalizedSize(contentElm.width(), boxElm.width(), borders.horizontal);
            item.size.height   = getNormalizedSize(contentElm.height(), boxElm.height(), borders.vertical);
            item.position.top  = parseInt(boxElm.css('top'), 10);
            item.position.left = parseInt(boxElm.css('left'), 10);
            if(!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        }

        /**
         * Updates the view and the model according to the state of the item
         *
         * @param {object}  item        The model of the element
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the element is
         * @param {object}  borders     The object that contains the information about
         *                              the vertical and horizontal border widths
         */
        function refresh(item, contentElm, boxElm, borders) {
            //Update the model before propagating the changes
            setModelCoordinatesFromDom(item, contentElm, boxElm, borders);
            //Here, the model is updated, but its still necessary to update the DOM
            //in order to get the changes refreshed
            setDomCoordinatesFromModel(item, boxElm, borders);
        }

        /**
         * Propagates the changes to the parent scope
         *
         * @param {function} onChangeFn The function to be executed
         */
        function propagateChanges(onChangeFn) {
            if(onChangeFn) {
                onChangeFn();
            }
        }

        /** Private methods **/
        function getNormalizedSize(contentSize, boxSize, borderBox) {
            if(contentSize > boxSize) {
                var heightSlots = Math.ceil(contentSize / gridSize);
                return heightSlots * gridSize;
            }
            return boxSize + borderBox;
        }

        function getServiceName(type) {
            return 'banner' + stringService.capitalize(type) + 'Service';
        }
        /** End of private methods **/

        return {
            getGridSize: getGridSize,
            getDefaultValue: getDefaultValue,
            getTypeService: getTypeService,
            refresh: refresh,
            setDomCoordinatesFromModel: setDomCoordinatesFromModel,
            setModelCoordinatesFromDom: setModelCoordinatesFromDom,
            propagateChanges: propagateChanges
        };
    }]);
})();
