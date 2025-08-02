import kaplay from "kaplay";

const k = kaplay({
  background: "#5ba675",
  font: "happy",
});


// Manage resources by scenes
import { createWelcomeScene } from "./welcomScene.js";
import { createGameScene } from "./gameScene.js";
import { createPaper } from "./paper.js";
import { showGameOverScreen } from "./gameoverScreen.js";

scene("welcome", () => createWelcomeScene(k));
scene("game", () => createGameScene(k));
scene("gameover", () => showGameOverScreen(k));
scene("paper", () => createPaper(k));

function start() {
  // Start the welcome scene
  go("welcome");
}
start();