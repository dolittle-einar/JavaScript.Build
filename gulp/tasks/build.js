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

let moduleTypes = [
    'commonjs',
    'amd',
    'umd',
    'systemjs'
];

function getBuildTasks(root) {
    let tasks = moduleTypes.map(module => transpile.createTask(module, root));
    return tasks
}

function getAllBuildTasksFor(root) {
    return gulp.series(
        getCleanTask(root),
        gulp.parallel(
            getBuildTasks(root),
            getEsmodulesTask(root)
        )   
    );    
}

function getBuildTasksForAllWorkspaces() {
    let dirname = process.cwd();
    let gulpfile = null;
    

    while (true) {
        
        let fullpath = path.join(dirname, "gulpfile.js")
        if (fs.existsSync(fullpath)) {
            gulpfile = fullpath;
            break;
        }

        if (found) break;

        const nextDir = path.dirname(dirname);
        if (dirname === nextDir) break;
        dirname = nextDir;
    }
    
    if( gulpfile == null ) {
        console.info(`Couldn't locate a gulpfile.js in your repository`);
        process.exit();
    }

    let workspaces = [];
    console.log(`Found gulpfile : '${gulpfile}'`);
    let rootDir = path.dirname(gulpfile);
    let workspacePackage = path.join(rootDir,'package.json');
    console.log(workspacePackage);
    
    if( fs.existsSync(workspacePackage) ) {
        
        let json = fs.readFileSync(workspacePackage);
        let pkg = JSON.parse(json);
        
        if( pkg.workspaces ) {
            
            pkg.workspaces.forEach(workspace => {
                
                let workspaceRoot = path.join(process.cwd(),workspace);
                let tasks = getAllBuildTasksFor(workspaceRoot);
                tasks.displayName = `build:${workspace}`;
                workspaces.push(tasks);
            })
        }
    }
    return gulp.parallel(workspaces);
}

export const build = getAllBuildTasksFor(null);
export const build_all = getBuildTasksForAllWorkspaces();
