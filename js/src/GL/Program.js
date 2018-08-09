"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VertexAttr_1 = require("./VertexAttr");
const Uniforms_1 = require("./Uniforms");
const GLResource_1 = require("./GLResource");
class Program extends GLResource_1.GLResource {
    constructor(gl, shaders, vertexAttrs, uniforms) {
        super(gl);
        this.shaders = shaders;
        this.glProgram = this.link();
        this.vertexDef = new VertexAttr_1.VertexDef(vertexAttrs);
        this.vertexDef.initVertexAttrLocations(gl, this.glProgram);
        this.uniformDef = new Uniforms_1.UniformDef(uniforms);
        this.uniformDef.initUniformLocations(gl, this.glProgram);
    }
    link() {
        let gl = this.gl;
        let prg = gl.createProgram();
        if (prg === null)
            throw Error("Failed to create program");
        this.shaders.forEach(s => gl.attachShader(prg, s.glShader));
        gl.linkProgram(prg);
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS))
            throw Error('Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(prg));
        return prg;
    }
    enableVertexAttrArrays() {
        let gl = this.gl;
        this.vertexDef.vertexAttrs.forEach(attr => {
            gl.vertexAttribPointer(attr.location, attr.numComponents, attr.glType(gl), false, this.vertexDef.stride, attr.offset);
            gl.enableVertexAttribArray(attr.location);
        });
    }
    use() {
        this.gl.useProgram(this.glProgram);
    }
    release() {
        this.gl.useProgram(null);
    }
    drawElements(mode, vbuffer, ibuffer, uniforms) {
        GLResource_1.using([this, vbuffer, ibuffer], gl => {
            this.uniformDef.setValues(gl, uniforms);
            this.enableVertexAttrArrays();
            gl.drawElements(mode, ibuffer.length, gl.UNSIGNED_SHORT, 0);
        });
    }
}
exports.Program = Program;
//# sourceMappingURL=Program.js.map