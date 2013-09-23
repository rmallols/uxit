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
    getScript(libPath + '/angularJs/angular-sortable.js');
    getScript(libPath + '/nprogress/nprogress.js');

    //
    getScript(scriptPath + '/index.js');
    getScript(scriptPath + '/errorHandler.js');

    //
    getScript(minPath + '/lib.min.js');
    getStyleSheet(minPath + '/css.min.css');
    getScript(minPath + '/js.min.js');

    //TODO: APP DIRECTIVES, PENDING TO BE MIGRATED TO AN STILL NOT SUPPORTED LAZY LOADING STRATEGY
    getScript('/client/apps/loginApp/loginApp.js');
    getScript('/client/apps/staticContentApp/staticContentApp.js');
    getScript('/client/apps/linksApp/linksApp.js');
    getScript('/client/apps/mapApp/mapApp.js');
    getScript('/client/apps/menuApp/menuApp.js');
    getScript('/client/apps/videoApp/videoApp.js');
    getScript('/client/apps/imageApp/imageApp.js');
    getScript('/client/apps/mediaCarouselApp/mediaCarouselApp.js');
    getScript('/client/apps/bannerApp/bannerApp.js');
    getScript('/client/apps/contentListApp/contentListApp.js');
    getScript('/client/apps/userListApp/userListApp.js');
    getScript('/client/apps/mediaListApp/mediaListApp.js');
    getScript('/client/apps/socialApp/socialApp.js');
    getScript('/client/apps/webGlApp/webGlApp.js');
    getScript('/client/apps/iframeApp/iframeApp.js');
    getScript('/client/apps/languageSelectApp/languageSelectApp.js');
    getScript('/client/apps/slidesApp/slidesApp.js');
})();