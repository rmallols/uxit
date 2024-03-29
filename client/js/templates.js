angular.module('templates-main', ['bannerAppEdit.html', 'bannerAppHelp.html', 'bannerAppView.html', 'contentListAppAdd.html', 'contentListAppEdit.html', 'contentListAppHelp.html', 'contentListAppView.html', 'iframeAppEdit.html', 'iframeAppHelp.html', 'iframeAppView.html', 'imageAppEdit.html', 'imageAppHelp.html', 'imageAppView.html', 'languageSelectAppEdit.html', 'languageSelectAppHelp.html', 'languageSelectAppView.html', 'linksAppEdit.html', 'linksAppHelp.html', 'linksAppView.html', 'loginAppEdit.html', 'loginAppHelp.html', 'loginAppView.html', 'mapAppEdit.html', 'mapAppHelp.html', 'mapAppView.html', 'mediaCarouselAppEdit.html', 'mediaCarouselAppHelp.html', 'mediaCarouselAppSelectMedia.html', 'mediaCarouselAppView.html', 'mediaListAppAdd.html', 'mediaListAppEdit.html', 'mediaListAppHelp.html', 'mediaListAppView.html', 'menuAppEdit.html', 'menuAppHelp.html', 'menuAppView.html', 'portalsAdminAppHelp.html', 'portalsAdminAppView.html', 'example.html', 'slidesAppCreateSlide.html', 'slidesAppEdit.html', 'slidesAppEditSlide.html', 'slidesAppHelp.html', 'slidesAppView.html', 'socialAppEdit.html', 'socialAppHelp.html', 'socialAppView.html', 'staticContentAppAdd.html', 'staticContentAppEdit.html', 'staticContentAppHelp.html', 'staticContentAppSelectContent.html', 'staticContentAppView.html', 'userListAppAdd.html', 'userListAppEdit.html', 'userListAppHelp.html', 'userListAppView.html', 'videoAppEdit.html', 'videoAppHelp.html', 'videoAppView.html', 'webGlAppEdit.html', 'webGlAppHelp.html', 'webGlAppView.html', 'addAppPanel.html', 'adminPanel.html', 'createMedia.html', 'edit.html', 'editAppGeneral.html', 'editAppStyles.html', 'editBox.html', 'editContent.html', 'editContentList.html', 'editCurrentUser.html', 'editGeneral.html', 'editLanguage.html', 'editMedia.html', 'editMediaList.html', 'editNotifications.html', 'editPages.html', 'editStyles.html', 'editTag.html', 'editTagList.html', 'editUser.html', 'editUserList.html', 'portalsAdminEditDb.html', 'portalsAdminView.html', 'stats.html', 'styles.html', 'app.html', 'appHeader.html', 'bannerCanvas.html', 'bannerItem.html', 'bannerTextEditText.html', 'comment.html', 'comments.html', 'contentEditable.html', 'richContent.html', 'selectMedia.html', 'background.html', 'borders.html', 'fileUploader.html', 'password.html', 'rating.html', 'contentList.html', 'languagesList.html', 'list.html', 'listDb.html', 'mediaList.html', 'tagList.html', 'userList.html', 'login.html', 'mediaPicker.html', 'pages.html', 'errorPage.html', 'loginPage.html', 'portalPage.html', 'listActions.html', 'listEdit.html']);

angular.module("bannerAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppEdit.html",
    "<div>\n" +
    "    <div class=\"large-10\">Height (px):</div>\n" +
    "    <div class=\"large-15\"><input type=\"text\" ng-model=\"model.height\" /></div>\n" +
    "    <div class=\"large-10\">Grid size (px):</div>\n" +
    "    <div class=\"large-15\">\n" +
    "        <select ng-model=\"model.gridSize\" ng-options=\"gridSize for gridSize in gridSizes\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("bannerAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerAppView.html",
    "<div>\n" +
    "    <div banner-canvas ng-model=\"model.items\" height=\"model.height\" grid-size=\"model.gridSize\"\n" +
    "         on-change=\"onModelChange()\"></div>\n" +
    "</div>");
}]);

angular.module("contentListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppAdd.html",
    "<div>\n" +
    "    <div create-content model=\"content\"></div>\n" +
    "</div>");
}]);

angular.module("contentListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("contentListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppHelp.html",
    "<b>This is</b>The HELP! page of CONTENT LIST :)");
}]);

angular.module("contentListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentListAppView.html",
    "<div>\n" +
    "    <content-list id=\"_id\" config=\"model\"></content-list>\n" +
    "</div>");
}]);

angular.module("iframeAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppEdit.html",
    "<div>\n" +
    "    <div>URL: <input type=\"text\" ng-model=\"internalData.url\"></textarea></div>\n" +
    "    <div>Height: <input type=\"text\" ng-model=\"internalData.height\"></textarea></div>\n" +
    "</div>");
}]);

angular.module("iframeAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("iframeAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("iframeAppView.html",
    "<div>\n" +
    "    <iframe width=\"100%\" ng-show=\"model.url\" height=\"{{model.height}}\" src=\"{{model.url}}\" frameborder=\"0\"\n" +
    "            allowfullscreen></iframe>\n" +
    "    <div ng-show=\"!model.url\"><i>There isn't any content to show</i></div>\n" +
    "</div>");
}]);

angular.module("imageAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppEdit.html",
    "<div>\n" +
    "    <media-list config=\"config\" on-select=\"onSelect($item)\"></media-list>\n" +
    "</div>");
}]);

angular.module("imageAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("imageAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("imageAppView.html",
    "<div>\n" +
    "    <img ux-show=\"model.mediaId\" ng-src=\"{{getDownloadUrl()}}\" title=\"{{getMediaTitle()}}\" />\n" +
    "    <div ux-show=\"!model.mediaId\"><em>Please select an image from the gallery</em></div>\n" +
    "</div>");
}]);

angular.module("languageSelectAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppEdit.html",
    "<div>\n" +
    "    Hello edit!\n" +
    "</div>");
}]);

angular.module("languageSelectAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("languageSelectAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languageSelectAppView.html",
    "<div>\n" +
    "    <div ng-repeat=\"language in languages\" class=\"flag {{language.code}}\" ng-click=\"selectLanguage(language.code)\"\n" +
    "         ng-class=\"{current: isCurrentLanguage(language.code)}\" title=\"{{language.text}}\">\n" +
    "        <img ng-src=\"/client/images/flags/{{language.code}}.svg\" />\n" +
    "     </div>\n" +
    "</div>");
}]);

angular.module("linksAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppEdit.html",
    "<div><h6>Text</h6></div>\n" +
    "<div><h6>URL<h6></div>\n" +
    "<ul sortable=\"model.links\">\n" +
    "	<li ng-repeat=\"link in model.links\" class=\"cf\">\n" +
    "		<div><input type=\"text\" ng-model=\"link.text\"/></div>\n" +
    "		<div><input type=\"text\" ng-model=\"link.url\"/></div>\n" +
    "		<div><button class=\"removeIcon\" ng-click=\"removeItemFromModel($index, model.links)\">Remove</button></div>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "<div class=\"actions\">\n" +
    "	<button class=\"addIcon\" ng-click=\"addItemToModel(model.links)\">+</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("linksAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppHelp.html",
    "<b>This is</b>The HELP! page :) of the Links app\n" +
    "<ul>\n" +
    "	<li>V1</li>\n" +
    "	<li>V2</li>\n" +
    "	<li>V3</li>\n" +
    "</ul>");
}]);

angular.module("linksAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("linksAppView.html",
    "<div>\n" +
    "    <div ng-repeat=\"link in model.links\"><a href=\"{{link.url}}\" target=\"_blank\">{{link.text}}</a></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("loginAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppEdit.html",
    "Video ID:\n" +
    "<input type=\"text\" ng-model=\"model.videoId\"></textarea>\n" +
    "Height:\n" +
    "<input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "");
}]);

angular.module("loginAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("loginAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginAppView.html",
    "<div>\n" +
    "    <login></login>\n" +
    "</div>");
}]);

angular.module("mapAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppEdit.html",
    "<div>\n" +
    "    Height:\n" +
    "    <input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "    Map URL:\n" +
    "    <input type=\"text\" ng-model=\"model.url\"></textarea>\n" +
    "</div>\n" +
    "");
}]);

angular.module("mapAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("mapAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mapAppView.html",
    "<iframe width=\"100%\" height=\"{{model.height}}\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\"\n" +
    "        marginwidth=\"0\" src=\"{{model.url}}&amp;output=embed\"></iframe>\n" +
    "");
}]);

angular.module("mediaCarouselAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppEdit.html",
    "<div>\n" +
    "     <label>Time between slides (milliseconds):<input type=\"text\" ng-model=\"model.timer\"/></label>\n" +
    "    <label>\n" +
    "        Legend pos:\n" +
    "        <select ng-model=\"model.navigationPos\" ng-options=\"obj.value as obj.text for obj in navigationPos\"></select>\n" +
    "    </label>\n" +
    "</div>");
}]);

