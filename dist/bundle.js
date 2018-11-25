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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjg2NTA2MzMwNWZkZDkwYjUxNjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7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QyxDQUFDLEVBQ3ZDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsWUFBWSxDQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUFFLEdBQVcsRUFDbEUsS0FBYSxFQUFFLElBQVk7UUFFM0IsSUFBSSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLFNBQVMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ3BDLElBQUksUUFBUSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbkMsT0FBTyxJQUFJLFFBQVEsQ0FDZixDQUFDLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQ3ZGLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTSxDQUFFLFNBQWUsRUFBRSxFQUFRO1FBRTdCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUcsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBRSxLQUFLLENBQUM7UUFFL0IsT0FBTyxJQUFJLFFBQVEsQ0FDZixDQUFDLEtBQUssQ0FBQyxDQUFD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QUMsYUFBYSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUFFLEVBQUUsQ0FBQyxFQUNoQixLQUFLLEVBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxHQUFHO1FBRUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsT0FBTztRQUVILElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFFLElBQVksRUFBRSxPQUF3QixFQUFFLE9BQW9CLEVBQUUsUUFBVztRQUVuRixrQkFBSyxDQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUVsQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxzQkFBc0IsRUFBRztZQUM5QixFQUFFLENBQUMsWUFBWSxDQUFFLElBQUksRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXhFRCwwQkF3RUM7Ozs7Ozs7QUM5RUQsa0RBQWtELGlDQUFpQyx3Q0FBd0Msb0NBQW9DLHFCQUFxQixnREFBZ0QseUNBQXlDLGlFQUFpRSxNQUFNLEs7Ozs7OztBQ0FwViw4Q0FBOEMscUJBQXFCLDRDQUE0QyxLQUFLLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjg2NTA2MzMwNWZkZDkwYjUxNjEiLCJleHBvcnQgY29uc3QgdHdvUEkgPSBNYXRoLlBJICogMlxyXG5leHBvcnQgY29uc3QgUElvdmVyMiA9IE1hdGguUEkgLyAyXHJcbmV4cG9ydCBjb25zdCBQSW92ZXI0ID0gTWF0aC5QSSAvIDRcclxuZXhwb3J0IGNvbnN0IFBJb3ZlcjggPSBNYXRoLlBJIC8gOFxyXG5leHBvcnQgY29uc3QgUElvdmVyMTYgPSBNYXRoLlBJIC8gMTZcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHByb3hFcXVhbHMgKHg6IG51bWJlciwgeTogbnVtYmVyLCBcclxuICAgIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKSA6IGJvb2xlYW5cclxue1xyXG4gICAgaWYgKHggPT09IHkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgbGV0IGFic1ggPSBNYXRoLmFicyAoeCk7XHJcbiAgICBsZXQgYWJzWSA9IE1hdGguYWJzICh5KTtcclxuICAgIGxldCBkaWZmID0gTWF0aC5hYnMgKHggLSB5KTtcclxuXHJcbiAgICBpZiAoeCAqIHkgPT0gMClcclxuICAgICAgICByZXR1cm4gZGlmZiA8IChlcHNpbG9uICogZXBzaWxvbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgLyAoYWJzWCArIGFic1kpIDwgZXBzaWxvbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyYWN0ICh4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggLSBNYXRoLmZsb29yICh4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wICh4OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4geCA8IG1pbiA/IG1pbiA6XHJcbiAgICAgICAgICAgeCA+IG1heCA/IG1heCA6XHJcbiAgICAgICAgICAgeDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1peCAoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGludGVyUG9zOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHN0YXJ0ICsgKGludGVyUG9zICogKGVuZCAtIHN0YXJ0KSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGVwIChlZGdlOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlIDwgZWRnZSA/IDAgOiAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIGxldCB0ID0gY2xhbXAgKCh2YWx1ZSAtIGVkZ2VMb3dlcikgLyAoZWRnZVVwcGVyIC0gZWRnZUxvd2VyKSwgMCwgMSk7XHJcbiAgICByZXR1cm4gdCAqIHQgKiAoMyAtICgyICogdCkpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvRk1hdGgudHMiLCJpbXBvcnQgeyBFcXVhdGFibGUgfSBmcm9tIFwiLi9FcXVhdGFibGVcIjtcbmltcG9ydCB7IGFwcHJveEVxdWFscyB9IGZyb20gXCIuLi9NYXRoL0ZNYXRoXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUPiAoYXJyYXk6IFRbXVtdKTogVFtdW11cbntcbiAgICBsZXQgcm93cyA9IGFycmF5Lmxlbmd0aFxuICAgIGxldCByZXMgPSBBcnJheTxUW10+KHJvd3MpXG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXG4gICAgICAgIHJlc1tyXSA9IGFycmF5W3JdLnNsaWNlICgpXG4gICAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsbDxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpOiBUW11cbntcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICBhcnJheVtpXSA9IHZhbHVlXG4gICAgcmV0dXJuIGFycmF5XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQ8VD4gKHZhbHVlOiBULCBjb3VudDogbnVtYmVyKTogVFtdXG57XG4gICAgdmFyIHJlcyA9IEFycmF5PFQ+IChjb3VudClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspXG4gICAgICAgIHJlc1tpXSA9IHZhbHVlXG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1heEl0ZW1zPFQ+IChhcnJheTogVFtdLCBzZWxlY3RvcjogKMOtdGVtOiBUKSA9PiBudW1iZXIpOiBUW11cbntcbiAgICBsZXQgcmVzOiBUW10gPSBbXVxuICAgIGxldCBtYXggPSBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgZm9yIChsZXQgaXRlbSBvZiBhcnJheSlcbiAgICB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNlbGVjdG9yIChpdGVtKTtcbiAgICAgICAgaWYgKHZhbHVlID4gbWF4KVxuICAgICAgICB7XG4gICAgICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgICAgIHJlcyA9IFsgaXRlbSBdXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXBwcm94RXF1YWxzICh2YWx1ZSwgbWF4KSlcbiAgICAgICAgICAgIHJlcy5wdXNoIChpdGVtKVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3VtIChhcnJheTogbnVtYmVyW10pOiBudW1iZXJcbntcbiAgICBsZXQgcmVzID0gMFxuICAgIGZvciAodmFyIGl0ZW0gb2YgYXJyYXkpXG4gICAgICAgIHJlcyArPSBpdGVtXG4gICAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3Q8VCBleHRlbmRzIEVxdWF0YWJsZTxUPj4gKGFycmF5OiBUW10pXG57XG4gICAgbGV0IGZpcnN0T2NjdXJlbmNlID0gKGl0ZW06IFQsIGluZGV4OiBudW1iZXIpID0+IGFycmF5LmZpbmRJbmRleCAoaSA9PiBpLmVxdWFscyAoaXRlbSkpID09PSBpbmRleFxuICAgIHJldHVybiBhcnJheS5maWx0ZXIgKGZpcnN0T2NjdXJlbmNlKSAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXRNYXA8VCwgVT4gKGFycmF5OiBUW10sIHNlbGVjdG9yOiAoaXRlbTogVCkgPT4gVVtdKTogVVtdXG57XG4gICAgcmV0dXJuIG5ldyBBcnJheTxVPiAoKS5jb25jYXQgKC4uLmFycmF5Lm1hcCAoc2VsZWN0b3IpKVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db21tb24vQXJyYXlFeHQudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi4vTWF0aC9WZWN0b3JzXCI7XHJcblxyXG5leHBvcnQgdHlwZSBWZXJ0ZXhBdHRyVHlwZSA9ICdieXRlJyB8ICdzaG9ydCcgfCAndWJ5dGUnIHwgJ3VzaG9ydCcgfCAnZmxvYXQnXHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICBsb2NhdGlvbjogbnVtYmVyXHJcbiAgICBvZmZzZXQ6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IFZlcnRleEF0dHJUeXBlLFxyXG4gICAgICAgIHJlYWRvbmx5IG51bUNvbXBvbmVudHM6IG51bWJlciwgcmVhZG9ubHkgZ2V0dGVyOiAoVikgPT4gbnVtYmVyW10pIHsgfVxyXG5cclxuICAgIGdldCB0eXBlU2l6ZSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IFxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDFcclxuICAgICAgICAgICAgY2FzZSAnc2hvcnQnOlxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiBcclxuICAgICAgICAgICAgICAgIHJldHVybiAyXHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzpcclxuICAgICAgICAgICAgICAgIHJldHVybiA0XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBhdHRyaWJ1dGUgdHlwZS5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNpemVJbkJ5dGVzICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsICh0aGlzLnR5cGVTaXplICogdGhpcy5udW1Db21wb25lbnRzIC8gNCkgKiA0XHJcbiAgICB9XHJcblxyXG4gICAgZ2xUeXBlIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IHJldHVybiBnbC5CWVRFXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEVcclxuICAgICAgICAgICAgY2FzZSAnc2hvcnQnOiByZXR1cm4gZ2wuU0hPUlRcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogcmV0dXJuIGdsLlVOU0lHTkVEX1NIT1JUXHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzogcmV0dXJuIGdsLkZMT0FUXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGF0dHJpYnV0ZSB0eXBlLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleERlZjxWPlxyXG57XHJcbiAgICByZWFkb25seSBzdHJpZGU6IG51bWJlclxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLnN0cmlkZSA9IHRoaXMuaW5pdFZlcnRleEF0dHJPZmZzZXRzICgpXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFZlcnRleEF0dHJPZmZzZXRzICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMFxyXG4gICAgICAgIHRoaXMudmVydGV4QXR0cnMuZm9yRWFjaCAodiA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdi5vZmZzZXQgPSBvZmZzZXRcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHYuc2l6ZUluQnl0ZXMgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gb2Zmc2V0XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFZlcnRleEF0dHJMb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKTogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudmVydGV4QXR0cnMuZm9yRWFjaCh2ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24gKHByZywgdi5uYW1lKVxyXG4gICAgICAgICAgICBpZiAobG9jIDwgMClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVmVydGV4IGF0dHJpYnV0ZSAnJHt2Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB2LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ5dGU8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2J5dGUnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdWJ5dGU8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VieXRlJywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0PFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdzaG9ydCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1c2hvcnQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VzaG9ydCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMjxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAyLCB2ID0+ICg8VmVjMj52W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMzxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAzLCB2ID0+ICg8VmVjMz52W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCA0LCB2ID0+ICg8VmVjND52W25hbWVdKS50b0FycmF5ICgpIClcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9WZXJ0ZXhBdHRyLnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yc1wiO1xyXG5pbXBvcnQgeyBNYXQsIE1hdDIsIE1hdDMsIE1hdDQgfSBmcm9tIFwiLi4vTWF0aC9NYXRyaWNlc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVW5pZm9ybVR5cGUgPSAnaW50JyB8ICdmbG9hdCcgfCAnbWF0cml4J1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWZvcm08VT5cclxue1xyXG4gICAgbG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcmVhZG9ubHkgdHlwZTogVW5pZm9ybVR5cGUsIFxyXG4gICAgICAgIHJlYWRvbmx5IG51bUNvbXBvbmVudHM6IG51bWJlciwgcmVhZG9ubHkgZ2V0dGVyOiAoVSkgPT4gbnVtYmVyW10pIFxyXG4gICAge1xyXG4gICAgICAgIGxldCBsb3dDb21wID0gdHlwZSA9PT0gJ21hdHJpeCcgPyAyIDogMVxyXG4gICAgICAgIGlmIChudW1Db21wb25lbnRzIDwgbG93Q29tcCB8fCBudW1Db21wb25lbnRzID4gNClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYE51bWJlciBvZiBjb21wb25lbnRzIG11c3QgYmUgWyR7bG93Q29tcH0uLjRdIGZvciAke3R5cGV9LmApXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB2YWwgPSB0aGlzLmdldHRlciAodW5pZm9ybXMpXHJcbiAgICAgICAgaWYgKHZhbC5sZW5ndGggPCB0aGlzLm51bUNvbXBvbmVudHMgfHwgdmFsLmxlbmd0aCAlIHRoaXMubnVtQ29tcG9uZW50cyAhPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdJbnZhbGlkIG51bWJlciBvZiB1bmlmb3JtIGVsZW1lbnRzLicpXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm51bUNvbXBvbmVudHMpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTFpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0yaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMmZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDJmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0zaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2Z2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00aXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtRGVmPFU+XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSB1bmlmb3JtczogVW5pZm9ybTxVPltdKSB7IH1cclxuXHJcbiAgICBpbml0VW5pZm9ybUxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51bmlmb3Jtcy5mb3JFYWNoKHUgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24gKHByZywgdS5uYW1lKVxyXG4gICAgICAgICAgICBpZiAobG9jID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBVbmlmb3JtICcke3UubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHUubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlcyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51bmlmb3Jtcy5mb3JFYWNoICh1bmlmID0+IHVuaWYuc2V0VmFsdWUgKGdsLCB1bmlmb3JtcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW50PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdpbnQnLCAxLCB1ID0+IFsgdVtuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmxvYXQ8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMiwgdSA9PiAoPFZlYzI+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzM8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMywgdSA9PiAoPFZlYzM+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzQ8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgNCwgdSA9PiAoPFZlYzQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDI8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDIsIHUgPT4gKDxNYXQyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQzPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAzLCB1ID0+ICg8TWF0Mz51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0NDxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgNCwgdSA9PiAoPE1hdDQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9Vbmlmb3Jtcy50cyIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7IH1cclxuICAgIGFic3RyYWN0IHVzZSAoKVxyXG4gICAgYWJzdHJhY3QgcmVsZWFzZSAoKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNpbmcgKHJlc291cmNlOiBHTFJlc291cmNlIHwgR0xSZXNvdXJjZVtdLCBcclxuICAgIGFjdGlvbjogKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpID0+IHZvaWQpXHJcbntcclxuICAgIGxldCByZXMgPSByZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ID8gXHJcbiAgICAgICAgcmVzb3VyY2UucG9wICgpIDogXHJcbiAgICAgICAgcmVzb3VyY2VcclxuICAgIGlmICghcmVzKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgcmVzLnVzZSAoKVxyXG4gICAgdHJ5XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXkgJiYgcmVzb3VyY2UubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdXNpbmcgKHJlc291cmNlLCBhY3Rpb24pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhY3Rpb24gKHJlcy5nbClcclxuICAgIH1cclxuICAgIGZpbmFsbHlcclxuICAgIHtcclxuICAgICAgICByZXMucmVsZWFzZSAoKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJpbXBvcnQgeyBOZXdWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaWNlc1wiO1xyXG5pbXBvcnQgeyBuZXdWZWMyLCBuZXdWZWM0IH0gZnJvbSBcIi4vTWF0aC9BcnJheVZlY1wiXHJcbmltcG9ydCB7IG5ld01hdDQgfSBmcm9tIFwiLi9NYXRoL0FycmF5TWF0XCJcclxuaW1wb3J0IHsgUElvdmVyOCB9IGZyb20gXCIuL01hdGgvRk1hdGhcIlxyXG5pbXBvcnQgeyBTaGFkZXJUeXBlLCBTaGFkZXIgfSBmcm9tIFwiLi9HTC9TaGFkZXJcIlxyXG5pbXBvcnQgKiBhcyBWQXR0ciBmcm9tIFwiLi9HTC9WZXJ0ZXhBdHRyXCJcclxuaW1wb3J0ICogYXMgVW5pZiBmcm9tIFwiLi9HTC9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9HTC9CdWZmZXJzXCI7XHJcbmltcG9ydCB7IFByb2dyYW0gfSBmcm9tIFwiLi9HTC9Qcm9ncmFtXCJcclxuXHJcbi8vIFZlcnRleCBzaGFkZXIgcHJvZ3JhbVxyXG5jb25zdCB2c1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUudmVydCcpXHJcbmNvbnN0IGZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS5mcmFnJylcclxuXHJcbmNsYXNzIFNpbXBsZVZlcnRleCBcclxue1xyXG4gICAgYVZlcnRleFBvc2l0aW9uOiBWZWMyIFxyXG59XHJcblxyXG5jbGFzcyBNeVVuaWZvcm1zXHJcbntcclxuICAgIHVNb2RlbFZpZXdNYXRyaXg6IE1hdDRcclxuICAgIHVQcm9qZWN0aW9uTWF0cml4OiBNYXQ0IFxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3U2NlbmUoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbTogUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+LCBcclxuICAgIHZidWZmZXI6IFZlcnRleEJ1ZmZlcjxTaW1wbGVWZXJ0ZXg+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IE15VW5pZm9ybXMpIFxyXG57XHJcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7ICAvLyBDbGVhciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbiAgICBnbC5jbGVhckRlcHRoKDEuMCk7ICAgICAgICAgICAgICAgICAvLyBDbGVhciBldmVyeXRoaW5nXHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7ICAgICAgICAgICAvLyBFbmFibGUgZGVwdGggdGVzdGluZ1xyXG4gICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7ICAgICAgICAgICAgLy8gTmVhciB0aGluZ3Mgb2JzY3VyZSBmYXIgdGhpbmdzXHJcbiAgXHJcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG4gIFxyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG5cclxuICAgIHByb2dyYW0uZHJhd0VsZW1lbnRzIChnbC5UUklBTkdMRV9TVFJJUCwgdmJ1ZmZlciwgaWJ1ZmZlciwgdW5pZm9ybXMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4gKClcclxue1xyXG4gICAgbGV0IHZlcnRpY2VzOiBTaW1wbGVWZXJ0ZXhbXSA9IFtcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIC0xKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAtMSkgfVxyXG4gICAgXVxyXG4gICAgbGV0IGluZGljZXMgPSBbIDAsIDEsIDIsIDMgXVxyXG4gICAgbGV0IHVuaWZvcm1zOiBNeVVuaWZvcm1zID0ge1xyXG4gICAgICAgIHVNb2RlbFZpZXdNYXRyaXg6IG5ld01hdDQudHJhbnNsYXRpb24gKFswLjAsIDAuMCwgLTQuMF0pLm11bChuZXdNYXQ0LnJvdGF0aW9uWCAoUElvdmVyOCkpLFxyXG4gICAgICAgIHVQcm9qZWN0aW9uTWF0cml4OiBuZXdNYXQ0LnBlcnNwZWN0aXZlICgtMSwgMSwgLTEsIDEsIDEsIDEwMClcclxuICAgIH1cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG4gICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHZlcnRTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ3ZlcnRleCcsIHZzU291cmNlKVxyXG4gICAgbGV0IGZyYWdTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ2ZyYWdtZW50JywgZnNTb3VyY2UpXHJcblxyXG4gICAgbGV0IHByb2dyYW0gPSBuZXcgUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+IChnbCxcclxuICAgICAgICBbIHZlcnRTaGFkZXIsIGZyYWdTaGFkZXIgXSxcclxuICAgICAgICBbIFZBdHRyLnZlYzIgKCdhVmVydGV4UG9zaXRpb24nKSBdLFxyXG4gICAgICAgIFsgVW5pZi5tYXQ0ICgndU1vZGVsVmlld01hdHJpeCcpLCBVbmlmLm1hdDQgKCd1UHJvamVjdGlvbk1hdHJpeCcpIF0pXHJcblxyXG4gICAgbGV0IHZidWZmZXIgPSBuZXcgVmVydGV4QnVmZmVyIChnbCwgcHJvZ3JhbS52ZXJ0ZXhEZWYsIHZlcnRpY2VzKVxyXG4gICAgbGV0IGlidWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIgKGdsLCBpbmRpY2VzKVxyXG5cclxuICAgIGRyYXdTY2VuZSAoZ2wsIHByb2dyYW0sIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5tYWluICgpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Rlc3QudHMiLCJpbXBvcnQgKiBhcyBGTWF0aCBmcm9tIFwiLi9GTWF0aFwiXHJcbmltcG9ydCB7IERpbSwgVmVjLCBWZWMyLCBWZWMzLCBWZWM0LCBOZXdWZWMgfSBmcm9tIFwiLi9WZWN0b3JzXCJcclxuaW1wb3J0ICogYXMgQXJyYXlFeHQgZnJvbSBcIi4uL0NvbW1vbi9BcnJheUV4dFwiXHJcblxyXG5jbGFzcyBOZXdBcnJheVZlYyBpbXBsZW1lbnRzIE5ld1ZlYzxWZWMyPiwgTmV3VmVjPFZlYzM+LCBOZXdWZWM8VmVjND5cclxue1xyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlcikgeyB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5RXh0LmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIDApKVxyXG4gICAgfVxyXG5cclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5RXh0LmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPSB0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBFeHBlY3RlZCAke3RoaXMuZGltZW5zaW9uc30gY29tcG9uZW50cy5gKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHZhbHVlcylcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggPCB0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBFeHBlY3RlZCAke3RoaXMuZGltZW5zaW9uc30gY29tcG9uZW50cy5gKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKGFycmF5LnNsaWNlICgwLCB0aGlzLmRpbWVuc2lvbnMpKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbmV3VmVjMjogTmV3VmVjPFZlYzI+ID0gbmV3IE5ld0FycmF5VmVjICgyKVxyXG5leHBvcnQgY29uc3QgbmV3VmVjMzogTmV3VmVjPFZlYzM+ID0gbmV3IE5ld0FycmF5VmVjICgzKVxyXG5leHBvcnQgY29uc3QgbmV3VmVjNDogTmV3VmVjPFZlYzQ+ID0gbmV3IE5ld0FycmF5VmVjICg0KVxyXG5cclxuY2xhc3MgQXJyYXlWZWMgaW1wbGVtZW50cyBWZWMyLCBWZWMzLCBWZWM0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGFycmF5OiBudW1iZXJbXSkgeyB9XHJcblxyXG4gICAgZ2V0IGRpbWVuc2lvbnMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aFxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5W2luZGV4XVxyXG4gICAgfVxyXG5cclxuICAgIHdpdGggKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwICgodiwgaSwgYSkgPT4gaSA9PSBpbmRleCA/IHZhbHVlIDogdikpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHggKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS54XSB9XHJcbiAgICBzZXQgeCAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS54XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeSAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnldIH1cclxuICAgIHNldCB5ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnldID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB6ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0uel0gfVxyXG4gICAgc2V0IHogKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0uel0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHcgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS53XSB9XHJcbiAgICBzZXQgdyAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS53XSA9IHZhbHVlIH1cclxuICAgIFxyXG4gICAgc3dpenpsZSAoY29vcmRzOiBEaW1bXSk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBBcnJheSAoY29vcmRzLmxlbmd0aClcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgcmVzW2ldID0gdGhpcy5hcnJheVtjb29yZHNbaV1dXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcCAob3BlcjogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAodiA9PiBvcGVyICh2KSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwMiAob3RoZXI6IEFycmF5VmVjLCBvcGVyOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICAodiwgaSkgPT4gb3BlciAodiwgb3RoZXIuYXJyYXlbaV0pKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWR1Y2UgKG9wZXI6IChhY2M6IG51bWJlciwgeDogbnVtYmVyKSA9PiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5yZWR1Y2UgKChjLCB2KSA9PiBvcGVyIChjLCB2KSwgMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBsZW5TcXIgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZSAoKGEsIHgpID0+IGEgKyAoeCAqIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW4gKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQgKHRoaXMubGVuU3FyKVxyXG4gICAgfVxyXG5cclxuICAgIGludiAoKSA6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IC14KVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggKiB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKiBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBkaXYgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAvIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAvIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG5vcm0gKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmxlblxyXG4gICAgICAgIGlmIChsID09IDApXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiQ2Fubm90IG5vcm1hbGl6ZSB6ZXJvIHZlY3RvclwiKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiB4IC8gbClcclxuICAgIH1cclxuXHJcbiAgICBlcXVhbHMgKG90aGVyOiBBcnJheVZlYyk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA9PT0gb3RoZXIuYXJyYXlbaV1cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhcHByb3hFcXVhbHMgKG90aGVyOiBBcnJheVZlYywgZXBzaWxvbjogbnVtYmVyID0gMC4wMDAwMDEpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZNYXRoLmFwcHJveEVxdWFscyAodiwgb3RoZXIuYXJyYXlbaV0sIGVwc2lsb24pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZG90IChvdGhlcjogQXJyYXlWZWMpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5yZWR1Y2UgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoYzogbnVtYmVyLCB2OiBudW1iZXIsIGk6IG51bWJlciwgYTogbnVtYmVyW10pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjICsgKHYgKiBvdGhlci5hcnJheVtpXSkgXHJcbiAgICAgICAgICAgIH0sIDApXHJcbiAgICB9XHJcblxyXG4gICAgY3Jvc3MgKG90aGVyOiBBcnJheVZlYyk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoW1xyXG4gICAgICAgICAgICB0aGlzLnkgKiBvdGhlci56IC0gdGhpcy56ICogb3RoZXIueSxcclxuICAgICAgICAgICAgdGhpcy56ICogb3RoZXIueCAtIHRoaXMueCAqIG90aGVyLnosXHJcbiAgICAgICAgICAgIHRoaXMueCAqIG90aGVyLnkgLSB0aGlzLnkgKiBvdGhlci54XSlcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgYWJzICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5hYnMpXHJcbiAgICB9XHJcblxyXG4gICAgZmxvb3IgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmZsb29yKVxyXG4gICAgfVxyXG5cclxuICAgIGNlaWwgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmNlaWwpXHJcbiAgICB9XHJcblxyXG4gICAgcm91bmQgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLnJvdW5kKVxyXG4gICAgfVxyXG5cclxuICAgIGZyYWN0ICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoRk1hdGguZnJhY3QpXHJcbiAgICB9XHJcblxyXG4gICAgbWluIChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCBNYXRoLm1pbilcclxuICAgIH1cclxuXHJcbiAgICBtYXggKG90aGVyOiBBcnJheVZlYyk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsIE1hdGgubWF4KVxyXG4gICAgfVxyXG5cclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5jbGFtcCAoeCwgbWluLCBtYXgpKVxyXG4gICAgfVxyXG5cclxuICAgIG1peCAob3RoZXI6IEFycmF5VmVjLCBpbnRlclBvczogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IEZNYXRoLm1peCAoeCwgeSwgaW50ZXJQb3MpKVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAgKGVkZ2U6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLnN0ZXAgKGVkZ2UsIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLnNtb290aFN0ZXAgKGVkZ2VMb3dlciwgZWRnZVVwcGVyLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy5hcnJheS5qb2luIChcIiBcIikgKyBcIl1cIlxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV3VmVjICgpOiBOZXdBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgTmV3QXJyYXlWZWMgKHRoaXMuZGltZW5zaW9ucylcclxuICAgIH1cclxuXHJcbiAgICB0b1ZlYzIgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5zbGljZSAoMCwgMikpXHJcbiAgICB9XHJcblxyXG4gICAgdG9WZWMzICh6OiBudW1iZXIgPSAwKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGltZW5zaW9ucylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMjogbmV3IEFycmF5VmVjIChbLi4udGhpcy5hcnJheSwgel0pXHJcbiAgICAgICAgICAgIGNhc2UgNDogbmV3IEFycmF5VmVjICh0aGlzLmFycmF5LnNsaWNlICgwLCAzKSlcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgY29udmVyc2lvbi5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9WZWM0ICh6OiBudW1iZXIgPSAwLCB3OiBudW1iZXIgPSAwKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuZGltZW5zaW9ucylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMjogbmV3IEFycmF5VmVjIChbLi4udGhpcy5hcnJheSwgeiwgd10pXHJcbiAgICAgICAgICAgIGNhc2UgMzogbmV3IEFycmF5VmVjIChbLi4udGhpcy5hcnJheSwgd10pXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGNvbnZlcnNpb24uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL0FycmF5VmVjLnRzIiwiaW1wb3J0IHsgRXF1YXRhYmxlIH0gZnJvbSBcIi4uL0NvbW1vbi9FcXVhdGFibGVcIjtcclxuXHJcbi8qKlxyXG4gKiBFbnVtZXJhdGlvbiB0aGF0IGRlZmluZXMgdGhlIGNvb3JkaW5hdGUgZGltZW5zaW9ucyB1c2VkIGluIHRoZSB2ZWN0b3IgdHlwZXMuXHJcbiAqL1xyXG5leHBvcnQgZW51bSBEaW0gXHJcbntcclxuICAgIHggPSAwLFxyXG4gICAgeSA9IDEsIFxyXG4gICAgeiA9IDIsXHJcbiAgICB3ID0gM1xyXG59XHJcblxyXG4vKiogXHJcbiAqIEJhc2UgaW50ZXJmYWNlIGZvciBhbGwgdmVjdG9yeSB0eXBlcy4gRGVmaW5lcyBtZXRob2RzIHRoYXQgaGF2ZSB0aGUgc2FtZSBzaWduYXR1cmVcclxuICogaW4gYWxsIHZlY3RvciB2YXJpYW50cy5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjPFYgZXh0ZW5kcyBWZWM8Vj4+IGV4dGVuZHMgRXF1YXRhYmxlPFY+XHJcbntcclxuICAgIC8qKlxyXG4gICAgICogTnVtYmVyIGRpbWVuc2lvbnMgaW4gdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgZGltZW5zaW9uczogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBvbmUgb3IgbW9yZSBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgaW4gYXJiaXRyYXJ5IG9yZGVyLiBUaGUgY29tcG9uZW50c1xyXG4gICAgICogcmV0dXJuZWQgZGVwZW5kIG9uIHRoZSBkaW1lbnNpb25zIHNwZWNpZmllZCBpbiB0aGUgY29vcmRzIGFyZ3VtZW50LiBOb3RlIHRoYXRcclxuICAgICAqIHRoZSBzYW1lIGNvbXBvbmVudCBjYW4gb2NjdXIgbXVsdGlwbGUgdGltZXMgaW4gY29vcmRzLiBTbywgaXQgaXMgdmFsaWQgdG8gY2FsbFxyXG4gICAgICogdGhlIGZ1bmN0aW9uIGxpa2UgdGhpczpcclxuICAgICAqIFxyXG4gICAgICogc3dpenpsZSAoW0RpbS54LCBEaW0ueCwgRGltLnldKVxyXG4gICAgICovXHJcbiAgICBzd2l6emxlIChjb29yZHM6IERpbVtdKTogbnVtYmVyW11cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGxlbmdodCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuIEZhc3RlciB0byBjYWxjdWxhdGUgdGhhbiB0aGUgYWN0dWFsIGxlbmd0aCxcclxuICAgICAqIGFuZCB1c2VmdWwgZm9yIGNvbXBhcmluZyB2ZWN0b3IgbWFnbml0dWRlcy5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbGVuU3FyOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogTGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlbjogbnVtYmVyXHJcblxyXG4gICAgY29tcG9uZW50IChpbmRleDogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB3aXRoIChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogVlxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSB2ZWN0b3IuIEZvcm1hdHRlZCBsaWtlIHRoaXM6IFt4IHkgel1cclxuICAgICAqL1xyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAgdG9BcnJheSAoKTogbnVtYmVyW11cclxuICAgIHRvRmxvYXQzMkFycmF5ICgpOiBGbG9hdDMyQXJyYXlcclxuICAgIG5ld1ZlYyAoKTogTmV3VmVjPFY+XHJcbiAgICBcclxuICAgIGludiAoKTogVlxyXG4gICAgYWRkIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIHN1YiAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBtdWwgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgZGl2IChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIG5vcm0gKCk6IFZcclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IFYsIGVwc2lsb24/OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICBkb3QgKG90aGVyOiBWKTogbnVtYmVyXHJcbiAgICBhYnMgKCk6IFZcclxuICAgIGZsb29yICgpOiBWXHJcbiAgICBjZWlsICgpOiBWXHJcbiAgICByb3VuZCAoKTogVlxyXG4gICAgZnJhY3QgKCk6IFZcclxuICAgIG1pbiAob3RoZXI6IFYpIDogVlxyXG4gICAgbWF4IChvdGhlcjogVikgOiBWXHJcbiAgICBjbGFtcCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogVlxyXG4gICAgbWl4IChvdGhlcjogViwgaW50ZXJQb3M6IG51bWJlcik6IFZcclxuICAgIHN0ZXAgKGVkZ2U6IG51bWJlcik6IFZcclxuICAgIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlcik6IFZcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBOZXdWZWM8ViBleHRlbmRzIFZlYzxWPj5cclxue1xyXG4gICAgcmVhZG9ubHkgZGltZW5zaW9uczogbnVtYmVyXHJcbiAgICByZWFkb25seSB6ZXJvOiBWXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVlxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMiBleHRlbmRzIFZlYzxWZWMyPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgdG9WZWMzICh6OiBudW1iZXIpOiBWZWMzXHJcbiAgICB0b1ZlYzQgKHo6IG51bWJlciwgdzogbnVtYmVyKTogVmVjNFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzMgZXh0ZW5kcyBWZWM8VmVjMz5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG5cclxuICAgIHRvVmVjMiAoKTogVmVjMlxyXG4gICAgdG9WZWM0ICh3OiBudW1iZXIpOiBWZWM0XHJcbiAgICBjcm9zcyAob3RoZXI6IFZlYzMpOiBWZWMzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjNCBleHRlbmRzIFZlYzxWZWM0PlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgejogbnVtYmVyXHJcbiAgICB3OiBudW1iZXJcclxuXHJcbiAgICB0b1ZlYzIgKCk6IFZlYzJcclxuICAgIHRvVmVjMyAoKTogVmVjM1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvVmVjdG9ycy50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBOZXdNYXQ0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0cmljZXNcIjtcclxuaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUhlbHBlciBmcm9tIFwiLi4vQ29tbW9uL0FycmF5RXh0XCI7XHJcblxyXG5jbGFzcyBOZXdBcnJheU1hdCBpbXBsZW1lbnRzIE5ld01hdDxNYXQyPiwgTmV3TWF0PE1hdDM+LCBOZXdNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSB7IH1cclxuXHJcbiAgICBwcml2YXRlIGlkZW50aXR5QXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHIgKiBjKSwgMClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChyLCBjKTsgaSsrKSBcclxuICAgICAgICAgICAgYXJyW2kgKiByICsgaV0gPSAxXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+KHIgKiBjKSwgMCksIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkZW50aXR5ICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmlkZW50aXR5QXJyYXkgKCksIHRoaXMucm93cywgdGhpcy5jb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0aW9uIChvZmZzZXRzOiBudW1iZXJbXSk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgbGFzdENvbCA9IGMgLSAxXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbiAob2Zmc2V0cy5sZW5ndGgsIHIgLSAxKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2xhc3RDb2wgKiByICsgaV0gPSBvZmZzZXRzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxpbmcgKGZhY3RvcnM6IG51bWJlcltdKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKGZhY3RvcnMubGVuZ3RoLCByLCBjKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2kgKiByICsgaV0gPSBmYWN0b3JzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWCAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBYLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2FcclxuICAgICAgICByZXNbciArIDJdID0gc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDFdID0gLXNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2FcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25ZIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFktYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1syXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1syICogcl0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25aIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzFdID0gc2luYTtcclxuICAgICAgICByZXNbcl0gPSAtc2luYTtcclxuICAgICAgICByZXNbciArIDFdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcGVyc3BlY3RpdmUgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBpZiAoek5lYXIgPD0gMCB8fCB6TmVhciA+PSB6RmFyKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcInpOZWFyIG5lZWRzIHRvIGJlIHBvc2l0aXZlIGFuZCBzbWFsbGVyIHRoYXRuIHpGYXJcIilcclxuICAgICAgICBsZXQgd2lkdGggPSByaWdodCAtIGxlZnRcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdG9wIC0gYm90dG9tXHJcbiAgICAgICAgbGV0IGRlcHRoID0gekZhciAtIHpOZWFyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsoMi4wICogek5lYXIpIC8gd2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsICgyLjAgKiB6TmVhcikgLyBoZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIChyaWdodCArIGxlZnQpIC8gd2lkdGgsICh0b3AgKyBib3R0b20pIC8gaGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgLyBkZXB0aCwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsIC0oMi4wICogekZhciAqIHpOZWFyKSAvIGRlcHRoLCAwXSwgXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgb3J0aG9ncmFwaGljIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGludldpZHRoID0gMS4wIC8gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBsZXQgaW52SGVpZ2h0ID0gMS4wIC8gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBsZXQgaW52RGVwdGggPSAxLjAgLyAoekZhciAtIHpOZWFyKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbMiAqIGludldpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAyICogaW52SGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAtMiAqIGludkRlcHRoLCAwLFxyXG4gICAgICAgICAgICAtKHJpZ2h0ICsgbGVmdCkgKiBpbnZXaWR0aCwgLSh0b3AgKyBib3R0b20pICogaW52SGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgKiBpbnZEZXB0aCwgMV0sXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0IChkaXJlY3Rpb246IFZlYzMsIHVwOiBWZWMzKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB6YXhpcyA9IGRpcmVjdGlvbi5pbnYgKCkubm9ybSAoKVxyXG4gICAgICAgIGxldCB4YXhpcyA9IHVwLmNyb3NzICh6YXhpcykubm9ybSAoKVxyXG4gICAgICAgIGxldCB5YXhpcyA9IHpheGlzLmNyb3NzICh4YXhpcylcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFt4YXhpcy54LCB5YXhpcy54LCB6YXhpcy54LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy55LCB5YXhpcy55LCB6YXhpcy55LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy56LCB5YXhpcy56LCB6YXhpcy56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXSwgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyYXksIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQyOiBOZXdNYXQ8TWF0Mj4gPSBuZXcgTmV3QXJyYXlNYXQgKDIsIDIpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQzOiBOZXdNYXQ8TWF0Mz4gPSBuZXcgTmV3QXJyYXlNYXQgKDMsIDMpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQ0OiBOZXdNYXQ0ID0gbmV3IE5ld0FycmF5TWF0ICg0LCA0KVxyXG5cclxuY2xhc3MgQXJyYXlNYXQgaW1wbGVtZW50cyBNYXQyLCBNYXQzLCBNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBhcnJheTogbnVtYmVyW10sIHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoICE9PSByb3dzICpjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkFycmF5IGxlbmd0aCBoYXMgdG8gYmUgZXF1YWwgdG8gcm93cyAqIGNvbHVtbnMuXCIpIFxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQgKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5W2NvbHVtbiAqIHRoaXMucm93cyArIHJvd11cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcCAob3BlcjogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0aGlzLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAodilcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwMiAob3RoZXI6IEFycmF5TWF0LCBvcGVyOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29scyAhPSBvdGhlci5jb2xzIHx8IHRoaXMucm93cyAhPSBvdGhlci5yb3dzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIk1hdHJpeCBkaW1lbnNpb25zIG11c3QgbWF0Y2guXCIpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKVxyXG4gICAgICAgICAgICB9KSwgdGhpcy5jb2xzLCB0aGlzLnJvd3MpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXRyaXhNdWx0aXBseSAob3RoZXI6IEFycmF5TWF0KTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMucm93c1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IHEgPSBvdGhlci5yb3dzXHJcbiAgICAgICAgbGV0IHAgPSBvdGhlci5jb2xzXHJcbiAgICAgICAgaWYgKG0gIT09IHEpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBDYW5ub3QgbXVsdGlwbHkgJHtufXgke219IG1hdHJpeCB3aXRoICR7cX14JHtwfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAobiAqIHApXHJcbiAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHJvd3MgYW5kIGNvbHVtbnNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFN1bSB1cCByb3dzIGZyb20gdGhpcyB3aXRoIGNvbHVtbnMgZnJvbSBvdGhlciBtYXRyaXguXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gMFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9IHRoaXMuYXJyYXlbayAqIG4gKyBpXSAqIG90aGVyLmFycmF5W2ogKiBxICsga11cclxuICAgICAgICAgICAgICAgIHJlc1tqICogbiArIGldID0gdmFsIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCBuLCBwKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4ICsgeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICsgb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3ViIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggLSB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLSBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBtdWwgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeE11bHRpcGx5IChvdGhlcikgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtPFYgZXh0ZW5kcyBWZWM8Vj4+ICh2ZWM6IFYpOiBWXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGFyciA9IFsuLi52ZWMudG9BcnJheSAoKSwgMSwgMV0uc2xpY2UgKDAsIHRoaXMuY29scylcclxuICAgICAgICBsZXQgdmVjbSA9IG5ldyBBcnJheU1hdCAoYXJyLCB0aGlzLmNvbHMsIDEpXHJcbiAgICAgICAgcmV0dXJuIHZlYy5uZXdWZWMgKCkuZnJvbUFycmF5ICh0aGlzLm1hdHJpeE11bHRpcGx5ICh2ZWNtKS5hcnJheSlcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc3Bvc2UgKCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJvd3MgPSB0aGlzLmNvbHNcclxuICAgICAgICBsZXQgY29scyA9IHRoaXMucm93c1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXI+ICh0aGlzLmFycmF5Lmxlbmd0aClcclxuICAgICAgICBsZXQgaW5kID0gMFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKylcclxuICAgICAgICAgICAgICAgIHJlc1tqICogcm93cyArIGldID0gdGhpcy5hcnJheVtpbmQrK11cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5hbnQgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRldGVybWluYW50RkEgKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW52ZXJ0ICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBBcnJheU1hdC5mcm9tSmFnZ2VkQXJyYXkgKHRoaXMuaW52ZXJzZUZBICgpKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG9KYWdnZWRBcnJheSAoKTogbnVtYmVyW11bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMsIGFycmF5IH0gPSB0aGlzXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcltdPiAocm93cylcclxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc1tyXSA9IEFycmF5PG51bWJlcj4oY29scylcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXNbcl1bY10gPSBhcnJheVtjICogcm93cyArIHJdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBmcm9tSmFnZ2VkQXJyYXkgKG1hdHJpeDogbnVtYmVyW11bXSk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IGNvbHMgPSBtYXRyaXhbMF0ubGVuZ3RoXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5PG51bWJlcj4oY29scyAqIHJvd3MpXHJcbiAgICAgICAgbGV0IGkgPSAwXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzOyBjKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgYXJyW2krK10gPSBtYXRyaXhbcl1bY11cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChhcnIsIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvbXBvc2VGQSAobWF0cml4OiBudW1iZXJbXVtdKTogWyBudW1iZXJbXSwgbnVtYmVyIF0gXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93cywgY29scyB9ID0gdGhpc1xyXG4gICAgICAgIGlmIChyb3dzICE9IGNvbHMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiQ2Fubm90IGRlY29tcG9zZSBub24tc3F1YXJlIG1hdHJpeFwiKVxyXG4gICAgICAgIC8vIHNldCB1cCByb3cgcGVybXV0YXRpb24gcmVzdWx0XHJcbiAgICAgICAgbGV0IHBlcm0gPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIFxyXG4gICAgICAgICAgICBwZXJtW2ldID0gaVxyXG4gICAgICAgIC8vIHRvZ2dsZSB0cmFja3Mgcm93IHN3YXBzLiArMSAtPiBldmVuLCAtMSAtPiBvZGQuIHVzZWQgYnkgTWF0cml4RGV0ZXJtaW5hbnRcclxuICAgICAgICBsZXQgdG9nZ2xlID0gMTsgXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzIC0gMTsgYysrKSAvLyBlYWNoIGNvbHVtblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvbE1heCA9IE1hdGguYWJzIChtYXRyaXhbY11bY10pIC8vIGZpbmQgbGFyZ2VzdCB2YWx1ZSBpbiBjb2wgalxyXG4gICAgICAgICAgICBsZXQgcFJvdyA9IGNcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IGMgKyAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgaWYgKG1hdHJpeFtyXVtjXSA+IGNvbE1heClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xNYXggPSBtYXRyaXhbcl1bY11cclxuICAgICAgICAgICAgICAgICAgICBwUm93ID0gclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocFJvdyAhPSBjKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgbGFyZ2VzdCB2YWx1ZSBub3Qgb24gcGl2b3QsIHN3YXAgcm93c1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1B0ciA9IG1hdHJpeFtwUm93XVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W3BSb3ddID0gbWF0cml4W2NdXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbY10gPSByb3dQdHJcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBzd2FwIHBlcm0gaW5mb1xyXG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IHBlcm1bcFJvd11cclxuICAgICAgICAgICAgICAgIHBlcm1bcFJvd10gPSBwZXJtW2NdXHJcbiAgICAgICAgICAgICAgICBwZXJtW2NdID0gdG1wXHJcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIHJvdy1zd2FwIHRvZ2dsZVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZSAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBpbnB1dCBtYXRyaXggaXMgc2luZ3VsYXJcclxuICAgICAgICAgICAgaWYgKG1hdHJpeFtjXVtjXSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdW2NdID0gMC4wMDAwMDFcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IGMgKyAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbcl1bY10gLz0gbWF0cml4W2NdW2NdXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gYyArIDE7IGsgPCBjb2xzOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4W3JdW2tdIC09IG1hdHJpeFtyXVtjXSAqIG1hdHJpeFtjXVtrXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbIHBlcm0sIHRvZ2dsZSBdXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmFudEZBICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZGVjb21wb3NlRkEgKG1hdHJpeClbMV1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgcmVzdWx0ICo9IG1hdHJpeFtpXVtpXVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGludmVyc2VGQSAoKTogbnVtYmVyW11bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCBtYXRyaXggPSB0aGlzLnRvSmFnZ2VkQXJyYXkgKClcclxuICAgICAgICBsZXQgcm93cyA9IG1hdHJpeC5sZW5ndGhcclxuICAgICAgICBsZXQgcmVzdWx0ID0gQXJyYXlIZWxwZXIuY2xvbmUgKG1hdHJpeClcclxuICAgICAgICBsZXQgcGVybSA9IHRoaXMuZGVjb21wb3NlRkEgKG1hdHJpeClbMF1cclxuICAgICAgICBsZXQgYiA9IEFycmF5PG51bWJlcj4ocm93cylcclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgYltyXSA9IGMgPT0gcGVybVtyXSA/IDEgOiAwXHJcbiAgICAgICAgICAgIGxldCB4ID0gQXJyYXlNYXQuaGVscGVyU29sdmVmIChtYXRyaXgsIGIpIFxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtyXVtjXSA9IHhbcl1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhlbHBlclNvbHZlZiAobHVNYXRyaXg6IG51bWJlcltdW10sIHZlY3RvcjogbnVtYmVyW10pOiBudW1iZXJbXSBcclxuICAgIHtcclxuICAgICAgICAvLyBiZWZvcmUgY2FsbGluZyB0aGlzIGhlbHBlciwgcGVybXV0ZSBiIHVzaW5nIHRoZSBwZXJtIGFycmF5IGZyb20gXHJcbiAgICAgICAgLy8gTWF0cml4RGVjb21wb3NlIHRoYXQgZ2VuZXJhdGVkIGx1TWF0cml4XHJcbiAgICAgICAgbGV0IHJvd3MgPSBsdU1hdHJpeC5sZW5ndGhcclxuICAgICAgICBsZXQgcmVzID0gdmVjdG9yLnNsaWNlICgpXHJcblxyXG4gICAgICAgIGZvciAobGV0IHIgPSAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IHJlc1tyXVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHI7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzW3Jvd3MgLSAxXSAvPSBsdU1hdHJpeFtyb3dzIC0gMV1bcm93cyAtIDFdXHJcbiAgICAgICAgZm9yIChsZXQgciA9IHJvd3MgLSAyOyByID49IDA7IHItLSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IHIgKyAxOyBjIDwgcm93czsgYysrKVxyXG4gICAgICAgICAgICAgICAgc3VtIC09IGx1TWF0cml4W3JdW2NdICogcmVzW2NdXHJcbiAgICAgICAgICAgIHJlc1tyXSA9IHN1bSAvIGx1TWF0cml4W3JdW3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlNYXQpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlNYXQsIGVwc2lsb24/OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZNYXRoLmFwcHJveEVxdWFscyAodiwgb3RoZXIuYXJyYXlbaV0sIGVwc2lsb24pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGxldCByZXMgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlcyArPSBcIlsgXCJcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLmNvbHM7IGMrKylcclxuICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmVsZW1lbnQociwgYykgKyBcIiBcIlxyXG4gICAgICAgICAgICByZXMgKz0gXCJdXFxuXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgfVxyXG5cclxuICAgIHRvRmxvYXQzMkFycmF5ICgpOiBGbG9hdDMyQXJyYXlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSAodGhpcy5hcnJheSlcclxuICAgIH1cclxuXHJcbiAgICB0b01hdDIgKCk6IE1hdDJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMiksICBcclxuICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKHRoaXMucm93cywgdGhpcy5yb3dzICsgMikgIFxyXG4gICAgICAgICAgICBdLCAyLCAyKVxyXG4gICAgfVxyXG5cclxuICAgIHRvTWF0MyAoKTogTWF0M1xyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5yb3dzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMiksIDAsICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgyLCA0KSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAxICBcclxuICAgICAgICAgICAgICAgIF0sIDMsIDMpXHJcbiAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMyksICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICg0LCA3KSwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDgsIDExKSAgXHJcbiAgICAgICAgICAgICAgICBdLCAzLCAzKVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b01hdDQgKCk6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucm93cykgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDIsIDQpLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMCwgMSAgIFxyXG4gICAgICAgICAgICAgICAgXSwgNCwgNClcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAzKSwgMCwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDMsIDcpLCAwLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoNywgMTApLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgICBcclxuICAgICAgICAgICAgICAgIF0sIDQsIDQpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGNvbnZlcnNpb24uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvQXJyYXlNYXQudHMiLCJleHBvcnQgdHlwZSBTaGFkZXJUeXBlID0gJ3ZlcnRleCcgfCAnZnJhZ21lbnQnXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhZGVyXHJcbntcclxuICAgIHJlYWRvbmx5IGdsU2hhZGVyOiBXZWJHTFNoYWRlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHJlYWRvbmx5IHR5cGU6IFNoYWRlclR5cGUsIHNvdXJjZTogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBnbFxyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcclxuICAgICAgICBsZXQgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xTaGFkZXJUeXBlKTtcclxuICAgICAgICBpZiAoc2hhZGVyID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoYEZhaWxlZCB0byBjcmVhdGUgJHt0eXBlfSBzaGFkZXIuYClcclxuICAgICAgICBcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSAnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAnICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpXHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbFNoYWRlciA9IHNoYWRlclxyXG4gICAgfVxyXG5cclxuICAgIGdldCBnbFNoYWRlclR5cGUgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICd2ZXJ0ZXgnID8gXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuVkVSVEVYX1NIQURFUiA6IFxyXG4gICAgICAgICAgICB0aGlzLmdsLkZSQUdNRU5UX1NIQURFUlxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML1NoYWRlci50cyIsImltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiO1xyXG5pbXBvcnQgeyBWZXJ0ZXhBdHRyLCBWZXJ0ZXhBdHRyVHlwZSwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQnVmZmVyIGV4dGVuZHMgR0xSZXNvdXJjZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcmVhZG9ubHkgdGFyZ2V0OiBudW1iZXIsXHJcbiAgICAgICAgcmVhZG9ubHkgZ2xCdWZmZXI6IFdlYkdMQnVmZmVyLCByZWFkb25seSBsZW5ndGg6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICB9XHJcblxyXG4gICAgdXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyICh0aGlzLnRhcmdldCwgdGhpcy5nbEJ1ZmZlcilcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyICh0aGlzLnRhcmdldCwgbnVsbClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleEJ1ZmZlcjxWPiBleHRlbmRzIEJ1ZmZlciBcclxue1xyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHZlcnRleERlZjogVmVydGV4RGVmPFY+LCB2ZXJ0aWNlczogVltdKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWYgPSBnbC5jcmVhdGVCdWZmZXIgKClcclxuICAgICAgICBpZiAoYnVmID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ZhaWxlZCB0byBjcmVhdGUgdmVydGV4IGJ1ZmZlci4nKVxyXG4gICAgICAgIHN1cGVyIChnbCwgZ2wuQVJSQVlfQlVGRkVSLCBidWYsIHZlcnRpY2VzLmxlbmd0aClcclxuICAgICAgICB1c2luZyAodGhpcywgKCkgPT4gXHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEgKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0QnVmZmVyICh2ZXJ0ZXhEZWYsIHZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEJ1ZmZlciAodmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj4sIHZlcnRpY2VzOiBWW10pOiBBcnJheUJ1ZmZlclxyXG4gICAge1xyXG4gICAgICAgIGxldCB2ZXJ0ZXhTaXplID0gdmVydGV4RGVmLnN0cmlkZVxyXG4gICAgICAgIGxldCBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGhcclxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyICh2ZXJ0ZXhTaXplICogbGVuKVxyXG4gICAgICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3IChidWZmZXIpXHJcbiAgICAgICAgdmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT4gXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgdmFyIHNldHRlciA9IHRoaXMudmVydGV4QXR0clNldHRlciAodmlldywgYXR0ci50eXBlKVxyXG4gICAgICAgICAgICBsZXQgdHlwZVNpemUgPSBhdHRyLnR5cGVTaXplXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBhdHRyLmdldHRlciAodmVydGljZXNbal0pXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGF0dHIubnVtQ29tcG9uZW50czsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRlciAoKGogKiB2ZXJ0ZXhTaXplKSArIGF0dHIub2Zmc2V0ICsgKGsgKiB0eXBlU2l6ZSksIHZhbHVlc1trXSkgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBidWZmZXJcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZlcnRleEF0dHJTZXR0ZXIgKHZpZXc6IERhdGFWaWV3LCB0eXBlOiBWZXJ0ZXhBdHRyVHlwZSk6IFxyXG4gICAgICAgIChvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlcikgPT4gdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRJbnQ4IChvZmYsIHZhbClcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldFVpbnQ4IChvZmYsIHZhbClcclxuICAgICAgICAgICAgY2FzZSAnc2hvcnQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEludDE2IChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRVaW50MTYgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0RmxvYXQzMiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5kZXhCdWZmZXIgZXh0ZW5kcyBCdWZmZXJcclxue1xyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIGluZGljZXM6IG51bWJlcltdKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWYgPSBnbC5jcmVhdGVCdWZmZXIgKClcclxuICAgICAgICBpZiAoYnVmID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ZhaWxlZCB0byBjcmVhdGUgaW5kZXggYnVmZmVyLicpXHJcbiAgICAgICAgc3VwZXIgKGdsLCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnVmLCBpbmRpY2VzLmxlbmd0aClcclxuICAgICAgICB1c2luZyAodGhpcywgKCkgPT4gXHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEgKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkgKGluZGljZXMpLCBnbC5TVEFUSUNfRFJBVykpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvQnVmZmVycy50cyIsImltcG9ydCB7IFNoYWRlclR5cGUsIFNoYWRlciB9IGZyb20gXCIuL1NoYWRlclwiXG5pbXBvcnQgeyBWZXJ0ZXhBdHRyLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcbmltcG9ydCB7IFVuaWZvcm0sIFVuaWZvcm1EZWYgfSBmcm9tIFwiLi9Vbmlmb3Jtc1wiXG5pbXBvcnQgeyBHTFJlc291cmNlLCB1c2luZyB9IGZyb20gXCIuL0dMUmVzb3VyY2VcIlxuaW1wb3J0IHsgVmVydGV4QnVmZmVyLCBJbmRleEJ1ZmZlciB9IGZyb20gXCIuL0J1ZmZlcnNcIjtcblxuZXhwb3J0IGNsYXNzIFByb2dyYW08ViwgVT4gZXh0ZW5kcyBHTFJlc291cmNlXG57XG4gICAgcmVhZG9ubHkgZ2xQcm9ncmFtOiBXZWJHTFByb2dyYW1cbiAgICByZWFkb25seSBzaGFkZXJzOiBTaGFkZXJbXVxuICAgIHJlYWRvbmx5IHZlcnRleERlZjogVmVydGV4RGVmPFY+XG4gICAgcmVhZG9ubHkgdW5pZm9ybURlZjogVW5pZm9ybURlZjxVPlxuXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIFxuICAgICAgICBzaGFkZXJzOiBTaGFkZXJbXSwgXG4gICAgICAgIHZlcnRleEF0dHJzOiBWZXJ0ZXhBdHRyPFY+W10sXG4gICAgICAgIHVuaWZvcm1zOiBVbmlmb3JtPFU+W10pIFxuICAgIHtcbiAgICAgICAgc3VwZXIgKGdsKVxuICAgICAgICB0aGlzLnNoYWRlcnMgPSBzaGFkZXJzXG4gICAgICAgIHRoaXMuZ2xQcm9ncmFtID0gdGhpcy5saW5rICgpXG4gICAgICAgIHRoaXMudmVydGV4RGVmID0gbmV3IFZlcnRleERlZiAodmVydGV4QXR0cnMpXG4gICAgICAgIHRoaXMudmVydGV4RGVmLmluaXRWZXJ0ZXhBdHRyTG9jYXRpb25zIChnbCwgdGhpcy5nbFByb2dyYW0pXG4gICAgICAgIHRoaXMudW5pZm9ybURlZiA9IG5ldyBVbmlmb3JtRGVmICh1bmlmb3JtcylcbiAgICAgICAgdGhpcy51bmlmb3JtRGVmLmluaXRVbmlmb3JtTG9jYXRpb25zIChnbCwgdGhpcy5nbFByb2dyYW0pXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsaW5rICgpOiBXZWJHTFByb2dyYW1cbiAgICB7XG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcbiAgICAgICAgbGV0IHByZyA9IGdsLmNyZWF0ZVByb2dyYW0oKVxuICAgICAgICBpZiAocHJnID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaGFkZXJzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByZywgdGhpcy5zaGFkZXJzW2ldLmdsU2hhZGVyKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJnKTtcbiAgICAgIFxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJnLCBnbC5MSU5LX1NUQVRVUykpIFxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW06ICcgKyBcbiAgICAgICAgICAgICAgICBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcmcpKVxuICAgICAgICByZXR1cm4gcHJnXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXG4gICAge1xuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsXG4gICAgICAgIHRoaXMudmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcbiAgICAgICAgICAgICAgICBhdHRyLmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIGF0dHIubnVtQ29tcG9uZW50cyxcbiAgICAgICAgICAgICAgICBhdHRyLmdsVHlwZSAoZ2wpLFxuICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGVmLnN0cmlkZSxcbiAgICAgICAgICAgICAgICBhdHRyLm9mZnNldCk7XG4gICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRyLmxvY2F0aW9uKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB1c2UgKClcbiAgICB7XG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAodGhpcy5nbFByb2dyYW0pXG4gICAgfVxuXG4gICAgcmVsZWFzZSAoKVxuICAgIHtcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtIChudWxsKVxuICAgIH1cblxuICAgIGRyYXdFbGVtZW50cyAobW9kZTogbnVtYmVyLCB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8Vj4sIGlidWZmZXI6IEluZGV4QnVmZmVyLCB1bmlmb3JtczogVSlcbiAgICB7XG4gICAgICAgIHVzaW5nIChbdGhpcywgdmJ1ZmZlciwgaWJ1ZmZlcl0sIGdsID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybURlZi5zZXRWYWx1ZXMgKGdsLCB1bmlmb3JtcylcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlVmVydGV4QXR0ckFycmF5cyAoKVxuICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzIChtb2RlLCBpYnVmZmVyLmxlbmd0aCwgZ2wuVU5TSUdORURfU0hPUlQsIDApXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9Qcm9ncmFtLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIiBhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxyXFxuIHZhcnlpbmcgaGlnaHAgdmVjMyBwb3NpdGlvbjtcXHJcXG4gXFxyXFxuIHVuaWZvcm0gbWF0NCB1TW9kZWxWaWV3TWF0cml4O1xcclxcbiB1bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxyXFxuXFxyXFxudm9pZCBtYWluKCkge1xcclxcbiAgICB2ZWM0IHBvcyA9IHZlYzQgKGFWZXJ0ZXhQb3NpdGlvbiwgMCwgMSk7XFxyXFxuICAgIHBvc2l0aW9uID0gbWF4KHBvcy54eXosIHZlYzMoMCkpO1xcclxcbiAgICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdU1vZGVsVmlld01hdHJpeCAqIHBvcztcXHJcXG4gfVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUudmVydFxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcInZhcnlpbmcgaGlnaHAgdmVjMyBwb3NpdGlvbjtcXHJcXG5cXHJcXG52b2lkIG1haW4oKSB7IFxcclxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHBvc2l0aW9uLCAxLjApO1xcclxcbn1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLmZyYWdcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=