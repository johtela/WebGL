"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexBuffer = (function () {
    function VertexBuffer(program, elements) {
        var gl = program.gl;
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        this.glBuffer = buf;
        this.count = elements.length;
        this.arrayBuffer = this.copyToBuffer(program, elements);
    }
    VertexBuffer.prototype.copyToBuffer = function (program, elements) {
        var _this = this;
        var vertexDef = program.vertexDef;
        var vertexSize = vertexDef.size;
        var len = elements.length;
        var buffer = new ArrayBuffer(vertexSize * len);
        var view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(function (attr) {
            var setter = _this.vertexAttrSetter(view, attr.type);
            for (var j = 0; j < attr.componentCount; j++) {
                for (var k = 0; k < len; k++)
                    setter((k * vertexSize) + attr.offset + (j * attr.typeSize), attr.getter(elements[k])[j]);
            }
        });
        return buffer;
    };
    VertexBuffer.prototype.vertexAttrSetter = function (view, type) {
        switch (type) {
            case 'byte': return view.setInt8;
            case 'ubyte': return view.setUint8;
            case 'short': return view.setInt16;
            case 'ushort': return view.setUint16;
            case 'float': return view.setFloat32;
        }
    };
    return VertexBuffer;
}());
exports.VertexBuffer = VertexBuffer;
//# sourceMappingURL=VertexBuffer.js.map