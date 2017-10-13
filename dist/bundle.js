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
    function VertexAttr(name, type, components, getter) {
        this.name = name;
        this.type = type;
        this.numComponents = components;
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
    function VertexDef(attrs) {
        this.vertexAttrs = attrs;
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
    function Uniform(name, type, components, getter) {
        var lowComp = type === 'matrix' ? 2 : 1;
        if (components < lowComp || components > 4)
            throw RangeError("Number of components must be [" + lowComp + "..4] for " + type + ".");
        this.name = name;
        this.type = type;
        this.numComponents = components;
        this.getter = getter;
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
    var program = new Program_1.Program(gl, [vertShader, fragShader], [VAttr.vec4('aVertexPosition')], [Unif.mat4('uModelViewMatrix'), Unif.mat4('uProjectionMatrix')]);
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
    function NewArrayVec(dims) {
        this.dimensions = dims;
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
    function ArrayVec(values) {
        this.array = values;
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Shader = (function () {
    function Shader(gl, type, source) {
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
            case 'short': return function (off, val) { return view.setInt16(off, val); };
            case 'ushort': return function (off, val) { return view.setUint16(off, val); };
            case 'float': return function (off, val) { return view.setFloat32(off, val); };
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
        var gl = this.gl;
        this.vertexDef.vertexAttrs.forEach(function (attr) {
            gl.vertexAttribPointer(attr.location, attr.numComponents, attr.glType(gl), false, 0, //this.vertexDef.stride,
            attr.offset);
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
            // gl.drawElements (mode, ibuffer.length, gl.UNSIGNED_SHORT, 0)
            gl.drawArrays(mode, 0, vbuffer.length);
        });
    };
    return Program;
}(GLResource_1.GLResource));
exports.Program = Program;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = " attribute vec4 aVertexPosition;\r\n varying highp vec3 position;\r\n \r\n uniform mat4 uModelViewMatrix;\r\n uniform mat4 uProjectionMatrix;\r\n\r\nvoid main() {\r\n    position = max(aVertexPosition.xyz, vec3(0));\r\n    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\r\n }\r\n"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "varying highp vec3 position;\r\n\r\nvoid main() { \r\n    gl_FragColor = vec4(position, 1.0);\r\n}\r\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzg5YTU0YWVjYjgwZTE2Y2Y2MTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ZNYXRoLnRzIiwid2VicGFjazovLy8uL3NyYy9BcnJheUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FycmF5VmVjLnRzIiwid2VicGFjazovLy8uL3NyYy9WZWN0b3JzLnRzIiwid2VicGFjazovLy8uL3NyYy9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQSxzQkFBOEIsQ0FBUyxFQUFFLENBQVMsRUFDOUMs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LHVCQUFVLEdBd0U1QztBQXhFWSwwQkFBTzs7Ozs7OztBQ05wQixrREFBa0QsaUNBQWlDLHdDQUF3QyxvQ0FBb0MscUJBQXFCLHFEQUFxRCw2RUFBNkUsTUFBTSxLOzs7Ozs7QUNBNVQsOENBQThDLHFCQUFxQiw0Q0FBNEMsS0FBSyxLIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM4OWE1NGFlY2I4MGUxNmNmNjExIiwiZXhwb3J0IGZ1bmN0aW9uIGFwcHJveEVxdWFscyAoeDogbnVtYmVyLCB5OiBudW1iZXIsIFxyXG4gICAgZXBzaWxvbjogbnVtYmVyID0gMC4wMDAwMDEpIDogYm9vbGVhblxyXG57XHJcbiAgICBpZiAoeCA9PT0geSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICBsZXQgYWJzWCA9IE1hdGguYWJzICh4KTtcclxuICAgIGxldCBhYnNZID0gTWF0aC5hYnMgKHkpO1xyXG4gICAgbGV0IGRpZmYgPSBNYXRoLmFicyAoeCAtIHkpO1xyXG5cclxuICAgIGlmICh4ICogeSA9PSAwKVxyXG4gICAgICAgIHJldHVybiBkaWZmIDwgKGVwc2lsb24gKiBlcHNpbG9uKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZGlmZiAvIChhYnNYICsgYWJzWSkgPCBlcHNpbG9uO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJhY3QgKHg6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4geCAtIE1hdGguZmxvb3IgKHgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAgKHg6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IDwgbWluID8gbWluIDpcclxuICAgICAgICAgICB4ID4gbWF4ID8gbWF4IDpcclxuICAgICAgICAgICB4O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWl4IChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgaW50ZXJQb3M6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4gc3RhcnQgKyAoaW50ZXJQb3MgKiAoZW5kIC0gc3RhcnQpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0ZXAgKGVkZ2U6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICByZXR1cm4gdmFsdWUgPCBlZGdlID8gMCA6IDE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgbGV0IHQgPSBjbGFtcCAoKHZhbHVlIC0gZWRnZUxvd2VyKSAvIChlZGdlVXBwZXIgLSBlZGdlTG93ZXIpLCAwLCAxKTtcclxuICAgIHJldHVybiB0ICogdCAqICgzIC0gKDIgKiB0KSk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvRk1hdGgudHMiLCJleHBvcnQgZnVuY3Rpb24gY2xvbmU8VD4gKGFycmF5OiBUW11bXSk6IFRbXVtdXHJcbntcclxuICAgIGxldCByb3dzID0gYXJyYXkubGVuZ3RoXHJcbiAgICBsZXQgcmVzID0gQXJyYXk8VFtdPihyb3dzKVxyXG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgcmVzW3JdID0gYXJyYXlbcl0uc2xpY2UgKClcclxuICAgIHJldHVybiByZXNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbGw8VD4gKGFycmF5OiBUW10sIHZhbHVlOiBUKTogVFtdXHJcbntcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXJyYXlbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIGFycmF5XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQ8VD4gKHZhbHVlOiBULCBjb3VudDogbnVtYmVyKTogVFtdXHJcbntcclxuICAgIHZhciByZXMgPSBBcnJheTxUPiAoY291bnQpXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspXHJcbiAgICAgICAgcmVzW2ldID0gdmFsdWVcclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0FycmF5SGVscGVyLnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vVmVjdG9yc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVmVydGV4QXR0clR5cGUgPSAnYnl0ZScgfCAnc2hvcnQnIHwgJ3VieXRlJyB8ICd1c2hvcnQnIHwgJ2Zsb2F0J1xyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nXHJcbiAgICByZWFkb25seSB0eXBlOiBWZXJ0ZXhBdHRyVHlwZVxyXG4gICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyXHJcbiAgICByZWFkb25seSBnZXR0ZXI6IChWKSA9PiBudW1iZXJbXVxyXG5cclxuICAgIGxvY2F0aW9uOiBudW1iZXJcclxuICAgIG9mZnNldDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKG5hbWU6IHN0cmluZywgdHlwZTogVmVydGV4QXR0clR5cGUsIGNvbXBvbmVudHM6IG51bWJlciwgZ2V0dGVyOiAoVikgPT4gbnVtYmVyW10pIFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICAgICAgdGhpcy5udW1Db21wb25lbnRzID0gY29tcG9uZW50c1xyXG4gICAgICAgIHRoaXMuZ2V0dGVyID0gZ2V0dGVyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGVTaXplICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDJcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChcIlVuc3VwcG9ydGVkIGF0dHJpYnV0ZSB0eXBlLlwiKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2l6ZUluQnl0ZXMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwgKHRoaXMudHlwZVNpemUgKiB0aGlzLm51bUNvbXBvbmVudHMgLyA0KSAqIDRcclxuICAgIH1cclxuXHJcbiAgICBnbFR5cGUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIGdsLkJZVEVcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gZ2wuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICBjYXNlICdzaG9ydCc6IHJldHVybiBnbC5TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICd1c2hvcnQnOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlRcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gZ2wuRkxPQVRcclxuICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4RGVmPFY+XHJcbntcclxuICAgIHJlYWRvbmx5IHZlcnRleEF0dHJzOiBWZXJ0ZXhBdHRyPFY+W11cclxuICAgIHJlYWRvbmx5IHN0cmlkZTogbnVtYmVyXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yIChhdHRyczogVmVydGV4QXR0cjxWPltdKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudmVydGV4QXR0cnMgPSBhdHRyc1xyXG4gICAgICAgIHRoaXMuc3RyaWRlID0gdGhpcy5pbml0VmVydGV4QXR0ck9mZnNldHMgKClcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ck9mZnNldHMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoICh2ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2Lm9mZnNldCA9IG9mZnNldFxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gdi5zaXplSW5CeXRlcyBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycy5mb3JFYWNoKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbiAocHJnLCB2Lm5hbWUpXHJcbiAgICAgICAgICAgIGlmIChsb2MgPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBWZXJ0ZXggYXR0cmlidXRlICcke3YubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHYubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnl0ZTxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2J5dGUnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdWJ5dGU8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICd1Ynl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3Nob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaG9ydDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VzaG9ydCcsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDIsIHYgPT4gKDxWZWMyPnZbbmFtZV0pLnRvQXJyYXkgKCkgKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMzxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMywgdiA9PiAoPFZlYzM+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWM0PFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCA0LCB2ID0+ICg8VmVjND52W25hbWVdKS50b0FycmF5ICgpIClcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9WZXJ0ZXhBdHRyLnRzIiwiaW1wb3J0IHsgVmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vVmVjdG9yc1wiO1xyXG5pbXBvcnQgeyBNYXQsIE1hdDIsIE1hdDMsIE1hdDQgfSBmcm9tIFwiLi9NYXRyaWNlc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgVW5pZm9ybVR5cGUgPSAnaW50JyB8ICdmbG9hdCcgfCAnbWF0cml4J1xyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWZvcm08VT5cclxue1xyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nXHJcbiAgICByZWFkb25seSB0eXBlOiBVbmlmb3JtVHlwZVxyXG4gICAgcmVhZG9ubHkgbnVtQ29tcG9uZW50czogbnVtYmVyXHJcbiAgICByZWFkb25seSBnZXR0ZXI6IChVKSA9PiBudW1iZXJbXVxyXG5cclxuICAgIGxvY2F0aW9uOiBXZWJHTFVuaWZvcm1Mb2NhdGlvblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChuYW1lOiBzdHJpbmcsIHR5cGU6IFVuaWZvcm1UeXBlLCBjb21wb25lbnRzOiBudW1iZXIsIGdldHRlcjogKFUpID0+IG51bWJlcltdKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgbG93Q29tcCA9IHR5cGUgPT09ICdtYXRyaXgnID8gMiA6IDFcclxuICAgICAgICBpZiAoY29tcG9uZW50cyA8IGxvd0NvbXAgfHwgY29tcG9uZW50cyA+IDQpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBOdW1iZXIgb2YgY29tcG9uZW50cyBtdXN0IGJlIFske2xvd0NvbXB9Li40XSBmb3IgJHt0eXBlfS5gKVxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlXHJcbiAgICAgICAgdGhpcy5udW1Db21wb25lbnRzID0gY29tcG9uZW50c1xyXG4gICAgICAgIHRoaXMuZ2V0dGVyID0gZ2V0dGVyXHJcbiAgICB9XHJcblxyXG4gICAgc2V0VmFsdWUgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIGxldCB2YWwgPSB0aGlzLmdldHRlciAodW5pZm9ybXMpXHJcbiAgICAgICAgaWYgKHZhbC5sZW5ndGggPCB0aGlzLm51bUNvbXBvbmVudHMgfHwgdmFsLmxlbmd0aCAlIHRoaXMubnVtQ29tcG9uZW50cyAhPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdJbnZhbGlkIG51bWJlciBvZiB1bmlmb3JtIGVsZW1lbnRzLicpXHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm51bUNvbXBvbmVudHMpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTFpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0yaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMmZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDJmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0zaXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtM2Z2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdpbnQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00aXYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ2Zsb2F0JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtNGZ2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdiAodGhpcy5sb2NhdGlvbiwgZmFsc2UsIHZhbClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVbmlmb3JtRGVmPFU+XHJcbntcclxuICAgIHJlYWRvbmx5IHVuaWZvcm1zOiBVbmlmb3JtPFU+W11cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHVuaWZvcm1zOiBVbmlmb3JtPFU+W10pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51bmlmb3JtcyA9IHVuaWZvcm1zXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByZzogV2ViR0xQcm9ncmFtKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCh1ID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uIChwcmcsIHUubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yIChgVW5pZm9ybSAnJHt1Lm5hbWV9JyBub3QgZm91bmQgaW4gcHJvZ3JhbS5gKVxyXG4gICAgICAgICAgICB1LmxvY2F0aW9uID0gbG9jXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMudW5pZm9ybXMuZm9yRWFjaCAodW5pZiA9PiB1bmlmLnNldFZhbHVlIChnbCwgdW5pZm9ybXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2ludCcsIDEsIHUgPT4gWyB1W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDIsIHUgPT4gKDxWZWMyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAzLCB1ID0+ICg8VmVjMz51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjNDxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgNCwgdSA9PiAoPFZlYzQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDI8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCAyLCB1ID0+ICg8TWF0Mj51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MzxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDMsIHUgPT4gKDxNYXQzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQ0PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgNCwgdSA9PiAoPE1hdDQ+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Vbmlmb3Jtcy50cyIsImV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHTFJlc291cmNlXHJcbntcclxuICAgIHJlYWRvbmx5IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHRcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsID0gZ2xcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCB1c2UgKClcclxuICAgIGFic3RyYWN0IHJlbGVhc2UgKClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nIChyZXNvdXJjZTogR0xSZXNvdXJjZSB8IEdMUmVzb3VyY2VbXSwgXHJcbiAgICBhY3Rpb246IChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KSA9PiB2b2lkKVxyXG57XHJcbiAgICBsZXQgcmVzID0gcmVzb3VyY2UgaW5zdGFuY2VvZiBBcnJheSA/IFxyXG4gICAgICAgIHJlc291cmNlLnBvcCAoKSA6IFxyXG4gICAgICAgIHJlc291cmNlXHJcbiAgICBpZiAoIXJlcylcclxuICAgICAgICByZXR1cm5cclxuICAgIHJlcy51c2UgKClcclxuICAgIHRyeVxyXG4gICAge1xyXG4gICAgICAgIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ICYmIHJlc291cmNlLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHVzaW5nIChyZXNvdXJjZSwgYWN0aW9uKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYWN0aW9uIChyZXMuZ2wpXHJcbiAgICB9XHJcbiAgICBmaW5hbGx5XHJcbiAgICB7XHJcbiAgICAgICAgcmVzLnJlbGVhc2UgKClcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9HTFJlc291cmNlLnRzIiwiaW1wb3J0IHsgTmV3VmVjLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSBcIi4vVmVjdG9yc1wiO1xyXG5pbXBvcnQgeyBOZXdNYXQsIE1hdDIsIE1hdDMsIE1hdDQgfSBmcm9tIFwiLi9NYXRyaWNlc1wiO1xyXG5pbXBvcnQgeyBuZXdWZWMyLCBuZXdWZWM0IH0gZnJvbSBcIi4vQXJyYXlWZWNcIlxyXG5pbXBvcnQgeyBuZXdNYXQ0IH0gZnJvbSBcIi4vQXJyYXlNYXRcIlxyXG5pbXBvcnQgeyBTaGFkZXJUeXBlLCBTaGFkZXIgfSBmcm9tIFwiLi9TaGFkZXJcIlxyXG5pbXBvcnQgKiBhcyBWQXR0ciBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuaW1wb3J0ICogYXMgVW5pZiBmcm9tIFwiLi9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XHJcbmltcG9ydCB7IFByb2dyYW0gfSBmcm9tIFwiLi9Qcm9ncmFtXCJcclxuXHJcbi8vIFZlcnRleCBzaGFkZXIgcHJvZ3JhbVxyXG5jb25zdCB2c1NvdXJjZTogc3RyaW5nID0gcmVxdWlyZSAoJy4vc2hhZGVycy9zaW1wbGUudmVydCcpXHJcbmNvbnN0IGZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS5mcmFnJylcclxuXHJcbmNsYXNzIFNpbXBsZVZlcnRleCBcclxue1xyXG4gICAgYVZlcnRleFBvc2l0aW9uOiBWZWMyIFxyXG59XHJcblxyXG5jbGFzcyBNeVVuaWZvcm1zXHJcbntcclxuICAgIHVNb2RlbFZpZXdNYXRyaXg6IE1hdDRcclxuICAgIHVQcm9qZWN0aW9uTWF0cml4OiBNYXQ0XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdTY2VuZShnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcm9ncmFtOiBQcm9ncmFtPFNpbXBsZVZlcnRleCwgTXlVbmlmb3Jtcz4sIFxyXG4gICAgdmJ1ZmZlcjogVmVydGV4QnVmZmVyPFNpbXBsZVZlcnRleD4sIGlidWZmZXI6IEluZGV4QnVmZmVyLCB1bmlmb3JtczogTXlVbmlmb3JtcykgXHJcbntcclxuICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMS4wKTsgIC8vIENsZWFyIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcclxuICAgIGdsLmNsZWFyRGVwdGgoMS4wKTsgICAgICAgICAgICAgICAgIC8vIENsZWFyIGV2ZXJ5dGhpbmdcclxuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTsgICAgICAgICAgIC8vIEVuYWJsZSBkZXB0aCB0ZXN0aW5nXHJcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTsgICAgICAgICAgICAvLyBOZWFyIHRoaW5ncyBvYnNjdXJlIGZhciB0aGluZ3NcclxuICBcclxuICAgIC8vIENsZWFyIHRoZSBjYW52YXMgYmVmb3JlIHdlIHN0YXJ0IGRyYXdpbmcgb24gaXQuXHJcbiAgXHJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcblxyXG4gICAgcHJvZ3JhbS5kcmF3RWxlbWVudHMgKGdsLlRSSUFOR0xFX1NUUklQLCB2YnVmZmVyLCBpYnVmZmVyLCB1bmlmb3JtcylcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG1haW4gKClcclxue1xyXG4gICAgbGV0IHZlcnRpY2VzOiBTaW1wbGVWZXJ0ZXhbXSA9IFtcclxuICAgICAgICB7IGFWZXJ0ZXhQb3NpdGlvbjogbmV3VmVjMi5pbml0ICgxLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAxKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIC0xKSB9LFxyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKC0xLCAtMSkgfVxyXG4gICAgXVxyXG4gICAgbGV0IGluZGljZXMgPSBbIDAsIDEsIDIsIDMgXVxyXG4gICAgbGV0IHVuaWZvcm1zOiBNeVVuaWZvcm1zID0ge1xyXG4gICAgICAgIHVNb2RlbFZpZXdNYXRyaXg6IG5ld01hdDQudHJhbnNsYXRpb24gKFswLjAsIDAuMCwgLTQuMF0pLFxyXG4gICAgICAgIHVQcm9qZWN0aW9uTWF0cml4OiBuZXdNYXQ0LnBlcnNwZWN0aXZlICgtMSwgMSwgLTEsIDEsIDEsIDEwMClcclxuICAgIH1cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dsQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxyXG4gICAgbGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcclxuXHJcbiAgICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KFwiVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBvciBtYWNoaW5lIG1heSBub3Qgc3VwcG9ydCBpdC5cIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IHZlcnRTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ3ZlcnRleCcsIHZzU291cmNlKVxyXG4gICAgbGV0IGZyYWdTaGFkZXIgPSBuZXcgU2hhZGVyIChnbCwgJ2ZyYWdtZW50JywgZnNTb3VyY2UpXHJcblxyXG4gICAgbGV0IHByb2dyYW0gPSBuZXcgUHJvZ3JhbTxTaW1wbGVWZXJ0ZXgsIE15VW5pZm9ybXM+IChnbCxcclxuICAgICAgICBbIHZlcnRTaGFkZXIsIGZyYWdTaGFkZXIgXSxcclxuICAgICAgICBbIFZBdHRyLnZlYzQgKCdhVmVydGV4UG9zaXRpb24nKSBdLFxyXG4gICAgICAgIFsgVW5pZi5tYXQ0ICgndU1vZGVsVmlld01hdHJpeCcpLCBVbmlmLm1hdDQgKCd1UHJvamVjdGlvbk1hdHJpeCcpIF0pXHJcblxyXG4gICAgbGV0IHZidWZmZXIgPSBuZXcgVmVydGV4QnVmZmVyIChnbCwgcHJvZ3JhbS52ZXJ0ZXhEZWYsIHZlcnRpY2VzKVxyXG4gICAgbGV0IGlidWZmZXIgPSBuZXcgSW5kZXhCdWZmZXIgKGdsLCBpbmRpY2VzKVxyXG5cclxuICAgIGRyYXdTY2VuZSAoZ2wsIHByb2dyYW0sIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5tYWluICgpXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Rlc3QudHMiLCJpbXBvcnQgKiBhcyBGTWF0aCBmcm9tIFwiLi9GTWF0aFwiXHJcbmltcG9ydCB7IERpbSwgVmVjLCBWZWMyLCBWZWMzLCBWZWM0LCBOZXdWZWMgfSBmcm9tIFwiLi9WZWN0b3JzXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4vQXJyYXlIZWxwZXJcIjtcclxuXHJcbmNsYXNzIE5ld0FycmF5VmVjIGltcGxlbWVudHMgTmV3VmVjPFZlYzI+LCBOZXdWZWM8VmVjMz4sIE5ld1ZlYzxWZWM0PlxyXG57XHJcbiAgICBwcml2YXRlIGRpbWVuc2lvbnM6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkaW1zOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gZGltc1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCAwKSlcclxuICAgIH1cclxuXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+ICh0aGlzLmRpbWVuc2lvbnMpLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVmVjMiAmIFZlYzMgJiBWZWM0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh2YWx1ZXMpXHJcbiAgICB9XHJcblxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAoYXJyYXkubGVuZ3RoICE9IHRoaXMuZGltZW5zaW9ucylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYEV4cGVjdGVkICR7dGhpcy5kaW1lbnNpb25zfSBjb21wb25lbnRzLmApXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoYXJyYXkpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdWZWMyOiBOZXdWZWM8VmVjMj4gPSBuZXcgTmV3QXJyYXlWZWMgKDIpXHJcbmV4cG9ydCBjb25zdCBuZXdWZWMzOiBOZXdWZWM8VmVjMz4gPSBuZXcgTmV3QXJyYXlWZWMgKDMpXHJcbmV4cG9ydCBjb25zdCBuZXdWZWM0OiBOZXdWZWM8VmVjND4gPSBuZXcgTmV3QXJyYXlWZWMgKDQpXHJcblxyXG5jbGFzcyBBcnJheVZlYyBpbXBsZW1lbnRzIFZlYzIsIFZlYzMsIFZlYzRcclxue1xyXG4gICAgcHJpdmF0ZSBhcnJheTogbnVtYmVyW11cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAodmFsdWVzOiBudW1iZXJbXSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFycmF5ID0gdmFsdWVzXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRpbWVuc2lvbnMgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aFxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5W2luZGV4XVxyXG4gICAgfVxyXG5cclxuICAgIHdpdGggKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwICgodiwgaSwgYSkgPT4gaSA9PSBpbmRleCA/IHZhbHVlIDogdikpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHggKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS54XSB9XHJcbiAgICBzZXQgeCAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS54XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgeSAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnldIH1cclxuICAgIHNldCB5ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnldID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB6ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0uel0gfVxyXG4gICAgc2V0IHogKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0uel0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHcgKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS53XSB9XHJcbiAgICBzZXQgdyAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS53XSA9IHZhbHVlIH1cclxuICAgIFxyXG4gICAgc3dpenpsZSAoY29vcmRzOiBEaW1bXSk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBBcnJheSAoY29vcmRzLmxlbmd0aClcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgcmVzW2ldID0gdGhpcy5hcnJheVtjb29yZHNbaV1dXHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcCAob3BlcjogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0aGlzLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAodilcclxuICAgICAgICAgICAgfSkpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAyIChvdGhlcjogQXJyYXlWZWMsIG9wZXI6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0aGlzLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAodiwgb3RoZXIuYXJyYXlbaV0pXHJcbiAgICAgICAgICAgIH0pKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVkdWNlIChvcGVyOiAoYWNjOiBudW1iZXIsIHg6IG51bWJlcikgPT4gbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkucmVkdWNlIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyIChjLCB2KVxyXG4gICAgICAgICAgICB9LCAwKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW5TcXIgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZSAoKGEsIHgpID0+IGEgKyAoeCAqIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBsZW4gKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQgKHRoaXMubGVuU3FyKVxyXG4gICAgfVxyXG5cclxuICAgIGludiAoKSA6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IC14KVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggKiB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggKiBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBkaXYgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAvIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAvIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIG5vcm0gKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGwgPSB0aGlzLmxlblxyXG4gICAgICAgIGlmIChsID09IDApXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiQ2Fubm90IG5vcm1hbGl6ZSB6ZXJvIHZlY3RvclwiKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiB4IC8gbClcclxuICAgIH1cclxuXHJcbiAgICBlcXVhbHMgKG90aGVyOiBBcnJheVZlYyk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA9PT0gb3RoZXIuYXJyYXlbaV1cclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhcHByb3hFcXVhbHMgKG90aGVyOiBBcnJheVZlYywgZXBzaWxvbjogbnVtYmVyID0gMC4wMDAwMDEpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZNYXRoLmFwcHJveEVxdWFscyAodiwgb3RoZXIuYXJyYXlbaV0sIGVwc2lsb24pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZG90IChvdGhlcjogQXJyYXlWZWMpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5yZWR1Y2UgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoYzogbnVtYmVyLCB2OiBudW1iZXIsIGk6IG51bWJlciwgYTogbnVtYmVyW10pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjICsgKHYgKiBvdGhlci5hcnJheVtpXSkgXHJcbiAgICAgICAgICAgIH0sIDApXHJcbiAgICB9XHJcblxyXG4gICAgY3Jvc3MgKG90aGVyOiBBcnJheVZlYyk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAoW1xyXG4gICAgICAgICAgICB0aGlzLnkgKiBvdGhlci56IC0gdGhpcy56ICogb3RoZXIueSxcclxuICAgICAgICAgICAgdGhpcy56ICogb3RoZXIueCAtIHRoaXMueCAqIG90aGVyLnosXHJcbiAgICAgICAgICAgIHRoaXMueCAqIG90aGVyLnkgLSB0aGlzLnkgKiBvdGhlci54XSlcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgYWJzICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoTWF0aC5hYnMpXHJcbiAgICB9XHJcblxyXG4gICAgZmxvb3IgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmZsb29yKVxyXG4gICAgfVxyXG5cclxuICAgIGNlaWwgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmNlaWwpXHJcbiAgICB9XHJcblxyXG4gICAgcm91bmQgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLnJvdW5kKVxyXG4gICAgfVxyXG5cclxuICAgIGZyYWN0ICgpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoRk1hdGguZnJhY3QpXHJcbiAgICB9XHJcblxyXG4gICAgY2xhbXAgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IEZNYXRoLmNsYW1wICh4LCBtaW4sIG1heCkpXHJcbiAgICB9XHJcblxyXG4gICAgbWl4IChvdGhlcjogQXJyYXlWZWMsIGludGVyUG9zOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4gRk1hdGgubWl4ICh4LCB5LCBpbnRlclBvcykpXHJcbiAgICB9XHJcblxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguc3RlcCAoZWRnZSwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguc21vb3RoU3RlcCAoZWRnZUxvd2VyLCBlZGdlVXBwZXIsIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLmFycmF5LmpvaW4gKFwiIFwiKSArIFwiXVwiXHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgfVxyXG5cclxuICAgIHRvRmxvYXQzMkFycmF5ICgpOiBGbG9hdDMyQXJyYXlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSAodGhpcy5hcnJheSlcclxuICAgIH1cclxuXHJcbiAgICBuZXdWZWMgKCk6IE5ld0FycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBOZXdBcnJheVZlYyAodGhpcy5kaW1lbnNpb25zKVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9BcnJheVZlYy50cyIsIi8qKlxyXG4gKiBFbnVtZXJhdGlvbiB0aGF0IGRlZmluZXMgdGhlIGNvb3JkaW5hdGUgZGltZW5zaW9ucyB1c2VkIGluIHRoZSB2ZWN0b3IgdHlwZXMuXHJcbiAqL1xyXG5leHBvcnQgZW51bSBEaW0gXHJcbntcclxuICAgIHggPSAwLFxyXG4gICAgeSA9IDEsIFxyXG4gICAgeiA9IDIsXHJcbiAgICB3ID0gM1xyXG59XHJcblxyXG4vKiogXHJcbiAqIEJhc2UgaW50ZXJmYWNlIGZvciBhbGwgdmVjdG9yeSB0eXBlcy4gRGVmaW5lcyBtZXRob2RzIHRoYXQgaGF2ZSB0aGUgc2FtZSBzaWduYXR1cmVcclxuICogaW4gYWxsIHZlY3RvciB2YXJpYW50cy5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjPFYgZXh0ZW5kcyBWZWM8Vj4+XHJcbntcclxuICAgIC8qKlxyXG4gICAgICogTnVtYmVyIGRpbWVuc2lvbnMgaW4gdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgZGltZW5zaW9uczogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBvbmUgb3IgbW9yZSBjb21wb25lbnRzIG9mIHRoZSB2ZWN0b3IgaW4gYXJiaXRyYXJ5IG9yZGVyLiBUaGUgY29tcG9uZW50c1xyXG4gICAgICogcmV0dXJuZWQgZGVwZW5kIG9uIHRoZSBkaW1lbnNpb25zIHNwZWNpZmllZCBpbiB0aGUgY29vcmRzIGFyZ3VtZW50LiBOb3RlIHRoYXRcclxuICAgICAqIHRoZSBzYW1lIGNvbXBvbmVudCBjYW4gb2NjdXIgbXVsdGlwbGUgdGltZXMgaW4gY29vcmRzLiBTbywgaXQgaXMgdmFsaWQgdG8gY2FsbFxyXG4gICAgICogdGhlIGZ1bmN0aW9uIGxpa2UgdGhpczpcclxuICAgICAqIFxyXG4gICAgICogc3dpenpsZSAoW0RpbS54LCBEaW0ueCwgRGltLnldKVxyXG4gICAgICovXHJcbiAgICBzd2l6emxlIChjb29yZHM6IERpbVtdKTogbnVtYmVyW11cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGxlbmdodCBvZiB0aGUgdmVjdG9yIHNxdWFyZWQuIEZhc3RlciB0byBjYWxjdWxhdGUgdGhhbiB0aGUgYWN0dWFsIGxlbmd0aCxcclxuICAgICAqIGFuZCB1c2VmdWwgZm9yIGNvbXBhcmluZyB2ZWN0b3IgbWFnbml0dWRlcy5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbGVuU3FyOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogTGVuZ3RoIG9mIHRoZSB2ZWN0b3IuXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IGxlbjogbnVtYmVyXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3Rvci4gRm9ybWF0dGVkIGxpa2UgdGhpczogW3ggeSB6XVxyXG4gICAgICovXHJcbiAgICBjb21wb25lbnQgKGluZGV4OiBudW1iZXIpOiBudW1iZXJcclxuICAgIHdpdGggKGluZGV4OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpOiBWXHJcbiAgICB0b1N0cmluZyAoKTogc3RyaW5nXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAgbmV3VmVjICgpOiBOZXdWZWM8Vj5cclxuICAgIFxyXG4gICAgaW52ICgpOiBWXHJcbiAgICBhZGQgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgc3ViIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIG11bCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBkaXYgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbm9ybSAoKTogVlxyXG4gICAgZXF1YWxzIChvdGhlcjogVik6IGJvb2xlYW5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IFYsIGVwc2lsb24/OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICBkb3QgKG90aGVyOiBWKTogbnVtYmVyXHJcbiAgICBhYnMgKCk6IFZcclxuICAgIGZsb29yICgpOiBWXHJcbiAgICBjZWlsICgpOiBWXHJcbiAgICByb3VuZCAoKTogVlxyXG4gICAgZnJhY3QgKCk6IFZcclxuICAgIGNsYW1wIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBWXHJcbiAgICBtaXggKG90aGVyOiBWLCBpbnRlclBvczogbnVtYmVyKTogVlxyXG4gICAgc3RlcCAoZWRnZTogbnVtYmVyKTogVlxyXG4gICAgc21vb3RoU3RlcCAoZWRnZUxvd2VyOiBudW1iZXIsIGVkZ2VVcHBlcjogbnVtYmVyKTogVlxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ld1ZlYzxWIGV4dGVuZHMgVmVjPFY+PlxyXG57XHJcbiAgICByZWFkb25seSB6ZXJvOiBWXHJcbiAgICB1bmlmICh4OiBudW1iZXIpOiBWXHJcbiAgICBpbml0ICguLi52YWx1ZXM6IG51bWJlcltdKTogVlxyXG4gICAgZnJvbUFycmF5IChhcnJheTogbnVtYmVyW10pOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMiBleHRlbmRzIFZlYzxWZWMyPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzMgZXh0ZW5kcyBWZWM8VmVjMz5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG5cclxuICAgIGNyb3NzIChvdGhlcjogVmVjMyk6IFZlYzNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWM0IGV4dGVuZHMgVmVjPFZlYzQ+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbiAgICB6OiBudW1iZXJcclxuICAgIHc6IG51bWJlclxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1ZlY3RvcnMudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTmV3TWF0NCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcbmltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0ICogYXMgQXJyYXlIZWxwZXIgZnJvbSBcIi4vQXJyYXlIZWxwZXJcIjtcclxuXHJcbmNsYXNzIE5ld0FycmF5TWF0IGltcGxlbWVudHMgTmV3TWF0PE1hdDIsIFZlYzI+LCBOZXdNYXQ8TWF0MywgVmVjMz4sIE5ld01hdDRcclxue1xyXG4gICAgcmVhZG9ubHkgcm93czogbnVtYmVyXHJcbiAgICByZWFkb25seSBjb2xzOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihyb3dzOiBudW1iZXIsIGNvbHM6IG51bWJlcikgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5yb3dzID0gcm93c1xyXG4gICAgICAgIHRoaXMuY29scyA9IGNvbHNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlkZW50aXR5QXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHIgKiBjKSwgMClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChyLCBjKTsgaSsrKSBcclxuICAgICAgICAgICAgYXJyW2kgKiByICsgaV0gPSAxXHJcbiAgICAgICAgcmV0dXJuIGFyclxyXG4gICAgfVxyXG5cclxuICAgIGdldCB6ZXJvICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChBcnJheUhlbHBlci5maWxsIChBcnJheTxudW1iZXI+KHIgKiBjKSwgMCksIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlkZW50aXR5ICgpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmlkZW50aXR5QXJyYXkgKCksIHRoaXMucm93cywgdGhpcy5jb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0aW9uIChvZmZzZXRzOiBudW1iZXJbXXxWZWMyfFZlYzN8VmVjNCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBvZmZzID0gb2Zmc2V0cyBpbnN0YW5jZW9mIEFycmF5ID8gb2Zmc2V0cyA6IG9mZnNldHMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChvZmZzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBvZmZzZXRzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBsYXN0Q29sID0gYyAtIDFcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE1hdGgubWluIChvZmZzLmxlbmd0aCwgciAtIDEpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbbGFzdENvbCAqIHIgKyBpXSA9IG9mZnNbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGluZyAoZmFjdG9yczogbnVtYmVyW118VmVjMnxWZWMzfFZlYzQpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgZmFjcyA9IGZhY3RvcnMgaW5zdGFuY2VvZiBBcnJheSA/IGZhY3RvcnMgOmZhY3RvcnMudG9BcnJheSAoKVxyXG4gICAgICAgIGlmIChmYWNzLmxlbmd0aCA+IHIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBUb28gbWFueSBmYWN0b3JzIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKGZhY3MubGVuZ3RoLCByLCBjKTsgaSsrKVxyXG4gICAgICAgICAgICByZXMgW2kgKiByICsgaV0gPSBmYWNzW2ldXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByLCBjKVxyXG4gICAgfVxyXG5cclxuICAgIHJvdGF0aW9uWCAoYW5nbGU6IG51bWJlcik6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGlmIChyIDwgMyB8fCBjIDwgMylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFJvdGF0aW9uIGFyb3VuZCBYLWF4aXMgbm90IGRlZmluZWQgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzW3IgKyAxXSA9IGNvc2FcclxuICAgICAgICByZXNbciArIDJdID0gc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDFdID0gLXNpbmFcclxuICAgICAgICByZXNbMiAqIHIgKyAyXSA9IGNvc2FcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25ZIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFktYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbMF0gPSBjb3NhO1xyXG4gICAgICAgIHJlc1syXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1syICogcl0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25aIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzFdID0gc2luYTtcclxuICAgICAgICByZXNbcl0gPSAtc2luYTtcclxuICAgICAgICByZXNbciArIDFdID0gY29zYTtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcGVyc3BlY3RpdmUgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBpZiAoek5lYXIgPD0gMCB8fCB6TmVhciA+PSB6RmFyKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcInpOZWFyIG5lZWRzIHRvIGJlIHBvc2l0aXZlIGFuZCBzbWFsbGVyIHRoYXRuIHpGYXJcIilcclxuICAgICAgICBsZXQgd2lkdGggPSByaWdodCAtIGxlZnRcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdG9wIC0gYm90dG9tXHJcbiAgICAgICAgbGV0IGRlcHRoID0gekZhciAtIHpOZWFyXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsoMi4wICogek5lYXIpIC8gd2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsICgyLjAgKiB6TmVhcikgLyBoZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIChyaWdodCArIGxlZnQpIC8gd2lkdGgsICh0b3AgKyBib3R0b20pIC8gaGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgLyBkZXB0aCwgLTEsXHJcbiAgICAgICAgICAgIDAsIDAsIC0oMi4wICogekZhciAqIHpOZWFyKSAvIGRlcHRoLCAwXSwgXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgb3J0aG9ncmFwaGljIChsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlcixcclxuICAgICAgICB6TmVhcjogbnVtYmVyLCB6RmFyOiBudW1iZXIpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGludldpZHRoID0gMS4wIC8gKHJpZ2h0IC0gbGVmdClcclxuICAgICAgICBsZXQgaW52SGVpZ2h0ID0gMS4wIC8gKHRvcCAtIGJvdHRvbSlcclxuICAgICAgICBsZXQgaW52RGVwdGggPSAxLjAgLyAoekZhciAtIHpOZWFyKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKFxyXG4gICAgICAgICAgICBbMiAqIGludldpZHRoLCAwLCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAyICogaW52SGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAtMiAqIGludkRlcHRoLCAwLFxyXG4gICAgICAgICAgICAtKHJpZ2h0ICsgbGVmdCkgKiBpbnZXaWR0aCwgLSh0b3AgKyBib3R0b20pICogaW52SGVpZ2h0LCAtKHpGYXIgKyB6TmVhcikgKiBpbnZEZXB0aCwgMV0sXHJcbiAgICAgICAgICAgIDQsIDQpXHJcbiAgICB9XHJcblxyXG4gICAgbG9va0F0IChkaXJlY3Rpb246IFZlYzMsIHVwOiBWZWMzKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB6YXhpcyA9IGRpcmVjdGlvbi5pbnYgKCkubm9ybSAoKVxyXG4gICAgICAgIGxldCB4YXhpcyA9IHVwLmNyb3NzICh6YXhpcykubm9ybSAoKVxyXG4gICAgICAgIGxldCB5YXhpcyA9IHpheGlzLmNyb3NzICh4YXhpcylcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFt4YXhpcy54LCB5YXhpcy54LCB6YXhpcy54LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy55LCB5YXhpcy55LCB6YXhpcy55LCAwLFxyXG4gICAgICAgICAgICB4YXhpcy56LCB5YXhpcy56LCB6YXhpcy56LCAwLFxyXG4gICAgICAgICAgICAwLCAwLCAwLCAxXSwgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2xzOiBudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyYXksIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQyOiBOZXdNYXQ8TWF0MiwgVmVjMj4gPSBuZXcgTmV3QXJyYXlNYXQgKDIsIDIpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQzOiBOZXdNYXQ8TWF0MywgVmVjMz4gPSBuZXcgTmV3QXJyYXlNYXQgKDMsIDMpXHJcbmV4cG9ydCBjb25zdCBuZXdNYXQ0OiBOZXdNYXQ0ID0gbmV3IE5ld0FycmF5TWF0ICg0LCA0KVxyXG5cclxuY2xhc3MgQXJyYXlNYXQgaW1wbGVtZW50cyBNYXQyLCBNYXQzLCBNYXQ0XHJcbntcclxuICAgIHJlYWRvbmx5IHJvd3M6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgY29sczogbnVtYmVyXHJcblxyXG4gICAgcHJpdmF0ZSBhcnJheTogbnVtYmVyW11cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKHZhbHVlczogbnVtYmVyW10sIHJvd3M6IG51bWJlciwgY29sdW1uczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPT0gcm93cyAqY29sdW1ucylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJBcnJheSBsZW5ndGggaGFzIHRvIGJlIGVxdWVhbCByb3dzICogY29sdW1ucy5cIikgXHJcbiAgICAgICAgdGhpcy5hcnJheSA9IHZhbHVlc1xyXG4gICAgICAgIHRoaXMucm93cyA9IHJvd3NcclxuICAgICAgICB0aGlzLmNvbHMgPSBjb2x1bW5zICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBlbGVtZW50IChyb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVtjb2x1bW4gKiB0aGlzLnJvd3MgKyByb3ddXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXAgKG9wZXI6ICh4OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYpXHJcbiAgICAgICAgICAgIH0pLCB0aGlzLmNvbHMsIHRoaXMucm93cylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheU1hdCwgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbHMgIT0gb3RoZXIuY29scyB8fCB0aGlzLnJvd3MgIT0gb3RoZXIucm93cylcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJNYXRyaXggZGltZW5zaW9ucyBtdXN0IG1hdGNoLlwiKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWF0cml4TXVsdGlwbHkgKG90aGVyOiBBcnJheU1hdCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgbSA9IHRoaXMuY29sc1xyXG4gICAgICAgIGxldCBxID0gb3RoZXIucm93c1xyXG4gICAgICAgIGxldCBwID0gb3RoZXIuY29sc1xyXG4gICAgICAgIGlmIChtICE9PSBxKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgQ2Fubm90IG11bHRpcGx5ICR7bn14JHttfSBtYXRyaXggd2l0aCAke3F9eCR7cH0gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcj4gKG4gKiBwKVxyXG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByb3dzIGFuZCBjb2x1bW5zXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcDsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdW0gdXAgcm93cyBmcm9tIHRoaXMgd2l0aCBjb2x1bW5zIGZyb20gb3RoZXIgbWF0cml4LlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbCA9IDBcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbTsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbCArPSB0aGlzLmFycmF5W2sgKiBuICsgaV0gKiBvdGhlci5hcnJheVtqICogcSArIGtdXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIG4gKyBpXSA9IHZhbCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgbiwgcClcclxuICAgIH1cclxuXHJcbiAgICBhZGQgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCAoeCwgeSkgPT4geCArIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCArIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHN1YiAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4IC0geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC0gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbXVsIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXRyaXhNdWx0aXBseSAob3RoZXIpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zZm9ybTxWIGV4dGVuZHMgVmVjPFY+PiAob3RoZXI6IFYpOiBWXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZlY20gPSBuZXcgQXJyYXlNYXQgKG90aGVyLnRvQXJyYXkgKCksIHRoaXMuY29scywgMSlcclxuICAgICAgICByZXR1cm4gb3RoZXIubmV3VmVjICgpLmZyb21BcnJheSAodGhpcy5tYXRyaXhNdWx0aXBseSAodmVjbSkuYXJyYXkpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNwb3NlICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IGNvbHMgPSB0aGlzLnJvd3NcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAodGhpcy5hcnJheS5sZW5ndGgpXHJcbiAgICAgICAgbGV0IGluZCA9IDBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xzOyBqKyspXHJcbiAgICAgICAgICAgICAgICByZXNbaiAqIHJvd3MgKyBpXSA9IHRoaXMuYXJyYXlbaW5kKytdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIGRldGVybWluYW50ICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kZXRlcm1pbmFudEZBICgpO1xyXG4gICAgfVxyXG5cclxuICAgIGludmVydCAoKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gQXJyYXlNYXQuZnJvbUphZ2dlZEFycmF5ICh0aGlzLmludmVyc2VGQSAoKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRvSmFnZ2VkQXJyYXkgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzLCBjb2xzLCBhcnJheSB9ID0gdGhpc1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXJbXT4gKHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXNbcl0gPSBBcnJheTxudW1iZXI+KGNvbHMpXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICAgICAgcmVzW3JdW2NdID0gYXJyYXlbYyAqIHJvd3MgKyByXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJvbUphZ2dlZEFycmF5IChtYXRyaXg6IG51bWJlcltdW10pOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIGxldCByb3dzID0gbWF0cml4Lmxlbmd0aFxyXG4gICAgICAgIGxldCBjb2xzID0gbWF0cml4WzBdLmxlbmd0aFxyXG4gICAgICAgIGxldCBhcnIgPSBBcnJheTxudW1iZXI+KGNvbHMgKiByb3dzKVxyXG4gICAgICAgIGxldCBpID0gMFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29sczsgYysrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGFycltpKytdID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoYXJyLCByb3dzLCBjb2xzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGVjb21wb3NlRkEgKG1hdHJpeDogbnVtYmVyW11bXSk6IFsgbnVtYmVyW10sIG51bWJlciBdIFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMgfSA9IHRoaXNcclxuICAgICAgICBpZiAocm93cyAhPSBjb2xzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkNhbm5vdCBkZWNvbXBvc2Ugbm9uLXNxdWFyZSBtYXRyaXhcIilcclxuICAgICAgICAvLyBzZXQgdXAgcm93IHBlcm11dGF0aW9uIHJlc3VsdFxyXG4gICAgICAgIGxldCBwZXJtID0gQXJyYXk8bnVtYmVyPihyb3dzKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKSBcclxuICAgICAgICAgICAgcGVybVtpXSA9IGlcclxuICAgICAgICAvLyB0b2dnbGUgdHJhY2tzIHJvdyBzd2Fwcy4gKzEgLT4gZXZlbiwgLTEgLT4gb2RkLiB1c2VkIGJ5IE1hdHJpeERldGVybWluYW50XHJcbiAgICAgICAgbGV0IHRvZ2dsZSA9IDE7IFxyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29scyAtIDE7IGMrKykgLy8gZWFjaCBjb2x1bW5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb2xNYXggPSBNYXRoLmFicyAobWF0cml4W2NdW2NdKSAvLyBmaW5kIGxhcmdlc3QgdmFsdWUgaW4gY29sIGpcclxuICAgICAgICAgICAgbGV0IHBSb3cgPSBjXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbcl1bY10gPiBjb2xNYXgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sTWF4ID0gbWF0cml4W3JdW2NdXHJcbiAgICAgICAgICAgICAgICAgICAgcFJvdyA9IHJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBSb3cgIT0gYykgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGxhcmdlc3QgdmFsdWUgbm90IG9uIHBpdm90LCBzd2FwIHJvd3NcclxuICAgICAgICAgICAgICAgIGxldCByb3dQdHIgPSBtYXRyaXhbcFJvd11cclxuICAgICAgICAgICAgICAgIG1hdHJpeFtwUm93XSA9IG1hdHJpeFtjXVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdID0gcm93UHRyXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgc3dhcCBwZXJtIGluZm9cclxuICAgICAgICAgICAgICAgIGxldCB0bXAgPSBwZXJtW3BSb3ddXHJcbiAgICAgICAgICAgICAgICBwZXJtW3BSb3ddID0gcGVybVtjXVxyXG4gICAgICAgICAgICAgICAgcGVybVtjXSA9IHRtcFxyXG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IHRoZSByb3ctc3dhcCB0b2dnbGVcclxuICAgICAgICAgICAgICAgIHRvZ2dsZSA9IC10b2dnbGUgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgbWF0cml4IGlzIHNpbmd1bGFyXHJcbiAgICAgICAgICAgIGlmIChtYXRyaXhbY11bY10gPT0gMClcclxuICAgICAgICAgICAgICAgIG1hdHJpeFtjXVtjXSA9IDAuMDAwMDAxXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSBjICsgMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWF0cml4W3JdW2NdIC89IG1hdHJpeFtjXVtjXVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IGMgKyAxOyBrIDwgY29sczsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFtyXVtrXSAtPSBtYXRyaXhbcl1bY10gKiBtYXRyaXhbY11ba11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWyBwZXJtLCB0b2dnbGUgXVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZGV0ZXJtaW5hbnRGQSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IHRoaXMudG9KYWdnZWRBcnJheSAoKVxyXG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzFdXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRyaXgubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHJlc3VsdCAqPSBtYXRyaXhbaV1baV1cclxuICAgICAgICByZXR1cm4gcmVzdWx0XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbnZlcnNlRkEgKCk6IG51bWJlcltdW11cclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IEFycmF5SGVscGVyLmNsb25lIChtYXRyaXgpXHJcbiAgICAgICAgbGV0IHBlcm0gPSB0aGlzLmRlY29tcG9zZUZBIChtYXRyaXgpWzBdXHJcbiAgICAgICAgbGV0IGIgPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByb3dzOyBjKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIGJbcl0gPSBjID09IHBlcm1bcl0gPyAxIDogMFxyXG4gICAgICAgICAgICBsZXQgeCA9IEFycmF5TWF0LmhlbHBlclNvbHZlZiAobWF0cml4LCBiKSBcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCByb3dzOyByKyspXHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcl1bY10gPSB4W3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBoZWxwZXJTb2x2ZWYgKGx1TWF0cml4OiBudW1iZXJbXVtdLCB2ZWN0b3I6IG51bWJlcltdKTogbnVtYmVyW10gXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmVmb3JlIGNhbGxpbmcgdGhpcyBoZWxwZXIsIHBlcm11dGUgYiB1c2luZyB0aGUgcGVybSBhcnJheSBmcm9tIFxyXG4gICAgICAgIC8vIE1hdHJpeERlY29tcG9zZSB0aGF0IGdlbmVyYXRlZCBsdU1hdHJpeFxyXG4gICAgICAgIGxldCByb3dzID0gbHVNYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IHJlcyA9IHZlY3Rvci5zbGljZSAoKVxyXG5cclxuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCByOyBjKyspXHJcbiAgICAgICAgICAgICAgICBzdW0gLT0gbHVNYXRyaXhbcl1bY10gKiByZXNbY11cclxuICAgICAgICAgICAgcmVzW3JdID0gc3VtXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc1tyb3dzIC0gMV0gLz0gbHVNYXRyaXhbcm93cyAtIDFdW3Jvd3MgLSAxXVxyXG4gICAgICAgIGZvciAobGV0IHIgPSByb3dzIC0gMjsgciA+PSAwOyByLS0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gcmVzW3JdXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSByICsgMTsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW0gLyBsdU1hdHJpeFtyXVtyXVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5TWF0KTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5TWF0LCBlcHNpbG9uPzogbnVtYmVyKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBGTWF0aC5hcHByb3hFcXVhbHMgKHYsIG90aGVyLmFycmF5W2ldLCBlcHNpbG9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHtcclxuICAgICAgICBsZXQgcmVzID0gXCJcIlxyXG4gICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgdGhpcy5yb3dzOyByKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXMgKz0gXCJbIFwiXHJcbiAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgdGhpcy5jb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXMgKz0gdGhpcy5lbGVtZW50KHIsIGMpICsgXCIgXCJcclxuICAgICAgICAgICAgcmVzICs9IFwiXVxcblwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgIH1cclxuXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkgKHRoaXMuYXJyYXkpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQXJyYXlNYXQudHMiLCJleHBvcnQgdHlwZSBTaGFkZXJUeXBlID0gJ3ZlcnRleCcgfCAnZnJhZ21lbnQnXHJcblxyXG5leHBvcnQgY2xhc3MgU2hhZGVyXHJcbntcclxuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxyXG4gICAgcmVhZG9ubHkgZ2xTaGFkZXI6IFdlYkdMU2hhZGVyXHJcbiAgICByZWFkb25seSB0eXBlOiBTaGFkZXJUeXBlXHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHR5cGU6IFNoYWRlclR5cGUsIHNvdXJjZTogc3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBnbFxyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcclxuICAgICAgICBsZXQgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2xTaGFkZXJUeXBlKTtcclxuICAgICAgICBpZiAoc2hhZGVyID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoYEZhaWxlZCB0byBjcmVhdGUgJHt0eXBlfSBzaGFkZXIuYClcclxuICAgICAgICBcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZXJyb3IgPSAnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAnICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpXHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nbFNoYWRlciA9IHNoYWRlclxyXG4gICAgfVxyXG5cclxuICAgIGdldCBnbFNoYWRlclR5cGUgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICd2ZXJ0ZXgnID8gXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuVkVSVEVYX1NIQURFUiA6IFxyXG4gICAgICAgICAgICB0aGlzLmdsLkZSQUdNRU5UX1NIQURFUlxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1NoYWRlci50cyIsImltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiO1xyXG5pbXBvcnQgeyBWZXJ0ZXhBdHRyLCBWZXJ0ZXhBdHRyVHlwZSwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQnVmZmVyIGV4dGVuZHMgR0xSZXNvdXJjZVxyXG57XHJcbiAgICByZWFkb25seSB0YXJnZXQ6IG51bWJlclxyXG4gICAgcmVhZG9ubHkgZ2xCdWZmZXI6IFdlYkdMQnVmZmVyXHJcbiAgICByZWFkb25seSBsZW5ndGg6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB0YXJnZXQ6IG51bWJlciwgZ2xCdWZmZXI6IFdlYkdMQnVmZmVyLCBsZW5ndGg6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXRcclxuICAgICAgICB0aGlzLmdsQnVmZmVyID0gZ2xCdWZmZXJcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aFxyXG4gICAgfVxyXG5cclxuICAgIHVzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIHRoaXMuZ2xCdWZmZXIpXHJcbiAgICB9XHJcblxyXG4gICAgcmVsZWFzZSAoKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wuYmluZEJ1ZmZlciAodGhpcy50YXJnZXQsIG51bGwpXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhCdWZmZXI8Vj4gZXh0ZW5kcyBCdWZmZXIgXHJcbntcclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPiwgdmVydGljZXM6IFZbXSlcclxuICAgIHtcclxuICAgICAgICBsZXQgYnVmID0gZ2wuY3JlYXRlQnVmZmVyICgpXHJcbiAgICAgICAgaWYgKGJ1ZiA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdGYWlsZWQgdG8gY3JlYXRlIHZlcnRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkFSUkFZX0JVRkZFUiwgYnVmLCB2ZXJ0aWNlcy5sZW5ndGgpXHJcbiAgICAgICAgdXNpbmcgKHRoaXMsICgpID0+IFxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhIChnbC5BUlJBWV9CVUZGRVIsIHRoaXMuaW5pdEJ1ZmZlciAodmVydGV4RGVmLCB2ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRCdWZmZXIgKHZlcnRleERlZjogVmVydGV4RGVmPFY+LCB2ZXJ0aWNlczogVltdKTogQXJyYXlCdWZmZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgdmVydGV4U2l6ZSA9IHZlcnRleERlZi5zdHJpZGVcclxuICAgICAgICBsZXQgbGVuID0gdmVydGljZXMubGVuZ3RoXHJcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlciAodmVydGV4U2l6ZSAqIGxlbilcclxuICAgICAgICBsZXQgdmlldyA9IG5ldyBEYXRhVmlldyAoYnVmZmVyKVxyXG4gICAgICAgIHZlcnRleERlZi52ZXJ0ZXhBdHRycy5mb3JFYWNoIChhdHRyID0+IFxyXG4gICAgICAgIHsgXHJcbiAgICAgICAgICAgIHZhciBzZXR0ZXIgPSB0aGlzLnZlcnRleEF0dHJTZXR0ZXIgKHZpZXcsIGF0dHIudHlwZSlcclxuICAgICAgICAgICAgbGV0IHR5cGVTaXplID0gYXR0ci50eXBlU2l6ZVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXR0ci5nZXR0ZXIgKHZlcnRpY2VzW2pdKVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhdHRyLm51bUNvbXBvbmVudHM7IGsrKylcclxuICAgICAgICAgICAgICAgICAgICBzZXR0ZXIgKChqICogdmVydGV4U2l6ZSkgKyBhdHRyLm9mZnNldCArIChrICogdHlwZVNpemUpLCB2YWx1ZXNba10pIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gYnVmZmVyXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2ZXJ0ZXhBdHRyU2V0dGVyICh2aWV3OiBEYXRhVmlldywgdHlwZTogVmVydGV4QXR0clR5cGUpOiBcclxuICAgICAgICAob2Zmc2V0OiBudW1iZXIsIHZhbHVlOiBudW1iZXIpID0+IHZvaWRcclxuICAgIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAnYnl0ZSc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0SW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VieXRlJzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRVaW50OCAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRJbnQxNiAob2ZmLCB2YWwpXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0VWludDE2IChvZmYsIHZhbClcclxuICAgICAgICAgICAgY2FzZSAnZmxvYXQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEZsb2F0MzIgKG9mZiwgdmFsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEluZGV4QnVmZmVyIGV4dGVuZHMgQnVmZmVyXHJcbntcclxuICAgIHJlYWRvbmx5IGdsQnVmZmVyOiBXZWJHTEJ1ZmZlclxyXG4gICAgcmVhZG9ubHkgbGVuZ3RoOiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgaW5kaWNlczogbnVtYmVyW10pXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9IGdsLmNyZWF0ZUJ1ZmZlciAoKVxyXG4gICAgICAgIGlmIChidWYgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yICgnRmFpbGVkIHRvIGNyZWF0ZSBpbmRleCBidWZmZXIuJylcclxuICAgICAgICBzdXBlciAoZ2wsIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBidWYsIGluZGljZXMubGVuZ3RoKVxyXG4gICAgICAgIHVzaW5nICh0aGlzLCAoKSA9PiBcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YSAoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MTZBcnJheSAoaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9CdWZmZXJzLnRzIiwiaW1wb3J0IHsgU2hhZGVyVHlwZSwgU2hhZGVyIH0gZnJvbSBcIi4vU2hhZGVyXCJcclxuaW1wb3J0IHsgVmVydGV4QXR0ciwgVmVydGV4RGVmIH0gZnJvbSBcIi4vVmVydGV4QXR0clwiXHJcbmltcG9ydCB7IFVuaWZvcm0sIFVuaWZvcm1EZWYgfSBmcm9tIFwiLi9Vbmlmb3Jtc1wiXHJcbmltcG9ydCB7IEdMUmVzb3VyY2UsIHVzaW5nIH0gZnJvbSBcIi4vR0xSZXNvdXJjZVwiXHJcbmltcG9ydCB7IFZlcnRleEJ1ZmZlciwgSW5kZXhCdWZmZXIgfSBmcm9tIFwiLi9CdWZmZXJzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvZ3JhbTxWLCBVPiBleHRlbmRzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xQcm9ncmFtOiBXZWJHTFByb2dyYW1cclxuICAgIHJlYWRvbmx5IHNoYWRlcnM6IFNoYWRlcltdXHJcbiAgICByZWFkb25seSB2ZXJ0ZXhEZWY6IFZlcnRleERlZjxWPlxyXG4gICAgcmVhZG9ubHkgdW5pZm9ybURlZjogVW5pZm9ybURlZjxVPlxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBcclxuICAgICAgICBzaGFkZXJzOiBTaGFkZXJbXSwgXHJcbiAgICAgICAgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXSxcclxuICAgICAgICB1bmlmb3JtczogVW5pZm9ybTxVPltdKSBcclxuICAgIHtcclxuICAgICAgICBzdXBlciAoZ2wpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzID0gc2hhZGVyc1xyXG4gICAgICAgIHRoaXMuZ2xQcm9ncmFtID0gdGhpcy5saW5rICgpXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYgPSBuZXcgVmVydGV4RGVmICh2ZXJ0ZXhBdHRycylcclxuICAgICAgICB0aGlzLnZlcnRleERlZi5pbml0VmVydGV4QXR0ckxvY2F0aW9ucyAoZ2wsIHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgICAgIHRoaXMudW5pZm9ybURlZiA9IG5ldyBVbmlmb3JtRGVmICh1bmlmb3JtcylcclxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYuaW5pdFVuaWZvcm1Mb2NhdGlvbnMgKGdsLCB0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxpbmsgKCk6IFdlYkdMUHJvZ3JhbVxyXG4gICAge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcclxuICAgICAgICBsZXQgcHJnID0gZ2wuY3JlYXRlUHJvZ3JhbSgpXHJcbiAgICAgICAgaWYgKHByZyA9PT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiRmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtXCIpXHJcbiAgICAgICAgdGhpcy5zaGFkZXJzLmZvckVhY2gocyA9PiBnbC5hdHRhY2hTaGFkZXIocHJnLCBzLmdsU2hhZGVyKSlcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcmcpO1xyXG4gICAgICBcclxuICAgICAgICBpZiAoIWdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJnLCBnbC5MSU5LX1NUQVRVUykpIFxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbTogJyArIFxyXG4gICAgICAgICAgICAgICAgZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJnKSlcclxuICAgICAgICByZXR1cm4gcHJnXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBlbmFibGVWZXJ0ZXhBdHRyQXJyYXlzICgpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbFxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoXHJcbiAgICAgICAgICAgICAgICBhdHRyLmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5udW1Db21wb25lbnRzLFxyXG4gICAgICAgICAgICAgICAgYXR0ci5nbFR5cGUgKGdsKSxcclxuICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgMCwgLy90aGlzLnZlcnRleERlZi5zdHJpZGUsXHJcbiAgICAgICAgICAgICAgICBhdHRyLm9mZnNldCk7XHJcbiAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dHIubG9jYXRpb24pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtICh0aGlzLmdsUHJvZ3JhbSlcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtIChudWxsKVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdFbGVtZW50cyAobW9kZTogbnVtYmVyLCB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8Vj4sIGlidWZmZXI6IEluZGV4QnVmZmVyLCB1bmlmb3JtczogVSlcclxuICAgIHtcclxuICAgICAgICB1c2luZyAoW3RoaXMsIHZidWZmZXIsIGlidWZmZXJdLCBnbCA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy51bmlmb3JtRGVmLnNldFZhbHVlcyAoZ2wsIHVuaWZvcm1zKVxyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVZlcnRleEF0dHJBcnJheXMgKClcclxuICAgICAgICAgICAgLy8gZ2wuZHJhd0VsZW1lbnRzIChtb2RlLCBpYnVmZmVyLmxlbmd0aCwgZ2wuVU5TSUdORURfU0hPUlQsIDApXHJcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMgKG1vZGUsIDAsIHZidWZmZXIubGVuZ3RoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUHJvZ3JhbS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCIgYXR0cmlidXRlIHZlYzQgYVZlcnRleFBvc2l0aW9uO1xcclxcbiB2YXJ5aW5nIGhpZ2hwIHZlYzMgcG9zaXRpb247XFxyXFxuIFxcclxcbiB1bmlmb3JtIG1hdDQgdU1vZGVsVmlld01hdHJpeDtcXHJcXG4gdW5pZm9ybSBtYXQ0IHVQcm9qZWN0aW9uTWF0cml4O1xcclxcblxcclxcbnZvaWQgbWFpbigpIHtcXHJcXG4gICAgcG9zaXRpb24gPSBtYXgoYVZlcnRleFBvc2l0aW9uLnh5eiwgdmVjMygwKSk7XFxyXFxuICAgIGdsX1Bvc2l0aW9uID0gdVByb2plY3Rpb25NYXRyaXggKiB1TW9kZWxWaWV3TWF0cml4ICogYVZlcnRleFBvc2l0aW9uO1xcclxcbiB9XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0XG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwidmFyeWluZyBoaWdocCB2ZWMzIHBvc2l0aW9uO1xcclxcblxcclxcbnZvaWQgbWFpbigpIHsgXFxyXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQocG9zaXRpb24sIDEuMCk7XFxyXFxufVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUuZnJhZ1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==