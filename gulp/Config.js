/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import yargs from 'yargs';
import path from 'path';

const _rootFolder = new WeakMap();

/**
 * Represents the configuration for the build
 */
export class Config {

    /**
     * Initializes a new instance of {config}
     * @param {string} rootFolder 
     */
    constructor(rootFolder) {
        rootFolder = path.resolve(rootFolder);
        console.log(`Using root : '${rootFolder}'`);       
        _rootFolder.set(this,rootFolder);
    }

    /**
     * Get the root folder in which we're building
     */
    get rootFolder() {
        return _rootFolder.get(this);
    }

    /**
     * Get the dist folder that will serve as output from the build
     */
    get distFolder() {
        return `${this.rootFolder}/dist`;
    }


    /**
     * Get {Config} - if not root is specified, it will try to resolve it from CLI arguments
     * @param {string|undefined|null} [root] Optional root
     */
    static get(root) {
        if( !root ) return Config.fromArguments();
        else return new Config(root);
    }

    /**
     * Create an instance of {Config} based on CLI arguments
     */
    static fromArguments() {
        let root = yargs.argv.root;
            
        if( !root || root == '' ) {
            console.info("Missing root - run 'gulp' with --root [relative folder]");
            process.exit(0);
            return;
        }
        return new Config(root);
    }
}