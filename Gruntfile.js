module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app_lib: 'client/lib/',
        app_js: 'client/js/',
        app_css: 'client/css',
        min: 'client/min/',
        clean: ['<%= min %>js.min.js', '<%= min %>css.min.css'],
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
            unit: {
                configFile: 'server/config/karma.conf.js',
                singleRun: true/*,
                background: true*/
            }
        },
        preprocess : {
            dev : {
                src : '<%= app_js %>/resources.dev.js',
                dest : '<%= app_js %>/resources.js'
            },
            prod : {
                src : '<%= app_js %>/resources.prod.js',
                dest : '<%= app_js %>/resources.js',
                options : {
                    context : {
                        name : '<%= pkg.name %>',
                        version : '<%= pkg.version %>',
                        now : '<%= now %>',
                        ver : '<%= ver %>'
                    }
                }
            }
        },
        concat: {
            buildFormLets: {
                files: {
                    '<%= min %>js.min.js': ['<%= app_js %>controllers/*.js',
                                            '<%= app_js %>directives/*.js', '<%= app_js %>directives/*/*.js',
                                            '<%= app_js %>services/*.js', '<%= app_js %>services/*/*.js',
                                            '<%= app_js %>errorHandler.js', '<%= app_js %>templates.js'],
                    '<%= min %>lib.min.js': ['<%= app_lib %>fabricJs/*.js',
                                             '<%= app_lib %>i18n/*.js',
                                             '<%= app_lib %>yepnope/*.js',
                                             '<%= app_lib %>rangy/*.js',
                                             '<%= app_lib %>form/*.js',
                                             '<%= app_lib %>morrisJs/*.js',
                                             '<%= app_lib %>select2/*.js',
                                             '<%= app_lib %>powerTip/*.js',
                                             '<%= app_lib %>mousetrap/*.js',
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');

    //grunt.registerTask('default', []);
    //grunt.registerTask('krm', ['karma']);
    grunt.registerTask('dev', ['clean', 'jshint', 'karma', 'preprocess:dev']);
    grunt.registerTask('prod', ['clean', 'jshint', 'karma', 'preprocess:prod', 'concat', 'uglify', 'less:prod']);
    grunt.registerTask('tc2', ['html2js']);
};