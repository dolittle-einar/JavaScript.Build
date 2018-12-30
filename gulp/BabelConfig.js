/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import babelConfigLoader from '../babelConfigLoader';

/**
 * Represents a system for handling configuration of Babel
 */
export class BabelConfig {
    #baseConfig;
    #moduleConfigs = {
        'commonjs': {
            'loose': true
        }
    };

    /**
     * Initializes a new instance of {babelConfig}
     * @param {Config} config The configuration it is for
     */
    constructor(config) {
        this.#baseConfig = babelConfigLoader(config.rootFolder)
        this.plugins = [];
        this.presets = [];
    }

    /**
     * Get a Babel configuration for a specific module format
     * @param {string} moduleFormat The module format to get config for
     */
    getConfigForModuleFormat(moduleFormat) {
        let config = JSON.parse(JSON.stringify(this.#baseConfig));
        let pluginName = `@babel/plugin-transform-modules-${moduleFormat}`;
        if( this.#moduleConfigs.hasOwnProperty(moduleFormat)) {
            config.plugins.push([pluginName, this.#moduleConfigs[moduleFormat]]);
        } else {
            config.plugins.push(pluginName);
        }
        return config;
    }
}