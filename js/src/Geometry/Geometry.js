"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayMat_1 = require("../Math/ArrayMat");
const Aabb_1 = require("./Aabb");
const Vertex_1 = require("./Vertex");
const Transformable_1 = require("./Transformable");
const Transform_1 = require("./Transform");
var Axis;
(function (Axis) {
    Axis[Axis["x"] = 1] = "x";
    Axis[Axis["y"] = 2] = "y";
    Axis[Axis["z"] = 4] = "z";
    Axis[Axis["All"] = 7] = "All";
})(Axis = exports.Axis || (exports.Axis = {}));
var AxisDirection;
(function (AxisDirection) {
    AxisDirection[AxisDirection["negative"] = -1] = "negative";
    AxisDirection[AxisDirection["positive"] = 1] = "positive";
})(AxisDirection = exports.AxisDirection || (exports.AxisDirection = {}));
class Geometry {
    get vertices() {
        if (this._vertices === null)
            this._vertices = Array.from(this.generateVertices());
        return this._vertices;
    }
    get indices() {
        if (this._indices === null)
            this._indices = Array.from(this.generateIndices());
        return this._indices;
    }
    get boundingBox() {
        if (this._boundingBox === null)
            this._boundingBox = Aabb_1.fromPositions(this.vertices.map(v => v.position));
        return this._boundingBox;
    }
    newMat() {
        return ArrayMat_1.newMat4;
    }
    transform(matrix) {
        if (this instanceof Transform_1.Transform) {
            let trans = this;
            return new Transform_1.Transform(trans.geometry, matrix.mul(trans.matrix));
        }
        else
            return new Transform_1.Transform(this, matrix);
    }
    reverseWinding() {
        return new Transform_1.ReverseIndices(this);
    }
}
exports.Geometry = Geometry;
function center(geometry) {
    let center = geometry.boundingBox.center;
    return Transformable_1.translate(geometry, center.inv().toArray());
}
exports.center = center;
function snapOffset(pos, snapToPos, snapAxis) {
    let result = snapToPos.sub(pos);
    if ((snapAxis & Axis.x) === 0)
        result.x = 0;
    if ((snapAxis & Axis.y) === 0)
        result.y = 0;
    if ((snapAxis & Axis.z) === 0)
        result.z = 0;
    return result;
}
function snapVertex(geometry, position, snapToVertex, snapAxis) {
    var offset = snapOffset(Vertex_1.instanceOfVertex3D(position) ? position.position : position, snapToVertex.position, snapAxis);
    return Transformable_1.translate(geometry, offset.toArray());
}
exports.snapVertex = snapVertex;
function normalsAsVertices(geometry) {
    let vertices = geometry.vertices;
    let result = new Array(vertices.length * 2);
    for (let i = 0; i < vertices.length; i++) {
        let vert = vertices[i];
        result[i * 2] = vert;
        result[i * 2 + 1] = Vertex_1.copyVertex3D(vert, vert.position.add(vert.normal));
    }
    return result;
}
exports.normalsAsVertices = normalsAsVertices;
function alignmentMatrix(xalign, yalign, zalign, alignWith, bbox) {
    return ArrayMat_1.newMat4.translation([
        alignWith.getAlignmentOffset(bbox, 0, xalign),
        alignWith.getAlignmentOffset(bbox, 1, yalign),
        alignWith.getAlignmentOffset(bbox, 2, zalign)
    ]);
}
function align(geometries, xalign = Aabb_1.Alignment.none, yalign = Aabb_1.Alignment.none, zalign = Aabb_1.Alignment.none) {
    let cnt = geometries.length;
    if (cnt === 0)
        throw Error("Geometries array is empty.");
    let result = new Array(cnt);
    let alignWith = geometries[0].boundingBox;
    result[0] = geometries[0];
    for (let i = 1; i < cnt; i++) {
        let geom = geometries[i];
        result[i] = geom.transform(alignmentMatrix(xalign, yalign, zalign, alignWith, geom.boundingBox));
    }
    return result;
}
exports.align = align;
//# sourceMappingURL=Geometry.js.map