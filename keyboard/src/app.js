/* eslint-disable import/extensions */
import Keyboard from './keyboard.js';

const lang = localStorage.getItem('lang');
const keyboard = new Keyboard(lang);
keyboard.init();

document.body.insertAdjacentElement('afterbegin', keyboard.render());
document.addEventListener('click', (event) => keyboard.eventHandler(event));
document.addEventListener('keydown', (event) => keyboard.eventHandler(event));
document.addEventListener('keyup', (event) => keyboard.eventHandler(event));
document.addEventListener('mouseup', (event) => keyboard.eventHandler(event));