(function () {
    'use strict';
    COMPONENTS.factory('tagService', ['crudService', 'constantsService', function (crudService, constantsService) {

        var tags;

        /**
         * Loads the available tags in the system
         *
         * @param {function} callback The function to be executed once all the tags have been fully loaded
         */
        function loadTags(callback) {
            crudService.get(constantsService.collections.tags, null, {}, function (tagsObj) {
                tags = tagsObj.results;
                if (callback) { callback(getTags()); }
            });
        }

        /**
         * Creates a new tag
         *
         * @param {string}      text        The text that represents the new tag
         * @param {function}    callback    The function to be executed once the tag has been fully created
         */
        function createTag(text, callback) {
            crudService.create(constantsService.collections.tags, { text: text }, function (newTag) {
                if (callback) { callback(newTag); }
            });
        }

        /**
         * Updates an existing tag
         *
         * @param {object}      tag         The object that represents the tag that is going to be updated
         * @param {function}    callback    The function to execute once the tag has been fully updated
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
         * Gets all the previously loaded tags
         *
         * @returns {array} The array of tags that have been previously loaded
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
