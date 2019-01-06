/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Dolittle. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import { getCleanTask } from './clean';
import { transpile } from './transpile';
import { getEsmodulesTask } from './esmodules';
import { Context } from '../Context';

let moduleTypes = [
    'commonjs',
    'amd',
    'umd',
    'systemjs'
];

function getBuildTasks(context) {
    let tasks = moduleTypes.map(module => transpile.createTask(module, context));
    return tasks
}

function getBuildTasksFor(root) {
    let context = new Context(root);
    return gulp.series(
        getCleanTask(context),
        gulp.parallel(
            getBuildTasks(context),
            getEsmodulesTask(context)
        )   
    );    
}

function getBuildTasksForAllWorkspaces(workspaces) {
    let workspacesTasks = [];
    workspaces.forEach(workspace => {       
        let workspaceRoot = path.join(process.cwd(),workspace);
        let tasks = getBuildTasksFor(workspaceRoot);
        tasks.displayName = `build:${workspace}`;
        workspacesTasks.push(tasks);
    });

    return gulp.parallel(workspacesTasks);
}


function getBuildTasksForCurrentContext() {   
    let currentDirectory = process.env.PWD; // We want the actual startup directory. process.cwd() seems to be altered by Gulp and we get the directory for the gulpfile location, not where we started
    let currentPackagePath = path.join(currentDirectory,"package.json");
    if( !fs.existsSync(currentPackagePath)) {
        console.error(`Couldn't find a 'package.json' in the current folder`);
        process.exit();
        return;
    }

    let pkg = JSON.parse(fs.readFileSync(currentPackagePath));
    if( pkg.workspaces ) {
        return getBuildTasksForAllWorkspaces(pkg.workspaces);
    } else { 
        return getBuildTasksFor(currentDirectory);
    }
}

export const build = getBuildTasksForCurrentContext();