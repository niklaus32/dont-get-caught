import { showGameOverScreen } from "./gameoverScreen.js";

export function createTimer(paperModule) {
  let timeLeft = 60;
  let timerText;
  let gameEnded = false;

  loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

  timerText = add([
    text(`Countdown: ${timeLeft}s`, {
      font: "unscii",
      size: 15,
    }),
    pos(width() - 250, 20),
    color(rgb(255, 255, 255)),
    layer("timer"),
    "timerText",
  ]);

  onUpdate(() => {
    if (gameEnded) return;

    timeLeft -= dt();

    if (timeLeft <= 0) {
      timeLeft = 0;
      gameEnded = true;

      // Calculate score from the paper module if available
      let finalScore;
      if (paperModule && paperModule.calculateScore) {
        finalScore = paperModule.calculateScore();
        showGameOverScreen(
          finalScore.percentage,
          finalScore.passed,
          finalScore.correctCount,
          finalScore.totalQuestions
        );
      } else {
        // Fallback to random score if paper module not available
        const randomScore = Math.floor(Math.random() * 100);
        showGameOverScreen(randomScore, randomScore >= 80, 0, 10);
      }
    }

    timerText.text = `Countdown: ${Math.ceil(timeLeft)}s`;

    if (timeLeft <= 10) {
      timerText.color = rgb(255, 0, 0);
    } else {
      timerText.color = rgb(255, 255, 255);
    }
  });

  return {
    timerText: timerText,
    endGame: () => {
      if (!gameEnded) {
        gameEnded = true;
        timeLeft = 0;
      }
    },
  };
}
