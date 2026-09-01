const { screen } = require("electron");

const WINDOWED_WIDTH = 1280;
const WINDOWED_HEIGHT = 720;

let borderlessFullscreen = false;

function centerWindow(window) {
    const display = screen.getDisplayNearestPoint(window.getBounds());
    const { x, y, width, height } = display.workArea;
    const [winWidth, winHeight] = window.getSize();

    window.setPosition(
        Math.round(x + (width - winWidth) / 2),
        Math.round(y + (height - winHeight) / 2),
    );
}

function enterBorderlessFullscreen(window) {
    if (borderlessFullscreen) {
        return;
    }

    const display = screen.getDisplayNearestPoint(window.getBounds());

    window.setResizable(true);
    window.setBounds(display.bounds);
    window.setResizable(false);

    borderlessFullscreen = true;
}

function exitBorderlessFullscreen(window) {
    if (!borderlessFullscreen) {
        return;
    }

    window.setResizable(true);
    window.setSize(WINDOWED_WIDTH, WINDOWED_HEIGHT);
    centerWindow(window);
    window.setResizable(false);

    borderlessFullscreen = false;
}

function toggleBorderlessFullscreen(window) {
    if (borderlessFullscreen) {
        exitBorderlessFullscreen(window);
    } else {
        enterBorderlessFullscreen(window);
    }
}

function isBorderlessFullscreen() {
    return borderlessFullscreen;
}

module.exports = {
    centerWindow,
    enterBorderlessFullscreen,
    exitBorderlessFullscreen,
    toggleBorderlessFullscreen,
    isBorderlessFullscreen,
};
