/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import rimraf from 'rimraf';
import { Config } from '../Config';

/**
 * Factory for creating the clean task
 * @param {string} root 
 * @returns {Function} The task
 */
export function getCleanTask(root) {
    let task = (done) => {
        let config = Config.get(root);
        rimraf(config.distFolder, () => {
            done();
        });
    }
    task.displayName = 'clean';
    return task;
}