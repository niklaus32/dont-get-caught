export function createNotes(pencilBox) {
    loadSprite("stickyNote", "sprites/stickyNote.png")  
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
    onUpdate(() => setCursor("default"));

    const secretNotes = [];
    const NOTE_SCALE = 0.1;
    const NOTE_MARGIN = 10;
    for (let i = 0; i < 10; i++) {
        // Calculate local position inside parent bounds (world coordinates, anchor center)
        const pw = pencilBox.width * pencilBox.scale.x;
        const ph = pencilBox.height * pencilBox.scale.y;
        const nw = 64 * NOTE_SCALE;
        const nh = 64 * NOTE_SCALE;
        const minX = pencilBox.pos.x - pw / 2 + nw / 2 + NOTE_MARGIN;
        const maxX = pencilBox.pos.x + pw / 2 - nw / 2 - NOTE_MARGIN;
        const minY = pencilBox.pos.y - ph / 2 + nh / 2 + NOTE_MARGIN;
        const maxY = pencilBox.pos.y + ph / 2 - nh / 2 - NOTE_MARGIN;
        const x = rand(minX, maxX);
        const y = rand(minY, maxY);
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

            // Clamp world position to parent bounds
            const pw = parent.width * parent.scale.x;
            const ph = parent.height * parent.scale.y;
            const minX = parent.pos.x - pw / 2 + this.width / 2;
            const maxX = parent.pos.x + pw / 2 - this.width / 2;
            const minY = parent.pos.y - ph / 2 + this.height / 2;
            const maxY = parent.pos.y + ph / 2 - this.height / 2;
            this.pos.x = clamp(this.pos.x, minX, maxX);
            this.pos.y = clamp(this.pos.y, minY, maxY);
            }
        };
    }

    return secretNotes;
}