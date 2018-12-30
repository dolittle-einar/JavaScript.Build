(function (global) {
    var prototype = System.constructor.prototype;
    var resolve = prototype.resolve;
    prototype.resolve = function (url, parentUrl) {
        module = {};
        return Promise.resolve(resolve.call(this, url, parentUrl))
            .then(function (result) {
                if (result.indexOf('.js') < 0) result = result + '.js?' + window.runPostfix;
                return result;
            })
    };
})(typeof self !== 'undefined' ? self : global);