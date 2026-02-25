export type ThemeId =
  | "code_vibes"
  | "gaming_theme"
  | "da_projects_theme"
  | "foods_theme";

export type PlayerColor = "Blue" | "Orange";

export interface GameConfig {
  theme: ThemeId;
  playerChoice: PlayerColor;
  boardSize: string;
}

export type ThemeData = {
  back: string;
  faces: string[];
  players: {
    Blue: string;
    Orange: string;
  };
};
