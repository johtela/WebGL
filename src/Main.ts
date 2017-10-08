import { NewVec, Vec3, Vec4 } from "./Vectors"
import { NewMat4, Mat4 } from "./Matrices"
import { newMat4 } from "./ArrayMat"

// Vertex shader program
const vsSource: string = require ('./shaders/simple.vert')
const fsSource: string = require ('./shaders/simple.frag')

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): 
    WebGLProgram | null 
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null
{
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
}

interface Buffers 
{ 
    position: WebGLBuffer 
}

function initBuffers(gl: WebGLRenderingContext): Buffers | null
{
      // Create a buffer for the square's positions.
    
      const positionBuffer = gl.createBuffer();
      if (positionBuffer == null)
        return null;
    
      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
    
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
      // Now create an array of positions for the square.
    
      const positions = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
      ];
    
      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.
    
      gl.bufferData(gl.ARRAY_BUFFER,
                    new Float32Array(positions),
                    gl.STATIC_DRAW);
    
      return { position: positionBuffer };
}

interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: number;
    };
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation;
        modelViewMatrix: WebGLUniformLocation;
    };
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) 
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
  
    const projectionMatrix = newMat4.perspective (-1, 1, -1, 1, 1, 100)
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = newMat4.translation ([0.0, 0.0, -4.0])
  
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;  // pull out 2 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix.toFloat32Array ());
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix.toFloat32Array ());
  
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

function unifLocation (gl: WebGLRenderingContext, program: WebGLProgram, unifName: string): 
    WebGLUniformLocation
{
    var res = gl.getUniformLocation (program, unifName)
    if (res === null)
        throw Error (`Uniform ${unifName} not found in program`)
    return res
}

//
// start here
//
function main() 
{
    const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
    // Initialize the GL context
    const gl = canvas.getContext("webgl");

    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram)
        return;
    const programInfo: ProgramInfo = 
    {
        program: shaderProgram,
        attribLocations: 
        {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: 
        {
            projectionMatrix: unifLocation(gl, shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: unifLocation(gl, shaderProgram, 'uModelViewMatrix'),
        },
      };

    const buffers = initBuffers(gl);
    if (!buffers)
      return;
    drawScene (gl, programInfo, buffers);  
}

main();