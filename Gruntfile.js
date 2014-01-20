module.exports = function(grunt) {
    var constantsService = require('./server/constantsService'),
        prodKey = constantsService.envs.prod;
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        libFolder: 'client/lib/',
        jsFolder: 'client/js/',
        htmlFolder: 'client/html/',
        cssFolder: 'client/css',
        minFolder: 'client/min/',
        appsFolder: 'client/apps/',
        clean: ['<%= minFolder %>js.min.js', '<%= jsFolder %>/resources-<%= pkg.version %>.js'],
        jshint: {
            all: ['<%= jsFolder %>*.js', '<%= jsFolder %>controllers/*.js',
                '<%= jsFolder %>directives/*.js', '<%= jsFolder %>directives/**/*.js',
                '<%= jsFolder %>services/*.js', '<%= jsFolder %>services/**/*.js'],
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
                src : './index.tpl.html',
                dest : './index.html',
                options : {
                    context : {
                        version : 'dev'
                    }
                }
            },
            htmlProd : {
                src : './index.tpl.html',
                dest : './index.html',
                options : {
                    context : {
                        version : '<%= pkg.version %>'
                    }
                }
            },
            jsProd: {
                src : '<%= jsFolder %>/resources-prod.js',
                dest : '<%= jsFolder %>/resources-<%= pkg.version %>.js'
            }
        },
        concat: {
            src: {
                files: {
                    '<%= minFolder %>js.min.js': [
                        '<%= jsFolder %>controllers/*.js',
                        '<%= jsFolder %>directives/**/*.js',
                        '<%= jsFolder %>services/**/*.js',
                        '<%= jsFolder %>errorHandler.js', '<%= jsFolder %>templates.js']
                }
            },
            lib: {
                files: {
                    '<%= minFolder %>lib.min.js': [
                        '<%= libFolder %>date/date.js', '<%= libFolder %>date/i18n/*.js',
                        '<%= libFolder %>angularJs/angular-sortable-0.0.1.js',
                        '<%= libFolder %>powerTip/jquery.powertip-1.2.0.js',
                        '<%= libFolder %>i18n/jquery.i18n.properties-1.0.9.js',
                        '<%= libFolder %>rangy/rangy-*.js',
                        '<%= libFolder %>yepnope/yepnope-1.5.4.js',
                        '<%= libFolder %>form/jquery.form-3.25.0.js',
                        '<%= libFolder %>morrisJs/*.js',
                        '<%= libFolder %>select2/select2-3.4.5.js',
                        '<%= libFolder %>mousetrap/mousetrap-1.4.6.js',
                        '<%= libFolder %>fullscreen/jquery.fullscreen-1.1.4.js',
                        '<%= libFolder %>miniColors/jquery.minicolors-2.1.1.js',
                        '<%= libFolder %>iCheck/jquery.icheck-0.9.1.js',
                        '<%= libFolder %>nprogress/nprogress-0.1.2.js']
                }
            }
        },
        uglify: {
            //Take the options from http://lisperator.net/uglifyjs/compress, start everything false and find where it fails. Afterwards, if possiblle, restore the select2.min.js
            options: {
                mangle: true, //reduce names of local variables to (usually) single-letters.
                report: 'min',
                banner: '/* Minified js files! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            src: {
                files: {
                    '<%= minFolder %>js.min.js': ['<%= minFolder %>js.min.js']
                }
            },
            lib: {
                files: {
                    '<%= minFolder %>lib.min.js': ['<%= minFolder %>lib.min.js']
                }
            }
        },
        /*less: {
            prod: {
                options: {
                    compress: true
                },
                files: {
                    "<%= minFolder %>css.min.css": "client/css/main.less"
                }
            }
        },*/
        html2js: {
            options: {
                rename: function (moduleName) {
                    return moduleName.substring(moduleName.lastIndexOf('/') + 1);
                }
            },
            main: {
                src: ['client/**/*.html'],
                dest: '<%= jsFolder %>templates.js'
            }
        },
        shell: {
            startSelenium: {
                command: 'java -jar ./node_modules/protractor/bin/selenium/selenium-server-standalone-2.37.0.jar ' +
                         '-Dwebdriver.chrome.driver=./node_modules/protractor/bin/selenium/chromedriver.exe',
                options: { stdout: true }
            },
            startProtractor:{ command: '.\\node_modules\\.bin\\protractor .\\server\\tests\\e2e\\customConf.js', options: { stdout: true } },
            startMongo:     { command: grunt.option('path'), options: { async: true, stdout: true }},
            githubAdd:      { command: 'git add .', options: { stdout: true } },
            githubCommit:   { command: 'git commit -m "#0 prod update"', options: { stdout: true } },
            githubPush:     { command: 'git push', options: { stdout: true } },
            herokuPush:     { command: 'git push heroku master', options: { stdout: true } },
            herokuLogs:     { command: 'heroku logs --tail', options: { stdout: true } }
        },
        bumpup: {
            file: 'package.json',
            setters: {
                version: function (oldVersion, releaseType, options) {
                    var semver = require('./node_modules/semver'),
                        type = (grunt.option('env') === prodKey) ? 'minor' : 'patch';
                    return semver.inc(oldVersion, type);
                },
                env: function () {
                    return grunt.option('env');
                },
                timestamp: function () {
                    return +new Date();
                },
                dbHost: function () {
                    return (grunt.option('env') === prodKey) ? 'ds053978.mongolab.com' : 'localhost';
                },
                dbPort: function () {
                    return (grunt.option('env') === prodKey) ? '53978' : '27017';
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
        },
        watch: {
            templates: {
                files: ['<%= htmlFolder %>**/*.html', '<%= appsFolder %>**/*.html'],
                tasks: ['generateTemplates'],
                options: {
                    spawn: false
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
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('startKarma', ['karma:watch']);
    grunt.registerTask('startMongo', ['shell:startMongo']);
    grunt.registerTask('startSelenium', ['shell:startSelenium']);
    grunt.registerTask('startProtractor', ['shell:startProtractor']);
    grunt.registerTask('generateTemplates', ['html2js']);
    grunt.registerTask('devPreprocess', ['preprocess:htmlDev']);
    grunt.registerTask('prodPreprocess', ['preprocess:htmlProd', 'preprocess:jsProd']);
    grunt.registerTask('bump', ['bumpup:minor']);
    grunt.registerTask('githubPush', ['shell:githubAdd', 'shell:githubCommit', 'shell:githubPush']);
    grunt.registerTask('herokuPush', ['shell:herokuPush']);
    grunt.registerTask('herokuLogs', ['shell:herokuLogs']);
    grunt.registerTask('dev', ['clean', 'jshint', 'bump', 'devPreprocess', 'generateTemplates', 'githubPush']);
    grunt.registerTask('prod', ['clean', 'jshint', 'startProtractor', 'karma:run', 'bump', 'prodPreprocess',
                                'generateTemplates', 'concat', 'uglify', 'githubPush', 'herokuPush']);
};