angular.module("mediaCarouselAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("mediaCarouselAppSelectMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppSelectMedia.html",
    "<div>\n" +
    "    <div edit-media-list selected=\"model.selectedMedia\"></div>\n" +
    "</div>");
}]);

angular.module("mediaCarouselAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaCarouselAppView.html",
    "<div>\n" +
    "    <div class=\"navigationContainer {{model.navigationPos}}\">\n" +
    "        <div class=\"navigatorOverlay\"></div>\n" +
    "        <div class=\"navigator cf\" ng-style=\"setNavigatorCenterPos()\">\n" +
    "            <img class=\"mediaThumbnail\" ng-repeat=\"media in internalData.mediaList\" ng-click=\"internalData.goToMedia($index)\"\n" +
    "                 ng-class=\"getMediaThumbnailSelectedClass($index)\" ng-src=\"{{getDownloadUrl($index)}}\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{getDownloadUrl(internalData.currentMediaIndex)}}\" />\n" +
    "</div>");
}]);

angular.module("mediaListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppAdd.html",
    "<div>\n" +
    "    <div create-media model=\"media\"></div>\n" +
    "</div>");
}]);

angular.module("mediaListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("mediaListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppHelp.html",
    "<b>This is</b>The HELP! page of CONTENT LIST :)");
}]);

angular.module("mediaListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaListAppView.html",
    "<div>\n" +
    "    <media-list config=\"model\"></media-list>\n" +
    "</div>");
}]);

angular.module("menuAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppEdit.html",
    "<!--<div><h6>Text</h6></div>\n" +
    "<div><h6>Page<h6></div>\n" +
    "<div><h6>Layout<h6></div>\n" +
    "<ul sortable=model.pages\">\n" +
    "	<li ng-repeat=\"page in edit.portal.pages\" class=\"cf page\">\n" +
    "		<div><input type=\"text\" ng-model=\"page.text\"></div>\n" +
    "		<div><input type=\"text\" ng-model=\"page.page\"/></div>\n" +
    "		<div class=\"actions\">\n" +
    "			<button class=\"changeLayout\">L</button>\n" +
    "			<button class=\"remove\" ng-click=\"removeItemFromModel($index, edit.portal.pages)\"></button>\n" +
    "		</div>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "<div class=\"actions\">\n" +
    "	<button class=\"add\" ng-click=\"addItemToModel(edit.portal.pages)\">+</button>\n" +
    "</div>-->\n" +
    "");
}]);

angular.module("menuAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppHelp.html",
    "<b>This is</b>The HELP! page :) <h6>of the Menu app</h6>\n" +
    "<ul>\n" +
    "	<li>V4</li>\n" +
    "	<li>V5</li>\n" +
    "	<li>V6</li>\n" +
    "</ul>");
}]);

angular.module("menuAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("menuAppView.html",
    "<div>\n" +
    "    <ul class=\"pagesMenu\">\n" +
    "        <li ng-repeat=\"page in pages\" class=\"page\" ng-class=\"getPageStyleClass(page)\" ng-show=\"!page.parentPageId && !page.invisible\">\n" +
    "            <h6>\n" +
    "                <a href=\"{{getPageUrl(page)}}\" target=\"{{getPageTarget(page)}}\" title=\"{{page.description}}\" i18n-db-title>\n" +
    "                    <button class=\"toggleSubPages downIcon small\" ng-show=\"hasSubPages(page)\"></button>\n" +
    "                    <label i18n-db=\"page.text\"></label>\n" +
    "                </a>\n" +
    "            </h6>\n" +
    "            <div class=\"subPagesMenuContainer\">\n" +
    "                <ul class=\"subPagesMenu\" ng-show=\"page.hasSubPages\">\n" +
    "                    <li ng-repeat=\"subPage in pages\" class=\"page\" ng-class=\"getPageStyleClass(subPage)\"\n" +
    "                        ux-show=\"isSubPageOf(subPage, page) && !subPage.invisible\">\n" +
    "                        <h6>\n" +
    "                            <a href=\"{{getPageUrl(subPage)}}\" target=\"{{getPageTarget(subPage)}}\" title=\"{{subPage.description}}\" i18n-db-title>\n" +
    "                                <label i18n-db=\"subPage.text\"></label>\n" +
    "                            </a>\n" +
    "                        </h6>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("portalsAdminAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("portalsAdminAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminAppView.html",
    "<div>\n" +
    "    <div app-bridge src=\"portalsAdmin\" view=\"view\"></div>\n" +
    "</div>");
}]);

angular.module("example.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("example.html",
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "\n" +
    "	<head>\n" +
    "		<meta charset=\"utf-8\">\n" +
    "\n" +
    "		<title>reveal.js - Markdown Demo</title>\n" +
    "\n" +
    "		<link rel=\"stylesheet\" href=\"../../css/reveal.css\">\n" +
    "		<link rel=\"stylesheet\" href=\"../../css/theme/default.css\" id=\"theme\">\n" +
    "	</head>\n" +
    "\n" +
    "	<body>\n" +
    "\n" +
    "		<div class=\"reveal\">\n" +
    "\n" +
    "			<div class=\"slides\">\n" +
    "\n" +
    "                <!-- Use external markdown resource, separate slides by three newlines; vertical slides by two newlines -->\n" +
    "                <section data-markdown=\"example.md\" data-separator=\"^\\n\\n\\n\" data-vertical=\"^\\n\\n\"></section>\n" +
    "\n" +
    "                <!-- Slides are separated by three dashes (quick 'n dirty regular expression) -->\n" +
    "                <section data-markdown data-separator=\"---\">\n" +
    "                    <script type=\"text/template\">\n" +
    "                        ## Demo 1\n" +
    "                        Slide 1\n" +
    "                        ---\n" +
    "                        ## Demo 1\n" +
    "                        Slide 2\n" +
    "                        ---\n" +
    "                        ## Demo 1\n" +
    "                        Slide 3\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "                <!-- Slides are separated by newline + three dashes + newline, vertical slides identical but two dashes -->\n" +
    "                <section data-markdown data-separator=\"^\\n---\\n$\" data-vertical=\"^\\n--\\n$\">\n" +
    "                    <script type=\"text/template\">\n" +
    "                        ## Demo 2\n" +
    "                        Slide 1.1\n" +
    "\n" +
    "                        --\n" +
    "\n" +
    "                        ## Demo 2\n" +
    "                        Slide 1.2\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        ## Demo 2\n" +
    "                        Slide 2\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "                <!-- No \"extra\" slides, since there are no separators defined (so they'll become horizontal rulers) -->\n" +
    "                <section data-markdown>\n" +
    "                    <script type=\"text/template\">\n" +
    "                        A\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        B\n" +
    "\n" +
    "                        ---\n" +
    "\n" +
    "                        C\n" +
    "                    </script>\n" +
    "                </section>\n" +
    "\n" +
    "            </div>\n" +
    "		</div>\n" +
    "\n" +
    "		<script src=\"../../lib/js/head.min.js\"></script>\n" +
    "		<script src=\"../../js/reveal.js\"></script>\n" +
    "\n" +
    "		<script>\n" +
    "\n" +
    "			Reveal.initialize({\n" +
    "				controls: true,\n" +
    "				progress: true,\n" +
    "				history: true,\n" +
    "				center: true,\n" +
    "\n" +
    "				theme: Reveal.getQueryHash().theme,\n" +
    "				transition: Reveal.getQueryHash().transition || 'default',\n" +
    "\n" +
    "				// Optional libraries used to extend on reveal.js\n" +
    "				dependencies: [\n" +
    "					{ src: '../../lib/js/classList.js', condition: function() { return !document.body.classList; } },\n" +
    "					{ src: 'marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
    "                    { src: 'markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\n" +
    "					{ src: '../notes/notes.js' }\n" +
    "				]\n" +
    "			});\n" +
    "\n" +
    "		</script>\n" +
    "\n" +
    "	</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("slidesAppCreateSlide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppCreateSlide.html",
    "<div>\n" +
    "    Create: <div content-editable ng-model=\"model.content\" i18n-db-input></div>\n" +
    "</div>");
}]);

angular.module("slidesAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppEdit.html",
    "<div>\n" +
    "    <div list=\"model.slides\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         template=\"template\" on-create=\"onCreate()\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("slidesAppEditSlide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppEditSlide.html",
    "<div>\n" +
    "    <div content-editable ng-model=\"model.content\" i18n-db-input></div>\n" +
    "</div>");
}]);

