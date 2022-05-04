import keysMap from "./utils/keysMap.js";
import createControl from "./utils/helpers.js"

class Keyboard {

    keys = [
        ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Minus', 'Equal', 'Backspace'],
        ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight']
    ]
    constructor(selector = "keyboard") {
        this.selector = selector;

    }

    render() {

        const container = createControl('div', '', [this.selector])

        const collection = keysMap.find(item => item.lang === 'en').map


        this.keys.forEach(row => {

            const keyboardRow = createControl('div', '', ['keyboard__row'])

            keyboardRow.append(...row.map(k => {

                const keyObject = collection.find((item) => { return item.code === k })

                const button = createControl('button', key, ['keyboard__key'])
                button.setAttribute('type', 'button')

                return button
            }))

            container.append(keyboardRow)

        })

        return container

    }

}

export default Keyboard;