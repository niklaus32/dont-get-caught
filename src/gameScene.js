import { createPencilBox } from "./pencilbox.js";
import { createTimer } from "./timer.js";
import { createTeacher } from "./teacher.js";

export function createGameScene(k) {
  setLayers(["teacher", "desk", "pencilBox", "stickyNote", "iphone"], "desk");
  const pencilBox = createPencilBox();
  const timer = createTimer();
  const teacher = createTeacher(k);
  // This rect object will be replace with user image
  k.add([
    k.pos(k.width() / 2 - 300, k.height() - 400),
    k.rect(600, 400), //length is 600, width is 400
    k.color(k.BLUE),
    "shape",
    {
      getShape() {
        return new k.Rect(this.pos, this.width, this.height);
      },
    },
    layer("desk"),
  ]);


  // add iphone
  k.loadSprite("phone", "../public/sprites/iphone.png");
  k.loadSprite("google", "../public/sprites/google.png");
  k.loadSprite("close", "../public/sprites/close.png");
  let googleText;
  let iphoneState = false;
  let phoneWindow;
  let closeWidth = 0;
  let closeHeight = 0;
  let google_width = 0;
  let currentInput = "";
  let finalText = "";
  let inputText;
  const phone_icon = k.add([
    k.sprite("phone"),
    k.pos(k.width() / 2, k.height() / 2),
    k.scale(0.1), // scale to 50%
    k.area(), // enables hover/click
    layer("iphone"),
    "phone_icon",
  ]);

  function inputTextUpdate(w, h) {
    // destroy old
    if (inputText) {
      k.destroy(inputText);
    }
    currentInput = "";
    // re-create
    inputText = k.add([
      k.text("", {
        width: google_width + 100, // max pixel width
        wrap: "none", // no wrapping
      }),
      k.pos(w, h),
      k.color(rgb(0, 0, 0)),
    ]);
  }

  // **Register these only once** (at the top, after kaplay() etc):
  let fullText = "";
  const MAX_CHARS = 30;
  k.onCharInput((ch) => {
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

  k.onKeyPress("backspace", () => {
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
        width() / 2 -
          (google_width * 1.2) / 2 +
          google_width * 1.2 -
          closeWidth,
        0
      );
      inputTextUpdate(
        width() / 2 - (google_width * 1.2) / 2 + 20,
        height() / 2 + 20
      );
    }
    iphoneState = !iphoneState;
  });

}
