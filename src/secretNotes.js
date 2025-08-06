export function createNotes(pencilBox) {
    loadSprite("stickyNote", "sprites/stickyNote.png");
    loadBitmapFont("unscii", "/examples/fonts/unscii_8x8.png", 8, 8);  
    //Dragging secret notes
    let curDraggin = null;
    function drag() {
        let offset = vec2(0);
        return {
            id: "drag",
            require: ["pos", "area"],
            pick() {
                curDraggin = this;
                offset = mousePos().sub(this.pos);
                this.trigger("drag");
            },
            update() {
                if (curDraggin === this) {
                    this.pos = mousePos().sub(offset);
                    this.trigger("dragUpdate");
                }
            },
            onDrag(action) {
                return this.on("drag", action);
            },
            onDragUpdate(action) {
                return this.on("dragUpdate", action);
            },
            onDragEnd(action) {
                return this.on("dragEnd", action);
            },
        };
    }
    onMousePress(() => {
        if (curDraggin) {
            return;
        }
        for (const obj of get("drag").reverse()) {
            if (obj.isHovering()) {
                obj.pick();
                break;
            }
        }
    });
    onMouseRelease(() => {
        if (curDraggin) {
            curDraggin.trigger("dragEnd");
            curDraggin = null;
        }
    });

    const secretNotes = [];
    const NOTE_SCALE = 0.2;   // Bigger notes to accommodate large text
    const NOTE_MARGIN = 30;   // Even smaller margin for maximum spread
    
    // Question-answer pairs for the sticky notes
    const questionAnswerPairs = [
        "@@@ a",    // Question 1
        "##$ b",    // Question 2  
        "OO* c",    // Question 3
        "@#O* d",   // Question 4
        "**@ e",    // Question 5
        "O#* f",    // Question 6
        "@O* g",    // Question 7
        "#*# h",    // Question 8
        "O@* i",    // Question 9
        "@*# j",    // Question 10
    ];
    
    for (let i = 0; i < 10; i++) {
        // Use the full pencil box area for better spreading
        const pw = pencilBox.width * pencilBox.scale.x;
        const ph = pencilBox.height * pencilBox.scale.y;
        
        // Create a wider grid (3 columns, 4 rows with some in 3rd row)
        const col = i % 3;
        const row = Math.floor(i / 3);
        
        // Calculate available space for each grid cell with more spacing
        const gridSpacingX = (pw - NOTE_MARGIN * 2) / 2.5;  // Wider spacing
        const gridSpacingY = (ph - NOTE_MARGIN * 2) / 3.5;  // Taller spacing
        
        // Base position for this grid cell
        const baseX = pencilBox.pos.x - pw / 2 + NOTE_MARGIN + col * gridSpacingX + gridSpacingX / 2;
        const baseY = pencilBox.pos.y - ph / 2 + NOTE_MARGIN + row * gridSpacingY + gridSpacingY / 2;
        
        // Add much larger random scatter for maximum distribution
        const scatterRange = 100;
        const x = baseX + rand(-scatterRange, scatterRange);
        const y = baseY + rand(-scatterRange, scatterRange);
        
        const note = add([
            sprite("stickyNote"),
            pos(x, y),
            area({ cursor: "pointer" }),
            scale(NOTE_SCALE),
            anchor("center"),
            stayInside(pencilBox),
            drag(),
            layer("stickyNote"),
            "stickyNote",
            {
                content: questionAnswerPairs[i] || "", // Store the question-answer content
                questionIndex: i
            }
        ]);
        
        // Add text on the sticky note if it has content
        if (questionAnswerPairs[i]) {
            const noteText = note.add([
                text(questionAnswerPairs[i], {
                    font: "unscii",
                    size: 120,  // Increased font size for better readability
                }),
                pos(0, 0),  // Relative position to parent (centered)
                anchor("center"),
                color(rgb(0, 0, 0)),
                layer("stickyNote"),
                "noteText"
            ]);
            
            // Store reference to the text in the note for easier management
            note.noteText = noteText;
        }
        
        note.opacity = 0;
        secretNotes.push(note);
        note.onDrag(() => {
            readd(note);
        });

        note.onDragUpdate(() => {
            setCursor("move");
        });
        
        note.onDragEnd(() => {
            setCursor("default");
        });
    }
    onUpdate("openedPencilBox", () => {
    for (const note of secretNotes) {
        note.opacity = pencilBox.isEnlarged ? 1 : 0;
        note.area.enabled = pencilBox.isEnlarged;
    }
    });
    function stayInside(parent) {
        return {
            id: "stayInside",
            require: ["pos", "area"],
            update() {
                if (!parent) return;

            // Clamp world position to parent bounds
            const pw = parent.width * parent.scale.x;
            const ph = parent.height * parent.scale.y;
            
            // Use the scaled dimensions of the note
            const noteWidth = this.width * this.scale.x;
            const noteHeight = this.height * this.scale.y;
            
            const minX = parent.pos.x - pw / 2 + noteWidth / 2;
            const maxX = parent.pos.x + pw / 2 - noteWidth / 2;
            const minY = parent.pos.y - ph / 2 + noteHeight / 2;
            const maxY = parent.pos.y + ph / 2 - noteHeight / 2;
            this.pos.x = clamp(this.pos.x, minX, maxX);
            this.pos.y = clamp(this.pos.y, minY, maxY);
            }
        };
    }

    return secretNotes;
}