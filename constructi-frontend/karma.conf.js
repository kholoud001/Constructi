module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine-html-reporter',
      '@angular-devkit/build-angular/plugins/karma',
      'karma-webpack'
    ],
    files: [
      // { pattern: 'node_modules/zone.js/fesm2015/zone-testing.js', watched: false },
      // { pattern: 'node_modules/zone.js/fesm2015/zone-testing', watched: false },
      { pattern: 'node_modules/zone.js/zone-testing.js', watched: false },
      { pattern: 'node_modules/zone.js/testing', watched: false },

      { pattern: 'src/setup.ts', watched: false },
      { pattern: 'src/**/*.spec.ts', watched: false }
    ],
    preprocessors: {
      'src/**/*.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'ts-loader'
          }
        ]
      }
    },
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
