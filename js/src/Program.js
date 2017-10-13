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
var VertexAttr_1 = require("./VertexAttr");
var Uniforms_1 = require("./Uniforms");
var GLResource_1 = require("./GLResource");
var Program = (function (_super) {
    __extends(Program, _super);
    function Program(gl, shaders, vertexAttrs, uniforms) {
        var _this = _super.call(this, gl) || this;
        _this.shaders = shaders;
        _this.glProgram = _this.link();
        _this.vertexDef = new VertexAttr_1.VertexDef(vertexAttrs);
        _this.vertexDef.initVertexAttrLocations(gl, _this.glProgram);
        _this.uniformDef = new Uniforms_1.UniformDef(uniforms);
        _this.uniformDef.initUniformLocations(gl, _this.glProgram);
        return _this;
    }
    Program.prototype.link = function () {
        var gl = this.gl;
        var prg = gl.createProgram();
        if (prg === null)
            throw Error("Failed to create program");
        this.shaders.forEach(function (s) { return gl.attachShader(s.glShader, s.glShaderType); });
        gl.linkProgram(prg);
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS))
            throw Error('Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(prg));
        return prg;
    };
    Program.prototype.enableVertexAttrArrays = function () {
        var _this = this;
        var gl = this.gl;
        this.vertexDef.vertexAttrs.forEach(function (attr) {
            gl.vertexAttribPointer(attr.location, attr.numComponents, attr.glType(gl), false, _this.vertexDef.stride, attr.offset);
            gl.enableVertexAttribArray(attr.location);
        });
    };
    Program.prototype.use = function () {
        this.gl.useProgram(this.glProgram);
    };
    Program.prototype.release = function () {
        this.gl.useProgram(null);
    };
    Program.prototype.drawElements = function (mode, vbuffer, ibuffer, uniforms) {
        var _this = this;
        GLResource_1.using([this, vbuffer, ibuffer], function (gl) {
            _this.uniformDef.setValues(_this.gl, uniforms);
            _this.enableVertexAttrArrays();
            gl.drawElements(mode, ibuffer.length, gl.UNSIGNED_SHORT, 0);
        });
    };
    return Program;
}(GLResource_1.GLResource));
exports.Program = Program;
//# sourceMappingURL=Program.js.map