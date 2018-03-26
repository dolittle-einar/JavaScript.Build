"use strict";
const fs = require("fs");
let localWebpackConfigFile = `${process.cwd()}/webpack.config`;
let webpackConfig = {};
if( fs.existsSync(localWebpackConfigFile) ) {
  webpackConfig = require(localWebpackConfigFile);
} else {
  webpackConfig = require('./webpack.config');
}
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
    webpack: webpackConfig,
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
