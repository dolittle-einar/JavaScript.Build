/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const tasks = require('./tasks/index');

/**
 * Setup the tasks from this package
 * @param {object} originalExports The original exports object in the scope of the gulpfile importing this
 */
function setup(originalExports) {
    for( var task in tasks ) originalExports[task] = tasks[task];
}

module.exports = setup;