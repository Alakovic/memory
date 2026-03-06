export type ThemeId =
  | "code_vibes"
  | "da_projects_theme"
  | "foods_theme";

export type PlayerColor = "Blue" | "Orange";
export type BoardSize = "16 Cards" | "24 Cards" | "36 Cards";

export interface GameConfig {
  theme: ThemeId;
  playerChoice: PlayerColor;
  boardSize: BoardSize;
}

export type ThemeData = {
  back: string;
  faces: string[];
  players: {
    Blue: string;
    Orange: string;
  };
};

export interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameResult {
  winner: PlayerColor | "Draw";
  scores: {
    Blue: number;
    Orange: number;
  };
  theme: ThemeId;
  playerChoice: PlayerColor;
}
