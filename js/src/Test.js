"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayVec_1 = require("./ArrayVec");
var ArrayMat_1 = require("./ArrayMat");
var Shader_1 = require("./Shader");
var VAttr = require("./VertexAttr");
var Unif = require("./Uniforms");
var Buffers_1 = require("./Buffers");
var Program_1 = require("./Program");
// Vertex shader program
var vsSource = require('./shaders/simple.vert');
var fsSource = require('./shaders/simple.frag');
var SimpleVertex = (function () {
    function SimpleVertex() {
    }
    return SimpleVertex;
}());
var MyUniforms = (function () {
    function MyUniforms() {
    }
    return MyUniforms;
}());
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
    var vertices = [
        { aVertexPosition: ArrayVec_1.newVec2.init(1, 1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(-1, 1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(1, -1) },
        { aVertexPosition: ArrayVec_1.newVec2.init(-1, -1) }
    ];
    var indices = [0, 1, 2, 3];
    var uniforms = {
        uModelViewMatrix: ArrayMat_1.newMat4.translation([0.0, 0.0, -4.0]),
        uProjectionMatrix: ArrayMat_1.newMat4.perspective(-1, 1, -1, 1, 1, 100)
    };
    var canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    var gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    var vertShader = new Shader_1.Shader(gl, 'vertex', vsSource);
    var fragShader = new Shader_1.Shader(gl, 'fragment', fsSource);
    var program = new Program_1.Program(gl, [vertShader, fragShader], [VAttr.vec4('aVertexPosition')], [Unif.mat4('uModelViewMatrix'), Unif.mat4('uProjectionMatrix')]);
    var vbuffer = new Buffers_1.VertexBuffer(gl, program.vertexDef, vertices);
    var ibuffer = new Buffers_1.IndexBuffer(gl, indices);
    drawScene(gl, program, vbuffer, ibuffer, uniforms);
}
main();
//# sourceMappingURL=Test.js.map