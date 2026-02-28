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
    this.exitButton();
    this.closeOverlayOnClickOutside();
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
    this.setExitButton();
    this.overlayButtons();
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
    let color = document.querySelector<HTMLSpanElement>(
      ".game__current-player",
    );
    if (!color) return;
    if (
      this.config.theme === "da_projects_theme" ||
      this.config.theme === "foods_theme"
    ) {
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

  setExitButton(): void {
    let exitButton = document.querySelector<HTMLButtonElement>(".game__exit");
    let exitImage = document.querySelector<HTMLDivElement>(".game__exit-image");
    if (!exitButton || !exitImage) return;
    this.exitButtonTheme(exitButton, exitImage);
  }

  exitButtonTheme(
    exitButton: HTMLButtonElement,
    exitImage: HTMLDivElement,
  ): void {
    if (this.config.theme === "code_vibes") {
      exitButton.classList.add("game__exit--code_vibes");
    } else if (this.config.theme === "gaming_theme") {
      exitButton.classList.add("game__exit--gaming_theme");
    } else if (this.config.theme === "foods_theme") {
      exitButton.classList.add("game__exit--foods_theme");
      exitImage.classList.add("game__exit-image--foods_theme");
    } else if (this.config.theme === "da_projects_theme") {
      exitButton.classList.add("game__exit--da_projects_theme");
      exitImage.classList.add("game__exit-image--da_projects_theme");
    }
  }

  overlayButtons(): void {
    let buttons = document.querySelectorAll<HTMLButtonElement>(".game__button");
    if (buttons.length < 2) return;
    this.overlayButtonsEvent(buttons);
    this.overlayButtonsTheme(buttons);
  }

  overlayButtonsEvent(buttons: NodeListOf<HTMLButtonElement>): void {
    buttons[0].addEventListener("click", () => {
      this.hideOverlay();
    });
    buttons[1].addEventListener("click", () => {
      window.location.href = "./settings.html";
    });
  }

  overlayButtonsTheme(buttons: NodeListOf<HTMLButtonElement>): void {
    if (this.config.theme === "code_vibes") {
      buttons[0].classList.add("game__button--code_vibes-cancel");  
      buttons[1].classList.add("game__button--code_vibes-confirm");
    } else if (this.config.theme === "gaming_theme") {
      buttons[0].classList.add("game__button--gaming_theme-cancel");
      buttons[1].classList.add("game__button--gaming_theme-confirm");
    } else if (this.config.theme === "da_projects_theme") {
      buttons[0].classList.add("game__button--da_projects_theme-cancel");
      buttons[1].classList.add("game__button--da_projects_theme-confirm");
    } else if (this.config.theme === "foods_theme") {
      buttons[0].classList.add("game__button--foods_theme-cancel");
      buttons[1].classList.add("game__button--foods_theme-confirm");
    }
  }    

  showOverlay(): void {
    let overlay = document.getElementById("overlay");
    let popUp = document.querySelector<HTMLDivElement>(".game__overlay");
    if (overlay && popUp) {
      overlay.style.display = "flex";
      setTimeout(() => {
        popUp.classList.add("game__overlay--active");
      }, 10);
    }
  }

  hideOverlay(): void {
    let overlay = document.getElementById("overlay");
    let popUp = document.querySelector<HTMLDivElement>(".game__overlay");
    if (overlay && popUp) {
      popUp.classList.remove("game__overlay--active");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 400);
    }
  }

  closeOverlayOnClickOutside(): void {
    let overlay = document.getElementById("overlay");
    if (!overlay) return; 
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        this.hideOverlay();
      } 
    });
  }

  exitButton(): void {
    let exitButton = document.querySelector<HTMLButtonElement>(".game__exit");
    let overlay = document.getElementById("overlay");
    if (!exitButton || !overlay) return;

    exitButton.addEventListener("click", () => {
      this.showOverlay();
    });
  }
}

initGame();
