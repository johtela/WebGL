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
var Vertex = (function () {
    function Vertex() {
    }
    return Vertex;
}());
exports.Vertex = Vertex;
var VertAttr = (function () {
    function VertAttr(name, type, count, getter) {
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
var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Foo;
}(Vertex));
function byte(gl, vertex, name) {
    var val = vertex[name];
    return new VertAttr(name, gl.BYTE, 1, function (v) { return [v[name]]; });
}
exports.byte = byte;
function test(gl) {
    var foo = new Foo();
    var a = byte(gl, foo, "bar");
}
// export function short (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
// {
//     return new VertAttr (gl.SHORT, 1, lift (getter))
// }
// export function ubyte (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
// {
//     return new VertAttr (gl.UNSIGNED_BYTE, 1, lift (getter))
// }
// export function ushort (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
// {
//     return new VertAttr (gl.UNSIGNED_SHORT, 1, lift (getter))
// }
// export function float (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
// {
//     return new VertAttr (gl.FLOAT, 1, lift (getter))
// }
// function liftVec<V extends Vec<V>> (getter: VertAttrGetter<V>): (object) => number[]
// {
//     return obj => getter (obj).toArray ()
// }
// export function vec2 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec2>): VertAttr<Vec2>
// {
//     return new VertAttr (gl.FLOAT, 2, liftVec (getter))
// }
// export function vec3 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec3>): VertAttr<Vec3>
// {
//     return new VertAttr (gl.FLOAT, 3, liftVec (getter))
// }
// export function vec4 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec4>): VertAttr<Vec4>
// {
//     return new VertAttr (gl.FLOAT, 4, liftVec (getter))
// } 
//# sourceMappingURL=VertexAttribute.js.map