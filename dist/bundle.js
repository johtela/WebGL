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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjMyMGY0ZDBmYzJiMTQ3YjgzMzAiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7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RSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsR0FBRztRQUVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELE9BQU87UUFFSCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVksQ0FBRSxJQUFZLEVBQUUsT0FBd0IsRUFBRSxPQUFvQixFQUFFLFFBQVc7UUFFbkYsa0JBQUssQ0FBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFFbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQztZQUN4QyxJQUFJLENBQUMsc0JBQXNCLEVBQUc7WUFDOUIsRUFBRSxDQUFDLFlBQVksQ0FBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF2RUQsMEJBdUVDOzs7Ozs7O0FDN0VELGtEQUFrRCxpQ0FBaUMsd0NBQXdDLG9DQUFvQyxxQkFBcUIsZ0RBQWdELHlDQUF5QyxpRUFBaUUsTUFBTSxLOzs7Ozs7QUNBcFYsOENBQThDLHFCQUFxQiw0Q0FBNEMsS0FBSyxLIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIzMjBmNGQwZmMyYjE0N2I4MzMwIiwiZXhwb3J0IGNvbnN0IHR3b1BJID0gTWF0aC5QSSAqIDJcclxuZXhwb3J0IGNvbnN0IFBJb3ZlcjIgPSBNYXRoLlBJIC8gMlxyXG5leHBvcnQgY29uc3QgUElvdmVyNCA9IE1hdGguUEkgLyA0XHJcbmV4cG9ydCBjb25zdCBQSW92ZXI4ID0gTWF0aC5QSSAvIDhcclxuZXhwb3J0IGNvbnN0IFBJb3ZlcjE2ID0gTWF0aC5QSSAvIDE2XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXBwcm94RXF1YWxzICh4OiBudW1iZXIsIHk6IG51bWJlciwgXHJcbiAgICBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSkgOiBib29sZWFuXHJcbntcclxuICAgIGlmICh4ID09PSB5KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIGxldCBhYnNYID0gTWF0aC5hYnMgKHgpO1xyXG4gICAgbGV0IGFic1kgPSBNYXRoLmFicyAoeSk7XHJcbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzICh4IC0geSk7XHJcblxyXG4gICAgaWYgKHggKiB5ID09IDApXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgPCAoZXBzaWxvbiAqIGVwc2lsb24pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBkaWZmIC8gKGFic1ggKyBhYnNZKSA8IGVwc2lsb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcmFjdCAoeDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IC0gTWF0aC5mbG9vciAoeCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCAoeDogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggPCBtaW4gPyBtaW4gOlxyXG4gICAgICAgICAgIHggPiBtYXggPyBtYXggOlxyXG4gICAgICAgICAgIHg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXggKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBpbnRlclBvczogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiBzdGFydCArIChpbnRlclBvcyAqIChlbmQgLSBzdGFydCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RlcCAoZWRnZTogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB2YWx1ZSA8IGVkZ2UgPyAwIDogMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICBsZXQgdCA9IGNsYW1wICgodmFsdWUgLSBlZGdlTG93ZXIpIC8gKGVkZ2VVcHBlciAtIGVkZ2VMb3dlciksIDAsIDEpO1xyXG4gICAgcmV0dXJuIHQgKiB0ICogKDMgLSAoMiAqIHQpKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL0ZNYXRoLnRzIiwiaW1wb3J0IHsgRXF1YXRhYmxlIH0gZnJvbSBcIi4vRXF1YXRhYmxlXCI7XG5pbXBvcnQgeyBhcHByb3hFcXVhbHMgfSBmcm9tIFwiLi4vTWF0aC9GTWF0aFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VD4gKGFycmF5OiBUW11bXSk6IFRbXVtdXG57XG4gICAgbGV0IHJvd3MgPSBhcnJheS5sZW5ndGhcbiAgICBsZXQgcmVzID0gQXJyYXk8VFtdPihyb3dzKVxuICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxuICAgICAgICByZXNbcl0gPSBhcnJheVtyXS5zbGljZSAoKVxuICAgIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGw8VD4gKGFycmF5OiBUW10sIHZhbHVlOiBUKTogVFtdXG57XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcbiAgICAgICAgYXJyYXlbaV0gPSB2YWx1ZVxuICAgIHJldHVybiBhcnJheVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0PFQ+ICh2YWx1ZTogVCwgY291bnQ6IG51bWJlcik6IFRbXVxue1xuICAgIHZhciByZXMgPSBBcnJheTxUPiAoY291bnQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKVxuICAgICAgICByZXNbaV0gPSB2YWx1ZVxuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXhJdGVtczxUPiAoYXJyYXk6IFRbXSwgc2VsZWN0b3I6ICjDrXRlbTogVCkgPT4gbnVtYmVyKTogVFtdXG57XG4gICAgbGV0IHJlczogVFtdID0gW11cbiAgICBsZXQgbWF4ID0gTnVtYmVyLk1BWF9WQUxVRVxuICAgIGZvciAobGV0IGl0ZW0gb2YgYXJyYXkpXG4gICAge1xuICAgICAgICB2YXIgdmFsdWUgPSBzZWxlY3RvciAoaXRlbSk7XG4gICAgICAgIGlmICh2YWx1ZSA+IG1heClcbiAgICAgICAge1xuICAgICAgICAgICAgbWF4ID0gdmFsdWU7XG4gICAgICAgICAgICByZXMgPSBbIGl0ZW0gXVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFwcHJveEVxdWFscyAodmFsdWUsIG1heCkpXG4gICAgICAgICAgICByZXMucHVzaCAoaXRlbSlcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1bSAoYXJyYXk6IG51bWJlcltdKTogbnVtYmVyXG57XG4gICAgbGV0IHJlcyA9IDBcbiAgICBmb3IgKHZhciBpdGVtIG9mIGFycmF5KVxuICAgICAgICByZXMgKz0gaXRlbVxuICAgIHJldHVybiByZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0PFQgZXh0ZW5kcyBFcXVhdGFibGU8VD4+IChhcnJheTogVFtdKVxue1xuICAgIGxldCBmaXJzdE9jY3VyZW5jZSA9IChpdGVtOiBULCBpbmRleDogbnVtYmVyKSA9PiBhcnJheS5maW5kSW5kZXggKGkgPT4gaS5lcXVhbHMgKGl0ZW0pKSA9PT0gaW5kZXhcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyIChmaXJzdE9jY3VyZW5jZSkgICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0TWFwPFQsIFU+IChhcnJheTogVFtdLCBzZWxlY3RvcjogKGl0ZW06IFQpID0+IFVbXSk6IFVbXVxue1xuICAgIHJldHVybiBuZXcgQXJyYXk8VT4gKCkuY29uY2F0ICguLi5hcnJheS5tYXAgKHNlbGVjdG9yKSlcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29tbW9uL0FycmF5RXh0LnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4uL01hdGgvVmVjdG9yc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVmVydGV4QXR0clR5cGUgPSAnYnl0ZScgfCAnc2hvcnQnIHwgJ3VieXRlJyB8ICd1c2hvcnQnIHwgJ2Zsb2F0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgbG9jYXRpb246IG51bWJlclxyXG4gICAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgbmFtZTogc3RyaW5nLCByZWFkb25seSB0eXBlOiBWZXJ0ZXhBdHRyVHlwZSxcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFYpID0+IG51bWJlcltdKSB7IH1cclxuXHJcbiAgICBnZXQgdHlwZVNpemUgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiBcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiBcclxuICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzpcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMlxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXplSW5CeXRlcyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCAodGhpcy50eXBlU2l6ZSAqIHRoaXMubnVtQ29tcG9uZW50cyAvIDQpICogNFxyXG4gICAgfVxyXG5cclxuICAgIGdsVHlwZSAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gZ2wuQllURVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIGdsLlNIT1JUXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6IHJldHVybiBnbC5GTE9BVFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBhdHRyaWJ1dGUgdHlwZS5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhEZWY8Vj5cclxue1xyXG4gICAgcmVhZG9ubHkgc3RyaWRlOiBudW1iZXJcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IHZlcnRleEF0dHJzOiBWZXJ0ZXhBdHRyPFY+W10pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zdHJpZGUgPSB0aGlzLmluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2ggKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHYub2Zmc2V0ID0gb2Zmc2V0XHJcbiAgICAgICAgICAgIG9mZnNldCArPSB2LnNpemVJbkJ5dGVzIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyTG9jYXRpb25zIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcmc6IFdlYkdMUHJvZ3JhbSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2godiA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uIChwcmcsIHYubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA8IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvciAoYFZlcnRleCBhdHRyaWJ1dGUgJyR7di5uYW1lfScgbm90IGZvdW5kIGluIHByb2dyYW0uYClcclxuICAgICAgICAgICAgdi5sb2NhdGlvbiA9IGxvY1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBieXRlPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdieXRlJywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVieXRlPFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1Ynl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydDxWLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBWLCBzdHJpbmc+PiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnc2hvcnQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNob3J0PFYsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFYsIHN0cmluZz4+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1c2hvcnQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmxvYXQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMiwgdiA9PiAoPFZlYzI+dltuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzM8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMywgdiA9PiAoPFZlYzM+dltuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzQ8ViwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgViwgc3RyaW5nPj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgNCwgdiA9PiAoPFZlYzQ+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4uL01hdGgvTWF0cmljZXNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1UeXBlID0gJ2ludCcgfCAnZmxvYXQnIHwgJ21hdHJpeCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtPFU+XHJcbntcclxuICAgIGxvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IFVuaWZvcm1UeXBlLCBcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFUpID0+IG51bWJlcltdKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgbG93Q29tcCA9IHR5cGUgPT09ICdtYXRyaXgnID8gMiA6IDFcclxuICAgICAgICBpZiAobnVtQ29tcG9uZW50cyA8IGxvd0NvbXAgfHwgbnVtQ29tcG9uZW50cyA+IDQpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBOdW1iZXIgb2YgY29tcG9uZW50cyBtdXN0IGJlIFske2xvd0NvbXB9Li40XSBmb3IgJHt0eXBlfS5gKVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICBsZXQgdmFsID0gdGhpcy5nZXR0ZXIgKHVuaWZvcm1zKVxyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoIDwgdGhpcy5udW1Db21wb25lbnRzIHx8IHZhbC5sZW5ndGggJSB0aGlzLm51bUNvbXBvbmVudHMgIT09IDApXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnSW52YWxpZCBudW1iZXIgb2YgdW5pZm9ybSBlbGVtZW50cy4nKVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5udW1Db21wb25lbnRzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMml2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgyZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2l2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybURlZjxVPlxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgdW5pZm9ybXM6IFVuaWZvcm08VT5bXSkgeyB9XHJcblxyXG4gICAgaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCh1ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcmcsIHUubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVW5pZm9ybSAnJHt1Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB1LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCAodW5pZiA9PiB1bmlmLnNldFZhbHVlIChnbCwgdW5pZm9ybXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludDxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnaW50JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMyPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDIsIHUgPT4gKDxWZWMyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDMsIHUgPT4gKDxWZWMzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWM0PFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDQsIHUgPT4gKDxWZWM0PnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQyPFUsIEEgZXh0ZW5kcyBFeHRyYWN0PGtleW9mIFUsIHN0cmluZz4+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAyLCB1ID0+ICg8TWF0Mj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MzxVLCBBIGV4dGVuZHMgRXh0cmFjdDxrZXlvZiBVLCBzdHJpbmc+PiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgMywgdSA9PiAoPE1hdDM+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDQ8VSwgQSBleHRlbmRzIEV4dHJhY3Q8a2V5b2YgVSwgc3RyaW5nPj4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDQsIHUgPT4gKDxNYXQ0PnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJleHBvcnQgYWJzdHJhY3QgY2xhc3MgR0xSZXNvdXJjZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCkgeyB9XHJcbiAgICBhYnN0cmFjdCB1c2UgKClcclxuICAgIGFic3RyYWN0IHJlbGVhc2UgKClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nIChyZXNvdXJjZTogR0xSZXNvdXJjZSB8IEdMUmVzb3VyY2VbXSwgXHJcbiAgICBhY3Rpb246IChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSA9PiB2b2lkKVxyXG57XHJcbiAgICBsZXQgcmVzID0gcmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSA/IFxyXG4gICAgICAgIHJlc291cmNlLnBvcCAoKSA6IFxyXG4gICAgICAgIHJlc291cmNlXHJcbiAgICBpZiAoIXJlcylcclxuICAgICAgICByZXR1cm5cclxuICAgIHJlcy51c2UgKClcclxuICAgIHRyeVxyXG4gICAge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ICYmIHJlc291cmNlLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHVzaW5nIChyZXNvdXJjZSwgYWN0aW9uKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYWN0aW9uIChyZXMuZ2wpXHJcbiAgICB9XHJcbiAgICBmaW5hbGx5XHJcbiAgICB7XHJcbiAgICAgICAgcmVzLnJlbGVhc2UgKClcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9HTFJlc291cmNlLnRzIiwiaW1wb3J0IHsgTmV3VmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vTWF0aC9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdGgvTWF0cmljZXNcIjtcclxuaW1wb3J0IHsgbmV3VmVjMiwgbmV3VmVjNCB9IGZyb20gXCIuL01hdGgvQXJyYXlWZWNcIlxyXG5pbXBvcnQgeyBuZXdNYXQ0IH0gZnJvbSBcIi4vTWF0aC9BcnJheU1hdFwiXHJcbmltcG9ydCB7IFNoYWRlclR5cGUsIFNoYWRlciB9IGZyb20gXCIuL0dML1NoYWRlclwiXHJcbmltcG9ydCAqIGFzIFZBdHRyIGZyb20gXCIuL0dML1ZlcnRleEF0dHJcIlxyXG5pbXBvcnQgKiBhcyBVbmlmIGZyb20gXCIuL0dML1VuaWZvcm1zXCJcclxuaW1wb3J0IHsgVmVydGV4QnVmZmVyLCBJbmRleEJ1ZmZlciB9IGZyb20gXCIuL0dML0J1ZmZlcnNcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbSB9IGZyb20gXCIuL0dML1Byb2dyYW1cIlxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS52ZXJ0JylcclxuY29uc3QgZnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLmZyYWcnKVxyXG5cclxuY2xhc3MgU2ltcGxlVmVydGV4IFxyXG57XHJcbiAgICBhVmVydGV4UG9zaXRpb246IFZlYzIgXHJcbn1cclxuXHJcbmNsYXNzIE15VW5pZm9ybXNcclxue1xyXG4gICAgdU1vZGVsVmlld01hdHJpeDogTWF0NFxyXG4gICAgdVByb2plY3Rpb25NYXRyaXg6IE1hdDRcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1NjZW5lKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW06IFByb2dyYW08U2ltcGxlVmVydGV4LCBNeVVuaWZvcm1zPiwgXHJcbiAgICB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8U2ltcGxlVmVydGV4PiwgaWJ1ZmZlcjogSW5kZXhCdWZmZXIsIHVuaWZvcm1zOiBNeVVuaWZvcm1zKSBcclxue1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApOyAgLy8gQ2xlYXIgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG4gICAgZ2wuY2xlYXJEZXB0aCgxLjApOyAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xyXG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpOyAgICAgICAgICAgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcclxuICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpOyAgICAgICAgICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xyXG4gIFxyXG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuICBcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHJcbiAgICBwcm9ncmFtLmRyYXdFbGVtZW50cyAoZ2wuVFJJQU5HTEVfU1RSSVAsIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluICgpXHJcbntcclxuICAgIGxldCB2ZXJ0aWNlczogU2ltcGxlVmVydGV4W10gPSBbXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoMSwgMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgtMSwgMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAtMSkgfSxcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgtMSwgLTEpIH1cclxuICAgIF1cclxuICAgIGxldCBpbmRpY2VzID0gWyAwLCAxLCAyLCAzIF1cclxuICAgIGxldCB1bmlmb3JtczogTXlVbmlmb3JtcyA9IHtcclxuICAgICAgICB1TW9kZWxWaWV3TWF0cml4OiBuZXdNYXQ0LnRyYW5zbGF0aW9uIChbMC4wLCAwLjAsIC00LjBdKSxcclxuICAgICAgICB1UHJvamVjdGlvbk1hdHJpeDogbmV3TWF0NC5wZXJzcGVjdGl2ZSAoLTEsIDEsIC0xLCAxLCAxLCAxMDApXHJcbiAgICB9XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNnbENhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIC8vIEluaXRpYWxpemUgdGhlIEdMIGNvbnRleHRcclxuICAgIGxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcblxyXG4gICAgLy8gT25seSBjb250aW51ZSBpZiBXZWJHTCBpcyBhdmFpbGFibGUgYW5kIHdvcmtpbmdcclxuICAgIGlmICghZ2wpIHtcclxuICAgICAgICBhbGVydChcIlVuYWJsZSB0byBpbml0aWFsaXplIFdlYkdMLiBZb3VyIGJyb3dzZXIgb3IgbWFjaGluZSBtYXkgbm90IHN1cHBvcnQgaXQuXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCB2ZXJ0U2hhZGVyID0gbmV3IFNoYWRlciAoZ2wsICd2ZXJ0ZXgnLCB2c1NvdXJjZSlcclxuICAgIGxldCBmcmFnU2hhZGVyID0gbmV3IFNoYWRlciAoZ2wsICdmcmFnbWVudCcsIGZzU291cmNlKVxyXG5cclxuICAgIGxldCBwcm9ncmFtID0gbmV3IFByb2dyYW08U2ltcGxlVmVydGV4LCBNeVVuaWZvcm1zPiAoZ2wsXHJcbiAgICAgICAgWyB2ZXJ0U2hhZGVyLCBmcmFnU2hhZGVyIF0sXHJcbiAgICAgICAgWyBWQXR0ci52ZWMyICgnYVZlcnRleFBvc2l0aW9uJykgXSxcclxuICAgICAgICBbIFVuaWYubWF0NCAoJ3VNb2RlbFZpZXdNYXRyaXgnKSwgVW5pZi5tYXQ0ICgndVByb2plY3Rpb25NYXRyaXgnKSBdKVxyXG5cclxuICAgIGxldCB2YnVmZmVyID0gbmV3IFZlcnRleEJ1ZmZlciAoZ2wsIHByb2dyYW0udmVydGV4RGVmLCB2ZXJ0aWNlcylcclxuICAgIGxldCBpYnVmZmVyID0gbmV3IEluZGV4QnVmZmVyIChnbCwgaW5kaWNlcylcclxuXHJcbiAgICBkcmF3U2NlbmUgKGdsLCBwcm9ncmFtLCB2YnVmZmVyLCBpYnVmZmVyLCB1bmlmb3JtcylcclxufVxyXG5cclxubWFpbiAoKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9UZXN0LnRzIiwiaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgeyBEaW0sIFZlYywgVmVjMiwgVmVjMywgVmVjNCwgTmV3VmVjIH0gZnJvbSBcIi4vVmVjdG9yc1wiXHJcbmltcG9ydCAqIGFzIEFycmF5RXh0IGZyb20gXCIuLi9Db21tb24vQXJyYXlFeHRcIlxyXG5cclxuY2xhc3MgTmV3QXJyYXlWZWMgaW1wbGVtZW50cyBOZXdWZWM8VmVjMj4sIE5ld1ZlYzxWZWMzPiwgTmV3VmVjPFZlYzQ+XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBkaW1lbnNpb25zOiBudW1iZXIpIHsgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUV4dC5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCAwKSlcclxuICAgIH1cclxuXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUV4dC5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh2YWx1ZXMpXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoIDwgdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChhcnJheS5zbGljZSAoMCwgdGhpcy5kaW1lbnNpb25zKSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzI6IE5ld1ZlYzxWZWMyPiA9IG5ldyBOZXdBcnJheVZlYyAoMilcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzM6IE5ld1ZlYzxWZWMzPiA9IG5ldyBOZXdBcnJheVZlYyAoMylcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzQ6IE5ld1ZlYzxWZWM0PiA9IG5ldyBOZXdBcnJheVZlYyAoNClcclxuXHJcbmNsYXNzIEFycmF5VmVjIGltcGxlbWVudHMgVmVjMiwgVmVjMywgVmVjNFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBhcnJheTogbnVtYmVyW10pIHsgfVxyXG5cclxuICAgIGdldCBkaW1lbnNpb25zICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICB3aXRoIChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoKHYsIGksIGEpID0+IGkgPT0gaW5kZXggPyB2YWx1ZSA6IHYpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB4ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueF0gfVxyXG4gICAgc2V0IHggKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueF0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHkgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS55XSB9XHJcbiAgICBzZXQgeSAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS55XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeiAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnpdIH1cclxuICAgIHNldCB6ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnpdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB3ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ud10gfVxyXG4gICAgc2V0IHcgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ud10gPSB2YWx1ZSB9XHJcbiAgICBcclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgQXJyYXkgKGNvb3Jkcy5sZW5ndGgpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuYXJyYXlbY29vcmRzW2ldXVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKHYgPT4gb3BlciAodikpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheVZlYywgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgKHYsIGkpID0+IG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVkdWNlIChvcGVyOiAoYWNjOiBudW1iZXIsIHg6IG51bWJlcikgPT4gbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlICgoYywgdikgPT4gb3BlciAoYywgdiksIDApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgbGVuU3FyICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UgKChhLCB4KSA9PiBhICsgKHggKiB4KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0ICh0aGlzLmxlblNxcilcclxuICAgIH1cclxuXHJcbiAgICBpbnYgKCkgOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiAteClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggKyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBzdWIgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAtIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAtIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG11bCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4ICogeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgZGl2IChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBub3JtICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5sZW5cclxuICAgICAgICBpZiAobCA9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBub3JtYWxpemUgemVybyB2ZWN0b3JcIilcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4geCAvIGwpXHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlWZWMpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlWZWMsIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvdCAob3RoZXI6IEFycmF5VmVjKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGM6IG51bWJlciwgdjogbnVtYmVyLCBpOiBudW1iZXIsIGE6IG51bWJlcltdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYyArICh2ICogb3RoZXIuYXJyYXlbaV0pIFxyXG4gICAgICAgICAgICB9LCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKFtcclxuICAgICAgICAgICAgdGhpcy55ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLnksXHJcbiAgICAgICAgICAgIHRoaXMueiAqIG90aGVyLnggLSB0aGlzLnggKiBvdGhlci56LFxyXG4gICAgICAgICAgICB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueF0pXHRcdFxyXG4gICAgfVxyXG5cclxuICAgIGFicyAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguYWJzKVxyXG4gICAgfVxyXG5cclxuICAgIGZsb29yICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5mbG9vcilcclxuICAgIH1cclxuXHJcbiAgICBjZWlsICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5jZWlsKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdW5kICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5yb3VuZClcclxuICAgIH1cclxuXHJcbiAgICBmcmFjdCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKEZNYXRoLmZyYWN0KVxyXG4gICAgfVxyXG5cclxuICAgIG1pbiAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgTWF0aC5taW4pXHJcbiAgICB9XHJcblxyXG4gICAgbWF4IChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCBNYXRoLm1heClcclxuICAgIH1cclxuXHJcbiAgICBjbGFtcCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguY2xhbXAgKHgsIG1pbiwgbWF4KSlcclxuICAgIH1cclxuXHJcbiAgICBtaXggKG90aGVyOiBBcnJheVZlYywgaW50ZXJQb3M6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiBGTWF0aC5taXggKHgsIHksIGludGVyUG9zKSlcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zdGVwIChlZGdlLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zbW9vdGhTdGVwIChlZGdlTG93ZXIsIGVkZ2VVcHBlciwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMuYXJyYXkuam9pbiAoXCIgXCIpICsgXCJdXCJcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5ICh0aGlzLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIG5ld1ZlYyAoKTogTmV3QXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IE5ld0FycmF5VmVjICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICB9XHJcblxyXG4gICAgdG9WZWMyICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpKVxyXG4gICAgfVxyXG5cclxuICAgIHRvVmVjMyAoejogbnVtYmVyID0gMCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHpdKVxyXG4gICAgICAgICAgICBjYXNlIDQ6IG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5zbGljZSAoMCwgMykpXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGNvbnZlcnNpb24uXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvVmVjNCAoejogbnVtYmVyID0gMCwgdzogbnVtYmVyID0gMCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHosIHddKVxyXG4gICAgICAgICAgICBjYXNlIDM6IG5ldyBBcnJheVZlYyAoWy4uLnRoaXMuYXJyYXksIHddKVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheVZlYy50cyIsImltcG9ydCB7IEVxdWF0YWJsZSB9IGZyb20gXCIuLi9Db21tb24vRXF1YXRhYmxlXCI7XHJcblxyXG4vKipcclxuICogRW51bWVyYXRpb24gdGhhdCBkZWZpbmVzIHRoZSBjb29yZGluYXRlIGRpbWVuc2lvbnMgdXNlZCBpbiB0aGUgdmVjdG9yIHR5cGVzLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gRGltIFxyXG57XHJcbiAgICB4ID0gMCxcclxuICAgIHkgPSAxLCBcclxuICAgIHogPSAyLFxyXG4gICAgdyA9IDNcclxufVxyXG5cclxuLyoqIFxyXG4gKiBCYXNlIGludGVyZmFjZSBmb3IgYWxsIHZlY3RvcnkgdHlwZXMuIERlZmluZXMgbWV0aG9kcyB0aGF0IGhhdmUgdGhlIHNhbWUgc2lnbmF0dXJlXHJcbiAqIGluIGFsbCB2ZWN0b3IgdmFyaWFudHMuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzxWIGV4dGVuZHMgVmVjPFY+PiBleHRlbmRzIEVxdWF0YWJsZTxWPlxyXG57XHJcbiAgICAvKipcclxuICAgICAqIE51bWJlciBkaW1lbnNpb25zIGluIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlclxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gb25lIG9yIG1vcmUgY29tcG9uZW50cyBvZiB0aGUgdmVjdG9yIGluIGFyYml0cmFyeSBvcmRlci4gVGhlIGNvbXBvbmVudHNcclxuICAgICAqIHJldHVybmVkIGRlcGVuZCBvbiB0aGUgZGltZW5zaW9ucyBzcGVjaWZpZWQgaW4gdGhlIGNvb3JkcyBhcmd1bWVudC4gTm90ZSB0aGF0XHJcbiAgICAgKiB0aGUgc2FtZSBjb21wb25lbnQgY2FuIG9jY3VyIG11bHRpcGxlIHRpbWVzIGluIGNvb3Jkcy4gU28sIGl0IGlzIHZhbGlkIHRvIGNhbGxcclxuICAgICAqIHRoZSBmdW5jdGlvbiBsaWtlIHRoaXM6XHJcbiAgICAgKiBcclxuICAgICAqIHN3aXp6bGUgKFtEaW0ueCwgRGltLngsIERpbS55XSlcclxuICAgICAqL1xyXG4gICAgc3dpenpsZSAoY29vcmRzOiBEaW1bXSk6IG51bWJlcltdXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBsZW5naHQgb2YgdGhlIHZlY3RvciBzcXVhcmVkLiBGYXN0ZXIgdG8gY2FsY3VsYXRlIHRoYW4gdGhlIGFjdHVhbCBsZW5ndGgsXHJcbiAgICAgKiBhbmQgdXNlZnVsIGZvciBjb21wYXJpbmcgdmVjdG9yIG1hZ25pdHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlblNxcjogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIExlbmd0aCBvZiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBsZW46IG51bWJlclxyXG5cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IFZcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yLiBGb3JtYXR0ZWQgbGlrZSB0aGlzOiBbeCB5IHpdXHJcbiAgICAgKi9cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICBuZXdWZWMgKCk6IE5ld1ZlYzxWPlxyXG4gICAgXHJcbiAgICBpbnYgKCk6IFZcclxuICAgIGFkZCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBzdWIgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbXVsIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIGRpdiAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBub3JtICgpOiBWXHJcbiAgICBhcHByb3hFcXVhbHMgKG90aGVyOiBWLCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAgZG90IChvdGhlcjogVik6IG51bWJlclxyXG4gICAgYWJzICgpOiBWXHJcbiAgICBmbG9vciAoKTogVlxyXG4gICAgY2VpbCAoKTogVlxyXG4gICAgcm91bmQgKCk6IFZcclxuICAgIGZyYWN0ICgpOiBWXHJcbiAgICBtaW4gKG90aGVyOiBWKSA6IFZcclxuICAgIG1heCAob3RoZXI6IFYpIDogVlxyXG4gICAgY2xhbXAgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IFZcclxuICAgIG1peCAob3RoZXI6IFYsIGludGVyUG9zOiBudW1iZXIpOiBWXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBWXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV3VmVjPFYgZXh0ZW5kcyBWZWM8Vj4+XHJcbntcclxuICAgIHJlYWRvbmx5IGRpbWVuc2lvbnM6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgemVybzogVlxyXG4gICAgdW5pZiAoeDogbnVtYmVyKTogVlxyXG4gICAgaW5pdCAoLi4udmFsdWVzOiBudW1iZXJbXSk6IFZcclxuICAgIGZyb21BcnJheSAoYXJyYXk6IG51bWJlcltdKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzIgZXh0ZW5kcyBWZWM8VmVjMj5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHRvVmVjMyAoejogbnVtYmVyKTogVmVjM1xyXG4gICAgdG9WZWM0ICh6OiBudW1iZXIsIHc6IG51bWJlcik6IFZlYzRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWMzIGV4dGVuZHMgVmVjPFZlYzM+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuXHJcbiAgICB0b1ZlYzIgKCk6IFZlYzJcclxuICAgIHRvVmVjNCAodzogbnVtYmVyKTogVmVjNFxyXG4gICAgY3Jvc3MgKG90aGVyOiBWZWMzKTogVmVjM1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzQgZXh0ZW5kcyBWZWM8VmVjND5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcblxyXG4gICAgdG9WZWMyICgpOiBWZWMyXHJcbiAgICB0b1ZlYzMgKCk6IFZlYzNcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL1ZlY3RvcnMudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTmV3TWF0NCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcbmltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4uL0NvbW1vbi9BcnJheUV4dFwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlNYXQgaW1wbGVtZW50cyBOZXdNYXQ8TWF0Mj4sIE5ld01hdDxNYXQzPiwgTmV3TWF0NFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByb3dzOiBudW1iZXIsIHJlYWRvbmx5IGNvbHM6IG51bWJlcikgeyB9XHJcblxyXG4gICAgcHJpdmF0ZSBpZGVudGl0eUFycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+IChyICogYyksIDApXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbiAociwgYyk7IGkrKykgXHJcbiAgICAgICAgICAgIGFycltpICogciArIGldID0gMVxyXG4gICAgICAgIHJldHVybiBhcnJcclxuICAgIH1cclxuXHJcbiAgICBnZXQgemVybyAoKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoQXJyYXlIZWxwZXIuZmlsbCAoQXJyYXk8bnVtYmVyPihyICogYyksIDApLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpZGVudGl0eSAoKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5pZGVudGl0eUFycmF5ICgpLCB0aGlzLnJvd3MsIHRoaXMuY29scylcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGlvbiAob2Zmc2V0czogbnVtYmVyW10pOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IGxhc3RDb2wgPSBjIC0gMVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKG9mZnNldHMubGVuZ3RoLCByIC0gMSk7IGkrKylcclxuICAgICAgICAgICAgcmVzIFtsYXN0Q29sICogciArIGldID0gb2Zmc2V0c1tpXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBzY2FsaW5nIChmYWN0b3JzOiBudW1iZXJbXSk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChmYWN0b3JzLmxlbmd0aCwgciwgYyk7IGkrKylcclxuICAgICAgICAgICAgcmVzIFtpICogciArIGldID0gZmFjdG9yc1tpXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblggKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBpZiAociA8IDMgfHwgYyA8IDMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBSb3RhdGlvbiBhcm91bmQgWC1heGlzIG5vdCBkZWZpbmVkIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1tyICsgMV0gPSBjb3NhXHJcbiAgICAgICAgcmVzW3IgKyAyXSA9IHNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAxXSA9IC1zaW5hXHJcbiAgICAgICAgcmVzWzIgKiByICsgMl0gPSBjb3NhXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWSAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBZLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzWzBdID0gY29zYTtcclxuICAgICAgICByZXNbMl0gPSAtc2luYTtcclxuICAgICAgICByZXNbMiAqIHJdID0gc2luYTtcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2E7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWiAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1sxXSA9IHNpbmE7XHJcbiAgICAgICAgcmVzW3JdID0gLXNpbmE7XHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2E7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHBlcnNwZWN0aXZlIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHpOZWFyIDw9IDAgfHwgek5lYXIgPj0gekZhcilcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJ6TmVhciBuZWVkcyB0byBiZSBwb3NpdGl2ZSBhbmQgc21hbGxlciB0aGF0biB6RmFyXCIpXHJcbiAgICAgICAgbGV0IHdpZHRoID0gcmlnaHQgLSBsZWZ0XHJcbiAgICAgICAgbGV0IGhlaWdodCA9IHRvcCAtIGJvdHRvbVxyXG4gICAgICAgIGxldCBkZXB0aCA9IHpGYXIgLSB6TmVhclxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbKDIuMCAqIHpOZWFyKSAvIHdpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAoMi4wICogek5lYXIpIC8gaGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAocmlnaHQgKyBsZWZ0KSAvIHdpZHRoLCAodG9wICsgYm90dG9tKSAvIGhlaWdodCwgLSh6RmFyICsgek5lYXIpIC8gZGVwdGgsIC0xLFxyXG4gICAgICAgICAgICAwLCAwLCAtKDIuMCAqIHpGYXIgKiB6TmVhcikgLyBkZXB0aCwgMF0sIFxyXG4gICAgICAgICAgICA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIG9ydGhvZ3JhcGhpYyAobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsXHJcbiAgICAgICAgek5lYXI6IG51bWJlciwgekZhcjogbnVtYmVyKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCBpbnZXaWR0aCA9IDEuMCAvIChyaWdodCAtIGxlZnQpXHJcbiAgICAgICAgbGV0IGludkhlaWdodCA9IDEuMCAvICh0b3AgLSBib3R0b20pXHJcbiAgICAgICAgbGV0IGludkRlcHRoID0gMS4wIC8gKHpGYXIgLSB6TmVhcilcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgWzIgKiBpbnZXaWR0aCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMiAqIGludkhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgMCwgLTIgKiBpbnZEZXB0aCwgMCxcclxuICAgICAgICAgICAgLShyaWdodCArIGxlZnQpICogaW52V2lkdGgsIC0odG9wICsgYm90dG9tKSAqIGludkhlaWdodCwgLSh6RmFyICsgek5lYXIpICogaW52RGVwdGgsIDFdLFxyXG4gICAgICAgICAgICA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIGxvb2tBdCAoZGlyZWN0aW9uOiBWZWMzLCB1cDogVmVjMyk6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgemF4aXMgPSBkaXJlY3Rpb24uaW52ICgpLm5vcm0gKClcclxuICAgICAgICBsZXQgeGF4aXMgPSB1cC5jcm9zcyAoemF4aXMpLm5vcm0gKClcclxuICAgICAgICBsZXQgeWF4aXMgPSB6YXhpcy5jcm9zcyAoeGF4aXMpXHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbeGF4aXMueCwgeWF4aXMueCwgemF4aXMueCwgMCxcclxuICAgICAgICAgICAgeGF4aXMueSwgeWF4aXMueSwgemF4aXMueSwgMCxcclxuICAgICAgICAgICAgeGF4aXMueiwgeWF4aXMueiwgemF4aXMueiwgMCxcclxuICAgICAgICAgICAgMCwgMCwgMCwgMV0sIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10sIHJvd3M6IG51bWJlciwgY29sczogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKGFycmF5LCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbmV3TWF0MjogTmV3TWF0PE1hdDI+ID0gbmV3IE5ld0FycmF5TWF0ICgyLCAyKVxyXG5leHBvcnQgY29uc3QgbmV3TWF0MzogTmV3TWF0PE1hdDM+ID0gbmV3IE5ld0FycmF5TWF0ICgzLCAzKVxyXG5leHBvcnQgY29uc3QgbmV3TWF0NDogTmV3TWF0NCA9IG5ldyBOZXdBcnJheU1hdCAoNCwgNClcclxuXHJcbmNsYXNzIEFycmF5TWF0IGltcGxlbWVudHMgTWF0MiwgTWF0MywgTWF0NFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgYXJyYXk6IG51bWJlcltdLCByZWFkb25seSByb3dzOiBudW1iZXIsIHJlYWRvbmx5IGNvbHM6IG51bWJlcikgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKGFycmF5Lmxlbmd0aCAhPT0gcm93cyAqY29scylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJBcnJheSBsZW5ndGggaGFzIHRvIGJlIGVxdWFsIHRvIHJvd3MgKiBjb2x1bW5zLlwiKSBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAodmVjOiBWKTogVlxyXG4gICAge1xyXG4gICAgICAgIGxldCBhcnIgPSBbLi4udmVjLnRvQXJyYXkgKCksIDEsIDFdLnNsaWNlICgwLCB0aGlzLmNvbHMpXHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKGFyciwgdGhpcy5jb2xzLCAxKVxyXG4gICAgICAgIHJldHVybiB2ZWMubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9NYXQyICgpOiBNYXQyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpLCAgXHJcbiAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICh0aGlzLnJvd3MsIHRoaXMucm93cyArIDIpICBcclxuICAgICAgICAgICAgXSwgMiwgMilcclxuICAgIH1cclxuXHJcbiAgICB0b01hdDMgKCk6IE1hdDNcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucm93cykgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDIpLCAwLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMiwgNCksIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSAgXHJcbiAgICAgICAgICAgICAgICBdLCAzLCAzKVxyXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDAsIDMpLCAgXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoNCwgNyksICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICg4LCAxMSkgIFxyXG4gICAgICAgICAgICAgICAgXSwgMywgMylcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgY29udmVyc2lvbi5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9NYXQ0ICgpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnJvd3MpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgwLCAyKSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgyLCA0KSwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsIDAsIDEgICBcclxuICAgICAgICAgICAgICAgIF0sIDQsIDQpXHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5hcnJheS5zbGljZSAoMCwgMyksIDAsICBcclxuICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFycmF5LnNsaWNlICgzLCA3KSwgMCwgIFxyXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuYXJyYXkuc2xpY2UgKDcsIDEwKSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAwLCAxICAgXHJcbiAgICAgICAgICAgICAgICBdLCA0LCA0KVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBjb252ZXJzaW9uLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9NYXRoL0FycmF5TWF0LnRzIiwiZXhwb3J0IHR5cGUgU2hhZGVyVHlwZSA9ICd2ZXJ0ZXgnIHwgJ2ZyYWdtZW50J1xyXG5cclxuZXhwb3J0IGNsYXNzIFNoYWRlclxyXG57XHJcbiAgICByZWFkb25seSBnbFNoYWRlcjogV2ViR0xTaGFkZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCByZWFkb25seSB0eXBlOiBTaGFkZXJUeXBlLCBzb3VyY2U6IHN0cmluZylcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsID0gZ2xcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICAgICAgbGV0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0aGlzLmdsU2hhZGVyVHlwZSk7XHJcbiAgICAgICAgaWYgKHNoYWRlciA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBGYWlsZWQgdG8gY3JlYXRlICR7dHlwZX0gc2hhZGVyLmApXHJcbiAgICAgICAgXHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGVycm9yID0gJ0FuIGVycm9yIG9jY3VycmVkIGNvbXBpbGluZyB0aGUgc2hhZGVyczogJyArIGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKVxyXG4gICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2xTaGFkZXIgPSBzaGFkZXJcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZ2xTaGFkZXJUeXBlICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSAndmVydGV4JyA/IFxyXG4gICAgICAgICAgICB0aGlzLmdsLlZFUlRFWF9TSEFERVIgOiBcclxuICAgICAgICAgICAgdGhpcy5nbC5GUkFHTUVOVF9TSEFERVJcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9TaGFkZXIudHMiLCJpbXBvcnQgeyBHTFJlc291cmNlLCB1c2luZyB9IGZyb20gXCIuL0dMUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4QXR0clR5cGUsIFZlcnRleERlZiB9IGZyb20gXCIuL1ZlcnRleEF0dHJcIlxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJ1ZmZlciBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHJlYWRvbmx5IHRhcmdldDogbnVtYmVyLFxyXG4gICAgICAgIHJlYWRvbmx5IGdsQnVmZmVyOiBXZWJHTEJ1ZmZlciwgcmVhZG9ubHkgbGVuZ3RoOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIgKGdsKVxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIHRoaXMuZ2xCdWZmZXIpXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIG51bGwpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhCdWZmZXI8Vj4gZXh0ZW5kcyBCdWZmZXIgXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSlcclxuICAgIHtcclxuICAgICAgICBsZXQgYnVmID0gZ2wuY3JlYXRlQnVmZmVyICgpXHJcbiAgICAgICAgaWYgKGJ1ZiA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdGYWlsZWQgdG8gY3JlYXRlIHZlcnRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkFSUkFZX0JVRkZFUiwgYnVmLCB2ZXJ0aWNlcy5sZW5ndGgpXHJcbiAgICAgICAgdXNpbmcgKHRoaXMsICgpID0+IFxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhIChnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdEJ1ZmZlciAodmVydGV4RGVmLCB2ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRCdWZmZXIgKHZlcnRleERlZjogVmVydGV4RGVmPFY+LCB2ZXJ0aWNlczogVltdKTogQXJyYXlCdWZmZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgdmVydGV4U2l6ZSA9IHZlcnRleERlZi5zdHJpZGVcclxuICAgICAgICBsZXQgbGVuID0gdmVydGljZXMubGVuZ3RoXHJcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlciAodmVydGV4U2l6ZSAqIGxlbilcclxuICAgICAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyAoYnVmZmVyKVxyXG4gICAgICAgIHZlcnRleERlZi52ZXJ0ZXhBdHRycy5mb3JFYWNoIChhdHRyID0+IFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIHZhciBzZXR0ZXIgPSB0aGlzLnZlcnRleEF0dHJTZXR0ZXIgKHZpZXcsIGF0dHIudHlwZSlcclxuICAgICAgICAgICAgbGV0IHR5cGVTaXplID0gYXR0ci50eXBlU2l6ZVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXR0ci5nZXR0ZXIgKHZlcnRpY2VzW2pdKVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhdHRyLm51bUNvbXBvbmVudHM7IGsrKylcclxuICAgICAgICAgICAgICAgICAgICBzZXR0ZXIgKChqICogdmVydGV4U2l6ZSkgKyBhdHRyLm9mZnNldCArIChrICogdHlwZVNpemUpLCB2YWx1ZXNba10pIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYnVmZmVyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3OiBEYXRhVmlldywgdHlwZTogVmVydGV4QXR0clR5cGUpOiBcclxuICAgICAgICAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IHZvaWRcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRVaW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRJbnQxNiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDE2IChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEZsb2F0MzIgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4QnVmZmVyIGV4dGVuZHMgQnVmZmVyXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBpbmRpY2VzOiBudW1iZXJbXSlcclxuICAgIHtcclxuICAgICAgICBsZXQgYnVmID0gZ2wuY3JlYXRlQnVmZmVyICgpXHJcbiAgICAgICAgaWYgKGJ1ZiA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdGYWlsZWQgdG8gY3JlYXRlIGluZGV4IGJ1ZmZlci4nKVxyXG4gICAgICAgIHN1cGVyIChnbCwgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZiwgaW5kaWNlcy5sZW5ndGgpXHJcbiAgICAgICAgdXNpbmcgKHRoaXMsICgpID0+IFxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhIChnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5IChpbmRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML0J1ZmZlcnMudHMiLCJpbXBvcnQgeyBTaGFkZXJUeXBlLCBTaGFkZXIgfSBmcm9tIFwiLi9TaGFkZXJcIlxyXG5pbXBvcnQgeyBWZXJ0ZXhBdHRyLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuaW1wb3J0IHsgVW5pZm9ybSwgVW5pZm9ybURlZiB9IGZyb20gXCIuL1VuaWZvcm1zXCJcclxuaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCJcclxuaW1wb3J0IHsgVmVydGV4QnVmZmVyLCBJbmRleEJ1ZmZlciB9IGZyb20gXCIuL0J1ZmZlcnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9ncmFtPFYsIFU+IGV4dGVuZHMgR0xSZXNvdXJjZVxyXG57XHJcbiAgICByZWFkb25seSBnbFByb2dyYW06IFdlYkdMUHJvZ3JhbVxyXG4gICAgcmVhZG9ubHkgc2hhZGVyczogU2hhZGVyW11cclxuICAgIHJlYWRvbmx5IHZlcnRleERlZjogVmVydGV4RGVmPFY+XHJcbiAgICByZWFkb25seSB1bmlmb3JtRGVmOiBVbmlmb3JtRGVmPFU+XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIFxyXG4gICAgICAgIHNoYWRlcnM6IFNoYWRlcltdLCBcclxuICAgICAgICB2ZXJ0ZXhBdHRyczogVmVydGV4QXR0cjxWPltdLFxyXG4gICAgICAgIHVuaWZvcm1zOiBVbmlmb3JtPFU+W10pIFxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyIChnbClcclxuICAgICAgICB0aGlzLnNoYWRlcnMgPSBzaGFkZXJzXHJcbiAgICAgICAgdGhpcy5nbFByb2dyYW0gPSB0aGlzLmxpbmsgKClcclxuICAgICAgICB0aGlzLnZlcnRleERlZiA9IG5ldyBWZXJ0ZXhEZWYgKHZlcnRleEF0dHJzKVxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmLmluaXRWZXJ0ZXhBdHRyTG9jYXRpb25zIChnbCwgdGhpcy5nbFByb2dyYW0pXHJcbiAgICAgICAgdGhpcy51bmlmb3JtRGVmID0gbmV3IFVuaWZvcm1EZWYgKHVuaWZvcm1zKVxyXG4gICAgICAgIHRoaXMudW5pZm9ybURlZi5pbml0VW5pZm9ybUxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbGluayAoKTogV2ViR0xQcm9ncmFtXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxyXG4gICAgICAgIGxldCBwcmcgPSBnbC5jcmVhdGVQcm9ncmFtKClcclxuICAgICAgICBpZiAocHJnID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoXCJGYWlsZWQgdG8gY3JlYXRlIHByb2dyYW1cIilcclxuICAgICAgICB0aGlzLnNoYWRlcnMuZm9yRWFjaChzID0+IGdsLmF0dGFjaFNoYWRlcihwcmcsIHMuZ2xTaGFkZXIpKVxyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByZyk7XHJcbiAgICAgIFxyXG4gICAgICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcmcsIGdsLkxJTktfU1RBVFVTKSkgXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnVW5hYmxlIHRvIGluaXRpYWxpemUgdGhlIHNoYWRlciBwcm9ncmFtOiAnICsgXHJcbiAgICAgICAgICAgICAgICBnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcmcpKVxyXG4gICAgICAgIHJldHVybiBwcmdcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGVuYWJsZVZlcnRleEF0dHJBcnJheXMgKClcclxuICAgIHtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYudmVydGV4QXR0cnMuZm9yRWFjaCAoYXR0ciA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihcclxuICAgICAgICAgICAgICAgIGF0dHIubG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBhdHRyLm51bUNvbXBvbmVudHMsXHJcbiAgICAgICAgICAgICAgICBhdHRyLmdsVHlwZSAoZ2wpLFxyXG4gICAgICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRleERlZi5zdHJpZGUsXHJcbiAgICAgICAgICAgICAgICBhdHRyLm9mZnNldCk7XHJcbiAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dHIubG9jYXRpb24pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtICh0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtIChudWxsKVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdFbGVtZW50cyAobW9kZTogbnVtYmVyLCB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8Vj4sIGlidWZmZXI6IEluZGV4QnVmZmVyLCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICB1c2luZyAoW3RoaXMsIHZidWZmZXIsIGlidWZmZXJdLCBnbCA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtRGVmLnNldFZhbHVlcyAoZ2wsIHVuaWZvcm1zKVxyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVZlcnRleEF0dHJBcnJheXMgKClcclxuICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzIChtb2RlLCBpYnVmZmVyLmxlbmd0aCwgZ2wuVU5TSUdORURfU0hPUlQsIDApXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9Qcm9ncmFtLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIiBhdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxyXFxuIHZhcnlpbmcgaGlnaHAgdmVjMyBwb3NpdGlvbjtcXHJcXG4gXFxyXFxuIHVuaWZvcm0gbWF0NCB1TW9kZWxWaWV3TWF0cml4O1xcclxcbiB1bmlmb3JtIG1hdDQgdVByb2plY3Rpb25NYXRyaXg7XFxyXFxuXFxyXFxudm9pZCBtYWluKCkge1xcclxcbiAgICB2ZWM0IHBvcyA9IHZlYzQgKGFWZXJ0ZXhQb3NpdGlvbiwgMCwgMSk7XFxyXFxuICAgIHBvc2l0aW9uID0gbWF4KHBvcy54eXosIHZlYzMoMCkpO1xcclxcbiAgICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdU1vZGVsVmlld01hdHJpeCAqIHBvcztcXHJcXG4gfVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUudmVydFxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcInZhcnlpbmcgaGlnaHAgdmVjMyBwb3NpdGlvbjtcXHJcXG5cXHJcXG52b2lkIG1haW4oKSB7IFxcclxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHBvc2l0aW9uLCAxLjApO1xcclxcbn1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLmZyYWdcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=