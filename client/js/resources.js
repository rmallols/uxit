//Global variables
//Use this ONLY to wire with LESS variables
window.speed = 150;

(function () {
    'use strict';

    function getScript(url) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
    }

    function getStyleSheet(url) {
        var fileExtension = url.split('.').pop(), rel = (fileExtension === 'less') ? '/less' : '';
        document.write('<link type="text/css" href="' + url + '" rel="stylesheet' + rel + '" />');
    }

    var clientPath = '/client', scriptPath = clientPath + '/js', styleSheetPath = clientPath + '/css',
        servicePath = scriptPath + '/services', libPath = clientPath + '/lib', directivePath = scriptPath + '/directives';

    //External libraries
    getScript('/socket.io/socket.io.js'); //Live message - socked library
    getStyleSheet(libPath + '/foundation/foundation-4.2.3.custom.css');
    getScript(libPath + '/jQuery/jquery-2.0.2.min.js');
    getScript(libPath + '/jQuery/jquery-ui-1.10.3.custom.min.js');
    getScript(libPath + '/angularJs/angular-1.0.7.min.js');
    getScript(libPath + '/angularJs/angular-sortable.js');
    getScript(libPath + '/fabricJs/fabric.0.9.15.min.js');
    getScript(libPath + '/i18n/jquery.i18n.properties-min-1.0.9.js');
    getScript(libPath + '/yepnope/yepnope.1.5.4-min.js');
    getScript(libPath + '/rangy/rangy-core.js');
    getScript(libPath + '/rangy/rangy-cssclassapplier.js');
    getScript(libPath + '/rangy/rangy-selectionsaverestore.js');
    getScript(libPath + '/rangy/rangy-serializer.js');
    getScript(libPath + '/rangy/rangy-textrange.js');
    getScript(libPath + '/form/jquery.form.js');
    getScript(libPath + '/morrisJs/raphael-2.1.0.min.js');
    getScript(libPath + '/morrisJs/morris-0.4.1.min.js');
    getStyleSheet(libPath + '/morrisJs/morris-0.4.1.min.css');
    getStyleSheet(libPath + '/select2/select2.css');
    getScript(libPath + '/select2/select2.min.js');
    getStyleSheet(libPath + '/powerTip/jquery.powertip.min.css');
    getScript(libPath + '/powerTip/jquery.powertip.min.js');
    getScript(libPath + '/mousetrap/mousetrap.min.js');
    getScript(libPath + '/fullscreen/jquery.fullscreen-min.js');
    getStyleSheet(libPath + '/miniColors/jquery.minicolors.css');
    getScript(libPath + '/miniColors/jquery.minicolors.js');
    getStyleSheet(libPath + '/iCheck/skins/square/blue.css');
    getScript(libPath + '/iCheck/jquery.icheck-0.9.1.min.js');

    //Core resources
    getStyleSheet(styleSheetPath + '/main.less');
    getScript(scriptPath + '/index.js');
    getScript(scriptPath + '/errorHandler.js');
    getScript(scriptPath + '/controllers/LoginController.js');
    getScript(scriptPath + '/controllers/PortalController.js');

    //Services
    getScript(servicePath + '/portalService.js');
    getScript(servicePath + '/pageService.js');
    getScript(servicePath + '/crudService.js');
    getScript(servicePath + '/sessionService.js');
    getScript(servicePath + '/dbService.js');
    getScript(servicePath + '/roleService.js');
    getScript(servicePath + '/contentService.js');
    getScript(servicePath + '/userService.js');
    getScript(servicePath + '/tagService.js');
    getScript(servicePath + '/availableAppsService.js');
    getScript(servicePath + '/ajaxService.js');
    getScript(servicePath + '/constantsService.js');
    getScript(servicePath + '/undeployService.js');
    getScript(servicePath + '/stdService.js');
    getScript(servicePath + '/globalMsgService.js');
    getScript(servicePath + '/i18n/i18nService.js');
    getScript(servicePath + '/i18n/i18nDbService.js');
    getScript(servicePath + '/app/appService.js');
    getScript(servicePath + '/app/addAppService.js');
    getScript(servicePath + '/app/sortableAppService.js');
    getScript(servicePath + '/app/resizableAppService.js');
    getScript(servicePath + '/layout/rowService.js');
    getScript(servicePath + '/layout/colService.js');
    getScript(servicePath + '/communication/emailService.js');
    getScript(servicePath + '/communication/liveMessageService.js');
    getScript(servicePath + '/utils/keyboardService.js');
    getScript(servicePath + '/utils/domService.js');
    getScript(servicePath + '/utils/canvasService.js');
    getScript(servicePath + '/utils/stringService.js');
    getScript(servicePath + '/utils/textSelectionService.js');
    getScript(servicePath + '/utils/dateService.js');
    getScript(servicePath + '/utils/arrayService.js');
    getScript(servicePath + '/utils/styleService.js');
    getScript(servicePath + '/utils/timerService.js');
    getScript(servicePath + '/utils/editBoxUtilsService.js');
    getScript(servicePath + '/utils/mediaService.js');
    getScript(servicePath + '/utils/validationService.js');

    //Directives
    getScript(directivePath + '/login.js');
    getScript(directivePath + '/pages.js');
    getScript(directivePath + '/app/app.js');
    getScript(directivePath + '/app/appHeader.js');
    getScript(directivePath + '/i18n/i18n.js');
    getScript(directivePath + '/i18n/i18nDb.js');
    getScript(directivePath + '/i18n/i18nDbInput.js');
    getScript(directivePath + '/sortable/sortableApp.js');
    getScript(directivePath + '/sortable/sortableAddApp.js');
    getScript(directivePath + '/resizable/resizableApp.js');
    getScript(directivePath + '/utils/listEdit.js');
    getScript(directivePath + '/utils/listActions.js');
    getScript(directivePath + '/utils/boxSortable.js');
    getScript(directivePath + '/utils/uxEvents.js');
    getScript(directivePath + '/utils/uxShow.js');
    getScript(directivePath + '/list/list.js');
    getScript(directivePath + '/list/mediaList.js');
    getScript(directivePath + '/list/userList.js');
    getScript(directivePath + '/list/contentList.js');
    getScript(directivePath + '/list/tagList.js');
    getScript(directivePath + '/list/nestedPagesWrapper.js');
    getScript(directivePath + '/list/nestedItemsWrapper.js');
    getScript(directivePath + '/list/nestedItems.js');
    getScript(directivePath + '/media/mediaPopup.js');
    getScript(directivePath + '/feedback/globalMsg.js');
    getScript(directivePath + '/feedback/tooltip.js');
    getScript(directivePath + '/input/contenteditable.js');
    getScript(directivePath + '/input/autoComplete.js');
    getScript(directivePath + '/input/fileUploader.js');
    getScript(directivePath + '/input/comments.js');
    getScript(directivePath + '/input/rating.js');
    getScript(directivePath + '/input/colorPicker.js');
    getScript(directivePath + '/input/checkbox.js');
    getScript(directivePath + '/input/radio.js');
    getScript(directivePath + '/validation/mandatory.js');
    getScript(directivePath + '/validation/emailMandatory.js');
    getScript(directivePath + '/validation/passwordMandatory.js');
    getScript(directivePath + '/charts/lineChart.js');
    getScript(directivePath + '/charts/pieChart.js');
    getScript(directivePath + '/admin/adminPanel.js');
    getScript(directivePath + '/admin/addAppPanel.js');
    getScript(directivePath + '/admin/edit.js');
    getScript(directivePath + '/admin/editBox.js');
    getScript(directivePath + '/admin/verticalTabs.js');
    getScript(directivePath + '/admin/editGeneral.js');
    getScript(directivePath + '/admin/editPages.js');
    getScript(directivePath + '/admin/createMedia.js');
    getScript(directivePath + '/admin/editMedia.js');
    getScript(directivePath + '/admin/editMediaList.js');
    getScript(directivePath + '/admin/createContent.js');
    getScript(directivePath + '/admin/editContent.js');
    getScript(directivePath + '/admin/editContentList.js');
    getScript(directivePath + '/admin/createUser.js');
    getScript(directivePath + '/admin/editUser.js');
    getScript(directivePath + '/admin/editCurrentUser.js');
    getScript(directivePath + '/admin/editUserList.js');
    getScript(directivePath + '/admin/editTag.js');
    getScript(directivePath + '/admin/editTagList.js');
    getScript(directivePath + '/admin/editNotifications.js');
    getScript(directivePath + '/admin/richContent.js');
    getScript(directivePath + '/admin/editStyles.js');
    getScript(directivePath + '/admin/editAppGeneral.js');
    getScript(directivePath + '/admin/editAppStyles.js');
    getScript(directivePath + '/admin/stats.js');
    getScript(directivePath + '/admin/styles.js');

    //Load the LESS script, just after all the LESS stylesheets are loaded
    getScript(libPath + '/less/less-1.3.0.min.js');

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
}());