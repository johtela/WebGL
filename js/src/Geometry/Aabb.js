"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Alignment;
(function (Alignment) {
    Alignment[Alignment["none"] = 0] = "none";
    Alignment[Alignment["negative"] = 1] = "negative";
    Alignment[Alignment["center"] = 2] = "center";
    Alignment[Alignment["positive"] = 3] = "positive";
})(Alignment = exports.Alignment || (exports.Alignment = {}));
class Aabb {
    constructor(pos1, pos2 = pos1) {
        this.min = pos1.min(pos2);
        this.max = pos2.max(pos1);
    }
    get left() {
        return this.min.component(0);
    }
    get right() {
        return this.max.component(0);
    }
    get bottom() {
        return this.min.component(1);
    }
    get top() {
        return this.max.component(1);
    }
    get back() {
        return this.min.component(2);
    }
    get front() {
        return this.max.component(2);
    }
    get size() {
        return this.max.sub(this.min);
    }
    get center() {
        return this.min.add(this.max).div(2);
    }
    corner(index, dimensions) {
        let result = new Array(dimensions);
        let minArray = this.min.toArray();
        let maxArray = this.max.toArray();
        for (let i = 0; i < dimensions; i++) {
            result[i] = (index & 1) === 1 ? maxArray[i] : minArray[i];
            index >>= 1;
        }
        return result;
    }
    get corners() {
        let dim = this.min.dimensions;
        let newVec = this.min.newVec();
        let result = new Array(1 << dim);
        for (let i = 0; i < result.length; i++)
            result[i] = newVec.fromArray(this.corner(i, dim));
        return result;
    }
    getAlignmentOffset(other, dim, align) {
        switch (align) {
            case Alignment.negative:
                return this.min.component(dim) - other.min.component(dim);
            case Alignment.positive:
                return this.max.component(dim) - other.max.component(dim);
            case Alignment.center:
                return this.center.component(dim) - other.center.component(dim);
            default: return 0;
        }
    }
    add(position) {
        if (position instanceof Array) {
            let min = this.min;
            let max = this.max;
            for (let i = 0; i < position.length; i++) {
                min = min.min(position[i]);
                max = max.max(position[i]);
            }
            return new Aabb(min, max);
        }
        return new Aabb(this.min.min(position), this.max.max(position));
    }
    union(other) {
        return new Aabb(this.min.min(other.min), this.max.max(other.max));
    }
    intersects(other) {
        if (other instanceof Aabb) {
            for (let i = 0; i < this.min.dimensions; i++)
                if (this.max.component(i) < other.min.component(i) ||
                    this.min.component(i) > other.max.component(i))
                    return false;
        }
        else {
            for (let i = 0; i < this.min.dimensions; i++)
                if (this.max.component(i) < other.component(i) ||
                    this.min.component(i) > other.component(i))
                    return false;
        }
        return true;
    }
    transform(matrix) {
        return fromPositions(this.corners.map(matrix.transform));
    }
    equals(other) {
        return this.min.equals(other.min) && this.max.equals(other.max);
    }
    toString() {
        return `${this.min} -> ${this.max}`;
    }
}
exports.Aabb = Aabb;
function fromPositions(positions) {
    let first = positions.pop();
    if (!first)
        throw Error("No positions given");
    return new Aabb(first).add(positions);
}
exports.fromPositions = fromPositions;
//# sourceMappingURL=Aabb.js.map