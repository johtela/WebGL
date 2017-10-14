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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr = (function () {
    function VertexAttr(name, type, numComponents, getter) {
        this.name = name;
        this.type = type;
        this.numComponents = numComponents;
        this.getter = getter;
    }
    Object.defineProperty(VertexAttr.prototype, "typeSize", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VertexAttr.prototype, "sizeInBytes", {
        get: function () {
            return Math.ceil(this.typeSize * this.numComponents / 4) * 4;
        },
        enumerable: true,
        configurable: true
    });
    VertexAttr.prototype.glType = function (gl) {
        switch (this.type) {
            case 'byte': return gl.BYTE;
            case 'ubyte': return gl.UNSIGNED_BYTE;
            case 'short': return gl.SHORT;
            case 'ushort': return gl.UNSIGNED_SHORT;
            case 'float': return gl.FLOAT;
            default: throw Error("Unsupported attribute type.");
        }
    };
    return VertexAttr;
}());
exports.VertexAttr = VertexAttr;
var VertexDef = (function () {
    function VertexDef(vertexAttrs) {
        this.vertexAttrs = vertexAttrs;
        this.stride = this.initVertexAttrOffsets();
    }
    VertexDef.prototype.initVertexAttrOffsets = function () {
        var offset = 0;
        this.vertexAttrs.forEach(function (v) {
            v.offset = offset;
            offset += v.sizeInBytes;
        });
        return offset;
    };
    VertexDef.prototype.initVertexAttrLocations = function (gl, prg) {
        this.vertexAttrs.forEach(function (v) {
            var loc = gl.getAttribLocation(prg, v.name);
            if (loc < 0)
                throw Error("Vertex attribute '" + v.name + "' not found in program.");
            v.location = loc;
        });
    };
    return VertexDef;
}());
exports.VertexDef = VertexDef;
function byte(name) {
    return new VertexAttr(name, 'byte', 1, function (v) { return [v[name]]; });
}
exports.byte = byte;
function ubyte(name) {
    return new VertexAttr(name, 'ubyte', 1, function (v) { return [v[name]]; });
}
exports.ubyte = ubyte;
function short(name) {
    return new VertexAttr(name, 'short', 1, function (v) { return [v[name]]; });
}
exports.short = short;
function ushort(name) {
    return new VertexAttr(name, 'ushort', 1, function (v) { return [v[name]]; });
}
exports.ushort = ushort;
function float(name) {
    return new VertexAttr(name, 'float', 1, function (v) { return [v[name]]; });
}
exports.float = float;
function vec2(name) {
    return new VertexAttr(name, 'float', 2, function (v) { return v[name].toArray(); });
}
exports.vec2 = vec2;
function vec3(name) {
    return new VertexAttr(name, 'float', 3, function (v) { return v[name].toArray(); });
}
exports.vec3 = vec3;
function vec4(name) {
    return new VertexAttr(name, 'float', 4, function (v) { return v[name].toArray(); });
}
exports.vec4 = vec4;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Uniform = (function () {
    function Uniform(name, type, numComponents, getter) {
        this.name = name;
        this.type = type;
        this.numComponents = numComponents;
        this.getter = getter;
        var lowComp = type === 'matrix' ? 2 : 1;
        if (numComponents < lowComp || numComponents > 4)
            throw RangeError("Number of components must be [" + lowComp + "..4] for " + type + ".");
    }
    Uniform.prototype.setValue = function (gl, uniforms) {
        var val = this.getter(uniforms);
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
    };
    return Uniform;
}());
exports.Uniform = Uniform;
var UniformDef = (function () {
    function UniformDef(uniforms) {
        this.uniforms = uniforms;
    }
    UniformDef.prototype.initUniformLocations = function (gl, prg) {
        this.uniforms.forEach(function (u) {
            var loc = gl.getUniformLocation(prg, u.name);
            if (loc === null)
                throw Error("Uniform '" + u.name + "' not found in program.");
            u.location = loc;
        });
    };
    UniformDef.prototype.setValues = function (gl, uniforms) {
        this.uniforms.forEach(function (unif) { return unif.setValue(gl, uniforms); });
    };
    return UniformDef;
}());
exports.UniformDef = UniformDef;
function int(name) {
    return new Uniform(name, 'int', 1, function (u) { return [u[name]]; });
}
exports.int = int;
function float(name) {
    return new Uniform(name, 'float', 1, function (u) { return [u[name]]; });
}
exports.float = float;
function vec2(name) {
    return new Uniform(name, 'float', 2, function (u) { return u[name].toArray(); });
}
exports.vec2 = vec2;
function vec3(name) {
    return new Uniform(name, 'float', 3, function (u) { return u[name].toArray(); });
}
exports.vec3 = vec3;
function vec4(name) {
    return new Uniform(name, 'float', 4, function (u) { return u[name].toArray(); });
}
exports.vec4 = vec4;
function mat2(name) {
    return new Uniform(name, 'matrix', 2, function (u) { return u[name].toArray(); });
}
exports.mat2 = mat2;
function mat3(name) {
    return new Uniform(name, 'matrix', 3, function (u) { return u[name].toArray(); });
}
exports.mat3 = mat3;
function mat4(name) {
    return new Uniform(name, 'matrix', 4, function (u) { return u[name].toArray(); });
}
exports.mat4 = mat4;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GLResource = (function () {
    function GLResource(gl) {
        this.gl = gl;
    }
    return GLResource;
}());
exports.GLResource = GLResource;
function using(resource, action) {
    var res = resource instanceof Array ?
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
var ArrayVec_1 = __webpack_require__(6);
var ArrayMat_1 = __webpack_require__(8);
var Shader_1 = __webpack_require__(9);
var VAttr = __webpack_require__(2);
var Unif = __webpack_require__(3);
var Buffers_1 = __webpack_require__(10);
var Program_1 = __webpack_require__(11);
// Vertex shader program
var vsSource = __webpack_require__(12);
var fsSource = __webpack_require__(13);
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
    var program = new Program_1.Program(gl, [vertShader, fragShader], [VAttr.vec2('aVertexPosition')], [Unif.mat4('uModelViewMatrix'), Unif.mat4('uProjectionMatrix')]);
    var vbuffer = new Buffers_1.VertexBuffer(gl, program.vertexDef, vertices);
    var ibuffer = new Buffers_1.IndexBuffer(gl, indices);
    drawScene(gl, program, vbuffer, ibuffer, uniforms);
}
main();


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FMath = __webpack_require__(0);
var Vectors_1 = __webpack_require__(7);
var ArrayHelper = __webpack_require__(1);
var NewArrayVec = (function () {
    function NewArrayVec(dimensions) {
        this.dimensions = dimensions;
    }
    Object.defineProperty(NewArrayVec.prototype, "zero", {
        get: function () {
            return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), 0));
        },
        enumerable: true,
        configurable: true
    });
    NewArrayVec.prototype.unif = function (x) {
        return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), x));
    };
    NewArrayVec.prototype.init = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length != this.dimensions)
            throw RangeError("Expected " + this.dimensions + " components.");
        return new ArrayVec(values);
    };
    NewArrayVec.prototype.fromArray = function (array) {
        if (array.length != this.dimensions)
            throw RangeError("Expected " + this.dimensions + " components.");
        return new ArrayVec(array);
    };
    return NewArrayVec;
}());
exports.newVec2 = new NewArrayVec(2);
exports.newVec3 = new NewArrayVec(3);
exports.newVec4 = new NewArrayVec(4);
var ArrayVec = (function () {
    function ArrayVec(array) {
        this.array = array;
    }
    Object.defineProperty(ArrayVec.prototype, "dimensions", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.component = function (index) {
        return this.array[index];
    };
    ArrayVec.prototype.with = function (index, value) {
        return new ArrayVec(this.array.map(function (v, i, a) { return i == index ? value : v; }));
    };
    Object.defineProperty(ArrayVec.prototype, "x", {
        get: function () { return this.array[Vectors_1.Dim.x]; },
        set: function (value) { this.array[Vectors_1.Dim.x] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "y", {
        get: function () { return this.array[Vectors_1.Dim.y]; },
        set: function (value) { this.array[Vectors_1.Dim.y] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "z", {
        get: function () { return this.array[Vectors_1.Dim.z]; },
        set: function (value) { this.array[Vectors_1.Dim.z] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "w", {
        get: function () { return this.array[Vectors_1.Dim.w]; },
        set: function (value) { this.array[Vectors_1.Dim.w] = value; },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.swizzle = function (coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    };
    ArrayVec.prototype.map = function (oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    };
    ArrayVec.prototype.map2 = function (other, oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }));
    };
    ArrayVec.prototype.reduce = function (oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    };
    Object.defineProperty(ArrayVec.prototype, "lenSqr", {
        get: function () {
            return this.reduce(function (a, x) { return a + (x * x); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "len", {
        get: function () {
            return Math.sqrt(this.lenSqr);
        },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.inv = function () {
        return this.map(function (x) { return -x; });
    };
    ArrayVec.prototype.add = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    ArrayVec.prototype.sub = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    ArrayVec.prototype.mul = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x * y; }) :
            this.map(function (x) { return x * other; });
    };
    ArrayVec.prototype.div = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x / y; }) :
            this.map(function (x) { return x / other; });
    };
    ArrayVec.prototype.norm = function () {
        var l = this.len;
        if (l == 0)
            throw RangeError("Cannot normalize zero vector");
        return this.map(function (x) { return x / l; });
    };
    ArrayVec.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    ArrayVec.prototype.approxEquals = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = 0.000001; }
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    ArrayVec.prototype.dot = function (other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    };
    ArrayVec.prototype.cross = function (other) {
        return new ArrayVec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    };
    ArrayVec.prototype.abs = function () {
        return this.map(Math.abs);
    };
    ArrayVec.prototype.floor = function () {
        return this.map(Math.floor);
    };
    ArrayVec.prototype.ceil = function () {
        return this.map(Math.ceil);
    };
    ArrayVec.prototype.round = function () {
        return this.map(Math.round);
    };
    ArrayVec.prototype.fract = function () {
        return this.map(FMath.fract);
    };
    ArrayVec.prototype.clamp = function (min, max) {
        return this.map(function (x) { return FMath.clamp(x, min, max); });
    };
    ArrayVec.prototype.mix = function (other, interPos) {
        return this.map2(other, function (x, y) { return FMath.mix(x, y, interPos); });
    };
    ArrayVec.prototype.step = function (edge) {
        return this.map(function (x) { return FMath.step(edge, x); });
    };
    ArrayVec.prototype.smoothStep = function (edgeLower, edgeUpper) {
        return this.map(function (x) { return FMath.smoothStep(edgeLower, edgeUpper, x); });
    };
    ArrayVec.prototype.toString = function () {
        return "[" + this.array.join(" ") + "]";
    };
    ArrayVec.prototype.toArray = function () {
        return this.array;
    };
    ArrayVec.prototype.toFloat32Array = function () {
        return new Float32Array(this.array);
    };
    ArrayVec.prototype.newVec = function () {
        return new NewArrayVec(this.dimensions);
    };
    return ArrayVec;
}());


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
var FMath = __webpack_require__(0);
var ArrayHelper = __webpack_require__(1);
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
    function ArrayMat(array, rows, cols) {
        this.array = array;
        this.rows = rows;
        this.cols = cols;
        if (array.length !== rows * cols)
            throw RangeError("Array length has to be equeal rows * columns.");
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Shader = (function () {
    function Shader(gl, type, source) {
        this.gl = gl;
        this.type = type;
        this.gl = gl;
        this.type = type;
        var shader = gl.createShader(this.glShaderType);
        if (shader === null)
            throw Error("Failed to create " + type + " shader.");
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var error = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw Error(error);
        }
        this.glShader = shader;
    }
    Object.defineProperty(Shader.prototype, "glShaderType", {
        get: function () {
            return this.type === 'vertex' ?
                this.gl.VERTEX_SHADER :
                this.gl.FRAGMENT_SHADER;
        },
        enumerable: true,
        configurable: true
    });
    return Shader;
}());
exports.Shader = Shader;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var GLResource_1 = __webpack_require__(4);
var Buffer = (function (_super) {
    __extends(Buffer, _super);
    function Buffer(gl, target, glBuffer, length) {
        var _this = _super.call(this, gl) || this;
        _this.target = target;
        _this.glBuffer = glBuffer;
        _this.length = length;
        return _this;
    }
    Buffer.prototype.use = function () {
        this.gl.bindBuffer(this.target, this.glBuffer);
    };
    Buffer.prototype.release = function () {
        this.gl.bindBuffer(this.target, null);
    };
    return Buffer;
}(GLResource_1.GLResource));
exports.Buffer = Buffer;
var VertexBuffer = (function (_super) {
    __extends(VertexBuffer, _super);
    function VertexBuffer(gl, vertexDef, vertices) {
        var _this = this;
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        _this = _super.call(this, gl, gl.ARRAY_BUFFER, buf, vertices.length) || this;
        GLResource_1.using(_this, function () {
            return gl.bufferData(gl.ARRAY_BUFFER, _this.initBuffer(vertexDef, vertices), gl.STATIC_DRAW);
        });
        return _this;
    }
    VertexBuffer.prototype.initBuffer = function (vertexDef, vertices) {
        var _this = this;
        var vertexSize = vertexDef.stride;
        var len = vertices.length;
        var buffer = new ArrayBuffer(vertexSize * len);
        var view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(function (attr) {
            var setter = _this.vertexAttrSetter(view, attr.type);
            var typeSize = attr.typeSize;
            for (var j = 0; j < len; j++) {
                var values = attr.getter(vertices[j]);
                for (var k = 0; k < attr.numComponents; k++)
                    setter((j * vertexSize) + attr.offset + (k * typeSize), values[k]);
            }
        });
        return buffer;
    };
    VertexBuffer.prototype.vertexAttrSetter = function (view, type) {
        switch (type) {
            case 'byte': return function (off, val) { return view.setInt8(off, val); };
            case 'ubyte': return function (off, val) { return view.setUint8(off, val); };
            case 'short': return function (off, val) { return view.setInt16(off, val, true); };
            case 'ushort': return function (off, val) { return view.setUint16(off, val, true); };
            case 'float': return function (off, val) { return view.setFloat32(off, val, true); };
        }
    };
    return VertexBuffer;
}(Buffer));
exports.VertexBuffer = VertexBuffer;
var IndexBuffer = (function (_super) {
    __extends(IndexBuffer, _super);
    function IndexBuffer(gl, indices) {
        var _this = this;
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create index buffer.');
        _this = _super.call(this, gl, gl.ELEMENT_ARRAY_BUFFER, buf, indices.length) || this;
        GLResource_1.using(_this, function () {
            return gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        });
        return _this;
    }
    return IndexBuffer;
}(Buffer));
exports.IndexBuffer = IndexBuffer;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VertexAttr_1 = __webpack_require__(2);
var Uniforms_1 = __webpack_require__(3);
var GLResource_1 = __webpack_require__(4);
var Program = (function (_super) {
    __extends(Program, _super);
    function Program(gl, shaders, vertexAttrs, uniforms) {
        var _this = _super.call(this, gl) || this;
        _this.shaders = shaders;
        _this.glProgram = _this.link();
        _this.vertexDef = new VertexAttr_1.VertexDef(vertexAttrs);
        _this.vertexDef.initVertexAttrLocations(gl, _this.glProgram);
        _this.uniformDef = new Uniforms_1.UniformDef(uniforms);
        _this.uniformDef.initUniformLocations(gl, _this.glProgram);
        return _this;
    }
    Program.prototype.link = function () {
        var gl = this.gl;
        var prg = gl.createProgram();
        if (prg === null)
            throw Error("Failed to create program");
        this.shaders.forEach(function (s) { return gl.attachShader(prg, s.glShader); });
        gl.linkProgram(prg);
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS))
            throw Error('Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(prg));
        return prg;
    };
    Program.prototype.enableVertexAttrArrays = function () {
        var _this = this;
        var gl = this.gl;
        this.vertexDef.vertexAttrs.forEach(function (attr) {
            gl.vertexAttribPointer(attr.location, attr.numComponents, attr.glType(gl), false, _this.vertexDef.stride, attr.offset);
            gl.enableVertexAttribArray(attr.location);
        });
    };
    Program.prototype.use = function () {
        this.gl.useProgram(this.glProgram);
    };
    Program.prototype.release = function () {
        this.gl.useProgram(null);
    };
    Program.prototype.drawElements = function (mode, vbuffer, ibuffer, uniforms) {
        var _this = this;
        GLResource_1.using([this, vbuffer, ibuffer], function (gl) {
            _this.uniformDef.setValues(gl, uniforms);
            _this.enableVertexAttrArrays();
            gl.drawElements(mode, ibuffer.length, gl.UNSIGNED_SHORT, 0);
        });
    };
    return Program;
}(GLResource_1.GLResource));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDM1ZjI4M2YwM2FiZGFhNTAxMGUiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvRk1hdGgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbW1vbi9BcnJheUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvQXJyYXlWZWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hdGgvVmVjdG9ycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvR0wvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9HTC9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFD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QkFBSSxHQUFKLFVBQU0sS0FBYSxFQUFFLEtBQWE7UUFFOUIsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUssUUFBQyxJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELHNCQUFJLHVCQUFDO2FBQUwsY0FBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0MsVUFBTyxLQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDLENBQUM7OztPQUROO0lBRzdDLHNCQUFJLHVCQUFDO2FBQUwsY0FBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0MsVUFBTyxLQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDLENBQUM7OztPQUROO0lBRzdDLHNCQUFJLHVCQUFDO2FBQUwsY0FBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0MsVUFBTyxLQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDLENBQUM7OztPQUROO0lBRzdDLHNCQUFJLHVCQUFDO2FBQUwsY0FBbUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0MsVUFBTyxLQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFDLENBQUM7OztPQURO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QUMsQ0FBQztRQUNoRSxDQUFDLENBQUM7SUFDTixDQUFDO0lBQ0wsY0FBQztBQUFELENBQUMsQ0F2RWtDLHVCQUFVLEdBdUU1QztBQXZFWSwwQkFBTzs7Ozs7OztBQ05wQixrREFBa0QsaUNBQWlDLHdDQUF3QyxvQ0FBb0MscUJBQXFCLGdEQUFnRCx5Q0FBeUMsaUVBQWlFLE1BQU0sSzs7Ozs7O0FDQXBWLDhDQUE4QyxxQkFBcUIsNENBQTRDLEtBQUssSyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkMzVmMjgzZjAzYWJkYWE1MDEwZSIsImV4cG9ydCBmdW5jdGlvbiBhcHByb3hFcXVhbHMgKHg6IG51bWJlciwgeTogbnVtYmVyLCBcclxuICAgIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKSA6IGJvb2xlYW5cclxue1xyXG4gICAgaWYgKHggPT09IHkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgbGV0IGFic1ggPSBNYXRoLmFicyAoeCk7XHJcbiAgICBsZXQgYWJzWSA9IE1hdGguYWJzICh5KTtcclxuICAgIGxldCBkaWZmID0gTWF0aC5hYnMgKHggLSB5KTtcclxuXHJcbiAgICBpZiAoeCAqIHkgPT0gMClcclxuICAgICAgICByZXR1cm4gZGlmZiA8IChlcHNpbG9uICogZXBzaWxvbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgLyAoYWJzWCArIGFic1kpIDwgZXBzaWxvbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZyYWN0ICh4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggLSBNYXRoLmZsb29yICh4KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wICh4OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4geCA8IG1pbiA/IG1pbiA6XHJcbiAgICAgICAgICAgeCA+IG1heCA/IG1heCA6XHJcbiAgICAgICAgICAgeDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1peCAoc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIGludGVyUG9zOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHN0YXJ0ICsgKGludGVyUG9zICogKGVuZCAtIHN0YXJ0KSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGVwIChlZGdlOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHZhbHVlIDwgZWRnZSA/IDAgOiAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIGxldCB0ID0gY2xhbXAgKCh2YWx1ZSAtIGVkZ2VMb3dlcikgLyAoZWRnZVVwcGVyIC0gZWRnZUxvd2VyKSwgMCwgMSk7XHJcbiAgICByZXR1cm4gdCAqIHQgKiAoMyAtICgyICogdCkpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvRk1hdGgudHMiLCJleHBvcnQgZnVuY3Rpb24gY2xvbmU8VD4gKGFycmF5OiBUW11bXSk6IFRbXVtdXHJcbntcclxuICAgIGxldCByb3dzID0gYXJyYXkubGVuZ3RoXHJcbiAgICBsZXQgcmVzID0gQXJyYXk8VFtdPihyb3dzKVxyXG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgcmVzW3JdID0gYXJyYXlbcl0uc2xpY2UgKClcclxuICAgIHJldHVybiByZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbGw8VD4gKGFycmF5OiBUW10sIHZhbHVlOiBUKTogVFtdXHJcbntcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXJyYXlbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIGFycmF5XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQ8VD4gKHZhbHVlOiBULCBjb3VudDogbnVtYmVyKTogVFtdXHJcbntcclxuICAgIHZhciByZXMgPSBBcnJheTxUPiAoY291bnQpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspXHJcbiAgICAgICAgcmVzW2ldID0gdmFsdWVcclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbW1vbi9BcnJheUhlbHBlci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFZlcnRleEF0dHJUeXBlID0gJ2J5dGUnIHwgJ3Nob3J0JyB8ICd1Ynl0ZScgfCAndXNob3J0JyB8ICdmbG9hdCdcclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIGxvY2F0aW9uOiBudW1iZXJcclxuICAgIG9mZnNldDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcmVhZG9ubHkgdHlwZTogVmVydGV4QXR0clR5cGUsXHJcbiAgICAgICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyLCByZWFkb25seSBnZXR0ZXI6IChWKSA9PiBudW1iZXJbXSkgeyB9XHJcblxyXG4gICAgZ2V0IHR5cGVTaXplICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDJcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGF0dHJpYnV0ZSB0eXBlLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l6ZUluQnl0ZXMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwgKHRoaXMudHlwZVNpemUgKiB0aGlzLm51bUNvbXBvbmVudHMgLyA0KSAqIDRcclxuICAgIH1cclxuXHJcbiAgICBnbFR5cGUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIGdsLkJZVEVcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gZ2wuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiBnbC5TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlRcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gZ2wuRkxPQVRcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4RGVmPFY+XHJcbntcclxuICAgIHJlYWRvbmx5IHN0cmlkZTogbnVtYmVyXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSB2ZXJ0ZXhBdHRyczogVmVydGV4QXR0cjxWPltdKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3RyaWRlID0gdGhpcy5pbml0VmVydGV4QXR0ck9mZnNldHMgKClcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ck9mZnNldHMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoICh2ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2Lm9mZnNldCA9IG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gdi5zaXplSW5CeXRlcyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbiAocHJnLCB2Lm5hbWUpXHJcbiAgICAgICAgICAgIGlmIChsb2MgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBWZXJ0ZXggYXR0cmlidXRlICcke3YubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHYubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnl0ZTxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2J5dGUnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdWJ5dGU8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1Ynl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3Nob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VzaG9ydCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDIsIHYgPT4gKDxWZWMyPnZbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAzLCB2ID0+ICg8VmVjMz52W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgNCwgdiA9PiAoPFZlYzQ+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvVmVydGV4QXR0ci50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4uL01hdGgvTWF0cmljZXNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIFVuaWZvcm1UeXBlID0gJ2ludCcgfCAnZmxvYXQnIHwgJ21hdHJpeCdcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtPFU+XHJcbntcclxuICAgIGxvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IHR5cGU6IFVuaWZvcm1UeXBlLCBcclxuICAgICAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXIsIHJlYWRvbmx5IGdldHRlcjogKFUpID0+IG51bWJlcltdKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgbG93Q29tcCA9IHR5cGUgPT09ICdtYXRyaXgnID8gMiA6IDFcclxuICAgICAgICBpZiAobnVtQ29tcG9uZW50cyA8IGxvd0NvbXAgfHwgbnVtQ29tcG9uZW50cyA+IDQpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBOdW1iZXIgb2YgY29tcG9uZW50cyBtdXN0IGJlIFske2xvd0NvbXB9Li40XSBmb3IgJHt0eXBlfS5gKVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICBsZXQgdmFsID0gdGhpcy5nZXR0ZXIgKHVuaWZvcm1zKVxyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoIDwgdGhpcy5udW1Db21wb25lbnRzIHx8IHZhbC5sZW5ndGggJSB0aGlzLm51bUNvbXBvbmVudHMgIT09IDApXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnSW52YWxpZCBudW1iZXIgb2YgdW5pZm9ybSBlbGVtZW50cy4nKVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5udW1Db21wb25lbnRzKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMml2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgyZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2l2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXg0ZnYgKHRoaXMubG9jYXRpb24sIGZhbHNlLCB2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybURlZjxVPlxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgdW5pZm9ybXM6IFVuaWZvcm08VT5bXSkgeyB9XHJcblxyXG4gICAgaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCh1ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcmcsIHUubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVW5pZm9ybSAnJHt1Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB1LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCAodW5pZiA9PiB1bmlmLnNldFZhbHVlIChnbCwgdW5pZm9ybXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2ludCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDIsIHUgPT4gKDxWZWMyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAzLCB1ID0+ICg8VmVjMz51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgNCwgdSA9PiAoPFZlYzQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAyLCB1ID0+ICg8TWF0Mj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MzxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDMsIHUgPT4gKDxNYXQzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQ0PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgNCwgdSA9PiAoPE1hdDQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9Vbmlmb3Jtcy50cyIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7IH1cclxuICAgIGFic3RyYWN0IHVzZSAoKVxyXG4gICAgYWJzdHJhY3QgcmVsZWFzZSAoKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNpbmcgKHJlc291cmNlOiBHTFJlc291cmNlIHwgR0xSZXNvdXJjZVtdLCBcclxuICAgIGFjdGlvbjogKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpID0+IHZvaWQpXHJcbntcclxuICAgIGxldCByZXMgPSByZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ID8gXHJcbiAgICAgICAgcmVzb3VyY2UucG9wICgpIDogXHJcbiAgICAgICAgcmVzb3VyY2VcclxuICAgIGlmICghcmVzKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgcmVzLnVzZSAoKVxyXG4gICAgdHJ5XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXkgJiYgcmVzb3VyY2UubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdXNpbmcgKHJlc291cmNlLCBhY3Rpb24pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhY3Rpb24gKHJlcy5nbClcclxuICAgIH1cclxuICAgIGZpbmFsbHlcclxuICAgIHtcclxuICAgICAgICByZXMucmVsZWFzZSAoKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dML0dMUmVzb3VyY2UudHMiLCJpbXBvcnQgeyBOZXdWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9NYXRoL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0aC9NYXRyaWNlc1wiO1xyXG5pbXBvcnQgeyBuZXdWZWMyLCBuZXdWZWM0IH0gZnJvbSBcIi4vTWF0aC9BcnJheVZlY1wiXHJcbmltcG9ydCB7IG5ld01hdDQgfSBmcm9tIFwiLi9NYXRoL0FycmF5TWF0XCJcclxuaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vR0wvU2hhZGVyXCJcclxuaW1wb3J0ICogYXMgVkF0dHIgZnJvbSBcIi4vR0wvVmVydGV4QXR0clwiXHJcbmltcG9ydCAqIGFzIFVuaWYgZnJvbSBcIi4vR0wvVW5pZm9ybXNcIlxyXG5pbXBvcnQgeyBWZXJ0ZXhCdWZmZXIsIEluZGV4QnVmZmVyIH0gZnJvbSBcIi4vR0wvQnVmZmVyc1wiO1xyXG5pbXBvcnQgeyBQcm9ncmFtIH0gZnJvbSBcIi4vR0wvUHJvZ3JhbVwiXHJcblxyXG4vLyBWZXJ0ZXggc2hhZGVyIHByb2dyYW1cclxuY29uc3QgdnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLnZlcnQnKVxyXG5jb25zdCBmc1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUuZnJhZycpXHJcblxyXG5jbGFzcyBTaW1wbGVWZXJ0ZXggXHJcbntcclxuICAgIGFWZXJ0ZXhQb3NpdGlvbjogVmVjMiBcclxufVxyXG5cclxuY2xhc3MgTXlVbmlmb3Jtc1xyXG57XHJcbiAgICB1TW9kZWxWaWV3TWF0cml4OiBNYXQ0XHJcbiAgICB1UHJvamVjdGlvbk1hdHJpeDogTWF0NFxyXG59XHJcblxyXG5mdW5jdGlvbiBkcmF3U2NlbmUoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJvZ3JhbTogUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+LCBcclxuICAgIHZidWZmZXI6IFZlcnRleEJ1ZmZlcjxTaW1wbGVWZXJ0ZXg+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IE15VW5pZm9ybXMpIFxyXG57XHJcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7ICAvLyBDbGVhciB0byBibGFjaywgZnVsbHkgb3BhcXVlXHJcbiAgICBnbC5jbGVhckRlcHRoKDEuMCk7ICAgICAgICAgICAgICAgICAvLyBDbGVhciBldmVyeXRoaW5nXHJcbiAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7ICAgICAgICAgICAvLyBFbmFibGUgZGVwdGggdGVzdGluZ1xyXG4gICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7ICAgICAgICAgICAgLy8gTmVhciB0aGluZ3Mgb2JzY3VyZSBmYXIgdGhpbmdzXHJcbiAgXHJcbiAgICAvLyBDbGVhciB0aGUgY2FudmFzIGJlZm9yZSB3ZSBzdGFydCBkcmF3aW5nIG9uIGl0LlxyXG4gIFxyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG5cclxuICAgIHByb2dyYW0uZHJhd0VsZW1lbnRzIChnbC5UUklBTkdMRV9TVFJJUCwgdmJ1ZmZlciwgaWJ1ZmZlciwgdW5pZm9ybXMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4gKClcclxue1xyXG4gICAgbGV0IHZlcnRpY2VzOiBTaW1wbGVWZXJ0ZXhbXSA9IFtcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIC0xKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAtMSkgfVxyXG4gICAgXVxyXG4gICAgbGV0IGluZGljZXMgPSBbIDAsIDEsIDIsIDMgXVxyXG4gICAgbGV0IHVuaWZvcm1zOiBNeVVuaWZvcm1zID0ge1xyXG4gICAgICAgIHVNb2RlbFZpZXdNYXRyaXg6IG5ld01hdDQudHJhbnNsYXRpb24gKFswLjAsIDAuMCwgLTQuMF0pLFxyXG4gICAgICAgIHVQcm9qZWN0aW9uTWF0cml4OiBuZXdNYXQ0LnBlcnNwZWN0aXZlICgtMSwgMSwgLTEsIDEsIDEsIDEwMClcclxuICAgIH1cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG4gICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHZlcnRTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ3ZlcnRleCcsIHZzU291cmNlKVxyXG4gICAgbGV0IGZyYWdTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ2ZyYWdtZW50JywgZnNTb3VyY2UpXHJcblxyXG4gICAgbGV0IHByb2dyYW0gPSBuZXcgUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+IChnbCxcclxuICAgICAgICBbIHZlcnRTaGFkZXIsIGZyYWdTaGFkZXIgXSxcclxuICAgICAgICBbIFZBdHRyLnZlYzIgKCdhVmVydGV4UG9zaXRpb24nKSBdLFxyXG4gICAgICAgIFsgVW5pZi5tYXQ0ICgndU1vZGVsVmlld01hdHJpeCcpLCBVbmlmLm1hdDQgKCd1UHJvamVjdGlvbk1hdHJpeCcpIF0pXHJcblxyXG4gICAgbGV0IHZidWZmZXIgPSBuZXcgVmVydGV4QnVmZmVyIChnbCwgcHJvZ3JhbS52ZXJ0ZXhEZWYsIHZlcnRpY2VzKVxyXG4gICAgbGV0IGlidWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIgKGdsLCBpbmRpY2VzKVxyXG5cclxuICAgIGRyYXdTY2VuZSAoZ2wsIHByb2dyYW0sIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5tYWluICgpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Rlc3QudHMiLCJpbXBvcnQgKiBhcyBGTWF0aCBmcm9tIFwiLi9GTWF0aFwiXHJcbmltcG9ydCB7IERpbSwgVmVjLCBWZWMyLCBWZWMzLCBWZWM0LCBOZXdWZWMgfSBmcm9tIFwiLi9WZWN0b3JzXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4uL0NvbW1vbi9BcnJheUhlbHBlclwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlWZWMgaW1wbGVtZW50cyBOZXdWZWM8VmVjMj4sIE5ld1ZlYzxWZWMzPiwgTmV3VmVjPFZlYzQ+XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIGRpbWVuc2lvbnM6IG51bWJlcikgeyB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIDApKVxyXG4gICAgfVxyXG5cclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPSB0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBFeHBlY3RlZCAke3RoaXMuZGltZW5zaW9uc30gY29tcG9uZW50cy5gKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHZhbHVlcylcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChhcnJheSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzI6IE5ld1ZlYzxWZWMyPiA9IG5ldyBOZXdBcnJheVZlYyAoMilcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzM6IE5ld1ZlYzxWZWMzPiA9IG5ldyBOZXdBcnJheVZlYyAoMylcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzQ6IE5ld1ZlYzxWZWM0PiA9IG5ldyBOZXdBcnJheVZlYyAoNClcclxuXHJcbmNsYXNzIEFycmF5VmVjIGltcGxlbWVudHMgVmVjMiwgVmVjMywgVmVjNFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSBhcnJheTogbnVtYmVyW10pIHsgfVxyXG5cclxuICAgIGdldCBkaW1lbnNpb25zICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtpbmRleF1cclxuICAgIH1cclxuXHJcbiAgICB3aXRoIChpbmRleDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoKHYsIGksIGEpID0+IGkgPT0gaW5kZXggPyB2YWx1ZSA6IHYpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB4ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueF0gfVxyXG4gICAgc2V0IHggKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueF0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHkgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS55XSB9XHJcbiAgICBzZXQgeSAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS55XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeiAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnpdIH1cclxuICAgIHNldCB6ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnpdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB3ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ud10gfVxyXG4gICAgc2V0IHcgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ud10gPSB2YWx1ZSB9XHJcbiAgICBcclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHZhciByZXMgPSBuZXcgQXJyYXkgKGNvb3Jkcy5sZW5ndGgpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc1tpXSA9IHRoaXMuYXJyYXlbY29vcmRzW2ldXVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwMiAob3RoZXI6IEFycmF5VmVjLCBvcGVyOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKVxyXG4gICAgICAgICAgICB9KSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZHVjZSAob3BlcjogKGFjYzogbnVtYmVyLCB4OiBudW1iZXIpID0+IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LnJlZHVjZSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAoYywgdilcclxuICAgICAgICAgICAgfSwgMClcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuU3FyICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWR1Y2UgKChhLCB4KSA9PiBhICsgKHggKiB4KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0ICh0aGlzLmxlblNxcilcclxuICAgIH1cclxuXHJcbiAgICBpbnYgKCkgOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiAteClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggKyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBzdWIgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAtIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAtIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG11bCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4ICogeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgZGl2IChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLyB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLyBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBub3JtICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5sZW5cclxuICAgICAgICBpZiAobCA9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBub3JtYWxpemUgemVybyB2ZWN0b3JcIilcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4geCAvIGwpXHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlWZWMpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlWZWMsIGVwc2lsb246IG51bWJlciA9IDAuMDAwMDAxKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGRvdCAob3RoZXI6IEFycmF5VmVjKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGM6IG51bWJlciwgdjogbnVtYmVyLCBpOiBudW1iZXIsIGE6IG51bWJlcltdKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYyArICh2ICogb3RoZXIuYXJyYXlbaV0pIFxyXG4gICAgICAgICAgICB9LCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogQXJyYXlWZWMpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKFtcclxuICAgICAgICAgICAgdGhpcy55ICogb3RoZXIueiAtIHRoaXMueiAqIG90aGVyLnksXHJcbiAgICAgICAgICAgIHRoaXMueiAqIG90aGVyLnggLSB0aGlzLnggKiBvdGhlci56LFxyXG4gICAgICAgICAgICB0aGlzLnggKiBvdGhlci55IC0gdGhpcy55ICogb3RoZXIueF0pXHRcdFxyXG4gICAgfVxyXG5cclxuICAgIGFicyAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguYWJzKVxyXG4gICAgfVxyXG5cclxuICAgIGZsb29yICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5mbG9vcilcclxuICAgIH1cclxuXHJcbiAgICBjZWlsICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5jZWlsKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdW5kICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5yb3VuZClcclxuICAgIH1cclxuXHJcbiAgICBmcmFjdCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKEZNYXRoLmZyYWN0KVxyXG4gICAgfVxyXG5cclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5jbGFtcCAoeCwgbWluLCBtYXgpKVxyXG4gICAgfVxyXG5cclxuICAgIG1peCAob3RoZXI6IEFycmF5VmVjLCBpbnRlclBvczogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IEZNYXRoLm1peCAoeCwgeSwgaW50ZXJQb3MpKVxyXG4gICAgfVxyXG5cclxuICAgIHN0ZXAgKGVkZ2U6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLnN0ZXAgKGVkZ2UsIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLnNtb290aFN0ZXAgKGVkZ2VMb3dlciwgZWRnZVVwcGVyLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy5hcnJheS5qb2luIChcIiBcIikgKyBcIl1cIlxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgbmV3VmVjICgpOiBOZXdBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgTmV3QXJyYXlWZWMgKHRoaXMuZGltZW5zaW9ucylcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheVZlYy50cyIsIi8qKlxyXG4gKiBFbnVtZXJhdGlvbiB0aGF0IGRlZmluZXMgdGhlIGNvb3JkaW5hdGUgZGltZW5zaW9ucyB1c2VkIGluIHRoZSB2ZWN0b3IgdHlwZXMuXHJcbiAqL1xyXG5leHBvcnQgZW51bSBEaW0gXHJcbntcclxuICAgIHggPSAwLFxyXG4gICAgeSA9IDEsIFxyXG4gICAgeiA9IDIsXHJcbiAgICB3ID0gM1xyXG59XHJcblxyXG4vKiogXHJcbiAqIEJhc2UgaW50ZXJmYWNlIGZvciBhbGwgdmVjdG9yeSB0eXBlcy4gRGVmaW5lcyBtZXRob2RzIHRoYXQgaGF2ZSB0aGUgc2FtZSBzaWduYXR1cmVcclxuICogaW4gYWxsIHZlY3RvciB2YXJpYW50cy5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjPFYgZXh0ZW5kcyBWZWM8Vj4+XHJcbntcclxuICAgIC8qKlxyXG4gICAgICogTnVtYmVyIGRpbWVuc2lvbnMgaW4gdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgZGltZW5zaW9uczogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBvbmUgb3IgbW9yZSBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgaW4gYXJiaXRyYXJ5IG9yZGVyLiBUaGUgY29tcG9uZW50c1xyXG4gICAgICogcmV0dXJuZWQgZGVwZW5kIG9uIHRoZSBkaW1lbnNpb25zIHNwZWNpZmllZCBpbiB0aGUgY29vcmRzIGFyZ3VtZW50LiBOb3RlIHRoYXRcclxuICAgICAqIHRoZSBzYW1lIGNvbXBvbmVudCBjYW4gb2NjdXIgbXVsdGlwbGUgdGltZXMgaW4gY29vcmRzLiBTbywgaXQgaXMgdmFsaWQgdG8gY2FsbFxyXG4gICAgICogdGhlIGZ1bmN0aW9uIGxpa2UgdGhpczpcclxuICAgICAqIFxyXG4gICAgICogc3dpenpsZSAoW0RpbS54LCBEaW0ueCwgRGltLnldKVxyXG4gICAgICovXHJcbiAgICBzd2l6emxlIChjb29yZHM6IERpbVtdKTogbnVtYmVyW11cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGxlbmdodCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuIEZhc3RlciB0byBjYWxjdWxhdGUgdGhhbiB0aGUgYWN0dWFsIGxlbmd0aCxcclxuICAgICAqIGFuZCB1c2VmdWwgZm9yIGNvbXBhcmluZyB2ZWN0b3IgbWFnbml0dWRlcy5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbGVuU3FyOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogTGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlbjogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3Rvci4gRm9ybWF0dGVkIGxpa2UgdGhpczogW3ggeSB6XVxyXG4gICAgICovXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHdpdGggKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBWXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAgbmV3VmVjICgpOiBOZXdWZWM8Vj5cclxuICAgIFxyXG4gICAgaW52ICgpOiBWXHJcbiAgICBhZGQgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgc3ViIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIG11bCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBkaXYgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbm9ybSAoKTogVlxyXG4gICAgZXF1YWxzIChvdGhlcjogVik6IGJvb2xlYW5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IFYsIGVwc2lsb24/OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICBkb3QgKG90aGVyOiBWKTogbnVtYmVyXHJcbiAgICBhYnMgKCk6IFZcclxuICAgIGZsb29yICgpOiBWXHJcbiAgICBjZWlsICgpOiBWXHJcbiAgICByb3VuZCAoKTogVlxyXG4gICAgZnJhY3QgKCk6IFZcclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBWXHJcbiAgICBtaXggKG90aGVyOiBWLCBpbnRlclBvczogbnVtYmVyKTogVlxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogVlxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ld1ZlYzxWIGV4dGVuZHMgVmVjPFY+PlxyXG57XHJcbiAgICByZWFkb25seSB6ZXJvOiBWXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVlxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMiBleHRlbmRzIFZlYzxWZWMyPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzMgZXh0ZW5kcyBWZWM8VmVjMz5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogVmVjMyk6IFZlYzNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWM0IGV4dGVuZHMgVmVjPFZlYzQ+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL01hdGgvVmVjdG9ycy50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBOZXdNYXQ0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0cmljZXNcIjtcclxuaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUhlbHBlciBmcm9tIFwiLi4vQ29tbW9uL0FycmF5SGVscGVyXCI7XHJcblxyXG5jbGFzcyBOZXdBcnJheU1hdCBpbXBsZW1lbnRzIE5ld01hdDxNYXQyLCBWZWMyPiwgTmV3TWF0PE1hdDMsIFZlYzM+LCBOZXdNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSB7IH1cclxuXHJcbiAgICBwcml2YXRlIGlkZW50aXR5QXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHIgKiBjKSwgMClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChyLCBjKTsgaSsrKSBcclxuICAgICAgICAgICAgYXJyW2kgKiByICsgaV0gPSAxXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+KHIgKiBjKSwgMCksIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkZW50aXR5ICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmlkZW50aXR5QXJyYXkgKCksIHRoaXMucm93cywgdGhpcy5jb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0aW9uIChvZmZzZXRzOiBudW1iZXJbXXxWZWMyfFZlYzN8VmVjNCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzID0gb2Zmc2V0cyBpbnN0YW5jZW9mIEFycmF5ID8gb2Zmc2V0cyA6IG9mZnNldHMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChvZmZzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBvZmZzZXRzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBsYXN0Q29sID0gYyAtIDFcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChvZmZzLmxlbmd0aCwgciAtIDEpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbbGFzdENvbCAqIHIgKyBpXSA9IG9mZnNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGluZyAoZmFjdG9yczogbnVtYmVyW118VmVjMnxWZWMzfFZlYzQpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgZmFjcyA9IGZhY3RvcnMgaW5zdGFuY2VvZiBBcnJheSA/IGZhY3RvcnMgOmZhY3RvcnMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChmYWNzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBmYWN0b3JzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKGZhY3MubGVuZ3RoLCByLCBjKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2kgKiByICsgaV0gPSBmYWNzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWCAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBYLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2FcclxuICAgICAgICByZXNbciArIDJdID0gc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDFdID0gLXNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2FcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25ZIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFktYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1syXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1syICogcl0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25aIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzFdID0gc2luYTtcclxuICAgICAgICByZXNbcl0gPSAtc2luYTtcclxuICAgICAgICByZXNbciArIDFdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcGVyc3BlY3RpdmUgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBpZiAoek5lYXIgPD0gMCB8fCB6TmVhciA+PSB6RmFyKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcInpOZWFyIG5lZWRzIHRvIGJlIHBvc2l0aXZlIGFuZCBzbWFsbGVyIHRoYXRuIHpGYXJcIilcclxuICAgICAgICBsZXQgd2lkdGggPSByaWdodCAtIGxlZnRcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdG9wIC0gYm90dG9tXHJcbiAgICAgICAgbGV0IGRlcHRoID0gekZhciAtIHpOZWFyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsoMi4wICogek5lYXIpIC8gd2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsICgyLjAgKiB6TmVhcikgLyBoZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIChyaWdodCArIGxlZnQpIC8gd2lkdGgsICh0b3AgKyBib3R0b20pIC8gaGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgLyBkZXB0aCwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsIC0oMi4wICogekZhciAqIHpOZWFyKSAvIGRlcHRoLCAwXSwgXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgb3J0aG9ncmFwaGljIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGludldpZHRoID0gMS4wIC8gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBsZXQgaW52SGVpZ2h0ID0gMS4wIC8gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBsZXQgaW52RGVwdGggPSAxLjAgLyAoekZhciAtIHpOZWFyKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbMiAqIGludldpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAyICogaW52SGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAtMiAqIGludkRlcHRoLCAwLFxyXG4gICAgICAgICAgICAtKHJpZ2h0ICsgbGVmdCkgKiBpbnZXaWR0aCwgLSh0b3AgKyBib3R0b20pICogaW52SGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgKiBpbnZEZXB0aCwgMV0sXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0IChkaXJlY3Rpb246IFZlYzMsIHVwOiBWZWMzKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB6YXhpcyA9IGRpcmVjdGlvbi5pbnYgKCkubm9ybSAoKVxyXG4gICAgICAgIGxldCB4YXhpcyA9IHVwLmNyb3NzICh6YXhpcykubm9ybSAoKVxyXG4gICAgICAgIGxldCB5YXhpcyA9IHpheGlzLmNyb3NzICh4YXhpcylcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFt4YXhpcy54LCB5YXhpcy54LCB6YXhpcy54LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy55LCB5YXhpcy55LCB6YXhpcy55LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy56LCB5YXhpcy56LCB6YXhpcy56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXSwgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyYXksIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQyOiBOZXdNYXQ8TWF0MiwgVmVjMj4gPSBuZXcgTmV3QXJyYXlNYXQgKDIsIDIpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQzOiBOZXdNYXQ8TWF0MywgVmVjMz4gPSBuZXcgTmV3QXJyYXlNYXQgKDMsIDMpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQ0OiBOZXdNYXQ0ID0gbmV3IE5ld0FycmF5TWF0ICg0LCA0KVxyXG5cclxuY2xhc3MgQXJyYXlNYXQgaW1wbGVtZW50cyBNYXQyLCBNYXQzLCBNYXQ0XHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChyZWFkb25seSBhcnJheTogbnVtYmVyW10sIHJlYWRvbmx5IHJvd3M6IG51bWJlciwgcmVhZG9ubHkgY29sczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoICE9PSByb3dzICpjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkFycmF5IGxlbmd0aCBoYXMgdG8gYmUgZXF1ZWFsIHJvd3MgKiBjb2x1bW5zLlwiKSBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAob3RoZXI6IFYpOiBWXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKG90aGVyLnRvQXJyYXkgKCksIHRoaXMuY29scywgMSlcclxuICAgICAgICByZXR1cm4gb3RoZXIubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvTWF0aC9BcnJheU1hdC50cyIsImV4cG9ydCB0eXBlIFNoYWRlclR5cGUgPSAndmVydGV4JyB8ICdmcmFnbWVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkZXJcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xTaGFkZXI6IFdlYkdMU2hhZGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcmVhZG9ubHkgdHlwZTogU2hhZGVyVHlwZSwgc291cmNlOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgICAgIGxldCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodGhpcy5nbFNoYWRlclR5cGUpO1xyXG4gICAgICAgIGlmIChzaGFkZXIgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yIChgRmFpbGVkIHRvIGNyZWF0ZSAke3R5cGV9IHNoYWRlci5gKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9ICdBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcilcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcilcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsU2hhZGVyID0gc2hhZGVyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdsU2hhZGVyVHlwZSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3ZlcnRleCcgPyBcclxuICAgICAgICAgICAgdGhpcy5nbC5WRVJURVhfU0hBREVSIDogXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvU2hhZGVyLnRzIiwiaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCI7XHJcbmltcG9ydCB7IFZlcnRleEF0dHIsIFZlcnRleEF0dHJUeXBlLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWZmZXIgZXh0ZW5kcyBHTFJlc291cmNlXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCByZWFkb25seSB0YXJnZXQ6IG51bWJlcixcclxuICAgICAgICByZWFkb25seSBnbEJ1ZmZlcjogV2ViR0xCdWZmZXIsIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyIChnbClcclxuICAgIH1cclxuXHJcbiAgICB1c2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCB0aGlzLmdsQnVmZmVyKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbGVhc2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIgKHRoaXMudGFyZ2V0LCBudWxsKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4QnVmZmVyPFY+IGV4dGVuZHMgQnVmZmVyIFxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj4sIHZlcnRpY2VzOiBWW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXggYnVmZmVyLicpXHJcbiAgICAgICAgc3VwZXIgKGdsLCBnbC5BUlJBWV9CVUZGRVIsIGJ1ZiwgdmVydGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmluaXRCdWZmZXIgKHZlcnRleERlZiwgdmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVykpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0QnVmZmVyICh2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSk6IEFycmF5QnVmZmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlcnRleFNpemUgPSB2ZXJ0ZXhEZWYuc3RyaWRlXHJcbiAgICAgICAgbGV0IGxlbiA9IHZlcnRpY2VzLmxlbmd0aFxyXG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIgKHZlcnRleFNpemUgKiBsZW4pXHJcbiAgICAgICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcgKGJ1ZmZlcilcclxuICAgICAgICB2ZXJ0ZXhEZWYudmVydGV4QXR0cnMuZm9yRWFjaCAoYXR0ciA9PiBcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgICB2YXIgc2V0dGVyID0gdGhpcy52ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3LCBhdHRyLnR5cGUpXHJcbiAgICAgICAgICAgIGxldCB0eXBlU2l6ZSA9IGF0dHIudHlwZVNpemVcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGF0dHIuZ2V0dGVyICh2ZXJ0aWNlc1tqXSlcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXR0ci5udW1Db21wb25lbnRzOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGVyICgoaiAqIHZlcnRleFNpemUpICsgYXR0ci5vZmZzZXQgKyAoayAqIHR5cGVTaXplKSwgdmFsdWVzW2tdKSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlclxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmVydGV4QXR0clNldHRlciAodmlldzogRGF0YVZpZXcsIHR5cGU6IFZlcnRleEF0dHJUeXBlKTogXHJcbiAgICAgICAgKG9mZnNldDogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKSA9PiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDggKG9mZiwgdmFsKVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50MTYgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldFVpbnQxNiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgICAgIGNhc2UgJ2Zsb2F0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRGbG9hdDMyIChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmRleEJ1ZmZlciBleHRlbmRzIEJ1ZmZlclxyXG57XHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgaW5kaWNlczogbnVtYmVyW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSBpbmRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBidWYsIGluZGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MTZBcnJheSAoaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTC9CdWZmZXJzLnRzIiwiaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vU2hhZGVyXCJcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcbmltcG9ydCB7IFVuaWZvcm0sIFVuaWZvcm1EZWYgfSBmcm9tIFwiLi9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbTxWLCBVPiBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xQcm9ncmFtOiBXZWJHTFByb2dyYW1cclxuICAgIHJlYWRvbmx5IHNoYWRlcnM6IFNoYWRlcltdXHJcbiAgICByZWFkb25seSB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPlxyXG4gICAgcmVhZG9ubHkgdW5pZm9ybURlZjogVW5pZm9ybURlZjxVPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBcclxuICAgICAgICBzaGFkZXJzOiBTaGFkZXJbXSwgXHJcbiAgICAgICAgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXSxcclxuICAgICAgICB1bmlmb3JtczogVW5pZm9ybTxVPltdKSBcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gc2hhZGVyc1xyXG4gICAgICAgIHRoaXMuZ2xQcm9ncmFtID0gdGhpcy5saW5rICgpXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYgPSBuZXcgVmVydGV4RGVmICh2ZXJ0ZXhBdHRycylcclxuICAgICAgICB0aGlzLnZlcnRleERlZi5pbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgICAgIHRoaXMudW5pZm9ybURlZiA9IG5ldyBVbmlmb3JtRGVmICh1bmlmb3JtcylcclxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYuaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsLCB0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxpbmsgKCk6IFdlYkdMUHJvZ3JhbVxyXG4gICAge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcclxuICAgICAgICBsZXQgcHJnID0gZ2wuY3JlYXRlUHJvZ3JhbSgpXHJcbiAgICAgICAgaWYgKHByZyA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzLmZvckVhY2gocyA9PiBnbC5hdHRhY2hTaGFkZXIocHJnLCBzLmdsU2hhZGVyKSlcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcmcpO1xyXG4gICAgICBcclxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJnLCBnbC5MSU5LX1NUQVRVUykpIFxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJyArIFxyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJnKSlcclxuICAgICAgICByZXR1cm4gcHJnXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgICAgICAgICAgICBhdHRyLmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5udW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5nbFR5cGUgKGdsKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGhpcy52ZXJ0ZXhEZWYuc3RyaWRlLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5vZmZzZXQpO1xyXG4gICAgICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShhdHRyLmxvY2F0aW9uKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAodGhpcy5nbFByb2dyYW0pXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSAobnVsbClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3RWxlbWVudHMgKG1vZGU6IG51bWJlciwgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFY+LCBpYnVmZmVyOiBJbmRleEJ1ZmZlciwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgdXNpbmcgKFt0aGlzLCB2YnVmZmVyLCBpYnVmZmVyXSwgZ2wgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudW5pZm9ybURlZi5zZXRWYWx1ZXMgKGdsLCB1bmlmb3JtcylcclxuICAgICAgICAgICAgdGhpcy5lbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyAobW9kZSwgaWJ1ZmZlci5sZW5ndGgsIGdsLlVOU0lHTkVEX1NIT1JULCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR0wvUHJvZ3JhbS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCIgYXR0cmlidXRlIHZlYzIgYVZlcnRleFBvc2l0aW9uO1xcclxcbiB2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuIFxcclxcbiB1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXHJcXG4gdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcclxcblxcclxcbnZvaWQgbWFpbigpIHtcXHJcXG4gICAgdmVjNCBwb3MgPSB2ZWM0IChhVmVydGV4UG9zaXRpb24sIDAsIDEpO1xcclxcbiAgICBwb3NpdGlvbiA9IG1heChwb3MueHl6LCB2ZWMzKDApKTtcXHJcXG4gICAgZ2xfUG9zaXRpb24gPSB1UHJvamVjdGlvbk1hdHJpeCAqIHVNb2RlbFZpZXdNYXRyaXggKiBwb3M7XFxyXFxuIH1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLnZlcnRcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCJ2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuXFxyXFxudm9pZCBtYWluKCkgeyBcXHJcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChwb3NpdGlvbiwgMS4wKTtcXHJcXG59XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9