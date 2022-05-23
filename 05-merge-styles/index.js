const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

stylesPathFile = path.join(__dirname, 'styles');
bundlePathFile = path.join(__dirname, 'project-dist', 'bundle.css');
writeFile = fs.createWriteStream(bundlePathFile);
 
fsp.readdir(stylesPathFile, {withFileTypes: true})
  .then(files => {
    files.forEach(file => {
      if (path.extname(file.name).slice(1) === 'css') {
        let filesCssPath = fs.createReadStream(path.join(stylesPathFile, file.name), 'utf-8');
        filesCssPath.pipe(writeFile, {end: false});
      }
    });
  })
  .catch(err => console.log(err));
