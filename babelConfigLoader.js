/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';
import fs from 'fs';

function readConfig(file) {
    let json = fs.readFileSync(file);
    let config = JSON.parse(json);

    config.plugins = config.plugins || [];
    config.presets = config.presets || []; 

    return config;
}

export default function babelConfigLoader(folderToSearchFrom) {
    let configFilenames = [
        '.babelrc',
        '.babelrc.js'
    ];

    let dirname = path.resolve(folderToSearchFrom);

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
        console.info(`Using Babel configuration file '${configFile}'`);
        if (path.extname(configFile) == '.js') return require(configFile);
        else {
            let config = readConfig(configFile);
            if( config.extends ) {
                let configDir = path.dirname(configFile);
                let actualConfigPath = path.join(configDir, config.extends);                
                if( fs.existsSync(actualConfigPath)) {
                    console.info(`Using base Babel configuration file '${actualConfigPath}'`);
                    let baseConfig = readConfig(actualConfigPath);
                    config.plugins.forEach(plugin => baseConfig.plugins.push(plugin));
                    config.presets.forEach(preset => baseConfig.presets.push(preset));
                    delete config.extends;
                    return baseConfig;
                } else {
                    console.error(`Can't locate the base .babelrc file '${actualConfigPath}'`);
                }
            }
            
            return config;
        }
    }
    else {
        console.info('No Babel configuration file found');
        return {
            plugins: [],
            presets: []
        };
    }
}