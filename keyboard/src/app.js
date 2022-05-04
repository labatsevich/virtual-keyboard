import Keyboard from "./keyboard.js";

const keyboard = new Keyboard()

document.body.insertAdjacentElement('afterbegin', keyboard.render())

document.addEventListener('keyup', e => {
    console.log(e)
})