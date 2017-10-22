"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayMat_1 = require("../Math/ArrayMat");
const Aabb_1 = require("./Aabb");
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
    }
}
exports.Geometry = Geometry;
//# sourceMappingURL=Geometry.js.map