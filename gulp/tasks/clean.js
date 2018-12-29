/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import rimraf from 'rimraf';
import { Context } from '../Context';

/**
 * Factory for creating the clean task
 * @param {Context} context Current build context 
 * @returns {Function} The task
 */
export function getCleanTask(context) {
    let task = (done) => {
        let config = context.config;
        rimraf(config.distFolder, () => {
            done();
        });
    }
    task.displayName = 'clean';
    return task;
}