import { GameConfig } from "../types/game.types";
import { loadGameConfig } from "../services/game-config.services";
import { Header } from "./header";

export function initGame() {
  const config = loadGameConfig();
  new Game(config);
}

class Game {
  constructor(private config: GameConfig) {
    this.setBackgroundColor();
    new Header(this.config);
  }
  
  setBackgroundColor(): void {
    let setColor = document.querySelector<HTMLDivElement>(".game");
    if (!setColor) return;
    setColor.classList.add(`game--${this.config.theme}`);
  }
}
