class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }

    removeSegment(segment) {
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }

    getSegmentsWithPoint(point) {
        return this.segments.filter(seg => seg.includes(point));
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    tryAddSegment(segment) {
        if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    containsSegment(segment) {
        return this.segments.find(seg => seg.equals(segment));
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find(p => p.equals(point));
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }
}