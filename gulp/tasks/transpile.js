/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import debug from 'gulp-debug';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import {Context } from '../Context';
import { sources } from './sources';

/**
 * Represents a system for dealing with transpilation
 */
export class transpile {

    /**
     * Initializes a new instance of {transpile}
     * @param {string} module Module format the transpilation is for
     */
    constructor(module) {
        this._module = module;
    }

    /**
     * The actual task for the transpiling
     * @param {Context} context 
     * @param {Function} done 
     */
    task(context, done) {
        let config = context.config;
        let babelConfig = context.babelConfig;
        let module = this._module;
        let destination = `${config.distFolder}/${module}`;

        sources.javaScript(config)
            //.pipe(debug())
            .pipe(sourcemaps.init())
            .pipe(babel(babelConfig.getConfigForModuleFormat(module)))
            .pipe(sourcemaps.mapSources((sourcePath, file) => {
                return `../esmodules/${sourcePath}`
            }))
            .pipe(sourcemaps.write('.', {
                includeContent: true,
                overwrite: true
            }))
            .pipe(gulp.dest(destination, {
                overwrite: true,
            }));
        done();
    }

    static createTask(module, context) {
        let moduleTranspiler = new transpile(module);

        let task = (done) => {
            moduleTranspiler.task(context, done);
        };
        task.displayName = `build:${module}`;
        return task;   
    }
}