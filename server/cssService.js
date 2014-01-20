(function() {
    'use strict';
    var less                = require( 'less'),
        fs                  = require( 'fs'),
        constantsService    = require("./constantsService"),
        getService          = require("./crud/getService"),
        pkg                 = require("../package.json");

    module.exports = {

        _cssCache: {},

        _getPortalVars: function(dbCon, callback) {
            var params = {
                projection : { 'styles.cssVars': 1 }
            };
            getService.getFirst(dbCon, constantsService.collections.portal, params, function (portalVars) {
                callback(portalVars);
            });
        },

        _getNormalizedVars: function(vars) {
            var varKey, normalizedVars = '';
            for (varKey in vars) {
                if (vars.hasOwnProperty(varKey) && vars[varKey]) {
                    normalizedVars += '@' + varKey + ':' + vars[varKey] + ';';
                }
            }
            return normalizedVars;
        },

        _getLessParsingOptions: function() {
            return {
                paths         : ["/client/css"],  // .less file search paths
                optimization  : 1,                  //optimization level, higher is better but more volatile
                filename      : "main.less",        // root .less file
                compress      : true,               //compress?
                yuicompress   : true                //use YUI compressor?
            };
        },

        _setAbsolutePath: function(portalVars) {
            portalVars.absoluteClientPath = "'" + __dirname.replace(/\\/g, '/') + "/../client/'";
        },

        _parseLessVariables: function(dataString, portalVars, callback) {
            var options = this._getLessParsingOptions(),
                parser = new less.Parser(options), cssString;
            dataString += '\n' + this._getNormalizedVars(portalVars) + '\n';
            parser.parse( dataString, function ( error, cssTree ) {
                if (error) { less.writeError( error, options ); return; }
                cssString = cssTree.toCSS({compress: options.compress, yuicompress: options.yuicompress});
                callback(cssString);
            });
        },

        _getCss: function(portalVars, callback) {
            var self = this;
            //Generate the absolute path to the LESS resources
            //This is necessary since they're handled taking as reference the root of the system,
            //and not the root of the project
            self._setAbsolutePath(portalVars);
            fs.readFile( __dirname + '/../client/css/main.less', function ( error, data ) {
                self._parseLessVariables(data.toString(), portalVars, callback);
            });
        },

        _isProdEnv: function() {
            return pkg.env === constantsService.modes.prod;
        },

        getPortalCss: function (dbCon, portalId, forceRefresh, callback) {
            var self = this;
            //Manage caches only in production as in there the css resources cannot be changed
            if(self._isProdEnv() && self._cssCache[portalId] && !forceRefresh) {
                console.log("GETTING FROM CACHE**********************")
                callback(this._cssCache[portalId]);
            } else {
                console.log("NO CACHE...GENERATING!!!!*******************", self._isProdEnv(), portalId, self._cssCache[portalId], forceRefresh);
                self._getPortalVars(dbCon, function(portalVars) {
                    self._getCss(portalVars.styles.cssVars || {}, function(css) {
                        if(self._isProdEnv()) { self._cssCache[portalId] = css; }
                        callback(css);
                    });
                });
            }
        }
    };
})();