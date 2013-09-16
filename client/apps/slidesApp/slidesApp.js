COMPONENTS.directive('slidesAppView', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'slidesAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
        link: function link(scope) {

            var appPath = '/client/apps/slidesApp/';

            scope.model.slides = [
                { content: '<h1>Hello slides app!</h1><h3>Welcome to the fancy app to show presentations</h3>(In progress...)' },
                { content: '<h3>Discramiler</h3>This is a harcoded example about how to add cool stuff with small effort' }
            ];

            if(window.Reveal) { //Reveal library has been already loaded
                initializeWithoutResources();
            } else { //Reveal doesn't exists -> load it
                initializeWithResources();
            }

            /** Private methods **/
            function initializeWithResources() {
                loadResources(function() {
                    initializeReveal();
                    scope.$apply();
                });
            }

            function initializeWithoutResources() {
                initializeReveal();
                setTimeout(function() {
                    Reveal.next();
                    Reveal.prev();
                }, 0);
            }

            function loadResources(callback) {
                yepnope({
                    load: [
                        appPath + 'css/reveal.min.css',
                        appPath + 'js/reveal.js',
                        appPath + 'lib/js/head.min.js'
                    ],
                    complete: function () {
                        if(callback) { callback(); }
                    }
                });
            }

            function initializeReveal() {
                window.Reveal.initialize({
                    controls: true,
                    progress: true,
                    history: false,
                    center: true,
                    theme: Reveal.getQueryHash().theme,
                    transition: Reveal.getQueryHash().transition || 'default',
                    dependencies: [ // Optional libraries used to extend on reveal.js
                        { src: appPath + 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
                        { src: appPath + 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
                        { src: appPath + 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } }
                    ]
                });
                scope.show = true;
            }
            /** End of private methods **/
        }
	};
}]);

COMPONENTS.directive('slidesAppEdit', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'slidesAppEdit.html',
        scope: {
            model           : '=',
            internalData    : '=',
            onLayerSave     : '='
        },
        link: function link(scope) {}
    };
}]);