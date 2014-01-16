(function () {
    'use strict';

    COMPONENTS.factory('bannerItemService', ['$rootScope', '$injector', 'stringService',
    function ($rootScope, $injector, stringService) {

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
         */
        function setDomCoordinatesFromModel(item, boxElm) {
            boxElm.css('width', item.size.width + '%');
            boxElm.css('height', item.size.height + '%');
            boxElm.css('top', item.position.top + '%');
            boxElm.css('left', item.position.left + '%');
        }

        /**
         * Updates the DOM based on the given DOM information
         *
         * @param {object}  item            The model of the element that is going to he updated
         *                                  according to the DOM information
         * @param {object}  contentElm      The pointer to the DOM object where the content
         *                                  of the element is
         * @param {object}  boxElm          The pointer to the DOM object where the box
         *                                  that wraps the element is
         * @param {number}  gridSize        The width of the grid the element is
         * @param {object}  bCDimensions    The dimensions of the parent banner canvas
         */
        function setModelCoordinatesFromDom(item, contentElm, boxElm, gridSize, bCDimensions) {
            var width = (boxElm.width() > contentElm.width()) ? boxElm.width() : contentElm.width(),
                height = (boxElm.height() > contentElm.height()) ? boxElm.height() : contentElm.height();
            item.size.width = Math.round(((width / bCDimensions.width) * 100));
            item.size.height = Math.round(((height / bCDimensions.height) * 100));
            item.position.top  = Math.round(((parseInt(boxElm.css('top'), 10) / bCDimensions.height) * 100));
            item.position.left = Math.round(((parseInt(boxElm.css('left'), 10) / bCDimensions.width) * 100));
            fitToGrid(item, gridSize);
            if(!$rootScope.$$phase) { $rootScope.$apply(); }
        }

        /**
         * Updates the view and the model according to the state of the item
         *
         * @param {object}  item        The model of the element
         * @param {object}  contentElm  The pointer to the DOM object where the content
         *                              of the element is
         * @param {object}  boxElm      The pointer to the DOM object where the box
         *                              that wraps the element is
         * @param {number}  gridSize    The width of the grid the element is
         * @param {object}  bCDimensions    The dimensions of the parent banner canvas
         */
        function refresh(item, contentElm, boxElm, gridSize, bCDimensions) {
            //Update the model before propagating the changes
            setModelCoordinatesFromDom(item, contentElm, boxElm, gridSize, bCDimensions);
            //Here, the model is updated, but its still necessary to update the DOM
            //in order to get the changes refreshed
            setDomCoordinatesFromModel(item, boxElm);
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

        /**
         * Determines the default size of each new item taken as a reference a given grid size
         *
         * @param   {number} gridSize   The current grid size
         * @returns {number}            The default size of each new item
         */
        function getDefaultItemSize(gridSize) {
            return 2 * gridSize;
        }

        /** Private methods **/
        function getServiceName(type) {
            return 'banner' + stringService.capitalize(type) + 'Service';
        }

        function fitToGrid(item, gridSize) {
            var gapToHGrid  = item.size.width % gridSize,
                gapToVGrid  = item.size.height % gridSize;
            if(gapToHGrid)  { item.size.width   = item.size.width - gapToHGrid + gridSize; }
            if(gapToVGrid)  { item.size.height  = item.size.height - gapToVGrid + gridSize; }
        }
        /** End of private methods **/

        return {
            getDefaultValue: getDefaultValue,
            getTypeService: getTypeService,
            refresh: refresh,
            setDomCoordinatesFromModel: setDomCoordinatesFromModel,
            setModelCoordinatesFromDom: setModelCoordinatesFromDom,
            propagateChanges: propagateChanges,
            getDefaultItemSize: getDefaultItemSize
        };
    }]);
})();
