export type ThemeId =
  | "code_vibes"
  | "gaming_theme"
  | "da_projects_theme"
  | "foods_theme";

export interface GameConfig {
  theme: ThemeId;
  playerChoice: string;
  boardSize: string;
}

export type ThemeData = {
  back: string;
  faces: string[];
};
