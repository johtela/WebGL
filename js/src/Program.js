"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr_1 = require("./VertexAttr");
var Program = (function () {
    function Program(gl, shaders, vertexAttrs) {
        this.gl = gl;
        this.shaders = shaders;
        this.glProgram = this.link();
        this.vertexDef = new VertexAttr_1.VertexDef(vertexAttrs);
        this.vertexDef.initVertexAttrLocations(gl, this.glProgram);
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
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=Program.js.map