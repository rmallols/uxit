(function () {
    'use strict';
    COMPONENTS.factory('addAppService', ['domService', function (domService) {

        var addAppPanelActive = false;

        /**
         *  Shows the add app panel
         *
         */
        function showAddAppPanel() {
            var addAppPanelObj          = $('#addAppPanel'),
                wrapperObj              = $('ul.pages'),
                collapsedViewObj        = $('> .collapsedView', addAppPanelObj),
                wrapperMarginLeft       = domService.getDomPercent(wrapperObj, 'margin-left'),
                wrapperWidth            = domService.getDomPercent(wrapperObj, 'width'),
                addAppPanelWidth        = domService.getDomPercent(collapsedViewObj, 'width');
            addAppPanelActive = true;
            wrapperObj.animate({
                width		: (wrapperWidth - addAppPanelWidth) + '%',
                marginLeft	: (addAppPanelWidth + wrapperMarginLeft) + '%',
                overflow    : 'visible'
            }, window.speed, function () {});
            addAppPanelObj.attr('state', 'collapsed');
        }

        /**
         * Hides the add app panel
         *
         */
        function hideAddAppPanel() {
            var addAppPanelObj          = $('#addAppPanel'),
                wrapperObj              = $('ul.pages'),
                collapsedViewObj        = $('> .collapsedView', addAppPanelObj),
                wrapperMarginLeft       = domService.getDomPercent(wrapperObj, 'margin-left'),
                wrapperWidth            = domService.getDomPercent(wrapperObj, 'width'),
                addAppPanelWidth        = domService.getDomPercent(collapsedViewObj, 'width');
            if (addAppPanelActive) {
                addAppPanelActive = false;
                wrapperObj.animate({
                    width		: (wrapperWidth + addAppPanelWidth) + '%',
                    marginLeft	: (wrapperMarginLeft - addAppPanelWidth) + '%'
                }, window.speed, function () {});
                addAppPanelObj.attr('state', 'hidden');
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
