(function () {
    'use strict';

    COMPONENTS.factory('bannerImageService', ['mediaService', function (mediaService) {

        /**
         * Gets the Html template of the image item
         *
         * @returns {string} The Html template of the image item
         */
        function getTemplate() {
            return '<img ng-src="{{item.value}}" />';
        }

        /**
         * Gets the default value of the image item
         *
         * @returns {string} The default value of the image item
         */
        function getDefaultValue() {
            return '/client/images/logo.svg';
        }

        /**
         * Gets the edit panels of the given image item
         *
         * @param {object}  item        The model of the text item which edit panels
         *                              are going to be retrieved
         * @returns {Array}             The array of edit panels of the given text item
         */
        function getEditPanels(item) {
            return  [{
                title: 'Select media',
                src: 'selectMedia',
                config: { editSize: false },
                bindings: { mediaSize: '' },
                onLayer: {
                    change: function (media) {
                        item.value = mediaService.getDownloadUrl(media);
                    }
                }}
            ];
        }

        return {
            getTemplate     : getTemplate,
            getDefaultValue : getDefaultValue,
            getEditPanels   : getEditPanels
        };
    }]);
})();