angular.module("slidesAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("slidesAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("slidesAppView.html",
    "<div>\n" +
    "    <div class=\"reveal\">\n" +
    "        <div class=\"slides\">\n" +
    "            <section ng-repeat=\"slide in model.slides\" ng-show=\"show\" class=\"slide\">\n" +
    "                <label i18n-db=\"slide.content\"></label>\n" +
    "            </section>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("socialAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppEdit.html",
    "<div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.email\" label=\"Show e-mail?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.email\" ng-show=\"model.show.email\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.facebook\" label=\"Show Facebook?\"/></div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.facebook\" ng-show=\"model.show.facebook\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.twitter\" label=\"Show Twitter?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.twitter\" ng-show=\"model.show.twitter\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.show.linkedIn\" label=\"Show LinkedIn?\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input type=\"text\" ng-model=\"model.linkedIn\" ng-show=\"model.show.linkedIn\" />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-25\">\n" +
    "        Icon size:\n" +
    "        <select ng-model=\"model.iconSize\" ng-options=\"obj.id as obj.text for obj in internalData.iconSizes\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("socialAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("socialAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("socialAppView.html",
    "<div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.email\">\n" +
    "       <a ng-href=\"mailto:{{model.email}}\" target=\"_blank\"><img src=\"/client/images/email2.svg\" title=\"e-mail\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.facebook\">\n" +
    "        <a ng-href=\"{{model.facebook}}\" target=\"_blank\"><img src=\"/client/images/facebook.svg\" title=\"Facebook\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.twitter\">\n" +
    "        <a ng-href=\"{{model.twitter}}\" target=\"_blank\"><img src=\"/client/images/twitter.svg\" title=\"Twitter\" /></a>\n" +
    "    </div>\n" +
    "    <div class=\"item\" ng-class=\"model.iconSize\" ng-show=\"model.show.linkedIn\">\n" +
    "        <a ng-href=\"{{model.linkedIn}}\" target=\"_blank\"><img src=\"/client/images/linkedin.svg\" title=\"LinkedIn\" /></a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staticContentAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppAdd.html",
    "<div>\n" +
    "    <div create-content model=\"content\"></div>\n" +
    "    <input checkbox ng-model=\"internalData.displayAddedContent\" label=\"Display added?\" />\n" +
    "</div>");
}]);

angular.module("staticContentAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppEdit.html",
    "<div>\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label>General</label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showTitles\" label=\"Show titles\"/>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showComments\" label=\"Show comments\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label>Ratings</label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showRatings\" label=\"Show ratings\"/>\n" +
    "\n" +
    "        </div>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showCommentsRatings\" label=\"Show comments ratings\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("staticContentAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("staticContentAppSelectContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppSelectContent.html",
    "<div>\n" +
    "    <auto-complete ng-model=\"model.selectedContentId\" ng-options=\"contentList\" label-key=\"title\"\n" +
    "                   placeholder=\"Start typing to select content...\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("staticContentAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("staticContentAppView.html",
    "<div>\n" +
    "    <div ng-show=\"!model.selectedContentId\"><em>Please select a content from the edit panel</em></div>\n" +
    "    <div ng-show=\"model.selectedContentId\">\n" +
    "        <div class=\"contentHeader cf\">\n" +
    "            <h3 ng-show=\"model.showTitles\" class=\"title\">\n" +
    "                <a href=\"#\">\n" +
    "                    <div content-editable ng-model=\"internalData.title\" type=\"type\"\n" +
    "                         on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "                </a>\n" +
    "            </h3>\n" +
    "            <div rating=\"internalData.avgRating\" target-id=\"model.selectedContentId\" target-collection=\"content\"\n" +
    "                 target-author-id=\"internalData.create.author._id\" ux-show=\"model.showRatings\"></div>\n" +
    "        </div>\n" +
    "        <div content-editable ng-model=\"internalData.summary\" type=\"type\"\n" +
    "             on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "        <div content-editable ng-model=\"internalData.content\" type=\"type\"\n" +
    "             on-blur=\"onContentUpdated()\" class=\"noBorder\" i18n-db-input></div>\n" +
    "        <comments target-id=\"model.selectedContentId\" placeholder=\"comments.addComment.placeholder\"\n" +
    "                  ux-show=\"model.showComments\" allow-ratings=\"model.showCommentsRatings\"></comments>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("userListAppAdd.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppAdd.html",
    "<div>\n" +
    "    <div create-user model=\"user\"></div>\n" +
    "</div>");
}]);

angular.module("userListAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppEdit.html",
    "<div list-edit></div>");
}]);

angular.module("userListAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppHelp.html",
    "<b>This is</b>The HELP! page of USER LIST :)");
}]);

angular.module("userListAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userListAppView.html",
    "<div>\n" +
    "    <user-list config=\"model\"></user-list>\n" +
    "</div>");
}]);

angular.module("videoAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppEdit.html",
    "<div>\n" +
    "    Video ID:\n" +
    "    <input type=\"text\" ng-model=\"model.videoId\"></textarea>\n" +
    "    Height:\n" +
    "    <input type=\"text\" ng-model=\"model.height\"></textarea>\n" +
    "</div>\n" +
    "");
}]);

angular.module("videoAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("videoAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("videoAppView.html",
    "<iframe width=\"100%\" height=\"{{model.height}}\" src=\"http://www.youtube.com/embed/{{model.videoId}}\"\n" +
    "        frameborder=\"0\" allowfullscreen></iframe>");
}]);

angular.module("webGlAppEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppEdit.html",
    "<div>3D Edit</div>");
}]);

angular.module("webGlAppHelp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppHelp.html",
    "<b>This is</b>The HELP! page :)");
}]);

angular.module("webGlAppView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("webGlAppView.html",
    "<div></div>");
}]);

angular.module("addAppPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("addAppPanel.html",
    "<div id=\"addAppPanel\" class=\"addAppPanel\" state=\"hidden\">\n" +
    "    <div class=\"collapsedView\">\n" +
    "        <file-uploader endpoint=\"rest/availableApps/deploy/\" on-upload=\"onAvailableAppDeployed()\"></file-uploader>\n" +
    "        <div class=\"filterContainer\"><input type=\"text\" ng-model=\"filter\"></div>\n" +
    "        <ul class=\"apps\">\n" +
    "            <div ng-repeat=\"availableApp in availableApps.model | filter: filter\" ng-class=\"getBlockStyleClass(availableApp.id)\">\n" +
    "                <div class=\"category\" ng-show=\"availableApp.firstInCategory\">{{availableApp.category}}</div>\n" +
    "                <li sortable-add-app class=\"newItem\" type=\"{{availableApp.id}}\" ng-class=\"getAppClasses($index)\">\n" +
    "                    <div class=\"text\">{{availableApp.title}}</div>\n" +
    "                    <button class=\"infoIcon\" ng-click=\"toggleExpandedView(availableApp)\"></button>\n" +
    "                </li>\n" +
    "            </div>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"expandedView\" ux-show=\"isExpandedViewVisible\">\n" +
    "        <div class=\"content\">\n" +
    "            <div class=\"header\">\n" +
    "                <div class=\"main\">\n" +
    "                    <h3 class=\"title\">{{highlight.title}}</h3>\n" +
    "                    <div rating=\"highlight.avgRating\" target-id=\"highlight._id\" target-collection=\"{{highlight.collection}}\" height=\"32\"></div>\n" +
    "                    <div class=\"actions\">\n" +
    "                        <button class=\"addIcon\">Add!</button>\n" +
    "                        <button class=\"removeIcon\" ng-click=\"undeploy()\"><label i18n=\"app.remove\"></label></button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"metadata\">\n" +
    "                    <label class=\"key\" i18n=\"addApp.version\"></label>: <label class=\"value\">{{highlight.version}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.category\"></label>: <label class=\"value\">{{highlight.category}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.creationDate\"></label>: <label class=\"value\">{{highlight.create.date}}</label>\n" +
    "                    <label class=\"key\" i18n=\"addApp.provider\"></label>: <label class=\"value\">{{highlight.provider}}</label>\n" +
    "                </div>\n" +
    "                <div class=\"description\">{{highlight.desc}}</div>\n" +
    "            </div>\n" +
    "            <div class=\"preview\" app-container>\n" +
    "                <div app ng-class=\"highlight.id\" model=\"highlight.model\" type=\"highlight.id\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"details\">\n" +
    "                <line-chart data=\"highlight.stats\"></line-chart>\n" +
    "                <comments target-id=\"highlight._id\" placeholder=\"addApp.addComment\" on-add=\"onAddedComment\"></comments>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("adminPanel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("adminPanel.html",
    "<div class=\"admin cf\">\n" +
    "    <add-app-panel></add-app-panel>\n" +
    "    <edit ux-show=\"panels.length\" edit=\"edit\" panels=\"panels\" on-cancel=\"onCancel()\" on-save=\"onSave()\"\n" +
    "          active-tab=\"activeTab\" limit-layer-height=\"false\"></edit>\n" +
    "</div>\n" +
    "");
}]);

