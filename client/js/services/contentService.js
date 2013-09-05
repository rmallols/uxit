(function () {
    'use strict';
    COMPONENTS.factory('contentService', ['crudService', 'constantsService', function (crudService, constantsService) {

        /**
         * Creates a new content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been created
         */
        function createContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.create(constantsService.collections.content, data, function (newContent) {
                    if (callback) {
                        callback(newContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Updates an existing content article
         *
         * @param {object}      content     The elements that define the content
         * @param {function}    callback    The function that will be executed once the content has been updated
         */
        function updateContent(content, callback) {
            var data;
            if (content && (content.title || content.summary || content.content)) {
                data = {
                    title   : content.title,
                    summary : content.summary,
                    content : content.content,
                    tags    : content.tags
                };
                crudService.update(constantsService.collections.content, content._id, data, function (updatedContent) {
                    if (callback) {
                        callback(updatedContent);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         * Gets content item(s)
         *
         * @param {string}      contentId   The Id of the content that is going to be retrieved.
         *                                  If not defined, multiple results could be retrieved
         * @param {object}      params      The params to execute a more fine grained query
         * @param {function}    callback    The function that will be executed once the content has been retrieved
         */
        function getContent(contentId, params, callback) {
            if(!params) { params = {}; }
            crudService.get(constantsService.collections.content, contentId, params, function (content) {
                if (callback) {
                    callback(content);
                }
            });
        }

        return {
            createContent: createContent,
            updateContent: updateContent,
            getContent: getContent
        };
    }]);
})();
