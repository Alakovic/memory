import { loadGameResult } from "../services/game-config.services";
import { PlayerColor, ThemeId } from "../types/game.types";
import { themes } from "./game.themes";

export function initEndScreen() {
  let result = loadGameResult();
  setBackgroundColor(result.theme);
  setEndScreenImage(result.theme);
  setScoreBoardBG(result.theme);
  setPlayerIcons(result.theme, result.playerChoice);
  setScores(result.scores, result.playerChoice);
  setPlayerLabel(result.theme, result.playerChoice);
  setPlayerScoreColors(result.playerChoice);
  goToWinScreen();
}

function setBackgroundColor(theme: ThemeId): void {
  let setColor = document.querySelector<HTMLDivElement>(".end-screen");
  if (!setColor) return;
  setColor.classList.add(`end-screen--${theme}`);
}

function setEndScreenImage(theme: ThemeId): void {
  let gameOverImage = document.querySelector<HTMLImageElement>(
    ".end-screen__title-image",
  );
  if (!gameOverImage) return;
  switchGameOverImage(gameOverImage, theme);
}

function switchGameOverImage(
  gameOverImage: HTMLImageElement,
  theme: ThemeId,
): void {
  switch (theme) {
    case "code_vibes":
      gameOverImage.src = "./assets/img/gameOverCode.svg";
      break;
    case "gaming_theme":
      gameOverImage.src = "./assets/img/gameOverGames.svg";
      break;

    case "foods_theme":
      gameOverImage.src = "./assets/img/gameOverFood.svg";
      break;
    case "da_projects_theme":
      gameOverImage.src = "./assets/img/gameOverProjects.svg";
      break;
    default:
      gameOverImage.src = "";
  }
}

function setScoreBoardBG(theme: ThemeId): void {
  let setColor = document.querySelector<HTMLDivElement>(".game__score");
  if (!setColor) return;
  setColor.classList.add(`game__score--${theme}`);
}

function setPlayerIcons(theme: ThemeId, playerChoice: PlayerColor): void {
  let players =
    document.querySelectorAll<HTMLImageElement>(".game__player-icon");
  if (players.length < 2) return;
  let themeData = themes[theme];
  let opposite: PlayerColor = playerChoice === "Blue" ? "Orange" : "Blue";
  players[0].src = themeData.players[playerChoice];
  players[1].src = themeData.players[opposite];
}

function setScores(
  scores: { Blue: number; Orange: number },
  playerChoice: PlayerColor,
): void {
  const scoreElements = document.querySelectorAll<HTMLParagraphElement>(
    ".game__player-score",
  );

  if (scoreElements.length < 2) return;

  let opposite: PlayerColor = playerChoice === "Blue" ? "Orange" : "Blue";

  scoreElements[0].textContent = String(scores[playerChoice]);
  scoreElements[1].textContent = String(scores[opposite]);
}

function setPlayerLabel(theme: ThemeId, playerChoice: PlayerColor): void {
  let labels = document.querySelectorAll<HTMLSpanElement>(
    ".game__player-label",
  );
  if (labels.length < 2) return;
  if (theme !== "code_vibes") return;
  let opposite: PlayerColor = playerChoice === "Blue" ? "Orange" : "Blue";
  labels[0].textContent = playerChoice;
  labels[0].classList.add(
    "game__player-label--visible",
    `game__player-label--${playerChoice.toLowerCase()}`,
  );
  labels[1].textContent = opposite;
  labels[1].classList.add(
    "game__player-label--visible",
    `game__player-label--${opposite.toLowerCase()}`,
  );
}

function setPlayerScoreColors(playerChoice: PlayerColor): void {
  let scores = document.querySelectorAll<HTMLParagraphElement>(
    ".game__player-score",
  );
  if (scores.length < 2) return;
  let opposite: PlayerColor = playerChoice === "Blue" ? "Orange" : "Blue";
  scores[0].classList.add(`game__player-score--${playerChoice.toLowerCase()}`);
  scores[1].classList.add(`game__player-score--${opposite.toLowerCase()}`);
}

function goToWinScreen(): void {
  let screen = document.querySelector<HTMLDivElement>(".end-screen");
  if (!screen) return;

  setTimeout(() => {
    screen.classList.add("fade-out");
    setTimeout(() => {
      window.location.replace("./winScreen.html");
    }, 800);
  }, 2000);
}