angular.module("createMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("createMedia.html",
    "<div>\n" +
    "    Name:\n" +
    "    <div ng-show=\"multipleFilesUploaded\">{{getMultipleFilesUploadedNames()}}</div>\n" +
    "    <input type=\"text\" ng-model=\"media[0].name\" mandatory ng-show=\"!multipleFilesUploaded\" />\n" +
    "    content: <file-uploader on-upload=\"onUpload()\"></file-uploader>\n" +
    "    Tags:\n" +
    "    <auto-complete ng-model=\"media.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("edit.html",
    "<div class=\"edit cf\">\n" +
    "    <div class=\"actions\" ux-show=\"activeTab.current >= 0\">\n" +
    "        <button class=\"saveIcon\" ng-click=\"save()\"></button>\n" +
    "        <button class=\"cancelIcon\" ng-click=\"cancel()\"></button>\n" +
    "    </div>\n" +
    "	<ul class=\"tabs level1\" ng-show=\"showIfMultipleTabs()\">\n" +
    "		<li ng-repeat=\"panel in panels\" style=\"height:{{tabHeight}}%\" ng-style=\"panel.ngStyleFn()\" ng-click=\"clickTab($index)\"\n" +
    "            class=\"tab tabButton\" ng-class=\"getTabClasses(panel, $index)\" title=\"{{panel.description}}\" i18n-title>\n" +
    "            <label i18n=\"{{panel.title}}\"></label>\n" +
    "            <label ux-show=\"isEditedMarkVisible($parent[panel.type])\" ng-class=\"getEditedMarkColor($parent[panel.type])\"\n" +
    "                   class=\"jsitedMark\">*</label>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div class=\"content level1\" ng-show=\"activeTab.current >= 0\" ng-style=\"setMaxHeightContent()\">\n" +
    "		<ul></ul>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editAppGeneral.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editAppGeneral.html",
    "<div class=\"cf\">\n" +
    "    <div class=\"row\">\n" +
    "        <h5><label i18n=\"editApp.general\"></label></h5>\n" +
    "        <div class=\"columns large-25\">\n" +
    "            <input checkbox ng-model=\"model.showTitle\" label=\"editApp.showAppTitles\"/>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editAppStyles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editAppStyles.html",
    "<div>\n" +
    "    <div styles=\"model.styles\" target=\"app\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editBox.html",
    "<div id=\"{{target.id}}\" class=\"editBox cf\" arrowPos=\"{{arrowPos}}\" ng-style=\"getStyles()\" type=\"{{target.type}}\"\n" +
    "    ng-class=\"{multiLayer: panels.length > 1}\">\n" +
    "    <div class=\"content cf\">\n" +
    "        <edit panels=\"panels\" active-tab=\"activeTab\" on-save=\"save()\" on-change=\"change()\"\n" +
    "              on-cancel=\"cancel()\" limit-layer-height=\"true\"></edit>\n" +
    "    </div>\n" +
    "    <div class=\"arrow\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editContent.html",
    "<div>\n" +
    "    <label i18n=\"editContent.title\"></label>: <input type=\"text\" ng-model=\"content.title\" i18n-db-input mandatory />\n" +
    "    <label i18n=\"editContent.summary\"></label>: <div content-editable ng-model=\"content.summary\" type=\"type\" i18n-db-input></div>\n" +
    "    <label i18n=\"editContent.content\"></label>: <div content-editable ng-model=\"content.content\" type=\"type\" i18n-db-input></div>\n" +
    "    <label i18n=\"tags\"></label>:\n" +
    "    <auto-complete ng-model=\"content.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "</div>");
}]);

angular.module("editContentList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editContentList.html",
    "<div>\n" +
    "    <content-list config=\"config\"></content-list>\n" +
    "</div>");
}]);

angular.module("editCurrentUser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editCurrentUser.html",
    "<div>\n" +
    "    <div class=\"actions\">\n" +
    "        <button ng-click=\"logout()\">Logout</button>\n" +
    "    </div>\n" +
    "    <div edit-user model=\"userSession\" on-layer=\"onLayer\" class=\"clearBoth\"></div>\n" +
    "</div>");
}]);

angular.module("editGeneral.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editGeneral.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.portalTitle\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.title\" mandatory /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.portalDescription\"></label>\n" +
    "                    <div><textarea content-editable ng-model=\"model.desc\"></textarea></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <label i18n=\"editGeneral.general.favicon\"></label>\n" +
    "                    <file-uploader preview=\"true\" ng-model=\"favicon\" on-upload=\"updateFavicon($uploadedFile)\"\n" +
    "                                   default-media-url=\"defaultFaviconUrl\"></file-uploader>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-25\">\n" +
    "                    <h5><label i18n=\"editGeneral.general.fullscreenMode\"></label></h5>\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.real\"\n" +
    "                    value=\"real\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.real.desc\" i18n-title />\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.maximized\"\n" +
    "                    value=\"maximized\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.maximized.desc\" i18n-title />\n" +
    "                    <input radio ng-model=\"model.fullscreenMode\" label=\"editGeneral.general.fullscreenMode.template\"\n" +
    "                    value=\"template\" name=\"fullscreenMode\" title=\"editGeneral.general.fullscreenMode.template.desc\" i18n-title />\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div edit-app-general model=\"model.app\"></div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <languages-list config=\"config\"></languages-list>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <input checkbox ng-model=\"model.comments.allowRatings\" label=\"editGeneral.comments.allowRatings\" />\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-8\">\n" +
    "                    <label i18n=\"editGeneral.email.sourceAddress\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.email.user\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-8\">\n" +
    "                    <label i18n=\"editGeneral.email.sourcePassword\"></label>\n" +
    "                    <div><input type=\"password\" ng-model=\"model.email.password\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-7\">\n" +
    "                    <label i18n=\"editGeneral.email.host\"></label>\n" +
    "                    <div><input type=\"text\" ng-model=\"model.email.host\" /></div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-2\">\n" +
    "                    <label>SSL?:</label>\n" +
    "                    <input checkbox ng-model=\"model.email.ssl\" />\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-8 textAlignRight\">\n" +
    "                    <label i18n=\"editGeneral.statistics.trackingCode\"></label>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <div><input type=\"text\" ng-model=\"model.trackingCode\" /></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"columns large-13\">\n" +
    "                    <h5><label i18n=\"editGeneral.migration.export\"></label></h5>\n" +
    "                    <div>\n" +
    "                        <label i18n=\"editGeneral.migration.export.desc\"></label>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <a href=\"rest/export\" target=\"_blank\" class=\"button upIcon\">\n" +
    "                            <label i18n=\"editGeneral.migration.export.action\"></label>\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-12\">\n" +
    "                    <h5><label i18n=\"editGeneral.migration.import\"></label></h5>\n" +
    "                    <div>\n" +
    "                        <label i18n=\"editGeneral.migration.import.desc\"></label>\n" +
    "                    </div>\n" +
    "                    <div class=\"warning\">\n" +
    "                        <b><label i18n=\"editGeneral.migration.import.warning.title\"></label></b><br/>\n" +
    "                        <label i18n=\"editGeneral.migration.import.warning.desc\"></label>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <file-uploader endpoint=\"rest/import\" on-upload=\"onImportedPortal()\"></file-uploader>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>\n" +
    "\n" +
    "");
}]);

angular.module("editLanguage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editLanguage.html",
    "<div>\n" +
    "    <input checkbox ng-model=\"language.inactive\" label=\"editGeneral.languages.inactive\" />\n" +
    "</div>");
}]);

angular.module("editMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editMedia.html",
    "<div>\n" +
    "    <label i18n=\"editMedia.name\"></label>: <input type=\"text\" ng-model=\"media.name\" mandatory ng-show=\"!multipleFilesUploaded\" />\n" +
    "    <label i18n=\"editMedia.content\"></label>: <file-uploader on-upload=\"onUpload()\" endpoint=\"media/upload/{{media._id}}\"></file-uploader>\n" +
    "    <label i18n=\"tags\"></label>:\n" +
    "    <auto-complete ng-model=\"media.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"tags.placeholder\" multiple=\"true\"></auto-complete>\n" +
    "</div>\n" +
    "");
}]);

angular.module("editMediaList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editMediaList.html",
    "<div>\n" +
    "    <media-list config=\"config\"></media-list>\n" +
    "</div>");
}]);

angular.module("editNotifications.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editNotifications.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div class=\"block\">\n" +
    "                    <h4><label i18n=\"editNotifications.email.selectAddressees\"></label></h4>\n" +
    "                    <auto-complete ng-model=\"model.notifications.email.selectedUsers\" ng-options=\"usersList\" label-key=\"fullName\" value-key=\"email\"\n" +
    "                                   placeholder=\"editNotifications.email.typeToGetUsers\" multiple=\"true\"></auto-complete>\n" +
    "                </div>\n" +
    "                <div class=\"block\">\n" +
    "                    <h4><label i18n=\"editNotifications.email.writeMessage\"></label></h4>\n" +
    "                    <h6><label i18n=\"editNotifications.title\"></label></h6>\n" +
    "                    <input type=\"text\" ng-model=\"model.notifications.email.subject\" />\n" +
    "                    <h6><label i18n=\"editNotifications.content\"></label></h6>\n" +
    "                    <div content-editable ng-model=\"model.notifications.email.text\" class=\"content\"></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <h6><i><label i18n=\"editNotifications.liveMessage.sendMessage\"></label></i></h6>\n" +
    "                <div class=\"block\">\n" +
    "                    <h6><label i18n=\"editNotifications.title\"></label></h6>\n" +
    "                    <input type=\"text\" ng-model=\"model.notifications.liveMessage.subject\" />\n" +
    "                    <h6><label i18n=\"editNotifications.content\"></label></h6>\n" +
    "                    <div content-editable ng-model=\"model.notifications.liveMessage.text\" class=\"content\"></div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>");
}]);

