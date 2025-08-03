import { createPencilBox } from "./pencilbox.js";
import { createTimer } from "./timer.js";
import { createTeacher } from "./teacher.js";
import { showCheatingGameOverScreen } from "./gameoverScreen.js";
import { createPaper } from "./paper.js";

export function createGameScene(k) {
  setLayers(
    [
      "background",
      "teacher",
      "desk",
      "pencilBox",
      "stickyNote",
      "iphone",
      "paper",
      "text",
    ],
    "background"
  );
  const pencilBox = createPencilBox();
  const timer = createTimer();
  const teacher = createTeacher(k);
  const paper = createPaper(pencilBox);

  // This rect object will be replace with user image
  loadSprite("background", "public/sprites/bg.png");
  const bg = add([
    sprite("background"),
    pos(0, 0),
    anchor("topleft"),
    layer("background"),
    fixed(),
    scale(width() / 1424, height() / 1424), // Adjust scale based on your background size
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

  // Disable the phone icon for now
  k.destroy(phone_icon);

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
    const close_icon = k.add([
      k.sprite("close"),
      k.pos(positionX, positionY),
      k.area(), // enables hover/click
      "close_icon",
    ]);
    closeWidth = close_icon.width;
    closeHeight = close_icon.height;
    close_icon.onClick(() => {
      if (phoneWindow) {
        k.destroy(phoneWindow);
        phoneWindow = null;
        iphoneState = false;
        k.destroy(inputText);
        inputText = null;
        currentInput = "";
        k.destroy(close_icon);
      }
    });
  }
  phone_icon.onClick(() => {
    // Check if teacher is watching (front face)
    debug.log("Teacher sprite:", teacher.sprite);
    if (teacher.sprite === "teacher_frontface") {
      // Teacher is watching, cheating detected!
      debug.log("Cheating detected! Teacher is watching!");
      showCheatingGameOverScreen();
      return;
    }

    if (!iphoneState) {
      phoneWindow = k.add([k.sprite("google"), k.pos(k.width() / 3, 0)]);
      google_width = phoneWindow.width;
      k.destroy(phoneWindow);
      currentInput = "";
      phoneWindow = k.add([
        k.sprite("google"),
        k.pos(k.width() / 2 - (google_width * 1.2) / 2, -120),
        k.scale(1.2),
      ]);
      currentInput = "";
      create_close_button(
        k.width() / 2 -
          (google_width * 1.2) / 2 +
          google_width * 1.2 -
          closeWidth,
        0
      );
      inputTextUpdate(
        k.width() / 2 - (google_width * 1.2) / 2 + 20,
        k.height() / 2 + 20
      );
    }
    iphoneState = !iphoneState;
  });
}
