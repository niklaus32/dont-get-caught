import { createNotes } from "./secretNotes.js";

export function createPencilBox() {
    loadSprite("pencilBox", "sprites/pencilcase.png");

    const pencilBoxSize = 0.4;
    const pencilBox = add([
    sprite("pencilBox"),
    pos(width()/2, height() / 2),
    scale(pencilBoxSize),
    anchor("center"),
    area(), // enables hover/click
    "pencilBox",
    ]);
    pencilBox.onHover(() => {
    if (!pencilBox.isEnlarged) {
        debug.log("pencilbox hovered");
        pencilBox.scale = vec2(pencilBoxSize + 0.3);        
        pencilBox.color = rgb(255, 220, 220); 
    }
    });
    pencilBox.onHoverEnd(() => {
    if (!pencilBox.isEnlarged) {
        debug.log("pencilbox unhovered");
        pencilBox.scale = vec2(pencilBoxSize);          
        pencilBox.color = rgb(255, 255, 255);
        pencilBox.showWriting = false;
        pencilBox.isEnlarged = false;
    }
    });

    // Enlarge and show writing on click
    pencilBox.onClick(() => {
    if (!pencilBox.isEnlarged) {
        tween(
        pencilBox.scale,
        vec2(3),
        0.5, 
        (val) => {
            pencilBox.scale = val;
        },
        easings.easeOutBack 
        ).then(() => {
        pencilBox.isEnlarged = true;
        pencilBox.showWriting = true;
        pencilBox.tag("openedPencilBox");
        });
    } 
    });
    //close pencilbox
    onKeyPress("escape", () => {
    if (pencilBox.isEnlarged) {
        tween(
        pencilBox.scale,
        vec2(pencilBoxSize),
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
    const secretNotes = createNotes(pencilBox);
  return pencilBox;
}



