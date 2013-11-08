(function () {
    'use strict';

    COMPONENTS.factory('bannerTextService', ['constantsService', function (cS) {

        function getTemplate() {
            //return '<div>--{{item}}<div ng-bind-html-unsafe="item.value" ng-style="item.styles"></div></div>';
            //return '<div ng-style="item.styles"><label i18n-db="item.value"></label></div>';
            return '<div><label i18n-db="item.value"></label></div>';
        }

        function initItemModel(item) {
              if(!item.styles) {
                  item.styles = {};
              }
        }

        function getEditPanels(item) {
            return  [
                {
                    title: 'Content',
                    type: 'richContent',
                    appBridge: true,
                    src:'bannerText',
                    view:'editText',
                    newModel: item,
                    onLayer: {
                        change: function (bla) {
                            console.log("CHANGE!!", bla);
                        }
                    }
                }/*,
                {
                    title: 'Content',
                    type: 'richContent',
                    onLayer: {
                        change: function (styles) {
                            angular.extend(item.styles, styles);
                        }
                    }
                }*/
            ];
        }

        function onResizeItem(elem, item, newBoxSize, oldSize) {
            var prevFontSize    = getPrevFontSize(item, elem),
                changeRatio     = (newBoxSize / oldSize),
                newFontSize     = parseInt(prevFontSize) * changeRatio,
                newLineHeight   = 1 + ((changeRatio - 1) * 0.02);
            item.styles.fontSize    = newFontSize + '%';
            item.styles.lineHeight  = newLineHeight + 'em';

            console.log("ITEM.VALUE?", item.value);
        }

        function getPrevFontSize(item, elem) {
            var prevFontSize;
            if(item.styles.fontSize) {
                prevFontSize    = item.styles.fontSize
            } else {
                prevFontSize = (parseInt(elem.css('font-size')) / cS.defaultFontSize) * 100;
            }
            return prevFontSize;
        }

        function editText() {
            console.log("YEAAA EDIT!")
        }

        return {
            getTemplate     : getTemplate,
            getEditPanels   : getEditPanels,
            onResizeItem    : onResizeItem,
            editText        : editText,
            initItemModel   : initItemModel
        };
    }]);
})();
