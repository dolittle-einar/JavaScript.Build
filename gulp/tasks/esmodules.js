/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import { sources } from './sources';
import { Context } from '../Context';

/**
 * Factory function for creating a task that copies files raw to esmodule dist folder
 * @param {Context} context The Current build context
 * @returns {Function} The task
 */
export function getEsmodulesTask(context) {
    let task = (done) => {
        let config = context.config;
        let destination = `${config.distFolder}/esmodule`;
        sources.javaScript(config)
            .pipe(gulp.dest(destination), {
                overwrite: true
            });
        done();
    }
    task.displayName = 'build:esmodules';
    return task;
};