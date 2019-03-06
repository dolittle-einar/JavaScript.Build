/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import { sources } from './sources';
import { Context } from '../Context';
import { disconnect } from 'cluster';

/**
 * Factory function for creating a task that copies static content to specified dist folder
 * @param {Context} context The Current build context
 * @param {String} outputFolder The output folder - relative within the dist folder
 * @returns {Function} The task
 */
export function getStaticContentTask(context, outputFolder) {
    let task = (done) => {
        let config = context.config;
        let destination = `${config.distFolder}/${outputFolder}`;
        sources.html(config)
            .pipe(gulp.dest(destination), {
                overwrite: true
            });
        sources.styles(config)
            .pipe(gulp.dest(destination), {
                overwrite: true
            });
        done();
    };
    task.displayName = 'build:staticContent';
    return task;
}