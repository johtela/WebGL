"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GLResource_1 = require("./GLResource");
var Buffer = (function (_super) {
    __extends(Buffer, _super);
    function Buffer(gl, target, glBuffer, length) {
        var _this = _super.call(this, gl) || this;
        _this.target = target;
        _this.glBuffer = glBuffer;
        _this.length = length;
        return _this;
    }
    Buffer.prototype.use = function () {
        this.gl.bindBuffer(this.target, this.glBuffer);
    };
    Buffer.prototype.release = function () {
        this.gl.bindBuffer(this.target, null);
    };
    return Buffer;
}(GLResource_1.GLResource));
exports.Buffer = Buffer;
var VertexBuffer = (function (_super) {
    __extends(VertexBuffer, _super);
    function VertexBuffer(gl, vertexDef, vertices) {
        var _this = this;
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        _this = _super.call(this, gl, gl.ARRAY_BUFFER, buf, vertices.length) || this;
        GLResource_1.using(_this, function () {
            return gl.bufferData(gl.ARRAY_BUFFER, _this.initBuffer(vertexDef, vertices), gl.STATIC_DRAW);
        });
        return _this;
    }
    VertexBuffer.prototype.initBuffer = function (vertexDef, vertices) {
        var _this = this;
        var vertexSize = vertexDef.stride;
        var len = vertices.length;
        var buffer = new ArrayBuffer(vertexSize * len);
        var view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(function (attr) {
            var setter = _this.vertexAttrSetter(view, attr.type);
            var typeSize = attr.typeSize;
            for (var j = 0; j < len; j++) {
                var values = attr.getter(vertices[j]);
                for (var k = 0; k < attr.numComponents; k++)
                    setter((j * vertexSize) + attr.offset + (k * typeSize), values[k]);
            }
        });
        return buffer;
    };
    VertexBuffer.prototype.vertexAttrSetter = function (view, type) {
        switch (type) {
            case 'byte': return function (off, val) { return view.setInt8(off, val); };
            case 'ubyte': return function (off, val) { return view.setUint8(off, val); };
            case 'short': return function (off, val) { return view.setInt16(off, val); };
            case 'ushort': return function (off, val) { return view.setUint16(off, val); };
            case 'float': return function (off, val) { return view.setFloat32(off, val); };
        }
    };
    return VertexBuffer;
}(Buffer));
exports.VertexBuffer = VertexBuffer;
var IndexBuffer = (function (_super) {
    __extends(IndexBuffer, _super);
    function IndexBuffer(gl, indices) {
        var _this = this;
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create index buffer.');
        _this = _super.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, buf, indices.length) || this;
        GLResource_1.using(_this, function () {
            return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        });
        return _this;
    }
    return IndexBuffer;
}(Buffer));
exports.IndexBuffer = IndexBuffer;
//# sourceMappingURL=Buffers.js.map