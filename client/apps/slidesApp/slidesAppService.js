(function () {
    'use strict';
    COMPONENTS.service('slidesAppService', ['appService', 'timerService',
    function (appService, timerService) {

        var appPath = '/client/apps/slidesApp/', Reveal;

        function view(scope) {
            if(Reveal) { //Reveal library has been already loaded
                initializeWithoutResources();
            } else { //Reveal doesn't exists -> load it
                initializeWithResources(function() {
                    scope.show = true;
                    scope.$apply();
                });
            }
        }

        function edit(scope, iElement) {
            var newSlide = {};
            scope.collection = 'slides';
            scope.template = '<label i18n-db="item.content"></label>';
            scope.onCreatePanels = [{ title: 'Create slide',
                                    appBridge: true, src:'slidesApp', view:'editSlide',
                                    bindings: { model: newSlide}}];
            scope.onEditPanels = [{ title: 'Edit slide',
                                    appBridge: true, src:'slidesApp', view:'editSlide',
                                    bindings: { slide: {}}}];
            scope.config = getEditConfig();
            scope.onCreate = function() { onCreateSlide(scope.model, newSlide); };
            scope.onDelete = function() { onDeleteSlide(scope.model, iElement); };
        }

        /** Private methods **/
        function initializeWithResources(callback) {
            loadResources(function() {
                initializeReveal();
                callback();
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
                    Reveal = window.Reveal;
                    if(callback) { callback(); }
                }
            });
        }

        function initializeReveal() {
            Reveal.initialize({
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
        }

        function getEditConfig() {
              return {
                  creatable       : true,
                  editable        : true,
                  deletable       : true,
                  multiSelectable : true
              };
        }

        function onCreateSlide(model, $item) {
            console.log("CREATING!!!", model, $item);
            model.slides.push({
                _id     : timerService.getRandomNumber(),
                content : $item.content
            });
            initializeWithoutResources();
        }

        function onDeleteSlide(model, iElement) {
            var appElement;
            //For some unknown reason, if there's just one slide,
            //the 'next' button is still enabled so it's necessary to disable it manually
            //in order to avoid giving the wrong impression it's still clickable
            if(model.slides.length === 1) {
                appElement = appService.getAppRootElem(iElement);
                $('.navigate-right', appElement).removeClass('enabled');
            }
        }
        /** End of private methods **/

        return {
            view: view,
            edit: edit
        };
    }]);
})();
