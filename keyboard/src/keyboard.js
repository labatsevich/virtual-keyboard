/* eslint-disable import/extensions */
import keysMap from './utils/keysMap.js';
import createControl from './utils/helpers.js';

class Keyboard {
    constructor(selector = 'keyboard') {
        this.selector = selector;
        this.root = document;
        this.textbox = null;
        this.properties = {
            value: '',
        };
        this.keys = [
            ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Equal', 'Backspace'],
            ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
            ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
            ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
            ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'],
        ];
    }

    init() {
        const textarea = createControl('textarea', '', []);
        this.root.body.insertAdjacentElement('afterbegin', textarea);
        this.textbox = textarea;
        this.root.addEventListener('keydown', this.eventHandler.bind(this));
        this.root.addEventListener('keyup', this.eventHandler.bind(this));
        this.root.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler(event) {
        const eventCapitalized = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        this[`on${eventCapitalized}`](event);

        return this;
    }

    render() {
        const container = createControl('div', '', [this.selector]);

        const collection = keysMap.find((item) => item.lang === 'en').keys;

        this.keys.forEach((row) => {
            const buttons = row.map((item) => {
                const { code, lower } = collection.find((k) => k.code === item) || {};
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

    onKeydown(event) {
        this.root.querySelector(`[data-code="${event.code}"]`).classList.add('pressed');
        this.textboxUpdate(event);
        return this;
    }

    onKeyup(event) {
        this.root.querySelector(`[data-code="${event.code}"]`).classList.remove('pressed');
        return this;
    }

    onClick(event) {
        let bla = event.target;
        return this;
    }

    textboxUpdate(event) {
        this.properties.value += event.key;
        this.textbox.value += this.properties.value;
    }
}

export default Keyboard;