module.exports = function(config) {
    config.set({
        basePath: 'js/',
        frameworks: ['jasmine', 'sinon'],
        files: [
            'strategy.js',
            'strategy.spec.js'
        ],
        browsers: ['PhantomJS'],
        singleRun: true,
        reporters: ['progress', 'html', 'coverage'],
        htmlReporter: {
            outputDir: 'js/test_results',
        },
        preprocessors: {
            '*.js': ['coverage']
        }
    });
};
