const INITIAL_THRESHOLD = 16;

class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
        this.threshold = INITIAL_THRESHOLD;

        this.shift = false;

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
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

    #handleMouseDown(event) {
        if (isRightClick(event)) {
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.#removePoint(this.hovered);
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
    }

    #handleMouseMove(event) {
        this.shift = event.shiftKey;
        this.mouse = this.viewport.getMouse(event, true);

        this.threshold = INITIAL_THRESHOLD * this.viewport.zoom;
        this.hovered = getNearestPoint(this.mouse, this.graph.points, this.threshold);
        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
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

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, {fill: true});
        }
        if (this.selected) {
            if (this.shift) {
                const intent = this.hovered ? this.hovered : this.mouse;
                new Segment(this.selected, intent).draw(this.ctx, {
                    width: 3 * this.viewport.zoom,
                    color: "yellow",
                    dash: [3 * this.viewport.zoom, 3 * this.viewport.zoom]
                });
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
