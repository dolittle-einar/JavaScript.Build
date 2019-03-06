/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';

class Sources {

    javaScript(config) {
        let stream = gulp.src([
            `${config.rootFolder}/**/*.js`,
            `!${config.rootFolder}/**/for_*/**/*.js`,
            `!${config.rootFolder}/dist/**/*.js`,
            `!${config.rootFolder}/**/node_modules/**/*.js`,
            `!${config.rootFolder}/**/wwwroot/**/*.js`
        ], {
            base: config.rootFolder
        });
        return stream;
    }

    html(config) {
        let stream = gulp.src([
            `${config.rootFolder}/**/*.html`,
            `!${config.rootFolder}/dist/**/*.html`,
            `!${config.rootFolder}/**/node_modules/**/*.html`,
            `!${config.rootFolder}/**/wwwroot/**/*.html`
        ], {
            base: config.rootFolder
        });
        return stream;
    }

    styles(config) {
        let stream = gulp.src([
            `${config.rootFolder}/**/*.css`,
            `${config.rootFolder}/**/*.scss`,
            `!${config.rootFolder}/dist/**/*.css`,
            `!${config.rootFolder}/dist/**/*.scss`,
            `!${config.rootFolder}/**/node_modules/**/*.css`,
            `!${config.rootFolder}/**/node_modules/**/*.scss`,
            `!${config.rootFolder}/**/wwwroot/**/*.css`,
            `!${config.rootFolder}/**/wwwroot/**/*.scss`
        ], {
            base: config.rootFolder
        });
        return stream;
    }

}
export const sources = new Sources();
export default sources;