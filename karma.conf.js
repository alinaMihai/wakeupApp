// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],
        // list of files / patterns to load in the browser
        files: [
            'client/bower_components/jquery/dist/jquery.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/ngstorage/ngStorage.js',
            'client/bower_components/angular-audio/app/angular.audio.js',
            'client/bower_components/lodash/dist/lodash.compat.js',
            'client/bower_components/toastr/toastr.js',
            'client/bower_components/angular-filter/dist/angular-filter.min.js',
            'client/bower_components/angular-bindonce/bindonce.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client/bower_components/spin.js/spin.js',
            'client/bower_components/angular-spinner/angular-spinner.js',
            'client/app/app.js',

            'client/app/**/*.js',

            'client/components/**/*.js',
            'client/test/*.js',
            'client/test/**/*.mock.js',
            'client/test/**/*.spec.js',

            'client/app/**/*.html',
            'client/components/**/*.html'
        ],

        preprocessors: {
            '**/*.html': ['ng-html2js'],
            'client/app/**/*.js': ['coverage'],
            'client/components/**/*.js': ['coverage']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/',
            moduleName: 'wakeupTemplates'
        },

        ngJade2JsPreprocessor: {
            stripPrefix: 'client/'
        },
        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-htmlfile-reporter',
            'karma-ng-html2js-preprocessor',
            'karma-coverage'
        ],
        reporters: ['progress', 'html', 'coverage'],
        htmlReporter: {
            outputFile: 'tests/units.html',
            pageTitle: 'Unit Tests',
            subPageTitle: 'Wakeup Call App tests'
        },
        coverageReporter: {
            type: 'html',
            dir: 'coverage/',
            instrumenterOptions: {
                istanbul: {
                    noCompact: true
                }
            }
        },

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        // singleRun: false
    });
};