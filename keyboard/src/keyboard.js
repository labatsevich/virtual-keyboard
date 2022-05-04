/* eslint-disable import/extensions */
import keysMap from './utils/keysMap.js';
import createControl from './utils/helpers.js';

class Keyboard {
    constructor(selector = 'keyboard') {
        this.selector = selector;
        this.root = document;
        this.keys = [
            ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Equal', 'Backspace'],
            ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
            ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
            ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
            ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],
        ];
    }

    init() {
        this.root.addEventListener('keydown', this.eventHandler.bind(this));
        this.root.addEventListener('keyup', this.eventHandler.bind(this));
    }

    eventHandler(event) {
        if (event.type === 'keydown') {
            document.querySelector(`[data-code="${event.code}"]`).classList.add('pressed');
        }
        if (event.type === 'keyup') {
            document.querySelector(`[data-code="${event.code}"]`).classList.remove('pressed');
        }

        return this;
    }

    render() {
        const container = createControl('div', '', [this.selector]);

        const collection = keysMap.find((item) => item.lang === 'en').keys;

        this.keys.forEach((row) => {
            const buttons = row.map((item) => {
                const { code, lower, upper } = collection.find((k) => k.code === item) || {};

                const button = createControl('button', lower, ['keyboard__key', code.toLowerCase()]);
                button.dataset.code = code;

                return button;
            });

            const keyboardRow = createControl('div', '', ['keyboard__row']);
            keyboardRow.append(...buttons);

            container.append(keyboardRow);
        });

        return container;
    }


}

export default Keyboard;