const path = require('path');

exports.Router = {
  init() {
    const normalizedPath = path
      .join(__dirname, "controllers");

    return require("fs")
      .readdirSync(normalizedPath)
      .forEach(function (file) {
        require(`${normalizedPath}\\${file}`);
      });
  }
}