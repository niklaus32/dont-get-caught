import kaplay from "kaplay";
kaplay({
  background: "#5ba675",
});

debug.log("Hello from game!");

// This rect object will be replace with user image
add([
  pos(width() / 2 - 300, height() - 400),
  rect(600, 400), //length is 600, width is 200
  color(BLUE),
  "shape",
  {
    getShape() {
      return new Rect(this.pos, this.widht, this.height);
    },
  },
]);

// this rect object will be replace with teacher image
add([
  pos(width() / 2 - 300, 0),
  rect(600, 300),
  color(RED),
  "shape",
  {
    getShape() {
      return new Rect(this.pos, this.widht, this.height);
    },
  },
]);

// add iphone
loadSprite("phone", "../public/sprites/iphone.png");
loadSprite("google", "../public/sprites/google.png");
loadSprite("close", "../public/sprites/close.png");
let googleText;
let iphoneState = false;
let phoneWindow;
let closeWidth = 0;
let closeHeight = 0;
let google_width = 0;
let currentInput = "";
let finalText = "";
let inputText;
const phone_icon = add([
  sprite("phone"),
  pos(width() / 2, height() / 2),
  scale(0.1), // scale to 50%
  area(), // enables hover/click
  "phone_icon",
]);

function inputTextUpdate(w, h) {
  // destroy old
  if (inputText) {
    destroy(inputText);
  }
  currentInput = "";
  // re-create
  inputText = add([
    text("", {
      width: google_width + 100, // max pixel width
      wrap: "none", // no wrapping
    }),
    pos(w, h),
    color(rgb(0, 0, 0)),
  ]);
}

// **Register these only once** (at the top, after kaplay() etc):
let fullText = "";
const MAX_CHARS = 30;
onCharInput((ch) => {
  if (!iphoneState) return;
  // append to the real buffer
  fullText += ch;
  // take last MAX_CHARS for display
  let visible = fullText.slice(-MAX_CHARS);
  inputText.text = visible;
  finalText = fullText; // if you need the full string later
  debug.log("Current input:", inputText.text);
  debug.log("final input:", finalText);
});

onKeyPress("backspace", () => {
  if (!iphoneState) return;
  fullText = fullText.slice(0, -1);
  let visible = fullText.slice(-MAX_CHARS);
  inputText.text = visible;
  finalText = fullText;
});

function create_close_button(positionX, positionY) {
  debug.log(positionX, positionY);
  const close_icon = add([
    sprite("close"),
    pos(positionX, positionY),
    area(), // enables hover/click
    "close_icon",
  ]);
  closeWidth = close_icon.width;
  closeHeight = close_icon.height;
  close_icon.onClick(() => {
    if (phoneWindow) {
      destroy(phoneWindow);
      phoneWindow = null;
      iphoneState = false;
      destroy(inputText);
      inputText = null;
      currentInput = "";
      destroy(close_icon);
    }
  });
}
phone_icon.onClick(() => {
  if (!iphoneState) {
    phoneWindow = add([sprite("google"), pos(width() / 3, 0)]);
    google_width = phoneWindow.width;
    destroy(phoneWindow);
    currentInput = "";
    phoneWindow = add([
      sprite("google"),
      pos(width() / 2 - (google_width * 1.2) / 2, -120),
      scale(1.2),
    ]);
    currentInput = "";
    create_close_button(
      width() / 2 - (google_width * 1.2) / 2 + google_width * 1.2 - closeWidth,
      0
    );
    inputTextUpdate(
      width() / 2 - (google_width * 1.2) / 2 + 20,
      height() / 2 + 20
    );
  }
  iphoneState = !iphoneState;
});



import { createPencilBox } from "./pencilbox.js";
createPencilBox();