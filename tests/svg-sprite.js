'use strict';
/*jshint expr: true*/
/*global describe, it */
/**
 * gulp-svg-sprite is a Gulp plugin for creating SVG sprites
 *
 * @see https://github.com/jkphl/gulp-svg-sprite
 *
 * @author Joschi Kuphal <joschi@kuphal.net> (https://github.com/jkphl)
 * @copyright © 2014 Joschi Kuphal
 * @license MIT https://raw.github.com/jkphl/gulp-svg-sprite/master/LICENSE.txt
 */
var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    broccoli = require('broccoli'),
    mkdirp = require('mkdirp'),
    walkSync = require('walk-sync');
var
    broccoliSvgSprite = require('../'),
    inputFiles = {
        srcDir: 'tests',
        include: ['**/*.svg'],
        exclude: []
    },
    orthogonal = {
        log: 'debug',
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
    others                  = {
        shape               : {
            dest            : 'intermediate'
        },
        mode                : {
            css             : {
                layout      : 'diagonal',
                sprite      : '../svg/diagonal.svg',
                bust        : false
            },
            view            : {
                layout      : 'packed',
                sprite      : '../svg/packed.svg',
                bust        : false
            }
        }
    };




describe('broccoli-svg-sprite', function() {
    describe('with orthogonal configuration', function() {
        it('should produce 9 files', function(done) {
            this.timeout(5000);
            try {
                console.log('Starting sprite generation');
                var sprites = new broccoliSvgSprite(inputFiles, orthogonal);
                var builder = new broccoli.Builder(sprites);
                var tree = builder.build().then(function(graph) {
                    console.log('*********************');
                    console.log(walkSync(graph));
                });
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    });
    describe('with alternate configuration', function() {
        it('should produce 13 files', function(done) {
            this.timeout(5000);
            try {
                console.log('Starting sprite generation');
                var sprites = new broccoliSvgSprite(inputFiles, others);
                var builder = new broccoli.Builder(sprites);
                var tree = builder.build().then(function(graph) {
                    console.log('*********************');
                    console.log(walkSync(graph));
                    
                });
                done();
            } catch (error) {
                console.log(error);
                done(error);
            }
        });
    });
});
