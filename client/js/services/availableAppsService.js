(function () {
    'use strict';
    COMPONENTS.factory('availableAppsService', ['$rootScope', 'crudService', 'constantsService',
    function ($rootScope, crudService, constantsService) {

        var availableApps, categories = [];

        /**
         * Loads the available apps from the repository
         *
         * @param {Object} callback function with the retrieved available apps list
         */
        function loadAvailableApps(callback) {
            var filter  = { sort: { field: 'category', order : '-1' } };
            crudService.get(constantsService.collections.availableApps, null, filter, function (availableApps) {
                setAvailableApps(availableApps.results);
                if (callback) { callback(getAvailableApps()); }
                $rootScope.$broadcast('availableAppsLoaded');
            });
        }

        /**
         * Gets the previously loaded available apps
         *
         * @returns {object} The arrays of indexes and available apps
         */
        function getAvailableApps() {
            return availableApps;
        }

        /**
         * Gets the current categories of apps
         *
         * @returns {Array} The list of available categories
         */
        function getCategories() {
            return categories;
        }

        /** Private methods **/
        function setAvailableApps(retrievedAvailableApps) {
            var index = 0;
            //Store an index of model to ease the access afterwards (for instance, from the portlet directive)
            availableApps = {
                index   : {},
                model   : []
            };
            retrievedAvailableApps.forEach(function (retrievedAvailableApp) {
                categorizeApp(retrievedAvailableApp);
                availableApps.index[retrievedAvailableApp.id] = index;
                availableApps.model.push(retrievedAvailableApp);
                index += 1;
            });
        }

        function categorizeApp(availableApp) {
            if (!availableApp.category) { //Set the default category, if the app hasn't it
                availableApp.category = constantsService.defaultCategory;
            }
            if (!categories[availableApp.category]) { //Identify the first app of its category
                categories[availableApp.category] = true;
                availableApp.firstInCategory = true;
            }
        }
        /** End of private methods **/

        return {
            loadAvailableApps: loadAvailableApps,
            getAvailableApps: getAvailableApps,
            getCategories: getCategories
        };
    }]);
})();
