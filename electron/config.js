const path = require("path");

const PORT = 5051;
const isDev = process.env.ELECTRON_DEV === "1";

function getBuildPath() {
    return path.join(__dirname, "..", "build");
}

module.exports = {
    PORT,
    isDev,
    getBuildPath,
};
