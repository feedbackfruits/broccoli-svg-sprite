var CachingWriter = require('broccoli-caching-writer');
var stew
var Spriter = require('svg-sprite');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var globber = require('glob-array');
var globToRegExp = require('glob-to-regexp');
var mkdirp = require('mkdirp');
var RSVP = require('rsvp');
function getFilesForSourceDirectory(sourceDirectory, includePattern, excludePattern) {
    console.log('Resolving files from directory ');
    console.log(sourceDirectory);
    console.log(includePattern);
    console.log(excludePattern);
    return globber.sync(includePattern, {
        cwd: sourceDirectory,
        root: path.resolve(sourceDirectory),
        debug: true,
        nodir: true,
        ignore: excludePattern,
    });
}
function addFilesToSprite(spriter, sourceDirectory, fileSpec) {
    var absolutePath = path.resolve(sourceDirectory);
    spriter.add(new File({
        path: path.join(absolutePath, fileSpec),
        base: absolutePath,
        contents: fs.readFileSync(path.join(absolutePath, fileSpec))
    }));
}
module.exports = CachingWriter.extend({
    init: function(inputTrees, options) {
        
        if ((!inputTrees) || (!options) || (!inputTrees.srcDir))
            throw new Error('srcFiles/srcDir or svgOptions cannot be empty. Please specify source files and svgOptions.');
        var _options = {};
        _options.filterFromCache = {};
        _options.svgOptions = options;
        if (Array.isArray(inputTrees.srcDir)) {
            throw new Error('You passed an array of input trees, but only a single tree is allowed.');
        }
        if ((inputTrees) && (inputTrees.include) && (inputTrees.include.length > 0)) {
            _options.filterFromCache.includeGlob = inputTrees.include;
            _options.filterFromCache.include = [globToRegExp(inputTrees.include)];
        }
        if ((inputTrees) && (inputTrees.exclude) && (inputTrees.exclude.length > 0)) {
            _options.filterFromCache.excludeGlob = inputTrees.exclude;
            _options.filterFromCache.exclude = [globToRegExp(inputTrees.exclude)];
        }
        CachingWriter.prototype.init.call(this, inputTrees.srcDir, _options);
    },
    updateCache: function(srcPaths, destDir) {
        
        if (this.svgOptions)
            this.svgOptions.dest = destDir;
        
        var svgSpriter = new Spriter(this.svgOptions);
        if ((Array.isArray(srcPaths)) && (srcPaths.length > 0))
            sourceDirectory = srcPaths[0];
        else
            sourceDirectory = srcPaths;
        console.log(this);
        getFilesForSourceDirectory(sourceDirectory, this.filterFromCache.includeGlob, this.filterFromCache.excludeGlob).forEach(function(fileSpec) {

            addFilesToSprite(svgSpriter, sourceDirectory, fileSpec);
        });
        return new RSVP.Promise(function(resolve, reject) {
            svgSpriter.compile(function(error, result, data) {
                if (error)
                    return reject(error);
                for (var mode in result) {
                    for (var resource in result[mode]) {
                        var file = result[mode][resource];
                        mkdirp.sync(path.dirname(file.path));
                        fs.writeFileSync(file.path, file.contents);
                    }
                }
                resolve(result);
            });
        }.bind(this));
    },
});
