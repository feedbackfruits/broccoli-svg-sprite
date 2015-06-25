broccoli-svg-sprite

The broccoli-svg-sprite plugin provides a wrapper around node.js svg-sprite module which takes a set of svg files, optimizes them and combines them into SVG sprites of several types



#Installation

npm install --save-dev broccoli-svg-sprite


#Usage

The broccoli-svg-sprite plugin is just a wrapper around the svg-sprite module. To use the plugin in your broccoli project, first import the plugin into your project:


`var spriter = require('broccoli-svg-sprite');`


Then, just instantiate a new spriter object passing in the appropriate options:


`var svgSpriter = new spriter(srcFiles, spriteOptions);`


where

```
srcFiles: is a data object containing:
	srcDir: the base directory containing your svg files.
	include: An array of inclusion glob patterns to filter files.
	exclude: An array of exclusion glob patterns to filter files.

spriteOptions: is a data object that will be passed as such to the svg-sprite module. For a detailed explanation of all available options, refer to https://github.com/jkphl/svg-sprite
```


#Example:

```
var svgSpriter = new spriter(srcFiles, spriteOptions);
var srcFiles = {
  srcDir: 'svgs',
  include: ['**/*.svg'],
  exclude: []
};
var svgOptions = {
    dest: '.',

    shape: {
        spacing: { // Spacing related options
            padding: 1, // Padding around all shapes
            box: 'content' // Padding strategy (similar to CSS `box-sizing`)
        },
    },
    mode: {
        view: { // Activate the «view» mode
            dest: 'assets/images',
            bust: false,
            render: {
                css: {
                    dest: '../../app/styles/less/sprite.css'
                },



                scss: false,
                styl: false
            },
            prefix: 'svg-view-id',
            sprite: 'cw-svg-views-sprite.svg',
            example: false
        },
    }

};

var spriter = new svgSpriter(srcFiles, svgOptions);

module.exports = mergeTree[app.toTree(), spriter];
```


#To do

Add tests.


