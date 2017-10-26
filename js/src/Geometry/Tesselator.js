"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Iter = require("../Common/IterableExt");
const FMath_1 = require("../Math/FMath");
class TessVertex {
    constructor(index) {
        this.index = index;
    }
    get isReflex() {
        return this.angle >= Math.PI;
    }
    static circularList(count) {
        let first = new TessVertex(0);
        let prev = first;
        for (let i = 1; i < count; i++) {
            let tv = new TessVertex(i);
            prev.next = tv;
            tv.previous = prev;
            prev = tv;
        }
        prev.next = first;
        first.previous = prev;
        return first;
    }
    delete() {
        this.previous.next = this.next;
        this.next.previous = this.previous;
    }
    *[Symbol.iterator]() {
        let first = this;
        let curr = first;
        do {
            yield curr;
            curr = curr.next;
        } while (curr != first);
    }
}
function tesselatePolygon(vertices) {
    let count = vertices.length;
    if (count < 3)
        throw new Error("Tesselator needs at least 3 vertices");
    let result = new Array((count - 2) * 3);
    let resInd = 0;
    let tessVerts = TessVertex.circularList(count);
    for (let tv of tessVerts)
        updateVertexAngle(tv, vertices);
    for (let tv of tessVerts)
        updateIsEar(tv, vertices);
    while (count > 3) {
        let curr = Iter.min(Iter.filter(tessVerts, v => v.isEar), v => v.angle);
        let prev = curr.previous;
        let next = curr.next;
        result[resInd++] = prev.index;
        result[resInd++] = curr.index;
        result[resInd++] = next.index;
        curr.delete();
        updateVertexAngle(prev, vertices);
        updateVertexAngle(next, vertices);
        updateIsEar(prev, vertices);
        updateIsEar(next, vertices);
        tessVerts = next;
        count--;
    }
    for (let tv of tessVerts)
        result[resInd++] = tv.index;
    return result;
}
exports.tesselatePolygon = tesselatePolygon;
function updateVertexAngle(tessVert, vertices) {
    tessVert.angle = angleBetweenEdges(tessVert.previous.index, tessVert.index, tessVert.next.index, vertices);
}
function updateIsEar(current, vertices) {
    if (current.isReflex)
        current.isEar = false;
    else {
        let prev = current.previous;
        let next = current.next;
        let p0 = vertices[prev.index].position;
        let p1 = vertices[current.index].position;
        let p2 = vertices[next.index].position;
        current.isEar = Iter.every(Iter.filter(current, v => v != current && v != prev && v != next && v.isReflex), v => !pointInTriangle(vertices[v.index].position, p0, p1, p2));
    }
}
function angleBetweenEdges(prev, current, next, vertices) {
    let vec1 = vertices[prev].position.sub(vertices[current].position);
    let vec2 = vertices[next].position.sub(vertices[current].position);
    let result = Math.atan2(vec2.y, vec2.x) - Math.atan2(vec1.y, vec1.x);
    return result < 0 ? FMath_1.twoPI + result : result;
}
function pointInTriangle(p, p0, p1, p2) {
    let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y);
    let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y);
    if (s <= 0 || t <= 0)
        return false;
    let A = (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    return (s + t) < A;
}
//# sourceMappingURL=Tesselator.js.map