const babelConfig = require('./.babelrc.js')();
const path = require('path');
const wallabyWebpack = require('wallaby-webpack');

module.exports = (baseFolder, webpackPostprocessorCallback, wallabySetingsCallback) => {
    return (wallaby) => {
        let webpackSettings = {
            entryPatterns: [`${baseFolder}/**/for_*/*.js`],
            resolve: {
                modules: [
                    path.join(wallaby.projectCacheDir, 'src')
                ],
                alias: {}
            },
            module: {
                rules: []
            },
            plugins: []
        };

        if( typeof webpackPostprocessorCallback == 'function' ) webpackPostprocessorCallback(webpackSettings);

        let wallabyPostprocessor = wallabyWebpack(webpackSettings);

        let babelCompiler = wallaby.compilers.babel(babelConfig);

        let wallabySettings = {
            //debug: true,
            //reportConsoleErrorAsError: true,
            files: [
                { pattern: 'node_modules/chai/chai.js', instrument: false },
                { pattern: 'node_modules/chai-as-promised/chai-as-promised.js', instrument: false },
                { pattern: "node_modules/sinon/pkg/sinon.js", instrument: false },
                { pattern: `${baseFolder}/**/for_*/*.js`, ignore: true },
                { pattern: `${baseFolder}/**/*.js`, load: false }              
            ],
            tests: [
                { pattern: `${baseFolder}/**/for_*/*.js`, load: false }
            ],
            env: {
                kind: 'electron'
            },
            compilers: {
                '**/*.js': babelCompiler
            },
            postprocessor: wallabyPostprocessor,
            setup: () => {
                window.expect = chai.expect;
                let should = chai.should();
                window.__moduleBundler.loadTests();
            }
        };

        if( typeof wallabySetingsCallback == 'function' ) wallabySetingsCallback(wallabySettings);

        return wallabySettings;
    };
};