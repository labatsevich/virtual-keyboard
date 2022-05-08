/* eslint-disable import/extensions */
import Keyboard from './keyboard.js';
import createControl from './utils/helpers.js';

const lang = localStorage.getItem('lang');
const keyboard = new Keyboard(lang);
keyboard.init();

document.body.insertAdjacentElement('afterbegin', keyboard.render());
document.addEventListener('click', (event) => keyboard.eventHandler(event));
document.addEventListener('keydown', (event) => keyboard.eventHandler(event));
document.addEventListener('keyup', (event) => keyboard.eventHandler(event));
document.addEventListener('mouseup', (event) => keyboard.eventHandler(event));

document.body.insertBefore(createControl('div', 'Клавиатура создана в операционной системе Windows', ['keyboard__info']), document.querySelector('.keyboard'));
document.body.insertBefore(createControl('div', 'Для переключения языка комбинация: левыe ctrl + alt', ['keyboard__info']), document.querySelector('.keyboard__info'));