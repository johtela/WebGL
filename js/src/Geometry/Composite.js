"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayExt_1 = require("../Common/ArrayExt");
const Geometry_1 = require("./Geometry");
class Composite extends Geometry_1.Geometry {
    constructor(geometries) {
        super();
        this.geometries = geometries;
    }
    static create(...geometries) {
        return new Composite(geometries);
    }
    generateVertices() {
        return ArrayExt_1.flatMap(this.geometries, g => g.vertices);
    }
    generateIndices() {
        let resLen = ArrayExt_1.sum(this.geometries.map(g => g.indices.length));
        let result = new Array(resLen);
        for (let g = 0, r = 0, c = 0; g < this.geometries.length; g++) {
            let geom = this.geometries[g];
            for (let i = 0; i < geom.indices.length; i++)
                result[r++] = c + geom.indices[i];
            c += geom.vertices.length;
        }
        return result;
    }
}
exports.Composite = Composite;
//# sourceMappingURL=Composite.js.map