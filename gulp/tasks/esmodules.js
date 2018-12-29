/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import { sources } from './sources';
import { Config } from '../Config';

/**
 * Factory function for creating a task that copies files raw to esmodule dist folder
 * @param {string} root Root folder
 */
export function getEsmodulesTask(root) {
    let task = (done) => {
        let config = Config.get(root);
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