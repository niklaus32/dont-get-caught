export function createTimer() {
  let timeLeft = 60;
  let timerText;

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
    timeLeft -= dt();

    if (timeLeft <= 0) {
      timeLeft = 0;
      // gameover logic
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
