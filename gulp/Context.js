/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Config } from './Config';
import { BabelConfig } from './BabelConfig';

/**
 * Build context
 */
export class Context {
    #root;
    #config;
    #babelConfig;

    /**
     * Initializes a new instance of {Context}
     * @param {string|undefined|null} [root] Optional root
     */
    constructor(root) {
        this.#root = root;
    }

    /**
     * Get the current config object for the context
     * @returns {Config} The config object associated with the build context
     */
    get config() {
        if (!this.#config ) this.#config = Config.get(this.#root);
        return this.#config;
    }

    /**
     * Get the current configuration of babel for the given context
     * @returns {BabelConfig} The babel configuration system
     */
    get babelConfig() {
        if( !this.#babelConfig ) this.#babelConfig = new BabelConfig(this.config);
        return this.#babelConfig;
    }
}