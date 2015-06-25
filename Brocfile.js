var svgSpriter = require('./');
var merge = require('broccoli-merge-trees');

var inputFiles = {
    srcDir: '.',
    include: ['**/*.svg'],
    exclude: []

};



var orthogonal = orthogonal = {
    //      log                 : 'debug',
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
};
var others = {

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

function writeFile(file, content) {
    try {
        mkdirp.sync(path.dirname(file));
        fs.writeFileSync(file, content);
        return file;
    } catch (e) {
        return null;
    }
}

orthogonalSpriter = new svgSpriter(inputFiles, orthogonal);

console.log('Writing Files');
console.log(orthogonalSpriter._destDir);


module.exports = merge([orthogonalSpriter]);
