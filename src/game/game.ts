import { GameConfig} from "../types/game.types";

initGame();

function initGame() {
  const config = loadGameConfig();
}

function loadGameConfig(): GameConfig {
  let data = localStorage.getItem("gameConfig");
  if (!data) {
    window.location.href = "./index.html";
    throw new Error("No game config found");
  }

  try {
    let config = JSON.parse(data);
    if (!config.theme || !config.playerChoice || !config.boardSize) {
      throw new Error("Game config incomplete");
    }
    return config as GameConfig;
  } catch (error) {
    window.location.href = "./index.html";
    throw new Error("Invalid game config");
  }
}


class Game {
  constructor(private config: GameConfig) {}


}