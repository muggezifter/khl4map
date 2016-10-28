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

copyFile('./dist/index.html','../../public/index.html');
console.log('copied index.html');
copyFile('./dist/css/style.css','../../public/css/style.css');
console.log('copied css/style.css');
copyFile('./dist/css/style.css','../../public/css/style.css.map');
console.log('copied css/style.css.map');
copyFile('./dist/js/jquery-2.2.0.min.js','../../public/js/jquery-2.2.0.min.js');
console.log('copied js/jquery-2.2.0.min.js');
copyFile('./dist/js/map.js','../../public/js/map.js');
console.log('copied js/map.js');
copyFile('./dist/js/front.js','../../public/js/front.js');
console.log('copied js/front.js');