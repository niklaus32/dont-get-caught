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
loadSprite("pencilBox", "sprites/bean.png");

// Add pencilbox with interactivity
const pencilBox = add([
  sprite("pencilBox"),
  pos(250, 400),
  scale(1),
  area(), // enables hover/click
  "pencilBox",
]);

pencilBox.onHover(() => {
    debug.log("pencilbox hovered");
    pencilBox.scale = vec2(1.1);        // Scale up
    pencilBox.color = rgb(255, 220, 220); // Slightly tinted
});
pencilBox.onHoverEnd(() => {
    debug.log("pencilbox unhovered");
    pencilBox.scale = vec2(1);          // Reset scale
    pencilBox.color = rgb(255, 255, 255);
});