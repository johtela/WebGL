"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayVec_1 = require("./Math/ArrayVec");
const ArrayMat_1 = require("./Math/ArrayMat");
const FMath_1 = require("./Math/FMath");
const Shader_1 = require("./GL/Shader");
const VAttr = require("./GL/VertexAttr");
const Unif = require("./GL/Uniforms");
const Buffers_1 = require("./GL/Buffers");
const Program_1 = require("./GL/Program");
// Vertex shader program
const vsSource = require('./shaders/simple.vert');
const fsSource = require('./shaders/simple.frag');
class SimpleVertex {
}
class MyUniforms {
}
function drawScene(gl, program, vbuffer, ibuffer, uniforms) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    program.drawElements(gl.TRIANGLE_STRIP, vbuffer, ibuffer, uniforms);
}
function main() {
    let vertices = [
        { aVertexPosition: ArrayVec_1.newVec2.init(1, 1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(-1, 1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(1, -1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(-1, -1) }
    ];
    let indices = [0, 1, 2, 3];
    let uniforms = {
        uModelViewMatrix: ArrayMat_1.newMat4.translation([0.0, 0.0, -4.0]).mul(ArrayMat_1.newMat4.rotationX(FMath_1.PIover8)),
        uProjectionMatrix: ArrayMat_1.newMat4.perspective(-1, 1, -1, 1, 1, 100)
    };
    let canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    let gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    let vertShader = new Shader_1.Shader(gl, 'vertex', vsSource);
    let fragShader = new Shader_1.Shader(gl, 'fragment', fsSource);
    let program = new Program_1.Program(gl, [vertShader, fragShader], [VAttr.vec2('aVertexPosition')], [Unif.mat4('uModelViewMatrix'), Unif.mat4('uProjectionMatrix')]);
    let vbuffer = new Buffers_1.VertexBuffer(gl, program.vertexDef, vertices);
    let ibuffer = new Buffers_1.IndexBuffer(gl, indices);
    drawScene(gl, program, vbuffer, ibuffer, uniforms);
}
main();
//# sourceMappingURL=Test.js.map