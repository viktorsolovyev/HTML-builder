const fsPromises = require("fs/promises");
const path = require("path");

const secretFolderPath = path.join(__dirname, "secret-folder");

fsPromises.readdir(secretFolderPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      let fileName = path.parse(file.name).name;
      let fileExt = path.parse(file.name).ext.replace(".", "");
      fsPromises.stat(path.join(secretFolderPath, file.name)).then((stats) => {
        console.log(fileName, "-", fileExt, "-", stats.size);
      });
    }
  });
});
