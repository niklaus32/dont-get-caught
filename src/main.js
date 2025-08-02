import kaplay from "kaplay";


const k = kaplay({
  background: "#5ba675",
  font: "happy",
});

loadBitmapFont("happy", "/examples/fonts/happy_28x36.png", 28, 36);

// Manage resources by scenes
import { createWelcomeScene } from "./welcomScene.js";
import { createGameScene } from "./gameScene.js";
import { showGameOverScreen } from "./gameoverScreen.js";

scene("welcome", () => createWelcomeScene(k));
scene("game", () => createGameScene(k));
scene("gameover", () => showGameOverScreen(k));

function start() {
  // Start the welcome scene
  go("welcome");
}
start();