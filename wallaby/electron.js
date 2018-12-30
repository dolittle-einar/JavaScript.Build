const fs = require('fs')
const path = require('path')

const isDirectory = source => {
    let stats = fs.lstatSync(source);
    return stats.isDirectory() || stats.isSymbolicLink;
};
const getDirectories = source =>
    fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

function collectPackages(pathPrefix, source, packages) {
    let directory = path.join(pathPrefix, source);
    let directories = getDirectories(directory);
    directories.forEach(packageDirectory => {
        packageDirectory = packageDirectory.substr(pathPrefix.length + 1);
        if (packageDirectory.indexOf('@') == 0 && packageDirectory.indexOf(path.sep) < 0) {
            collectPackages(pathPrefix, packageDirectory, packages);
        } else {
            let packageBasePath = path.join(pathPrefix, packageDirectory);
            let packageFile = path.join(packageBasePath, 'package.json');
            if (packageDirectory.indexOf('@') == 0) {

                if (fs.existsSync(packageFile)) {
                    let pkg = JSON.parse(fs.readFileSync(packageFile).toString());
                    let found = false;
                    if (pkg.jspm && pkg.jspm.main && pkg.jspm.directories) {
                        for( let property in pkg.jspm.directories ) {
                            let directory = pkg.jspm.directories[property];
                            let fullPath = path.join(packageBasePath, directory);
                            let basePath = path.join(packageDirectory, directory);
                            let mainFile = `${pkg.jspm.main}.js`;
                            let filePath = path.join(fullPath, mainFile);
                            console.log(`Checking : ${filePath}`)
                            if (fs.existsSync(filePath)) {
                                packages[packageDirectory] = {
                                    main: mainFile,
                                    path: basePath
                                }

                                found = true;
                            }
                        }
                    }

                    if (pkg.main && found == false) {
                        let mainFile = path.basename(pkg.main);
                        let mainDirectory = path.dirname(pkg.main);
                        let basePath = path.join(packageDirectory, mainDirectory);
                        packages[packageDirectory] = {
                            main: mainFile,
                            path: basePath
                        };
                    }
                }
            }
        }
    });
}

module.exports = function (wallaby) {
    console.log(wallaby.projectCacheDir);
    let packageMap = {
        path_prefix: '/node_modules',
        packages: {}
    };

    collectPackages('node_modules', '.', packageMap.packages);

    /*

    - Generate packages file into project cache dir
        - Node_modules - point to whatever is set in main in the package.json file
        - folders with @ in front are organizations - get sub folders from these

    - Watch node_modules folder for new things and recreate package.json file

    - Caching - middleware, invalidate changed files so we don't have to append date in the defaultExtensions thingy

    - Ignore for_* when doing dist build

    - Use common .babelrc file and just add the needed things for Wallaby / SystemJS

    - Look at module definition in defaultExtensions - is it needed? 
    - Only do the require wrapper if it is from node_modules that aren't in the workspaces

    */

    let wallabyConfig = {
        debug: true,
        reportConsoleErrorAsError: true,
        files: [
            { pattern: 'wallaby.js', ignore: true },
            { pattern: 'karma.conf.js', ignore: true },
            { pattern: 'packages.js', instrument: false, load: true },

            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/chai-as-promised/lib/chai-as-promised.js', instrument: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
            { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
            { pattern: 'node_modules/systemjs/dist/system.js', instrument: false },
            { pattern: 'node_modules/systemjs/dist/extras/transform.js', instrument: false },

            { pattern: 'defaultExtensions.js', instrument: false },
            { pattern: 'requireWrapper.js', instrument: false },
            { pattern: 'json.js', instrument: false },
            { pattern: 'package.json', instrument: false, load: false },
            { pattern: 'Source/**/dist/**/*.js', ignore: true },
            { pattern: 'Source/**/dist/**/for_*/*.js', ignore: true },
            { pattern: 'Source/**/for_*/*.js', ignore: true },
            { pattern: 'Source/**/*.js', load: false },
        ],
        tests: [
            { pattern: '!Source/**/dist/**/for_*/*.js', load: false },
            { pattern: 'Source/**/for_*/*.js', load: false }
        ],
        env: {
            kind: 'electron'
        },

        compilers: {
            '**/*.js': wallaby.compilers.babel(babelConfig)
        },

        middleware: (app, express) => {
            app.use('/node_modules', express.static(require('path').join(__dirname, 'node_modules')));
            app.get('/packagemap.json', (req, res) => {
                res.writeHead(200, {
                    'Content-type': 'application/json'
                });

                res.end(JSON.stringify(packageMap));
            });
        },

        testFramework: 'mocha',

        setup: (w) => {
            window.runPostfix = new Date().toISOString();

            wallaby.delayStart();

            window.expect = chai.expect;
            var should = chai.should();

            var promises = [];

            wallaby.tests.forEach(test => {
                var moduleName = `/${test}`;
                promises.push(System.import(moduleName));
            });

            Promise.all(promises).then(function () {
                wallaby.start();
            }).catch(function (e) {
                setTimeout(function () {
                    throw e;
                }, 0);
            });
        }
    };

    return wallabyConfig;
};