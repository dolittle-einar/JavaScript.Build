/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';
import fs from 'fs';

/**
 * Represents a system for handling configuration of Babel
 */
export class BabelConfig {
    #baseConfig;

    /**
     * Initializes a new instance of {babelConfig}
     */
    constructor(config) {
        this.#baseConfig = this.#loadConfig(config);
        this.plugins = [];
        this.presets = [];
    }

    /**
     * Get a Babel configuration for a specific module format
     * @param {string} moduleFormat The module format to get config for
     */
    getConfigForModuleFormat(moduleFormat) {
        let config = {};
        Object.assign(config, this.#baseConfig);
        config.plugins.push(`@babel/plugin-transform-modules-${moduleFormat}`);
        return config;
    }


    #loadConfig(config) {
        let configFilenames = [
            '.babelrc',
            '.babelrc.js'
        ];
    
        let dirname = path.resolve(config.rootFolder);
    
        let configFile = null;
    
        while (true) {
            let found = configFilenames.some(filename => {
                let fullpath = path.join(dirname, filename)
                if (fs.existsSync(fullpath)) {
                    configFile = fullpath;
                    
                    return true;
                }
            });
    
            if (found) break;
    
            const nextDir = path.dirname(dirname);
            if (dirname === nextDir) break;
            dirname = nextDir;
        }
    
        if (configFile) {
            console.log(`Using Babel configuration file '${configFile}'`);
            if (path.extname(configFile) == '.js') return require(configFile);
            else {
                let json = fs.readFileSync(configFile);
                return JSON.parse(json);
            }
        }
        else {
            console.log('No Babel configuration file found');
            return {};
        }
    }
   
}