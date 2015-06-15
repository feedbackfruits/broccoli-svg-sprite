var CachingWriter = require('broccoli-caching-writer');
var Spriter = require('svg-sprite');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var globber = require('glob-array');
var globToRegExp = require('glob-to-regexp');
var mkdirp = require('mkdirp');
var RSVP = require('rsvp');
function getFilesForSourceDirectory(sourceDirectory, includePattern, excludePattern) {
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
function writeSVGSpriteToDir(spriter) {
    spriter.compile(writeSVGFiles);
}
module.exports = CachingWriter.extend({
    init: function(inputTrees, options) {
        var _options = options || {};
        if (Array.isArray(inputTrees)) {
            throw new Error('You passed an array of input trees, but only a single tree is allowed.');
        }
        if ((_options) && (_options.filterFromCache) && (_options.filterFromCache.include) && (_options.filterFromCache.include.length > 0)) {
            _options.filterFromCache.includeGlob = _options.filterFromCache.include;
            _options.filterFromCache.include = [globToRegExp(_options.filterFromCache.include)];
        }
        if ((_options) && (_options.filterFromCache) && (_options.filterFromCache.exclude) && (_options.filterFromCache.exclude.length > 0)) {
            _options.filterFromCache.excludeGlob = _options.filterFromCache.exclude;
            _options.filterFromCache.exclude = [globToRegExp(_options.filterFromCache.exclude)];
        }
        CachingWriter.prototype.init.call(this, inputTrees, _options);
    },
    updateCache: function(srcPaths, destDir) {
        if (this.svgOptions)
            this.svgOptions.dest = destDir;
        var svgSpriter = new Spriter(this.svgOptions);
        if ((Array.isArray(srcPaths)) && (srcPaths.length > 0))
            sourceDirectory = srcPaths[0];
        else
            sourceDirectory = srcPaths;
        getFilesForSourceDirectory(sourceDirectory, this.filterFromCache.includeGlob, this.filterFromCache.excludeGlob).forEach(function(fileSpec) {
            addFilesToSprite(svgSpriter, sourceDirectory, fileSpec);
        });
        var done = false;
        svgSpriter.on('compiled', function() {
            done = true;
        });
        //We need some form of synchronization here. Must stop this method from returning immediately.
        var async = this.async();
        return new RSVP.Promise(function(resolve, reject) {
            svgSpriter.compile(function(error, result, data) {
                if (error)
                    return reject(error);
                for (var mode in result) {
                    for (var resource in result[mode]) {
                        var file = result[mode][resource];
                        //Now check for resource type and save it in the right folder
                        //Add the directory to unwatched tree to prevent re-retriggering.
                        //var unwatechedTree = new UnwatchedTree(path.dirname(file.path));
                        mkdirp.sync(path.dirname(file.path));
                        fs.writeFileSync(file.path, file.contents);
                    }
                }
                resolve(result);
            });
        }.bind(this));
    },
});