angular.module("editPages.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editPages.html",
    "<li class=\"hasSubmenu\">\n" +
    "	<div class=\"submenu\">\n" +
    "        <nested-pages-wrapper pages=\"pages\" items=\"items\" selected-item=\"selectedPage\" on-add=\"onAddPage($page)\"></nested-pages-wrapper>\n" +
    "	</div>\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "	<div class=\"content level2\">\n" +
    "        <ul ng-form=\"editPages\">\n" +
    "            <li class=\"layer\" id=\"currentLayout{{$id}}\">\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.id\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    /<label url-token input=\"selectedPage.text\" output=\"selectedPage.url\"></label>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.text\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <input type=\"text\" ng-model=\"selectedPage.text\" i18n-db-input mandatory\n" +
    "                           placeholder=\"editPages.text.placeholder\" ux-change=\"registerSelectedPageChange()\" />\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.description\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <textarea content-editable ng-model=\"selectedPage.description\" i18n-db-input\n" +
    "                              ux-change=\"registerSelectedPageChange()\" placeholder=\"editPages.description.placeholder\"></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.type\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <select ng-model=\"selectedPage.type\" ng-options=\"obj.id as obj.text for obj in pageTypes\"\n" +
    "                            ng-change=\"registerSelectedPageChange()\"></select>\n" +
    "                </div>\n" +
    "                <div class=\"columns large-9 textAlignRight\"><label i18n=\"editPages.invisible\"></label></div>\n" +
    "                <div class=\"columns large-16\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"selectedPage.invisible\" ux-change=\"registerSelectedPageChange()\" />\n" +
    "                </div>\n" +
    "                <div ux-show=\"selectedPage.type=='externalLink'\">\n" +
    "                    <div class=\"columns large-8 textAlignRight\"><label i18n=\"editPages.url\"></label></div>\n" +
    "                    <div class=\"columns large-11\">\n" +
    "                        <input type=\"text\" ng-model=\"selectedPage.externalLinkUrl\" mandatory ng-change=\"registerSelectedPageChange()\" />\n" +
    "                    </div>\n" +
    "                    <div class=\"columns large-2 textAlignRight\"><label i18n=\"editPages.target\"></label></div>\n" +
    "                    <div class=\"columns large-4\">\n" +
    "                        <select ng-model=\"selectedPage.target\" ng-options=\"obj.id as obj.text for obj in targets\"\n" +
    "                                ng-change=\"registerSelectedPageChange()\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\" id=\"changeLayout{{$id}}\">\n" +
    "                <padding>\n" +
    "                    34\n" +
    "                </padding>\n" +
    "            </li>\n" +
    "            <li class=\"layer\" id=\"section2c{{$id}}\">\n" +
    "                <padding>\n" +
    "                    <h2>Section 6</h2>\n" +
    "                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse et turpis sed metus fermentum pellentesque. Vestibulum auctor neque ac nunc elementum malesuada. Praesent non est sed libero vestibulum consectetuer. Sed vehicula. Vivamus quis tellus sit amet erat ultrices luctus. Fusce a ligula. Fusce viverra libero vitae velit. Aenean bibendum nibh non lorem. Suspendisse quis velit. Integer sit amet lacus. Curabitur tristique. Morbi eu lectus. Vestibulum tristique aliquam quam. Sed neque.</p>\n" +
    "                    <p>Nulla facilisi. Quisque eleifend libero. Sed eros. Morbi vel leo. Morbi varius tincidunt sem. Nam sodales volutpat velit. Suspendisse potenti. Duis vehicula pede non nisi. Proin elit pede</p>\n" +
    "                </padding>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "	</div>\n" +
    "</li>\n" +
    "");
}]);

angular.module("editStyles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editStyles.html",
    "<li class=\"hasSubmenu\">\n" +
    "    <ul vertical-tabs=\"level2Tabs\"></ul>\n" +
    "    <div class=\"content level2\">\n" +
    "        <ul>\n" +
    "            <li class=\"layer\">\n" +
    "                <div styles=\"model.styles\" target=\"portal\"></div>\n" +
    "            </li>\n" +
    "            <li class=\"layer\">\n" +
    "                <div styles=\"model.app.styles\" target=\"app\"></div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</li>\n" +
    "");
}]);

angular.module("editTag.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editTag.html",
    "<div>\n" +
    "    <div class=\"columns large-8 textAlignRight\"><label i18n=\"editTag.tagName\"></label>:</div>\n" +
    "    <div class=\"columns large-16\"><input type=\"text\" ng-model=\"tag.text\" mandatory /></div>\n" +
    "</div>");
}]);

angular.module("editTagList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editTagList.html",
    "<div>\n" +
    "    <tag-list config=\"config\"></tag-list>\n" +
    "</div>");
}]);

angular.module("editUser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editUser.html",
    "<div>\n" +
    "    <div class=\"columns large-8\">\n" +
    "        <media-picker preview=\"true\" ng-model=\"user.media\" default-media-url=\"defaultAvatarUrl\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <div><label i18n=\"editUser.fullName\"></label>: <input type=\"text\" ng-model=\"user.fullName\" mandatory /></div>\n" +
    "        <div><label i18n=\"editUser.email\"></label>: <input type=\"text\" ng-model=\"user.email\" email-mandatory mandatory /></div>\n" +
    "        <div><label i18n=\"editUser.birthDate\"></label>: <input date ng-model=\"user.birthDate\" /></div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.password\"></label>:\n" +
    "            <input password ng-model=\"user.password\" click-to-change=\"clickToChangePassword\" />\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.role\"></label>\n" +
    "            <select ng-model=\"user.role\" ng-options=\"obj.karma as obj.title for obj in roles\"></select>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <label i18n=\"editUser.language\"></label>\n" +
    "            <select ng-model=\"user.language\" ng-options=\"obj.code as obj.text for obj in languages\"></select>\n" +
    "        </div>\n" +
    "        <div><label i18n=\"tags\"></label>:\n" +
    "            <auto-complete ng-model=\"user.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                           placeholder=\"Start typing to retrieve tags\" multiple=\"true\"></auto-complete>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("editUserList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("editUserList.html",
    "<div>\n" +
    "    <user-list config=\"config\"></user-list>\n" +
    "</div>");
}]);

