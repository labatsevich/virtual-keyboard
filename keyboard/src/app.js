/* eslint-disable import/extensions */
import Keyboard from './keyboard.js';

const lang = localStorage.getItem('lang');
const keyboard = new Keyboard(lang);
keyboard.init();

document.body.insertAdjacentElement('afterbegin', keyboard.render());