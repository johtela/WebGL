"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=Wrapper.js.map