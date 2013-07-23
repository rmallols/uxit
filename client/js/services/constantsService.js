(function () {
    'use strict';
    COMPONENTS.factory('constantsService', [function () {
        return {
            appKey          : 'app',
            appsPath        : '/client/apps',
            defaultCategory : 'Others',
            collections     : {
                portal              : 'portal',
                pages               : 'pages',
                availableApps       : 'availableApps',
                content             : 'content',
                media               : 'media',
                users               : 'users',
                roles               : 'roles',
                comments            : 'comments',
                ratings             : 'ratings',
                tags                : 'tags',
                languages           : 'languages'
            },
            roles           : {
                guest       : 'guest',
                reader      : 'reader',
                creator     : 'creator',
                admin       : 'admin'
            },
            templates		: {
                view		: 'view',
                edit		: 'edit',
                help		: 'help'
            },
            renderTypes     : {
                dom         : 'dom',
                canvas      : 'canvas'
            },
            pageTypes       : {
                apps        : 'apps',
                externalLink: 'externalLink'
            },
            blurOpacity     : 0.3,
            keyboardInterval: 100 //minimum time between different keyboard events
        };
    }]);
})();
