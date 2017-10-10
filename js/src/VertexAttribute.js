"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertAttr = (function () {
    function VertAttr(type, count, getter) {
        this.type = type;
        this.count = count;
        this.getter = getter;
    }
    VertAttr.prototype.typeSize = function (gl) {
        switch (this.type) {
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                return 1 * this.count;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                return 2 * this.count;
            case gl.FLOAT:
                return 4 * this.count;
            default:
                throw Error("Unsupported attribute type.");
        }
    };
    VertAttr.prototype.sizeInBytes = function (gl) {
        return Math.ceil(this.typeSize(gl) * this.count / 4) * 4;
    };
    return VertAttr;
}());
exports.VertAttr = VertAttr;
function lift(fun) {
    return function (obj) { return [fun(obj)]; };
}
function byte(gl, getter) {
    return new VertAttr(gl.BYTE, 1, lift(getter));
}
exports.byte = byte;
function short(gl, getter) {
    return new VertAttr(gl.SHORT, 1, lift(getter));
}
exports.short = short;
function ubyte(gl, getter) {
    return new VertAttr(gl.UNSIGNED_BYTE, 1, lift(getter));
}
exports.ubyte = ubyte;
function ushort(gl, getter) {
    return new VertAttr(gl.UNSIGNED_SHORT, 1, lift(getter));
}
exports.ushort = ushort;
function float(gl, getter) {
    return new VertAttr(gl.FLOAT, 1, lift(getter));
}
exports.float = float;
function liftVec(getter) {
    return function (obj) { return getter(obj).toArray(); };
}
function vec2(gl, getter) {
    return new VertAttr(gl.FLOAT, 2, liftVec(getter));
}
exports.vec2 = vec2;
function vec3(gl, getter) {
    return new VertAttr(gl.FLOAT, 3, liftVec(getter));
}
exports.vec3 = vec3;
function vec4(gl, getter) {
    return new VertAttr(gl.FLOAT, 4, liftVec(getter));
}
exports.vec4 = vec4;
//# sourceMappingURL=VertexAttribute.js.map