angular.module("portalsAdminEditDb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminEditDb.html",
    "<div>\n" +
    "    <div class=\"cf\">\n" +
    "        <div class=\"columns large-10\">Portal Url</div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <label url-token input=\"model.typedName\" output=\"model.name\"></label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <div class=\"columns large-10\">Database name:<br/>(Without spaces)</div>\n" +
    "        <div class=\"columns large-15\"><input type=\"text\" ng-model=\"model.typedName\" /></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-12\">\n" +
    "        <h5><label i18n=\"portalsAdmin.dataTemplates\"></label></h5>\n" +
    "        <select ng-model=\"model.dataTemplateId\" ng-options=\"obj.id as obj.text for obj in dataTemplates\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-13\">\n" +
    "        <h5><label i18n=\"portalsAdmin.stylesTemplates\"></label></h5>\n" +
    "        <select ng-model=\"model.stylesTemplateId\" ng-options=\"obj.id as obj.text for obj in stylesTemplates\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("portalsAdminView.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalsAdminView.html",
    "<div>\n" +
    "    <div list=\"databases\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         on-create=\"onCreate($item)\" on-edit=\"onEdit($item)\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("stats.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("stats.html",
    "<div>\n" +
    "    <div class=\"columns large-12 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdNewsPerDay\"></label></h4>\n" +
    "        <line-chart data=\"newsPerDay\"></line-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-12 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdUsersPerDay\"></label></h4>\n" +
    "        <line-chart data=\"usersPerDay\"></line-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.createdContentPerUser\"></label></h4>\n" +
    "        <pie-chart data=\"contentPerUser\"></pie-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.usersPerRole\"></label></h4>\n" +
    "        <pie-chart data=\"usersPerRole\"></pie-chart>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8 chartBlock\">\n" +
    "        <h4 class=\"title\"><label i18n=\"stats.commentsPerUser\"></label></h4>\n" +
    "        <pie-chart data=\"commentsPerUser\"></pie-chart>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("styles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("styles.html",
    "<div>\n" +
    "    <div class=\"cf\" ng-show=\"isPortalTarget()\">\n" +
    "        <div class=\"columns large-13\">\n" +
    "            <label i18n=\"editStyles.fontColor\"></label>\n" +
    "            <div>\n" +
    "                <input color-picker placeholder=\"Specify the color\" ng-model=\"model.cssVars.fontColor\" />\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <label i18n=\"editStyles.highlightColor\"></label>\n" +
    "            <div>\n" +
    "                <input color-picker placeholder=\"Specify the color\" ng-model=\"model.cssVars.high\" />\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-13\">\n" +
    "        <label i18n=\"editStyles.padding\"></label>\n" +
    "        <div><input type=\"number\" ng-model=\"model.padding\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-12\" ng-show=\"isAppTarget()\">\n" +
    "        <label i18n=\"editStyles.margin\"></label>\n" +
    "        <div><input type=\"number\" ng-model=\"model.margin\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-25\">\n" +
    "        <label i18n=\"editStyles.fontSize\"></label>\n" +
    "        <div><input type=\"text\" ng-model=\"model.fontSize\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-9\" ng-show=\"isAppTarget()\">\n" +
    "        <label i18n=\"editStyles.height\"></label>\n" +
    "        <div><input type=\"number\" ng-model=\"model.height\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-8\" ng-show=\"isAppTarget()\">\n" +
    "        <label i18n=\"editStyles.align.horizontal\"></label>\n" +
    "        <select ng-model=\"model.align.horizontal\" ng-options=\"obj.id as obj.text for obj in aligns.horizontal\"\n" +
    "                ng-init=\"model.align.horizontal=model.align.horizontal||aligns.horizontal[0].id\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-8\" ng-show=\"model.height && isAppTarget()\">\n" +
    "        <label i18n=\"editStyles.align.vertical\"></label>\n" +
    "        <select ng-model=\"model.align.vertical\" ng-options=\"obj.id as obj.text for obj in aligns.vertical\"\n" +
    "                ng-init=\"model.align.vertical=model.align.vertical||aligns.vertical[0].id\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"cf columns large-12\" ng-show=\"isPortalTarget()\">\n" +
    "        <h5><label i18n=\"editStyles.logo\"></label></h5>\n" +
    "        <media-picker ng-model=\"logo\" multiple=\"false\" preview=\"true\" on-change=\"changeLogoId($media)\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <h5><label i18n=\"editStyles.background\"></label></h5>\n" +
    "        <background ng-model=\"model.background\"></background>\n" +
    "    </div>\n" +
    "    <div class=\"cf\">\n" +
    "        <h5><label i18n=\"editStyles.borders\"></label></h5>\n" +
    "        <borders ng-model=\"model.borders\"></borders>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("app.html",
    "<div ng-class=\"getAppStyleClasses()\" class=\"app cf\" ng-style=\"getAppStyles()\">\n" +
    "    <div app-header class=\"cf\"></div>\n" +
    "	<div class=\"content cf\">\n" +
    "        <div class=\"title\" ng-show=\"isTitleVisible()\"><h5>{{model.title || appInfo.title}}</h5></div>\n" +
    "        <div class=\"alignment\" ng-class=\"getAppAlignment()\">\n" +
    "            <div app-bridge bindings=\"bindings\" src=\"{{type}}\" view=\"{{view}}\" on-event=\"onEvent\"></div>\n" +
    "        </div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("appHeader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("appHeader.html",
    "<div>\n" +
    "    <div class=\"headerToggle\" ng-click=\"toggleHeader()\" ng-show=\"showAdminActions()\"></div>\n" +
    "    <div class=\"header cf\" ng-show=\"showHeader()\" title=\"{{getAppHelpText()}}\">\n" +
    "        <div class=\"title\">\n" +
    "            <h5>{{model.title || appInfo.title}}</h5>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button class=\"editIcon\" ng-click=\"showEditTemplate()\" ng-show=\"showEditActions()\" title=\"app.edit\" i18n-title></button>\n" +
    "            <button class=\"fullscreenIcon\" ng-click=\"toggleFullscreen()\" ng-show=\"showAdminActions()\" title=\"app.fullscreen\"\n" +
    "                    ng-disabled=\"templateApp=='true' && isTemplateFullscreen\" i18n-title></button>\n" +
    "            <button class=\"removeIcon\" ng-click=\"removeApp()\" ng-show=\"showAdminActions()\" title=\"app.remove\" i18n-title></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerCanvas.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerCanvas.html",
    "<div class=\"bannerCanvas\" ng-class=\"{readOnly: isReadOnly()}\">\n" +
    "    <div class=\"addArea\" ux-show=\"!isReadOnly()\">\n" +
    "        <button class=\"addImage addIcon\" ng-click=\"addItem('image')\">Add image</button>\n" +
    "        <button class=\"addText addIcon\" ng-click=\"addItem('text')\">Add text</button>\n" +
    "    </div>\n" +
    "    <div class=\"grid\" ng-class=\"{overflowVisible: overflow.visible}\" ng-style=\"getCanvasHeight()\">\n" +
    "        <div banner-item ng-repeat=\"item in items.data\" data=\"item\" on-change=\"onItemChange()\"\n" +
    "             overflow=\"overflow\" read-only=\"isReadOnly()\" grid-size=\"gridSize\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerItem.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerItem.html",
    "<div id=\"{{item.id}}\" class=\"bannerItem\" ng-class=\"{readOnly: readOnly, invisible: invisible}\">\n" +
    "    <div class=\"border\">\n" +
    "        <button class=\"edit editIcon\" ng-click=\"editItem()\"></button>\n" +
    "        <div ux-transclude=\"template\"></div>\n" +
    "        <input type=\"text\" class=\"selectHandler mousetrap\" />\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("bannerTextEditText.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("bannerTextEditText.html",
    "<div>\n" +
    "    <div content-editable ng-model=\"item.value\" i18n-db-input ux-change=\"contentChanged()\"></div>\n" +
    "</div>");
}]);

angular.module("comment.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment.html",
    "<li class=\"comment cf\" ng-hide=\"comment.deleted\">\n" +
    "    <img class=\"avatar\" ng-src=\"{{getDownloadUrl(comment.create.author.media)}}\" />\n" +
    "    <div class=\"metaData avatarSibling\">\n" +
    "        <div class=\"header\">\n" +
    "            <div class=\"floatLeft\">\n" +
    "                <div class=\"author\"><a href=\"#\">{{comment.create.author.fullName}}</a></div>\n" +
    "            </div>\n" +
    "            <div class=\"floatRight\">\n" +
    "                <div class=\"date\">{{getFormattedDate()}}</div>\n" +
    "                <div rating=\"comment.avgRating\" target-id=\"comment._id\" target-author-id=\"comment.create.author._id\"\n" +
    "                     target-collection=\"comments\" height=\"16\" ux-show=\"showRatings()\"></div>\n" +
    "                <button class=\"toggleReply replyIcon small\" ng-click=\"toggleReply()\" i18n-title title=\"comments.addReply\"\n" +
    "                        ng-show=\"isLoggedUser\"></button>\n" +
    "                <button class=\"toggleEdit editIcon small\" ng-click=\"toggleEdit()\" i18n-title title=\"comments.edit\"\n" +
    "                        ng-show=\"isSelfActionAllowed\"></button>\n" +
    "                <button class=\"deleteComment removeIcon small\" i18n-title title=\"comments.deleteComment\"\n" +
    "                        confirm-action=\"deleteComment()\" ng-show=\"isSelfActionAllowed\"></button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div content-editable=\"comment.isEditable\" ng-model=\"comment.text\" type=\"type\"\n" +
    "             on-blur=\"updateComment()\" class=\"message\"></div>\n" +
    "        <div class=\"repliesWrapper\"></div>\n" +
    "    </div>\n" +
    "</li>");
}]);

