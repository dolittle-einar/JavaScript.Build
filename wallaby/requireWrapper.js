(function (global) {
    var prototype = System.constructor.prototype;
    var transform = prototype.transform;
    prototype.transform = function (url, source) {
        if( url.indexOf('node_modules') < 0 ) {
            return Promise.resolve(transform.call(this, url, source))
            .then(function (_source) {
                return _source;
            });
        }

        var context = { imports: [], exports: [] };

        if (url.indexOf('node_modules/@dolittle/') > 0) {

            if( source.indexOf('exports') > 0 ) {
                console.log(url)
                console.log(source);
            }

            var capture = '' +
                '\n(function() {\n' +
                'var context = { imports: [], exports: [] };\n' +
                'var module = {};\n' +
                'function require(_import) { context.imports.push(_import); }\n' +
                source +
                '\nif( module.exports ) for( var _export in module.exports ) context.exports.push(_export);\n' +
                'return context;\n' +
                '});\n'
            var evaluated = (0, eval)(capture);
            context = evaluated();
        }

        return Promise.resolve(transform.call(this, url, source))
            .then(function (_source) {
                if (context.imports.length > 0 || context.exports.length > 0) {
                    var prefix = 'System.register([';
                    context.imports.forEach(function (_import, index) {
                        if (index != 0) prefix += ',';
                        prefix += '\'' + _import + '\'';
                    });
                    prefix += '], function(_export,_context) {\n';
                    prefix += 'var imports = {};\n';
                    prefix += 'return {\n';
                    prefix += 'setters: [';
                    context.imports.forEach(function (_import, index) {
                        if (index != 0) prefix += ',';
                        prefix += '\nfunction(importedModule) { imports[\'' + _import + '\'] = importedModule; }'
                    });
                    if (context.imports.length > 0) prefix += '\n';
                    prefix += '],\n';
                    prefix += 'execute: function() {\n';
                    prefix += 'function require(_import) { return imports[_import]; }\n';
                    postfix = '\nif( module.exports ) for( var exportName in module.exports ) _export(exportName, module.exports[exportName]);\n'
                    postfix += '\n}\n};\n});'
                    var modified = prefix + source + postfix;
                    return modified;
                }
                return _source;
            });
    }
})(typeof self !== 'undefined' ? self : global);