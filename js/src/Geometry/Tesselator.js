"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath_1 = require("../Math/FMath");
const Reducible_1 = require("../Common/Reducible");
class TessVertex {
    constructor(index) {
        this.index = index;
    }
    get isReflex() {
        return this.angle >= Math.PI;
    }
    static circularList(count) {
        var first = new TessVertex(0);
        var prev = first;
        for (var i = 1; i < count; i++) {
            var tv = new TessVertex(i);
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
    reduce(initial, reducer) {
        let result = initial;
        let first = this;
        let curr = first;
        do {
            result = reducer(result, curr);
            curr = curr.next;
        } while (curr !== first);
        return result;
    }
}
function tesselatePolygon(vertices) {
    var count = vertices.length;
    if (count < 3)
        throw new Error("Tesselator needs at least 3 vertices");
    var result = new Array((count - 2) * 3);
    var resInd = 0;
    var tessVerts = TessVertex.circularList(count);
    Reducible_1.foreach(tessVerts, tv => updateVertexAngle(tv, vertices));
    Reducible_1.foreach(tessVerts, tv => updateIsEar(tv, vertices));
    while (count > 3) {
        var curr = tessVerts.reduce(tessVerts, Reducible_1.filter(v => v.isEar, Reducible_1.min(v => v.angle)));
        var prev = curr.previous;
        var next = curr.next;
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
    Reducible_1.foreach(tessVerts, tv => result[resInd++] = tv.index);
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
        var prev = current.previous;
        var next = current.next;
        var p0 = vertices[prev.index].position;
        var p1 = vertices[current.index].position;
        var p2 = vertices[next.index].position;
        current.isEar = current.Where(v => v != current && v != prev && v != next && v.IsReflex)
            .All(cv => !pointInTriangle(vertices[cv.Index].position, p0, p1, p2));
    }
}
function angleBetweenEdges(prev, current, next, vertices) {
    var vec1 = vertices[prev].position.sub(vertices[current].position);
    var vec2 = vertices[next].position.sub(vertices[current].position);
    var result = Math.atan2(vec2.y, vec2.x) - Math.atan2(vec1.y, vec1.x);
    return result < 0 ? FMath_1.twoPI + result : result;
}
function pointInTriangle(p, p0, p1, p2) {
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y);
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y);
    if (s <= 0 || t <= 0)
        return false;
    var A = (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    return (s + t) < A;
}
//# sourceMappingURL=Tesselator.js.map