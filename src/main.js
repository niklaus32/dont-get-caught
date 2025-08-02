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
add([
  sprite("phone"),
  pos(width() / 2, height() / 2),
  scale(0.1), // scale to 50%
]);
const phoneTrigger = add([text("Press i")]);
let iphoneState = false;
let phoneWindow;
const WHITE = rgb(255, 255, 255);
onKeyPress("i", () => {
  if (!iphoneState) {
    phoneWindow = add([pos(0, 0), rect(width(), height()), color(WHITE)]);
  } else {
    if (phoneWindow) {
      destroy(phoneWindow);
      phoneWindow = null;
    }
  }
  iphoneState = !iphoneState;
});
// phoneTrigger.onUpdate(() => {
//   if (phoneTrigger.text == "i") {
//     if (!iphoneState) {
//       showPhoneWindow();
//       iphoneState = !iphoneState;
//     } else {
//       destoryPhoneWindow();
//       iphoneState = !iphoneState;
//     }
//   }
// });
// const showPhoneWindow = () => {
//   add([
//     pos(width() - 600, 0),
//     rect(600, 300),
//     color(WHITE),
//     "shape",
//     {
//       getShape() {
//         return new Rect(this.pos, this.widht, this.height);
//       },
//     },
//   ]);
// };


// Load pencilbox sprite
loadSprite("pencilBox", "./public/examples/sprites/grass.png");

// Add pencilbox with interactivity
const pencilBox = add([
  sprite("pencilBox"),
  pos(width()/2, height() / 2),
  scale(1),
  area(), // enables hover/click
  "pencilBox",
]);

pencilBox.onHover(() => {
    debug.log("pencilbox hovered");
    pencilBox.scale = vec2(1.5);        // Scale up
    pencilBox.color = rgb(255, 220, 220); // Slightly tinted
});
pencilBox.onHoverEnd(() => {
    debug.log("pencilbox unhovered");
    pencilBox.scale = vec2(1);          // Reset scale
    pencilBox.color = rgb(255, 255, 255);
    pencilBox.showWriting = false;
    pencilBox.isEnlarged = false;
});

// Enlarge and show writing on click
pencilBox.onClick(() => {
  if (!pencilBox.isEnlarged) {
    // Animate scale up with a tween
    tween(
      pencilBox.scale,
      vec2(5),
      0.5, // duration in seconds
      (val) => {
        pencilBox.scale = val;
      },
      easings.easeOutBack // smooth, bouncy effect
    ).then(() => {
      pencilBox.isEnlarged = true;
      pencilBox.showWriting = true;
    });
  } else {
    // Animate scale down
    tween(
      pencilBox.scale,
      vec2(1),
      0.3,
      (val) => {
        pencilBox.scale = val;
      },
      easings.easeInOutSine
    ).then(() => {
      pencilBox.isEnlarged = false;
      pencilBox.showWriting = false;
    });
  }
});

// Display writing inside when enlarged
let pencilboxWriting = null;
pencilBox.onUpdate(() => {
  if (pencilBox.showWriting) {
    if (!pencilboxWriting) {
      pencilboxWriting = add([
        text("My secret notes!", { size: 32 }),
        pos(pencilBox.pos.x + pencilBox.width / 4, pencilBox.pos.y + pencilBox.height / 2),
        color(BLACK),
        z(10),
        "pencilboxWriting",
      ]);
    } else {
      // Update position if pencilBox moves or scales
      pencilboxWriting.pos = vec2(
        pencilBox.pos.x + pencilBox.width * pencilBox.scale.x / 4,
        pencilBox.pos.y + pencilBox.height * pencilBox.scale.y / 2
      );
    }
  } else {
    if (pencilboxWriting) {
      destroy(pencilboxWriting);
      pencilboxWriting = null;
    }
  }
});