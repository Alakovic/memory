import { GameConfig, PlayerColor } from "../types/game.types";
import { themes } from "./game.themes";

function initGame() {
  const config = loadGameConfig();
  new Game(config);
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
  constructor(private config: GameConfig) {
    this.setBackgroundColor();
    this.setHeader();
  }

  setBackgroundColor(): void {
    let setColor = document.querySelector<HTMLDivElement>(".game");
    if (!setColor) return;
    setColor.classList.add(`game--${this.config.theme}`);
  }

  setHeader(): void {
    this.setBgColorHeader();
    this.setBgColorScoreBoard();
    this.setPlayerIcons();
    this.setPlayerScoreColors();
    this.setPlayerLabel();
    this.currentPlayerColorSpan();
    this.setCurrentPlayerIcon();
  }

  setPlayerIcons(): void {
    let player =
      document.querySelectorAll<HTMLImageElement>(".game__player-icon");
    if (player.length < 2) return;
    let themeData = themes[this.config.theme];
    let selectedPlayer = this.config.playerChoice; //Blue or Orange
    let oppositePlayer: PlayerColor =
      selectedPlayer === "Blue" ? "Orange" : "Blue";
    player[0].src = themeData.players[selectedPlayer];
    player[1].src = themeData.players[oppositePlayer];
  }

  setBgColorHeader(): void {
    let setColor = document.querySelector<HTMLDivElement>(".game__header");
    if (!setColor) return;
    setColor.classList.add(`game__header--${this.config.theme}`);
  }

  setBgColorScoreBoard(): void {
    let setColor = document.querySelector<HTMLDivElement>(".game__score");
    if (!setColor) return;
    setColor.classList.add(`game__score--${this.config.theme}`);
  }

  setPlayerScoreColors(): void {
    let scores = document.querySelectorAll<HTMLParagraphElement>(
      ".game__player-score",
    );
    if (scores.length < 2) return;
    let selected = this.config.playerChoice; // "Blue" | "Orange"
    let opposite = selected === "Blue" ? "Orange" : "Blue";

    scores[0].classList.add(`game__player-score--${selected.toLowerCase()}`);
    scores[1].classList.add(`game__player-score--${opposite.toLowerCase()}`);
  }

  setPlayerLabel(): void {
    let labels = document.querySelectorAll<HTMLSpanElement>(
      ".game__player-label",
    );
    if (labels.length < 2) return;
    if (this.config.theme !== "code_vibes") return;
    let selected = this.config.playerChoice; // "Blue" | "Orange"
    let opposite = selected === "Blue" ? "Orange" : "Blue";
    //Player 1
    labels[0].textContent = selected;
    labels[0].classList.add(
      "game__player-label--visible",
      `game__player-label--${selected.toLowerCase()}`,
    );
    //Player 2
    labels[1].textContent = opposite;
    labels[1].classList.add(
      "game__player-label--visible",
      `game__player-label--${opposite.toLowerCase()}`,
    );
  }

  currentPlayerColorSpan(): void {
    let color = document.querySelector<HTMLSpanElement>(".game__current-player");
    if (!color) return;
    if (this.config.theme === "da_projects_theme" || this.config.theme === "foods_theme") 
      {
        color.classList.add("game__current-player--blue");
      }
  }

  setCurrentPlayerIcon(): void {
    let icon = document.querySelector<HTMLImageElement>(".game__current-icon");
    if (!icon) return;
    let themeData = themes[this.config.theme];
    let selectedPlayer = this.config.playerChoice; //Blue or Orange
    icon.src = themeData.players[selectedPlayer];
  }
}

initGame();