angular.module("comments.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comments.html",
    "<div class=\"comments\">\n" +
    "    <h5 class=\"title\" ng-hide=\"parentComment\"><label i18n=\"comments\"></label></h5>\n" +
    "    <div ng-show=\"comments.length == 0 && !parentComment\" class=\"noComments\">\n" +
    "        <label i18n=\"comments.noItems\"></label>\n" +
    "    </div>\n" +
    "    <ul ng-show=\"comments.length > 0\">\n" +
    "        <li ng-repeat=\"comment in comments\" comment=\"comment\"></li>\n" +
    "    </ul>\n" +
    "    <div class=\"cf\" ng-hide=\"hideAdd || !loggedUser\">\n" +
    "        <img class=\"avatar\" ng-src=\"{{getUserAvatarUrl()}}\" />\n" +
    "        <textarea content-editable ng-model=\"newCommentText\" class=\"newCommentInput avatarSibling\" placeholder=\"{{placeholder}}\"></textarea>\n" +
    "        <button class=\"addIcon createComment floatRight\" ng-click=\"createComment()\">\n" +
    "            <label i18n=\"{{placeholder}}\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("contentEditable.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentEditable.html",
    "<div>\n" +
    "    <div class=\"actionsArea\" ng-show=\"isEditable() && showActions\" >\n" +
    "        <media-picker ng-model=\"newMedia\" multiple=\"false\" on-close=\"onClose()\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"editableArea\">\n" +
    "        <div ux-keyup=\"onKeyup()\" ng-mouseup=\"showEditBox()\" contenteditable=\"{{isEditable()}}\"></div>\n" +
    "        <div class=\"placeholder\" ng-show=\"placeholder && showPlaceholder\">\n" +
    "            <label i18n=\"{{placeholder}}\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"background\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("richContent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("richContent.html",
    "<div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.color\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <input color-picker placeholder=\"richContent.color.placeholder\" ng-model=\"style.color\" on-change=\"propagateChanges()\" />\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.style\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <button toggle-style ng-model=\"style.fontWeight\" active-when=\"bold\" inactive-when=\"normal\" class=\"boldIcon\"></button>\n" +
    "        <button toggle-style ng-model=\"style.fontStyle\" active-when=\"italic\" inactive-when=\"normal\" class=\"italicIcon\"></button>\n" +
    "        <button toggle-style ng-model=\"style.textDecoration\" active-when=\"underline\" inactive-when=\"none\" class=\"underlineIcon\"></button>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.size\"></label></div>\n" +
    "    <div class=\"columns large-16\">\n" +
    "        <select ng-model=\"heading\" ng-init=\"heading=heading||'normal'\"\n" +
    "                ng-options=\"obj.value as obj.text for obj in headingOptions\" ng-change=\"setHeading()\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-9 textAlignRight\"><label i18n=\"richContent.link\"></label></div>\n" +
    "    <div class=\"columns large-6\">\n" +
    "        <select ng-model=\"linkType\" ng-init=\"linkType=linkType||'internal'\" ng-options=\"obj.id as obj.text for obj in linkTypes\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-10\">\n" +
    "        <div ng-show=\"linkType=='internal'\" >\n" +
    "            <auto-complete ng-model=\"internalLink\" ng-options=\"pagesList\" label-key=\"text\" value-key=\"url\"\n" +
    "                           ux-change=\"setInternalLink()\" placeholder=\"richContent.link.placeholder\"></auto-complete>\n" +
    "        </div>\n" +
    "        <input type=\"text\" ng-model=\"externalLink\" ux-blur=\"setExternalLink()\" ng-show=\"linkType=='external'\" />\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("selectMedia.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("selectMedia.html",
    "<div>\n" +
    "    <div>\n" +
    "        <div class=\"columns large-10 textAlignRight\">\n" +
    "            <label i18n=\"selectMedia.source\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <media-picker ng-model=\"internalData.updatedMedia\" multiple=\"false\" on-change=\"onMediaChange($media)\"></media-picker>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-hide=\"config.editSize==false\">\n" +
    "        <div class=\"columns large-10 textAlignRight\">\n" +
    "            <label i18n=\"selectMedia.size\"></label>\n" +
    "        </div>\n" +
    "        <div class=\"columns large-15\">\n" +
    "            <select ng-model=\"mediaSize\" ng-init=\"mediaSize=mediaSize||'original'\"\n" +
    "                    ng-options=\"obj.id as obj.text for obj in mediaSizes\" ng-change=\"propagateChanges()\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("background.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("background.html",
    "<div>\n" +
    "    <div class=\"columns large-8\">\n" +
    "        <div><label i18n=\"editStyles.background.color\"></label></div>\n" +
    "        <input color-picker placeholder=\"Specify the color\" ng-model=\"background.color\" />\n" +
    "    </div>\n" +
    "    <div class=\"columns large-5\">\n" +
    "        <div><label i18n=\"editStyles.background.src\"></label></div>\n" +
    "        <media-picker ng-model=\"backgroundSrc\" multiple=\"false\" preview=\"true\" on-change=\"changeMediaId($media)\"></media-picker>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-4\" ng-show=\"existsSrc()\">\n" +
    "        <div><label i18n=\"editStyles.background.repeat\"></label></div>\n" +
    "        <div><input type=\"checkbox\" ng-model=\"background.mosaic\"/></div>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-4\" ng-show=\"existsSrc() && !background.mosaic\">\n" +
    "        <div><label i18n=\"editStyles.background.position.top\"></label></div>\n" +
    "        <select ng-model=\"background.position.top\" ng-options=\"obj.id as obj.text for obj in positions.top\"></select>\n" +
    "    </div>\n" +
    "    <div class=\"columns large-4\" ng-show=\"existsSrc() && !background.mosaic\">\n" +
    "        <div><label i18n=\"editStyles.background.position.left\"></label></div>\n" +
    "        <select ng-model=\"background.position.left\" ng-options=\"obj.id as obj.text for obj in positions.left\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("borders.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("borders.html",
    "<div>\n" +
    "    <div class=\"columns large-9\">\n" +
    "        <div><label i18n=\"editStyles.borders.color\"></label></div>\n" +
    "        <input color-picker ng-model=\"borders.color\" />\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8\">\n" +
    "        <div><label i18n=\"editStyles.borders.width\"></label></div>\n" +
    "        <input type=\"number\" ng-model=\"borders.width\" ng-change=\"onWidthChange()\" />\n" +
    "    </div>\n" +
    "    <div class=\"columns large-8\">\n" +
    "        <div><label i18n=\"editStyles.borders.style\"></label></div>\n" +
    "        <select ng-model=\"borders.style\" ng-options=\"obj.id as obj.text for obj in styles\"\n" +
    "                ng-init=\"borders.style=borders.style||styles[0].id\"></select>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("fileUploader.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("fileUploader.html",
    "<form enctype=\"multipart/form-data\" action=\"{{endpoint||'media/upload/'}}\" method=\"post\" class=\"fileUploader\">\n" +
    "    <input type=\"file\" ng-model=\"files\" ux-change=\"submit()\" name=\"upload\" multiple-files=\"{{multiple}}\" />\n" +
    "</form>");
}]);

angular.module("password.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("password.html",
    "<div>\n" +
    "    <a href=\"#\" ng-click=\"togglePassword()\" ng-show=\"clickToChange\">\n" +
    "        <label class=\"change\" ng-show=\"!changePasswordActive\"><label i18n=\"password.change\"></label></label>\n" +
    "        <label class=\"cancelChanges\" ng-show=\"changePasswordActive\"><label i18n=\"password.cancelChanges\"></label></label>\n" +
    "    </a>\n" +
    "    <input ng-show=\"changePasswordActive  || !clickToChange\" type=\"password\" ng-model=\"model\" password-mandatory />\n" +
    "</div>");
}]);

angular.module("rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("rating.html",
    "<ul class=\"rating\">\n" +
    "    <li ng-repeat=\"rating in normalizedRating\" ng-click=\"rate($index+1)\" ng-class=\"getStarStyleClass($index+1, rating)\"\n" +
    "        ng-mouseenter=\"hoverRate($index+1)\" ng-mouseleave=\"clearHoverRate()\">\n" +
    "            <div class=\"star\" ng-style=\"getStarSize()\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("contentList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("contentList.html",
    "<div>\n" +
    "    <div list-db=\"items\" id=\"_id\" collection=\"collection\" config=\"config\" template=\"template\"\n" +
    "         on-edit-panels=\"onEditPanels\" search-targets=\"searchTargets\" config=\"config\"></div>\n" +
    "</div>");
}]);

angular.module("languagesList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("languagesList.html",
    "<div class=\"languagesList\">\n" +
    "    <div list=\"languagesList\" collection=\"collection\" config=\"config\" template=\"template\" on-edit-panels=\"onEditPanels\"></div>\n" +
    "</div>");
}]);

angular.module("list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list.html",
    "<div ng-class=\"getWrapperClass()\">\n" +
    "    <div class=\"searchArea\" ng-show=\"isSearchable() && !detailId\">\n" +
    "        <label i18n=\"list.search\"></label>\n" +
    "        <input type=\"text\" ng-model=\"searchText\" ux-keyup=\"executeSearch()\"/>\n" +
    "    </div>\n" +
    "    <div ng-show=\"isPageActionsTop()\" list-actions class=\"top\" collection=\"collection\"></div>\n" +
    "    <div class=\"noItems\" ng-show=\"items.length == 0\"><i><label i18n=\"list.noItems\"></label></i></div>\n" +
    "    <div ng-show=\"items.length > 0\" ng-hide=\"detailId && detailId!=item._id\" id=\"{{item._id}}\"\n" +
    "         ng-repeat=\"item in items | filter: getFilter()\" class=\"item columns\"\n" +
    "         ng-class=\"getItemStyleClasses(item)\" ng-style=\"setItemHeight()\">\n" +
    "        <div class=\"selectFromCheckbox\" ng-show=\"isMultiSelectable()\" edit-target>\n" +
    "            <input checkbox class=\"white\" ng-model=\"item.isSelected\" ng-click=\"clickOnItem(item, $index, $event, false)\"\n" +
    "                   block-update-model=\"true\" />\n" +
    "        </div>\n" +
    "        <div class=\"text\" ng-click=\"clickOnItem(item, $index, $event, true)\">\n" +
    "             <div ux-transclude=\"template\"></div>\n" +
    "         </div>\n" +
    "        <button class=\"remove removeIcon\" ng-click=\"clickOnItem(item, $index, $event, false)\" ng-show=\"isDeletable()\"\n" +
    "                title confirm-action=\"deleteItem(item._id)\">\n" +
    "            <label i18n=\"list.deleteItem\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <a href=\"#\" class=\"detailArea floatRight\" ng-show=\"detailId\" ng-click=\"deleteDetailId()\">\n" +
    "        &lt;&lt; <label i18n=\"list.goBack\"></label>\n" +
    "    </a>\n" +
    "    <div ng-show=\"isPageActionsBottom()\" list-actions class=\"bottom\" collection=\"collection\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("listDb.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listDb.html",
    "<div>\n" +
    "    <div list=\"items\" collection=\"collection\" id=\"_id\" config=\"config\" projection=\"projection\"\n" +
    "         transcluded-data=\"transcludedData\" on-search=\"onSearch($text)\" on-select=\"selectItem($item)\"\n" +
    "         on-create=\"createItem($item)\" on-delete=\"deleteItem($id)\" current-page=\"currentPage\"\n" +
    "         db-source=\"true\" template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"></div>\n" +
    "</div>");
}]);

