/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import babelConfigLoader from '../babelConfigLoader';

/**
 * The callback for configuring Wallaby settings
 * @callback Wallaby~settingsCallback
 * @param {object} Settings object
 */

/**
 * Setup a correct Wallaby settings based on a given convention. All settings are overridable through
 * the settings callback
 * @param {Wallaby~settingsCallback} settingsCallback Callback for working with the wallaby settings object
 */
function node(settingsCallback) {
    return (wallaby) => {
        let babelConfig = babelConfigLoader(process.cwd());
        let babelCompiler = wallaby.compilers.babel(babelConfig);

        var settings = {
            files: [
                { pattern: 'node_modules/chai/chai.js', instrument: false },
                { pattern: 'node_modules/chai-as-promised/chai-as-promised.js', instrument: false },
                { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
                { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
                { pattern: 'Source/**/for_*/**/*.js', ignore: true },
                { pattern: 'Source/**/dist/**/*.js', ignore: true },
                { pattern: 'Source/**/*.js' }
            ],
            tests: [
                { pattern: 'Source/**/dist/**/for_*/**/*.js', ignore: true },
                { pattern: 'Source/**/for_*/**/*.js' }
            ],

            testFramework: 'mocha',

            compilers: {
                '**/*.js': babelCompiler
            },

            env: {
                type: 'node'
            },

            setup: () => {
                global.expect = chai.expect;
                let should = chai.should();
                global.sinon = require('sinon');
                let sinonChai = require('sinon-chai');
                chai.use(sinonChai);
                let sinonChaiInOrder = require('sinon-chai-in-order').default;
                chai.use(sinonChaiInOrder);

                let winston = require('winston');
                global.logger = winston.createLogger({});
            }
        };

        if( typeof settingsCallback === 'function' ) settingsCallback(settings);

        return settings;
    };
}

module.exports = node;