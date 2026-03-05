import './scss/main.scss';
import  './settings/settings';
import { initGame } from './game/game';
import { initEndScreen } from './game/endScreen';
import { initWinScreen } from './game/winScreen';


if (document.querySelector(".game")) {
  initGame();
}

if (document.querySelector(".end-screen")) {
  initEndScreen();
}

if (document.querySelector(".win-screen")) {
  initWinScreen();
}