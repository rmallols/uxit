(function () {
    'use strict';

    COMPONENTS.factory('bannerImageService', ['mediaService', function (mediaService) {

        function getTemplate() {
            return '<img ng-src="{{item.value}}" />';
        }

        function getEditPanels(item) {
            return  [{
                title: 'Select media',
                type: 'selectMedia',
                config: { editSize: false },
                onLayer: {
                    change: function (media) {
                        item.value = mediaService.getDownloadUrl(media);
                    }
                }}
            ];
        }

        function onResizeItem(elem, item, newBoxSize, oldSize) {
            elem.width('100%');
            //console.log("RES!", )
        }

        return {
            getTemplate     : getTemplate,
            getEditPanels   : getEditPanels,
            onResizeItem    : onResizeItem
        };
    }]);
})();
