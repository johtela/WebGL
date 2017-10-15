"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FMath_1 = require("../Math/FMath");
function facing(planar, direction) {
    return FMath_1.approxEquals(planar.normal.dot(direction), 1, 0.1);
}
exports.facing = facing;
//# sourceMappingURL=VertexFilter.js.map