import { NewVec, Vec2, Vec3, Vec4 } from "./Math/Vectors";
import { NewMat, Mat2, Mat3, Mat4 } from "./Math/Matrices";
import { newVec2, newVec4 } from "./Math/ArrayVec"
import { newMat4 } from "./Math/ArrayMat"
import { PIover8 } from "./Math/FMath"
import { ShaderType, Shader } from "./GL/Shader"
import * as VAttr from "./GL/VertexAttr"
import * as Unif from "./GL/Uniforms"
import { VertexBuffer, IndexBuffer } from "./GL/Buffers";
import { Program } from "./GL/Program"

// Vertex shader program
const vsSource: string = require ('./shaders/simple.vert')
const fsSource: string = require ('./shaders/simple.frag')

class SimpleVertex 
{
    aVertexPosition: Vec2 
}

class MyUniforms
{
    uModelViewMatrix: Mat4
    uProjectionMatrix: Mat4 
}

function drawScene(gl: WebGLRenderingContext, program: Program<SimpleVertex, MyUniforms>, 
    vbuffer: VertexBuffer<SimpleVertex>, ibuffer: IndexBuffer, uniforms: MyUniforms) 
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    program.drawElements (gl.TRIANGLE_STRIP, vbuffer, ibuffer, uniforms)
}

function main ()
{
    let vertices: SimpleVertex[] = [
        { aVertexPosition: newVec2.init (1, 1) },
        { aVertexPosition: newVec2.init (-1, 1) },
        { aVertexPosition: newVec2.init (1, -1) },
        { aVertexPosition: newVec2.init (-1, -1) }
    ]
    let indices = [ 0, 1, 2, 3 ]
    let uniforms: MyUniforms = {
        uModelViewMatrix: newMat4.translation ([0.0, 0.0, -4.0]).mul(newMat4.rotationX (PIover8)),
        uProjectionMatrix: newMat4.perspective (-1, 1, -1, 1, 1, 100)
    }
    let canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
    // Initialize the GL context
    let gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    let vertShader = new Shader (gl, 'vertex', vsSource)
    let fragShader = new Shader (gl, 'fragment', fsSource)

    let program = new Program<SimpleVertex, MyUniforms> (gl,
        [ vertShader, fragShader ],
        [ VAttr.vec2 ('aVertexPosition') ],
        [ Unif.mat4 ('uModelViewMatrix'), Unif.mat4 ('uProjectionMatrix') ])

    let vbuffer = new VertexBuffer (gl, program.vertexDef, vertices)
    let ibuffer = new IndexBuffer (gl, indices)

    drawScene (gl, program, vbuffer, ibuffer, uniforms)
}

main ()