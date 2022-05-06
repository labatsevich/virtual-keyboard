/* eslint-disable import/extensions */
import Keyboard from './keyboard.js';

const keyboard = new Keyboard(localStorage.getItem('lang'));
keyboard.init();

document.body.insertAdjacentElement('afterbegin', keyboard.render());