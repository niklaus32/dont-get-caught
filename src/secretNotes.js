export function createNotes(pencilBox) {
    loadSprite("stickyNote", "sprites/stickyNote.png")  
    //Dragging secret notes
    let curDraggin = null;
    function drag() {
        // The displacement between object pos and mouse pos
        let offset = vec2(0);
        return {
            id: "drag",
            require: ["pos", "area"],
            pick() {
                // Set the current global dragged object to this
                curDraggin = this;
                offset = mousePos().sub(this.pos);
                this.trigger("drag");
            },
            // "update" is a lifecycle method gets called every frame the obj is in scene
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
    // Drop whatever is dragged on mouse release
    onMouseRelease(() => {
        if (curDraggin) {
            curDraggin.trigger("dragEnd");
            curDraggin = null;
        }
    });
    // Reset cursor to default at frame start for easier cursor management
    onUpdate(() => setCursor("default"));

    const secretNotes = [];
    const NOTE_SCALE = 0.05;
    const NOTE_MARGIN = 10;
    for (let i = 0; i < 10; i++) {
        // Calculate local position inside parent bounds
        const pw = pencilBox.width * pencilBox.scale.x;
        const ph = pencilBox.height * pencilBox.scale.y;
        const nw = 64 * NOTE_SCALE;
        const nh = 64 * NOTE_SCALE;
        const x = rand(-pw/2 + nw/2 + NOTE_MARGIN, pw/2 - nw/2 - NOTE_MARGIN);
        const y = rand(-ph/2 + nh/2 + NOTE_MARGIN, ph/2 - nh/2 - NOTE_MARGIN);
        const note = pencilBox.add([
            sprite("stickyNote"),
            pos(x, y),
            area({ cursor: "pointer" }),
            scale(NOTE_SCALE),
            anchor("center"),
            stayInside(pencilBox),
            drag(),
            "stickyNote",
        ]);
        note.opacity = 0;
        secretNotes.push(note);
        note.onDrag(() => {
            readd(note);
        });

        note.onDragUpdate(() => {
            setCursor("move");
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
            // Calculate parent's boundaries
            const minX = parent.pos.x;
            const minY = parent.pos.y;
            const maxX = parent.pos.x + parent.width - this.width;
            const maxY = parent.pos.y + parent.height - this.height;
            // Clamp child position to stay inside parent
            this.pos.x = clamp(this.pos.x, minX, maxX);
            this.pos.y = clamp(this.pos.y, minY, maxY);
        }
        };
    }

    return secretNotes;
}