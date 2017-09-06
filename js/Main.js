"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glm = require("gl-matrix");
// Vertex shader program
var vsSource = "\n attribute vec4 aVertexPosition;\n\n uniform mat4 uModelViewMatrix;\n uniform mat4 uProjectionMatrix;\n\n void main() {\n   gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n }\n";
var fsSource = "\nvoid main() {\n  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}\n";
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    var shaderProgram = gl.createProgram();
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
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
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
function initBuffers(gl) {
    // Create a buffer for the square's positions.
    var positionBuffer = gl.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Now create an array of positions for the square.
    var positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return {
        position: positionBuffer,
    };
}
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    var fieldOfView = 45 * Math.PI / 180; // in radians
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 0.1;
    var zFar = 100.0;
    var projectionMatrix = glm.mat4.create();
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    var modelViewMatrix = glm.mat4.create();
    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    glm.mat4.translate(modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]); // amount to translate
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        var numComponents = 2; // pull out 2 values per iteration
        var type = gl.FLOAT; // the data in the buffer is 32bit floats
        var normalize = false; // don't normalize
        var stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        var offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    // Set the shader uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    {
        var offset = 0;
        var vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}
//
// start here
//
function main() {
    var canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    var gl = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    var shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    var programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    var buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);
}
main();
//# sourceMappingURL=Main.js.map