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
        this.mouse = new Point(event.offsetX, event.offsetY);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 16);
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

    display() {
        this.graph.draw(this.ctx);
        if (this.hovered) {
            this.hovered.draw(this.ctx, {fill: true});
        }
        if (this.selected) {
            if (this.shift) {
                const intent = this.hovered ? this.hovered : this.mouse;
                new Segment(this.selected, intent).draw(this.ctx, {color: "yellow", dash: [3, 3]});
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
