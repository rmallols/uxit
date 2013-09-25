(function (Mousetrap) {
    'use strict';
    COMPONENTS.factory('keyboardService', ['arrayService', 'stringService', 'constantsService',
    function (arrayService, stringService, constantsService) {

        var bindFns = [], //Stack of functions
            blockShortcut = false;

        /**
         * Registers a new global keyboard event
         *
         * @param {*}           shortcut    The keyboard shortcut that is going to be registered. Can be single on an array
         * @param {string}      source      The component type that is going to register the shortcut
         * @param {function}    bindFn      The function to execute every time the shortcut is typed
         */
        function register(shortcut, source, bindFn) {

            function stackAndBind(shortcut, source, bindFn) {
                var normalizedShortcut = normalizeShortcut(shortcut);
                if (!bindFns[normalizedShortcut]) { bindFns[normalizedShortcut] = []; }
                //Add the binding function to the top of the stack
                bindFns[normalizedShortcut].push({ fn: bindFn, source: source});
                bind(normalizedShortcut, bindFn);
            }

            if (arrayService.isArray(shortcut)) {
                shortcut.forEach(function (shortcutInstance) {
                    stackAndBind(shortcutInstance, source, bindFn);
                });
            } else {
                stackAndBind(shortcut, source, bindFn);
            }
        }

        /**
         * Unregisters a new global keyboard event
         *
         * @param {string} shortcut The keyboard shortcut that is going to be unregistered
         * @param {string} source   The component type that is going to unregister the shortcut
         */
        function unregister(shortcut, source) {

            function unstackAndUnbind(shortcut, source) {
                var normalizedShortcut = normalizeShortcut(shortcut), bindFnsShortcut = bindFns[normalizedShortcut];
                if (bindFnsShortcut && bindFnsShortcut[bindFnsShortcut.length - 1]
                && source === bindFnsShortcut[bindFnsShortcut.length - 1].source) {
                    //Remove the unbinded function from the stack
                    arrayService.delete(bindFnsShortcut, bindFnsShortcut.length - 1);
                    unbind(normalizedShortcut);
                }
            }

            if (arrayService.isArray(shortcut)) {
                shortcut.forEach(function (shortcutInstance) {
                    unstackAndUnbind(shortcutInstance, source);
                });
            } else {
                unstackAndUnbind(shortcut, source);
            }
        }

        function bind(shortcut, bindFn) {
            //Normalize the binding function, adding a return false to avoid default browser actions
            var normalizedBindFn = function () {
                if (!blockShortcut) {
                    bindFn();
                    blockShortcut = true;
                    setTimeout(function () {
                        blockShortcut = false;
                    }, constantsService.keyboardInterval);
                }
                return false;
            };
            Mousetrap.bindGlobal(shortcut, normalizedBindFn); //Use bind global to enable events even inside of inputs
        }

        function unbind(shortcut) {
            var bindFnsShortcut = bindFns[shortcut];
            Mousetrap.unbind(shortcut);
            if (bindFnsShortcut.length) { //If there're more function in the stack, revive the latest defined one
                bind(shortcut, bindFnsShortcut[bindFnsShortcut.length - 1].fn);
            }
        }

        function normalizeShortcut(shortcut) {
            return stringService.replaceToken(shortcut, ' ', '');
        }

        return {
            register: register,
            unregister: unregister
        };
    }]);
})(window.Mousetrap);
