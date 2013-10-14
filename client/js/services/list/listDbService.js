(function () {
    'use strict';
    COMPONENTS.factory('listDbService', ['$injector', 'crudService', 'dbService', 'i18nService',
    'stringService',
    function ($injector, crudService, dbService, i18nService, stringService) {

        /**
         * Gets a list of items from a given collection
         *
         * @param {object}      options     The settings that will define the query to execute (collection, filters...)
         * @param {function}    callback    The function to execute once the list has been loaded
         */
        function loadList(options, callback) {
            var filter = {
                q           :   { $and: [
                                    { $or: getFilterOptions(options.searchText, options.searchTargets) },
                                    { $or: getTagOptions(options.tags) }
                                ]},
                currentPage :   options.currentPage,
                pageSize    :   options.pageSize,
                skip        :   options.skip,
                sort        :   options.sort,
                projection  :   options.projection
            };
            crudService.get(options.collection, null, filter, function (list) {
                if(callback) { callback(list); }
            });
        }

        /**
         * Creates a new item to the list
         *
         * @param {string} collection   The collection where the item to be created is
         * @param {string} item         The object that is going to be created
         */
        function createItem(collection, item) {
            var collectionService = $injector.get(collection + 'Service'),
                createFn = 'create' + stringService.capitalize(collection);
            if(collectionService[createFn]) { //Try to find a create specific method on the service
                collectionService[createFn](item);
            } else { //Use the generic create method if the specific one has not been found
                crudService.create(collection, item);
            }
        }

        /**
         * Deletes an item from the list
         *
         * @param {string} collection   The collection where the item to be removed is
         * @param {string} itemId       The Id of the item that is going to be removed
         */
        function deleteItem(collection, itemId) {
            crudService.delete(collection, itemId, null);
        }

        /** Private methods **/
        function getFilterOptions(searchText, searchTargets) {
            var filterOptions = [], currentLanguage = i18nService.getCurrentLanguage(),
                inexactSelector = dbService.getInexactSelector(searchText);
            searchTargets.forEach(function (searchTarget) {
                var filterOption = {}, i18nFilterOption = {}, i18nSearchTarget;
                filterOption[searchTarget] = inexactSelector;
                filterOptions.push(filterOption);     //Add plain text filter
                i18nSearchTarget = searchTarget + '.' + currentLanguage + '.text';
                i18nFilterOption[i18nSearchTarget] = inexactSelector;
                filterOptions.push(i18nFilterOption); //Add i18n text filter
            });
            return filterOptions;
        }

        function getTagOptions(tags) {
            var tagOptions = [];
            if (tags) {
                tags.forEach(function (tag) {
                    tagOptions[tagOptions.length] = { tag: tag };
                });
            }
            return tagOptions;
        }
        /** End of private methods **/

        return {
            loadList : loadList,
            createItem: createItem,
            deleteItem: deleteItem
        };
    }]);
})();
