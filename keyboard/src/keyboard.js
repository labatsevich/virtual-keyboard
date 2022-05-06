/* eslint-disable indent */
/* eslint-disable import/extensions */
import keysMap from './utils/keysMap.js';
import createControl from './utils/helpers.js';

class Keyboard {
    constructor(language) {
        this.selector = 'keyboard';
        this.root = document;
        this.textbox = null;
        this.languages = ['en', 'ru'];
        this.currentLang = language || 'en';
        this.properties = {

            isCapsSwitched: false,
            isShifted: false,
        };
        this.keys = [
            ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
            ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
            ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'IntlBackslash', 'Enter'],
            ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
            ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
        ];
        this.funcKeys = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'];
        this.arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        this.specialKeys = {
            Enter: '\n',
            Space: ' ',
            Tab: '\t',
        };
        this.buttons = [];
    }

    init() {
        const { body } = this.root;
        this.textbox = createControl('textarea', '', []);
        body.insertAdjacentElement('afterbegin', this.textbox);
        this.textbox.focus();
        this.root.addEventListener('keydown', this.eventHandler.bind(this));
        this.root.addEventListener('keyup', this.eventHandler.bind(this));
        this.root.addEventListener('click', this.eventHandler.bind(this));
        localStorage.setItem('lang', this.currentLang);
    }

    eventHandler(event) {
        event.preventDefault();
        this.textbox.focus();
        const eventType = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        this[`on${eventType}`](event);

        return this;
    }

    render() {
        const container = createControl('div', '', [this.selector]);
        const collection = keysMap;

        this.keys.forEach((row) => {
            const buttons = row.map((item) => {
                const key = collection.find((k) => k.code === item) || {};
                const button = createControl('button', (key[this.currentLang]) ? key[this.currentLang].lower : key.lower, ['keyboard__key', key.code.toLowerCase()]);
                button.dataset.code = key.code;
                button.dataset.enLower = (key.en) ? key.en.lower : key.lower;
                button.dataset.enUpper = (key.en) ? key.en.upper : key.upper;
                button.dataset.ruLower = (key.ru) ? key.ru.lower : key.lower;
                button.dataset.ruUpper = (key.ru) ? key.ru.upper : key.upper;
                this.buttons.push(button);

                return button;
            });

            const keyboardRow = createControl('div', '', ['keyboard__row']);
            keyboardRow.append(...buttons);

            container.append(keyboardRow);
        });

        return container;
    }

    onKeydown(event) {
        let { selectionStart, selectionEnd } = this.textbox;
        const { value } = this.textbox;
        const button = this.root.querySelector(`[data-code="${event.code}"]`);
        button.classList.add('pressed');

        if (event.code === 'CapsLock') {
            this.properties.isCapsSwitched = !this.properties.isCapsSwitched;
            button.classList.toggle('switched');
        }
        if (event.code === 'Backspace') {
            if (selectionStart === selectionEnd) {
                this.textbox.value = value.slice(0, selectionStart - 1) + value.slice(selectionEnd, value.length);
                selectionStart -= 1;
                selectionEnd -= 1;
            } else if (selectionStart) {
                this.textbox.value = value.substr(0, selectionStart) + value.substr(selectionEnd, value.length);
            }
        }
        if (event.ctrlKey && event.altKey) {
            this.currentLang = this.languages.find((ln) => ln !== this.currentLang);
            localStorage.setItem('lang', this.currentLang);
            this.setLang(this.currentLang);
        }
        if (event.shiftKey && event.key === 'Shift' && !event.repeat) {
            this.properties.isShifted = !this.properties.isShifted;
            this.setUpperLower();
        }

        this.textboxUpdate(event);
        return this;
    }

    onKeyup(event) {
        const button = this.buttons.find((item) => item.dataset.code === event.code);

        if (event.key === 'Shift') {
            this.properties.isShifted = !this.properties.isShifted;
            this.setUpperLower();
        }

        if (button) {
            button.classList.remove('pressed');
        }

        return this;
    }

    onClick(event) {
        let { selectionStart, selectionEnd } = this.textbox;
        const buttonData = event.target.dataset;
        const { value } = this.textbox;

        if ((event.target.classList.contains('keyboard__key') || event.target.closest('keyboard')) && !this.funcKeys.includes(buttonData.code)) {
            this.textbox.setRangeText(event.target.innerText, selectionStart, selectionEnd, 'end');
        }
        if (buttonData.code === 'Backspace') {
            if ((selectionStart === selectionEnd) && selectionStart) {
                this.textbox.value = value.substr(0, selectionStart - 1) + value.substr(selectionEnd, value.length);
                selectionStart = -1;
                selectionEnd -= 1;
            } else if (selectionStart) {
                this.textbox.value = value.substr(0, selectionStart) + value.substr(selectionEnd, value.length);
            }
        }
        return this;
    }

    setLang(lang) {
        const shifted = this.properties.isShifted;
        this.buttons.forEach((item) => {
            if (!this.funcKeys.includes(item.dataset.code)) {
                item.innerText = shifted ? item.dataset[`${lang}Upper`] : item.dataset[`${lang}Lower`];
            }
        });
        return this;
    }

    textboxUpdate(event) {
        let symbol = '';
        const { selectionStart, selectionEnd } = this.textbox;
        if (!this.funcKeys.includes(event.code)) {
            symbol = event.key;
        } else if (['Enter', 'Tab', 'Space'].includes(event.code)) {
            symbol = this.specialKeys[event.code] || '';
        }

        this.textbox.setRangeText(symbol, selectionStart, selectionEnd, 'end');
    }

    setUpperLower() {
        const shifted = this.properties.isShifted;

        this.buttons.forEach((item) => {
            if (!this.funcKeys.includes(item.dataset.code)) {
                item.innerText = shifted ? item.dataset[`${this.currentLang}Upper`] : item.dataset[`${this.currentLang}Lower`];
            }
        });
        return this;
    }
}

export default Keyboard;