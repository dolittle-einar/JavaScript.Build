module.exports = function(wallaby) {
    let babelCompiler = wallaby.compilers.babel({
        babelrc: true
    });
    
    return {
        files: [

            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/chai-as-promised/chai-as-promised.js', instrument: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
            { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
            { pattern: 'Source/**/for_*/**/*.js', ignore: true },
            { pattern: 'Source/**/*.js' }
        ],
        tests: [
            { pattern: 'Source/**/for_*/**/*.js' }
        ],

        testFramework: 'mocha',

        compilers: {
            '**/*.js': babelCompiler
        },

        env: {
            type: 'node'
        },

        setup: () => {
            global.expect = chai.expect;
            let should = chai.should();
            global.sinon = require('sinon');
            let sinonChai = require('sinon-chai');
            chai.use(sinonChai);

            let winston = require('winston');
            global.logger = winston.createLogger({

            });
        }
    };
};