import kaplay from "kaplay";


const k = kaplay({
  width: 900, // Game canvas width
  height: 900, // Game canvas height
  background: "#5ba675", // Background color
  font: "happy", // Default font
  
  // Game settings
  scale: 1, // Initial scale factor
  pixelDensity: 1, // Pixel density for high DPI displays
  crisp: true, // Crisp pixel art rendering
  canvas: undefined, // Use existing canvas or create new one
  root: document.body, // Where to append the canvas

  // Input settings

  // Debug settings
  debug: false, // Enable debug mode
  debugKey: "f1", // Key to toggle debug overlay
  burp: true, // Enable burp mode (fun sound effects)

  // Audio settings
  volume: 0.7, // Master volume (0.0 to 1.0)

  // Performance settings
  maxFPS: 60, // Maximum frames per second
});

setVolume(1);
// Load the default font
k.loadBitmapFont("happy", "/examples/fonts/happy_28x36.png", 28, 36);

// Debug information
if (k.debug.inspect) {
  k.debug.log("Game initialized successfully!");
  k.debug.log(`Canvas size: ${k.width()}x${k.height()}`);
}

// Manage resources by scenes
import { createWelcomeScene } from "./welcomScene.js";
import { createGameScene } from "./gameScene.js";
import {
  showGameOverScreen,
  showCheatingGameOverScreen,
} from "./gameoverScreen.js";
import { createPaper } from "./paper.js";

scene("welcome", () => createWelcomeScene(k));
scene("game", () => createGameScene(k));
scene("gameover", (scoreData) => showGameOverScreen(scoreData));
scene("paper", () => createPaper(k));

function start() {
  // Start the welcome scene
  go("welcome");
}
start();
