import { Card, GameConfig, PlayerColor } from "../types/game.types";
import { loadGameConfig } from "../services/game-config.services";
import { Header } from "./header";
import { themes } from "./game.themes";

export function initGame() {
  const config = loadGameConfig();
  new Game(config);
}

class Game {
  currentPlayer: PlayerColor;
  cards: Card[] = [];
  flippedCards: Card[] = [];
  scores: Record<PlayerColor, number> = {
    Blue: 0,
    Orange: 0,
  };
  isProcessing: boolean = false;
  header: Header;
  matchSound: HTMLAudioElement;

  constructor(private config: GameConfig) {
    this.currentPlayer = this.config.playerChoice;
    this.setBackgroundColor();
    this.header = new Header(this.config);
    this.header.updateCurrentPlayer(this.currentPlayer);
    this.createGame();
    this.matchSound = new Audio(this.getMatchSound());
  }

  getMatchSound(): string {
    switch (this.config.theme) {
      case "code_vibes":
        return "./assets/sounds/digital-beep.wav";
      case "gaming_theme":
        return "./assets/sounds/gaming.wav";
      case "foods_theme":
        return "./assets/sounds/doorbell.wav";
      case "da_projects_theme":
        return "./assets/sounds/correct.wav";
      default:
        return "";
    }
  }

  setBackgroundColor(): void {
    let setColor = document.querySelector<HTMLDivElement>(".game");
    if (!setColor) return;
    setColor.classList.add(`game--${this.config.theme}`);
  }

  getNumberOfPairs(): number {
    switch (this.config.boardSize) {
      case "16 Cards":
        return 8;
      case "24 Cards":
        return 12;
      case "36 Cards":
        return 18;
    }
  }

  shuffleCards<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  doubleCards(images: string[]): Card[] {
    let id = 0;
    let result: Card[] = [];
    images.forEach((image) => {
      result.push({ id: id++, image, isFlipped: false, isMatched: false });
      result.push({ id: id++, image, isFlipped: false, isMatched: false });
    });
    return result;
  }

  createGame(): void {
    this.generateCards();
    this.renderBoard();
    this.setGridLayout();
    this.enableCardFlip();
  }

  generateCards(): void {
    let themeData = themes[this.config.theme];
    let faces = this.shuffleCards([...themeData.faces]);
    let pairsCount = this.getNumberOfPairs();
    let selectedCards = faces.slice(0, pairsCount);
    let doubledCards = this.doubleCards(selectedCards);
    this.cards = this.shuffleCards(doubledCards);
  }

  getBackImage(): string {
    return themes[this.config.theme].back;
  }

  renderBoard(): void {
    let board = document.querySelector<HTMLDivElement>(".game__board");
    if (!board) return;
    board.innerHTML = "";
    let isSmall = this.config.boardSize === "36 Cards";
    this.cards.forEach((card) => {
      board.innerHTML += this.cardTemplate(card, isSmall);
    });
  }

  cardTemplate(card: Card, isSmall: boolean): string {
    let cardClass = isSmall ? "game__card game__card--small" : "game__card";

    return `
        <div class="${cardClass}" data-id="${card.id}">
          <div class="game__card-inner">
            <div class="game__card-front"> 
              <img class="game__card-image" src="${this.getBackImage()}" alt="Card Image" />
            </div>
            <div class="game__card-back">
              <img class="game__card-image" src="${card.image}" alt="Card Image" />
            </div>
          </div>
        </div>
      `;
  }

  enableCardFlip(): void {
    let cards = document.querySelectorAll<HTMLDivElement>(".game__card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        let cardId = parseInt(card.getAttribute("data-id") || "-1");
        this.flipCard(cardId);
      });
    });
  }

  flipCard(cardId: number): void {
    if (this.isProcessing) return;
    let card = this.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    card.isFlipped = true;
    let cardElement = document.querySelector<HTMLDivElement>(
      `.game__card[data-id="${cardId}"]`,
    );
    if (cardElement) {
      cardElement.classList.add("is-flipped");
    }
    this.flippedCards.push(card);
    if (this.flippedCards.length === 2) {
      this.isProcessing = true;
      this.checkForMatch();
    }
  }

  checkForMatch(): void {
    const [firstCard, secondCard] = this.flippedCards;
    if (this.isMatch(firstCard, secondCard)) {
      this.handleMatch(firstCard, secondCard);
    } else {
      this.mismatch(firstCard, secondCard);
    }
  }

  isMatch(first: Card, second: Card): boolean {
    return first.image === second.image;
  }

  handleMatch(first: Card, second: Card): void {
    this.playMatchSound();
    first.isMatched = true;
    second.isMatched = true;
    this.animateMatch(first.id);
    this.animateMatch(second.id);
    this.markMatched(first.id);
    this.markMatched(second.id);
    this.increaseScore();
    this.resetFlippedCards();
    this.checkGameEnd();
  }

  playMatchSound(): void {
    this.matchSound.currentTime = 0;
    this.matchSound.play();
  }

  animateMatch(cardId: number): void {
    const cardElement = document.querySelector<HTMLDivElement>(
      `.game__card[data-id="${cardId}"]`,
    );

    if (!cardElement) return;

    cardElement.classList.add("game__card--matched");

    setTimeout(() => {
      cardElement.classList.remove("game__card--matched");
    }, 300);
  }

  increaseScore(): void {
    this.scores[this.currentPlayer]++;
    this.header.updateScore(
      this.currentPlayer,
      this.scores[this.currentPlayer],
    );
  }

  mismatch(first: Card, second: Card): void {
    setTimeout(() => {
      this.unflipCard(first);
      this.unflipCard(second);
      this.resetFlippedCards();
      this.switchPlayer();
    }, 500);
  }

  unflipCard(card: Card): void {
    card.isFlipped = false;
    let cardElement = document.querySelector<HTMLDivElement>(
      `.game__card[data-id="${card.id}"]`,
    );
    if (cardElement) {
      cardElement.classList.remove("is-flipped");
    }
  }

  resetFlippedCards(): void {
    this.flippedCards = [];
    this.isProcessing = false;
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === "Blue" ? "Orange" : "Blue";
    this.header.updateCurrentPlayer(this.currentPlayer);
  }

  getGridLayout(): string {
    switch (this.config.boardSize) {
      case "16 Cards":
        return "repeat(4, 1fr)";
      case "24 Cards":
        return "repeat(6, 1fr)";
      case "36 Cards":
        return "repeat(6, 1fr)";
      default:
        return "repeat(4, 1fr)";
    }
  }

  setGridLayout(): void {
    let board = document.querySelector<HTMLDivElement>(".game__board");
    if (!board) return;
    board.style.gridTemplateColumns = this.getGridLayout();
  }

  markMatched(cardId: number): void {
    let element = document.querySelector<HTMLDivElement>(
      `.game__card[data-id="${cardId}"]`,
    );

    if (element) {
      element.classList.add(`game__card--${this.currentPlayer.toLowerCase()}`);
    }
  }

  checkGameEnd(): void {
    let totalPairs = this.getNumberOfPairs();
    let totalScore = this.scores.Blue + this.scores.Orange;
    if (totalScore === totalPairs) {
     this.endGame();
    } 
  }

  endGame(): void {
    let winner: PlayerColor | "Draw";
    if (this.scores.Blue > this.scores.Orange) {
      winner = "Blue";
    } else if (this.scores.Orange > this.scores.Blue) {
      winner = "Orange";
    } else {
      winner = "Draw";
    } 
    localStorage.setItem("gameResult", JSON.stringify({ winner, scores: this.scores }));
    window.location.href = "./endScreen.html";
    }
}
