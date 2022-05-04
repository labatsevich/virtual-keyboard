/* eslint-disable import/extensions */
import Keyboard from './keyboard.js';

const keyboard = new Keyboard();

document.body.insertAdjacentElement('afterbegin', keyboard.render());