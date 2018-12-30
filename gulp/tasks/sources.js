/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';

class Sources {

    javaScript(config) {
        let stream = gulp.src([
            `${config.rootFolder}/**/*.js`,
            `!${config.rootFolder}/**/for_*/*.js`,
            `!${config.rootFolder}/dist/**/*.js`,
            `!${config.rootFolder}/**/node_modules/**/*.js`
        ], {
            base: config.rootFolder
        });
        return stream;
    }
}
export const sources = new Sources();
export default sources;