var CachingWriter = require('broccoli-caching-writer');
var SVGSpriter = require('svg-sprite');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var globber = require('glob-array');
var globToRegExp = require('glob-to-regexp');
function getFilesForSourceDirectory(sourceDirectory, includePattern, excludePattern) {
    return globber.sync(includePattern, {
        cwd: sourceDirectory,
        root: path.resolve(sourceDirectory),
        debug: false,
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

SvgSprite.prototype = Object.create(CachingWriter.prototype);
SvgSprite.prototype.constructor = SvgSprite;
function SvgSprite(inputTrees, options) {
    if ((!inputTrees) || (!options) || (!inputTrees.srcDir))
        throw new Error('srcFiles/srcDir or svgOptions cannot be empty. Please specify source files and svgOptions.');
    var _options = {};
    this.svgOptions = options;
    if (Array.isArray(inputTrees.srcDir)) {
        throw new Error('You passed an array of input trees, but only a single tree is allowed.');
    }
    if ((inputTrees) && (inputTrees.include) && (inputTrees.include.length > 0)) {
        _options.includeGlob = inputTrees.include;
        _options.cacheInclude = [globToRegExp(inputTrees.include)];
    }
    if ((inputTrees) && (inputTrees.exclude) && (inputTrees.exclude.length > 0)) {
        _options.excludeGlob = inputTrees.exclude;
        _options.cacheExclude = [globToRegExp(inputTrees.exclude)];
    }
    CachingWriter.call(this, [inputTrees.srcDir], _options);
    this.options = _options;
}

SvgSprite.prototype.build = function() {
    if (this.svgOptions)
        this.svgOptions.dest = this.outputPath;
    var svgSpriter = new SVGSpriter(this.svgOptions);
    if ((Array.isArray(this.inputPaths)) && (this.inputPaths.length > 0))
        sourceDirectory = this.inputPaths[0];
    else
        sourceDirectory = this.inputPaths;
    getFilesForSourceDirectory(sourceDirectory, this.options.includeGlob, this.options.excludeGlob).forEach(function(fileSpec) {
        addFilesToSprite(svgSpriter, sourceDirectory, fileSpec);
    });
    return new Promise(function(resolve, reject) {
        svgSpriter.compile(function(error, result, data) {
            if (error)
                return reject(error);
            for (const mode in result) {
                for (const resource in result[mode]) {
                    fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
                    fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
                }
            }
            resolve(result);
        });
    }.bind(this));
};

module.exports = SvgSprite;
