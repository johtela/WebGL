/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ArrayMat_1 = __webpack_require__(1);
// Vertex shader program
var vsSource = __webpack_require__(4);
var fsSource = __webpack_require__(5);
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
    if (positionBuffer == null)
        return null;
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
    return { position: positionBuffer };
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
    var projectionMatrix = ArrayMat_1.newMat4.perspective(-1, 1, -1, 1, 1, 100);
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    var modelViewMatrix = ArrayMat_1.newMat4.translation([0.0, 0.0, -4.0]);
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
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix.toFloat32Array());
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.toFloat32Array());
    {
        var offset = 0;
        var vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}
function unifLocation(gl, program, unifName) {
    var res = gl.getUniformLocation(program, unifName);
    if (res === null)
        throw Error("Uniform " + unifName + " not found in program");
    return res;
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
    if (!shaderProgram)
        return;
    var programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: unifLocation(gl, shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: unifLocation(gl, shaderProgram, 'uModelViewMatrix'),
        },
    };
    var buffers = initBuffers(gl);
    if (!buffers)
        return;
    drawScene(gl, programInfo, buffers);
}
main();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FMath = __webpack_require__(2);
var ArrayHelper = __webpack_require__(3);
var NewArrayMat = (function () {
    function NewArrayMat(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    NewArrayMat.prototype.identityArray = function () {
        var _a = this, r = _a.rows, c = _a.cols;
        var arr = ArrayHelper.fill(Array(r * c), 0);
        for (var i = 0; i < Math.min(r, c); i++)
            arr[i * r + i] = 1;
        return arr;
    };
    Object.defineProperty(NewArrayMat.prototype, "zero", {
        get: function () {
            var _a = this, r = _a.rows, c = _a.cols;
            return new ArrayMat(ArrayHelper.fill(Array(r * c), 0), r, c);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NewArrayMat.prototype, "identity", {
        get: function () {
            return new ArrayMat(this.identityArray(), this.rows, this.cols);
        },
        enumerable: true,
        configurable: true
    });
    NewArrayMat.prototype.translation = function (offsets) {
        var _a = this, r = _a.rows, c = _a.cols;
        var offs = offsets instanceof Array ? offsets : offsets.toArray();
        if (offs.length > r)
            throw RangeError("Too many offsets for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var lastCol = c - 1;
        for (var i = 0; i < Math.min(offs.length, r - 1); i++)
            res[lastCol * r + i] = offs[i];
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.scaling = function (factors) {
        var _a = this, r = _a.rows, c = _a.cols;
        var facs = factors instanceof Array ? factors : factors.toArray();
        if (facs.length > r)
            throw RangeError("Too many factors for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        for (var i = 0; i < Math.min(facs.length, r, c); i++)
            res[i * r + i] = facs[i];
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationX = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        if (r < 3 || c < 3)
            throw RangeError("Rotation around X-axis not defined for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[r + 1] = cosa;
        res[r + 2] = sina;
        res[2 * r + 1] = -sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationY = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        if (r < 3 || c < 3)
            throw RangeError("Rotation around Y-axis not defined for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationZ = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.perspective = function (left, right, bottom, top, zNear, zFar) {
        if (zNear <= 0 || zNear >= zFar)
            throw RangeError("zNear needs to be positive and smaller thatn zFar");
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;
        return new ArrayMat([(2.0 * zNear) / width, 0, 0, 0,
            0, (2.0 * zNear) / height, 0, 0,
            (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
            0, 0, -(2.0 * zFar * zNear) / depth, 0], 4, 4);
    };
    NewArrayMat.prototype.orthographic = function (left, right, bottom, top, zNear, zFar) {
        var invWidth = 1.0 / (right - left);
        var invHeight = 1.0 / (top - bottom);
        var invDepth = 1.0 / (zFar - zNear);
        return new ArrayMat([2 * invWidth, 0, 0, 0,
            0, 2 * invHeight, 0, 0,
            0, 0, -2 * invDepth, 0,
            -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1], 4, 4);
    };
    NewArrayMat.prototype.lookAt = function (direction, up) {
        var zaxis = direction.inv().norm();
        var xaxis = up.cross(zaxis).norm();
        var yaxis = zaxis.cross(xaxis);
        return new ArrayMat([xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1], 4, 4);
    };
    NewArrayMat.prototype.fromArray = function (array, rows, cols) {
        return new ArrayMat(array, rows, cols);
    };
    return NewArrayMat;
}());
exports.newMat2 = new NewArrayMat(2, 2);
exports.newMat3 = new NewArrayMat(3, 3);
exports.newMat4 = new NewArrayMat(4, 4);
var ArrayMat = (function () {
    function ArrayMat(values, rows, columns) {
        if (values.length !== rows * columns)
            throw RangeError("Array length has to be equeal rows * columns.");
        this.array = values;
        this.rows = rows;
        this.cols = columns;
    }
    ArrayMat.prototype.element = function (row, column) {
        return this.array[column * this.rows + row];
    };
    ArrayMat.prototype.map = function (oper) {
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    };
    ArrayMat.prototype.map2 = function (other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }), this.cols, this.rows);
    };
    ArrayMat.prototype.matrixMultiply = function (other) {
        var n = this.rows;
        var m = this.cols;
        var q = other.rows;
        var p = other.cols;
        if (m !== q)
            throw RangeError("Cannot multiply " + n + "x" + m + " matrix with " + q + "x" + p + " matrix.");
        var res = Array(n * p);
        // Iterate through rows and columns
        for (var i = 0; i < n; i++)
            for (var j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                var val = 0;
                for (var k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new ArrayMat(res, n, p);
    };
    ArrayMat.prototype.add = function (other) {
        return other instanceof ArrayMat ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    ArrayMat.prototype.sub = function (other) {
        return other instanceof ArrayMat ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    ArrayMat.prototype.mul = function (other) {
        return other instanceof ArrayMat ?
            this.matrixMultiply(other) :
            this.map(function (x) { return x * other; });
    };
    ArrayMat.prototype.transform = function (other) {
        var vecm = new ArrayMat(other.toArray(), this.cols, 1);
        return other.newVec().fromArray(this.matrixMultiply(vecm).array);
    };
    ArrayMat.prototype.transpose = function () {
        var rows = this.cols;
        var cols = this.rows;
        var res = Array(this.array.length);
        var ind = 0;
        for (var i = 0; i < rows; i++)
            for (var j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new ArrayMat(res, rows, cols);
    };
    ArrayMat.prototype.determinant = function () {
        return this.determinantFA();
    };
    ArrayMat.prototype.invert = function () {
        return ArrayMat.fromJaggedArray(this.inverseFA());
    };
    ArrayMat.prototype.toJaggedArray = function () {
        var _a = this, rows = _a.rows, cols = _a.cols, array = _a.array;
        var res = Array(rows);
        for (var r = 0; r < rows; r++) {
            res[r] = Array(cols);
            for (var c = 0; c < cols; c++)
                res[r][c] = array[c * rows + r];
        }
        return res;
    };
    ArrayMat.fromJaggedArray = function (matrix) {
        var rows = matrix.length;
        var cols = matrix[0].length;
        var arr = Array(cols * rows);
        var i = 0;
        for (var c = 0; c < cols; c++)
            for (var r = 0; r < rows; r++)
                arr[i++] = matrix[r][c];
        return new ArrayMat(arr, rows, cols);
    };
    ArrayMat.prototype.decomposeFA = function (matrix) {
        var _a = this, rows = _a.rows, cols = _a.cols;
        if (rows != cols)
            throw RangeError("Cannot decompose non-square matrix");
        // set up row permutation result
        var perm = Array(rows);
        for (var i = 0; i < rows; i++)
            perm[i] = i;
        // toggle tracks row swaps. +1 -> even, -1 -> odd. used by MatrixDeterminant
        var toggle = 1;
        for (var c = 0; c < cols - 1; c++) {
            var colMax = Math.abs(matrix[c][c]); // find largest value in col j
            var pRow = c;
            for (var r = c + 1; r < rows; r++)
                if (matrix[r][c] > colMax) {
                    colMax = matrix[r][c];
                    pRow = r;
                }
            if (pRow != c) {
                // if largest value not on pivot, swap rows
                var rowPtr = matrix[pRow];
                matrix[pRow] = matrix[c];
                matrix[c] = rowPtr;
                // and swap perm info
                var tmp = perm[pRow];
                perm[pRow] = perm[c];
                perm[c] = tmp;
                // adjust the row-swap toggle
                toggle = -toggle;
            }
            // handle the case where the input matrix is singular
            if (matrix[c][c] == 0)
                matrix[c][c] = 0.000001;
            for (var r = c + 1; r < rows; r++) {
                matrix[r][c] /= matrix[c][c];
                for (var k = c + 1; k < cols; k++)
                    matrix[r][k] -= matrix[r][c] * matrix[c][k];
            }
        }
        return [perm, toggle];
    };
    ArrayMat.prototype.determinantFA = function () {
        var matrix = this.toJaggedArray();
        var result = this.decomposeFA(matrix)[1];
        for (var i = 0; i < matrix.length; i++)
            result *= matrix[i][i];
        return result;
    };
    ArrayMat.prototype.inverseFA = function () {
        var matrix = this.toJaggedArray();
        var rows = matrix.length;
        var result = ArrayHelper.clone(matrix);
        var perm = this.decomposeFA(matrix)[0];
        var b = Array(rows);
        for (var c = 0; c < rows; c++) {
            for (var r = 0; r < rows; r++)
                b[r] = c == perm[r] ? 1 : 0;
            var x = ArrayMat.helperSolvef(matrix, b);
            for (var r = 0; r < rows; r++)
                result[r][c] = x[r];
        }
        return result;
    };
    ArrayMat.helperSolvef = function (luMatrix, vector) {
        // before calling this helper, permute b using the perm array from 
        // MatrixDecompose that generated luMatrix
        var rows = luMatrix.length;
        var res = vector.slice();
        for (var r = 1; r < rows; r++) {
            var sum = res[r];
            for (var c = 0; c < r; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum;
        }
        res[rows - 1] /= luMatrix[rows - 1][rows - 1];
        for (var r = rows - 2; r >= 0; r--) {
            var sum = res[r];
            for (var c = r + 1; c < rows; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum / luMatrix[r][r];
        }
        return res;
    };
    ArrayMat.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    ArrayMat.prototype.approxEquals = function (other, epsilon) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    ArrayMat.prototype.toString = function () {
        var res = "";
        for (var r = 0; r < this.rows; r++) {
            res += "[ ";
            for (var c = 0; c < this.cols; c++)
                res += this.element(r, c) + " ";
            res += "]\n";
        }
        return res;
    };
    ArrayMat.prototype.toArray = function () {
        return this.array;
    };
    ArrayMat.prototype.toFloat32Array = function () {
        return new Float32Array(this.array);
    };
    return ArrayMat;
}());


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function approxEquals(x, y, epsilon) {
    if (epsilon === void 0) { epsilon = 0.000001; }
    if (x === y)
        return true;
    var absX = Math.abs(x);
    var absY = Math.abs(y);
    var diff = Math.abs(x - y);
    if (x * y == 0)
        return diff < (epsilon * epsilon);
    else
        return diff / (absX + absY) < epsilon;
}
exports.approxEquals = approxEquals;
function fract(x) {
    return x - Math.floor(x);
}
exports.fract = fract;
function clamp(x, min, max) {
    return x < min ? min :
        x > max ? max :
            x;
}
exports.clamp = clamp;
function mix(start, end, interPos) {
    return start + (interPos * (end - start));
}
exports.mix = mix;
function step(edge, value) {
    return value < edge ? 0 : 1;
}
exports.step = step;
function smoothStep(edgeLower, edgeUpper, value) {
    var t = clamp((value - edgeLower) / (edgeUpper - edgeLower), 0, 1);
    return t * t * (3 - (2 * t));
}
exports.smoothStep = smoothStep;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function clone(array) {
    var rows = array.length;
    var res = Array(rows);
    for (var r = 0; r < rows; r++)
        res[r] = array[r].slice();
    return res;
}
exports.clone = clone;
function fill(array, value) {
    for (var i = 0; i < array.length; i++)
        array[i] = value;
    return array;
}
exports.fill = fill;
function repeat(value, count) {
    var res = Array(count);
    for (var i = 0; i < count; i++)
        res[i] = value;
    return res;
}
exports.repeat = repeat;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = " attribute vec4 aVertexPosition;\r\n varying highp vec3 position;\r\n \r\n uniform mat4 uModelViewMatrix;\r\n uniform mat4 uProjectionMatrix;\r\n\r\nvoid main() {\r\n    position = max(aVertexPosition.xyz, vec3(0));\r\n    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\r\n }\r\n"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "varying highp vec3 position;\r\n\r\nvoid main() { \r\n    gl_FragColor = vec4(position, 1.0);\r\n}\r\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2U4Njk5MGZhZjU3NWFmYzdjOTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FycmF5TWF0LnRzIiwid2VicGFjazovLy8uL3NyYy9GTWF0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQXJyYXlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYWRlcnMvc2ltcGxlLnZlcnQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYWRlcnMvc2ltcGxlLmZyYWciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7O0FDM0RBLHdDQUFvQztBQUVwQyx3QkFBd0I7QUFDeEIsSUFBTSxRQUFRLEdBQVcsbUJBQU8sQ0FBRSxDQUF1QixDQUFDO0FBQzFELElBQU0sUUFBUSxHQUFXLG1CQUFPLENBQUUsQ0FBdUIsQ0FBQztBQUUxRCxFQUFFO0FBQ0YsbUVBQW1FO0FBQ25FLEVBQUU7QUFDRiwyQkFBMkIsRUFBeUIsRUFBRSxRQUFnQixFQUFFLFFBQWdCO0lBRXBGLElBQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRSxJQUFNLGNBQWMsR0FB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RSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQ3ZGLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsNEJBQU0sR0FBTixVQUFRLFNBQWUsRUFBRSxFQUFRO1FBRTdCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUM7UUFFL0IsTUFBTSxDQUFDLElBQUksUUFBUSxDQUNmLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM3QixLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVCLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDNUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsK0JBQVMsR0FBVCxVQUFXLEtBQWUsRUFBRSxJQUFZLEVBQUUsSUFBWTtRQUVsRCxNQUFNLENBQUMsSUFB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QixNQUFNLENBQUMsR0FBRztBQUNkLENBQUM7QUFQRCxzQkFPQztBQUVELGNBQXlCLEtBQVUsRUFBRSxLQUFRO0lBRXpDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDakMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUs7SUFDcEIsTUFBTSxDQUFDLEtBQUs7QUFDaEIsQ0FBQztBQUxELG9CQUtDO0FBRUQsZ0JBQTJCLEtBQVEsRUFBRSxLQUFhO0lBRTlDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBSyxLQUFLLENBQUM7SUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLO0lBQ2xCLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDZixDQUFDO0FBTkQsd0JBTUM7Ozs7Ozs7QUN0QkQsa0RBQWtELGlDQUFpQyx3Q0FBd0Msb0NBQW9DLHFCQUFxQixxREFBcUQsNkVBQTZFLE1BQU0sSzs7Ozs7O0FDQTVULDhDQUE4QyxxQkFBcUIsNENBQTRDLEtBQUssSyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZTg2OTkwZmFmNTc1YWZjN2M5MyIsImltcG9ydCB7IE5ld1ZlYywgVmVjMywgVmVjNCB9IGZyb20gXCIuL1ZlY3RvcnNcIlxyXG5pbXBvcnQgeyBOZXdNYXQ0LCBNYXQ0IH0gZnJvbSBcIi4vTWF0cmljZXNcIlxyXG5pbXBvcnQgeyBuZXdNYXQ0IH0gZnJvbSBcIi4vQXJyYXlNYXRcIlxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS52ZXJ0JylcclxuY29uc3QgZnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLmZyYWcnKVxyXG5cclxuLy9cclxuLy8gSW5pdGlhbGl6ZSBhIHNoYWRlciBwcm9ncmFtLCBzbyBXZWJHTCBrbm93cyBob3cgdG8gZHJhdyBvdXIgZGF0YVxyXG4vL1xyXG5mdW5jdGlvbiBpbml0U2hhZGVyUHJvZ3JhbShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2c1NvdXJjZTogc3RyaW5nLCBmc1NvdXJjZTogc3RyaW5nKTogV2ViR0xQcm9ncmFtIHwgbnVsbCBcclxue1xyXG4gICAgY29uc3QgdmVydGV4U2hhZGVyID0gbG9hZFNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnNTb3VyY2UpO1xyXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBsb2FkU2hhZGVyKGdsLCBnbC5GUkFHTUVOVF9TSEFERVIsIGZzU291cmNlKTtcclxuICBcclxuICAgIC8vIENyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cclxuICBcclxuICAgIGNvbnN0IHNoYWRlclByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICBnbC5hdHRhY2hTaGFkZXIoc2hhZGVyUHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcclxuICAgIGdsLmF0dGFjaFNoYWRlcihzaGFkZXJQcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgICBnbC5saW5rUHJvZ3JhbShzaGFkZXJQcm9ncmFtKTtcclxuICBcclxuICAgIC8vIElmIGNyZWF0aW5nIHRoZSBzaGFkZXIgcHJvZ3JhbSBmYWlsZWQsIGFsZXJ0XHJcbiAgXHJcbiAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIoc2hhZGVyUHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgIGFsZXJ0KCdVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW06ICcgKyBnbC5nZXRQcm9ncmFtSW5mb0xvZyhzaGFkZXJQcm9ncmFtKSk7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHNoYWRlclByb2dyYW07XHJcbiAgfVxyXG4gIFxyXG4gIC8vXHJcbiAgLy8gY3JlYXRlcyBhIHNoYWRlciBvZiB0aGUgZ2l2ZW4gdHlwZSwgdXBsb2FkcyB0aGUgc291cmNlIGFuZFxyXG4gIC8vIGNvbXBpbGVzIGl0LlxyXG4gIC8vXHJcbmZ1bmN0aW9uIGxvYWRTaGFkZXIoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogbnVtYmVyLCBzb3VyY2U6IHN0cmluZyk6IFdlYkdMU2hhZGVyIHwgbnVsbFxyXG57XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgXHJcbiAgICAvLyBTZW5kIHRoZSBzb3VyY2UgdG8gdGhlIHNoYWRlciBvYmplY3RcclxuICBcclxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgXHJcbiAgICAvLyBDb21waWxlIHRoZSBzaGFkZXIgcHJvZ3JhbVxyXG4gIFxyXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gIFxyXG4gICAgLy8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxyXG4gIFxyXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgYWxlcnQoJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJyArIGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcbiAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiBzaGFkZXI7XHJcbn1cclxuXHJcbmludGVyZmFjZSBCdWZmZXJzIFxyXG57IFxyXG4gICAgcG9zaXRpb246IFdlYkdMQnVmZmVyIFxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0QnVmZmVycyhnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogQnVmZmVycyB8IG51bGxcclxue1xyXG4gICAgICAvLyBDcmVhdGUgYSBidWZmZXIgZm9yIHRoZSBzcXVhcmUncyBwb3NpdGlvbnMuXHJcbiAgICBcclxuICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgaWYgKHBvc2l0aW9uQnVmZmVyID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBcclxuICAgICAgLy8gU2VsZWN0IHRoZSBwb3NpdGlvbkJ1ZmZlciBhcyB0aGUgb25lIHRvIGFwcGx5IGJ1ZmZlclxyXG4gICAgICAvLyBvcGVyYXRpb25zIHRvIGZyb20gaGVyZSBvdXQuXHJcbiAgICBcclxuICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIFxyXG4gICAgICAvLyBOb3cgY3JlYXRlIGFuIGFycmF5IG9mIHBvc2l0aW9ucyBmb3IgdGhlIHNxdWFyZS5cclxuICAgIFxyXG4gICAgICBjb25zdCBwb3NpdGlvbnMgPSBbXHJcbiAgICAgICAgIDEuMCwgIDEuMCxcclxuICAgICAgICAtMS4wLCAgMS4wLFxyXG4gICAgICAgICAxLjAsIC0xLjAsXHJcbiAgICAgICAgLTEuMCwgLTEuMCxcclxuICAgICAgXTtcclxuICAgIFxyXG4gICAgICAvLyBOb3cgcGFzcyB0aGUgbGlzdCBvZiBwb3NpdGlvbnMgaW50byBXZWJHTCB0byBidWlsZCB0aGVcclxuICAgICAgLy8gc2hhcGUuIFdlIGRvIHRoaXMgYnkgY3JlYXRpbmcgYSBGbG9hdDMyQXJyYXkgZnJvbSB0aGVcclxuICAgICAgLy8gSmF2YVNjcmlwdCBhcnJheSwgdGhlbiB1c2UgaXQgdG8gZmlsbCB0aGUgY3VycmVudCBidWZmZXIuXHJcbiAgICBcclxuICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXKTtcclxuICAgIFxyXG4gICAgICByZXR1cm4geyBwb3NpdGlvbjogcG9zaXRpb25CdWZmZXIgfTtcclxufVxyXG5cclxuaW50ZXJmYWNlIFByb2dyYW1JbmZvIHtcclxuICAgIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIGF0dHJpYkxvY2F0aW9uczoge1xyXG4gICAgICAgIHZlcnRleFBvc2l0aW9uOiBudW1iZXI7XHJcbiAgICB9O1xyXG4gICAgdW5pZm9ybUxvY2F0aW9uczoge1xyXG4gICAgICAgIHByb2plY3Rpb25NYXRyaXg6IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xyXG4gICAgICAgIG1vZGVsVmlld01hdHJpeDogV2ViR0xVbmlmb3JtTG9jYXRpb247XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3U2NlbmUoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbUluZm86IFByb2dyYW1JbmZvLCBidWZmZXJzOiBCdWZmZXJzKSBcclxue1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApOyAgLy8gQ2xlYXIgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG4gICAgZ2wuY2xlYXJEZXB0aCgxLjApOyAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xyXG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpOyAgICAgICAgICAgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcclxuICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpOyAgICAgICAgICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xyXG4gIFxyXG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuICBcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuICBcclxuICAgIC8vIENyZWF0ZSBhIHBlcnNwZWN0aXZlIG1hdHJpeCwgYSBzcGVjaWFsIG1hdHJpeCB0aGF0IGlzXHJcbiAgICAvLyB1c2VkIHRvIHNpbXVsYXRlIHRoZSBkaXN0b3J0aW9uIG9mIHBlcnNwZWN0aXZlIGluIGEgY2FtZXJhLlxyXG4gICAgLy8gT3VyIGZpZWxkIG9mIHZpZXcgaXMgNDUgZGVncmVlcywgd2l0aCBhIHdpZHRoL2hlaWdodFxyXG4gICAgLy8gcmF0aW8gdGhhdCBtYXRjaGVzIHRoZSBkaXNwbGF5IHNpemUgb2YgdGhlIGNhbnZhc1xyXG4gICAgLy8gYW5kIHdlIG9ubHkgd2FudCB0byBzZWUgb2JqZWN0cyBiZXR3ZWVuIDAuMSB1bml0c1xyXG4gICAgLy8gYW5kIDEwMCB1bml0cyBhd2F5IGZyb20gdGhlIGNhbWVyYS5cclxuICBcclxuICAgIGNvbnN0IHByb2plY3Rpb25NYXRyaXggPSBuZXdNYXQ0LnBlcnNwZWN0aXZlICgtMSwgMSwgLTEsIDEsIDEsIDEwMClcclxuICBcclxuICAgIC8vIFNldCB0aGUgZHJhd2luZyBwb3NpdGlvbiB0byB0aGUgXCJpZGVudGl0eVwiIHBvaW50LCB3aGljaCBpc1xyXG4gICAgLy8gdGhlIGNlbnRlciBvZiB0aGUgc2NlbmUuXHJcbiAgICBjb25zdCBtb2RlbFZpZXdNYXRyaXggPSBuZXdNYXQ0LnRyYW5zbGF0aW9uIChbMC4wLCAwLjAsIC00LjBdKVxyXG4gIFxyXG4gICAgLy8gVGVsbCBXZWJHTCBob3cgdG8gcHVsbCBvdXQgdGhlIHBvc2l0aW9ucyBmcm9tIHRoZSBwb3NpdGlvblxyXG4gICAgLy8gYnVmZmVyIGludG8gdGhlIHZlcnRleFBvc2l0aW9uIGF0dHJpYnV0ZS5cclxuICAgIHtcclxuICAgICAgY29uc3QgbnVtQ29tcG9uZW50cyA9IDI7ICAvLyBwdWxsIG91dCAyIHZhbHVlcyBwZXIgaXRlcmF0aW9uXHJcbiAgICAgIGNvbnN0IHR5cGUgPSBnbC5GTE9BVDsgICAgLy8gdGhlIGRhdGEgaW4gdGhlIGJ1ZmZlciBpcyAzMmJpdCBmbG9hdHNcclxuICAgICAgY29uc3Qgbm9ybWFsaXplID0gZmFsc2U7ICAvLyBkb24ndCBub3JtYWxpemVcclxuICAgICAgY29uc3Qgc3RyaWRlID0gMDsgICAgICAgICAvLyBob3cgbWFueSBieXRlcyB0byBnZXQgZnJvbSBvbmUgc2V0IG9mIHZhbHVlcyB0byB0aGUgbmV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgPSB1c2UgdHlwZSBhbmQgbnVtQ29tcG9uZW50cyBhYm92ZVxyXG4gICAgICBjb25zdCBvZmZzZXQgPSAwOyAgICAgICAgIC8vIGhvdyBtYW55IGJ5dGVzIGluc2lkZSB0aGUgYnVmZmVyIHRvIHN0YXJ0IGZyb21cclxuICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcnMucG9zaXRpb24pO1xyXG4gICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICAgICAgcHJvZ3JhbUluZm8uYXR0cmliTG9jYXRpb25zLnZlcnRleFBvc2l0aW9uLFxyXG4gICAgICAgICAgbnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICBub3JtYWxpemUsXHJcbiAgICAgICAgICBzdHJpZGUsXHJcbiAgICAgICAgICBvZmZzZXQpO1xyXG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShcclxuICAgICAgICAgIHByb2dyYW1JbmZvLmF0dHJpYkxvY2F0aW9ucy52ZXJ0ZXhQb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgXHJcbiAgICAvLyBUZWxsIFdlYkdMIHRvIHVzZSBvdXIgcHJvZ3JhbSB3aGVuIGRyYXdpbmdcclxuICBcclxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbUluZm8ucHJvZ3JhbSk7XHJcbiAgXHJcbiAgICAvLyBTZXQgdGhlIHNoYWRlciB1bmlmb3Jtc1xyXG4gIFxyXG4gICAgZ2wudW5pZm9ybU1hdHJpeDRmdihcclxuICAgICAgICBwcm9ncmFtSW5mby51bmlmb3JtTG9jYXRpb25zLnByb2plY3Rpb25NYXRyaXgsXHJcbiAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgcHJvamVjdGlvbk1hdHJpeC50b0Zsb2F0MzJBcnJheSAoKSk7XHJcbiAgICBnbC51bmlmb3JtTWF0cml4NGZ2KFxyXG4gICAgICAgIHByb2dyYW1JbmZvLnVuaWZvcm1Mb2NhdGlvbnMubW9kZWxWaWV3TWF0cml4LFxyXG4gICAgICAgIGZhbHNlLFxyXG4gICAgICAgIG1vZGVsVmlld01hdHJpeC50b0Zsb2F0MzJBcnJheSAoKSk7XHJcbiAgXHJcbiAgICB7XHJcbiAgICAgIGNvbnN0IG9mZnNldCA9IDA7XHJcbiAgICAgIGNvbnN0IHZlcnRleENvdW50ID0gNDtcclxuICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRV9TVFJJUCwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuaWZMb2NhdGlvbiAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbTogV2ViR0xQcm9ncmFtLCB1bmlmTmFtZTogc3RyaW5nKTogXHJcbiAgICBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG57XHJcbiAgICB2YXIgcmVzID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcm9ncmFtLCB1bmlmTmFtZSlcclxuICAgIGlmIChyZXMgPT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgRXJyb3IgKGBVbmlmb3JtICR7dW5pZk5hbWV9IG5vdCBmb3VuZCBpbiBwcm9ncmFtYClcclxuICAgIHJldHVybiByZXNcclxufVxyXG5cclxuLy9cclxuLy8gc3RhcnQgaGVyZVxyXG4vL1xyXG5mdW5jdGlvbiBtYWluKCkgXHJcbntcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2xDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHTCBjb250ZXh0XHJcbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4gICAgLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuICAgIGlmICghZ2wpIHtcclxuICAgICAgICBhbGVydChcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHNoYWRlclByb2dyYW0gPSBpbml0U2hhZGVyUHJvZ3JhbShnbCwgdnNTb3VyY2UsIGZzU291cmNlKTtcclxuICAgIGlmICghc2hhZGVyUHJvZ3JhbSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBjb25zdCBwcm9ncmFtSW5mbzogUHJvZ3JhbUluZm8gPSBcclxuICAgIHtcclxuICAgICAgICBwcm9ncmFtOiBzaGFkZXJQcm9ncmFtLFxyXG4gICAgICAgIGF0dHJpYkxvY2F0aW9uczogXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2ZXJ0ZXhQb3NpdGlvbjogZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgJ2FWZXJ0ZXhQb3NpdGlvbicpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdW5pZm9ybUxvY2F0aW9uczogXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uTWF0cml4OiB1bmlmTG9jYXRpb24oZ2wsIHNoYWRlclByb2dyYW0sICd1UHJvamVjdGlvbk1hdHJpeCcpLFxyXG4gICAgICAgICAgICBtb2RlbFZpZXdNYXRyaXg6IHVuaWZMb2NhdGlvbihnbCwgc2hhZGVyUHJvZ3JhbSwgJ3VNb2RlbFZpZXdNYXRyaXgnKSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG5cclxuICAgIGNvbnN0IGJ1ZmZlcnMgPSBpbml0QnVmZmVycyhnbCk7XHJcbiAgICBpZiAoIWJ1ZmZlcnMpXHJcbiAgICAgIHJldHVybjtcclxuICAgIGRyYXdTY2VuZSAoZ2wsIHByb2dyYW1JbmZvLCBidWZmZXJzKTsgIFxyXG59XHJcblxyXG5tYWluKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01haW4udHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTmV3TWF0NCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcbmltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4vQXJyYXlIZWxwZXJcIjtcclxuXHJcbmNsYXNzIE5ld0FycmF5TWF0IGltcGxlbWVudHMgTmV3TWF0PE1hdDIsIFZlYzI+LCBOZXdNYXQ8TWF0MywgVmVjMz4sIE5ld01hdDRcclxue1xyXG4gICAgcmVhZG9ubHkgcm93czogbnVtYmVyXHJcbiAgICByZWFkb25seSBjb2xzOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3dzOiBudW1iZXIsIGNvbHM6IG51bWJlcikgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gcm93c1xyXG4gICAgICAgIHRoaXMuY29scyA9IGNvbHNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlkZW50aXR5QXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHIgKiBjKSwgMClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChyLCBjKTsgaSsrKSBcclxuICAgICAgICAgICAgYXJyW2kgKiByICsgaV0gPSAxXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+KHIgKiBjKSwgMCksIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkZW50aXR5ICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmlkZW50aXR5QXJyYXkgKCksIHRoaXMucm93cywgdGhpcy5jb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0aW9uIChvZmZzZXRzOiBudW1iZXJbXXxWZWMyfFZlYzN8VmVjNCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzID0gb2Zmc2V0cyBpbnN0YW5jZW9mIEFycmF5ID8gb2Zmc2V0cyA6IG9mZnNldHMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChvZmZzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBvZmZzZXRzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBsYXN0Q29sID0gYyAtIDFcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChvZmZzLmxlbmd0aCwgciAtIDEpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbbGFzdENvbCAqIHIgKyBpXSA9IG9mZnNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGluZyAoZmFjdG9yczogbnVtYmVyW118VmVjMnxWZWMzfFZlYzQpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgZmFjcyA9IGZhY3RvcnMgaW5zdGFuY2VvZiBBcnJheSA/IGZhY3RvcnMgOmZhY3RvcnMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChmYWNzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBmYWN0b3JzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKGZhY3MubGVuZ3RoLCByLCBjKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2kgKiByICsgaV0gPSBmYWNzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWCAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBYLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2FcclxuICAgICAgICByZXNbciArIDJdID0gc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDFdID0gLXNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2FcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25ZIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFktYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1syXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1syICogcl0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25aIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzFdID0gc2luYTtcclxuICAgICAgICByZXNbcl0gPSAtc2luYTtcclxuICAgICAgICByZXNbciArIDFdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcGVyc3BlY3RpdmUgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBpZiAoek5lYXIgPD0gMCB8fCB6TmVhciA+PSB6RmFyKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcInpOZWFyIG5lZWRzIHRvIGJlIHBvc2l0aXZlIGFuZCBzbWFsbGVyIHRoYXRuIHpGYXJcIilcclxuICAgICAgICBsZXQgd2lkdGggPSByaWdodCAtIGxlZnRcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdG9wIC0gYm90dG9tXHJcbiAgICAgICAgbGV0IGRlcHRoID0gekZhciAtIHpOZWFyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsoMi4wICogek5lYXIpIC8gd2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsICgyLjAgKiB6TmVhcikgLyBoZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIChyaWdodCArIGxlZnQpIC8gd2lkdGgsICh0b3AgKyBib3R0b20pIC8gaGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgLyBkZXB0aCwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsIC0oMi4wICogekZhciAqIHpOZWFyKSAvIGRlcHRoLCAwXSwgXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgb3J0aG9ncmFwaGljIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGludldpZHRoID0gMS4wIC8gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBsZXQgaW52SGVpZ2h0ID0gMS4wIC8gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBsZXQgaW52RGVwdGggPSAxLjAgLyAoekZhciAtIHpOZWFyKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbMiAqIGludldpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAyICogaW52SGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAtMiAqIGludkRlcHRoLCAwLFxyXG4gICAgICAgICAgICAtKHJpZ2h0ICsgbGVmdCkgKiBpbnZXaWR0aCwgLSh0b3AgKyBib3R0b20pICogaW52SGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgKiBpbnZEZXB0aCwgMV0sXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0IChkaXJlY3Rpb246IFZlYzMsIHVwOiBWZWMzKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB6YXhpcyA9IGRpcmVjdGlvbi5pbnYgKCkubm9ybSAoKVxyXG4gICAgICAgIGxldCB4YXhpcyA9IHVwLmNyb3NzICh6YXhpcykubm9ybSAoKVxyXG4gICAgICAgIGxldCB5YXhpcyA9IHpheGlzLmNyb3NzICh4YXhpcylcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFt4YXhpcy54LCB5YXhpcy54LCB6YXhpcy54LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy55LCB5YXhpcy55LCB6YXhpcy55LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy56LCB5YXhpcy56LCB6YXhpcy56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXSwgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyYXksIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQyOiBOZXdNYXQ8TWF0MiwgVmVjMj4gPSBuZXcgTmV3QXJyYXlNYXQgKDIsIDIpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQzOiBOZXdNYXQ8TWF0MywgVmVjMz4gPSBuZXcgTmV3QXJyYXlNYXQgKDMsIDMpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQ0OiBOZXdNYXQ0ID0gbmV3IE5ld0FycmF5TWF0ICg0LCA0KVxyXG5cclxuY2xhc3MgQXJyYXlNYXQgaW1wbGVtZW50cyBNYXQyLCBNYXQzLCBNYXQ0XHJcbntcclxuICAgIHJlYWRvbmx5IHJvd3M6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY29sczogbnVtYmVyXHJcblxyXG4gICAgcHJpdmF0ZSBhcnJheTogbnVtYmVyW11cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHZhbHVlczogbnVtYmVyW10sIHJvd3M6IG51bWJlciwgY29sdW1uczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPT0gcm93cyAqY29sdW1ucylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJBcnJheSBsZW5ndGggaGFzIHRvIGJlIGVxdWVhbCByb3dzICogY29sdW1ucy5cIikgXHJcbiAgICAgICAgdGhpcy5hcnJheSA9IHZhbHVlc1xyXG4gICAgICAgIHRoaXMucm93cyA9IHJvd3NcclxuICAgICAgICB0aGlzLmNvbHMgPSBjb2x1bW5zICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAob3RoZXI6IFYpOiBWXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKG90aGVyLnRvQXJyYXkgKCksIHRoaXMuY29scywgMSlcclxuICAgICAgICByZXR1cm4gb3RoZXIubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQXJyYXlNYXQudHMiLCJleHBvcnQgZnVuY3Rpb24gYXBwcm94RXF1YWxzICh4OiBudW1iZXIsIHk6IG51bWJlciwgXHJcbiAgICBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSkgOiBib29sZWFuXHJcbntcclxuICAgIGlmICh4ID09PSB5KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIGxldCBhYnNYID0gTWF0aC5hYnMgKHgpO1xyXG4gICAgbGV0IGFic1kgPSBNYXRoLmFicyAoeSk7XHJcbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzICh4IC0geSk7XHJcblxyXG4gICAgaWYgKHggKiB5ID09IDApXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgPCAoZXBzaWxvbiAqIGVwc2lsb24pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBkaWZmIC8gKGFic1ggKyBhYnNZKSA8IGVwc2lsb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcmFjdCAoeDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IC0gTWF0aC5mbG9vciAoeCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCAoeDogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggPCBtaW4gPyBtaW4gOlxyXG4gICAgICAgICAgIHggPiBtYXggPyBtYXggOlxyXG4gICAgICAgICAgIHg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXggKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBpbnRlclBvczogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiBzdGFydCArIChpbnRlclBvcyAqIChlbmQgLSBzdGFydCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RlcCAoZWRnZTogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB2YWx1ZSA8IGVkZ2UgPyAwIDogMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICBsZXQgdCA9IGNsYW1wICgodmFsdWUgLSBlZGdlTG93ZXIpIC8gKGVkZ2VVcHBlciAtIGVkZ2VMb3dlciksIDAsIDEpO1xyXG4gICAgcmV0dXJuIHQgKiB0ICogKDMgLSAoMiAqIHQpKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9GTWF0aC50cyIsImV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUPiAoYXJyYXk6IFRbXVtdKTogVFtdW11cclxue1xyXG4gICAgbGV0IHJvd3MgPSBhcnJheS5sZW5ndGhcclxuICAgIGxldCByZXMgPSBBcnJheTxUW10+KHJvd3MpXHJcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICByZXNbcl0gPSBhcnJheVtyXS5zbGljZSAoKVxyXG4gICAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbDxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpOiBUW11cclxue1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcclxuICAgICAgICBhcnJheVtpXSA9IHZhbHVlXHJcbiAgICByZXR1cm4gYXJyYXlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPiAodmFsdWU6IFQsIGNvdW50OiBudW1iZXIpOiBUW11cclxue1xyXG4gICAgdmFyIHJlcyA9IEFycmF5PFQ+IChjb3VudClcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICByZXNbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQXJyYXlIZWxwZXIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiIGF0dHJpYnV0ZSB2ZWM0IGFWZXJ0ZXhQb3NpdGlvbjtcXHJcXG4gdmFyeWluZyBoaWdocCB2ZWMzIHBvc2l0aW9uO1xcclxcbiBcXHJcXG4gdW5pZm9ybSBtYXQ0IHVNb2RlbFZpZXdNYXRyaXg7XFxyXFxuIHVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXHJcXG5cXHJcXG52b2lkIG1haW4oKSB7XFxyXFxuICAgIHBvc2l0aW9uID0gbWF4KGFWZXJ0ZXhQb3NpdGlvbi54eXosIHZlYzMoMCkpO1xcclxcbiAgICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdU1vZGVsVmlld01hdHJpeCAqIGFWZXJ0ZXhQb3NpdGlvbjtcXHJcXG4gfVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUudmVydFxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwidmFyeWluZyBoaWdocCB2ZWMzIHBvc2l0aW9uO1xcclxcblxcclxcbnZvaWQgbWFpbigpIHsgXFxyXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQocG9zaXRpb24sIDEuMCk7XFxyXFxufVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUuZnJhZ1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9