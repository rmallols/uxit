module.exports = function(grunt) {
    var devKey = 'dev', prodKey = 'prod';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app_lib: 'client/lib/',
        app_js: 'client/js/',
        app_css: 'client/css',
        min: 'client/min/',
        clean: ['<%= min %>js.min.js', '<%= min %>css.min.css', '<%= app_js %>/resources-<%= pkg.version %>.js'],
        jshint: {
            all: ['<%= app_js %>*.js', '<%= app_js %>controllers/*.js',
                '<%= app_js %>directives/*.js', '<%= app_js %>directives/*/*.js',
                '<%= app_js %>services/*.js', '<%= app_js %>services/*/*.js'],
            options: {
                '-W014': false, //Bad line breaking,
                '-W060': false //Document.write can be a form of eval (enable once we have a script loader)
            }
        },
        karma: {
            run: {
                configFile: 'server/config/karma.conf.js',
                singleRun: true/*,
                 background: true*/
            },
            watch: {
                configFile: 'server/config/karma.conf.js',
                singleRun: false
            }
        },
        preprocess : {
            htmlDev : {
                src : 'server/index.tpl.html',
                dest : 'server/index.html',
                options : {
                    context : {
                        version : 'dev'
                    }
                }
            },
            htmlProd : {
                src : 'server/index.tpl.html',
                dest : 'server/index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>'
                    }
                }
            },
            jsProd: {
                src : '<%= app_js %>/resources-prod.js',
                dest : '<%= app_js %>/resources-<%= pkg.version %>.js'
            }
        },
        concat: {
            buildFormLets: {
                files: {
                    '<%= min %>js.min.js': ['<%= app_js %>controllers/*.js',
                        '<%= app_js %>directives/*.js', '<%= app_js %>directives/*/*.js',
                        '<%= app_js %>services/*.js', '<%= app_js %>services/*/*.js',
                        '<%= app_js %>errorHandler.js', '<%= app_js %>templates.js'],
                    '<%= min %>lib.min.js': ['<%= app_lib %>i18n/*.js',
                        '<%= app_lib %>yepnope/*.js',
                        '<%= app_lib %>rangy/*.js',
                        '<%= app_lib %>form/*.js',
                        '<%= app_lib %>morrisJs/*.js',
                        '<%= app_lib %>select2/*.js',
                        '<%= app_lib %>powerTip/*.js',
                        '<%= app_lib %>mousetrap/mousetrap.min.js',
                        '<%= app_lib %>mousetrap/mousetrap-global-bind.min.js',
                        '<%= app_lib %>fullscreen/*.js',
                        '<%= app_lib %>miniColors/*.js',
                        '<%= app_lib %>iCheck/*.js']
                }
            }
        },
        uglify: {
            options: {
                mangle: false, //reduce names of local variables to (usually) single-letters.
                banner: '/* Minified js files! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildFormLets: {
                files: {
                    '<%= min %>js.min.js': ['<%= min %>js.min.js'],
                    '<%= min %>lib.min.js': ['<%= min %>lib.min.js']
                }
            }
        },
        less: {
            prod: {
                options: {
                    compress: true
                },
                files: {
                    "<%= min %>css.min.css": "client/css/main.less"
                }
            }
        },
        html2js: {
            options: {
                rename: function (moduleName) {
                    return moduleName.substring(moduleName.lastIndexOf('/') + 1);
                }
            },
            main: {
                src: ['client/**/*.html'],
                dest: '<%= app_js %>templates.js'
            }
        },
        shell: {
            mongo: {
                command: grunt.option('path'),
                options: {
                    async: true
                }
            }
        },
        bumpup: {
            file: 'package.json',
            setters: {
                version: function (oldVersion, releaseType, options) {
                    var semver = require('./node_modules/semver'),
                        type = (grunt.option('env') === prodKey) ? 'minor' : 'patch';
                    return semver.inc(oldVersion, type);
                },
                timestamp: function () {
                    return +new Date();
                },
                dbHost: function () {
                    return (grunt.option('env') === prodKey) ? 'ds053188.mongolab.com' : 'localhost';
                },
                dbPort: function () {
                    return (grunt.option('env') === prodKey) ? '53188' : '27017';
                },
                dbUser: function () {
                    return (grunt.option('env') === prodKey) ? 'test' : '';
                },
                dbPassword: function () {
                    return (grunt.option('env') === prodKey) ? 'test' : '';
                },
                mode: function () {
                    var constantsService = require('./server/constantsService');
                    return (grunt.option('env') === prodKey) ? constantsService.modes.cloud : constantsService.modes.host;
                }
            },
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bumpup');

    grunt.registerTask('startMongo', ['shell']);
    grunt.registerTask('startKarma', ['karma:watch']);
    grunt.registerTask('generateTemplates', ['html2js']);
    grunt.registerTask('devPreprocess', ['preprocess:htmlDev']);
    grunt.registerTask('prodPreprocess', ['preprocess:htmlProd', 'preprocess:jsProd']);
    grunt.registerTask('bump', ['bumpup:minor']);
    grunt.registerTask('dev', ['clean', 'jshint', 'karma:run', 'bump', 'devPreprocess', 'generateTemplates']);
    grunt.registerTask('prod', ['clean', 'jshint', 'karma:run', 'bump', 'prodPreprocess',
        'generateTemplates', 'concat', 'uglify', 'less:prod']);
};