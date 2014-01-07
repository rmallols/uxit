(function () {
    'use strict';

    COMPONENTS.factory('mediaService', ['crudService', 'objectService', 'constantsService',
    function (crudService, objectService, constantsService) {

        /**
         *  Creates new media item(s)
         *
         * @param {array}               mediaList   The list with the items that are going to be created
         * @param {function({object})}  callback    The returning function with the newly created media object
         */
        function createMedia(mediaList, callback) {
            var processedItems = 0;
            mediaList.forEach(function (media) {
                media.tags = mediaList.tags;
                updateMedia(media, function (newMedia) {
                    processedItems += 1;
                    if (callback && processedItems === mediaList.length) {
                        callback(newMedia);
                    }
                });
            });
        }

        /**
         *  Updates an existing media item
         *
         * @param   {object}                media       The media item that is going to be updated
         * @param   {function({object})}    callback    The returning function with the updated media object
         */
        function updateMedia(media, callback) {
            var data;
            if (media) {
                data = {
                    name    : media.name,
                    tags    : media.tags
                };
                crudService.update(constantsService.collections.media, media._id, data, function (newMedia) {
                    if (callback) { callback(newMedia); }
                });
            } else {
                if (callback) { callback({}); }
            }
        }

        /**
         * Gets a media object from its Id
         *
         * @param {string}              mediaId     The Id of the media which object is going to be retrieved
         *                                          If not defined, multiple results could be retrieved
         * @param {object}              params      The params to execute a more fine grained query
         * @param {function({object})}  callback    The returning function with the media object
         */
        function getMedia(mediaId, params, callback) {
            if(!params) { params = {}; }
            params.projection = { data: 0 }; //We're interested in the metadata of the image, but not on the binary data
            crudService.get(constantsService.collections.media, mediaId, params, function (media) {
                if (callback) { callback(media); }
            });
        }

        /**
         * Gets the download URL of given media object, based on it's Id and it's name
         *
         * @param   {*} media   The media of which the download URL is going to be retrieved.
         *                      This can be defined as the Id of the source or the whole object
         * @returns {*}         The download URL if the media object is valid. Null otherwise
         */
        function getDownloadUrl(media) {
            if(objectService.isObject(media)) {
                //Consider the name of the object. This will allow to download it with its name
                if(media && media._id) {
                    return 'media/' + media._id + '/' + media.name;
                }
            } else { //Don't consider the name of the object. This is enough i.e. for background images
                return 'media/' + media;
            }
            return null;
        }

        /**
         * Get the Html details snippet of a given media object
         *
         * @param   {object} media  The media of which the Html details snippet is going to be retrieved
         * @returns {string}        The Html details snippet
         */
        function getMediaHtmlDetails(media) {

            function getFriendlyMediaSize(size) {

                function normalizeDecimals(size) {
                    return (Math.floor(size*10)) / 10;
                }

                var gB = 1073741824, mB = 1048576, kB = 1024, friendlyMediaSize;
                if(size > gB) {
                    friendlyMediaSize =  normalizeDecimals(size / gB) + ' GB';
                } else if(size > mB) {
                    friendlyMediaSize =  normalizeDecimals(size / mB) + ' MB';
                } else if(size > kB) {
                    friendlyMediaSize =  normalizeDecimals(size / kB) + ' KB';
                } else {
                    friendlyMediaSize =  size + ' bytes';
                }
                return friendlyMediaSize;
            }
            if(media && media._id) {
                var downloadUrl = getDownloadUrl(media);
                var size = getFriendlyMediaSize(media.size);
                var dimensions = media.width + 'x' + media.height;
                return '<a href="' + downloadUrl + '" target="_blank">' + media.name + '</a><br/>(' + dimensions + ', ' + size + ')';
            }
        }

        /**
         * Gets the default avatar URL
         *
         * @returns {string} The default avatar URL
         */
        function getDefaultAvatarUrl() {
            return '/client/images/user.svg';
        }

        return {
            createMedia         : createMedia,
            updateMedia         : updateMedia,
            getMedia            : getMedia,
            getDownloadUrl      : getDownloadUrl,
            getMediaHtmlDetails : getMediaHtmlDetails,
            getDefaultAvatarUrl : getDefaultAvatarUrl
        };
    }]);
})();
