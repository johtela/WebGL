"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr = (function () {
    function VertexAttr(name, type, count, getter) {
        this.type = type;
        this.count = count;
        this.getter = getter;
    }
    VertexAttr.prototype.typeSize = function () {
        switch (this.type) {
            case 'byte':
            case 'ubyte':
                return 1;
            case 'short':
            case 'ushort':
                return 2;
            case 'float':
                return 4;
            default:
                throw Error("Unsupported attribute type.");
        }
    };
    VertexAttr.prototype.sizeInBytes = function () {
        return Math.ceil(this.typeSize() * this.count / 4) * 4;
    };
    return VertexAttr;
}());
exports.VertexAttr = VertexAttr;
function byte(name) {
    return new VertexAttr(name, 'byte', 1, function (v) { return [v[name]]; });
}
exports.byte = byte;
function ubyte(name) {
    return new VertexAttr(name, 'ubyte', 1, function (v) { return [v[name]]; });
}
exports.ubyte = ubyte;
function short(name) {
    return new VertexAttr(name, 'short', 1, function (v) { return [v[name]]; });
}
exports.short = short;
function ushort(name) {
    return new VertexAttr(name, 'ushort', 1, function (v) { return [v[name]]; });
}
exports.ushort = ushort;
function float(name) {
    return new VertexAttr(name, 'float', 1, function (v) { return [v[name]]; });
}
exports.float = float;
function vec2(name) {
    return new VertexAttr(name, 'float', 2, function (v) { return v[name].toArray(); });
}
exports.vec2 = vec2;
function vec3(name) {
    return new VertexAttr(name, 'float', 3, function (v) { return v[name].toArray(); });
}
exports.vec3 = vec3;
function vec4(name) {
    return new VertexAttr(name, 'float', 4, function (v) { return v[name].toArray(); });
}
exports.vec4 = vec4;
//# sourceMappingURL=VertexAttr.js.map