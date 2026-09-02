const fs = require("fs");
const path = require("path");

const SAMPLE_ASSETS = [
    "public/sounds/sfx/ui_button_select.mp3",
    "public/sounds/music/list_radio.json",
    "public/textures/game_textures.json",
];

const LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";

function isLfsPointer(filePath) {
    if (!fs.existsSync(filePath)) {
        return false;
    }

    const head = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" }).slice(0, 80);
    return head.startsWith(LFS_POINTER_PREFIX);
}

function main() {
    if (process.env.SKIP_LFS_CHECK === "1") {
        return;
    }

    const missing = SAMPLE_ASSETS.filter((assetPath) => !fs.existsSync(path.join(process.cwd(), assetPath)));

    if (missing.length > 0) {
        console.warn("\n[setup] Some expected assets are missing:");
        missing.forEach((assetPath) => console.warn(`  - ${assetPath}`));
        console.warn("\nIf you just cloned the repo, run:\n  git lfs pull\n");
        return;
    }

    const lfsPointers = SAMPLE_ASSETS.filter((assetPath) => isLfsPointer(path.join(process.cwd(), assetPath)));

    if (lfsPointers.length === 0) {
        return;
    }

    console.error("\n[setup] Git LFS assets were not downloaded.");
    lfsPointers.forEach((assetPath) => console.error(`  - ${assetPath}`));
    console.error("\nRun:\n  git lfs install\n  git lfs pull\n");
    console.error("Or skip this check temporarily:\n  set SKIP_LFS_CHECK=1   (Windows)\n  SKIP_LFS_CHECK=1 ...   (macOS/Linux)\n");
    process.exit(1);
}

main();
