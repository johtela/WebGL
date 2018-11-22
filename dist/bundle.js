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
exports.twoPI = Math.PI * 2;
exports.PIover2 = Math.PI / 2;
exports.PIover4 = Math.PI / 4;
exports.PIover8 = Math.PI / 8;
exports.PIover16 = Math.PI / 16;
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
function distinct(array) {
    let firstOccurence = (item, index) => array.findIndex(i => i.equals(item)) === index;
    return array.filter(firstOccurence);
}
exports.distinct = distinct;
function flatMap(array, selector) {
    return new Array().concat(...array.map(selector));
}
exports.flatMap = flatMap;


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
const ArrayExt = __webpack_require__(1);
class NewArrayVec {
    constructor(dimensions) {
        this.dimensions = dimensions;
    }
    get zero() {
        return new ArrayVec(ArrayExt.fill(Array(this.dimensions), 0));
    }
    unif(x) {
        return new ArrayVec(ArrayExt.fill(Array(this.dimensions), x));
    }
    init(...values) {
        if (values.length != this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(values);
    }
    fromArray(array) {
        if (array.length < this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(array.slice(0, this.dimensions));
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
        return new ArrayVec(this.array.map(v => oper(v)));
    }
    map2(other, oper) {
        return new ArrayVec(this.array.map((v, i) => oper(v, other.array[i])));
    }
    reduce(oper) {
        return this.array.reduce((c, v) => oper(c, v), 0);
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
    toVec2() {
        return new ArrayVec(this.array.slice(0, 2));
    }
    toVec3(z = 0) {
        switch (this.dimensions) {
            case 2: new ArrayVec([...this.array, z]);
            case 4: new ArrayVec(this.array.slice(0, 3));
            default: throw Error("Unsupported conversion.");
        }
    }
    toVec4(z = 0, w = 0) {
        switch (this.dimensions) {
            case 2: new ArrayVec([...this.array, z, w]);
            case 3: new ArrayVec([...this.array, w]);
            default: throw Error("Unsupported conversion.");
        }
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
        let res = this.identityArray();
        let lastCol = c - 1;
        for (let i = 0; i < Math.min(offsets.length, r - 1); i++)
            res[lastCol * r + i] = offsets[i];
        return new ArrayMat(res, r, c);
    }
    scaling(factors) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        for (let i = 0; i < Math.min(factors.length, r, c); i++)
            res[i * r + i] = factors[i];
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
            throw RangeError("Array length has to be equal to rows * columns.");
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
    transform(vec) {
        let arr = [...vec.toArray(), 1, 1].slice(0, this.cols);
        let vecm = new ArrayMat(arr, this.cols, 1);
        return vec.newVec().fromArray(this.matrixMultiply(vecm).array);
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
        for (let c = 0; c < cols - 1; c++) // each column
         {
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
    toMat2() {
        return new ArrayMat([
            ...this.array.slice(0, 2),
            ...this.array.slice(this.rows, this.rows + 2)
        ], 2, 2);
    }
    toMat3() {
        switch (this.rows) {
            case 2: return new ArrayMat([
                ...this.array.slice(0, 2), 0,
                ...this.array.slice(2, 4), 0,
                0, 0, 1
            ], 3, 3);
            case 4: return new ArrayMat([
                ...this.array.slice(0, 3),
                ...this.array.slice(4, 7),
                ...this.array.slice(8, 11)
            ], 3, 3);
            default: throw Error("Unsupported conversion.");
        }
    }
    toMat4() {
        switch (this.rows) {
            case 2: return new ArrayMat([
                ...this.array.slice(0, 2), 0, 0,
                ...this.array.slice(2, 4), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ], 4, 4);
            case 3: return new ArrayMat([
                ...this.array.slice(0, 3), 0,
                ...this.array.slice(3, 7), 0,
                ...this.array.slice(7, 10), 0,
                0, 0, 0, 1
            ], 4, 4);
            default: throw Error("Unsupported conversion.");
        }
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
        for (let i = 0; i < this.shaders.length; i++)
            gl.attachShader(prg, this.shaders[i].glShader);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGFhYjkyNjcxMjVhNDUzYzU3ZGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7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LENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELEdBQUc7UUFFQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPO1FBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFFRCxZQUFZLENBQUUsSUFBWSxFQUFFLE9BQXdCLEVBQUUsT0FBb0IsRUFBRSxRQUFXO1FBRW5GLGtCQUFLLENBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBRWxDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDeEMsSUFBSSxDQUFDLHNCQUFzQixFQUFHO1lBQzlCLEVBQUUsQ0FBQyxZQUFZLENBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBdkVELDBCQXVFQzs7Ozs7OztBQzdFRCxrREFBa0QsaUNBQWlDLHdDQUF3QyxvQ0FBb0MscUJBQXFCLGdEQUFnRCx5Q0FBeUMsaUVBQWlFLE1BQU0sSzs7Ozs7O0FDQXBWLDhDQUE4QyxxQkFBcUIsNENBQTRDLEtBQUssSyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0YWFiOTI2NzEyNWE0NTNjNTdkYiIsImV4cG9ydCBjb25zdCB0d29QSSA9IE1hdGguUEkgKiAyXHJcbmV4cG9ydCBjb25zdCBQSW92ZXIyID0gTWF0aC5QSSAvIDJcclxuZXhwb3J0IGNvbnN0IFBJb3ZlcjQgPSBNYXRoLlBJIC8gNFxyXG5leHBvcnQgY29uc3QgUElvdmVyOCA9IE1hdGguUEkgLyA4XHJcbmV4cG9ydCBjb25zdCBQSW92ZXIxNiA9IE1hdGguUEkgLyAxNlxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcHJveEVxdWFscyAoeDogbnVtYmVyLCB5OiBudW1iZXIsIFxyXG4gICAgZXBzaWxvbjogbnVtYmVyID0gMC4wMDAwMDEpIDogYm9vbGVhblxyXG57XHJcbiAgICBpZiAoeCA9PT0geSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICBsZXQgYWJzWCA9IE1hdGguYWJzICh4KTtcclxuICAgIGxldCBhYnNZID0gTWF0aC5hYnMgKHkpO1xyXG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyAoeCAtIHkpO1xyXG5cclxuICAgIGlmICh4ICogeSA9PSAwKVxyXG4gICAgICAgIHJldHVybiBkaWZmIDwgKGVwc2lsb24gKiBlcHNpbG9uKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZGlmZiAvIChhYnNYICsgYWJzWSkgPCBlcHNpbG9uO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJhY3QgKHg6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4geCAtIE1hdGguZmxvb3IgKHgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAgKHg6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IDwgbWluID8gbWluIDpcclxuICAgICAgICAgICB4ID4gbWF4ID8gbWF4IDpcclxuICAgICAgICAgICB4O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWl4IChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgaW50ZXJQb3M6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4gc3RhcnQgKyAoaW50ZXJQb3MgKiAoZW5kIC0gc3RhcnQpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0ZXAgKGVkZ2U6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4gdmFsdWUgPCBlZGdlID8gMCA6IDE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgbGV0IHQgPSBjbGFtcCAoKHZhbHVlIC0gZWRnZUxvd2VyKSAvIChlZGdlVXBwZXIgLSBlZGdlTG93ZXIpLCAwLCAxKTtcclxuICAgIHJldHVybiB0ICogdCAqICgzIC0gKDIgKiB0KSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9GTWF0aC50cyIsImltcG9ydCB7IEVxdWF0YWJsZSB9IGZyb20gXCIuL0VxdWF0YWJsZVwiO1xuaW1wb3J0IHsgYXBwcm94RXF1YWxzIH0gZnJvbSBcIi4uL01hdGgvRk1hdGhcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQ+IChhcnJheTogVFtdW10pOiBUW11bXVxue1xuICAgIGxldCByb3dzID0gYXJyYXkubGVuZ3RoXG4gICAgbGV0IHJlcyA9IEFycmF5PFRbXT4ocm93cylcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcbiAgICAgICAgcmVzW3JdID0gYXJyYXlbcl0uc2xpY2UgKClcbiAgICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxsPFQ+IChhcnJheTogVFtdLCB2YWx1ZTogVCk6IFRbXVxue1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgIGFycmF5W2ldID0gdmFsdWVcbiAgICByZXR1cm4gYXJyYXlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPiAodmFsdWU6IFQsIGNvdW50OiBudW1iZXIpOiBUW11cbntcbiAgICB2YXIgcmVzID0gQXJyYXk8VD4gKGNvdW50KVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcbiAgICAgICAgcmVzW2ldID0gdmFsdWVcbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF4SXRlbXM8VD4gKGFycmF5OiBUW10sIHNlbGVjdG9yOiAow610ZW06IFQpID0+IG51bWJlcik6IFRbXVxue1xuICAgIGxldCByZXM6IFRbXSA9IFtdXG4gICAgbGV0IG1heCA9IE51bWJlci5NQVhfVkFMVUVcbiAgICBmb3IgKGxldCBpdGVtIG9mIGFycmF5KVxuICAgIHtcbiAgICAgICAgdmFyIHZhbHVlID0gc2VsZWN0b3IgKGl0ZW0pO1xuICAgICAgICBpZiAodmFsdWUgPiBtYXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICAgICAgcmVzID0gWyBpdGVtIF1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcHByb3hFcXVhbHMgKHZhbHVlLCBtYXgpKVxuICAgICAgICAgICAgcmVzLnB1c2ggKGl0ZW0pXG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdW0gKGFycmF5OiBudW1iZXJbXSk6IG51bWJlclxue1xuICAgIGxldCByZXMgPSAwXG4gICAgZm9yICh2YXIgaXRlbSBvZiBhcnJheSlcbiAgICAgICAgcmVzICs9IGl0ZW1cbiAgICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdDxUIGV4dGVuZHMgRXF1YXRhYmxlPFQ+PiAoYXJyYXk6IFRbXSlcbntcbiAgICBsZXQgZmlyc3RPY2N1cmVuY2UgPSAoaXRlbTogVCwgaW5kZXg6IG51bWJlcikgPT4gYXJyYXkuZmluZEluZGV4IChpID0+IGkuZXF1YWxzIChpdGVtKSkgPT09IGluZGV4XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlciAoZmlyc3RPY2N1cmVuY2UpICAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdE1hcDxULCBVPiAoYXJyYXk6IFRbXSwgc2VsZWN0b3I6IChpdGVtOiBUKSA9PiBVW10pOiBVW11cbntcbiAgICByZXR1cm4gbmV3IEFycmF5PFU+ICgpLmNvbmNhdCAoLi4uYXJyYXkubWFwIChzZWxlY3RvcikpXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbW1vbi9BcnJheUV4dC50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFZlcnRleEF0dHJUeXBlID0gJ2J5dGUnIHwgJ3Nob3J0JyB8ICd1Ynl0ZScgfCAndXNob3J0JyB8ICdmbG9hdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIGxvY2F0aW9uOiBudW1iZXJcclxuICAgIG9mZnNldDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcmVhZG9ubHkgdHlwZTogVmVydGV4QXR0clR5cGUsXHJcbiAgICAgICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyLCByZWFkb25seSBnZXR0ZXI6IChWKSA9PiBudW1iZXJbXSkgeyB9XHJcblxyXG4gICAgZ2V0IHR5cGVTaXplICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDJcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGF0dHJpYnV0ZSB0eXBlLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l6ZUluQnl0ZXMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwgKHRoaXMudHlwZVNpemUgKiB0aGlzLm51bUNvbXBvbmVudHMgLyA0KSAqIDRcclxuICAgIH1cclxuXHJcbiAgICBnbFR5cGUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIGdsLkJZVEVcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gZ2wuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiBnbC5TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlRcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gZ2wuRkxPQVRcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4RGVmPFY+XHJcbntcclxuICAgIHJlYWRvbmx5IHN0cmlkZTogbnVtYmVyXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSB2ZXJ0ZXhBdHRyczogVmVydGV4QXR0cjxWPltdKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3RyaWRlID0gdGhpcy5pbml0VmVydGV4QXR0ck9mZnNldHMgKClcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ck9mZnNldHMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoICh2ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2Lm9mZnNldCA9IG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gdi5zaXplSW5CeXRlcyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbiAocHJnLCB2Lm5hbWUpXHJcbiAgICAgICAgICAgIGlmIChsb2MgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBWZXJ0ZXggYXR0cmlidXRlICcke3YubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHYubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnl0ZTxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnYnl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1Ynl0ZTxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAndWJ5dGUnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvcnQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3Nob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaG9ydDxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAndXNob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0PFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMyPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDIsIHYgPT4gKDxWZWMyPnZbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDMsIHYgPT4gKDxWZWMzPnZbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWM0PFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDQsIHYgPT4gKDxWZWM0PnZbbmFtZV0pLnRvQXJyYXkgKCkgKVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML1ZlcnRleEF0dHIudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE1hdCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuLi9NYXRoL01hdHJpY2VzXCI7XHJcblxyXG5leHBvcnQgdHlwZSBVbmlmb3JtVHlwZSA9ICdpbnQnIHwgJ2Zsb2F0JyB8ICdtYXRyaXgnXHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybTxVPlxyXG57XHJcbiAgICBsb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb25cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB0eXBlOiBVbmlmb3JtVHlwZSwgXHJcbiAgICAgICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyLCByZWFkb25seSBnZXR0ZXI6IChVKSA9PiBudW1iZXJbXSkgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGxvd0NvbXAgPSB0eXBlID09PSAnbWF0cml4JyA/IDIgOiAxXHJcbiAgICAgICAgaWYgKG51bUNvbXBvbmVudHMgPCBsb3dDb21wIHx8IG51bUNvbXBvbmVudHMgPiA0KVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgTnVtYmVyIG9mIGNvbXBvbmVudHMgbXVzdCBiZSBbJHtsb3dDb21wfS4uNF0gZm9yICR7dHlwZX0uYClcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZhbCA9IHRoaXMuZ2V0dGVyICh1bmlmb3JtcylcclxuICAgICAgICBpZiAodmFsLmxlbmd0aCA8IHRoaXMubnVtQ29tcG9uZW50cyB8fCB2YWwubGVuZ3RoICUgdGhpcy5udW1Db21wb25lbnRzICE9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ludmFsaWQgbnVtYmVyIG9mIHVuaWZvcm0gZWxlbWVudHMuJylcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubnVtQ29tcG9uZW50cykgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTFmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0yZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4MmZ2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0zZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00ZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWZvcm1EZWY8VT5cclxue1xyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IHVuaWZvcm1zOiBVbmlmb3JtPFU+W10pIHsgfVxyXG5cclxuICAgIGluaXRVbmlmb3JtTG9jYXRpb25zIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcmc6IFdlYkdMUHJvZ3JhbSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLnVuaWZvcm1zLmZvckVhY2godSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbiAocHJnLCB1Lm5hbWUpXHJcbiAgICAgICAgICAgIGlmIChsb2MgPT09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvciAoYFVuaWZvcm0gJyR7dS5uYW1lfScgbm90IGZvdW5kIGluIHByb2dyYW0uYClcclxuICAgICAgICAgICAgdS5sb2NhdGlvbiA9IGxvY1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWVzIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLnVuaWZvcm1zLmZvckVhY2ggKHVuaWYgPT4gdW5pZi5zZXRWYWx1ZSAoZ2wsIHVuaWZvcm1zKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbnQ8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2ludCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAxLCB1ID0+IFsgdVtuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMjxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAyLCB1ID0+ICg8VmVjMj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMzxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAzLCB1ID0+ICg8VmVjMz51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCA0LCB1ID0+ICg8VmVjND51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MjxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgMiwgdSA9PiAoPE1hdDI+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDM8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDMsIHUgPT4gKDxNYXQzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQ0PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCA0LCB1ID0+ICg8TWF0ND51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML1VuaWZvcm1zLnRzIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHsgfVxyXG4gICAgYWJzdHJhY3QgdXNlICgpXHJcbiAgICBhYnN0cmFjdCByZWxlYXNlICgpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2luZyAocmVzb3VyY2U6IEdMUmVzb3VyY2UgfCBHTFJlc291cmNlW10sIFxyXG4gICAgYWN0aW9uOiAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCkgPT4gdm9pZClcclxue1xyXG4gICAgbGV0IHJlcyA9IHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXkgPyBcclxuICAgICAgICByZXNvdXJjZS5wb3AgKCkgOiBcclxuICAgICAgICByZXNvdXJjZVxyXG4gICAgaWYgKCFyZXMpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICByZXMudXNlICgpXHJcbiAgICB0cnlcclxuICAgIHtcclxuICAgICAgICBpZiAocmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSAmJiByZXNvdXJjZS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB1c2luZyAocmVzb3VyY2UsIGFjdGlvbilcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGFjdGlvbiAocmVzLmdsKVxyXG4gICAgfVxyXG4gICAgZmluYWxseVxyXG4gICAge1xyXG4gICAgICAgIHJlcy5yZWxlYXNlICgpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvR0xSZXNvdXJjZS50cyIsImltcG9ydCB7IE5ld1ZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuL01hdGgvVmVjdG9yc1wiO1xyXG5pbXBvcnQgeyBOZXdNYXQsIE1hdDIsIE1hdDMsIE1hdDQgfSBmcm9tIFwiLi9NYXRoL01hdHJpY2VzXCI7XHJcbmltcG9ydCB7IG5ld1ZlYzIsIG5ld1ZlYzQgfSBmcm9tIFwiLi9NYXRoL0FycmF5VmVjXCJcclxuaW1wb3J0IHsgbmV3TWF0NCB9IGZyb20gXCIuL01hdGgvQXJyYXlNYXRcIlxyXG5pbXBvcnQgeyBTaGFkZXJUeXBlLCBTaGFkZXIgfSBmcm9tIFwiLi9HTC9TaGFkZXJcIlxyXG5pbXBvcnQgKiBhcyBWQXR0ciBmcm9tIFwiLi9HTC9WZXJ0ZXhBdHRyXCJcclxuaW1wb3J0ICogYXMgVW5pZiBmcm9tIFwiLi9HTC9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9HTC9CdWZmZXJzXCI7XHJcbmltcG9ydCB7IFByb2dyYW0gfSBmcm9tIFwiLi9HTC9Qcm9ncmFtXCJcclxuXHJcbi8vIFZlcnRleCBzaGFkZXIgcHJvZ3JhbVxyXG5jb25zdCB2c1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUudmVydCcpXHJcbmNvbnN0IGZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS5mcmFnJylcclxuXHJcbmNsYXNzIFNpbXBsZVZlcnRleCBcclxue1xyXG4gICAgYVZlcnRleFBvc2l0aW9uOiBWZWMyIFxyXG59XHJcblxyXG5jbGFzcyBNeVVuaWZvcm1zXHJcbntcclxuICAgIHVNb2RlbFZpZXdNYXRyaXg6IE1hdDRcclxuICAgIHVQcm9qZWN0aW9uTWF0cml4OiBNYXQ0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdTY2VuZShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtOiBQcm9ncmFtPFNpbXBsZVZlcnRleCwgTXlVbmlmb3Jtcz4sIFxyXG4gICAgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFNpbXBsZVZlcnRleD4sIGlidWZmZXI6IEluZGV4QnVmZmVyLCB1bmlmb3JtczogTXlVbmlmb3JtcykgXHJcbntcclxuICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTsgIC8vIENsZWFyIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcclxuICAgIGdsLmNsZWFyRGVwdGgoMS4wKTsgICAgICAgICAgICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmdcclxuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTsgICAgICAgICAgIC8vIEVuYWJsZSBkZXB0aCB0ZXN0aW5nXHJcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTsgICAgICAgICAgICAvLyBOZWFyIHRoaW5ncyBvYnNjdXJlIGZhciB0aGluZ3NcclxuICBcclxuICAgIC8vIENsZWFyIHRoZSBjYW52YXMgYmVmb3JlIHdlIHN0YXJ0IGRyYXdpbmcgb24gaXQuXHJcbiAgXHJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblxyXG4gICAgcHJvZ3JhbS5kcmF3RWxlbWVudHMgKGdsLlRSSUFOR0xFX1NUUklQLCB2YnVmZmVyLCBpYnVmZmVyLCB1bmlmb3JtcylcclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbiAoKVxyXG57XHJcbiAgICBsZXQgdmVydGljZXM6IFNpbXBsZVZlcnRleFtdID0gW1xyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIDEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoLTEsIDEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoMSwgLTEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoLTEsIC0xKSB9XHJcbiAgICBdXHJcbiAgICBsZXQgaW5kaWNlcyA9IFsgMCwgMSwgMiwgMyBdXHJcbiAgICBsZXQgdW5pZm9ybXM6IE15VW5pZm9ybXMgPSB7XHJcbiAgICAgICAgdU1vZGVsVmlld01hdHJpeDogbmV3TWF0NC50cmFuc2xhdGlvbiAoWzAuMCwgMC4wLCAtNC4wXSksXHJcbiAgICAgICAgdVByb2plY3Rpb25NYXRyaXg6IG5ld01hdDQucGVyc3BlY3RpdmUgKC0xLCAxLCAtMSwgMSwgMSwgMTAwKVxyXG4gICAgfVxyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2xDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHTCBjb250ZXh0XHJcbiAgICBsZXQgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuICAgIC8vIE9ubHkgY29udGludWUgaWYgV2ViR0wgaXMgYXZhaWxhYmxlIGFuZCB3b3JraW5nXHJcbiAgICBpZiAoIWdsKSB7XHJcbiAgICAgICAgYWxlcnQoXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG9yIG1hY2hpbmUgbWF5IG5vdCBzdXBwb3J0IGl0LlwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgdmVydFNoYWRlciA9IG5ldyBTaGFkZXIgKGdsLCAndmVydGV4JywgdnNTb3VyY2UpXHJcbiAgICBsZXQgZnJhZ1NoYWRlciA9IG5ldyBTaGFkZXIgKGdsLCAnZnJhZ21lbnQnLCBmc1NvdXJjZSlcclxuXHJcbiAgICBsZXQgcHJvZ3JhbSA9IG5ldyBQcm9ncmFtPFNpbXBsZVZlcnRleCwgTXlVbmlmb3Jtcz4gKGdsLFxyXG4gICAgICAgIFsgdmVydFNoYWRlciwgZnJhZ1NoYWRlciBdLFxyXG4gICAgICAgIFsgVkF0dHIudmVjMiAoJ2FWZXJ0ZXhQb3NpdGlvbicpIF0sXHJcbiAgICAgICAgWyBVbmlmLm1hdDQgKCd1TW9kZWxWaWV3TWF0cml4JyksIFVuaWYubWF0NCAoJ3VQcm9qZWN0aW9uTWF0cml4JykgXSlcclxuXHJcbiAgICBsZXQgdmJ1ZmZlciA9IG5ldyBWZXJ0ZXhCdWZmZXIgKGdsLCBwcm9ncmFtLnZlcnRleERlZiwgdmVydGljZXMpXHJcbiAgICBsZXQgaWJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlciAoZ2wsIGluZGljZXMpXHJcblxyXG4gICAgZHJhd1NjZW5lIChnbCwgcHJvZ3JhbSwgdmJ1ZmZlciwgaWJ1ZmZlciwgdW5pZm9ybXMpXHJcbn1cclxuXHJcbm1haW4gKClcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVGVzdC50cyIsImltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0IHsgRGltLCBWZWMsIFZlYzIsIFZlYzMsIFZlYzQsIE5ld1ZlYyB9IGZyb20gXCIuL1ZlY3RvcnNcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUV4dCBmcm9tIFwiLi4vQ29tbW9uL0FycmF5RXh0XCJcclxuXHJcbmNsYXNzIE5ld0FycmF5VmVjIGltcGxlbWVudHMgTmV3VmVjPFZlYzI+LCBOZXdWZWM8VmVjMz4sIE5ld1ZlYzxWZWM0PlxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgZGltZW5zaW9uczogbnVtYmVyKSB7IH1cclxuXHJcbiAgICBnZXQgemVybyAoKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoQXJyYXlFeHQuZmlsbCAoQXJyYXk8bnVtYmVyPiAodGhpcy5kaW1lbnNpb25zKSwgMCkpXHJcbiAgICB9XHJcblxyXG4gICAgdW5pZiAoeDogbnVtYmVyKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoQXJyYXlFeHQuZmlsbCAoQXJyYXk8bnVtYmVyPiAodGhpcy5kaW1lbnNpb25zKSwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCAoLi4udmFsdWVzOiBudW1iZXJbXSk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoICE9IHRoaXMuZGltZW5zaW9ucylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYEV4cGVjdGVkICR7dGhpcy5kaW1lbnNpb25zfSBjb21wb25lbnRzLmApXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodmFsdWVzKVxyXG4gICAgfVxyXG5cclxuICAgIGZyb21BcnJheSAoYXJyYXk6IG51bWJlcltdKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCA8IHRoaXMuZGltZW5zaW9ucylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYEV4cGVjdGVkICR7dGhpcy5kaW1lbnNpb25zfSBjb21wb25lbnRzLmApXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoYXJyYXkuc2xpY2UgKDAsIHRoaXMuZGltZW5zaW9ucykpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdWZWMyOiBOZXdWZWM8VmVjMj4gPSBuZXcgTmV3QXJyYXlWZWMgKDIpXHJcbmV4cG9ydCBjb25zdCBuZXdWZWMzOiBOZXdWZWM8VmVjMz4gPSBuZXcgTmV3QXJyYXlWZWMgKDMpXHJcbmV4cG9ydCBjb25zdCBuZXdWZWM0OiBOZXdWZWM8VmVjND4gPSBuZXcgTmV3QXJyYXlWZWMgKDQpXHJcblxyXG5jbGFzcyBBcnJheVZlYyBpbXBsZW1lbnRzIFZlYzIsIFZlYzMsIFZlYzRcclxue1xyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgYXJyYXk6IG51bWJlcltdKSB7IH1cclxuXHJcbiAgICBnZXQgZGltZW5zaW9ucyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50IChpbmRleDogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlbaW5kZXhdXHJcbiAgICB9XHJcblxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKCh2LCBpLCBhKSA9PiBpID09IGluZGV4ID8gdmFsdWUgOiB2KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnhdIH1cclxuICAgIHNldCB4ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnhdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB5ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueV0gfVxyXG4gICAgc2V0IHkgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueV0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHogKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS56XSB9XHJcbiAgICBzZXQgeiAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS56XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgdyAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnddIH1cclxuICAgIHNldCB3ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnddID0gdmFsdWUgfVxyXG4gICAgXHJcbiAgICBzd2l6emxlIChjb29yZHM6IERpbVtdKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IEFycmF5IChjb29yZHMubGVuZ3RoKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLmFycmF5W2Nvb3Jkc1tpXV1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwIChvcGVyOiAoeDogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwICh2ID0+IG9wZXIgKHYpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAyIChvdGhlcjogQXJyYXlWZWMsIG9wZXI6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgICh2LCBpKSA9PiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSkpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHVjZSAob3BlcjogKGFjYzogbnVtYmVyLCB4OiBudW1iZXIpID0+IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LnJlZHVjZSAoKGMsIHYpID0+IG9wZXIgKGMsIHYpLCAwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxlblNxciAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlICgoYSwgeCkgPT4gYSArICh4ICogeCkpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbiAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCAodGhpcy5sZW5TcXIpXHJcbiAgICB9XHJcblxyXG4gICAgaW52ICgpIDogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gLXgpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4ICsgeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICsgb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3ViIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLSB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLSBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBtdWwgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAqIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIGRpdiAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4IC8geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC8gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbm9ybSAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMubGVuXHJcbiAgICAgICAgaWYgKGwgPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJDYW5ub3Qgbm9ybWFsaXplIHplcm8gdmVjdG9yXCIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IHggLyBsKVxyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5VmVjKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5VmVjLCBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRk1hdGguYXBwcm94RXF1YWxzICh2LCBvdGhlci5hcnJheVtpXSwgZXBzaWxvbilcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkb3QgKG90aGVyOiBBcnJheVZlYyk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LnJlZHVjZSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjOiBudW1iZXIsIHY6IG51bWJlciwgaTogbnVtYmVyLCBhOiBudW1iZXJbXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMgKyAodiAqIG90aGVyLmFycmF5W2ldKSBcclxuICAgICAgICAgICAgfSwgMClcclxuICAgIH1cclxuXHJcbiAgICBjcm9zcyAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChbXHJcbiAgICAgICAgICAgIHRoaXMueSAqIG90aGVyLnogLSB0aGlzLnogKiBvdGhlci55LFxyXG4gICAgICAgICAgICB0aGlzLnogKiBvdGhlci54IC0gdGhpcy54ICogb3RoZXIueixcclxuICAgICAgICAgICAgdGhpcy54ICogb3RoZXIueSAtIHRoaXMueSAqIG90aGVyLnhdKVx0XHRcclxuICAgIH1cclxuXHJcbiAgICBhYnMgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmFicylcclxuICAgIH1cclxuXHJcbiAgICBmbG9vciAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguZmxvb3IpXHJcbiAgICB9XHJcblxyXG4gICAgY2VpbCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguY2VpbClcclxuICAgIH1cclxuXHJcbiAgICByb3VuZCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGgucm91bmQpXHJcbiAgICB9XHJcblxyXG4gICAgZnJhY3QgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChGTWF0aC5mcmFjdClcclxuICAgIH1cclxuXHJcbiAgICBtaW4gKG90aGVyOiBBcnJheVZlYyk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsIE1hdGgubWluKVxyXG4gICAgfVxyXG5cclxuICAgIG1heCAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgTWF0aC5tYXgpXHJcbiAgICB9XHJcblxyXG4gICAgY2xhbXAgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLmNsYW1wICh4LCBtaW4sIG1heCkpXHJcbiAgICB9XHJcblxyXG4gICAgbWl4IChvdGhlcjogQXJyYXlWZWMsIGludGVyUG9zOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4gRk1hdGgubWl4ICh4LCB5LCBpbnRlclBvcykpXHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguc3RlcCAoZWRnZSwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguc21vb3RoU3RlcCAoZWRnZUxvd2VyLCBlZGdlVXBwZXIsIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLmFycmF5LmpvaW4gKFwiIFwiKSArIFwiXVwiXHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgfVxyXG5cclxuICAgIHRvRmxvYXQzMkFycmF5ICgpOiBGbG9hdDMyQXJyYXlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSAodGhpcy5hcnJheSlcclxuICAgIH1cclxuXHJcbiAgICBuZXdWZWMgKCk6IE5ld0FycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBOZXdBcnJheVZlYyAodGhpcy5kaW1lbnNpb25zKVxyXG4gICAgfVxyXG5cclxuICAgIHRvVmVjMiAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5LnNsaWNlICgwLCAyKSlcclxuICAgIH1cclxuXHJcbiAgICB0b1ZlYzMgKHo6IG51bWJlciA9IDApOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAyOiBuZXcgQXJyYXlWZWMgKFsuLi50aGlzLmFycmF5LCB6XSlcclxuICAgICAgICAgICAgY2FzZSA0OiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkuc2xpY2UgKDAsIDMpKVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b1ZlYzQgKHo6IG51bWJlciA9IDAsIHc6IG51bWJlciA9IDApOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAyOiBuZXcgQXJyYXlWZWMgKFsuLi50aGlzLmFycmF5LCB6LCB3XSlcclxuICAgICAgICAgICAgY2FzZSAzOiBuZXcgQXJyYXlWZWMgKFsuLi50aGlzLmFycmF5LCB3XSlcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgY29udmVyc2lvbi5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJpbXBvcnQgeyBFcXVhdGFibGUgfSBmcm9tIFwiLi4vQ29tbW9uL0VxdWF0YWJsZVwiO1xyXG5cclxuLyoqXHJcbiAqIEVudW1lcmF0aW9uIHRoYXQgZGVmaW5lcyB0aGUgY29vcmRpbmF0ZSBkaW1lbnNpb25zIHVzZWQgaW4gdGhlIHZlY3RvciB0eXBlcy5cclxuICovXHJcbmV4cG9ydCBlbnVtIERpbSBcclxue1xyXG4gICAgeCA9IDAsXHJcbiAgICB5ID0gMSwgXHJcbiAgICB6ID0gMixcclxuICAgIHcgPSAzXHJcbn1cclxuXHJcbi8qKiBcclxuICogQmFzZSBpbnRlcmZhY2UgZm9yIGFsbCB2ZWN0b3J5IHR5cGVzLiBEZWZpbmVzIG1ldGhvZHMgdGhhdCBoYXZlIHRoZSBzYW1lIHNpZ25hdHVyZVxyXG4gKiBpbiBhbGwgdmVjdG9yIHZhcmlhbnRzLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBWZWM8ViBleHRlbmRzIFZlYzxWPj4gZXh0ZW5kcyBFcXVhdGFibGU8Vj5cclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgZGltZW5zaW9ucyBpbiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBkaW1lbnNpb25zOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIG9uZSBvciBtb3JlIGNvbXBvbmVudHMgb2YgdGhlIHZlY3RvciBpbiBhcmJpdHJhcnkgb3JkZXIuIFRoZSBjb21wb25lbnRzXHJcbiAgICAgKiByZXR1cm5lZCBkZXBlbmQgb24gdGhlIGRpbWVuc2lvbnMgc3BlY2lmaWVkIGluIHRoZSBjb29yZHMgYXJndW1lbnQuIE5vdGUgdGhhdFxyXG4gICAgICogdGhlIHNhbWUgY29tcG9uZW50IGNhbiBvY2N1ciBtdWx0aXBsZSB0aW1lcyBpbiBjb29yZHMuIFNvLCBpdCBpcyB2YWxpZCB0byBjYWxsXHJcbiAgICAgKiB0aGUgZnVuY3Rpb24gbGlrZSB0aGlzOlxyXG4gICAgICogXHJcbiAgICAgKiBzd2l6emxlIChbRGltLngsIERpbS54LCBEaW0ueV0pXHJcbiAgICAgKi9cclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbGVuZ2h0IG9mIHRoZSB2ZWN0b3Igc3F1YXJlZC4gRmFzdGVyIHRvIGNhbGN1bGF0ZSB0aGFuIHRoZSBhY3R1YWwgbGVuZ3RoLFxyXG4gICAgICogYW5kIHVzZWZ1bCBmb3IgY29tcGFyaW5nIHZlY3RvciBtYWduaXR1ZGVzLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBsZW5TcXI6IG51bWJlclxyXG4gICAgLyoqXHJcbiAgICAgKiBMZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbGVuOiBudW1iZXJcclxuXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHdpdGggKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBWXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3Rvci4gRm9ybWF0dGVkIGxpa2UgdGhpczogW3ggeSB6XVxyXG4gICAgICovXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAgbmV3VmVjICgpOiBOZXdWZWM8Vj5cclxuICAgIFxyXG4gICAgaW52ICgpOiBWXHJcbiAgICBhZGQgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgc3ViIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIG11bCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBkaXYgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbm9ybSAoKTogVlxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogViwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cclxuICAgIGRvdCAob3RoZXI6IFYpOiBudW1iZXJcclxuICAgIGFicyAoKTogVlxyXG4gICAgZmxvb3IgKCk6IFZcclxuICAgIGNlaWwgKCk6IFZcclxuICAgIHJvdW5kICgpOiBWXHJcbiAgICBmcmFjdCAoKTogVlxyXG4gICAgbWluIChvdGhlcjogVikgOiBWXHJcbiAgICBtYXggKG90aGVyOiBWKSA6IFZcclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBWXHJcbiAgICBtaXggKG90aGVyOiBWLCBpbnRlclBvczogbnVtYmVyKTogVlxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogVlxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ld1ZlYzxWIGV4dGVuZHMgVmVjPFY+PlxyXG57XHJcbiAgICByZWFkb25seSBkaW1lbnNpb25zOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IHplcm86IFZcclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZcclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWMyIGV4dGVuZHMgVmVjPFZlYzI+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB0b1ZlYzMgKHo6IG51bWJlcik6IFZlYzNcclxuICAgIHRvVmVjNCAoejogbnVtYmVyLCB3OiBudW1iZXIpOiBWZWM0XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMyBleHRlbmRzIFZlYzxWZWMzPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgejogbnVtYmVyXHJcblxyXG4gICAgdG9WZWMyICgpOiBWZWMyXHJcbiAgICB0b1ZlYzQgKHc6IG51bWJlcik6IFZlYzRcclxuICAgIGNyb3NzIChvdGhlcjogVmVjMyk6IFZlYzNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWM0IGV4dGVuZHMgVmVjPFZlYzQ+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG5cclxuICAgIHRvVmVjMiAoKTogVmVjMlxyXG4gICAgdG9WZWMzICgpOiBWZWMzXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9WZWN0b3JzLnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vVmVjdG9yc1wiO1xyXG5pbXBvcnQgeyBOZXdNYXQsIE5ld01hdDQsIE1hdDIsIE1hdDMsIE1hdDQgfSBmcm9tIFwiLi9NYXRyaWNlc1wiO1xyXG5pbXBvcnQgKiBhcyBGTWF0aCBmcm9tIFwiLi9GTWF0aFwiXHJcbmltcG9ydCAqIGFzIEFycmF5SGVscGVyIGZyb20gXCIuLi9Db21tb24vQXJyYXlFeHRcIjtcclxuXHJcbmNsYXNzIE5ld0FycmF5TWF0IGltcGxlbWVudHMgTmV3TWF0PE1hdDI+LCBOZXdNYXQ8TWF0Mz4sIE5ld01hdDRcclxue1xyXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcm93czogbnVtYmVyLCByZWFkb25seSBjb2xzOiBudW1iZXIpIHsgfVxyXG5cclxuICAgIHByaXZhdGUgaWRlbnRpdHlBcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgYXJyID0gQXJyYXlIZWxwZXIuZmlsbCAoQXJyYXk8bnVtYmVyPiAociAqIGMpLCAwKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKHIsIGMpOyBpKyspIFxyXG4gICAgICAgICAgICBhcnJbaSAqIHIgKyBpXSA9IDFcclxuICAgICAgICByZXR1cm4gYXJyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4ociAqIGMpLCAwKSwgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaWRlbnRpdHkgKCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuaWRlbnRpdHlBcnJheSAoKSwgdGhpcy5yb3dzLCB0aGlzLmNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRpb24gKG9mZnNldHM6IG51bWJlcltdKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBsYXN0Q29sID0gYyAtIDFcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChvZmZzZXRzLmxlbmd0aCwgciAtIDEpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbbGFzdENvbCAqIHIgKyBpXSA9IG9mZnNldHNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGluZyAoZmFjdG9yczogbnVtYmVyW10pOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbiAoZmFjdG9ycy5sZW5ndGgsIHIsIGMpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbaSAqIHIgKyBpXSA9IGZhY3RvcnNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25YIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFgtYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbciArIDFdID0gY29zYVxyXG4gICAgICAgIHJlc1tyICsgMl0gPSBzaW5hXHJcbiAgICAgICAgcmVzWzIgKiByICsgMV0gPSAtc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblkgKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBpZiAociA8IDMgfHwgYyA8IDMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBSb3RhdGlvbiBhcm91bmQgWS1heGlzIG5vdCBkZWZpbmVkIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzJdID0gLXNpbmE7XHJcbiAgICAgICAgcmVzWzIgKiByXSA9IHNpbmE7XHJcbiAgICAgICAgcmVzWzIgKiByICsgMl0gPSBjb3NhO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblogKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzWzBdID0gY29zYTtcclxuICAgICAgICByZXNbMV0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1tyXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1tyICsgMV0gPSBjb3NhO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBwZXJzcGVjdGl2ZSAobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsXHJcbiAgICAgICAgek5lYXI6IG51bWJlciwgekZhcjogbnVtYmVyKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGlmICh6TmVhciA8PSAwIHx8IHpOZWFyID49IHpGYXIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiek5lYXIgbmVlZHMgdG8gYmUgcG9zaXRpdmUgYW5kIHNtYWxsZXIgdGhhdG4gekZhclwiKVxyXG4gICAgICAgIGxldCB3aWR0aCA9IHJpZ2h0IC0gbGVmdFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0b3AgLSBib3R0b21cclxuICAgICAgICBsZXQgZGVwdGggPSB6RmFyIC0gek5lYXJcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgWygyLjAgKiB6TmVhcikgLyB3aWR0aCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgKDIuMCAqIHpOZWFyKSAvIGhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgKHJpZ2h0ICsgbGVmdCkgLyB3aWR0aCwgKHRvcCArIGJvdHRvbSkgLyBoZWlnaHQsIC0oekZhciArIHpOZWFyKSAvIGRlcHRoLCAtMSxcclxuICAgICAgICAgICAgMCwgMCwgLSgyLjAgKiB6RmFyICogek5lYXIpIC8gZGVwdGgsIDBdLCBcclxuICAgICAgICAgICAgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBvcnRob2dyYXBoaWMgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgaW52V2lkdGggPSAxLjAgLyAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGxldCBpbnZIZWlnaHQgPSAxLjAgLyAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGxldCBpbnZEZXB0aCA9IDEuMCAvICh6RmFyIC0gek5lYXIpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsyICogaW52V2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDIgKiBpbnZIZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIC0yICogaW52RGVwdGgsIDAsXHJcbiAgICAgICAgICAgIC0ocmlnaHQgKyBsZWZ0KSAqIGludldpZHRoLCAtKHRvcCArIGJvdHRvbSkgKiBpbnZIZWlnaHQsIC0oekZhciArIHpOZWFyKSAqIGludkRlcHRoLCAxXSxcclxuICAgICAgICAgICAgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQgKGRpcmVjdGlvbjogVmVjMywgdXA6IFZlYzMpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHpheGlzID0gZGlyZWN0aW9uLmludiAoKS5ub3JtICgpXHJcbiAgICAgICAgbGV0IHhheGlzID0gdXAuY3Jvc3MgKHpheGlzKS5ub3JtICgpXHJcbiAgICAgICAgbGV0IHlheGlzID0gemF4aXMuY3Jvc3MgKHhheGlzKVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgW3hheGlzLngsIHlheGlzLngsIHpheGlzLngsIDAsXHJcbiAgICAgICAgICAgIHhheGlzLnksIHlheGlzLnksIHpheGlzLnksIDAsXHJcbiAgICAgICAgICAgIHhheGlzLnosIHlheGlzLnosIHpheGlzLnosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFdLCA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIGZyb21BcnJheSAoYXJyYXk6IG51bWJlcltdLCByb3dzOiBudW1iZXIsIGNvbHM6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChhcnJheSwgcm93cywgY29scylcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld01hdDI6IE5ld01hdDxNYXQyPiA9IG5ldyBOZXdBcnJheU1hdCAoMiwgMilcclxuZXhwb3J0IGNvbnN0IG5ld01hdDM6IE5ld01hdDxNYXQzPiA9IG5ldyBOZXdBcnJheU1hdCAoMywgMylcclxuZXhwb3J0IGNvbnN0IG5ld01hdDQ6IE5ld01hdDQgPSBuZXcgTmV3QXJyYXlNYXQgKDQsIDQpXHJcblxyXG5jbGFzcyBBcnJheU1hdCBpbXBsZW1lbnRzIE1hdDIsIE1hdDMsIE1hdDRcclxue1xyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IGFycmF5OiBudW1iZXJbXSwgcmVhZG9ubHkgcm93czogbnVtYmVyLCByZWFkb25seSBjb2xzOiBudW1iZXIpIFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggIT09IHJvd3MgKmNvbHMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiQXJyYXkgbGVuZ3RoIGhhcyB0byBiZSBlcXVhbCB0byByb3dzICogY29sdW1ucy5cIikgXHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudCAocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlbY29sdW1uICogdGhpcy5yb3dzICsgcm93XVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwIChvcGVyOiAoeDogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2KVxyXG4gICAgICAgICAgICB9KSwgdGhpcy5jb2xzLCB0aGlzLnJvd3MpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAyIChvdGhlcjogQXJyYXlNYXQsIG9wZXI6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jb2xzICE9IG90aGVyLmNvbHMgfHwgdGhpcy5yb3dzICE9IG90aGVyLnJvd3MpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiTWF0cml4IGRpbWVuc2lvbnMgbXVzdCBtYXRjaC5cIilcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0aGlzLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAodiwgb3RoZXIuYXJyYXlbaV0pXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hdHJpeE11bHRpcGx5IChvdGhlcjogQXJyYXlNYXQpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCBuID0gdGhpcy5yb3dzXHJcbiAgICAgICAgbGV0IG0gPSB0aGlzLmNvbHNcclxuICAgICAgICBsZXQgcSA9IG90aGVyLnJvd3NcclxuICAgICAgICBsZXQgcCA9IG90aGVyLmNvbHNcclxuICAgICAgICBpZiAobSAhPT0gcSlcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYENhbm5vdCBtdWx0aXBseSAke259eCR7bX0gbWF0cml4IHdpdGggJHtxfXgke3B9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXI+IChuICogcClcclxuICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggcm93cyBhbmQgY29sdW1uc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHA7IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gU3VtIHVwIHJvd3MgZnJvbSB0aGlzIHdpdGggY29sdW1ucyBmcm9tIG90aGVyIG1hdHJpeC5cclxuICAgICAgICAgICAgICAgIGxldCB2YWwgPSAwXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG07IGsrKylcclxuICAgICAgICAgICAgICAgICAgICB2YWwgKz0gdGhpcy5hcnJheVtrICogbiArIGldICogb3RoZXIuYXJyYXlbaiAqIHEgKyBrXVxyXG4gICAgICAgICAgICAgICAgcmVzW2ogKiBuICsgaV0gPSB2YWwgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIG4sIHApXHJcbiAgICB9XHJcblxyXG4gICAgYWRkIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggKyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBzdWIgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCAtIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAtIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG11bCAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4TXVsdGlwbHkgKG90aGVyKSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKiBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2Zvcm08ViBleHRlbmRzIFZlYzxWPj4gKHZlYzogVik6IFZcclxuICAgIHtcclxuICAgICAgICBsZXQgYXJyID0gWy4uLnZlYy50b0FycmF5ICgpLCAxLCAxXS5zbGljZSAoMCwgdGhpcy5jb2xzKVxyXG4gICAgICAgIGxldCB2ZWNtID0gbmV3IEFycmF5TWF0IChhcnIsIHRoaXMuY29scywgMSlcclxuICAgICAgICByZXR1cm4gdmVjLm5ld1ZlYyAoKS5mcm9tQXJyYXkgKHRoaXMubWF0cml4TXVsdGlwbHkgKHZlY20pLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zcG9zZSAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICBsZXQgcm93cyA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBjb2xzID0gdGhpcy5yb3dzXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKHRoaXMuYXJyYXkubGVuZ3RoKVxyXG4gICAgICAgIGxldCBpbmQgPSAwXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sczsgaisrKVxyXG4gICAgICAgICAgICAgICAgcmVzW2ogKiByb3dzICsgaV0gPSB0aGlzLmFycmF5W2luZCsrXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgcm93cywgY29scylcclxuICAgIH1cclxuXHJcbiAgICBkZXRlcm1pbmFudCAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGV0ZXJtaW5hbnRGQSAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnZlcnQgKCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5TWF0LmZyb21KYWdnZWRBcnJheSAodGhpcy5pbnZlcnNlRkEgKCkpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0b0phZ2dlZEFycmF5ICgpOiBudW1iZXJbXVtdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93cywgY29scywgYXJyYXkgfSA9IHRoaXNcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyW10+IChyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzW3JdID0gQXJyYXk8bnVtYmVyPihjb2xzKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbHM7IGMrKylcclxuICAgICAgICAgICAgICAgIHJlc1tyXVtjXSA9IGFycmF5W2MgKiByb3dzICsgcl1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGZyb21KYWdnZWRBcnJheSAobWF0cml4OiBudW1iZXJbXVtdKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICBsZXQgcm93cyA9IG1hdHJpeC5sZW5ndGhcclxuICAgICAgICBsZXQgY29scyA9IG1hdHJpeFswXS5sZW5ndGhcclxuICAgICAgICBsZXQgYXJyID0gQXJyYXk8bnVtYmVyPihjb2xzICogcm93cylcclxuICAgICAgICBsZXQgaSA9IDBcclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbHM7IGMrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICBhcnJbaSsrXSA9IG1hdHJpeFtyXVtjXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKGFyciwgcm93cywgY29scylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlY29tcG9zZUZBIChtYXRyaXg6IG51bWJlcltdW10pOiBbIG51bWJlcltdLCBudW1iZXIgXSBcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzIH0gPSB0aGlzXHJcbiAgICAgICAgaWYgKHJvd3MgIT0gY29scylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJDYW5ub3QgZGVjb21wb3NlIG5vbi1zcXVhcmUgbWF0cml4XCIpXHJcbiAgICAgICAgLy8gc2V0IHVwIHJvdyBwZXJtdXRhdGlvbiByZXN1bHRcclxuICAgICAgICBsZXQgcGVybSA9IEFycmF5PG51bWJlcj4ocm93cylcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykgXHJcbiAgICAgICAgICAgIHBlcm1baV0gPSBpXHJcbiAgICAgICAgLy8gdG9nZ2xlIHRyYWNrcyByb3cgc3dhcHMuICsxIC0+IGV2ZW4sIC0xIC0+IG9kZC4gdXNlZCBieSBNYXRyaXhEZXRlcm1pbmFudFxyXG4gICAgICAgIGxldCB0b2dnbGUgPSAxOyBcclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbHMgLSAxOyBjKyspIC8vIGVhY2ggY29sdW1uXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgY29sTWF4ID0gTWF0aC5hYnMgKG1hdHJpeFtjXVtjXSkgLy8gZmluZCBsYXJnZXN0IHZhbHVlIGluIGNvbCBqXHJcbiAgICAgICAgICAgIGxldCBwUm93ID0gY1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gYyArIDE7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICBpZiAobWF0cml4W3JdW2NdID4gY29sTWF4KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbE1heCA9IG1hdHJpeFtyXVtjXVxyXG4gICAgICAgICAgICAgICAgICAgIHBSb3cgPSByXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwUm93ICE9IGMpIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBsYXJnZXN0IHZhbHVlIG5vdCBvbiBwaXZvdCwgc3dhcCByb3dzXHJcbiAgICAgICAgICAgICAgICBsZXQgcm93UHRyID0gbWF0cml4W3BSb3ddXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbcFJvd10gPSBtYXRyaXhbY11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXSA9IHJvd1B0clxyXG4gICAgICAgICAgICAgICAgLy8gYW5kIHN3YXAgcGVybSBpbmZvXHJcbiAgICAgICAgICAgICAgICBsZXQgdG1wID0gcGVybVtwUm93XVxyXG4gICAgICAgICAgICAgICAgcGVybVtwUm93XSA9IHBlcm1bY11cclxuICAgICAgICAgICAgICAgIHBlcm1bY10gPSB0bXBcclxuICAgICAgICAgICAgICAgIC8vIGFkanVzdCB0aGUgcm93LXN3YXAgdG9nZ2xlXHJcbiAgICAgICAgICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBoYW5kbGUgdGhlIGNhc2Ugd2hlcmUgdGhlIGlucHV0IG1hdHJpeCBpcyBzaW5ndWxhclxyXG4gICAgICAgICAgICBpZiAobWF0cml4W2NdW2NdID09IDApXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbY11bY10gPSAwLjAwMDAwMVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gYyArIDE7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtjXSAvPSBtYXRyaXhbY11bY11cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSBjICsgMTsgayA8IGNvbHM7IGsrKylcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXhbcl1ba10gLT0gbWF0cml4W3JdW2NdICogbWF0cml4W2NdW2tdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFsgcGVybSwgdG9nZ2xlIF1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRldGVybWluYW50RkEgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGxldCBtYXRyaXggPSB0aGlzLnRvSmFnZ2VkQXJyYXkgKClcclxuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5kZWNvbXBvc2VGQSAobWF0cml4KVsxXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0cml4Lmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICByZXN1bHQgKj0gbWF0cml4W2ldW2ldXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW52ZXJzZUZBICgpOiBudW1iZXJbXVtdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCByZXN1bHQgPSBBcnJheUhlbHBlci5jbG9uZSAobWF0cml4KVxyXG4gICAgICAgIGxldCBwZXJtID0gdGhpcy5kZWNvbXBvc2VGQSAobWF0cml4KVswXVxyXG4gICAgICAgIGxldCBiID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcm93czsgYysrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICBiW3JdID0gYyA9PSBwZXJtW3JdID8gMSA6IDBcclxuICAgICAgICAgICAgbGV0IHggPSBBcnJheU1hdC5oZWxwZXJTb2x2ZWYgKG1hdHJpeCwgYikgXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3JdW2NdID0geFtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVscGVyU29sdmVmIChsdU1hdHJpeDogbnVtYmVyW11bXSwgdmVjdG9yOiBudW1iZXJbXSk6IG51bWJlcltdIFxyXG4gICAge1xyXG4gICAgICAgIC8vIGJlZm9yZSBjYWxsaW5nIHRoaXMgaGVscGVyLCBwZXJtdXRlIGIgdXNpbmcgdGhlIHBlcm0gYXJyYXkgZnJvbSBcclxuICAgICAgICAvLyBNYXRyaXhEZWNvbXBvc2UgdGhhdCBnZW5lcmF0ZWQgbHVNYXRyaXhcclxuICAgICAgICBsZXQgcm93cyA9IGx1TWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCByZXMgPSB2ZWN0b3Iuc2xpY2UgKClcclxuXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDE7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgcjsgYysrKVxyXG4gICAgICAgICAgICAgICAgc3VtIC09IGx1TWF0cml4W3JdW2NdICogcmVzW2NdXHJcbiAgICAgICAgICAgIHJlc1tyXSA9IHN1bVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXNbcm93cyAtIDFdIC89IGx1TWF0cml4W3Jvd3MgLSAxXVtyb3dzIC0gMV1cclxuICAgICAgICBmb3IgKGxldCByID0gcm93cyAtIDI7IHIgPj0gMDsgci0tKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IHJlc1tyXVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gciArIDE7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtIC8gbHVNYXRyaXhbcl1bcl1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBlcXVhbHMgKG90aGVyOiBBcnJheU1hdCk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA9PT0gb3RoZXIuYXJyYXlbaV1cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhcHByb3hFcXVhbHMgKG90aGVyOiBBcnJheU1hdCwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRk1hdGguYXBwcm94RXF1YWxzICh2LCBvdGhlci5hcnJheVtpXSwgZXBzaWxvbilcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJlcyA9IFwiXCJcclxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHRoaXMucm93czsgcisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmVzICs9IFwiWyBcIlxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHRoaXMuY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzICs9IHRoaXMuZWxlbWVudChyLCBjKSArIFwiIFwiXHJcbiAgICAgICAgICAgIHJlcyArPSBcIl1cXG5cIlxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5ICh0aGlzLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIHRvTWF0MiAoKTogTWF0MlxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAyKSwgIFxyXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAodGhpcy5yb3dzLCB0aGlzLnJvd3MgKyAyKSAgXHJcbiAgICAgICAgICAgIF0sIDIsIDIpXHJcbiAgICB9XHJcblxyXG4gICAgdG9NYXQzICgpOiBNYXQzXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnJvd3MpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAyKSwgMCwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDIsIDQpLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIDEgIFxyXG4gICAgICAgICAgICAgICAgXSwgMywgMylcclxuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAzKSwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDQsIDcpLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoOCwgMTEpICBcclxuICAgICAgICAgICAgICAgIF0sIDMsIDMpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGNvbnZlcnNpb24uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvTWF0NCAoKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5yb3dzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMiksIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMiwgNCksIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxICAgXHJcbiAgICAgICAgICAgICAgICBdLCA0LCA0KVxyXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDMpLCAwLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMywgNyksIDAsICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICg3LCAxMCksIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMSAgIFxyXG4gICAgICAgICAgICAgICAgXSwgNCwgNClcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgY29udmVyc2lvbi5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsImV4cG9ydCB0eXBlIFNoYWRlclR5cGUgPSAndmVydGV4JyB8ICdmcmFnbWVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkZXJcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xTaGFkZXI6IFdlYkdMU2hhZGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcmVhZG9ubHkgdHlwZTogU2hhZGVyVHlwZSwgc291cmNlOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgICAgIGxldCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodGhpcy5nbFNoYWRlclR5cGUpO1xyXG4gICAgICAgIGlmIChzaGFkZXIgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yIChgRmFpbGVkIHRvIGNyZWF0ZSAke3R5cGV9IHNoYWRlci5gKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9ICdBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcilcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcilcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsU2hhZGVyID0gc2hhZGVyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdsU2hhZGVyVHlwZSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3ZlcnRleCcgPyBcclxuICAgICAgICAgICAgdGhpcy5nbC5WRVJURVhfU0hBREVSIDogXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvU2hhZGVyLnRzIiwiaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCI7XHJcbmltcG9ydCB7IFZlcnRleEF0dHIsIFZlcnRleEF0dHJUeXBlLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWZmZXIgZXh0ZW5kcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCByZWFkb25seSB0YXJnZXQ6IG51bWJlcixcclxuICAgICAgICByZWFkb25seSBnbEJ1ZmZlcjogV2ViR0xCdWZmZXIsIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyIChnbClcclxuICAgIH1cclxuXHJcbiAgICB1c2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCB0aGlzLmdsQnVmZmVyKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbGVhc2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCBudWxsKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4QnVmZmVyPFY+IGV4dGVuZHMgQnVmZmVyIFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj4sIHZlcnRpY2VzOiBWW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXggYnVmZmVyLicpXHJcbiAgICAgICAgc3VwZXIgKGdsLCBnbC5BUlJBWV9CVUZGRVIsIGJ1ZiwgdmVydGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRCdWZmZXIgKHZlcnRleERlZiwgdmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVykpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0QnVmZmVyICh2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSk6IEFycmF5QnVmZmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlcnRleFNpemUgPSB2ZXJ0ZXhEZWYuc3RyaWRlXHJcbiAgICAgICAgbGV0IGxlbiA9IHZlcnRpY2VzLmxlbmd0aFxyXG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIgKHZlcnRleFNpemUgKiBsZW4pXHJcbiAgICAgICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcgKGJ1ZmZlcilcclxuICAgICAgICB2ZXJ0ZXhEZWYudmVydGV4QXR0cnMuZm9yRWFjaCAoYXR0ciA9PiBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICB2YXIgc2V0dGVyID0gdGhpcy52ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3LCBhdHRyLnR5cGUpXHJcbiAgICAgICAgICAgIGxldCB0eXBlU2l6ZSA9IGF0dHIudHlwZVNpemVcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGF0dHIuZ2V0dGVyICh2ZXJ0aWNlc1tqXSlcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXR0ci5udW1Db21wb25lbnRzOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGVyICgoaiAqIHZlcnRleFNpemUpICsgYXR0ci5vZmZzZXQgKyAoayAqIHR5cGVTaXplKSwgdmFsdWVzW2tdKSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlclxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmVydGV4QXR0clNldHRlciAodmlldzogRGF0YVZpZXcsIHR5cGU6IFZlcnRleEF0dHJUeXBlKTogXHJcbiAgICAgICAgKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50MTYgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldFVpbnQxNiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRGbG9hdDMyIChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleEJ1ZmZlciBleHRlbmRzIEJ1ZmZlclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgaW5kaWNlczogbnVtYmVyW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSBpbmRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBidWYsIGluZGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MTZBcnJheSAoaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9CdWZmZXJzLnRzIiwiaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vU2hhZGVyXCJcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcbmltcG9ydCB7IFVuaWZvcm0sIFVuaWZvcm1EZWYgfSBmcm9tIFwiLi9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbTxWLCBVPiBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xQcm9ncmFtOiBXZWJHTFByb2dyYW1cclxuICAgIHJlYWRvbmx5IHNoYWRlcnM6IFNoYWRlcltdXHJcbiAgICByZWFkb25seSB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPlxyXG4gICAgcmVhZG9ubHkgdW5pZm9ybURlZjogVW5pZm9ybURlZjxVPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBcclxuICAgICAgICBzaGFkZXJzOiBTaGFkZXJbXSwgXHJcbiAgICAgICAgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXSxcclxuICAgICAgICB1bmlmb3JtczogVW5pZm9ybTxVPltdKSBcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gc2hhZGVyc1xyXG4gICAgICAgIHRoaXMuZ2xQcm9ncmFtID0gdGhpcy5saW5rICgpXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYgPSBuZXcgVmVydGV4RGVmICh2ZXJ0ZXhBdHRycylcclxuICAgICAgICB0aGlzLnZlcnRleERlZi5pbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgICAgIHRoaXMudW5pZm9ybURlZiA9IG5ldyBVbmlmb3JtRGVmICh1bmlmb3JtcylcclxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYuaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsLCB0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxpbmsgKCk6IFdlYkdMUHJvZ3JhbVxyXG4gICAge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcclxuICAgICAgICBsZXQgcHJnID0gZ2wuY3JlYXRlUHJvZ3JhbSgpXHJcbiAgICAgICAgaWYgKHByZyA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYWRlcnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcmcsIHRoaXMuc2hhZGVyc1tpXS5nbFNoYWRlcik7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJnKTtcclxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJnLCBnbC5MSU5LX1NUQVRVUykpIFxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJyArIFxyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJnKSlcclxuICAgICAgICByZXR1cm4gcHJnXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgICAgICAgICAgICBhdHRyLmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5udW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5nbFR5cGUgKGdsKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEZWYuc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5vZmZzZXQpO1xyXG4gICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRyLmxvY2F0aW9uKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAodGhpcy5nbFByb2dyYW0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAobnVsbClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RWxlbWVudHMgKG1vZGU6IG51bWJlciwgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFY+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgdXNpbmcgKFt0aGlzLCB2YnVmZmVyLCBpYnVmZmVyXSwgZ2wgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybURlZi5zZXRWYWx1ZXMgKGdsLCB1bmlmb3JtcylcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyAobW9kZSwgaWJ1ZmZlci5sZW5ndGgsIGdsLlVOU0lHTkVEX1NIT1JULCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvUHJvZ3JhbS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCIgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcclxcbiB2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuIFxcclxcbiB1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXHJcXG4gdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcclxcblxcclxcbnZvaWQgbWFpbigpIHtcXHJcXG4gICAgdmVjNCBwb3MgPSB2ZWM0IChhVmVydGV4UG9zaXRpb24sIDAsIDEpO1xcclxcbiAgICBwb3NpdGlvbiA9IG1heChwb3MueHl6LCB2ZWMzKDApKTtcXHJcXG4gICAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVNb2RlbFZpZXdNYXRyaXggKiBwb3M7XFxyXFxuIH1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLnZlcnRcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuXFxyXFxudm9pZCBtYWluKCkgeyBcXHJcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChwb3NpdGlvbiwgMS4wKTtcXHJcXG59XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9