angular.module("mediaList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaList.html",
    "<div>\n" +
    "    <file-uploader ux-show=\"config.uploadable\" on-upload=\"onUpload()\" multiple=\"true\"></file-uploader>\n" +
    "    <div list-db=\"items\" collection=\"collection\" config=\"config\" projection=\"projection\"\n" +
    "         template=\"template\" on-edit-panels=\"onEditPanels\" search-targets=\"searchTargets\"\n" +
    "         transcluded-data=\"transcludedData\" on-select=\"selectItem($item)\">\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("tagList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tagList.html",
    "<div>\n" +
    "    <div list-db=\"items\" collection=\"collection\" config=\"config\" on-edit-panels=\"onEditPanels\"\n" +
    "         search-targets=\"searchTargets\">\n" +
    "        <h3><a href=\"#\">{{item.text}}</a></h3>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("userList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userList.html",
    "<div class=\"userList\">\n" +
    "    <div list=\"userList\" collection=\"collection\" config=\"config\" transcluded-data=\"transcludedData\"\n" +
    "         template=\"template\" on-create-panels=\"onCreatePanels\" on-edit-panels=\"onEditPanels\"\n" +
    "         on-create=\"onCreate($item)\" on-delete=\"onDelete($id)\"></div>\n" +
    "</div>");
}]);

angular.module("login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login.html",
    "<div>\n" +
    "    <div ng-show=\"userSession\">\n" +
    "        Hello, {{userSession.fullName}}. [<a href=\"#\" ng-click=\"logout()\">Logout</a>]\n" +
    "    </div>\n" +
    "    <form class=\"login cf\" action=\"rest/login\" method=\"POST\" ng-show=\"!userSession\">\n" +
    "        <div class=\"user columns large-12\">\n" +
    "            <div class=\"label columns large-8 textAlignRight\">E-mail:</div><div class=\"field columns large-16\">\n" +
    "            <input type=\"text\" name=\"email\" ng-model=\"email\" />\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        <div class=\"password columns large-11\">\n" +
    "            <div class=\"label columns large-8 textAlignRight\">Password:</div><div class=\"field columns large-16\">\n" +
    "            <input type=\"password\" name=\"password\" ng-model=\"password\" />\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        <!--<div class=\"remember rows\">\n" +
    "            <input checkbox ng-model=\"remember\" label=\"Remember\" />\n" +
    "        </div>-->\n" +
    "        <div class=\"submit columns large-2\">\n" +
    "            <button type=\"submit\" class=\"okIcon floatRight\"></button>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("mediaPicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mediaPicker.html",
    "<div class=\"mediaPicker\">\n" +
    "    <button class=\"mediaIcon\" ng-click=\"selectFromMediaList()\">\n" +
    "        <label i18n=\"fileUploader.selectFromMediaList\"></label>\n" +
    "    </button>\n" +
    "    <img class=\"current\" ng-src=\"{{getDownloadUrl(model)}}\" ng-show=\"model && preview=='true'\" title=\"{{getFileTitle(model)}}\" />\n" +
    "    <button class=\"removeIcon small\" ng-click=\"deleteSelection()\" ng-show=\"model._id\">\n" +
    "        <label i18n=\"fileUploader.deleteSelection\"></label>\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("pages.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pages.html",
    "<div class=\"portal\" ng-class=\"getCurrentUserAdminAccessStyleClass()\">\n" +
    "    <ul class=\"pages\" ng-style=\"setPagesStyles()\">\n" +
    "        <li ng-repeat=\"row in portal.template.rows\" class=\"rows\">\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"column in row.columns\" resizable-app=\"{{isAppResizeAllowed()}}\" class=\"columns\"\n" +
    "                    ng-class=\"getColStyleClass(column, $index, true)\">\n" +
    "                    <ul ux-show=\"column.apps\" sortable-app=\"{{isAppSortAllowed()}}\" ui-sortable=\"sortableOptions\"\n" +
    "                        ng-model=\"column.apps\" class=\"appContainer\">\n" +
    "                        <li app=\"app.id\" ng-repeat=\"app in column.apps\" model=\"app.model\" type=\"app.type\" template-app=\"true\" width=\"column.size\"></li>\n" +
    "                    </ul>\n" +
    "                    <ul ux-show=\"column.rows\">\n" +
    "                        <li ng-repeat=\"row in column.rows\" class=\"rows\">\n" +
    "                            <ul>\n" +
    "                                <li ng-repeat=\"column in row.columns\" resizable-app=\"{{isAppResizeAllowed()}}\"\n" +
    "                                    ng-class=\"getColStyleClass(column, $index, false)\" class=\"columns page\">\n" +
    "                                    <ul sortable-app=\"{{isAppSortAllowed()}}\" ui-sortable=\"sortableOptions\" ng-model=\"column.apps\" class=\"appContainer\">\n" +
    "                                        <li app=\"app.id\" ng-repeat=\"app in column.apps\" model=\"app.model\" type=\"app.type\" template-app=\"false\" width=\"column.size\"></li>\n" +
    "                                    </ul>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("errorPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("errorPage.html",
    "<div class=\"errorPage\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"inner\">\n" +
    "            <div class=\"cf\">\n" +
    "                <img class=\"columns large-8\" src=\"/client/images/error.png\"/>\n" +
    "                <div class=\"text columns large-17\">\n" +
    "                    <h2 class=\"title\" ng-bind=\"errorTitle\"></h2>\n" +
    "                    <button class=\"addIcon\" ng-click=\"goToPortalHome()\" ng-show=\"showPortalHomeButton\">\n" +
    "                        <label i18n=\"errorPage.goToPortalHome\"></label>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("loginPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("loginPage.html",
    "<div global-msg></div>\n" +
    "<div class=\"loginPage\">\n" +
    "    <div class=\"logo\"></div>\n" +
    "    <login></login>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("portalPage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("portalPage.html",
    "<div global-msg></div>\n" +
    "<admin-panel ux-show=\"isAdmin()\"></admin-panel>\n" +
    "<pages></pages>");
}]);

angular.module("listActions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listActions.html",
    "<div class=\"cf\">\n" +
    "    <div class=\"leftActions floatLeft onSelectActions\" ng-show=\"isMultiSelectable() && items.length\">\n" +
    "        <button class=\"okIcon\" ng-click=\"toggleSelectAll()\">\n" +
    "            <label i18n=\"list.selectItems\"></label>\n" +
    "        </button>\n" +
    "        <button class=\"removeIcon\" ng-click=\"deleteSelected()\" ng-show=\"selectedIds.length && isDeletable()\">\n" +
    "            <label i18n=\"list.deleteSelected\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"leftActions floatLeft createActions\" ng-show=\"isCreatable()\">\n" +
    "        <button create-item-button class=\"addIcon\" ng-click=\"createItem()\" collection=\"collection\"\n" +
    "                on-create=\"createItem($item)\" on-create-panels=\"onCreatePanels\">\n" +
    "            <label i18n=\"list.createItem\"></label>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"rightActions floatRight getPageActions\" ng-show=\"showPrevPageLink()||showNextPageLink()\">\n" +
    "        <button class=\"getPrevPage\" ng-click=\"getPrevPage()\" ng-show=\"showPrevPageLink()\">&lt;</button>\n" +
    "        <button class=\"getNextPage\" ng-click=\"getNextPage()\" ng-show=\"showNextPageLink()\">&gt;</button>\n" +
    "    </div>\n" +
    "    <div class=\"selectedItems\">\n" +
    "        <label ng-class=\"{show: selectedIds.length}\">{{selectedIds.length}} <label i18n=\"list.selectedItems\"></label></label>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("listEdit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("listEdit.html",
    "<div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-25\"><input checkbox ng-model=\"model.searchable\" label=\"Enable search\"/></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Page size:</div>\n" +
    "        <div class=\"columns large-12\"><input type=\"text\" ng-model=\"model.pageSize\" /></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Skip:</div>\n" +
    "        <div class=\"columns large-12\"><input type=\"text\" ng-model=\"model.skip\" /></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Sort field:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.sort.field\" ng-options=\"obj.id as obj.text for obj in sortTypes.field\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Sort order:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.sort.order\" ng-options=\"obj.id as obj.text for obj in sortTypes.order\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <label>\n" +
    "        Pagination position:\n" +
    "        <select ng-model=\"model.pageActionPos\" >\n" +
    "            <option value=\"0\">Top</option>\n" +
    "            <option value=\"1\">bottom</option>\n" +
    "            <option value=\"2\">topAndBottom</option>\n" +
    "        </select>\n" +
    "    </label>\n" +
    "\n" +
    "    Filter:\n" +
    "    <auto-complete ng-model=\"model.tags\" ng-options=\"availableTags\" label-key=\"text\"\n" +
    "                   placeholder=\"Select tags to filter\" multiple=\"true\"></auto-complete>\n" +
    "\n" +
    "    <div class=\"columns large-12\">\n" +
    "        <div class=\"columns large-13 textAlignRight\">Columns:</div>\n" +
    "        <div class=\"columns large-12\">\n" +
    "            <select ng-model=\"model.columns\" ng-options=\"obj.value as obj.text for obj in columnOptions\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
