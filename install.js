var fs = require('fs');

function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', rejectCleanup);
        var wr = fs.createWriteStream(target);
        wr.on('error', rejectCleanup);
        function rejectCleanup(err) {
            rd.destroy();
            wr.end();
            reject(err);
        }
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}
fs.exists('../../public', (exists) => {
    if (exists) {
        copyFile('./dist/index.html','../../public/index.html');
        console.log('copied index.html');

        copyFile('./dist/css/font-awesome.css','../../public/css/font-awesome.css');
        console.log('copied css/fonts-awesome.css');
        copyFile('./dist/css/style.css','../../public/css/style.css');
        console.log('copied css/style.css');
        copyFile('./dist/css/style.css','../../public/css/style.css.map');
        console.log('copied css/style.css.map');

        copyFile('./dist/fonts/FontAwesome.otf','../../public/fonts/FontAwesome.otf');
        console.log('copied fonts/FontAwesome.otf');
        copyFile('./dist/fonts/fontawesome-webfont.eot','../../public/fonts/fontawesome-webfont.eot');
        console.log('copied fonts/fontawesome-webfont.eot');
        copyFile('./dist/fonts/fontawesome-webfont.svg','../../public/fonts/fontawesome-webfont.svg');
        console.log('copied fonts/fontawesome-webfont.svg');
        copyFile('./dist/fonts/fontawesome-webfont.ttf','../../public/fonts/fontawesome-webfont.ttf');
        console.log('copied fonts/fontawesome-webfont.ttf');
        copyFile('./dist/fonts/fontawesome-webfont.woff','../../public/fonts/fontawesome-webfont.woff');
        console.log('copied fonts/fontawesome-webfont.woff');
        copyFile('./dist/fonts/fontawesome-webfont.woff2','../../public/fonts/fontawesome-webfont.woff2');
        console.log('copied fonts/fontawesome-webfont.woff2');

        copyFile('./dist/js/jquery-2.2.0.min.js','../../public/js/jquery-2.2.0.min.js');
        console.log('copied js/jquery-2.2.0.min.js');
        copyFile('./dist/js/map.js','../../public/js/map.js');
        console.log('copied js/map.js');
        copyFile('./dist/js/front.js','../../public/js/front.js');
        console.log('copied js/front.js');

    } else {
        console.log("no public directory found");
    }
});
