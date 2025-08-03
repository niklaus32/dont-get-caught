// Two functions added in src/gameoverScreen.js:
// showGameOverScreen(score)
// Call when: Timer ends OR player completes all questions early
// Parameter: score (number) - player's final score
// showCheatingGameOverScreen()
// Call when: Player is caught cheating

// Game over scenario 1: Timer ended or exam completed early
// Call this function when:
// - Timer reaches 0 (time's up)
// - Player completes all questions before timer ends (early submission)
export function showGameOverScreen(score) {
  // Load font
  loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

  // Load and play sound effect
  loadSound("win_sound", "public/examples/sounds/win.mp3");
  loadSound("lose_sound", "public/examples/sounds/lose.mp3");

  // Play appropriate sound based on score
  if (score >= 80) {
    play("win_sound");
  } else {
    play("lose_sound");
  }

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

// Game over scenario 2: Caught cheating
// Call this function when:
// - Player is caught cheating by teacher
// - Any other cheating detection scenario
export function showCheatingGameOverScreen() {
  // Load font
  loadBitmapFont("unscii", "public/examples/fonts/unscii_8x8.png", 8, 8);

  // Load and play failure sound effect
  loadSound("lose_sound", "public/examples/sounds/lose.mp3");
  play("lose_sound");

  // Create semi-transparent overlay
  const overlay = add([
    rect(width(), height()),
    pos(0, 0),
    color(rgb(0, 0, 0)),
    opacity(0.7),
    layer("ui"),
  ]);

  // Game over message
  const gameOverText = add([
    text("GAME OVER", {
      font: "unscii",
      size: 24,
    }),
    pos(width() / 2, height() / 2 - 60),
    color(rgb(255, 0, 0)),
    layer("ui"),
    anchor("center"),
  ]);

  // Cheating failure message
  const failureText = add([
    text("You were caught cheating!", {
      font: "unscii",
      size: 18,
    }),
    pos(width() / 2, height() / 2 - 20),
    color(rgb(255, 255, 255)),
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
