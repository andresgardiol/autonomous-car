class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.shift = false;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", event => {
            if (isRightClick(event)) {
                if (this.hovered) {
                    this.#removePoint(this.hovered);
                } else {
                    this.selected = null;
                }
            }
            if (isLeftClick(event)) {
                if (this.hovered) {
                    this.#select(this.hovered, this.shift);
                    this.dragging = true;
                    return;
                }

                this.graph.addPoint(this.mouse);
                this.#select(this.mouse, this.shift);
                this.hovered = this.mouse;
            }
        });

        this.canvas.addEventListener("mousemove", event => {
            this.shift = event.shiftKey;
            this.mouse = new Point(event.offsetX, event.offsetY);
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 16);
            if (this.dragging) {
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
        });
        this.canvas.addEventListener("mouseup", () => {
            this.dragging = false;
        });

        this.canvas.addEventListener("contextmenu", event => {
            event.preventDefault();
        });

        addEventListener("keydown", event => {
            this.shift = event.shiftKey;
        });

        addEventListener("keyup", event => {
            this.shift = false;
        });
    }

    #select(point, shift = false) {
        if (this.selected && shift) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected === point) {
            this.selected = null;
        }
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, {fill: true});
        }
        if (this.selected) {
            if (this.shift) {
                new Segment(this.selected, this.mouse).draw(this.ctx, 2, "yellow");
            }
            this.selected.draw(this.ctx, {outline: true});
        }
    }
}

function isRightClick(event) {
    return event.button === 2;
}

function isLeftClick(event) {
    return event.button === 0;
}
