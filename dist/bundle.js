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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function approxEquals(x, y, epsilon = 0.000001) {
    if (x === y)
        return true;
    let absX = Math.abs(x);
    let absY = Math.abs(y);
    let diff = Math.abs(x - y);
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
    let t = clamp((value - edgeLower) / (edgeUpper - edgeLower), 0, 1);
    return t * t * (3 - (2 * t));
}
exports.smoothStep = smoothStep;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FMath_1 = __webpack_require__(0);
function clone(array) {
    let rows = array.length;
    let res = Array(rows);
    for (let r = 0; r < rows; r++)
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
function maxItems(array, selector) {
    let res = [];
    let max = Number.MAX_VALUE;
    for (let item of array) {
        var value = selector(item);
        if (value > max) {
            max = value;
            res = [item];
        }
        else if (FMath_1.approxEquals(value, max))
            res.push(item);
    }
    return res;
}
exports.maxItems = maxItems;
function sum(array) {
    let res = 0;
    for (var item of array)
        res += item;
    return res;
}
exports.sum = sum;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class VertexAttr {
    constructor(name, type, numComponents, getter) {
        this.name = name;
        this.type = type;
        this.numComponents = numComponents;
        this.getter = getter;
    }
    get typeSize() {
        switch (this.type) {
            case 'byte':
            case 'ubyte':
                return 1;
            case 'short':
            case 'ushort':
                return 2;
            case 'float':
                return 4;
            default:
                throw Error("Unsupported attribute type.");
        }
    }
    get sizeInBytes() {
        return Math.ceil(this.typeSize * this.numComponents / 4) * 4;
    }
    glType(gl) {
        switch (this.type) {
            case 'byte': return gl.BYTE;
            case 'ubyte': return gl.UNSIGNED_BYTE;
            case 'short': return gl.SHORT;
            case 'ushort': return gl.UNSIGNED_SHORT;
            case 'float': return gl.FLOAT;
            default: throw Error("Unsupported attribute type.");
        }
    }
}
exports.VertexAttr = VertexAttr;
class VertexDef {
    constructor(vertexAttrs) {
        this.vertexAttrs = vertexAttrs;
        this.stride = this.initVertexAttrOffsets();
    }
    initVertexAttrOffsets() {
        let offset = 0;
        this.vertexAttrs.forEach(v => {
            v.offset = offset;
            offset += v.sizeInBytes;
        });
        return offset;
    }
    initVertexAttrLocations(gl, prg) {
        this.vertexAttrs.forEach(v => {
            var loc = gl.getAttribLocation(prg, v.name);
            if (loc < 0)
                throw Error(`Vertex attribute '${v.name}' not found in program.`);
            v.location = loc;
        });
    }
}
exports.VertexDef = VertexDef;
function byte(name) {
    return new VertexAttr(name, 'byte', 1, v => [v[name]]);
}
exports.byte = byte;
function ubyte(name) {
    return new VertexAttr(name, 'ubyte', 1, v => [v[name]]);
}
exports.ubyte = ubyte;
function short(name) {
    return new VertexAttr(name, 'short', 1, v => [v[name]]);
}
exports.short = short;
function ushort(name) {
    return new VertexAttr(name, 'ushort', 1, v => [v[name]]);
}
exports.ushort = ushort;
function float(name) {
    return new VertexAttr(name, 'float', 1, v => [v[name]]);
}
exports.float = float;
function vec2(name) {
    return new VertexAttr(name, 'float', 2, v => v[name].toArray());
}
exports.vec2 = vec2;
function vec3(name) {
    return new VertexAttr(name, 'float', 3, v => v[name].toArray());
}
exports.vec3 = vec3;
function vec4(name) {
    return new VertexAttr(name, 'float', 4, v => v[name].toArray());
}
exports.vec4 = vec4;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Uniform {
    constructor(name, type, numComponents, getter) {
        this.name = name;
        this.type = type;
        this.numComponents = numComponents;
        this.getter = getter;
        let lowComp = type === 'matrix' ? 2 : 1;
        if (numComponents < lowComp || numComponents > 4)
            throw RangeError(`Number of components must be [${lowComp}..4] for ${type}.`);
    }
    setValue(gl, uniforms) {
        let val = this.getter(uniforms);
        if (val.length < this.numComponents || val.length % this.numComponents !== 0)
            throw Error('Invalid number of uniform elements.');
        switch (this.numComponents) {
            case 1:
                if (this.type === 'int')
                    gl.uniform1iv(this.location, val);
                else if (this.type === 'float')
                    gl.uniform1fv(this.location, val);
                break;
            case 2:
                if (this.type === 'int')
                    gl.uniform2iv(this.location, val);
                else if (this.type === 'float')
                    gl.uniform2fv(this.location, val);
                else
                    gl.uniformMatrix2fv(this.location, false, val);
                break;
            case 3:
                if (this.type === 'int')
                    gl.uniform3iv(this.location, val);
                else if (this.type === 'float')
                    gl.uniform3fv(this.location, val);
                else
                    gl.uniformMatrix3fv(this.location, false, val);
                break;
            case 4:
                if (this.type === 'int')
                    gl.uniform4iv(this.location, val);
                else if (this.type === 'float')
                    gl.uniform4fv(this.location, val);
                else
                    gl.uniformMatrix4fv(this.location, false, val);
        }
    }
}
exports.Uniform = Uniform;
class UniformDef {
    constructor(uniforms) {
        this.uniforms = uniforms;
    }
    initUniformLocations(gl, prg) {
        this.uniforms.forEach(u => {
            var loc = gl.getUniformLocation(prg, u.name);
            if (loc === null)
                throw Error(`Uniform '${u.name}' not found in program.`);
            u.location = loc;
        });
    }
    setValues(gl, uniforms) {
        this.uniforms.forEach(unif => unif.setValue(gl, uniforms));
    }
}
exports.UniformDef = UniformDef;
function int(name) {
    return new Uniform(name, 'int', 1, u => [u[name]]);
}
exports.int = int;
function float(name) {
    return new Uniform(name, 'float', 1, u => [u[name]]);
}
exports.float = float;
function vec2(name) {
    return new Uniform(name, 'float', 2, u => u[name].toArray());
}
exports.vec2 = vec2;
function vec3(name) {
    return new Uniform(name, 'float', 3, u => u[name].toArray());
}
exports.vec3 = vec3;
function vec4(name) {
    return new Uniform(name, 'float', 4, u => u[name].toArray());
}
exports.vec4 = vec4;
function mat2(name) {
    return new Uniform(name, 'matrix', 2, u => u[name].toArray());
}
exports.mat2 = mat2;
function mat3(name) {
    return new Uniform(name, 'matrix', 3, u => u[name].toArray());
}
exports.mat3 = mat3;
function mat4(name) {
    return new Uniform(name, 'matrix', 4, u => u[name].toArray());
}
exports.mat4 = mat4;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GLResource {
    constructor(gl) {
        this.gl = gl;
    }
}
exports.GLResource = GLResource;
function using(resource, action) {
    let res = resource instanceof Array ?
        resource.pop() :
        resource;
    if (!res)
        return;
    res.use();
    try {
        if (resource instanceof Array && resource.length > 0)
            using(resource, action);
        else
            action(res.gl);
    }
    finally {
        res.release();
    }
}
exports.using = using;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ArrayVec_1 = __webpack_require__(6);
const ArrayMat_1 = __webpack_require__(8);
const Shader_1 = __webpack_require__(9);
const VAttr = __webpack_require__(2);
const Unif = __webpack_require__(3);
const Buffers_1 = __webpack_require__(10);
const Program_1 = __webpack_require__(11);
// Vertex shader program
const vsSource = __webpack_require__(12);
const fsSource = __webpack_require__(13);
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
        uModelViewMatrix: ArrayMat_1.newMat4.translation([0.0, 0.0, -4.0]),
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FMath = __webpack_require__(0);
const Vectors_1 = __webpack_require__(7);
const ArrayHelper = __webpack_require__(1);
class NewArrayVec {
    constructor(dimensions) {
        this.dimensions = dimensions;
    }
    get zero() {
        return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), 0));
    }
    unif(x) {
        return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), x));
    }
    init(...values) {
        if (values.length != this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(values);
    }
    fromArray(array) {
        if (array.length != this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(array);
    }
}
exports.newVec2 = new NewArrayVec(2);
exports.newVec3 = new NewArrayVec(3);
exports.newVec4 = new NewArrayVec(4);
class ArrayVec {
    constructor(array) {
        this.array = array;
    }
    get dimensions() {
        return this.array.length;
    }
    component(index) {
        return this.array[index];
    }
    with(index, value) {
        return new ArrayVec(this.array.map((v, i, a) => i == index ? value : v));
    }
    get x() { return this.array[Vectors_1.Dim.x]; }
    set x(value) { this.array[Vectors_1.Dim.x] = value; }
    get y() { return this.array[Vectors_1.Dim.y]; }
    set y(value) { this.array[Vectors_1.Dim.y] = value; }
    get z() { return this.array[Vectors_1.Dim.z]; }
    set z(value) { this.array[Vectors_1.Dim.z] = value; }
    get w() { return this.array[Vectors_1.Dim.w]; }
    set w(value) { this.array[Vectors_1.Dim.w] = value; }
    swizzle(coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    }
    map(oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    }
    map2(other, oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }));
    }
    reduce(oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    }
    get lenSqr() {
        return this.reduce((a, x) => a + (x * x));
    }
    get len() {
        return Math.sqrt(this.lenSqr);
    }
    inv() {
        return this.map(x => -x);
    }
    add(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x * y) :
            this.map(x => x * other);
    }
    div(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x / y) :
            this.map(x => x / other);
    }
    norm() {
        let l = this.len;
        if (l == 0)
            throw RangeError("Cannot normalize zero vector");
        return this.map(x => x / l);
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon = 0.000001) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    dot(other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    }
    cross(other) {
        return new ArrayVec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    }
    abs() {
        return this.map(Math.abs);
    }
    floor() {
        return this.map(Math.floor);
    }
    ceil() {
        return this.map(Math.ceil);
    }
    round() {
        return this.map(Math.round);
    }
    fract() {
        return this.map(FMath.fract);
    }
    min(other) {
        return this.map2(other, Math.min);
    }
    max(other) {
        return this.map2(other, Math.max);
    }
    clamp(min, max) {
        return this.map(x => FMath.clamp(x, min, max));
    }
    mix(other, interPos) {
        return this.map2(other, (x, y) => FMath.mix(x, y, interPos));
    }
    step(edge) {
        return this.map(x => FMath.step(edge, x));
    }
    smoothStep(edgeLower, edgeUpper) {
        return this.map(x => FMath.smoothStep(edgeLower, edgeUpper, x));
    }
    toString() {
        return "[" + this.array.join(" ") + "]";
    }
    toArray() {
        return this.array;
    }
    toFloat32Array() {
        return new Float32Array(this.array);
    }
    newVec() {
        return new NewArrayVec(this.dimensions);
    }
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumeration that defines the coordinate dimensions used in the vector types.
 */
