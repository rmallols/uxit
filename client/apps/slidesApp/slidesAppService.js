(function () {
    'use strict';
    COMPONENTS.service('slidesAppService', ['timerService', function (timerService) {

        function view(scope) {
            var appPath = '/client/apps/slidesApp/';

            scope.model.slides = [
                {
                    _id: timerService.getRandomNumber(),
                    content:  '<h1>Hello slides app!</h1>' +
                            '<h3>Welcome to the fancy app to show presentations</h3>(In progress...)'
                }, {
                    _id: timerService.getRandomNumber(),
                    content: '<h3>Discramiler</h3>' +
                            'This is a harcoded example about how to add cool stuff with small effort'
                }
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
                        { src:  appPath + 'lib/js/classList.js',
                                condition: function() { return !document.body.classList; }
                        },
                        { src:  appPath + 'plugin/highlight/highlight.js',
                                async: true,
                                callback: function() { hljs.initHighlightingOnLoad(); }
                        },
                        { src:  appPath + 'plugin/zoom-js/zoom.js',
                                async: true,
                                condition: function() { return !!document.body.classList; }
                        }
                    ]
                });
                scope.show = true;
            }
            /** End of private methods **/
        }

        function edit(scope) {
            console.log("le hemos quitado la clase 'scrollable' al list.html");
            console.log("HAY QUE NORMALIZAR COMO SE ENVIAN LOS ATRIBUTOS!!");
            //scope.template = '<div ng-bind-html-unsafe="item.content"></div>';
            scope.collection = 'slides';
            scope.template = '<label i18n-db="item.content"></label>';
            scope.onCreatePanels = [{ title: 'Edit database', type: 'createDb',
                                    appBridge: true, src:'slidesApp', view:'editSlide' }];
            scope.onEditPanels = [{ title: 'Edit slide', type: 'slidesAppEditSlide',
                                    appBridge: true, src:'slidesApp', view:'editSlide'}];
            scope.config = {
                creatable: true,
                editable: true,
                multiSelectable: true
            };
            scope.onCreate = function($item) {
                scope.model.slides.push({
                    _id     : timerService.getRandomNumber(),
                    content : $item.content
                });
            }
        }

        return {
            view: view,
            edit: edit
        };
    }]);
})();
