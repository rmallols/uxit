(function () {
    'use strict';
    COMPONENTS.factory('tagService', ['crudService', 'constantsService', function (crudService, constantsService) {

        var tags;

        /**
         *
         *
         */
        function loadTags(callback) {
            crudService.get(constantsService.collections.tags, null, {}, function (tagsObj) {
                tags = tagsObj.results;
                if (callback) { callback(getTags()); }
            });
        }

        /**
         *
         *
         */
        function updateTag(tag, callback) {
            var data = { text : tag.text };
            crudService.update(constantsService.collections.tags, tag._id, data, function (updatedTag) {
                if (callback) {
                    callback(updatedTag);
                }
            });
        }

        /**
         *
         *
         * @returns {*}
         */
        function getTags() {
            return tags;
        }

        return {
            loadTags    : loadTags,
            getTags     : getTags,
            updateTag   : updateTag
        };
    }]);
})();