var Dim;
(function (Dim) {
    Dim[Dim["x"] = 0] = "x";
    Dim[Dim["y"] = 1] = "y";
    Dim[Dim["z"] = 2] = "z";
    Dim[Dim["w"] = 3] = "w";
})(Dim = exports.Dim || (exports.Dim = {}));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const FMath = __webpack_require__(0);
const ArrayHelper = __webpack_require__(1);
class NewArrayMat {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    identityArray() {
        let { rows: r, cols: c } = this;
        let arr = ArrayHelper.fill(Array(r * c), 0);
        for (let i = 0; i < Math.min(r, c); i++)
            arr[i * r + i] = 1;
        return arr;
    }
    get zero() {
        let { rows: r, cols: c } = this;
        return new ArrayMat(ArrayHelper.fill(Array(r * c), 0), r, c);
    }
    get identity() {
        return new ArrayMat(this.identityArray(), this.rows, this.cols);
    }
    translation(offsets) {
        let { rows: r, cols: c } = this;
        let offs = offsets instanceof Array ? offsets : offsets.toArray();
        if (offs.length > r)
            throw RangeError(`Too many offsets for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let lastCol = c - 1;
        for (let i = 0; i < Math.min(offs.length, r - 1); i++)
            res[lastCol * r + i] = offs[i];
        return new ArrayMat(res, r, c);
    }
    scaling(factors) {
        let { rows: r, cols: c } = this;
        let facs = factors instanceof Array ? factors : factors.toArray();
        if (facs.length > r)
            throw RangeError(`Too many factors for ${r}x${c} matrix.`);
        let res = this.identityArray();
        for (let i = 0; i < Math.min(facs.length, r, c); i++)
            res[i * r + i] = facs[i];
        return new ArrayMat(res, r, c);
    }
    rotationX(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around X-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[r + 1] = cosa;
        res[r + 2] = sina;
        res[2 * r + 1] = -sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationY(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around Y-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationZ(angle) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat(res, r, c);
    }
    perspective(left, right, bottom, top, zNear, zFar) {
        if (zNear <= 0 || zNear >= zFar)
            throw RangeError("zNear needs to be positive and smaller thatn zFar");
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;
        return new ArrayMat([(2.0 * zNear) / width, 0, 0, 0,
            0, (2.0 * zNear) / height, 0, 0,
            (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
            0, 0, -(2.0 * zFar * zNear) / depth, 0], 4, 4);
    }
    orthographic(left, right, bottom, top, zNear, zFar) {
        let invWidth = 1.0 / (right - left);
        let invHeight = 1.0 / (top - bottom);
        let invDepth = 1.0 / (zFar - zNear);
        return new ArrayMat([2 * invWidth, 0, 0, 0,
            0, 2 * invHeight, 0, 0,
            0, 0, -2 * invDepth, 0,
            -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1], 4, 4);
    }
    lookAt(direction, up) {
        let zaxis = direction.inv().norm();
        let xaxis = up.cross(zaxis).norm();
        let yaxis = zaxis.cross(xaxis);
        return new ArrayMat([xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1], 4, 4);
    }
    fromArray(array, rows, cols) {
        return new ArrayMat(array, rows, cols);
    }
}
exports.newMat2 = new NewArrayMat(2, 2);
exports.newMat3 = new NewArrayMat(3, 3);
exports.newMat4 = new NewArrayMat(4, 4);
class ArrayMat {
    constructor(array, rows, cols) {
        this.array = array;
        this.rows = rows;
        this.cols = cols;
        if (array.length !== rows * cols)
            throw RangeError("Array length has to be equeal rows * columns.");
    }
    element(row, column) {
        return this.array[column * this.rows + row];
    }
    map(oper) {
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    }
    map2(other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }), this.cols, this.rows);
    }
    matrixMultiply(other) {
        let n = this.rows;
        let m = this.cols;
        let q = other.rows;
        let p = other.cols;
        if (m !== q)
            throw RangeError(`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`);
        let res = Array(n * p);
        // Iterate through rows and columns
        for (let i = 0; i < n; i++)
            for (let j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                let val = 0;
                for (let k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new ArrayMat(res, n, p);
    }
    add(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof ArrayMat ?
            this.matrixMultiply(other) :
            this.map(x => x * other);
    }
    transform(other) {
        let vecm = new ArrayMat(other.toArray(), this.cols, 1);
        return other.newVec().fromArray(this.matrixMultiply(vecm).array);
    }
    transpose() {
        let rows = this.cols;
        let cols = this.rows;
        let res = Array(this.array.length);
        let ind = 0;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new ArrayMat(res, rows, cols);
    }
    determinant() {
        return this.determinantFA();
    }
    invert() {
        return ArrayMat.fromJaggedArray(this.inverseFA());
    }
    toJaggedArray() {
        let { rows, cols, array } = this;
        let res = Array(rows);
        for (let r = 0; r < rows; r++) {
            res[r] = Array(cols);
            for (let c = 0; c < cols; c++)
                res[r][c] = array[c * rows + r];
        }
        return res;
    }
    static fromJaggedArray(matrix) {
        let rows = matrix.length;
        let cols = matrix[0].length;
        let arr = Array(cols * rows);
        let i = 0;
        for (let c = 0; c < cols; c++)
            for (let r = 0; r < rows; r++)
                arr[i++] = matrix[r][c];
        return new ArrayMat(arr, rows, cols);
    }
    decomposeFA(matrix) {
        let { rows, cols } = this;
        if (rows != cols)
            throw RangeError("Cannot decompose non-square matrix");
        // set up row permutation result
        let perm = Array(rows);
        for (let i = 0; i < rows; i++)
            perm[i] = i;
        // toggle tracks row swaps. +1 -> even, -1 -> odd. used by MatrixDeterminant
        let toggle = 1;
        for (let c = 0; c < cols - 1; c++) {
            let colMax = Math.abs(matrix[c][c]); // find largest value in col j
            let pRow = c;
            for (let r = c + 1; r < rows; r++)
                if (matrix[r][c] > colMax) {
                    colMax = matrix[r][c];
                    pRow = r;
                }
            if (pRow != c) {
                // if largest value not on pivot, swap rows
                let rowPtr = matrix[pRow];
                matrix[pRow] = matrix[c];
                matrix[c] = rowPtr;
                // and swap perm info
                let tmp = perm[pRow];
                perm[pRow] = perm[c];
                perm[c] = tmp;
                // adjust the row-swap toggle
                toggle = -toggle;
            }
            // handle the case where the input matrix is singular
            if (matrix[c][c] == 0)
                matrix[c][c] = 0.000001;
            for (let r = c + 1; r < rows; r++) {
                matrix[r][c] /= matrix[c][c];
                for (let k = c + 1; k < cols; k++)
                    matrix[r][k] -= matrix[r][c] * matrix[c][k];
            }
        }
        return [perm, toggle];
    }
    determinantFA() {
        let matrix = this.toJaggedArray();
        let result = this.decomposeFA(matrix)[1];
        for (let i = 0; i < matrix.length; i++)
            result *= matrix[i][i];
        return result;
    }
    inverseFA() {
        let matrix = this.toJaggedArray();
        let rows = matrix.length;
        let result = ArrayHelper.clone(matrix);
        let perm = this.decomposeFA(matrix)[0];
        let b = Array(rows);
        for (let c = 0; c < rows; c++) {
            for (let r = 0; r < rows; r++)
                b[r] = c == perm[r] ? 1 : 0;
            let x = ArrayMat.helperSolvef(matrix, b);
            for (let r = 0; r < rows; r++)
                result[r][c] = x[r];
        }
        return result;
    }
    static helperSolvef(luMatrix, vector) {
        // before calling this helper, permute b using the perm array from 
        // MatrixDecompose that generated luMatrix
        let rows = luMatrix.length;
        let res = vector.slice();
        for (let r = 1; r < rows; r++) {
            let sum = res[r];
            for (let c = 0; c < r; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum;
        }
        res[rows - 1] /= luMatrix[rows - 1][rows - 1];
        for (let r = rows - 2; r >= 0; r--) {
            let sum = res[r];
            for (let c = r + 1; c < rows; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum / luMatrix[r][r];
        }
        return res;
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    toString() {
        let res = "";
        for (let r = 0; r < this.rows; r++) {
            res += "[ ";
            for (let c = 0; c < this.cols; c++)
                res += this.element(r, c) + " ";
            res += "]\n";
        }
        return res;
    }
    toArray() {
        return this.array;
    }
    toFloat32Array() {
        return new Float32Array(this.array);
    }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Shader {
    constructor(gl, type, source) {
        this.gl = gl;
        this.type = type;
        this.gl = gl;
        this.type = type;
        let shader = gl.createShader(this.glShaderType);
        if (shader === null)
            throw Error(`Failed to create ${type} shader.`);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            let error = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw Error(error);
        }
        this.glShader = shader;
    }
    get glShaderType() {
        return this.type === 'vertex' ?
            this.gl.VERTEX_SHADER :
            this.gl.FRAGMENT_SHADER;
    }
}
exports.Shader = Shader;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GLResource_1 = __webpack_require__(4);
class Buffer extends GLResource_1.GLResource {
    constructor(gl, target, glBuffer, length) {
        super(gl);
        this.target = target;
        this.glBuffer = glBuffer;
        this.length = length;
    }
    use() {
        this.gl.bindBuffer(this.target, this.glBuffer);
    }
    release() {
        this.gl.bindBuffer(this.target, null);
    }
}
exports.Buffer = Buffer;
class VertexBuffer extends Buffer {
    constructor(gl, vertexDef, vertices) {
        let buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        super(gl, gl.ARRAY_BUFFER, buf, vertices.length);
        GLResource_1.using(this, () => gl.bufferData(gl.ARRAY_BUFFER, this.initBuffer(vertexDef, vertices), gl.STATIC_DRAW));
    }
    initBuffer(vertexDef, vertices) {
        let vertexSize = vertexDef.stride;
        let len = vertices.length;
        let buffer = new ArrayBuffer(vertexSize * len);
        let view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(attr => {
            var setter = this.vertexAttrSetter(view, attr.type);
            let typeSize = attr.typeSize;
            for (let j = 0; j < len; j++) {
                let values = attr.getter(vertices[j]);
                for (let k = 0; k < attr.numComponents; k++)
                    setter((j * vertexSize) + attr.offset + (k * typeSize), values[k]);
            }
        });
        return buffer;
    }
    vertexAttrSetter(view, type) {
        switch (type) {
            case 'byte': return (off, val) => view.setInt8(off, val);
            case 'ubyte': return (off, val) => view.setUint8(off, val);
            case 'short': return (off, val) => view.setInt16(off, val, true);
            case 'ushort': return (off, val) => view.setUint16(off, val, true);
            case 'float': return (off, val) => view.setFloat32(off, val, true);
        }
    }
}
exports.VertexBuffer = VertexBuffer;
class IndexBuffer extends Buffer {
    constructor(gl, indices) {
        let buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create index buffer.');
        super(gl, gl.ELEMENT_ARRAY_BUFFER, buf, indices.length);
        GLResource_1.using(this, () => gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW));
    }
}
exports.IndexBuffer = IndexBuffer;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VertexAttr_1 = __webpack_require__(2);
const Uniforms_1 = __webpack_require__(3);
const GLResource_1 = __webpack_require__(4);
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


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = " attribute vec2 aVertexPosition;\r\n varying highp vec3 position;\r\n \r\n uniform mat4 uModelViewMatrix;\r\n uniform mat4 uProjectionMatrix;\r\n\r\nvoid main() {\r\n    vec4 pos = vec4 (aVertexPosition, 0, 1);\r\n    position = max(pos.xyz, vec3(0));\r\n    gl_Position = uProjectionMatrix * uModelViewMatrix * pos;\r\n }\r\n"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "varying highp vec3 position;\r\n\r\nvoid main() { \r\n    gl_FragColor = vec4(position, 1.0);\r\n}\r\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDZhMGM0NmE3YWI4YzFhODM5MDAiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFD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QUM7SUFDN0IsQ0FBQztJQUVELFlBQVksQ0FBRSxJQUFZLEVBQUUsT0FBd0IsRUFBRSxPQUFvQixFQUFFLFFBQVc7UUFFbkYsa0JBQUssQ0FBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRTtZQUUvQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxzQkFBc0IsRUFBRztZQUM5QixFQUFFLENBQUMsWUFBWSxDQUFFLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXZFRCwwQkF1RUM7Ozs7Ozs7QUM3RUQsa0RBQWtELGlDQUFpQyx3Q0FBd0Msb0NBQW9DLHFCQUFxQixnREFBZ0QseUNBQXlDLGlFQUFpRSxNQUFNLEs7Ozs7OztBQ0FwViw4Q0FBOEMscUJBQXFCLDRDQUE0QyxLQUFLLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDZhMGM0NmE3YWI4YzFhODM5MDAiLCJleHBvcnQgZnVuY3Rpb24gYXBwcm94RXF1YWxzICh4OiBudW1iZXIsIHk6IG51bWJlciwgXHJcbiAgICBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSkgOiBib29sZWFuXHJcbntcclxuICAgIGlmICh4ID09PSB5KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIGxldCBhYnNYID0gTWF0aC5hYnMgKHgpO1xyXG4gICAgbGV0IGFic1kgPSBNYXRoLmFicyAoeSk7XHJcbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzICh4IC0geSk7XHJcblxyXG4gICAgaWYgKHggKiB5ID09IDApXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgPCAoZXBzaWxvbiAqIGVwc2lsb24pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBkaWZmIC8gKGFic1ggKyBhYnNZKSA8IGVwc2lsb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcmFjdCAoeDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IC0gTWF0aC5mbG9vciAoeCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCAoeDogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggPCBtaW4gPyBtaW4gOlxyXG4gICAgICAgICAgIHggPiBtYXggPyBtYXggOlxyXG4gICAgICAgICAgIHg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXggKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBpbnRlclBvczogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiBzdGFydCArIChpbnRlclBvcyAqIChlbmQgLSBzdGFydCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RlcCAoZWRnZTogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB2YWx1ZSA8IGVkZ2UgPyAwIDogMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICBsZXQgdCA9IGNsYW1wICgodmFsdWUgLSBlZGdlTG93ZXIpIC8gKGVkZ2VVcHBlciAtIGVkZ2VMb3dlciksIDAsIDEpO1xyXG4gICAgcmV0dXJuIHQgKiB0ICogKDMgLSAoMiAqIHQpKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL0ZNYXRoLnRzIiwiaW1wb3J0IHsgYXBwcm94RXF1YWxzIH0gZnJvbSBcIi4uL01hdGgvRk1hdGhcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUPiAoYXJyYXk6IFRbXVtdKTogVFtdW11cclxue1xyXG4gICAgbGV0IHJvd3MgPSBhcnJheS5sZW5ndGhcclxuICAgIGxldCByZXMgPSBBcnJheTxUW10+KHJvd3MpXHJcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICByZXNbcl0gPSBhcnJheVtyXS5zbGljZSAoKVxyXG4gICAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbDxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpOiBUW11cclxue1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcclxuICAgICAgICBhcnJheVtpXSA9IHZhbHVlXHJcbiAgICByZXR1cm4gYXJyYXlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPiAodmFsdWU6IFQsIGNvdW50OiBudW1iZXIpOiBUW11cclxue1xyXG4gICAgdmFyIHJlcyA9IEFycmF5PFQ+IChjb3VudClcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICByZXNbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1heEl0ZW1zPFQ+IChhcnJheTogVFtdLCBzZWxlY3RvcjogKFQpID0+IG51bWJlcik6IFRbXVxyXG57XHJcbiAgICBsZXQgcmVzOiBUW10gPSBbXVxyXG4gICAgbGV0IG1heCA9IE51bWJlci5NQVhfVkFMVUVcclxuICAgIGZvciAobGV0IGl0ZW0gb2YgYXJyYXkpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gc2VsZWN0b3IgKGl0ZW0pO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+IG1heClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1heCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXMgPSBbIGl0ZW0gXVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcHByb3hFcXVhbHMgKHZhbHVlLCBtYXgpKVxyXG4gICAgICAgICAgICByZXMucHVzaCAoaXRlbSlcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdW0gKGFycmF5OiBudW1iZXJbXSk6IG51bWJlclxyXG57XHJcbiAgICBsZXQgcmVzID0gMFxyXG4gICAgZm9yICh2YXIgaXRlbSBvZiBhcnJheSlcclxuICAgICAgICByZXMgKz0gaXRlbVxyXG4gICAgcmV0dXJuIHJlc1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbW1vbi9BcnJheUhlbHBlci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFZlcnRleEF0dHJUeXBlID0gJ2J5dGUnIHwgJ3Nob3J0JyB8ICd1Ynl0ZScgfCAndXNob3J0JyB8ICdmbG9hdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIGxvY2F0aW9uOiBudW1iZXJcclxuICAgIG9mZnNldDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcmVhZG9ubHkgdHlwZTogVmVydGV4QXR0clR5cGUsXHJcbiAgICAgICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyLCByZWFkb25seSBnZXR0ZXI6IChWKSA9PiBudW1iZXJbXSkgeyB9XHJcblxyXG4gICAgZ2V0IHR5cGVTaXplICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDJcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGF0dHJpYnV0ZSB0eXBlLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l6ZUluQnl0ZXMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwgKHRoaXMudHlwZVNpemUgKiB0aGlzLm51bUNvbXBvbmVudHMgLyA0KSAqIDRcclxuICAgIH1cclxuXHJcbiAgICBnbFR5cGUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIGdsLkJZVEVcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gZ2wuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiBnbC5TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlRcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gZ2wuRkxPQVRcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4RGVmPFY+XHJcbntcclxuICAgIHJlYWRvbmx5IHN0cmlkZTogbnVtYmVyXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSB2ZXJ0ZXhBdHRyczogVmVydGV4QXR0cjxWPltdKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3RyaWRlID0gdGhpcy5pbml0VmVydGV4QXR0ck9mZnNldHMgKClcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ck9mZnNldHMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoICh2ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2Lm9mZnNldCA9IG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gdi5zaXplSW5CeXRlcyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbiAocHJnLCB2Lm5hbWUpXHJcbiAgICAgICAgICAgIGlmIChsb2MgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBWZXJ0ZXggYXR0cmlidXRlICcke3YubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHYubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnl0ZTxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2J5dGUnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdWJ5dGU8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1Ynl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3Nob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VzaG9ydCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDIsIHYgPT4gKDxWZWMyPnZbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAzLCB2ID0+ICg8VmVjMz52W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgNCwgdiA9PiAoPFZlYzQ+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4uL01hdGgvTWF0cmljZXNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1UeXBlID0gJ2ludCcgfCAnZmxvYXQnIHwgJ21hdHJpeCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtPFU+XHJcbntcclxuICAgIGxvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IFVuaWZvcm1UeXBlLCBcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFUpID0+IG51bWJlcltdKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgbG93Q29tcCA9IHR5cGUgPT09ICdtYXRyaXgnID8gMiA6IDFcclxuICAgICAgICBpZiAobnVtQ29tcG9uZW50cyA8IGxvd0NvbXAgfHwgbnVtQ29tcG9uZW50cyA+IDQpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBOdW1iZXIgb2YgY29tcG9uZW50cyBtdXN0IGJlIFske2xvd0NvbXB9Li40XSBmb3IgJHt0eXBlfS5gKVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICBsZXQgdmFsID0gdGhpcy5nZXR0ZXIgKHVuaWZvcm1zKVxyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoIDwgdGhpcy5udW1Db21wb25lbnRzIHx8IHZhbC5sZW5ndGggJSB0aGlzLm51bUNvbXBvbmVudHMgIT09IDApXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnSW52YWxpZCBudW1iZXIgb2YgdW5pZm9ybSBlbGVtZW50cy4nKVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5udW1Db21wb25lbnRzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMml2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgyZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2l2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybURlZjxVPlxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgdW5pZm9ybXM6IFVuaWZvcm08VT5bXSkgeyB9XHJcblxyXG4gICAgaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCh1ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcmcsIHUubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVW5pZm9ybSAnJHt1Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB1LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCAodW5pZiA9PiB1bmlmLnNldFZhbHVlIChnbCwgdW5pZm9ybXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2ludCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDIsIHUgPT4gKDxWZWMyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAzLCB1ID0+ICg8VmVjMz51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgNCwgdSA9PiAoPFZlYzQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAyLCB1ID0+ICg8TWF0Mj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MzxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDMsIHUgPT4gKDxNYXQzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQ0PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgNCwgdSA9PiAoPE1hdDQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9Vbmlmb3Jtcy50cyIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7IH1cclxuICAgIGFic3RyYWN0IHVzZSAoKVxyXG4gICAgYWJzdHJhY3QgcmVsZWFzZSAoKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNpbmcgKHJlc291cmNlOiBHTFJlc291cmNlIHwgR0xSZXNvdXJjZVtdLCBcclxuICAgIGFjdGlvbjogKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpID0+IHZvaWQpXHJcbntcclxuICAgIGxldCByZXMgPSByZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ID8gXHJcbiAgICAgICAgcmVzb3VyY2UucG9wICgpIDogXHJcbiAgICAgICAgcmVzb3VyY2VcclxuICAgIGlmICghcmVzKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgcmVzLnVzZSAoKVxyXG4gICAgdHJ5XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXkgJiYgcmVzb3VyY2UubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdXNpbmcgKHJlc291cmNlLCBhY3Rpb24pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhY3Rpb24gKHJlcy5nbClcclxuICAgIH1cclxuICAgIGZpbmFsbHlcclxuICAgIHtcclxuICAgICAgICByZXMucmVsZWFzZSAoKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJpbXBvcnQgeyBOZXdWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaWNlc1wiO1xyXG5pbXBvcnQgeyBuZXdWZWMyLCBuZXdWZWM0IH0gZnJvbSBcIi4vTWF0aC9BcnJheVZlY1wiXHJcbmltcG9ydCB7IG5ld01hdDQgfSBmcm9tIFwiLi9NYXRoL0FycmF5TWF0XCJcclxuaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vR0wvU2hhZGVyXCJcclxuaW1wb3J0ICogYXMgVkF0dHIgZnJvbSBcIi4vR0wvVmVydGV4QXR0clwiXHJcbmltcG9ydCAqIGFzIFVuaWYgZnJvbSBcIi4vR0wvVW5pZm9ybXNcIlxyXG5pbXBvcnQgeyBWZXJ0ZXhCdWZmZXIsIEluZGV4QnVmZmVyIH0gZnJvbSBcIi4vR0wvQnVmZmVyc1wiO1xyXG5pbXBvcnQgeyBQcm9ncmFtIH0gZnJvbSBcIi4vR0wvUHJvZ3JhbVwiXHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLnZlcnQnKVxyXG5jb25zdCBmc1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUuZnJhZycpXHJcblxyXG5jbGFzcyBTaW1wbGVWZXJ0ZXggXHJcbntcclxuICAgIGFWZXJ0ZXhQb3NpdGlvbjogVmVjMiBcclxufVxyXG5cclxuY2xhc3MgTXlVbmlmb3Jtc1xyXG57XHJcbiAgICB1TW9kZWxWaWV3TWF0cml4OiBNYXQ0XHJcbiAgICB1UHJvamVjdGlvbk1hdHJpeDogTWF0NFxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3U2NlbmUoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbTogUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+LCBcclxuICAgIHZidWZmZXI6IFZlcnRleEJ1ZmZlcjxTaW1wbGVWZXJ0ZXg+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IE15VW5pZm9ybXMpIFxyXG57XHJcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7ICAvLyBDbGVhciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbiAgICBnbC5jbGVhckRlcHRoKDEuMCk7ICAgICAgICAgICAgICAgICAvLyBDbGVhciBldmVyeXRoaW5nXHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7ICAgICAgICAgICAvLyBFbmFibGUgZGVwdGggdGVzdGluZ1xyXG4gICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7ICAgICAgICAgICAgLy8gTmVhciB0aGluZ3Mgb2JzY3VyZSBmYXIgdGhpbmdzXHJcbiAgXHJcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG4gIFxyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG5cclxuICAgIHByb2dyYW0uZHJhd0VsZW1lbnRzIChnbC5UUklBTkdMRV9TVFJJUCwgdmJ1ZmZlciwgaWJ1ZmZlciwgdW5pZm9ybXMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4gKClcclxue1xyXG4gICAgbGV0IHZlcnRpY2VzOiBTaW1wbGVWZXJ0ZXhbXSA9IFtcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIC0xKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAtMSkgfVxyXG4gICAgXVxyXG4gICAgbGV0IGluZGljZXMgPSBbIDAsIDEsIDIsIDMgXVxyXG4gICAgbGV0IHVuaWZvcm1zOiBNeVVuaWZvcm1zID0ge1xyXG4gICAgICAgIHVNb2RlbFZpZXdNYXRyaXg6IG5ld01hdDQudHJhbnNsYXRpb24gKFswLjAsIDAuMCwgLTQuMF0pLFxyXG4gICAgICAgIHVQcm9qZWN0aW9uTWF0cml4OiBuZXdNYXQ0LnBlcnNwZWN0aXZlICgtMSwgMSwgLTEsIDEsIDEsIDEwMClcclxuICAgIH1cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG4gICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHZlcnRTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ3ZlcnRleCcsIHZzU291cmNlKVxyXG4gICAgbGV0IGZyYWdTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ2ZyYWdtZW50JywgZnNTb3VyY2UpXHJcblxyXG4gICAgbGV0IHByb2dyYW0gPSBuZXcgUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+IChnbCxcclxuICAgICAgICBbIHZlcnRTaGFkZXIsIGZyYWdTaGFkZXIgXSxcclxuICAgICAgICBbIFZBdHRyLnZlYzIgKCdhVmVydGV4UG9zaXRpb24nKSBdLFxyXG4gICAgICAgIFsgVW5pZi5tYXQ0ICgndU1vZGVsVmlld01hdHJpeCcpLCBVbmlmLm1hdDQgKCd1UHJvamVjdGlvbk1hdHJpeCcpIF0pXHJcblxyXG4gICAgbGV0IHZidWZmZXIgPSBuZXcgVmVydGV4QnVmZmVyIChnbCwgcHJvZ3JhbS52ZXJ0ZXhEZWYsIHZlcnRpY2VzKVxyXG4gICAgbGV0IGlidWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIgKGdsLCBpbmRpY2VzKVxyXG5cclxuICAgIGRyYXdTY2VuZSAoZ2wsIHByb2dyYW0sIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5tYWluICgpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Rlc3QudHMiLCJpbXBvcnQgKiBhcyBGTWF0aCBmcm9tIFwiLi9GTWF0aFwiXHJcbmltcG9ydCB7IERpbSwgVmVjLCBWZWMyLCBWZWMzLCBWZWM0LCBOZXdWZWMgfSBmcm9tIFwiLi9WZWN0b3JzXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4uL0NvbW1vbi9BcnJheUhlbHBlclwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlWZWMgaW1wbGVtZW50cyBOZXdWZWM8VmVjMj4sIE5ld1ZlYzxWZWMzPiwgTmV3VmVjPFZlYzQ+XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGRpbWVuc2lvbnM6IG51bWJlcikgeyB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIDApKVxyXG4gICAgfVxyXG5cclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPSB0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBFeHBlY3RlZCAke3RoaXMuZGltZW5zaW9uc30gY29tcG9uZW50cy5gKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHZhbHVlcylcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChhcnJheSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzI6IE5ld1ZlYzxWZWMyPiA9IG5ldyBOZXdBcnJheVZlYyAoMilcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzM6IE5ld1ZlYzxWZWMzPiA9IG5ldyBOZXdBcnJheVZlYyAoMylcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzQ6IE5ld1ZlYzxWZWM0PiA9IG5ldyBOZXdBcnJheVZlYyAoNClcclxuXHJcbmNsYXNzIEFycmF5VmVjIGltcGxlbWVudHMgVmVjMiwgVmVjMywgVmVjNFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBhcnJheTogbnVtYmVyW10pIHsgfVxyXG5cclxuICAgIGdldCBkaW1lbnNpb25zICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICB3aXRoIChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoKHYsIGksIGEpID0+IGkgPT0gaW5kZXggPyB2YWx1ZSA6IHYpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB4ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueF0gfVxyXG4gICAgc2V0IHggKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueF0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHkgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS55XSB9XHJcbiAgICBzZXQgeSAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS55XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeiAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnpdIH1cclxuICAgIHNldCB6ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnpdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB3ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ud10gfVxyXG4gICAgc2V0IHcgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ud10gPSB2YWx1ZSB9XHJcbiAgICBcclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgQXJyYXkgKGNvb3Jkcy5sZW5ndGgpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuYXJyYXlbY29vcmRzW2ldXVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwMiAob3RoZXI6IEFycmF5VmVjLCBvcGVyOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKVxyXG4gICAgICAgICAgICB9KSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHVjZSAob3BlcjogKGFjYzogbnVtYmVyLCB4OiBudW1iZXIpID0+IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LnJlZHVjZSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAoYywgdilcclxuICAgICAgICAgICAgfSwgMClcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuU3FyICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UgKChhLCB4KSA9PiBhICsgKHggKiB4KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0ICh0aGlzLmxlblNxcilcclxuICAgIH1cclxuXHJcbiAgICBpbnYgKCkgOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiAteClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggKyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBzdWIgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAtIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAtIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG11bCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4ICogeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgZGl2IChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBub3JtICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5sZW5cclxuICAgICAgICBpZiAobCA9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBub3JtYWxpemUgemVybyB2ZWN0b3JcIilcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4geCAvIGwpXHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlWZWMpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlWZWMsIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvdCAob3RoZXI6IEFycmF5VmVjKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGM6IG51bWJlciwgdjogbnVtYmVyLCBpOiBudW1iZXIsIGE6IG51bWJlcltdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYyArICh2ICogb3RoZXIuYXJyYXlbaV0pIFxyXG4gICAgICAgICAgICB9LCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKFtcclxuICAgICAgICAgICAgdGhpcy55ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLnksXHJcbiAgICAgICAgICAgIHRoaXMueiAqIG90aGVyLnggLSB0aGlzLnggKiBvdGhlci56LFxyXG4gICAgICAgICAgICB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueF0pXHRcdFxyXG4gICAgfVxyXG5cclxuICAgIGFicyAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguYWJzKVxyXG4gICAgfVxyXG5cclxuICAgIGZsb29yICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5mbG9vcilcclxuICAgIH1cclxuXHJcbiAgICBjZWlsICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5jZWlsKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdW5kICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5yb3VuZClcclxuICAgIH1cclxuXHJcbiAgICBmcmFjdCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKEZNYXRoLmZyYWN0KVxyXG4gICAgfVxyXG5cclxuICAgIG1pbiAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgTWF0aC5taW4pXHJcbiAgICB9XHJcblxyXG4gICAgbWF4IChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCBNYXRoLm1heClcclxuICAgIH1cclxuXHJcbiAgICBjbGFtcCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguY2xhbXAgKHgsIG1pbiwgbWF4KSlcclxuICAgIH1cclxuXHJcbiAgICBtaXggKG90aGVyOiBBcnJheVZlYywgaW50ZXJQb3M6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiBGTWF0aC5taXggKHgsIHksIGludGVyUG9zKSlcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zdGVwIChlZGdlLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zbW9vdGhTdGVwIChlZGdlTG93ZXIsIGVkZ2VVcHBlciwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMuYXJyYXkuam9pbiAoXCIgXCIpICsgXCJdXCJcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5ICh0aGlzLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIG5ld1ZlYyAoKTogTmV3QXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IE5ld0FycmF5VmVjICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCIvKipcclxuICogRW51bWVyYXRpb24gdGhhdCBkZWZpbmVzIHRoZSBjb29yZGluYXRlIGRpbWVuc2lvbnMgdXNlZCBpbiB0aGUgdmVjdG9yIHR5cGVzLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gRGltIFxyXG57XHJcbiAgICB4ID0gMCxcclxuICAgIHkgPSAxLCBcclxuICAgIHogPSAyLFxyXG4gICAgdyA9IDNcclxufVxyXG5cclxuLyoqIFxyXG4gKiBCYXNlIGludGVyZmFjZSBmb3IgYWxsIHZlY3RvcnkgdHlwZXMuIERlZmluZXMgbWV0aG9kcyB0aGF0IGhhdmUgdGhlIHNhbWUgc2lnbmF0dXJlXHJcbiAqIGluIGFsbCB2ZWN0b3IgdmFyaWFudHMuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzxWIGV4dGVuZHMgVmVjPFY+PlxyXG57XHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBkaW1lbnNpb25zIGluIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlclxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gb25lIG9yIG1vcmUgY29tcG9uZW50cyBvZiB0aGUgdmVjdG9yIGluIGFyYml0cmFyeSBvcmRlci4gVGhlIGNvbXBvbmVudHNcclxuICAgICAqIHJldHVybmVkIGRlcGVuZCBvbiB0aGUgZGltZW5zaW9ucyBzcGVjaWZpZWQgaW4gdGhlIGNvb3JkcyBhcmd1bWVudC4gTm90ZSB0aGF0XHJcbiAgICAgKiB0aGUgc2FtZSBjb21wb25lbnQgY2FuIG9jY3VyIG11bHRpcGxlIHRpbWVzIGluIGNvb3Jkcy4gU28sIGl0IGlzIHZhbGlkIHRvIGNhbGxcclxuICAgICAqIHRoZSBmdW5jdGlvbiBsaWtlIHRoaXM6XHJcbiAgICAgKiBcclxuICAgICAqIHN3aXp6bGUgKFtEaW0ueCwgRGltLngsIERpbS55XSlcclxuICAgICAqL1xyXG4gICAgc3dpenpsZSAoY29vcmRzOiBEaW1bXSk6IG51bWJlcltdXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBsZW5naHQgb2YgdGhlIHZlY3RvciBzcXVhcmVkLiBGYXN0ZXIgdG8gY2FsY3VsYXRlIHRoYW4gdGhlIGFjdHVhbCBsZW5ndGgsXHJcbiAgICAgKiBhbmQgdXNlZnVsIGZvciBjb21wYXJpbmcgdmVjdG9yIG1hZ25pdHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlblNxcjogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIExlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBsZW46IG51bWJlclxyXG5cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IFZcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yLiBGb3JtYXR0ZWQgbGlrZSB0aGlzOiBbeCB5IHpdXHJcbiAgICAgKi9cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICBuZXdWZWMgKCk6IE5ld1ZlYzxWPlxyXG4gICAgXHJcbiAgICBpbnYgKCk6IFZcclxuICAgIGFkZCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBzdWIgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbXVsIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIGRpdiAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBub3JtICgpOiBWXHJcbiAgICBlcXVhbHMgKG90aGVyOiBWKTogYm9vbGVhblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogViwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cclxuICAgIGRvdCAob3RoZXI6IFYpOiBudW1iZXJcclxuICAgIGFicyAoKTogVlxyXG4gICAgZmxvb3IgKCk6IFZcclxuICAgIGNlaWwgKCk6IFZcclxuICAgIHJvdW5kICgpOiBWXHJcbiAgICBmcmFjdCAoKTogVlxyXG4gICAgbWluIChvdGhlcjogVikgOiBWXHJcbiAgICBtYXggKG90aGVyOiBWKSA6IFZcclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBWXHJcbiAgICBtaXggKG90aGVyOiBWLCBpbnRlclBvczogbnVtYmVyKTogVlxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogVlxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ld1ZlYzxWIGV4dGVuZHMgVmVjPFY+PlxyXG57XHJcbiAgICByZWFkb25seSB6ZXJvOiBWXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVlxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMiBleHRlbmRzIFZlYzxWZWMyPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzMgZXh0ZW5kcyBWZWM8VmVjMz5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogVmVjMyk6IFZlYzNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWM0IGV4dGVuZHMgVmVjPFZlYzQ+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvVmVjdG9ycy50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBOZXdNYXQ0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0cmljZXNcIjtcclxuaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUhlbHBlciBmcm9tIFwiLi4vQ29tbW9uL0FycmF5SGVscGVyXCI7XHJcblxyXG5jbGFzcyBOZXdBcnJheU1hdCBpbXBsZW1lbnRzIE5ld01hdDxNYXQyLCBWZWMyPiwgTmV3TWF0PE1hdDMsIFZlYzM+LCBOZXdNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSB7IH1cclxuXHJcbiAgICBwcml2YXRlIGlkZW50aXR5QXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHIgKiBjKSwgMClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChyLCBjKTsgaSsrKSBcclxuICAgICAgICAgICAgYXJyW2kgKiByICsgaV0gPSAxXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+KHIgKiBjKSwgMCksIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkZW50aXR5ICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmlkZW50aXR5QXJyYXkgKCksIHRoaXMucm93cywgdGhpcy5jb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0aW9uIChvZmZzZXRzOiBudW1iZXJbXXxWZWMyfFZlYzN8VmVjNCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzID0gb2Zmc2V0cyBpbnN0YW5jZW9mIEFycmF5ID8gb2Zmc2V0cyA6IG9mZnNldHMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChvZmZzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBvZmZzZXRzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBsYXN0Q29sID0gYyAtIDFcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChvZmZzLmxlbmd0aCwgciAtIDEpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbbGFzdENvbCAqIHIgKyBpXSA9IG9mZnNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGluZyAoZmFjdG9yczogbnVtYmVyW118VmVjMnxWZWMzfFZlYzQpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgZmFjcyA9IGZhY3RvcnMgaW5zdGFuY2VvZiBBcnJheSA/IGZhY3RvcnMgOmZhY3RvcnMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChmYWNzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBmYWN0b3JzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKGZhY3MubGVuZ3RoLCByLCBjKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2kgKiByICsgaV0gPSBmYWNzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWCAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBYLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2FcclxuICAgICAgICByZXNbciArIDJdID0gc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDFdID0gLXNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2FcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25ZIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFktYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1syXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1syICogcl0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25aIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzFdID0gc2luYTtcclxuICAgICAgICByZXNbcl0gPSAtc2luYTtcclxuICAgICAgICByZXNbciArIDFdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcGVyc3BlY3RpdmUgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBpZiAoek5lYXIgPD0gMCB8fCB6TmVhciA+PSB6RmFyKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcInpOZWFyIG5lZWRzIHRvIGJlIHBvc2l0aXZlIGFuZCBzbWFsbGVyIHRoYXRuIHpGYXJcIilcclxuICAgICAgICBsZXQgd2lkdGggPSByaWdodCAtIGxlZnRcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdG9wIC0gYm90dG9tXHJcbiAgICAgICAgbGV0IGRlcHRoID0gekZhciAtIHpOZWFyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsoMi4wICogek5lYXIpIC8gd2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsICgyLjAgKiB6TmVhcikgLyBoZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIChyaWdodCArIGxlZnQpIC8gd2lkdGgsICh0b3AgKyBib3R0b20pIC8gaGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgLyBkZXB0aCwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsIC0oMi4wICogekZhciAqIHpOZWFyKSAvIGRlcHRoLCAwXSwgXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgb3J0aG9ncmFwaGljIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGludldpZHRoID0gMS4wIC8gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBsZXQgaW52SGVpZ2h0ID0gMS4wIC8gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBsZXQgaW52RGVwdGggPSAxLjAgLyAoekZhciAtIHpOZWFyKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbMiAqIGludldpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAyICogaW52SGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAtMiAqIGludkRlcHRoLCAwLFxyXG4gICAgICAgICAgICAtKHJpZ2h0ICsgbGVmdCkgKiBpbnZXaWR0aCwgLSh0b3AgKyBib3R0b20pICogaW52SGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgKiBpbnZEZXB0aCwgMV0sXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0IChkaXJlY3Rpb246IFZlYzMsIHVwOiBWZWMzKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB6YXhpcyA9IGRpcmVjdGlvbi5pbnYgKCkubm9ybSAoKVxyXG4gICAgICAgIGxldCB4YXhpcyA9IHVwLmNyb3NzICh6YXhpcykubm9ybSAoKVxyXG4gICAgICAgIGxldCB5YXhpcyA9IHpheGlzLmNyb3NzICh4YXhpcylcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFt4YXhpcy54LCB5YXhpcy54LCB6YXhpcy54LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy55LCB5YXhpcy55LCB6YXhpcy55LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy56LCB5YXhpcy56LCB6YXhpcy56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXSwgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyYXksIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQyOiBOZXdNYXQ8TWF0MiwgVmVjMj4gPSBuZXcgTmV3QXJyYXlNYXQgKDIsIDIpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQzOiBOZXdNYXQ8TWF0MywgVmVjMz4gPSBuZXcgTmV3QXJyYXlNYXQgKDMsIDMpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQ0OiBOZXdNYXQ0ID0gbmV3IE5ld0FycmF5TWF0ICg0LCA0KVxyXG5cclxuY2xhc3MgQXJyYXlNYXQgaW1wbGVtZW50cyBNYXQyLCBNYXQzLCBNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBhcnJheTogbnVtYmVyW10sIHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoICE9PSByb3dzICpjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkFycmF5IGxlbmd0aCBoYXMgdG8gYmUgZXF1ZWFsIHJvd3MgKiBjb2x1bW5zLlwiKSBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAob3RoZXI6IFYpOiBWXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKG90aGVyLnRvQXJyYXkgKCksIHRoaXMuY29scywgMSlcclxuICAgICAgICByZXR1cm4gb3RoZXIubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsImV4cG9ydCB0eXBlIFNoYWRlclR5cGUgPSAndmVydGV4JyB8ICdmcmFnbWVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkZXJcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xTaGFkZXI6IFdlYkdMU2hhZGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcmVhZG9ubHkgdHlwZTogU2hhZGVyVHlwZSwgc291cmNlOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgICAgIGxldCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodGhpcy5nbFNoYWRlclR5cGUpO1xyXG4gICAgICAgIGlmIChzaGFkZXIgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yIChgRmFpbGVkIHRvIGNyZWF0ZSAke3R5cGV9IHNoYWRlci5gKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9ICdBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcilcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcilcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsU2hhZGVyID0gc2hhZGVyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdsU2hhZGVyVHlwZSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3ZlcnRleCcgPyBcclxuICAgICAgICAgICAgdGhpcy5nbC5WRVJURVhfU0hBREVSIDogXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvU2hhZGVyLnRzIiwiaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCI7XHJcbmltcG9ydCB7IFZlcnRleEF0dHIsIFZlcnRleEF0dHJUeXBlLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWZmZXIgZXh0ZW5kcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCByZWFkb25seSB0YXJnZXQ6IG51bWJlcixcclxuICAgICAgICByZWFkb25seSBnbEJ1ZmZlcjogV2ViR0xCdWZmZXIsIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyIChnbClcclxuICAgIH1cclxuXHJcbiAgICB1c2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCB0aGlzLmdsQnVmZmVyKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbGVhc2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCBudWxsKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4QnVmZmVyPFY+IGV4dGVuZHMgQnVmZmVyIFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj4sIHZlcnRpY2VzOiBWW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXggYnVmZmVyLicpXHJcbiAgICAgICAgc3VwZXIgKGdsLCBnbC5BUlJBWV9CVUZGRVIsIGJ1ZiwgdmVydGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRCdWZmZXIgKHZlcnRleERlZiwgdmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVykpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0QnVmZmVyICh2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSk6IEFycmF5QnVmZmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlcnRleFNpemUgPSB2ZXJ0ZXhEZWYuc3RyaWRlXHJcbiAgICAgICAgbGV0IGxlbiA9IHZlcnRpY2VzLmxlbmd0aFxyXG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIgKHZlcnRleFNpemUgKiBsZW4pXHJcbiAgICAgICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcgKGJ1ZmZlcilcclxuICAgICAgICB2ZXJ0ZXhEZWYudmVydGV4QXR0cnMuZm9yRWFjaCAoYXR0ciA9PiBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICB2YXIgc2V0dGVyID0gdGhpcy52ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3LCBhdHRyLnR5cGUpXHJcbiAgICAgICAgICAgIGxldCB0eXBlU2l6ZSA9IGF0dHIudHlwZVNpemVcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGF0dHIuZ2V0dGVyICh2ZXJ0aWNlc1tqXSlcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXR0ci5udW1Db21wb25lbnRzOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGVyICgoaiAqIHZlcnRleFNpemUpICsgYXR0ci5vZmZzZXQgKyAoayAqIHR5cGVTaXplKSwgdmFsdWVzW2tdKSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlclxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmVydGV4QXR0clNldHRlciAodmlldzogRGF0YVZpZXcsIHR5cGU6IFZlcnRleEF0dHJUeXBlKTogXHJcbiAgICAgICAgKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50MTYgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldFVpbnQxNiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRGbG9hdDMyIChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleEJ1ZmZlciBleHRlbmRzIEJ1ZmZlclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgaW5kaWNlczogbnVtYmVyW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSBpbmRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBidWYsIGluZGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MTZBcnJheSAoaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9CdWZmZXJzLnRzIiwiaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vU2hhZGVyXCJcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcbmltcG9ydCB7IFVuaWZvcm0sIFVuaWZvcm1EZWYgfSBmcm9tIFwiLi9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbTxWLCBVPiBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xQcm9ncmFtOiBXZWJHTFByb2dyYW1cclxuICAgIHJlYWRvbmx5IHNoYWRlcnM6IFNoYWRlcltdXHJcbiAgICByZWFkb25seSB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPlxyXG4gICAgcmVhZG9ubHkgdW5pZm9ybURlZjogVW5pZm9ybURlZjxVPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBcclxuICAgICAgICBzaGFkZXJzOiBTaGFkZXJbXSwgXHJcbiAgICAgICAgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXSxcclxuICAgICAgICB1bmlmb3JtczogVW5pZm9ybTxVPltdKSBcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gc2hhZGVyc1xyXG4gICAgICAgIHRoaXMuZ2xQcm9ncmFtID0gdGhpcy5saW5rICgpXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYgPSBuZXcgVmVydGV4RGVmICh2ZXJ0ZXhBdHRycylcclxuICAgICAgICB0aGlzLnZlcnRleERlZi5pbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgICAgIHRoaXMudW5pZm9ybURlZiA9IG5ldyBVbmlmb3JtRGVmICh1bmlmb3JtcylcclxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYuaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsLCB0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxpbmsgKCk6IFdlYkdMUHJvZ3JhbVxyXG4gICAge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcclxuICAgICAgICBsZXQgcHJnID0gZ2wuY3JlYXRlUHJvZ3JhbSgpXHJcbiAgICAgICAgaWYgKHByZyA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzLmZvckVhY2gocyA9PiBnbC5hdHRhY2hTaGFkZXIocHJnLCBzLmdsU2hhZGVyKSlcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcmcpO1xyXG4gICAgICBcclxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJnLCBnbC5MSU5LX1NUQVRVUykpIFxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJyArIFxyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJnKSlcclxuICAgICAgICByZXR1cm4gcHJnXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgICAgICAgICAgICBhdHRyLmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5udW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5nbFR5cGUgKGdsKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEZWYuc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5vZmZzZXQpO1xyXG4gICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRyLmxvY2F0aW9uKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAodGhpcy5nbFByb2dyYW0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAobnVsbClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RWxlbWVudHMgKG1vZGU6IG51bWJlciwgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFY+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgdXNpbmcgKFt0aGlzLCB2YnVmZmVyLCBpYnVmZmVyXSwgZ2wgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybURlZi5zZXRWYWx1ZXMgKGdsLCB1bmlmb3JtcylcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyAobW9kZSwgaWJ1ZmZlci5sZW5ndGgsIGdsLlVOU0lHTkVEX1NIT1JULCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvUHJvZ3JhbS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCIgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcclxcbiB2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuIFxcclxcbiB1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXHJcXG4gdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcclxcblxcclxcbnZvaWQgbWFpbigpIHtcXHJcXG4gICAgdmVjNCBwb3MgPSB2ZWM0IChhVmVydGV4UG9zaXRpb24sIDAsIDEpO1xcclxcbiAgICBwb3NpdGlvbiA9IG1heChwb3MueHl6LCB2ZWMzKDApKTtcXHJcXG4gICAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVNb2RlbFZpZXdNYXRyaXggKiBwb3M7XFxyXFxuIH1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLnZlcnRcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuXFxyXFxudm9pZCBtYWluKCkgeyBcXHJcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChwb3NpdGlvbiwgMS4wKTtcXHJcXG59XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9