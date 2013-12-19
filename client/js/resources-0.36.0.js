(function() {

    function getScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }

    function getStyleSheet(url) {
        var fileExtension = url.split('.').pop(), rel = (fileExtension === 'less') ? '/less' : '';
        document.write('<link type="text/css" href="' + url + '" rel="stylesheet' + rel + '" />');
    }

    var clientPath = '/client', scriptPath = clientPath + '/js', libPath = clientPath + '/lib', minPath = clientPath + '/min';
    getScript('/socket.io/socket.io.js'); //Live message - socked library
    getScript('http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js');
    getScript('http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js');
    getScript('http://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js');

    //
    getScript(scriptPath + '/index.js');
    getScript(scriptPath + '/errorHandler.js');

    //
    getScript(minPath + '/lib.min.js');
    getStyleSheet(minPath + '/css.min.css');
    getScript(minPath + '/js.min.js');

    //TODO: APP DIRECTIVES, PENDING TO BE MIGRATED TO AN STILL NOT SUPPORTED LAZY LOADING STRATEGY
    getScript('/client/apps/loginApp/loginAppService.js');
    getScript('/client/apps/staticContentApp/staticContentAppService.js');
    getScript('/client/apps/linksApp/linksAppService.js');
    getScript('/client/apps/mapApp/mapAppService.js');
    getScript('/client/apps/menuApp/menuAppService.js');
    getScript('/client/apps/videoApp/videoAppService.js');
    getScript('/client/apps/imageApp/imageAppService.js');
    getScript('/client/apps/mediaCarouselApp/mediaCarouselAppService.js');
    getScript('/client/apps/bannerApp/bannerAppService.js');
    getScript('/client/apps/contentListApp/contentListAppService.js');
    getScript('/client/apps/userListApp/userListAppService.js');
    getScript('/client/apps/mediaListApp/mediaListAppService.js');
    getScript('/client/apps/socialApp/socialAppService.js');
    getScript('/client/apps/webGlApp/webGlAppService.js');
    getScript('/client/apps/iframeApp/iframeAppService.js');
    getScript('/client/apps/languageSelectApp/languageSelectAppService.js');
    getScript('/client/apps/slidesApp/slidesAppService.js');
    getScript('/client/apps/portalsAdminApp/portalsAdminAppService.js');
})();