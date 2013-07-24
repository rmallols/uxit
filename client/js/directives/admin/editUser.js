COMPONENTS.directive('editUser', ['$routeParams', 'userService', 'mediaService', 'tagService', 'roleService', 'i18nService',
function ($routeParams, userService, mediaService, tagService, roleService, i18nService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/editUser.html',
        scope: {
            user        : '=model',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.roles         = roleService.getRoles();
            //Duplicate the array to avoid infecting the original languages object
            scope.languages = $.extend(true, [], i18nService.getLanguages());
            scope.languages.unshift({ code: '', text: i18nService('editUser.language.inheritBrowser')});
            if (scope.user) {
                if (!scope.user.media) {
                    scope.user.media = {};
                }
            }
            if(!scope.user || !scope.user.media) {
                scope.defaultAvatarUrl = mediaService.getDefaultAvatarUrl();
            }
            scope.onLayerSave = function (callback) {
                userService.updateUser(scope.user, function (result) {
                    callback(result);
                });
            };
        }
    };
}]);