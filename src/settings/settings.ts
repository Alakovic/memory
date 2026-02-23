type ThemeId =
  | "code_vibes"
  | "gaming_theme"
  | "da_projects_theme"
  | "foods_theme";

const themeImages: Record<ThemeId, string> = {
  code_vibes: "./assets/img/codeTheme.svg",
  gaming_theme: "./assets/img/gamingTheme.svg",
  da_projects_theme: "./assets/img/daProjects.svg",
  foods_theme: "./assets/img/foodTheme.svg",
};

initSettings();

function initSettings() {
  getTheme();
  getPlayerChoice();
  getBoardSize();
  updateButton();
}

function getTheme() {
  let img = document.querySelector<HTMLImageElement>(".settings__theme");
  let text = document.querySelector<HTMLParagraphElement>(
    '[data-type="theme"]',
  );
  if (!img || !text) return;
  let radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="game_themes"]',
  );

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      img.src = themeImages[radio.id as ThemeId];
      text.textContent = radio.value;
       updateButton();
    });
  });
  setInitialTheme(img, text);
}

function setInitialTheme(img: HTMLImageElement, text: HTMLParagraphElement) {
  const initial = document.querySelector<HTMLInputElement>(
    'input[name="game_themes"]:checked',
  );

  if (initial) {
    img.src = themeImages[initial.id as ThemeId];
    text.textContent = initial.value;
  }
}

function getPlayerChoice() {
  let text = document.querySelector<HTMLParagraphElement>(
    '[data-type="player"]',
  );
  if (!text) return;

  let radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="player_choice"]',
  );
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      text.textContent = radio.value;
       updateButton();
    });
  });
}

function getBoardSize() {
  let text = document.querySelector<HTMLParagraphElement>(
    '[data-type="board"]',
  );
  if (!text) return;

  let radios = document.querySelectorAll<HTMLInputElement>(
    'input[name="board_size"]',
  );
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      text.textContent = radio.value;
       updateButton();
    });
  });
}

function updateButton() {
  const theme = document.querySelectorAll<HTMLInputElement>('input[name="player_choice"]:checked');
  const player = document.querySelectorAll<HTMLInputElement>('input[name="board_size"]:checked');
  const board = document.querySelector<HTMLButtonElement>('input[name="board_size"]:checked');
  const button = document.querySelector<HTMLButtonElement>(".button--start");
  
  if (!button) return;

  button.disabled = !(theme&&player&&board);
}
