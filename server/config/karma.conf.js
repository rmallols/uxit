// base path, that will be used to resolve files and exclude
basePath= '../../';


// list of files / patterns to load in the browser
files= [
    JASMINE,
    JASMINE_ADAPTER,
    './client/lib/jQuery/jquery-2.0.2.min.js',
    './client/lib/angularJs/angular-*.js',
    './client/lib/i18n/jquery.i18n.properties-min-1.0.9.js',
    './client/lib/powerTip/jquery.powertip.min.js',
    './client/lib/iCheck/jquery.icheck-0.9.1.min.js',
    './client/lib/less/less-1.3.0.min.js',
    './client/lib/rangy/*.js',
    './client/js/index.js',
    './client/js/templates.js',
    './client/js/directives/*',
    './client/js/directives/*/*',
    './client/js/services/*',
    './client/js/services/*/*',
    './client/html/input/fileUploader.html',
    './server/tests/unit/directives/*.spec.js',
    './server/tests/unit/services/*.spec.js',
    './server/tests/unit/mocks.js',
    './server/tests/unit/utils.js'
];

// list of files to exclude
exclude= [];

// use dolts reporter, as travis terminal does not support escaping sequences
// possible values= 'dots', 'progress', 'junit', 'teamcity'
// CLI --reporters progress
reporters= ['progress', 'junit'];

junitReporter= {
    // will be resolved to basePath (in the same way as files/exclude patterns)
    outputFile: 'test-results.xml'
};

// web server port
// CLI --port 9876
port= 9876;

// cli runner port
// CLI --runner-port 9100
runnerPort= 9100;

// enable / disable colors in the output (reporters and logs)
// CLI --colors --no-colors
colors= true;

// level of logging
// possible values= karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
// CLI --log-level debug
//logLevel= karma.LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
// CLI --auto-watch --no-auto-watch
autoWatch= true;

// Start these browsers, currently available=
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
// CLI --browsers Chrome,Firefox,Safari
browsers= [];

// If browser does not capture in given timeout [ms], kill it
// CLI --capture-timeout 5000
captureTimeout= 5000;

// Auto run tests on start (when browsers are captured) and exit
// CLI --single-run --no-single-run
singleRun= false;

// report which specs are slower than 500ms
// CLI --report-slower-than 500
reportSlowerThan= 500;

// compile coffee scripts
preprocessors= {
    './client/html/**/*.html': 'html2js'
};

plugins= [
    'karma-jasmine',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-junit-reporter'
]