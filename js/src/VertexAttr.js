"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr = (function () {
    function VertexAttr(name, type, count, getter) {
        this.type = type;
        this.componentCount = count;
        this.getter = getter;
    }
    Object.defineProperty(VertexAttr.prototype, "typeSize", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexAttr.prototype, "sizeInBytes", {
        get: function () {
            return Math.ceil(this.typeSize * this.componentCount / 4) * 4;
        },
        enumerable: true,
        configurable: true
    });
    VertexAttr.prototype.glType = function (gl) {
        switch (this.type) {
            case 'byte': return gl.BYTE;
            case 'ubyte': return gl.UNSIGNED_BYTE;
            case 'short': return gl.SHORT;
            case 'ushort': return gl.UNSIGNED_SHORT;
            case 'float': return gl.FLOAT;
            default: throw Error("Unsupported attribute type.");
        }
    };
    return VertexAttr;
}());
exports.VertexAttr = VertexAttr;
var VertexDef = (function () {
    function VertexDef(attrs) {
        this.vertexAttrs = attrs;
        this.size = this.initVertexAttrOffsets();
    }
    VertexDef.prototype.initVertexAttrOffsets = function () {
        var offset = 0;
        this.vertexAttrs.forEach(function (v) {
            v.offset = offset;
            offset += v.sizeInBytes;
        });
        return offset;
    };
    VertexDef.prototype.initVertexAttrLocations = function (gl, prg) {
        this.vertexAttrs.forEach(function (v) {
            var loc = gl.getAttribLocation(prg, v.name);
            if (loc < 0)
                throw Error("Vertex attribute '" + v.name + "' not found in program.");
            v.location = loc;
        });
    };
    return VertexDef;
}());
exports.VertexDef = VertexDef;
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