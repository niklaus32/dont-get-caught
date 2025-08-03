export function showGameOverScreen(scoreData) {
  // Handle both old parameter style and new scoreData object
  const score = scoreData?.percentage || scoreData || 0;
  const passed = scoreData?.passed || false;
  const correctCount = scoreData?.correctCount || 0;
  const totalQuestions = scoreData?.totalQuestions || 10;
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
    pos(width() / 2, height() / 2 - 80),
    color(rgb(255, 255, 255)),
    layer("ui"),
    anchor("center"),
  ]);

  // Detailed score breakdown
  const detailText = add([
    text(`Correct Answers: ${correctCount}/${totalQuestions}`, {
      font: "unscii",
      size: 14,
    }),
    pos(width() / 2, height() / 2 - 50),
    color(rgb(200, 200, 200)),
    layer("ui"),
    anchor("center"),
  ]);

  // Pass/Fail message
  const messageText = add([
    text(
      passed ? "Congratulations! You passed the exam!" : "Exam failed! You need 80% to pass.",
      {
        font: "unscii",
        size: 18,
      }
    ),
    pos(width() / 2, height() / 2 - 10),
    color(passed ? rgb(0, 255, 0) : rgb(255, 0, 0)),
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
