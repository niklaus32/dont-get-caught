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

// add user text response

const crew = add([
  text(""),
  textInput(true), // <- 20 chars at max
  pos(width() / 2 - 300, height() - 400),
  anchor("center"),
]);

crew.onUpdate(() => {
  if (crew.text !== "") {
    showPhone();
  }
});

let phoneBox;
const showPhone = () => {
  if (phoneBox) {
    destroy(phoneBox);
  }

  const padding = 20;
  const charWidth = 12; // rough estimate for monospaced font
  const charHeight = 24;

  const textLength = crew.text.length;

  const boxWidth = textLength * charWidth + padding * 2;
  const boxHeight = charHeight + padding * 2;

  phoneBox = add([
    pos(width() / 2 - 300, height() - 400),
    rect(boxWidth, boxHeight),
    color(YELLOW),
    anchor("center"),
    z(0), // behind text
  ]);

  crew.z = 1;
};


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
