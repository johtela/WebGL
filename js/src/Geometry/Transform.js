"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vertex_1 = require("./Vertex");
const Wrapper_1 = require("./Wrapper");
class Transform extends Wrapper_1.Wrapper {
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
//# sourceMappingURL=Transform.js.map