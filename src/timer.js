import { showGameOverScreen } from "./gameoverScreen.js";

export function createTimer() {
  let timeLeft = 60;
  let timerText;
  let gameEnded = false;
  let score = 0;

  loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

  timerText = add([
    text(`Countdown: ${timeLeft}s`, {
      font: "unscii",
      size: 15,
    }),
    pos(width() - 250, 20),
    color(rgb(255, 255, 255)),
    layer(),
    "timerText",
  ]);

  onUpdate(() => {
    if (gameEnded) return;

    timeLeft -= dt();

    if (timeLeft <= 0) {
      timeLeft = 0;
      gameEnded = true;

      // Calculate score based on time remaining and other factors
      // For now, using a simple calculation - you can modify this
      score = Math.floor(Math.random() * 100); // Placeholder score calculation

      // Show game over screen
      showGameOverScreen(score);
    }

    timerText.text = `Countdown: ${Math.ceil(timeLeft)}s`;

    if (timeLeft <= 10) {
      timerText.color = rgb(255, 0, 0);
    } else {
      timerText.color = rgb(255, 255, 255);
    }
  });

  return timerText;
}
