COMPONENTS.directive('slidesAppView', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/slidesApp/slidesAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
        link: function link() {

            var appPath = '/client/apps/slidesApp/';

            yepnope({
                load: [
                    appPath + 'css/reveal.min.css',
                    appPath + 'css/theme/default.css',
                    appPath + 'js/reveal.js',
                    appPath + 'lib/js/head.min.js'
                ],
                complete: function () {
                    // Full list of configuration options available here:
                    // https://github.com/hakimel/reveal.js#configuration
                    setTimeout(function() {
                        console.log("RV2", Reveal.getQueryHash())
                        Reveal.initialize({
                            controls: true,
                            progress: true,
                            history: true,
                            center: true,

                            theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
                            transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

                            // Optional libraries used to extend on reveal.js
                            dependencies: [
                                { src: appPath + 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
                                { src: appPath + 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                                { src: appPath + 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
                                { src: appPath + 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
                                { src: appPath + 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
                                { src: appPath + 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
                            ]
                        });
                    }, 1000)
                }
            });
        }
	};
}]);

COMPONENTS.directive('slidesAppEdit', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/apps/slidesApp/slidesAppEdit.html',
        scope: {
            model           : '=',
            internalData    : '=',
            onLayerSave     : '='
        },
        link: function link(scope) {}
    };
}]);