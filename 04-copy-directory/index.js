const fsPromises = require("fs/promises");
const path = require("path");

const srcFolderPath = path.join(__dirname, "files");
const destFolderPath = path.join(__dirname, "files-copy");

function copyDir() {
  fsPromises.rm(destFolderPath, {recursive: true, force: true})
  .then(() => {
    fsPromises.mkdir(destFolderPath, { recursive: true })
    .then(() => {
      fsPromises.readdir(srcFolderPath, { withFileTypes: true })
      .then((files) => {
        files.forEach((file) => {
            if (file.isFile()) {
              fsPromises.copyFile(path.join(srcFolderPath, file.name), path.join(destFolderPath, file.name))
              .catch(err => {
                throw err;
              });
            }
          });
        });
    });
  });
}

copyDir();