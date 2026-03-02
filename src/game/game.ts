import { Card, GameConfig } from "../types/game.types";
import { loadGameConfig } from "../services/game-config.services";
import { Header } from "./header";
import { themes } from "./game.themes";

export function initGame() {
  const config = loadGameConfig();
  new Game(config);
}

class Game {
  constructor(private config: GameConfig) {
    this.setBackgroundColor();
    new Header(this.config);
    this.createGame();
  }

  cards: Card[] = [];

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
    // Logic to create game cards based on the config
    this.generateCards();
    this.renderBoard();
    this.setGridLayout();
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
    // Logic to render the game board with the cards
    let board = document.querySelector<HTMLDivElement>(".game__board");
    if (!board) return;
    board.innerHTML = "";
    const self = this;
    this.cards.forEach((card) => {
      board.innerHTML += cardTemplete(card);
    });

    function cardTemplete(card: Card): string {
      let imageSrc = card.isFlipped ? card.image : self.getBackImage();

      return `
        <div class="game__card" data-id="${card.id}">
          <img class="game__card-image" src="${imageSrc}" alt="Card Image" />
        </div>
      `;
    }
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
}
