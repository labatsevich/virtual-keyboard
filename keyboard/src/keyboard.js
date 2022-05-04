import keysMap from './utils/keysMap';
import createControl from './utils/helpers';

class Keyboard {
    constructor(selector = 'keyboard') {
        this.selector = selector;
        this.keys = [
            ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Equal', 'Backspace'],
            ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight'],
        ];
    }

    render() {
        const container = createControl('div', '', [this.selector]);

        const collection = keysMap.find((item) => item.lang === 'en').keys;

        this.keys.forEach((row) => {
            const buttons = row.map((item) => {
                const { code = '', key, shiftKey = '' } = collection.find((k) => k.code === item) || {};

                const button = createControl('button', key, ['keyboard__key']);

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