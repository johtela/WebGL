"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vertex_1 = require("./Vertex");
const Geometry_1 = require("./Geometry");
class Wrapper extends Geometry_1.Geometry {
    constructor(geometry) {
        super();
        this.geometry = geometry;
    }
    generateVertices() {
        return this.geometry.vertices;
    }
    generateIndices() {
        return this.geometry.indices;
    }
}
exports.Wrapper = Wrapper;
class Transform extends Wrapper {
    constructor(geometry, matrix) {
        super(geometry);
        this.matrix = matrix;
    }
    generateVertices() {
        let normalMatrix = this.matrix.toMat3().invert().transpose();
        return this.geometry.vertices.map(v => Vertex_1.copyVertex3D(v, this.matrix.transform(v.position), normalMatrix.transform(v.normal)));
    }
}
exports.Transform = Transform;
class ReverseIndices extends Wrapper {
    constructor(geometry) {
        super(geometry);
    }
    generateIndices() {
        return this.geometry.indices.reverse();
    }
}
exports.ReverseIndices = ReverseIndices;
//# sourceMappingURL=Transform.js.map