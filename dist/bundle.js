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
const FMath_1 = __webpack_require__(0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTU3OTc1YTdiYzg0NDBmOGMzZTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7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QyxDQUFDLEVBQ3ZDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsWUFBWSxDQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLEdBQVcsRUFDbEUsS0FBYSxFQUFFLElBQVk7UUFFM0IsSUFBSSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ3BDLElBQUksUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbkMsT0FBTyxJQUFJLFFBQVEsQ0FDZixDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQ3ZGLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFFLFNBQWUsRUFBRSxFQUFRO1FBRTdCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUM7UUFFL0IsT0FBTyxJQUFJLFFBQVEsQ0FDZixDQUFDLEtBQUssQ0FBQyxDQUFD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QUMsYUFBYSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBQyxFQUNoQixLQUFLLEVBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxHQUFHO1FBRUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsT0FBTztRQUVILElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFFLElBQVksRUFBRSxPQUF3QixFQUFFLE9BQW9CLEVBQUUsUUFBVztRQUVuRixrQkFBSyxDQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUVsQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxzQkFBc0IsRUFBRztZQUM5QixFQUFFLENBQUMsWUFBWSxDQUFFLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXhFRCwwQkF3RUM7Ozs7Ozs7QUM5RUQsa0RBQWtELGlDQUFpQyx3Q0FBd0Msb0NBQW9DLHFCQUFxQixnREFBZ0QseUNBQXlDLGlFQUFpRSxNQUFNLEs7Ozs7OztBQ0FwViw4Q0FBOEMscUJBQXFCLDRDQUE0QyxLQUFLLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTU3OTc1YTdiYzg0NDBmOGMzZTEiLCJleHBvcnQgY29uc3QgdHdvUEkgPSBNYXRoLlBJICogMlxyXG5leHBvcnQgY29uc3QgUElvdmVyMiA9IE1hdGguUEkgLyAyXHJcbmV4cG9ydCBjb25zdCBQSW92ZXI0ID0gTWF0aC5QSSAvIDRcclxuZXhwb3J0IGNvbnN0IFBJb3ZlcjggPSBNYXRoLlBJIC8gOFxyXG5leHBvcnQgY29uc3QgUElvdmVyMTYgPSBNYXRoLlBJIC8gMTZcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHByb3hFcXVhbHMgKHg6IG51bWJlciwgeTogbnVtYmVyLCBcclxuICAgIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKSA6IGJvb2xlYW5cclxue1xyXG4gICAgaWYgKHggPT09IHkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgbGV0IGFic1ggPSBNYXRoLmFicyAoeCk7XHJcbiAgICBsZXQgYWJzWSA9IE1hdGguYWJzICh5KTtcclxuICAgIGxldCBkaWZmID0gTWF0aC5hYnMgKHggLSB5KTtcclxuXHJcbiAgICBpZiAoeCAqIHkgPT0gMClcclxuICAgICAgICByZXR1cm4gZGlmZiA8IChlcHNpbG9uICogZXBzaWxvbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgLyAoYWJzWCArIGFic1kpIDwgZXBzaWxvbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyYWN0ICh4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggLSBNYXRoLmZsb29yICh4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wICh4OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4geCA8IG1pbiA/IG1pbiA6XHJcbiAgICAgICAgICAgeCA+IG1heCA/IG1heCA6XHJcbiAgICAgICAgICAgeDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1peCAoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGludGVyUG9zOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHN0YXJ0ICsgKGludGVyUG9zICogKGVuZCAtIHN0YXJ0KSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGVwIChlZGdlOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlIDwgZWRnZSA/IDAgOiAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIGxldCB0ID0gY2xhbXAgKCh2YWx1ZSAtIGVkZ2VMb3dlcikgLyAoZWRnZVVwcGVyIC0gZWRnZUxvd2VyKSwgMCwgMSk7XHJcbiAgICByZXR1cm4gdCAqIHQgKiAoMyAtICgyICogdCkpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvRk1hdGgudHMiLCJpbXBvcnQgeyBFcXVhdGFibGUgfSBmcm9tIFwiLi9FcXVhdGFibGVcIjtcclxuaW1wb3J0IHsgYXBwcm94RXF1YWxzIH0gZnJvbSBcIi4uL01hdGgvRk1hdGhcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUPiAoYXJyYXk6IFRbXVtdKTogVFtdW11cclxue1xyXG4gICAgbGV0IHJvd3MgPSBhcnJheS5sZW5ndGhcclxuICAgIGxldCByZXMgPSBBcnJheTxUW10+KHJvd3MpXHJcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICByZXNbcl0gPSBhcnJheVtyXS5zbGljZSAoKVxyXG4gICAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbDxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpOiBUW11cclxue1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcclxuICAgICAgICBhcnJheVtpXSA9IHZhbHVlXHJcbiAgICByZXR1cm4gYXJyYXlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPiAodmFsdWU6IFQsIGNvdW50OiBudW1iZXIpOiBUW11cclxue1xyXG4gICAgdmFyIHJlcyA9IEFycmF5PFQ+IChjb3VudClcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICByZXNbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1heEl0ZW1zPFQ+IChhcnJheTogVFtdLCBzZWxlY3RvcjogKMOtdGVtOiBUKSA9PiBudW1iZXIpOiBUW11cclxue1xyXG4gICAgbGV0IHJlczogVFtdID0gW11cclxuICAgIGxldCBtYXggPSBOdW1iZXIuTUFYX1ZBTFVFXHJcbiAgICBmb3IgKGxldCBpdGVtIG9mIGFycmF5KVxyXG4gICAge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHNlbGVjdG9yIChpdGVtKTtcclxuICAgICAgICBpZiAodmFsdWUgPiBtYXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBtYXggPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmVzID0gWyBpdGVtIF1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXBwcm94RXF1YWxzICh2YWx1ZSwgbWF4KSlcclxuICAgICAgICAgICAgcmVzLnB1c2ggKGl0ZW0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3VtIChhcnJheTogbnVtYmVyW10pOiBudW1iZXJcclxue1xyXG4gICAgbGV0IHJlcyA9IDBcclxuICAgIGZvciAodmFyIGl0ZW0gb2YgYXJyYXkpXHJcbiAgICAgICAgcmVzICs9IGl0ZW1cclxuICAgIHJldHVybiByZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0PFQgZXh0ZW5kcyBFcXVhdGFibGU8VD4+IChhcnJheTogVFtdKVxyXG57XHJcbiAgICBsZXQgZmlyc3RPY2N1cmVuY2UgPSAoaXRlbTogVCwgaW5kZXg6IG51bWJlcikgPT4gYXJyYXkuZmluZEluZGV4IChpID0+IGkuZXF1YWxzIChpdGVtKSkgPT09IGluZGV4XHJcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyIChmaXJzdE9jY3VyZW5jZSkgICAgXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbGF0TWFwPFQsIFU+IChhcnJheTogVFtdLCBzZWxlY3RvcjogKGl0ZW06IFQpID0+IFVbXSk6IFVbXVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEFycmF5PFU+ICgpLmNvbmNhdCAoLi4uYXJyYXkubWFwIChzZWxlY3RvcikpXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29tbW9uL0FycmF5RXh0LnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVmVydGV4QXR0clR5cGUgPSAnYnl0ZScgfCAnc2hvcnQnIHwgJ3VieXRlJyB8ICd1c2hvcnQnIHwgJ2Zsb2F0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgbG9jYXRpb246IG51bWJlclxyXG4gICAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB0eXBlOiBWZXJ0ZXhBdHRyVHlwZSxcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFYpID0+IG51bWJlcltdKSB7IH1cclxuXHJcbiAgICBnZXQgdHlwZVNpemUgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiBcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiBcclxuICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzpcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMlxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXplSW5CeXRlcyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCAodGhpcy50eXBlU2l6ZSAqIHRoaXMubnVtQ29tcG9uZW50cyAvIDQpICogNFxyXG4gICAgfVxyXG5cclxuICAgIGdsVHlwZSAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gZ2wuQllURVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIGdsLlNIT1JUXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6IHJldHVybiBnbC5GTE9BVFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBhdHRyaWJ1dGUgdHlwZS5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhEZWY8Vj5cclxue1xyXG4gICAgcmVhZG9ubHkgc3RyaWRlOiBudW1iZXJcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IHZlcnRleEF0dHJzOiBWZXJ0ZXhBdHRyPFY+W10pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdHJpZGUgPSB0aGlzLmluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2ggKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHYub2Zmc2V0ID0gb2Zmc2V0XHJcbiAgICAgICAgICAgIG9mZnNldCArPSB2LnNpemVJbkJ5dGVzIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyTG9jYXRpb25zIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcmc6IFdlYkdMUHJvZ3JhbSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2godiA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uIChwcmcsIHYubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA8IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvciAoYFZlcnRleCBhdHRyaWJ1dGUgJyR7di5uYW1lfScgbm90IGZvdW5kIGluIHByb2dyYW0uYClcclxuICAgICAgICAgICAgdi5sb2NhdGlvbiA9IGxvY1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBieXRlPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdieXRlJywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVieXRlPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1Ynl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydDxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnc2hvcnQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNob3J0PFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1c2hvcnQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmxvYXQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMiwgdiA9PiAoPFZlYzI+dltuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzM8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMywgdiA9PiAoPFZlYzM+dltuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgNCwgdiA9PiAoPFZlYzQ+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4uL01hdGgvTWF0cmljZXNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1UeXBlID0gJ2ludCcgfCAnZmxvYXQnIHwgJ21hdHJpeCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtPFU+XHJcbntcclxuICAgIGxvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IFVuaWZvcm1UeXBlLCBcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFUpID0+IG51bWJlcltdKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgbG93Q29tcCA9IHR5cGUgPT09ICdtYXRyaXgnID8gMiA6IDFcclxuICAgICAgICBpZiAobnVtQ29tcG9uZW50cyA8IGxvd0NvbXAgfHwgbnVtQ29tcG9uZW50cyA+IDQpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBOdW1iZXIgb2YgY29tcG9uZW50cyBtdXN0IGJlIFske2xvd0NvbXB9Li40XSBmb3IgJHt0eXBlfS5gKVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICBsZXQgdmFsID0gdGhpcy5nZXR0ZXIgKHVuaWZvcm1zKVxyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoIDwgdGhpcy5udW1Db21wb25lbnRzIHx8IHZhbC5sZW5ndGggJSB0aGlzLm51bUNvbXBvbmVudHMgIT09IDApXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnSW52YWxpZCBudW1iZXIgb2YgdW5pZm9ybSBlbGVtZW50cy4nKVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5udW1Db21wb25lbnRzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMml2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgyZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2l2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybURlZjxVPlxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgdW5pZm9ybXM6IFVuaWZvcm08VT5bXSkgeyB9XHJcblxyXG4gICAgaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCh1ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcmcsIHUubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVW5pZm9ybSAnJHt1Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB1LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCAodW5pZiA9PiB1bmlmLnNldFZhbHVlIChnbCwgdW5pZm9ybXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludDxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnaW50JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMyPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDIsIHUgPT4gKDxWZWMyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDMsIHUgPT4gKDxWZWMzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWM0PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDQsIHUgPT4gKDxWZWM0PnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQyPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAyLCB1ID0+ICg8TWF0Mj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MzxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgMywgdSA9PiAoPE1hdDM+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDQ8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDQsIHUgPT4gKDxNYXQ0PnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgR0xSZXNvdXJjZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCkgeyB9XHJcbiAgICBhYnN0cmFjdCB1c2UgKClcclxuICAgIGFic3RyYWN0IHJlbGVhc2UgKClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nIChyZXNvdXJjZTogR0xSZXNvdXJjZSB8IEdMUmVzb3VyY2VbXSwgXHJcbiAgICBhY3Rpb246IChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSA9PiB2b2lkKVxyXG57XHJcbiAgICBsZXQgcmVzID0gcmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSA/IFxyXG4gICAgICAgIHJlc291cmNlLnBvcCAoKSA6IFxyXG4gICAgICAgIHJlc291cmNlXHJcbiAgICBpZiAoIXJlcylcclxuICAgICAgICByZXR1cm5cclxuICAgIHJlcy51c2UgKClcclxuICAgIHRyeVxyXG4gICAge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ICYmIHJlc291cmNlLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHVzaW5nIChyZXNvdXJjZSwgYWN0aW9uKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYWN0aW9uIChyZXMuZ2wpXHJcbiAgICB9XHJcbiAgICBmaW5hbGx5XHJcbiAgICB7XHJcbiAgICAgICAgcmVzLnJlbGVhc2UgKClcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9HTFJlc291cmNlLnRzIiwiaW1wb3J0IHsgTmV3VmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdGgvTWF0cmljZXNcIjtcclxuaW1wb3J0IHsgbmV3VmVjMiwgbmV3VmVjNCB9IGZyb20gXCIuL01hdGgvQXJyYXlWZWNcIlxyXG5pbXBvcnQgeyBuZXdNYXQ0IH0gZnJvbSBcIi4vTWF0aC9BcnJheU1hdFwiXHJcbmltcG9ydCB7IFBJb3ZlcjggfSBmcm9tIFwiLi9NYXRoL0ZNYXRoXCJcclxuaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vR0wvU2hhZGVyXCJcclxuaW1wb3J0ICogYXMgVkF0dHIgZnJvbSBcIi4vR0wvVmVydGV4QXR0clwiXHJcbmltcG9ydCAqIGFzIFVuaWYgZnJvbSBcIi4vR0wvVW5pZm9ybXNcIlxyXG5pbXBvcnQgeyBWZXJ0ZXhCdWZmZXIsIEluZGV4QnVmZmVyIH0gZnJvbSBcIi4vR0wvQnVmZmVyc1wiO1xyXG5pbXBvcnQgeyBQcm9ncmFtIH0gZnJvbSBcIi4vR0wvUHJvZ3JhbVwiXHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLnZlcnQnKVxyXG5jb25zdCBmc1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUuZnJhZycpXHJcblxyXG5jbGFzcyBTaW1wbGVWZXJ0ZXggXHJcbntcclxuICAgIGFWZXJ0ZXhQb3NpdGlvbjogVmVjMiBcclxufVxyXG5cclxuY2xhc3MgTXlVbmlmb3Jtc1xyXG57XHJcbiAgICB1TW9kZWxWaWV3TWF0cml4OiBNYXQ0XHJcbiAgICB1UHJvamVjdGlvbk1hdHJpeDogTWF0NCBcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1NjZW5lKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW06IFByb2dyYW08U2ltcGxlVmVydGV4LCBNeVVuaWZvcm1zPiwgXHJcbiAgICB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8U2ltcGxlVmVydGV4PiwgaWJ1ZmZlcjogSW5kZXhCdWZmZXIsIHVuaWZvcm1zOiBNeVVuaWZvcm1zKSBcclxue1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApOyAgLy8gQ2xlYXIgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG4gICAgZ2wuY2xlYXJEZXB0aCgxLjApOyAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xyXG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpOyAgICAgICAgICAgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcclxuICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpOyAgICAgICAgICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xyXG4gIFxyXG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuICBcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHJcbiAgICBwcm9ncmFtLmRyYXdFbGVtZW50cyAoZ2wuVFJJQU5HTEVfU1RSSVAsIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluICgpXHJcbntcclxuICAgIGxldCB2ZXJ0aWNlczogU2ltcGxlVmVydGV4W10gPSBbXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoMSwgMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgtMSwgMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAtMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgtMSwgLTEpIH1cclxuICAgIF1cclxuICAgIGxldCBpbmRpY2VzID0gWyAwLCAxLCAyLCAzIF1cclxuICAgIGxldCB1bmlmb3JtczogTXlVbmlmb3JtcyA9IHtcclxuICAgICAgICB1TW9kZWxWaWV3TWF0cml4OiBuZXdNYXQ0LnRyYW5zbGF0aW9uIChbMC4wLCAwLjAsIC00LjBdKS5tdWwobmV3TWF0NC5yb3RhdGlvblggKFBJb3ZlcjgpKSxcclxuICAgICAgICB1UHJvamVjdGlvbk1hdHJpeDogbmV3TWF0NC5wZXJzcGVjdGl2ZSAoLTEsIDEsIC0xLCAxLCAxLCAxMDApXHJcbiAgICB9XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnbENhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIC8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuICAgIGxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4gICAgLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuICAgIGlmICghZ2wpIHtcclxuICAgICAgICBhbGVydChcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCB2ZXJ0U2hhZGVyID0gbmV3IFNoYWRlciAoZ2wsICd2ZXJ0ZXgnLCB2c1NvdXJjZSlcclxuICAgIGxldCBmcmFnU2hhZGVyID0gbmV3IFNoYWRlciAoZ2wsICdmcmFnbWVudCcsIGZzU291cmNlKVxyXG5cclxuICAgIGxldCBwcm9ncmFtID0gbmV3IFByb2dyYW08U2ltcGxlVmVydGV4LCBNeVVuaWZvcm1zPiAoZ2wsXHJcbiAgICAgICAgWyB2ZXJ0U2hhZGVyLCBmcmFnU2hhZGVyIF0sXHJcbiAgICAgICAgWyBWQXR0ci52ZWMyICgnYVZlcnRleFBvc2l0aW9uJykgXSxcclxuICAgICAgICBbIFVuaWYubWF0NCAoJ3VNb2RlbFZpZXdNYXRyaXgnKSwgVW5pZi5tYXQ0ICgndVByb2plY3Rpb25NYXRyaXgnKSBdKVxyXG5cclxuICAgIGxldCB2YnVmZmVyID0gbmV3IFZlcnRleEJ1ZmZlciAoZ2wsIHByb2dyYW0udmVydGV4RGVmLCB2ZXJ0aWNlcylcclxuICAgIGxldCBpYnVmZmVyID0gbmV3IEluZGV4QnVmZmVyIChnbCwgaW5kaWNlcylcclxuXHJcbiAgICBkcmF3U2NlbmUgKGdsLCBwcm9ncmFtLCB2YnVmZmVyLCBpYnVmZmVyLCB1bmlmb3JtcylcclxufVxyXG5cclxubWFpbiAoKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9UZXN0LnRzIiwiaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgeyBEaW0sIFZlYywgVmVjMiwgVmVjMywgVmVjNCwgTmV3VmVjIH0gZnJvbSBcIi4vVmVjdG9yc1wiXHJcbmltcG9ydCAqIGFzIEFycmF5RXh0IGZyb20gXCIuLi9Db21tb24vQXJyYXlFeHRcIlxyXG5cclxuY2xhc3MgTmV3QXJyYXlWZWMgaW1wbGVtZW50cyBOZXdWZWM8VmVjMj4sIE5ld1ZlYzxWZWMzPiwgTmV3VmVjPFZlYzQ+XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBkaW1lbnNpb25zOiBudW1iZXIpIHsgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUV4dC5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCAwKSlcclxuICAgIH1cclxuXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUV4dC5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh2YWx1ZXMpXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoIDwgdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChhcnJheS5zbGljZSAoMCwgdGhpcy5kaW1lbnNpb25zKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzI6IE5ld1ZlYzxWZWMyPiA9IG5ldyBOZXdBcnJheVZlYyAoMilcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzM6IE5ld1ZlYzxWZWMzPiA9IG5ldyBOZXdBcnJheVZlYyAoMylcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzQ6IE5ld1ZlYzxWZWM0PiA9IG5ldyBOZXdBcnJheVZlYyAoNClcclxuXHJcbmNsYXNzIEFycmF5VmVjIGltcGxlbWVudHMgVmVjMiwgVmVjMywgVmVjNFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBhcnJheTogbnVtYmVyW10pIHsgfVxyXG5cclxuICAgIGdldCBkaW1lbnNpb25zICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICB3aXRoIChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoKHYsIGksIGEpID0+IGkgPT0gaW5kZXggPyB2YWx1ZSA6IHYpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB4ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueF0gfVxyXG4gICAgc2V0IHggKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueF0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHkgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS55XSB9XHJcbiAgICBzZXQgeSAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS55XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeiAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnpdIH1cclxuICAgIHNldCB6ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnpdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB3ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ud10gfVxyXG4gICAgc2V0IHcgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ud10gPSB2YWx1ZSB9XHJcbiAgICBcclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgQXJyYXkgKGNvb3Jkcy5sZW5ndGgpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuYXJyYXlbY29vcmRzW2ldXVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKHYgPT4gb3BlciAodikpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheVZlYywgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgKHYsIGkpID0+IG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVkdWNlIChvcGVyOiAoYWNjOiBudW1iZXIsIHg6IG51bWJlcikgPT4gbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlICgoYywgdikgPT4gb3BlciAoYywgdiksIDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgbGVuU3FyICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UgKChhLCB4KSA9PiBhICsgKHggKiB4KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0ICh0aGlzLmxlblNxcilcclxuICAgIH1cclxuXHJcbiAgICBpbnYgKCkgOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiAteClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggKyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBzdWIgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAtIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAtIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG11bCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4ICogeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgZGl2IChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBub3JtICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5sZW5cclxuICAgICAgICBpZiAobCA9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBub3JtYWxpemUgemVybyB2ZWN0b3JcIilcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4geCAvIGwpXHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlWZWMpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlWZWMsIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvdCAob3RoZXI6IEFycmF5VmVjKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGM6IG51bWJlciwgdjogbnVtYmVyLCBpOiBudW1iZXIsIGE6IG51bWJlcltdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYyArICh2ICogb3RoZXIuYXJyYXlbaV0pIFxyXG4gICAgICAgICAgICB9LCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKFtcclxuICAgICAgICAgICAgdGhpcy55ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLnksXHJcbiAgICAgICAgICAgIHRoaXMueiAqIG90aGVyLnggLSB0aGlzLnggKiBvdGhlci56LFxyXG4gICAgICAgICAgICB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueF0pXHRcdFxyXG4gICAgfVxyXG5cclxuICAgIGFicyAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguYWJzKVxyXG4gICAgfVxyXG5cclxuICAgIGZsb29yICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5mbG9vcilcclxuICAgIH1cclxuXHJcbiAgICBjZWlsICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5jZWlsKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdW5kICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5yb3VuZClcclxuICAgIH1cclxuXHJcbiAgICBmcmFjdCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKEZNYXRoLmZyYWN0KVxyXG4gICAgfVxyXG5cclxuICAgIG1pbiAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgTWF0aC5taW4pXHJcbiAgICB9XHJcblxyXG4gICAgbWF4IChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCBNYXRoLm1heClcclxuICAgIH1cclxuXHJcbiAgICBjbGFtcCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguY2xhbXAgKHgsIG1pbiwgbWF4KSlcclxuICAgIH1cclxuXHJcbiAgICBtaXggKG90aGVyOiBBcnJheVZlYywgaW50ZXJQb3M6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiBGTWF0aC5taXggKHgsIHksIGludGVyUG9zKSlcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zdGVwIChlZGdlLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zbW9vdGhTdGVwIChlZGdlTG93ZXIsIGVkZ2VVcHBlciwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMuYXJyYXkuam9pbiAoXCIgXCIpICsgXCJdXCJcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5ICh0aGlzLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIG5ld1ZlYyAoKTogTmV3QXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IE5ld0FycmF5VmVjICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICB9XHJcblxyXG4gICAgdG9WZWMyICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpKVxyXG4gICAgfVxyXG5cclxuICAgIHRvVmVjMyAoejogbnVtYmVyID0gMCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHpdKVxyXG4gICAgICAgICAgICBjYXNlIDQ6IG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5zbGljZSAoMCwgMykpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGNvbnZlcnNpb24uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvVmVjNCAoejogbnVtYmVyID0gMCwgdzogbnVtYmVyID0gMCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHosIHddKVxyXG4gICAgICAgICAgICBjYXNlIDM6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHddKVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheVZlYy50cyIsImltcG9ydCB7IEVxdWF0YWJsZSB9IGZyb20gXCIuLi9Db21tb24vRXF1YXRhYmxlXCI7XHJcblxyXG4vKipcclxuICogRW51bWVyYXRpb24gdGhhdCBkZWZpbmVzIHRoZSBjb29yZGluYXRlIGRpbWVuc2lvbnMgdXNlZCBpbiB0aGUgdmVjdG9yIHR5cGVzLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gRGltIFxyXG57XHJcbiAgICB4ID0gMCxcclxuICAgIHkgPSAxLCBcclxuICAgIHogPSAyLFxyXG4gICAgdyA9IDNcclxufVxyXG5cclxuLyoqIFxyXG4gKiBCYXNlIGludGVyZmFjZSBmb3IgYWxsIHZlY3RvcnkgdHlwZXMuIERlZmluZXMgbWV0aG9kcyB0aGF0IGhhdmUgdGhlIHNhbWUgc2lnbmF0dXJlXHJcbiAqIGluIGFsbCB2ZWN0b3IgdmFyaWFudHMuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzxWIGV4dGVuZHMgVmVjPFY+PiBleHRlbmRzIEVxdWF0YWJsZTxWPlxyXG57XHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBkaW1lbnNpb25zIGluIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlclxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gb25lIG9yIG1vcmUgY29tcG9uZW50cyBvZiB0aGUgdmVjdG9yIGluIGFyYml0cmFyeSBvcmRlci4gVGhlIGNvbXBvbmVudHNcclxuICAgICAqIHJldHVybmVkIGRlcGVuZCBvbiB0aGUgZGltZW5zaW9ucyBzcGVjaWZpZWQgaW4gdGhlIGNvb3JkcyBhcmd1bWVudC4gTm90ZSB0aGF0XHJcbiAgICAgKiB0aGUgc2FtZSBjb21wb25lbnQgY2FuIG9jY3VyIG11bHRpcGxlIHRpbWVzIGluIGNvb3Jkcy4gU28sIGl0IGlzIHZhbGlkIHRvIGNhbGxcclxuICAgICAqIHRoZSBmdW5jdGlvbiBsaWtlIHRoaXM6XHJcbiAgICAgKiBcclxuICAgICAqIHN3aXp6bGUgKFtEaW0ueCwgRGltLngsIERpbS55XSlcclxuICAgICAqL1xyXG4gICAgc3dpenpsZSAoY29vcmRzOiBEaW1bXSk6IG51bWJlcltdXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBsZW5naHQgb2YgdGhlIHZlY3RvciBzcXVhcmVkLiBGYXN0ZXIgdG8gY2FsY3VsYXRlIHRoYW4gdGhlIGFjdHVhbCBsZW5ndGgsXHJcbiAgICAgKiBhbmQgdXNlZnVsIGZvciBjb21wYXJpbmcgdmVjdG9yIG1hZ25pdHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlblNxcjogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIExlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBsZW46IG51bWJlclxyXG5cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IFZcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yLiBGb3JtYXR0ZWQgbGlrZSB0aGlzOiBbeCB5IHpdXHJcbiAgICAgKi9cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICBuZXdWZWMgKCk6IE5ld1ZlYzxWPlxyXG4gICAgXHJcbiAgICBpbnYgKCk6IFZcclxuICAgIGFkZCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBzdWIgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbXVsIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIGRpdiAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBub3JtICgpOiBWXHJcbiAgICBhcHByb3hFcXVhbHMgKG90aGVyOiBWLCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAgZG90IChvdGhlcjogVik6IG51bWJlclxyXG4gICAgYWJzICgpOiBWXHJcbiAgICBmbG9vciAoKTogVlxyXG4gICAgY2VpbCAoKTogVlxyXG4gICAgcm91bmQgKCk6IFZcclxuICAgIGZyYWN0ICgpOiBWXHJcbiAgICBtaW4gKG90aGVyOiBWKSA6IFZcclxuICAgIG1heCAob3RoZXI6IFYpIDogVlxyXG4gICAgY2xhbXAgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IFZcclxuICAgIG1peCAob3RoZXI6IFYsIGludGVyUG9zOiBudW1iZXIpOiBWXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBWXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV3VmVjPFYgZXh0ZW5kcyBWZWM8Vj4+XHJcbntcclxuICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgemVybzogVlxyXG4gICAgdW5pZiAoeDogbnVtYmVyKTogVlxyXG4gICAgaW5pdCAoLi4udmFsdWVzOiBudW1iZXJbXSk6IFZcclxuICAgIGZyb21BcnJheSAoYXJyYXk6IG51bWJlcltdKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzIgZXh0ZW5kcyBWZWM8VmVjMj5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHRvVmVjMyAoejogbnVtYmVyKTogVmVjM1xyXG4gICAgdG9WZWM0ICh6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlYzRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWMzIGV4dGVuZHMgVmVjPFZlYzM+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuXHJcbiAgICB0b1ZlYzIgKCk6IFZlYzJcclxuICAgIHRvVmVjNCAodzogbnVtYmVyKTogVmVjNFxyXG4gICAgY3Jvc3MgKG90aGVyOiBWZWMzKTogVmVjM1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzQgZXh0ZW5kcyBWZWM8VmVjND5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcblxyXG4gICAgdG9WZWMyICgpOiBWZWMyXHJcbiAgICB0b1ZlYzMgKCk6IFZlYzNcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL1ZlY3RvcnMudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTmV3TWF0NCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcbmltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4uL0NvbW1vbi9BcnJheUV4dFwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlNYXQgaW1wbGVtZW50cyBOZXdNYXQ8TWF0Mj4sIE5ld01hdDxNYXQzPiwgTmV3TWF0NFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByb3dzOiBudW1iZXIsIHJlYWRvbmx5IGNvbHM6IG51bWJlcikgeyB9XHJcblxyXG4gICAgcHJpdmF0ZSBpZGVudGl0eUFycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+IChyICogYyksIDApXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbiAociwgYyk7IGkrKykgXHJcbiAgICAgICAgICAgIGFycltpICogciArIGldID0gMVxyXG4gICAgICAgIHJldHVybiBhcnJcclxuICAgIH1cclxuXHJcbiAgICBnZXQgemVybyAoKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoQXJyYXlIZWxwZXIuZmlsbCAoQXJyYXk8bnVtYmVyPihyICogYyksIDApLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpZGVudGl0eSAoKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5pZGVudGl0eUFycmF5ICgpLCB0aGlzLnJvd3MsIHRoaXMuY29scylcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGlvbiAob2Zmc2V0czogbnVtYmVyW10pOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IGxhc3RDb2wgPSBjIC0gMVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKG9mZnNldHMubGVuZ3RoLCByIC0gMSk7IGkrKylcclxuICAgICAgICAgICAgcmVzIFtsYXN0Q29sICogciArIGldID0gb2Zmc2V0c1tpXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBzY2FsaW5nIChmYWN0b3JzOiBudW1iZXJbXSk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChmYWN0b3JzLmxlbmd0aCwgciwgYyk7IGkrKylcclxuICAgICAgICAgICAgcmVzIFtpICogciArIGldID0gZmFjdG9yc1tpXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblggKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBpZiAociA8IDMgfHwgYyA8IDMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBSb3RhdGlvbiBhcm91bmQgWC1heGlzIG5vdCBkZWZpbmVkIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1tyICsgMV0gPSBjb3NhXHJcbiAgICAgICAgcmVzW3IgKyAyXSA9IHNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAxXSA9IC1zaW5hXHJcbiAgICAgICAgcmVzWzIgKiByICsgMl0gPSBjb3NhXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWSAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBZLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzWzBdID0gY29zYTtcclxuICAgICAgICByZXNbMl0gPSAtc2luYTtcclxuICAgICAgICByZXNbMiAqIHJdID0gc2luYTtcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2E7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWiAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1sxXSA9IHNpbmE7XHJcbiAgICAgICAgcmVzW3JdID0gLXNpbmE7XHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2E7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHBlcnNwZWN0aXZlIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHpOZWFyIDw9IDAgfHwgek5lYXIgPj0gekZhcilcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJ6TmVhciBuZWVkcyB0byBiZSBwb3NpdGl2ZSBhbmQgc21hbGxlciB0aGF0biB6RmFyXCIpXHJcbiAgICAgICAgbGV0IHdpZHRoID0gcmlnaHQgLSBsZWZ0XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRvcCAtIGJvdHRvbVxyXG4gICAgICAgIGxldCBkZXB0aCA9IHpGYXIgLSB6TmVhclxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbKDIuMCAqIHpOZWFyKSAvIHdpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAoMi4wICogek5lYXIpIC8gaGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAocmlnaHQgKyBsZWZ0KSAvIHdpZHRoLCAodG9wICsgYm90dG9tKSAvIGhlaWdodCwgLSh6RmFyICsgek5lYXIpIC8gZGVwdGgsIC0xLFxyXG4gICAgICAgICAgICAwLCAwLCAtKDIuMCAqIHpGYXIgKiB6TmVhcikgLyBkZXB0aCwgMF0sIFxyXG4gICAgICAgICAgICA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIG9ydGhvZ3JhcGhpYyAobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsXHJcbiAgICAgICAgek5lYXI6IG51bWJlciwgekZhcjogbnVtYmVyKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCBpbnZXaWR0aCA9IDEuMCAvIChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgbGV0IGludkhlaWdodCA9IDEuMCAvICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgbGV0IGludkRlcHRoID0gMS4wIC8gKHpGYXIgLSB6TmVhcilcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgWzIgKiBpbnZXaWR0aCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMiAqIGludkhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgLTIgKiBpbnZEZXB0aCwgMCxcclxuICAgICAgICAgICAgLShyaWdodCArIGxlZnQpICogaW52V2lkdGgsIC0odG9wICsgYm90dG9tKSAqIGludkhlaWdodCwgLSh6RmFyICsgek5lYXIpICogaW52RGVwdGgsIDFdLFxyXG4gICAgICAgICAgICA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIGxvb2tBdCAoZGlyZWN0aW9uOiBWZWMzLCB1cDogVmVjMyk6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgemF4aXMgPSBkaXJlY3Rpb24uaW52ICgpLm5vcm0gKClcclxuICAgICAgICBsZXQgeGF4aXMgPSB1cC5jcm9zcyAoemF4aXMpLm5vcm0gKClcclxuICAgICAgICBsZXQgeWF4aXMgPSB6YXhpcy5jcm9zcyAoeGF4aXMpXHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbeGF4aXMueCwgeWF4aXMueCwgemF4aXMueCwgMCxcclxuICAgICAgICAgICAgeGF4aXMueSwgeWF4aXMueSwgemF4aXMueSwgMCxcclxuICAgICAgICAgICAgeGF4aXMueiwgeWF4aXMueiwgemF4aXMueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMV0sIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10sIHJvd3M6IG51bWJlciwgY29sczogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKGFycmF5LCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbmV3TWF0MjogTmV3TWF0PE1hdDI+ID0gbmV3IE5ld0FycmF5TWF0ICgyLCAyKVxyXG5leHBvcnQgY29uc3QgbmV3TWF0MzogTmV3TWF0PE1hdDM+ID0gbmV3IE5ld0FycmF5TWF0ICgzLCAzKVxyXG5leHBvcnQgY29uc3QgbmV3TWF0NDogTmV3TWF0NCA9IG5ldyBOZXdBcnJheU1hdCAoNCwgNClcclxuXHJcbmNsYXNzIEFycmF5TWF0IGltcGxlbWVudHMgTWF0MiwgTWF0MywgTWF0NFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgYXJyYXk6IG51bWJlcltdLCByZWFkb25seSByb3dzOiBudW1iZXIsIHJlYWRvbmx5IGNvbHM6IG51bWJlcikgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCAhPT0gcm93cyAqY29scylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJBcnJheSBsZW5ndGggaGFzIHRvIGJlIGVxdWFsIHRvIHJvd3MgKiBjb2x1bW5zLlwiKSBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAodmVjOiBWKTogVlxyXG4gICAge1xyXG4gICAgICAgIGxldCBhcnIgPSBbLi4udmVjLnRvQXJyYXkgKCksIDEsIDFdLnNsaWNlICgwLCB0aGlzLmNvbHMpXHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKGFyciwgdGhpcy5jb2xzLCAxKVxyXG4gICAgICAgIHJldHVybiB2ZWMubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9NYXQyICgpOiBNYXQyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpLCAgXHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICh0aGlzLnJvd3MsIHRoaXMucm93cyArIDIpICBcclxuICAgICAgICAgICAgXSwgMiwgMilcclxuICAgIH1cclxuXHJcbiAgICB0b01hdDMgKCk6IE1hdDNcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucm93cykgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpLCAwLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMiwgNCksIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSAgXHJcbiAgICAgICAgICAgICAgICBdLCAzLCAzKVxyXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDMpLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoNCwgNyksICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICg4LCAxMSkgIFxyXG4gICAgICAgICAgICAgICAgXSwgMywgMylcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgY29udmVyc2lvbi5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9NYXQ0ICgpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnJvd3MpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAyKSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgyLCA0KSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgICBcclxuICAgICAgICAgICAgICAgIF0sIDQsIDQpXHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMyksIDAsICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgzLCA3KSwgMCwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDcsIDEwKSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxICAgXHJcbiAgICAgICAgICAgICAgICBdLCA0LCA0KVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL0FycmF5TWF0LnRzIiwiZXhwb3J0IHR5cGUgU2hhZGVyVHlwZSA9ICd2ZXJ0ZXgnIHwgJ2ZyYWdtZW50J1xyXG5cclxuZXhwb3J0IGNsYXNzIFNoYWRlclxyXG57XHJcbiAgICByZWFkb25seSBnbFNoYWRlcjogV2ViR0xTaGFkZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCByZWFkb25seSB0eXBlOiBTaGFkZXJUeXBlLCBzb3VyY2U6IHN0cmluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsID0gZ2xcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICAgICAgbGV0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsU2hhZGVyVHlwZSk7XHJcbiAgICAgICAgaWYgKHNoYWRlciA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBGYWlsZWQgdG8gY3JlYXRlICR7dHlwZX0gc2hhZGVyLmApXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGVycm9yID0gJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJyArIGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKVxyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2xTaGFkZXIgPSBzaGFkZXJcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2xTaGFkZXJUeXBlICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAndmVydGV4JyA/IFxyXG4gICAgICAgICAgICB0aGlzLmdsLlZFUlRFWF9TSEFERVIgOiBcclxuICAgICAgICAgICAgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVJcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9TaGFkZXIudHMiLCJpbXBvcnQgeyBHTFJlc291cmNlLCB1c2luZyB9IGZyb20gXCIuL0dMUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4QXR0clR5cGUsIFZlcnRleERlZiB9IGZyb20gXCIuL1ZlcnRleEF0dHJcIlxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJ1ZmZlciBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHJlYWRvbmx5IHRhcmdldDogbnVtYmVyLFxyXG4gICAgICAgIHJlYWRvbmx5IGdsQnVmZmVyOiBXZWJHTEJ1ZmZlciwgcmVhZG9ubHkgbGVuZ3RoOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIgKGdsKVxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIHRoaXMuZ2xCdWZmZXIpXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIG51bGwpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhCdWZmZXI8Vj4gZXh0ZW5kcyBCdWZmZXIgXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSlcclxuICAgIHtcclxuICAgICAgICBsZXQgYnVmID0gZ2wuY3JlYXRlQnVmZmVyICgpXHJcbiAgICAgICAgaWYgKGJ1ZiA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdGYWlsZWQgdG8gY3JlYXRlIHZlcnRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkFSUkFZX0JVRkZFUiwgYnVmLCB2ZXJ0aWNlcy5sZW5ndGgpXHJcbiAgICAgICAgdXNpbmcgKHRoaXMsICgpID0+IFxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhIChnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdEJ1ZmZlciAodmVydGV4RGVmLCB2ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRCdWZmZXIgKHZlcnRleERlZjogVmVydGV4RGVmPFY+LCB2ZXJ0aWNlczogVltdKTogQXJyYXlCdWZmZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgdmVydGV4U2l6ZSA9IHZlcnRleERlZi5zdHJpZGVcclxuICAgICAgICBsZXQgbGVuID0gdmVydGljZXMubGVuZ3RoXHJcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlciAodmVydGV4U2l6ZSAqIGxlbilcclxuICAgICAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyAoYnVmZmVyKVxyXG4gICAgICAgIHZlcnRleERlZi52ZXJ0ZXhBdHRycy5mb3JFYWNoIChhdHRyID0+IFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIHZhciBzZXR0ZXIgPSB0aGlzLnZlcnRleEF0dHJTZXR0ZXIgKHZpZXcsIGF0dHIudHlwZSlcclxuICAgICAgICAgICAgbGV0IHR5cGVTaXplID0gYXR0ci50eXBlU2l6ZVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXR0ci5nZXR0ZXIgKHZlcnRpY2VzW2pdKVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhdHRyLm51bUNvbXBvbmVudHM7IGsrKylcclxuICAgICAgICAgICAgICAgICAgICBzZXR0ZXIgKChqICogdmVydGV4U2l6ZSkgKyBhdHRyLm9mZnNldCArIChrICogdHlwZVNpemUpLCB2YWx1ZXNba10pIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYnVmZmVyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3OiBEYXRhVmlldywgdHlwZTogVmVydGV4QXR0clR5cGUpOiBcclxuICAgICAgICAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IHZvaWRcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRVaW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRJbnQxNiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDE2IChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEZsb2F0MzIgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4QnVmZmVyIGV4dGVuZHMgQnVmZmVyXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBpbmRpY2VzOiBudW1iZXJbXSlcclxuICAgIHtcclxuICAgICAgICBsZXQgYnVmID0gZ2wuY3JlYXRlQnVmZmVyICgpXHJcbiAgICAgICAgaWYgKGJ1ZiA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdGYWlsZWQgdG8gY3JlYXRlIGluZGV4IGJ1ZmZlci4nKVxyXG4gICAgICAgIHN1cGVyIChnbCwgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZiwgaW5kaWNlcy5sZW5ndGgpXHJcbiAgICAgICAgdXNpbmcgKHRoaXMsICgpID0+IFxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhIChnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5IChpbmRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML0J1ZmZlcnMudHMiLCJpbXBvcnQgeyBTaGFkZXJUeXBlLCBTaGFkZXIgfSBmcm9tIFwiLi9TaGFkZXJcIlxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXG5pbXBvcnQgeyBVbmlmb3JtLCBVbmlmb3JtRGVmIH0gZnJvbSBcIi4vVW5pZm9ybXNcIlxuaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm9ncmFtPFYsIFU+IGV4dGVuZHMgR0xSZXNvdXJjZVxue1xuICAgIHJlYWRvbmx5IGdsUHJvZ3JhbTogV2ViR0xQcm9ncmFtXG4gICAgcmVhZG9ubHkgc2hhZGVyczogU2hhZGVyW11cbiAgICByZWFkb25seSB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPlxuICAgIHJlYWRvbmx5IHVuaWZvcm1EZWY6IFVuaWZvcm1EZWY8VT5cblxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBcbiAgICAgICAgc2hhZGVyczogU2hhZGVyW10sIFxuICAgICAgICB2ZXJ0ZXhBdHRyczogVmVydGV4QXR0cjxWPltdLFxuICAgICAgICB1bmlmb3JtczogVW5pZm9ybTxVPltdKSBcbiAgICB7XG4gICAgICAgIHN1cGVyIChnbClcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gc2hhZGVyc1xuICAgICAgICB0aGlzLmdsUHJvZ3JhbSA9IHRoaXMubGluayAoKVxuICAgICAgICB0aGlzLnZlcnRleERlZiA9IG5ldyBWZXJ0ZXhEZWYgKHZlcnRleEF0dHJzKVxuICAgICAgICB0aGlzLnZlcnRleERlZi5pbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYgPSBuZXcgVW5pZm9ybURlZiAodW5pZm9ybXMpXG4gICAgICAgIHRoaXMudW5pZm9ybURlZi5pbml0VW5pZm9ybUxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxuICAgIH1cblxuICAgIHByaXZhdGUgbGluayAoKTogV2ViR0xQcm9ncmFtXG4gICAge1xuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsXG4gICAgICAgIGxldCBwcmcgPSBnbC5jcmVhdGVQcm9ncmFtKClcbiAgICAgICAgaWYgKHByZyA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IEVycm9yIChcIkZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbVwiKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhZGVycy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcmcsIHRoaXMuc2hhZGVyc1tpXS5nbFNoYWRlcik7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByZyk7XG4gICAgICBcbiAgICAgICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByZywgZ2wuTElOS19TVEFUVVMpKSBcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnVW5hYmxlIHRvIGluaXRpYWxpemUgdGhlIHNoYWRlciBwcm9ncmFtOiAnICsgXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJnKSlcbiAgICAgICAgcmV0dXJuIHByZ1xuICAgIH1cblxuICAgIHByaXZhdGUgZW5hYmxlVmVydGV4QXR0ckFycmF5cyAoKVxuICAgIHtcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxuICAgICAgICB0aGlzLnZlcnRleERlZi52ZXJ0ZXhBdHRycy5mb3JFYWNoIChhdHRyID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXG4gICAgICAgICAgICAgICAgYXR0ci5sb2NhdGlvbixcbiAgICAgICAgICAgICAgICBhdHRyLm51bUNvbXBvbmVudHMsXG4gICAgICAgICAgICAgICAgYXR0ci5nbFR5cGUgKGdsKSxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERlZi5zdHJpZGUsXG4gICAgICAgICAgICAgICAgYXR0ci5vZmZzZXQpO1xuICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0ci5sb2NhdGlvbik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdXNlICgpXG4gICAge1xuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0gKHRoaXMuZ2xQcm9ncmFtKVxuICAgIH1cblxuICAgIHJlbGVhc2UgKClcbiAgICB7XG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAobnVsbClcbiAgICB9XG5cbiAgICBkcmF3RWxlbWVudHMgKG1vZGU6IG51bWJlciwgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFY+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IFUpXG4gICAge1xuICAgICAgICB1c2luZyAoW3RoaXMsIHZidWZmZXIsIGlidWZmZXJdLCBnbCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1EZWYuc2V0VmFsdWVzIChnbCwgdW5pZm9ybXMpXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVZlcnRleEF0dHJBcnJheXMgKClcbiAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyAobW9kZSwgaWJ1ZmZlci5sZW5ndGgsIGdsLlVOU0lHTkVEX1NIT1JULCAwKVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvUHJvZ3JhbS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCIgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcclxcbiB2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuIFxcclxcbiB1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXHJcXG4gdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcclxcblxcclxcbnZvaWQgbWFpbigpIHtcXHJcXG4gICAgdmVjNCBwb3MgPSB2ZWM0IChhVmVydGV4UG9zaXRpb24sIDAsIDEpO1xcclxcbiAgICBwb3NpdGlvbiA9IG1heChwb3MueHl6LCB2ZWMzKDApKTtcXHJcXG4gICAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVNb2RlbFZpZXdNYXRyaXggKiBwb3M7XFxyXFxuIH1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLnZlcnRcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuXFxyXFxudm9pZCBtYWluKCkgeyBcXHJcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChwb3NpdGlvbiwgMS4wKTtcXHJcXG59XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9