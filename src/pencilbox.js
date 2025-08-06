import { createNotes } from "./secretNotes.js";
import { showCheatingGameOverScreen } from "./gameoverScreen.js";

export function createPencilBox(teacher = null) {
    loadSprite("pencilBox", "sprites/pencilcase.png");
    loadSound("zipperOpen", "sounds/zipperOpen.mp3");
    loadSound("zipperClose", "sounds/zipperClose.mp3");
    loadSound("caught", "sounds/notice.mp3");
    
  const pencilBoxSize = 0.6;
  const pencilBox = add([
    sprite("pencilBox"),
    pos(256, 474),
    scale(pencilBoxSize),
    anchor("center"),
    area(), // enables hover/click
    "pencilBox",
    layer("pencilBox"),
  ]);

  pencilBox.onHover(() => {
    if (!pencilBox.isEnlarged) {
      pencilBox.scale = vec2(pencilBoxSize + 0.1);
      pencilBox.color = rgb(255, 220, 220);
      setCursor("pointer");
    }
  });
  pencilBox.onHoverEnd(() => {
    if (!pencilBox.isEnlarged) {
      pencilBox.scale = vec2(pencilBoxSize);
      pencilBox.color = rgb(255, 255, 255);
      pencilBox.isEnlarged = false;
      setCursor("default");
    }
  });

  // Enlarge and show writing on click
  pencilBox.onClick(() => {
    // Check if teacher is watching (front face)
    debug.log("PencilBox clicked! Teacher:", teacher);
    debug.log("Teacher sprite:", teacher ? teacher.sprite : "null");
    if (teacher && teacher.sprite === "teacher_front") {
      // Teacher is watching, cheating detected!
      play("caught");
      debug.log("Cheating detected! Teacher is watching!");
      showCheatingGameOverScreen();
      return;
    }
    if (!pencilBox.isEnlarged) {
        setCursor("default");
        play("zipperOpen", { volume: 1,});
      // Recreate secret notes each time pencil box is opened
      createNotes(pencilBox);
      
      tween(
        pencilBox.scale,
        vec2(2),
        0.5,
        (val) => {
          pencilBox.scale = val;
        },
        easings.easeOutBack
      );
      tween(
        pencilBox.pos,
        center(),
        0.5,
        (val) => {
          pencilBox.pos = val;
        },
        easings.easeOutBack
      ).then(() => {
        pencilBox.isEnlarged = true;
        pencilBox.tag("openedPencilBox");
      });
    }
  });
  //close pencilbox
  onKeyPress("escape", () => {
    if (pencilBox.isEnlarged) {
        setCursor("default");
        play("zipperClose", { volum: 1});
      // Clear all secret notes
      get("stickyNote").forEach(note => {
        if (note.exists) {
          destroy(note);
        }
      });
      // Clear all note text
      get("noteText").forEach(text => {
        if (text.exists) {
          destroy(text);
        }
      });
      
      // Tween both scale and position back to original
      tween(
        pencilBox.scale,
        vec2(pencilBoxSize),
        0.3,
        (val) => {
          pencilBox.scale = val;
        },
        easings.easeInOutSine
      );

      tween(
        pencilBox.pos,
        pencilBox.originalPos || vec2(240, 500),
        0.3,
        (val) => {
          pencilBox.pos = val;
        },
        easings.easeInOutSine
      ).then(() => {
        pencilBox.isEnlarged = false;
      });
    }
  });
  
  loadBitmapFont("unscii", "/examples/fonts/unscii_8x8.png", 8, 8);
  const exitText = add([
    text("Press ESC to exit", {
      font: "unscii",
      size: 15,
    }),
    pos(20, 20),
    color(rgb(255, 255, 255)),
    layer(),
    "exitText",
  ]);
  exitText.opacity = 0;
  onUpdate("openedPencilBox", () => {
    exitText.opacity = pencilBox.isEnlarged ? 1 : 0;
  });
  return pencilBox;
}
