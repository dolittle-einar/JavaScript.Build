# Build

This project represents a base build pipeline for JavaScript based projects.
Everything that is common among any JavaScript project, be it a node or browser (client) based is found here.

## Using it

The project is published as an NPM package and can be used by adding a dev reference to it:

```shell
$ npm install @dolittle/build --save-dev
```

or with Yarn:

```shell
$ yarn add -D @dolittle/build
```

## Dependencies

This project has all its dependencies as regular dependencies, which is why it is important to add a reference to
this package as a developer dependency. The reason for this is to be able to get all the packages down that the
build pipeline need onto your developer box.

## Gulp

Included in the package is a [Gulp](https://gulpjs.com) based build pipeline. The purpose of the build is to enable an
easy way to build and output what is needed for a deployable package that is widely supported in any JavaScript and
module environment. It outputs by default the following module formats:

- AMD
- CommonJS
- ESModule
- SystemJS
- UMD

To take advantage of it, you'll need to install Gulp globally on your machine:

```shell
$ npm install -g gulp
```

with yarn

```shell
$ yarn global add gulp
```

Once you've done that, you can start using the build tasks by creating a `gulpfile.js` at the root of your project
and add the following:

```javascript
require('@dolittle/build/dist/gulp/setup')(exports);
```

### Build task

The build task is context sensitive and will understand wether or not to build the current **package** or all the **packages**
discovered in the `workspaces` property - based on a yarn workspaces setup. By just using the `gulp build` command from your terminal,
it will build correct according to the context.

### Scripts in package.json

You can easily add a **build** script to your `package.json` file.

```json
"scripts": {
    "build": "gulp build",
    "prepublish": "yarn build"
},
```

If leveraging [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) you'll have a private `package.json` file
at the root of your project pointing to the different workspaces. There is a build task for building all the workspaces
in the `package.json` file. Given you have a `package.json` as follows:

```json
{
    "private": true,
    "workspaces": [
        ...
    ]
}
```

You can then simply run the `gulp build` from the folder of the `package.json` file.
To make it more consistent, you could include it in your `package.json` file:

```json
{
    "private": true,
    "workspaces": [
        ...
    ],
    "scripts": {
        "build": "gulp build"
    }
}
```

Then you can run a build of all the workspaces as follows:

```shell
$ yarn build
```

**IMPORTANT**

*The build assumes building to a folder called `dist` relative to the path of the `package.json`.*

## Modules

Since the build outputs multiple module formats and you want it to be discovered automatically by
the consumer of your package, you'll need to add more to your `package.json` file.
The `main` property is considered the NodeJS variant, which is based on CommonJS - so it should
point to the `commonjs` folder inside the `dist` folder.
The `module` property refers to the ESModule, so it should point to the `dist/esmodule` folder.
For supporting SystemJS and JSPM, you'll need the `jspm` property, which is an **object** construct
with a lot of details. Notice that inside it there is a `dependencies` property, this should reflect
the dependencies already added in the package - meaning you'll have to keep these in sync. 

```json
{
  "main": "dist/commonjs/index.js",
  "module": "dist/esmodule/index.js",
  "jspm": {
    "registry": "npm",
    "jspmPackage": true,
    "format": "esm",
    "main": "index",
    "directories": {
      "dist": "dist/systemjs"
    },
    "dependencies": {
    }
  }
}
```

## Transpilation using Babel

This package assumes the use of Babel with presets and plugins added. We're paying attention to what gets through the
different stages and gets stabilized before we add plugins for them. As a general rule of thumb, we tend to not include
proposals that has not reached [stage 3](https://github.com/tc39/proposals/blob/master/README.md) from the [standards committee](https://tc39.github.io/).
Babel has an overview of what is currently in [stage 3](https://babeljs.io/docs/en/babel-preset-stage-3).

Inside this package you'll find a [`.babelrc` file configured](./.babelrc). To start using it, all you need is to create a `.babelrc` file in the
root of your project and add an `extends` property:

```json
{
  "extends": "@dolittle/build/.babelrc"
}
```

This will then load the predefined configuration from this package and combine it with yours.
To add plugins or presets, you can simply add a `plugins` or `presets` property with the additional plugins you want:

```json
{
  "extends": "@dolittle/build/.babelrc",
  "plugins": [ ... ],
  "presets": [ ... ]
}
```

You'll find the list of available plugins [here](https://babeljs.io/docs/en/plugins) and presets [here](https://babeljs.io/docs/en/presets).

**IMPORTANT**

*This ist just additive - you can't remove already added plugins or presets. To do that, you'll need to drop the `extends` property and
create everything from scratch.*

## VSCode IntelliSense

[Visual Studio Code](https://code.visualstudio.com) offers an advanced autocomplete functionality for JavaScript that has a [few rules](https://code.visualstudio.com/docs/editor/intellisense)
associated with it in order for it to work optimally and give the best result. The [Babel](http://babeljs.io/) transpiler does a couple of things that violates this and
the autocompletion falls over. This build pipeline does therefor include a couple of [plugins](https://github.com/dolittle-tools/babel-plugins) that Dolittle is offering to remedy
these issues and is by default included in the [`.babelrc`](./.babelrc) setup here.

In addition to the plugins, it is recommended that any packages built is explicit about not including the JavaScript files other than those that are outputted in the `dist` folder.
This can easily be done by being explicit in the `package.json` file:

```json
"files":[
  "dist"
]
```

## Eslint

Package.json
2018
babel parser
[To be documented]

## JSConfig.json

[To be documented]

## Yarn

[To be documented]

### Recommented setup in a package

```json
{
  "name": "[name of package]",
  "version": "[version for the package]",
  "description": "",
  "publishConfig": {
    "access": "public"
  },
  "main": "dist/commonjs/index.js",
  "module": "dist/esmodule/index.js",
  "jspm": {
    "registry": "npm",
    "jspmPackage": true,
    "format": "amd",
    "main": "index",
    "directories": {
      "dist": "dist/systemjs"
    },
    "dependencies": {
    }
  },
  "scripts": {
    "build": "gulp build",
    "prepublish": "yarn build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/..."
  },
  "author": "",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/..."
  },
  "homepage": "https://github.com/...",
  "dependencies": {
  },
  "devDependencies": {
  },
  "files":[
    "dist"
  ]
}
```

### Recommended setup with workspaces

```json
{
    "private": true,
    "workspaces": [
        ...
    ],
    "scripts": {
        "build": "gulp build"
    },
    "devDependencies": {
        "@dolittle/build": "^6.0.0"
    }
}
```

## Yalc

[To be documented]

## Tests

[To be documented]

### Karma

[To be documented]

### Wallaby

If you want to be using [Wallaby](https://wallabyjs.com), there is a pre-defined setup for it that will
work with the Babel configuration for the project.

To get started, all you need is to add a `wallaby.js` file into your project and add the following:

```javascript
const wallaby = require('@dolittle/build/dist/wallaby/node')
module.exports = wallaby('.', (config) => {});
```

Notice the `require` statement; it has `node` at the end. If you're writing code that does not have a dependency
on browser elements, you can safely use `node`. The second option is `electron`. This will run your tests in a
browser context.

**IMPORTANT**
Most projects can default to **node** - in fact, it is highly recommended for every project to do this, even those
targeting a client. Its best practice to not couple yourself to concrete types and especially those in a browser.
You'll gain a better developer experience and an improved codebase by sticking with **node**.

## Mocking

Sinon
[To be documented]

## Assertions

Chai
Sinon Chai
Sinon Chai in Order
[To be documented]
