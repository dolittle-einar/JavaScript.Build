// this file will be used by default by babel@7 once it is released
module.exports = () => {
    return {
      'plugins': [
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        "@babel/plugin-syntax-flow",
        "@babel/plugin-transform-flow-strip-types"

        ["@babel/plugin-transform-runtime",
          {
            "corejs": false,
            "helpers": false,
            "regenerator": true,
            "useESModules": false
          }
        ]
      ],
      'presets': [
        [
          "@babel/preset-env", {
            'targets': process.env.BABEL_TARGET === 'node' ? {
              'node': process.env.IN_PROTRACTOR ? '6' : 'current'
            } : {
              'browsers': [
                'last 2 versions',
                'not ie <= 11'
              ],
              'uglify': process.env.NODE_ENV === 'production',
            },
            'loose': true,
            'modules': process.env.BABEL_TARGET === 'node' || process.env.PACKAGE_DISTRIBUTION === 'true' ? 'umd' : false,
            'useBuiltIns': true
          }
        ]
      ]
    }
  }
