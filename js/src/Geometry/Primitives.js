"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath_1 = require("../Math/FMath");
const ArrayVec_1 = require("../Math/ArrayVec");
const Vertex_1 = require("./Vertex");
const Geometry_1 = require("./Geometry");
class Primitive extends Geometry_1.Geometry {
    constructor(vertices) {
        super();
        this.vertices = vertices;
    }
    generateVertices() {
        return this.vertices;
    }
}
exports.Primitive = Primitive;
class Circular extends Primitive {
    constructor(vertices, fullCircle) {
        super(vertices);
        this.fullCircle = fullCircle;
    }
    static pie(vertType, width, height, stepAngle, startAngle, endAngle) {
        if (startAngle > endAngle)
            throw RangeError("Start angle must be bigger than end angle");
        var fullCircle = startAngle == endAngle;
        if (fullCircle)
            endAngle += FMath_1.twoPI;
        var vertCount = Math.ceil((endAngle - startAngle) / stepAngle) + (fullCircle ? 1 : 2);
        var normal = ArrayVec_1.newVec3.init(0, 0, 1);
        var vertices = new Array(vertCount);
        vertices[0] = Vertex_1.newVertex3D(vertType, ArrayVec_1.newVec3.zero, normal);
        var angle = startAngle;
        for (var i = 1; i < vertCount; i++) {
            var pos = ArrayVec_1.newVec3.init(width * Math.cos(angle), height * Math.sin(angle), 0);
            vertices[i] = Vertex_1.newVertex3D(vertType, pos, normal);
            angle = Math.min(angle + stepAngle, endAngle);
        }
        return new Circular(vertices, fullCircle);
    }
    static ellipse(vertType, width, height, stepAngle = Math.PI / 18) {
        return Circular.pie(vertType, width, height, stepAngle, 0, 0);
    }
    static circle(vertType, diameter, stepAngle = Math.PI / 18) {
        return Circular.pie(vertType, diameter, diameter, stepAngle, 0, 0);
    }
    generateIndices() {
        let cnt = (this.vertices.length - 2) * 3 + (this.fullCircle ? 3 : 0);
        let result = new Array(cnt);
        for (var i = 2; i < cnt; i++) {
            result[i - 2] = 0;
            result[i - 2] = i;
            result[i - 2] = i - 1;
        }
        if (this.fullCircle) {
            result[cnt - 3] = 0;
            result[cnt - 2] = 1;
            result[cnt - 1] = cnt - 4;
        }
        return result;
    }
}
exports.Circular = Circular;
//# sourceMappingURL=Primitives.js.map