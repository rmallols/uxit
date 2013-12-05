(function () {
    'use strict';
    COMPONENTS.factory('addAppService', ['pageService', 'domService', function (pageService, domService) {

        var addAppPanelActive = false;

        /**
         *  Shows the add app panel
         *
         */
        function showAddAppPanel() {
            var addAppPanelObj  = $('#addAppPanel'),
                wrapperObj      = pageService.getMainScrollingElm();
            addAppPanelObj.attr('state', 'collapsed');
            wrapperObj.addClass('addAppPanelOpen');
            addAppPanelActive = true;
        }

        /**
         * Hides the add app panel
         *
         */
        function hideAddAppPanel() {
            var addAppPanelObj  = $('#addAppPanel'),
                wrapperObj      = pageService.getMainScrollingElm();
            if (addAppPanelActive) {
                addAppPanelActive = false;
                addAppPanelObj.attr('state', 'hidden');
                wrapperObj.removeClass('addAppPanelOpen');
            }
        }

        /**
         * Toggles the add app panel
         *
         */
        function toggleAddAppPanel() {
            if (addAppPanelActive) {
                hideAddAppPanel();
            } else {
                showAddAppPanel();
            }
        }

        /**
         * Determines if the add app panel is visible or not
         *
         * @returns {boolean} True if the add app panel is visible. False otherwise
         */
        function isAddAppPanelActive() {
            return addAppPanelActive;
        }

        return {
            showAddAppPanel     : showAddAppPanel,
            hideAddAppPanel     : hideAddAppPanel,
            toggleAddAppPanel   : toggleAddAppPanel,
            isAddAppPanelActive : isAddAppPanelActive
        };
    }]);
})();
