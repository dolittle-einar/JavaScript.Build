/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
require('@babel/register');
var tasks = require('./tasks/index');

module.exports = function(originalExports) {
    for( var task in tasks ) originalExports[task] = tasks[task];
}
