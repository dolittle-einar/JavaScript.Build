"use strict";
const webpackconfig = require('./webpack.config');
module.exports = (config) => {
  config.set({
    basePath: './Source',
    frameworks: ['mocha', 'chai', 'chai-as-promised'],
    files: [
      '**/for_*/*.js'
    ],
    exclude: [
    ],
    preprocessors: {
      '**/*.js': ['webpack']
    },
    webpack: webpackconfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
};
