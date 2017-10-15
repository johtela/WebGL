"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayVec_1 = require("../Math/ArrayVec");
var FMath_1 = require("../Math/FMath");
var ArrayHelper_1 = require("../Common/ArrayHelper");
var VertexFilter = require("./VertexFilter");
var Dir3D = (function () {
    function Dir3D() {
    }
    Dir3D.left = ArrayVec_1.newVec3.init(-1, 0, 0);
    Dir3D.right = ArrayVec_1.newVec3.init(1, 0, 0);
    Dir3D.down = ArrayVec_1.newVec3.init(0, -1, 0);
    Dir3D.up = ArrayVec_1.newVec3.init(0, 1, 0);
    Dir3D.back = ArrayVec_1.newVec3.init(0, 0, -1);
    Dir3D.front = ArrayVec_1.newVec3.init(0, 0, 1);
    return Dir3D;
}());
exports.Dir3D = Dir3D;
function newVertex3D(vertType, position, normal) {
    var vertex = new vertType();
    vertex.position = position;
    vertex.normal = normal;
    return vertex;
}
exports.newVertex3D = newVertex3D;
function copyVertex3D(vertex, position, normal) {
    var copy = Object.create(vertex);
    copy.position = position;
    copy.normal = normal;
    return copy;
}
exports.copyVertex3D = copyVertex3D;
function center(positionals) {
    var _a = extents(positionals), min = _a[0], max = _a[1];
    return min.add(max).divide(2);
}
exports.center = center;
function extents(positionals) {
    if (positionals.length === 0)
        throw Error("Empty argument array.");
    var min = positionals[0].position;
    var max = min;
    for (var i = 1; i < positionals.length; i++) {
        var pos = positionals[i].position;
        min = pos.min(min);
        max = pos.max(max);
    }
    return [min, max];
}
exports.extents = extents;
function furthest(positionals, direction) {
    return ArrayHelper_1.maxItems(positionals, function (p) { return ArrayHelper_1.sum(p.position.toArray()); });
}
exports.furthest = furthest;
function facing(planars, direction) {
    return planars.filter(function (p) { return VertexFilter.facing(p, direction); });
}
exports.facing = facing;
function areCoplanar(positionals) {
    if (positionals.length < 4)
        return true;
    var first = positionals[0].position;
    var ab = positionals[1].position.sub(first);
    var ac = positionals[2].position.sub(first);
    var normal = ab.cross(ac);
    for (var i = 3; i < positionals.length; i++)
        if (!FMath_1.approxEquals(normal.dot(positionals[i].position.sub(first)), 0, 0.1))
            return false;
    return true;
}
exports.areCoplanar = areCoplanar;
//# sourceMappingURL=Vertex.js.map