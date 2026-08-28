import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";

import { isControlAlive, isTextureAlive } from "utils/diagnostics";

//
// FADING
export const fadeInUI = (ui: AdvancedDynamicTexture, duration = 300) => {
    const container = ui.rootContainer;
    const startAlpha = 0;
    const targetAlpha = 1;
    const startTime = performance.now();

    const fade = () => {
        if (!isTextureAlive(ui) || !isControlAlive(container)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        container.alpha = startAlpha * (1 - t) + targetAlpha * t;

        if (t < 1) {
            requestAnimationFrame(fade);
        }
    };

    requestAnimationFrame(fade);
};

export const fadeOutUI = (ui: AdvancedDynamicTexture, duration = 300) => {
    const container = ui.rootContainer;
    const startTime = performance.now();

    const fadeRecursive = (
        control: Control,
        startAlpha: number,
        targetAlpha: number,
        t: number,
    ) => {
        const currentAlpha = startAlpha * (1 - t) + targetAlpha * t;
        control.alpha = currentAlpha;

        if ("children" in control && Array.isArray(control.children)) {
            control.children.forEach((child) => {
                fadeRecursive(child, startAlpha, targetAlpha, t);
            });
        }
    };

    const fade = () => {
        if (!isTextureAlive(ui) || !isControlAlive(container)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        fadeRecursive(container, 1, 0, t);

        if (t < 1) {
            requestAnimationFrame(fade);
        } else if (isTextureAlive(ui)) {
            ui.dispose();
        }
    };

    requestAnimationFrame(fade);
};

export const fadeInControl = (control: Control, duration = 300) => {
    const startAlpha = 0;
    const targetAlpha = 1;
    const startTime = performance.now();

    const fade = () => {
        if (!isControlAlive(control)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        control.alpha = startAlpha * (1 - t) + targetAlpha * t * t;

        if (t < 1) {
            requestAnimationFrame(fade);
        }
    };

    requestAnimationFrame(fade);
};

export const fadeOutControl = (control: Control, duration = 300) => {
    const startAlpha = 1;
    const targetAlpha = 0;
    const startTime = performance.now();

    const fade = () => {
        if (!isControlAlive(control)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        control.alpha = startAlpha * (1 - t) + targetAlpha * t * t;

        if (t < 1) {
            requestAnimationFrame(fade);
        }
    };

    requestAnimationFrame(fade);
};
// FADING
//

//
// OFFSETS
export const animateFromLeft = (control: Control, from: number, to: number, duration = 300) => {
    const startLeft = from;
    const targetLeft = to;
    const startTime = performance.now();

    const animate = () => {
        if (!isControlAlive(control)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        control.left = startLeft * (1 - t) + targetLeft * t;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};
// OFFSETS
//

//
// TYPING ANIMATION
interface TextTypingAnimationOptions {
    speed?: number;
    randomLetters?: string;
    onComplete?: () => void;
}

// Наверняка очень много памяти уйдет!
// const RANDOM_LETTERS =
//     "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnmЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮйцукенгшщзхъфывапролджэячсмитьбю";

// Берем это
const RANDOM_LETTERS = "йХуУХЙ";

export const animateTextTyping = (
    mainText: TextBlock | null,
    shadowText: TextBlock | null,
    fullText: string,
    options: TextTypingAnimationOptions = {},
): (() => void) => {
    const { speed = 50, randomLetters = true, onComplete } = options;

    if (!mainText && !shadowText) {
        return () => {};
    }

    const existingInterval = (animateTextTyping as any)._activeIntervals?.get(
        mainText || shadowText,
    );
    if (existingInterval) {
        clearInterval(existingInterval);
    }

    let currentIndex = 0;
    let isAnimating = true;
    let randomLetterInterval: NodeJS.Timeout | null = null;

    if (mainText) mainText.text = randomLetters ? getRandomLetter() : "";
    if (shadowText) shadowText.text = randomLetters ? getRandomLetter() : "";

    if (randomLetters) {
        randomLetterInterval = setInterval(() => {
            if (!isAnimating) return;
            if (mainText && !isControlAlive(mainText)) return;
            if (shadowText && !isControlAlive(shadowText)) return;

            if (currentIndex >= fullText.length) return;

            const baseText = fullText.substring(0, currentIndex);
            const randomLetter = getRandomLetter();

            if (mainText) mainText.text = baseText + randomLetter;
            if (shadowText) shadowText.text = baseText + randomLetter;
        }, speed * 0.75);
    }

    const intervalId = setInterval(() => {
        if (!isAnimating) return;
        if (mainText && !isControlAlive(mainText)) return;
        if (shadowText && !isControlAlive(shadowText)) return;

        if (currentIndex <= fullText.length) {
            const currentPart = fullText.substring(0, currentIndex);

            if (randomLetters) {
                if (mainText) mainText.text = currentPart;
                if (shadowText) shadowText.text = currentPart;
            } else {
                if (mainText) mainText.text = currentPart;
                if (shadowText) shadowText.text = currentPart;
            }

            currentIndex++;
        } else {
            clearInterval(intervalId);
            if (randomLetterInterval) {
                clearInterval(randomLetterInterval);
            }
            isAnimating = false;

            if (mainText) mainText.text = fullText;
            if (shadowText) shadowText.text = fullText;

            onComplete?.();
        }
    }, speed);

    if (mainText) {
        (animateTextTyping as any)._activeIntervals =
            (animateTextTyping as any)._activeIntervals || new Map();
        (animateTextTyping as any)._activeIntervals.set(mainText, {
            typingInterval: intervalId,
            randomInterval: randomLetterInterval,
        });
    }

    return () => {
        clearInterval(intervalId);
        if (randomLetterInterval) {
            clearInterval(randomLetterInterval);
        }
        isAnimating = false;
        if (mainText) {
            (animateTextTyping as any)._activeIntervals?.delete(mainText);
        }
    };
};

const getRandomLetter = (): string => {
    const randomIndex = Math.floor(Math.random() * RANDOM_LETTERS.length);
    return RANDOM_LETTERS[randomIndex];
};

export const stopTextTypingAnimation = (textBlock: TextBlock | null) => {
    if (!textBlock) return;

    const intervals = (animateTextTyping as any)._activeIntervals?.get(textBlock);
    if (intervals) {
        clearInterval(intervals.typingInterval);
        if (intervals.randomInterval) {
            clearInterval(intervals.randomInterval);
        }
        (animateTextTyping as any)._activeIntervals?.delete(textBlock);
    }
};
// TYPING ANIMATION
//
