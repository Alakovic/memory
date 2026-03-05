import { loadGameResult } from "../services/game-config.services";
import { ThemeId } from "../types/game.types";
import confetti from "canvas-confetti";
import { themes } from "./game.themes";

export function initWinScreen(): void {
  let result = loadGameResult();
  let winnerColor = getWinnerColor(result.winner);
  setBackgroundColor(result.theme);
  setText(result.winner);
  setTitle(result.winner);
  setWinnerIcon(result.theme, result.winner);
  setHomeButton(result.theme);
  setButtonText(result.theme);
  loadWinScreen(winnerColor);
}

function loadWinScreen(winnerColor: string): void {
  let screen = document.querySelector<HTMLDivElement>(".win-screen");
  if (!screen) return;
  screen.classList.add("fade-in");
  setTimeout(() => {
    launchConfetti(winnerColor);
  }, 600);
}

function setBackgroundColor(theme: ThemeId): void {
  let setColor = document.querySelector<HTMLDivElement>(".win-screen");
  if (!setColor) return;
  setColor.classList.add(`win-screen--${theme}`);
}

function launchConfetti(color: string): void {
  let duration = 4000;
  let end = Date.now() + duration;
  frame(end, color);
}

function frame(end: number, color: string): void {
  confetti({
    particleCount: 3 + Math.random() * 3,
    angle: 60,
    spread: 55 + Math.random() * 20,
    origin: { x: 0 },
    colors: [color],
  });
  confetti({
    particleCount: 3 + Math.random() * 3,
    angle: 120,
    spread: 55 + Math.random() * 20,
    origin: { x: 1 },
    colors: [color],
  });
  if (Date.now() < end) {
    requestAnimationFrame(() => frame(end, color));
  }
}

function getWinnerColor(winner: string): string {
  if (winner === "Blue") return "#3b82f6";
  if (winner === "Orange") return "#f97316";
  return "#ffffff";
}

function setText(winner: string): void {
  let text = document.querySelector<HTMLParagraphElement>(
    ".win-screen__game-winner-text",
  );
  if (!text) return;
  if (winner === "Draw") {
    text.textContent = "It's a Draw!";
  } else {
    text.textContent = "The winner is";
  }
}

function setTitle(winner: string): void {
  let title = document.querySelector<HTMLHeadingElement>(
    ".win-screen__game-winner-title",
  );
  if (!title) return;
  let color = getWinnerColor(winner);
  if (winner === "Draw") {
    title.textContent = "Congratulations to the both of you!";
  } else {
    title.textContent = `${winner} Player!`;
  }
  title.style.color = color;
}

function setWinnerIcon(theme: ThemeId, winner: string): void {
  let icon = document.querySelector<HTMLImageElement>(".win-screen__img");
  if (!icon) return;
  let themeData = themes[theme];
  if (winner === "Draw") {
    icon.src = "./assets/img/handshake.svg";
  } else {
    icon.src = themeData.players[winner as "Blue" | "Orange"];
  }
}

function setHomeButton(theme: ThemeId): void {
  let button = document.querySelector<HTMLButtonElement>(".game__exit");
  if (!button) return;
  exitButtonTheme(button, theme);
}

function exitButtonTheme(button: HTMLButtonElement, theme: ThemeId): void {
  if (theme === "code_vibes") {
    button.classList.add("game__exit--code_vibes");
  } else if (theme === "gaming_theme") {
    button.classList.add("game__exit--gaming_theme");
  } else if (theme === "foods_theme") {
    button.classList.add("game__exit--foods_theme");
  } else if (theme === "da_projects_theme") {
    button.classList.add("game__exit--da_projects_theme");
  }
}

function setButtonText(theme: ThemeId): void {
  let button = document.querySelector<HTMLButtonElement>(".game__exit");
  if (!button) return;
  let text = button.querySelector<HTMLParagraphElement>(".game__exit-text");
  if (!text) return;
  if (theme === "code_vibes") {
    text.textContent = "Back to start";
  } else {
    text.textContent = "Home";
  }
}
