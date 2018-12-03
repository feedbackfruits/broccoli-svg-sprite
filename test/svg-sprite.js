'use strict';
/*jshint expr: true*/
/*global describe, it */
/**
 * broccoli-svg-sprite is a Broccoli plugin for creating SVG sprites
 *
 * @see https://github.com/MojoJojo/broccoli-svg-sprite
 *
 * @author Sanket Sharma <sanket.sharma@dukstra.com> (https://github.com/mojoJojo)
 * @copyright © 2014 Sanket Sharma
 * @license MIT https://raw.github.com/MojoJojo/broccoli-svg-sprite/master/LICENSE.txt
 */
var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    broccoli = require('broccoli'),
    mkdirp = require('mkdirp'),
    walkSync = require('walk-sync'),
    should = require('should'),
    svg2png = require('svg2png'),
    imageDiff = require('image-diff'),
    DIR_REGEX = /\/$/;
var
    broccoliSvgSprite = require('../'),
    inputFiles = {
        srcDir: 'test',
        include: ['**/*.svg'],
        exclude: []
    },
    orthogonal = {
        mode: {
            css: {
                layout: 'vertical',
                sprite: '../svg/vertical.svg',
                render: {
                    css: true,
                    scss: true,
                    less: true,
                    styl: true
                },
                bust: false
            },
            view: {
                layout: 'horizontal',
                sprite: '../svg/horizontal.svg',
                bust: false
            },
            defs: {
                sprite: '../svg/defs.svg'
            },
            symbol: {
                sprite: '../svg/symbol.svg'
            },
            stack: {
                sprite: '../svg/stack.svg'
            }
        }
    },
    others = {
        shape: {
            dest: 'intermediate'
        },
        mode: {
            css: {
                layout: 'diagonal',
                sprite: '../svg/diagonal.svg',
                bust: false
            },
            view: {
                layout: 'packed',
                sprite: '../svg/packed.svg',
                bust: false
            }
        }
    };
describe('broccoli-svg-sprite', function() {
    describe('with orthogonal configuration', function() {
        var sprites = new broccoliSvgSprite(inputFiles, orthogonal);
        var builder = new broccoli.Builder(sprites);
        var tree;
        var files;
        it('should produce 9 files', function(done) {
            this.timeout(5000);
            try {
                builder.build().then(function(graph) {
                    files = walkSync(graph.directory).filter(function(path) {
                        return !DIR_REGEX.test(path);
                    });
                    should(files.length).be.exactly(9);
                    done();
                }).catch(function(e) {
                    done(e);
                });
            } catch (error) {
                done(error);
            }
        });
        it('should match vertical sprite', function(done) {
            this.timeout(20000);
            svg2png(builder.tree.outputPath + '/svg/vertical.svg', builder.tree.outputPath + '/png/vertical.png', function(error) {
                if (error)
                    done(error);
                imageDiff({
                    actualImage: builder.tree.outputPath + '/png/vertical.png',
                    expectedImage: 'test/expected/vertical.png',
                    diffImage: builder.tree.outputPath + '/diff/vertical.png'
                }, function(error, imagesAreSame) {
                    if (imagesAreSame)
                        done();
                    else
                        done(error);
                });
            });
        });
        it('should match horizontal sprite', function(done) {
            this.timeout(20000);
            svg2png(builder.tree.outputPath + '/svg/horizontal.svg', builder.tree.outputPath + '/png/horizontal.png', function(error) {
                if (error)
                    done(error);
                imageDiff({
                    actualImage: builder.tree.outputPath + '/png/horizontal.png',
                    expectedImage: 'test/expected/horizontal.png',
                    diffImage: builder.tree.outputPath + '/diff/horizontal.png'
                }, function(error, imagesAreSame) {
                    if (imagesAreSame)
                        done();
                    else done(error);
                });
            });
        });
        builder.cleanup();
    });
    describe('with alternate configuration', function() {
        var sprites = new broccoliSvgSprite(inputFiles, others);
        var builder = new broccoli.Builder(sprites);
        it('should produce 13 files', function(done) {
            this.timeout(5000);
            try {
                var tree = builder.build().then(function(graph) {
                    var files = walkSync(graph.directory).filter(function(path) {
                        return !DIR_REGEX.test(path);
                    });
                    should(files.length).be.exactly(13);
                    done();
                }).catch(function(e) {
                    done(e);
                });
            } catch (error) {
                done(error);
            }
        });
        it('should match diagonal sprite', function(done) {
            this.timeout(20000);
            svg2png(builder.tree.outputPath + '/svg/diagonal.svg', builder.tree.outputPath + '/png/diagonal.png', function(error) {
                if (error)
                    done(error);
                imageDiff({
                    actualImage: builder.tree.outputPath + '/png/diagonal.png',
                    expectedImage: 'test/expected/diagonal.png',
                    diffImage: builder.tree.outputPath + '/diff/diagonal.png'
                }, function(error, imagesAreSame) {
                    if (imagesAreSame)
                        done();
                    else done(error);
                });
            });
        });
        it('should match packed sprite', function(done) {
            this.timeout(20000);
            svg2png(builder.tree.outputPath + '/svg/packed.svg', builder.tree.outputPath + '/png/packed.png', function(error) {
                if (error)
                    done(error);
                imageDiff({
                    actualImage: builder.tree.outputPath + '/png/packed.png',
                    expectedImage: 'test/expected/packed.png',
                    diffImage: builder.tree.outputPath + '/diff/packed.png'
                }, function(error, imagesAreSame) {
                    if (imagesAreSame)
                        done();
                    else done(error);
                });
            });
        });
        builder.cleanup();
    });
});
