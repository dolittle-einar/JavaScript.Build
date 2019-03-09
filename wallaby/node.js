/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import babelConfigLoader from '../babelConfigLoader';

const babelConfig = babelConfigLoader(process.cwd());

/**
 * The callback for configuring Wallaby settings
 * @callback Wallaby~settingsCallback
 * @param {object} Settings object
 */

/**
* The setup callback that will be called during setup of Wallaby
* @callback Wallaby~setupCallback
* @param {object} Settings object
*/

function getFunctionBody(func) {
    var entire = func.toString();
    var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
    return body;
}

function getSetupFunction(setupCallback) {
    var setup = function () {
        global.expect = chai.expect;
        var should = chai.should();
        global.sinon = require('sinon');

        var sinonChai = require('sinon-chai');

        chai.use(sinonChai);

        var sinonChaiInOrder = require('sinon-chai-in-order').default;

        chai.use(sinonChaiInOrder);

        var winston = require('winston');

        global.logger = winston.createLogger({});
    };

    if (typeof setupCallback === 'function') {
        var setupBody = getFunctionBody(setup);
        var setupCallbackBody = getFunctionBody(setupCallback);
        var combined = setupBody + '\n' + setupCallbackBody;
        var newFunction = new Function(combined);
        return newFunction;
    }

    return setup;
}


/**
 * Setup a correct Wallaby settings based on a given convention. All settings are overridable through
 * the settings callback
 * @param {Wallaby~settingsCallback} settingsCallback Callback for working with the wallaby settings object
 * @param {Wallaby~setupCallback} setupCallback Callback for doing additional setup of Wallaby
 */
function node(settingsCallback, setupCallback) {
    return (wallaby) => {
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

            setup: getSetupFunction(setupCallback)
        };

        if (typeof settingsCallback === 'function') settingsCallback(settings);

        return settings;
    };
}

module.exports = node;