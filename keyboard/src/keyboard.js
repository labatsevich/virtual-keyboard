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
            ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete'],
            ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'IntlBackslash', 'Enter'],
            ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
            ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'],
        ];
        this.funcKeys = ['Backspace', 'Delete', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'];
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

        container.addEventListener('mousedown', this.eventHandler.bind(this));

        return container;
    }

    onKeydown(event) {
        let { selectionStart, selectionEnd } = this.textbox;
        const { value } = this.textbox;
        const button = this.root.querySelector(`[data-code="${event.code}"]`);
        const langIndicator = this.root.querySelector('.lang__indicator');

        if (button) {
            button.classList.add('pressed');
        }
        const updateLang = (lang) => {
            langIndicator.innerText = lang;
        };

        if (event.code === 'CapsLock') {
            this.properties.isCapsSwitched = !this.properties.isCapsSwitched;
            button.classList.toggle('switched');
            this.setUpperLower();
        }
        if (event.code === 'Backspace') {
            if (selectionStart === selectionEnd) {
                const before = value.slice(0, selectionStart - 1);
                const after = value.slice(selectionEnd, value.length);

                this.textbox.value = before + after;
                selectionStart -= 1;
                selectionEnd -= 1;
            } else if (selectionStart) {
                const str1 = value.substr(0, selectionStart);
                const str2 = value.substr(selectionEnd, value.length);

                this.textbox.value = str1 + str2;
            }
        }
        if (event.code === 'Delete') {
            this.textbox.setRangeText('', selectionStart, selectionEnd + 1, 'end');
        }
        if (event.ctrlKey && event.altKey) {
            this.currentLang = this.languages.find((ln) => ln !== this.currentLang);
            localStorage.setItem('lang', this.currentLang);
            this.setLang(this.currentLang);
            updateLang(this.currentLang);
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
        const { target } = event;
        let { selectionStart, selectionEnd } = this.textbox;
        let { value } = this.textbox;

        if (target.classList.contains('keyboard__key') && !this.funcKeys.includes(target.dataset.code)) {
            this.textbox.setRangeText(target.innerText, selectionStart, selectionEnd, 'end');
        }
        if (['Enter', 'Tab', 'Space'].includes(target.dataset.code)) {
            this.textbox.setRangeText(this.specialKeys[target.dataset.code], selectionStart, selectionEnd, 'end');
        }
        if (target.dataset.code === 'Backspace') {
            if ((selectionStart === selectionEnd) && selectionStart) {
                const before = value.substr(0, selectionStart - 1);
                const after = value.substr(selectionEnd, value.length);

                this.textbox.value = before + after;
                selectionStart = -1;
                selectionEnd -= 1;
            } else if (selectionStart) {
                value = value.substr(0, selectionStart) + value.substr(selectionEnd, value.length);
            }
        }
        if (target.dataset && target.dataset.code === 'Delete') {
            this.textbox.setRangeText('', selectionStart, selectionEnd + 1, 'end');
        }
        return this;
    }

    onMousedown(event) {
        const { target } = event;
        const button = target.closest('.keyboard__key');

        if (button) {
            button.classList.add('pressed');

            switch (button.dataset.enLower) {
                case 'Shift':
                    this.properties.isShifted = !this.properties.isShifted;
                    this.setUpperLower();
                    break;
                case 'CapsLock':
                    this.properties.isCapsSwitched = !this.properties.isCapsSwitched;
                    this.setUpperLower();
                    button.classList.toggle('switched');
                    break;
                default:
                    break;
            }
        }

        return this;
    }

    onMouseup(event) {
        const { target } = event;
        if (target.classList.contains('keyboard__key')) {
            target.classList.remove('pressed');
        }
        if (target.dataset.enLower === 'Shift') {
            this.properties.isShifted = !this.properties.isShifted;
            this.setUpperLower();
        }
        return this;
    }

    setLang(lang) {
        const shifted = this.properties.isShifted;

        this.buttons.forEach((item) => {
            const button = item;
            const { code } = item.dataset;

            if (!this.funcKeys.includes(code)) {
                button.innerText = shifted ? item.dataset[`${lang}Upper`] : item.dataset[`${lang}Lower`];
            }
        });
        return this;
    }

    textboxUpdate(event) {
        let symbol = '';
        const { selectionStart, selectionEnd } = this.textbox;
        const shifted = this.properties.isShifted;
        const isCaps = this.properties.isCapsSwitched;
        const { code } = event;
        const button = this.buttons.find((item) => item.dataset.code === code);

        if (this.arrowKeys.includes(code)) {
            symbol = button.dataset.enLower || '';
        } else if (!this.funcKeys.includes(code)) {
            symbol = (shifted || isCaps) ? button.dataset[`${this.currentLang}Upper`] : button.dataset[`${this.currentLang}Lower`];
        } else if (['Enter', 'Tab', 'Space'].includes(code)) {
            symbol = this.specialKeys[code] || '';
        }

        this.textbox.setRangeText(symbol, selectionStart, selectionEnd, 'end');
    }

    setUpperLower() {
        const shifted = this.properties.isShifted;
        const isCaps = this.properties.isCapsSwitched;

        this.buttons.forEach((item) => {
            const button = item;
            const isFunc = this.funcKeys.includes(item.dataset.code);
            const isArrow = this.arrowKeys.includes(item.dataset.code);

            if (!isFunc || !isArrow) {
                button.innerText = (shifted || isCaps) ? item.dataset[`${this.currentLang}Upper`] : item.dataset[`${this.currentLang}Lower`];
            }
        });
        return this;
    }
}

export default Keyboard;