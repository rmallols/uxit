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
    getScript(libPath + '/jQuery/jquery-2.0.2.min.js');
    getScript(libPath + '/jQuery/jquery-ui-1.10.3.custom.min.js');
    getScript(libPath + '/angularJs/angular-1.0.7.min.js');
    getScript(libPath + '/angularJs/angular-sortable-0.0.1.js');
    getScript(libPath + '/i18n/jquery.i18n.properties-1.0.9.js');
    getScript(libPath + '/yepnope/yepnope-1.5.4.js');
    getScript(libPath + '/rangy/rangy-core.js');
    getScript(libPath + '/rangy/rangy-cssclassapplier.js');
    getScript(libPath + '/rangy/rangy-selectionsaverestore.js');
    getScript(libPath + '/rangy/rangy-serializer.js');
    getScript(libPath + '/rangy/rangy-textrange.js');
    getScript(libPath + '/form/jquery.form-3.25.0.js');
    getScript(libPath + '/morrisJs/raphael-2.1.2.js');
    getScript(libPath + '/morrisJs/morris-0.4.3.js');
    getScript(libPath + '/select2/select2-3.4.5.js');
    getScript(libPath + '/powerTip/jquery.powertip-1.2.0.js');
    getScript(libPath + '/mousetrap/mousetrap-1.4.6.js');
    getScript(libPath + '/fullscreen/jquery.fullscreen-1.1.4.js');
    getScript(libPath + '/miniColors/jquery.minicolors-2.1.1.js');
    getScript(libPath + '/iCheck/jquery.icheck-0.9.1.js');
    getScript(libPath + '/nprogress/nprogress-0.1.2.js');
    getScript(libPath + '/date/date.js');
    getScript(libPath + '/date/i18n/jquery.ui.datepicker-es.js');

    //Core resources
    getStyleSheet('main.css');
    getScript(scriptPath + '/index.js');
    getScript(scriptPath + '/templates.js');
    getScript(scriptPath + '/errorHandler.js');
    getScript(scriptPath + '/controllers/LoginCtrl.js');
    getScript(scriptPath + '/controllers/PortalCtrl.js');
    getScript(scriptPath + '/controllers/ErrorCtrl.js');

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
    getScript(servicePath + '/commentsService.js');
    getScript(servicePath + '/availableAppsService.js');
    getScript(servicePath + '/statsService.js');
    getScript(servicePath + '/rateService.js');
    getScript(servicePath + '/ajaxService.js');
    getScript(servicePath + '/constantsService.js');
    getScript(servicePath + '/undeployService.js');
    getScript(servicePath + '/metaService.js');
    getScript(servicePath + '/portalsAdminService.js');
    getScript(servicePath + '/feedback/stdService.js');
    getScript(servicePath + '/feedback/tooltipService.js');
    getScript(servicePath + '/feedback/globalMsgService.js');
    getScript(servicePath + '/feedback/loadingService.js');
    getScript(servicePath + '/i18n/i18nService.js');
    getScript(servicePath + '/i18n/i18nDbService.js');
    getScript(servicePath + '/app/appService.js');
    getScript(servicePath + '/app/addAppService.js');
    getScript(servicePath + '/app/sortableAppService.js');
    getScript(servicePath + '/app/resizableAppService.js');
    getScript(servicePath + '/banner/bannerItemService.js');
    getScript(servicePath + '/list/listService.js');
    getScript(servicePath + '/list/listDbService.js');
    getScript(servicePath + '/list/listSelectService.js');
    getScript(servicePath + '/contentEditable/contentEditableService.js');
    getScript(servicePath + '/contentEditable/contentEditableRichContentService.js');
    getScript(servicePath + '/contentEditable/contentEditableSelectMediaService.js');
    getScript(servicePath + '/layout/rowService.js');
    getScript(servicePath + '/layout/colService.js');
    getScript(servicePath + '/communication/emailService.js');
    getScript(servicePath + '/communication/liveMessageService.js');
    getScript(servicePath + '/utils/keyboardService.js');
    getScript(servicePath + '/utils/domService.js');
    getScript(servicePath + '/utils/stringService.js');
    getScript(servicePath + '/utils/objectService.js');
    getScript(servicePath + '/utils/textSelectionService.js');
    getScript(servicePath + '/utils/caretService.js');
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
    getScript(directivePath + '/app/appBridge.js');
    getScript(directivePath + '/i18n/i18n.js');
    getScript(directivePath + '/i18n/i18nDb.js');
    getScript(directivePath + '/i18n/i18nDbInput.js');
    getScript(directivePath + '/sortable/sortableApp.js');
    getScript(directivePath + '/sortable/sortableAddApp.js');
    getScript(directivePath + '/resizable/resizableApp.js');
    getScript(directivePath + '/utils/boxSortable.js');
    getScript(directivePath + '/utils/uxEvents.js');
    getScript(directivePath + '/utils/uxShow.js');
    getScript(directivePath + '/utils/uxTransclude.js');
    getScript(directivePath + '/utils/multipleFiles.js');
    getScript(directivePath + '/list/listDb.js');
    getScript(directivePath + '/list/list.js');
    getScript(directivePath + '/list/mediaList.js');
    getScript(directivePath + '/list/userList.js');
    getScript(directivePath + '/list/contentList.js');
    getScript(directivePath + '/list/tagList.js');
    getScript(directivePath + '/list/nestedPagesWrapper.js');
    getScript(directivePath + '/list/nestedItemsWrapper.js');
    getScript(directivePath + '/list/nestedItems.js');
    getScript(directivePath + '/list/listEdit.js');
    getScript(directivePath + '/list/listActions.js');
    getScript(directivePath + '/list/createItem.js');
    getScript(directivePath + '/list/createItemButton.js');
    getScript(directivePath + '/list/listExpandedView.js');
    getScript(directivePath + '/media/mediaPicker.js');
    getScript(directivePath + '/feedback/globalMsg.js');
    getScript(directivePath + '/feedback/tooltip.js');
    getScript(directivePath + '/feedback/urlToken.js');
    getScript(directivePath + '/comments/comments.js');
    getScript(directivePath + '/comments/comment.js');
    getScript(directivePath + '/contentEditable/contentEditable.js');
    getScript(directivePath + '/contentEditable/richContent.js');
    getScript(directivePath + '/contentEditable/toggleStyle.js');
    getScript(directivePath + '/contentEditable/selectMedia.js');
    getScript(directivePath + '/banner/bannerCanvas.js');
    getScript(directivePath + '/banner/bannerItem.js');
    getScript(directivePath + '/banner/types/bannerTextService.js');
    getScript(directivePath + '/banner/types/bannerImageService.js');
    getScript(directivePath + '/input/autoComplete.js');
    getScript(directivePath + '/input/fileUploader.js');
    getScript(directivePath + '/input/background.js');
    getScript(directivePath + '/input/rating.js');
    getScript(directivePath + '/input/colorPicker.js');
    getScript(directivePath + '/input/checkbox.js');
    getScript(directivePath + '/input/radio.js');
    getScript(directivePath + '/input/password.js');
    getScript(directivePath + '/input/date.js');
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
    getScript(directivePath + '/admin/createTag.js');
    getScript(directivePath + '/admin/editTag.js');
    getScript(directivePath + '/admin/editTagList.js');
    getScript(directivePath + '/admin/editNotifications.js');
    getScript(directivePath + '/admin/editStyles.js');
    getScript(directivePath + '/admin/editAppGeneral.js');
    getScript(directivePath + '/admin/editAppStyles.js');
    getScript(directivePath + '/admin/stats.js');
    getScript(directivePath + '/admin/styles.js');

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
}());