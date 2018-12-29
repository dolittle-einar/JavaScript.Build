/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import { Config } from '../Config';
import { babelConfig } from '../babelConfig';
import { sources } from './sources';


export class transpile {

    constructor(module) {
        this._module = module;
    }

    task(config, done) {
        let module = this._module;
        let destination = `${config.distFolder}/${module}`;

        sources.javaScript(config)
            //.pipe(debug())
            .pipe(sourcemaps.init())
            .pipe(babel(babelConfig.getConfigForModuleFormat(config, module)))
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

    static createTask(module, root) {
        let moduleTranspiler = new transpile(module);

        let task = (done) => {
            let config = Config.get(root);
            moduleTranspiler.task(config, done);
        };
        task.displayName = `build:${module}`;
        return task;   
    }
}