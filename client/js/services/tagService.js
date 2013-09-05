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
         * @param text
         * @param callback
         */
        function createTag(text, callback) {
            crudService.create(constantsService.collections.tags, { text: text }, function (newTag) {
                if (callback) { callback(newTag); }
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
            createTag   : createTag,
            getTags     : getTags,
            updateTag   : updateTag
        };
    }]);
})();
