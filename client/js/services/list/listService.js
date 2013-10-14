(function () {
    'use strict';
    COMPONENTS.factory('listService', [function () {

        var defaultOptions = {  pageSize: 10, skip: 0, pageActionPos: 2, searchable : true,
                                sort: { field: 'create.date', order : '1' } };

        /**
         * Gets the default value of a given property
         *
         * @param   {string} prop   The property of which the default value is going to be retrieved
         * @param   {object} config The object that stores the list setup
         * @returns {*}             The default value of the given property
         */
        function getDefaultValue(prop, config) {
            return (config[prop] !== undefined) ? config[prop] : defaultOptions[prop];
        }

        /**
         * Stores the item that is going to be detailed following the master-detail view approach
         *
         * @param {object}  listScope   The scope of the list
         * @param {string}  detailId    The Id of the element that is going to be detailed
         */
        function setDetailId(listScope, detailId) {
            listScope.detailId = detailId;
        }

        return {
            setDetailId: setDetailId,
            getDefaultValue: getDefaultValue
        };
    }]);
})();
