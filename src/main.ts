import './scss/main.scss';
import  './settings/settings';
import { initGame } from './game/game';
import { initEndScreen } from './game/endScreen';


if (document.querySelector(".game")) {
  initGame();
}

if (document.querySelector(".end-screen")) {
  initEndScreen();
}