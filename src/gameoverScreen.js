export function showGameOverScreen(score) {
  // Load font
  loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

  // Create semi-transparent overlay
  const overlay = add([
    rect(width(), height()),
    pos(0, 0),
    color(rgb(0, 0, 0)),
    opacity(0.7),
    layer("ui"),
  ]);

  // Score display
  const scoreText = add([
    text(`Final Score: ${score}`, {
      font: "unscii",
      size: 20,
    }),
    pos(width() / 2, height() / 2 - 60),
    color(rgb(255, 255, 255)),
    layer("ui"),
    anchor("center"),
  ]);

  // Pass/Fail message
  const messageText = add([
    text(
      score >= 80 ? "Congratulations! You passed the exam!" : "Exam failed!",
      {
        font: "unscii",
        size: 18,
      }
    ),
    pos(width() / 2, height() / 2 - 20),
    color(score >= 80 ? rgb(0, 255, 0) : rgb(255, 0, 0)),
    layer("ui"),
    anchor("center"),
  ]);

  // Restart button
  const restartButton = add([
    text("Play Again", {
      font: "unscii",
      size: 16,
    }),
    pos(width() / 2, height() / 2 + 40),
    color(rgb(255, 255, 255)),
    layer("ui"),
    anchor("center"),
    area(),
  ]);

  // Button hover effect
  restartButton.onHover(() => {
    restartButton.color = rgb(255, 255, 0);
  });

  restartButton.onHoverEnd(() => {
    restartButton.color = rgb(255, 255, 255);
  });

  // Restart game on click
  restartButton.onClick(() => {
    // Restart the game by reloading the page
    location.reload();
  });
}
