/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
require('@babel/register');
var tasks = require('./tasks/index');
for( var task in tasks ) exports[task] = tasks[task];
