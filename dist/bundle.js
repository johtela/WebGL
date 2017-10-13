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

module.exports = " attribute vec4 aVertexPosition;\r\n varying highp vec3 position;\r\n \r\n uniform mat4 uModelViewMatrix;\r\n uniform mat4 uProjectionMatrix;\r\n\r\nvoid main() {\r\n    position = max(aVertexPosition.xyz, vec3(0));\r\n    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\r\n }\r\n"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "varying highp vec3 position;\r\n\r\nvoid main() { \r\n    gl_FragColor = vec4(position, 1.0);\r\n}\r\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDVjZGVmNTFiNzZjMTI4NDliYjEiLCJ3ZWJwYWNrOi8vLy4vc3JjL0ZNYXRoLnRzIiwid2VicGFjazovLy8uL3NyYy9BcnJheUhlbHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVmVydGV4QXR0ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVW5pZm9ybXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dMUmVzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Rlc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FycmF5VmVjLnRzIiwid2VicGFjazovLy8uL3NyYy9WZWN0b3JzLnRzIiwid2VicGFjazovLy8uL3NyYy9BcnJheU1hdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvU2hhZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9CdWZmZXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9Qcm9ncmFtLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS52ZXJ0Iiwid2VicGFjazovLy8uL3NyYy9zaGFkZXJzL3NpbXBsZS5mcmFnIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQSxzQkFBOEIsQ0FBUyxFQUFFLENBQVMsRUFDOUMs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QUFDO1FBQ2hFLENBQUMsQ0FBQztJQUNOLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQyxDQXZFa0MsdUJBQVUsR0F1RTVDO0FBdkVZLDBCQUFPOzs7Ozs7O0FDTnBCLGtEQUFrRCxpQ0FBaUMsd0NBQXdDLG9DQUFvQyxxQkFBcUIscURBQXFELDZFQUE2RSxNQUFNLEs7Ozs7OztBQ0E1VCw4Q0FBOEMscUJBQXFCLDRDQUE0QyxLQUFLLEsiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZDVjZGVmNTFiNzZjMTI4NDliYjEiLCJleHBvcnQgZnVuY3Rpb24gYXBwcm94RXF1YWxzICh4OiBudW1iZXIsIHk6IG51bWJlciwgXHJcbiAgICBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSkgOiBib29sZWFuXHJcbntcclxuICAgIGlmICh4ID09PSB5KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIGxldCBhYnNYID0gTWF0aC5hYnMgKHgpO1xyXG4gICAgbGV0IGFic1kgPSBNYXRoLmFicyAoeSk7XHJcbiAgICBsZXQgZGlmZiA9IE1hdGguYWJzICh4IC0geSk7XHJcblxyXG4gICAgaWYgKHggKiB5ID09IDApXHJcbiAgICAgICAgcmV0dXJuIGRpZmYgPCAoZXBzaWxvbiAqIGVwc2lsb24pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBkaWZmIC8gKGFic1ggKyBhYnNZKSA8IGVwc2lsb247XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmcmFjdCAoeDogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB4IC0gTWF0aC5mbG9vciAoeCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCAoeDogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXJcclxue1xyXG4gICAgcmV0dXJuIHggPCBtaW4gPyBtaW4gOlxyXG4gICAgICAgICAgIHggPiBtYXggPyBtYXggOlxyXG4gICAgICAgICAgIHg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXggKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBpbnRlclBvczogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiBzdGFydCArIChpbnRlclBvcyAqIChlbmQgLSBzdGFydCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RlcCAoZWRnZTogbnVtYmVyLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyXHJcbntcclxuICAgIHJldHVybiB2YWx1ZSA8IGVkZ2UgPyAwIDogMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNtb290aFN0ZXAgKGVkZ2VMb3dlcjogbnVtYmVyLCBlZGdlVXBwZXI6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IG51bWJlclxyXG57XHJcbiAgICBsZXQgdCA9IGNsYW1wICgodmFsdWUgLSBlZGdlTG93ZXIpIC8gKGVkZ2VVcHBlciAtIGVkZ2VMb3dlciksIDAsIDEpO1xyXG4gICAgcmV0dXJuIHQgKiB0ICogKDMgLSAoMiAqIHQpKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9GTWF0aC50cyIsImV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUPiAoYXJyYXk6IFRbXVtdKTogVFtdW11cclxue1xyXG4gICAgbGV0IHJvd3MgPSBhcnJheS5sZW5ndGhcclxuICAgIGxldCByZXMgPSBBcnJheTxUW10+KHJvd3MpXHJcbiAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICByZXNbcl0gPSBhcnJheVtyXS5zbGljZSAoKVxyXG4gICAgcmV0dXJuIHJlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmlsbDxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpOiBUW11cclxue1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKylcclxuICAgICAgICBhcnJheVtpXSA9IHZhbHVlXHJcbiAgICByZXR1cm4gYXJyYXlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdDxUPiAodmFsdWU6IFQsIGNvdW50OiBudW1iZXIpOiBUW11cclxue1xyXG4gICAgdmFyIHJlcyA9IEFycmF5PFQ+IChjb3VudClcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKylcclxuICAgICAgICByZXNbaV0gPSB2YWx1ZVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQXJyYXlIZWxwZXIudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcblxyXG5leHBvcnQgdHlwZSBWZXJ0ZXhBdHRyVHlwZSA9ICdieXRlJyB8ICdzaG9ydCcgfCAndWJ5dGUnIHwgJ3VzaG9ydCcgfCAnZmxvYXQnXHJcblxyXG5leHBvcnQgY2xhc3MgVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IHR5cGU6IFZlcnRleEF0dHJUeXBlXHJcbiAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGdldHRlcjogKFYpID0+IG51bWJlcltdXHJcblxyXG4gICAgbG9jYXRpb246IG51bWJlclxyXG4gICAgb2Zmc2V0OiBudW1iZXJcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobmFtZTogc3RyaW5nLCB0eXBlOiBWZXJ0ZXhBdHRyVHlwZSwgY29tcG9uZW50czogbnVtYmVyLCBnZXR0ZXI6IChWKSA9PiBudW1iZXJbXSkgXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcclxuICAgICAgICB0aGlzLm51bUNvbXBvbmVudHMgPSBjb21wb25lbnRzXHJcbiAgICAgICAgdGhpcy5nZXR0ZXIgPSBnZXR0ZXJcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdHlwZVNpemUgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiBcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiBcclxuICAgICAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzpcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMlxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gNFxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKFwiVW5zdXBwb3J0ZWQgYXR0cmlidXRlIHR5cGUuXCIpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaXplSW5CeXRlcyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCAodGhpcy50eXBlU2l6ZSAqIHRoaXMubnVtQ29tcG9uZW50cyAvIDQpICogNFxyXG4gICAgfVxyXG5cclxuICAgIGdsVHlwZSAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2J5dGUnOiByZXR1cm4gZ2wuQllURVxyXG4gICAgICAgICAgICBjYXNlICd1Ynl0ZSc6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFXHJcbiAgICAgICAgICAgIGNhc2UgJ3Nob3J0JzogcmV0dXJuIGdsLlNIT1JUXHJcbiAgICAgICAgICAgIGNhc2UgJ3VzaG9ydCc6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVFxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6IHJldHVybiBnbC5GTE9BVFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvciAoXCJVbnN1cHBvcnRlZCBhdHRyaWJ1dGUgdHlwZS5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBWZXJ0ZXhEZWY8Vj5cclxue1xyXG4gICAgcmVhZG9ubHkgdmVydGV4QXR0cnM6IFZlcnRleEF0dHI8Vj5bXVxyXG4gICAgcmVhZG9ubHkgc3RyaWRlOiBudW1iZXJcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IgKGF0dHJzOiBWZXJ0ZXhBdHRyPFY+W10pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhBdHRycyA9IGF0dHJzXHJcbiAgICAgICAgdGhpcy5zdHJpZGUgPSB0aGlzLmluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyT2Zmc2V0cyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2ggKHYgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHYub2Zmc2V0ID0gb2Zmc2V0XHJcbiAgICAgICAgICAgIG9mZnNldCArPSB2LnNpemVJbkJ5dGVzIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIG9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhBdHRyTG9jYXRpb25zIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LCBwcmc6IFdlYkdMUHJvZ3JhbSk6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnZlcnRleEF0dHJzLmZvckVhY2godiA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IGdsLmdldEF0dHJpYkxvY2F0aW9uIChwcmcsIHYubmFtZSlcclxuICAgICAgICAgICAgaWYgKGxvYyA8IDApXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvciAoYFZlcnRleCBhdHRyaWJ1dGUgJyR7di5uYW1lfScgbm90IGZvdW5kIGluIHByb2dyYW0uYClcclxuICAgICAgICAgICAgdi5sb2NhdGlvbiA9IGxvY1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBieXRlPFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnYnl0ZScsIDEsIHYgPT4gWyB2W25hbWVdIF0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1Ynl0ZTxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ3VieXRlJywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0PFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnc2hvcnQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNob3J0PFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAndXNob3J0JywgMSwgdiA9PiBbIHZbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0PFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAxLCB2ID0+IFsgdltuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMjxWLCBBIGV4dGVuZHMga2V5b2YgVj4gKG5hbWU6IEEpOiBWZXJ0ZXhBdHRyPFY+XHJcbntcclxuICAgIHJldHVybiBuZXcgVmVydGV4QXR0ciAobmFtZSwgJ2Zsb2F0JywgMiwgdiA9PiAoPFZlYzI+dltuYW1lXSkudG9BcnJheSAoKSApXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWMzPFYsIEEgZXh0ZW5kcyBrZXlvZiBWPiAobmFtZTogQSk6IFZlcnRleEF0dHI8Vj5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBWZXJ0ZXhBdHRyIChuYW1lLCAnZmxvYXQnLCAzLCB2ID0+ICg8VmVjMz52W25hbWVdKS50b0FycmF5ICgpIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzQ8ViwgQSBleHRlbmRzIGtleW9mIFY+IChuYW1lOiBBKTogVmVydGV4QXR0cjxWPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFZlcnRleEF0dHIgKG5hbWUsICdmbG9hdCcsIDQsIHYgPT4gKDxWZWM0PnZbbmFtZV0pLnRvQXJyYXkgKCkgKVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1ZlcnRleEF0dHIudHMiLCJpbXBvcnQgeyBWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE1hdCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcblxyXG5leHBvcnQgdHlwZSBVbmlmb3JtVHlwZSA9ICdpbnQnIHwgJ2Zsb2F0JyB8ICdtYXRyaXgnXHJcblxyXG5leHBvcnQgY2xhc3MgVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmdcclxuICAgIHJlYWRvbmx5IHR5cGU6IFVuaWZvcm1UeXBlXHJcbiAgICByZWFkb25seSBudW1Db21wb25lbnRzOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGdldHRlcjogKFUpID0+IG51bWJlcltdXHJcblxyXG4gICAgbG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IgKG5hbWU6IHN0cmluZywgdHlwZTogVW5pZm9ybVR5cGUsIGNvbXBvbmVudHM6IG51bWJlciwgZ2V0dGVyOiAoVSkgPT4gbnVtYmVyW10pIFxyXG4gICAge1xyXG4gICAgICAgIGxldCBsb3dDb21wID0gdHlwZSA9PT0gJ21hdHJpeCcgPyAyIDogMVxyXG4gICAgICAgIGlmIChjb21wb25lbnRzIDwgbG93Q29tcCB8fCBjb21wb25lbnRzID4gNClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYE51bWJlciBvZiBjb21wb25lbnRzIG11c3QgYmUgWyR7bG93Q29tcH0uLjRdIGZvciAke3R5cGV9LmApXHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcclxuICAgICAgICB0aGlzLm51bUNvbXBvbmVudHMgPSBjb21wb25lbnRzXHJcbiAgICAgICAgdGhpcy5nZXR0ZXIgPSBnZXR0ZXJcclxuICAgIH1cclxuXHJcbiAgICBzZXRWYWx1ZSAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHZhbCA9IHRoaXMuZ2V0dGVyICh1bmlmb3JtcylcclxuICAgICAgICBpZiAodmFsLmxlbmd0aCA8IHRoaXMubnVtQ29tcG9uZW50cyB8fCB2YWwubGVuZ3RoICUgdGhpcy5udW1Db21wb25lbnRzICE9PSAwKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ludmFsaWQgbnVtYmVyIG9mIHVuaWZvcm0gZWxlbWVudHMuJylcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubnVtQ29tcG9uZW50cykgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnaW50JylcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMWl2ICh0aGlzLmxvY2F0aW9uLCB2YWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdmbG9hdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTFmdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTJpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0yZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4MmZ2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0zZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2ludCcpXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTRpdiAodGhpcy5sb2NhdGlvbiwgdmFsKVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnZmxvYXQnKVxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00ZnYgKHRoaXMubG9jYXRpb24sIHZhbClcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4NGZ2ICh0aGlzLmxvY2F0aW9uLCBmYWxzZSwgdmFsKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVuaWZvcm1EZWY8VT5cclxue1xyXG4gICAgcmVhZG9ubHkgdW5pZm9ybXM6IFVuaWZvcm08VT5bXVxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvciAodW5pZm9ybXM6IFVuaWZvcm08VT5bXSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLnVuaWZvcm1zID0gdW5pZm9ybXNcclxuICAgIH1cclxuXHJcbiAgICBpbml0VW5pZm9ybUxvY2F0aW9ucyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgcHJnOiBXZWJHTFByb2dyYW0pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51bmlmb3Jtcy5mb3JFYWNoKHUgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24gKHByZywgdS5uYW1lKVxyXG4gICAgICAgICAgICBpZiAobG9jID09PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IgKGBVbmlmb3JtICcke3UubmFtZX0nIG5vdCBmb3VuZCBpbiBwcm9ncmFtLmApXHJcbiAgICAgICAgICAgIHUubG9jYXRpb24gPSBsb2NcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZhbHVlcyAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdW5pZm9ybXM6IFUpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy51bmlmb3Jtcy5mb3JFYWNoICh1bmlmID0+IHVuaWYuc2V0VmFsdWUgKGdsLCB1bmlmb3JtcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW50PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnaW50JywgMSwgdSA9PiBbIHVbbmFtZV0gXSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZsb2F0PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCAxLCB1ID0+IFsgdVtuYW1lXSBdKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVjMjxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ2Zsb2F0JywgMiwgdSA9PiAoPFZlYzI+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlYzM8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdmbG9hdCcsIDMsIHUgPT4gKDxWZWMzPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWM0PFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnZmxvYXQnLCA0LCB1ID0+ICg8VmVjND51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0MjxVLCBBIGV4dGVuZHMga2V5b2YgVT4gKG5hbWU6IEEpOiBVbmlmb3JtPFU+XHJcbntcclxuICAgIHJldHVybiBuZXcgVW5pZm9ybSAobmFtZSwgJ21hdHJpeCcsIDIsIHUgPT4gKDxNYXQyPnVbbmFtZV0pLnRvQXJyYXkgKCkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYXQzPFUsIEEgZXh0ZW5kcyBrZXlvZiBVPiAobmFtZTogQSk6IFVuaWZvcm08VT5cclxue1xyXG4gICAgcmV0dXJuIG5ldyBVbmlmb3JtIChuYW1lLCAnbWF0cml4JywgMywgdSA9PiAoPE1hdDM+dVtuYW1lXSkudG9BcnJheSAoKSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDQ8VSwgQSBleHRlbmRzIGtleW9mIFU+IChuYW1lOiBBKTogVW5pZm9ybTxVPlxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVuaWZvcm0gKG5hbWUsICdtYXRyaXgnLCA0LCB1ID0+ICg8TWF0ND51W25hbWVdKS50b0FycmF5ICgpKVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1VuaWZvcm1zLnRzIiwiZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdMUmVzb3VyY2Vcclxue1xyXG4gICAgcmVhZG9ubHkgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBnbFxyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IHVzZSAoKVxyXG4gICAgYWJzdHJhY3QgcmVsZWFzZSAoKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXNpbmcgKHJlc291cmNlOiBHTFJlc291cmNlIHwgR0xSZXNvdXJjZVtdLCBcclxuICAgIGFjdGlvbjogKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpID0+IHZvaWQpXHJcbntcclxuICAgIGxldCByZXMgPSByZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5ID8gXHJcbiAgICAgICAgcmVzb3VyY2UucG9wICgpIDogXHJcbiAgICAgICAgcmVzb3VyY2VcclxuICAgIGlmICghcmVzKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgcmVzLnVzZSAoKVxyXG4gICAgdHJ5XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXkgJiYgcmVzb3VyY2UubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdXNpbmcgKHJlc291cmNlLCBhY3Rpb24pXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhY3Rpb24gKHJlcy5nbClcclxuICAgIH1cclxuICAgIGZpbmFsbHlcclxuICAgIHtcclxuICAgICAgICByZXMucmVsZWFzZSAoKVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0dMUmVzb3VyY2UudHMiLCJpbXBvcnQgeyBOZXdWZWMsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tIFwiLi9WZWN0b3JzXCI7XHJcbmltcG9ydCB7IE5ld01hdCwgTWF0MiwgTWF0MywgTWF0NCB9IGZyb20gXCIuL01hdHJpY2VzXCI7XHJcbmltcG9ydCB7IG5ld1ZlYzIsIG5ld1ZlYzQgfSBmcm9tIFwiLi9BcnJheVZlY1wiXHJcbmltcG9ydCB7IG5ld01hdDQgfSBmcm9tIFwiLi9BcnJheU1hdFwiXHJcbmltcG9ydCB7IFNoYWRlclR5cGUsIFNoYWRlciB9IGZyb20gXCIuL1NoYWRlclwiXHJcbmltcG9ydCAqIGFzIFZBdHRyIGZyb20gXCIuL1ZlcnRleEF0dHJcIlxyXG5pbXBvcnQgKiBhcyBVbmlmIGZyb20gXCIuL1VuaWZvcm1zXCJcclxuaW1wb3J0IHsgVmVydGV4QnVmZmVyLCBJbmRleEJ1ZmZlciB9IGZyb20gXCIuL0J1ZmZlcnNcIjtcclxuaW1wb3J0IHsgUHJvZ3JhbSB9IGZyb20gXCIuL1Byb2dyYW1cIlxyXG5cclxuLy8gVmVydGV4IHNoYWRlciBwcm9ncmFtXHJcbmNvbnN0IHZzU291cmNlOiBzdHJpbmcgPSByZXF1aXJlICgnLi9zaGFkZXJzL3NpbXBsZS52ZXJ0JylcclxuY29uc3QgZnNTb3VyY2U6IHN0cmluZyA9IHJlcXVpcmUgKCcuL3NoYWRlcnMvc2ltcGxlLmZyYWcnKVxyXG5cclxuY2xhc3MgU2ltcGxlVmVydGV4IFxyXG57XHJcbiAgICBhVmVydGV4UG9zaXRpb246IFZlYzIgXHJcbn1cclxuXHJcbmNsYXNzIE15VW5pZm9ybXNcclxue1xyXG4gICAgdU1vZGVsVmlld01hdHJpeDogTWF0NFxyXG4gICAgdVByb2plY3Rpb25NYXRyaXg6IE1hdDRcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1NjZW5lKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHByb2dyYW06IFByb2dyYW08U2ltcGxlVmVydGV4LCBNeVVuaWZvcm1zPiwgXHJcbiAgICB2YnVmZmVyOiBWZXJ0ZXhCdWZmZXI8U2ltcGxlVmVydGV4PiwgaWJ1ZmZlcjogSW5kZXhCdWZmZXIsIHVuaWZvcm1zOiBNeVVuaWZvcm1zKSBcclxue1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApOyAgLy8gQ2xlYXIgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxyXG4gICAgZ2wuY2xlYXJEZXB0aCgxLjApOyAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xyXG4gICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpOyAgICAgICAgICAgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcclxuICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpOyAgICAgICAgICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xyXG4gIFxyXG4gICAgLy8gQ2xlYXIgdGhlIGNhbnZhcyBiZWZvcmUgd2Ugc3RhcnQgZHJhd2luZyBvbiBpdC5cclxuICBcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcclxuXHJcbiAgICBwcm9ncmFtLmRyYXdFbGVtZW50cyAoZ2wuVFJJQU5HTEVfU1RSSVAsIHZidWZmZXIsIGlidWZmZXIsIHVuaWZvcm1zKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbWFpbiAoKVxyXG57XHJcbiAgICBsZXQgdmVydGljZXM6IFNpbXBsZVZlcnRleFtdID0gW1xyXG4gICAgICAgIHsgYVZlcnRleFBvc2l0aW9uOiBuZXdWZWMyLmluaXQgKDEsIDEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoLTEsIDEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoMSwgLTEpIH0sXHJcbiAgICAgICAgeyBhVmVydGV4UG9zaXRpb246IG5ld1ZlYzIuaW5pdCAoLTEsIC0xKSB9XHJcbiAgICBdXHJcbiAgICBsZXQgaW5kaWNlcyA9IFsgMCwgMSwgMiwgMyBdXHJcbiAgICBsZXQgdW5pZm9ybXM6IE15VW5pZm9ybXMgPSB7XHJcbiAgICAgICAgdU1vZGVsVmlld01hdHJpeDogbmV3TWF0NC50cmFuc2xhdGlvbiAoWzAuMCwgMC4wLCAtNC4wXSksXHJcbiAgICAgICAgdVByb2plY3Rpb25NYXRyaXg6IG5ld01hdDQucGVyc3BlY3RpdmUgKC0xLCAxLCAtMSwgMSwgMSwgMTAwKVxyXG4gICAgfVxyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZ2xDYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAvLyBJbml0aWFsaXplIHRoZSBHTCBjb250ZXh0XHJcbiAgICBsZXQgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG5cclxuICAgIC8vIE9ubHkgY29udGludWUgaWYgV2ViR0wgaXMgYXZhaWxhYmxlIGFuZCB3b3JraW5nXHJcbiAgICBpZiAoIWdsKSB7XHJcbiAgICAgICAgYWxlcnQoXCJVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG9yIG1hY2hpbmUgbWF5IG5vdCBzdXBwb3J0IGl0LlwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgdmVydFNoYWRlciA9IG5ldyBTaGFkZXIgKGdsLCAndmVydGV4JywgdnNTb3VyY2UpXHJcbiAgICBsZXQgZnJhZ1NoYWRlciA9IG5ldyBTaGFkZXIgKGdsLCAnZnJhZ21lbnQnLCBmc1NvdXJjZSlcclxuXHJcbiAgICBsZXQgcHJvZ3JhbSA9IG5ldyBQcm9ncmFtPFNpbXBsZVZlcnRleCwgTXlVbmlmb3Jtcz4gKGdsLFxyXG4gICAgICAgIFsgdmVydFNoYWRlciwgZnJhZ1NoYWRlciBdLFxyXG4gICAgICAgIFsgVkF0dHIudmVjMiAoJ2FWZXJ0ZXhQb3NpdGlvbicpIF0sXHJcbiAgICAgICAgWyBVbmlmLm1hdDQgKCd1TW9kZWxWaWV3TWF0cml4JyksIFVuaWYubWF0NCAoJ3VQcm9qZWN0aW9uTWF0cml4JykgXSlcclxuXHJcbiAgICBsZXQgdmJ1ZmZlciA9IG5ldyBWZXJ0ZXhCdWZmZXIgKGdsLCBwcm9ncmFtLnZlcnRleERlZiwgdmVydGljZXMpXHJcbiAgICBsZXQgaWJ1ZmZlciA9IG5ldyBJbmRleEJ1ZmZlciAoZ2wsIGluZGljZXMpXHJcblxyXG4gICAgZHJhd1NjZW5lIChnbCwgcHJvZ3JhbSwgdmJ1ZmZlciwgaWJ1ZmZlciwgdW5pZm9ybXMpXHJcbn1cclxuXHJcbm1haW4gKClcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVGVzdC50cyIsImltcG9ydCAqIGFzIEZNYXRoIGZyb20gXCIuL0ZNYXRoXCJcclxuaW1wb3J0IHsgRGltLCBWZWMsIFZlYzIsIFZlYzMsIFZlYzQsIE5ld1ZlYyB9IGZyb20gXCIuL1ZlY3RvcnNcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUhlbHBlciBmcm9tIFwiLi9BcnJheUhlbHBlclwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlWZWMgaW1wbGVtZW50cyBOZXdWZWM8VmVjMj4sIE5ld1ZlYzxWZWMzPiwgTmV3VmVjPFZlYzQ+XHJcbntcclxuICAgIHByaXZhdGUgZGltZW5zaW9uczogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRpbXM6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1zXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIDApKVxyXG4gICAgfVxyXG5cclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4gKHRoaXMuZGltZW5zaW9ucyksIHgpKVxyXG4gICAgfVxyXG5cclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWZWMyICYgVmVjMyAmIFZlYzRcclxuICAgIHtcclxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAhPSB0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBFeHBlY3RlZCAke3RoaXMuZGltZW5zaW9uc30gY29tcG9uZW50cy5gKVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHZhbHVlcylcclxuICAgIH1cclxuXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZlYzIgJiBWZWMzICYgVmVjNFxyXG4gICAge1xyXG4gICAgICAgIGlmIChhcnJheS5sZW5ndGggIT0gdGhpcy5kaW1lbnNpb25zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgRXhwZWN0ZWQgJHt0aGlzLmRpbWVuc2lvbnN9IGNvbXBvbmVudHMuYClcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChhcnJheSlcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzI6IE5ld1ZlYzxWZWMyPiA9IG5ldyBOZXdBcnJheVZlYyAoMilcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzM6IE5ld1ZlYzxWZWMzPiA9IG5ldyBOZXdBcnJheVZlYyAoMylcclxuZXhwb3J0IGNvbnN0IG5ld1ZlYzQ6IE5ld1ZlYzxWZWM0PiA9IG5ldyBOZXdBcnJheVZlYyAoNClcclxuXHJcbmNsYXNzIEFycmF5VmVjIGltcGxlbWVudHMgVmVjMiwgVmVjMywgVmVjNFxyXG57XHJcbiAgICBwcml2YXRlIGFycmF5OiBudW1iZXJbXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICh2YWx1ZXM6IG51bWJlcltdKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYXJyYXkgPSB2YWx1ZXNcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGltZW5zaW9ucyAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoXHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50IChpbmRleDogbnVtYmVyKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlbaW5kZXhdXHJcbiAgICB9XHJcblxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheVZlYyAodGhpcy5hcnJheS5tYXAgKCh2LCBpLCBhKSA9PiBpID09IGluZGV4ID8gdmFsdWUgOiB2KSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnhdIH1cclxuICAgIHNldCB4ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnhdID0gdmFsdWUgfVxyXG5cclxuICAgIGdldCB5ICgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5hcnJheVtEaW0ueV0gfVxyXG4gICAgc2V0IHkgKHZhbHVlOiBudW1iZXIpIHsgdGhpcy5hcnJheVtEaW0ueV0gPSB2YWx1ZSB9XHJcblxyXG4gICAgZ2V0IHogKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmFycmF5W0RpbS56XSB9XHJcbiAgICBzZXQgeiAodmFsdWU6IG51bWJlcikgeyB0aGlzLmFycmF5W0RpbS56XSA9IHZhbHVlIH1cclxuXHJcbiAgICBnZXQgdyAoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYXJyYXlbRGltLnddIH1cclxuICAgIHNldCB3ICh2YWx1ZTogbnVtYmVyKSB7IHRoaXMuYXJyYXlbRGltLnddID0gdmFsdWUgfVxyXG4gICAgXHJcbiAgICBzd2l6emxlIChjb29yZHM6IERpbVtdKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICB2YXIgcmVzID0gbmV3IEFycmF5IChjb29yZHMubGVuZ3RoKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICByZXNbaV0gPSB0aGlzLmFycmF5W2Nvb3Jkc1tpXV1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwIChvcGVyOiAoeDogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2KVxyXG4gICAgICAgICAgICB9KSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcDIgKG90aGVyOiBBcnJheVZlYywgb3BlcjogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlWZWMgKHRoaXMuYXJyYXkubWFwIChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRoaXMsIHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGVyICh2LCBvdGhlci5hcnJheVtpXSlcclxuICAgICAgICAgICAgfSkpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWR1Y2UgKG9wZXI6IChhY2M6IG51bWJlciwgeDogbnVtYmVyKSA9PiBudW1iZXIpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5yZWR1Y2UgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoYywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKGMsIHYpXHJcbiAgICAgICAgICAgIH0sIDApXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlblNxciAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlICgoYSwgeCkgPT4gYSArICh4ICogeCkpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbiAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCAodGhpcy5sZW5TcXIpXHJcbiAgICB9XHJcblxyXG4gICAgaW52ICgpIDogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gLXgpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4ICsgeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICsgb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3ViIChvdGhlcjogQXJyYXlWZWMgfCBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5VmVjID8gXHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsKHgsIHkpID0+IHggLSB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLSBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBtdWwgKG90aGVyOiBBcnJheVZlYyB8IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlWZWMgPyBcclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwoeCwgeSkgPT4geCAqIHkpIDpcclxuICAgICAgICAgICAgdGhpcy5tYXAgKHggPT4geCAqIG90aGVyKVxyXG4gICAgfVxyXG5cclxuICAgIGRpdiAob3RoZXI6IEFycmF5VmVjIHwgbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheVZlYyA/IFxyXG4gICAgICAgICAgICB0aGlzLm1hcDIgKG90aGVyLCh4LCB5KSA9PiB4IC8geSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4IC8gb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgbm9ybSAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICBsZXQgbCA9IHRoaXMubGVuXHJcbiAgICAgICAgaWYgKGwgPT0gMClcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoXCJDYW5ub3Qgbm9ybWFsaXplIHplcm8gdmVjdG9yXCIpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwICh4ID0+IHggLyBsKVxyXG4gICAgfVxyXG5cclxuICAgIGVxdWFscyAob3RoZXI6IEFycmF5VmVjKTogYm9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LmV2ZXJ5IChcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHYsIGksIGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2ID09PSBvdGhlci5hcnJheVtpXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGFwcHJveEVxdWFscyAob3RoZXI6IEFycmF5VmVjLCBlcHNpbG9uOiBudW1iZXIgPSAwLjAwMDAwMSk6IGJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5ldmVyeSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRk1hdGguYXBwcm94RXF1YWxzICh2LCBvdGhlci5hcnJheVtpXSwgZXBzaWxvbilcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkb3QgKG90aGVyOiBBcnJheVZlYyk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5LnJlZHVjZSAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjOiBudW1iZXIsIHY6IG51bWJlciwgaTogbnVtYmVyLCBhOiBudW1iZXJbXSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMgKyAodiAqIG90aGVyLmFycmF5W2ldKSBcclxuICAgICAgICAgICAgfSwgMClcclxuICAgIH1cclxuXHJcbiAgICBjcm9zcyAob3RoZXI6IEFycmF5VmVjKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5VmVjIChbXHJcbiAgICAgICAgICAgIHRoaXMueSAqIG90aGVyLnogLSB0aGlzLnogKiBvdGhlci55LFxyXG4gICAgICAgICAgICB0aGlzLnogKiBvdGhlci54IC0gdGhpcy54ICogb3RoZXIueixcclxuICAgICAgICAgICAgdGhpcy54ICogb3RoZXIueSAtIHRoaXMueSAqIG90aGVyLnhdKVx0XHRcclxuICAgIH1cclxuXHJcbiAgICBhYnMgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChNYXRoLmFicylcclxuICAgIH1cclxuXHJcbiAgICBmbG9vciAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguZmxvb3IpXHJcbiAgICB9XHJcblxyXG4gICAgY2VpbCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGguY2VpbClcclxuICAgIH1cclxuXHJcbiAgICByb3VuZCAoKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKE1hdGgucm91bmQpXHJcbiAgICB9XHJcblxyXG4gICAgZnJhY3QgKCk6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwIChGTWF0aC5mcmFjdClcclxuICAgIH1cclxuXHJcbiAgICBjbGFtcCAobWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogQXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAgKHggPT4gRk1hdGguY2xhbXAgKHgsIG1pbiwgbWF4KSlcclxuICAgIH1cclxuXHJcbiAgICBtaXggKG90aGVyOiBBcnJheVZlYywgaW50ZXJQb3M6IG51bWJlcik6IEFycmF5VmVjXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiBGTWF0aC5taXggKHgsIHksIGludGVyUG9zKSlcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zdGVwIChlZGdlLCB4KSlcclxuICAgIH1cclxuXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBBcnJheVZlY1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1hcCAoeCA9PiBGTWF0aC5zbW9vdGhTdGVwIChlZGdlTG93ZXIsIGVkZ2VVcHBlciwgeCkpXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMuYXJyYXkuam9pbiAoXCIgXCIpICsgXCJdXCJcclxuICAgIH1cclxuXHJcbiAgICB0b0FycmF5ICgpOiBudW1iZXJbXVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICB9XHJcblxyXG4gICAgdG9GbG9hdDMyQXJyYXkgKCk6IEZsb2F0MzJBcnJheVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5ICh0aGlzLmFycmF5KVxyXG4gICAgfVxyXG5cclxuICAgIG5ld1ZlYyAoKTogTmV3QXJyYXlWZWNcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IE5ld0FycmF5VmVjICh0aGlzLmRpbWVuc2lvbnMpXHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0FycmF5VmVjLnRzIiwiLyoqXHJcbiAqIEVudW1lcmF0aW9uIHRoYXQgZGVmaW5lcyB0aGUgY29vcmRpbmF0ZSBkaW1lbnNpb25zIHVzZWQgaW4gdGhlIHZlY3RvciB0eXBlcy5cclxuICovXHJcbmV4cG9ydCBlbnVtIERpbSBcclxue1xyXG4gICAgeCA9IDAsXHJcbiAgICB5ID0gMSwgXHJcbiAgICB6ID0gMixcclxuICAgIHcgPSAzXHJcbn1cclxuXHJcbi8qKiBcclxuICogQmFzZSBpbnRlcmZhY2UgZm9yIGFsbCB2ZWN0b3J5IHR5cGVzLiBEZWZpbmVzIG1ldGhvZHMgdGhhdCBoYXZlIHRoZSBzYW1lIHNpZ25hdHVyZVxyXG4gKiBpbiBhbGwgdmVjdG9yIHZhcmlhbnRzLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBWZWM8ViBleHRlbmRzIFZlYzxWPj5cclxue1xyXG4gICAgLyoqXHJcbiAgICAgKiBOdW1iZXIgZGltZW5zaW9ucyBpbiB0aGUgdmVjdG9yLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBkaW1lbnNpb25zOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIG9uZSBvciBtb3JlIGNvbXBvbmVudHMgb2YgdGhlIHZlY3RvciBpbiBhcmJpdHJhcnkgb3JkZXIuIFRoZSBjb21wb25lbnRzXHJcbiAgICAgKiByZXR1cm5lZCBkZXBlbmQgb24gdGhlIGRpbWVuc2lvbnMgc3BlY2lmaWVkIGluIHRoZSBjb29yZHMgYXJndW1lbnQuIE5vdGUgdGhhdFxyXG4gICAgICogdGhlIHNhbWUgY29tcG9uZW50IGNhbiBvY2N1ciBtdWx0aXBsZSB0aW1lcyBpbiBjb29yZHMuIFNvLCBpdCBpcyB2YWxpZCB0byBjYWxsXHJcbiAgICAgKiB0aGUgZnVuY3Rpb24gbGlrZSB0aGlzOlxyXG4gICAgICogXHJcbiAgICAgKiBzd2l6emxlIChbRGltLngsIERpbS54LCBEaW0ueV0pXHJcbiAgICAgKi9cclxuICAgIHN3aXp6bGUgKGNvb3JkczogRGltW10pOiBudW1iZXJbXVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbGVuZ2h0IG9mIHRoZSB2ZWN0b3Igc3F1YXJlZC4gRmFzdGVyIHRvIGNhbGN1bGF0ZSB0aGFuIHRoZSBhY3R1YWwgbGVuZ3RoLFxyXG4gICAgICogYW5kIHVzZWZ1bCBmb3IgY29tcGFyaW5nIHZlY3RvciBtYWduaXR1ZGVzLlxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBsZW5TcXI6IG51bWJlclxyXG4gICAgLyoqXHJcbiAgICAgKiBMZW5ndGggb2YgdGhlIHZlY3Rvci5cclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbGVuOiBudW1iZXJcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yLiBGb3JtYXR0ZWQgbGlrZSB0aGlzOiBbeCB5IHpdXHJcbiAgICAgKi9cclxuICAgIGNvbXBvbmVudCAoaW5kZXg6IG51bWJlcik6IG51bWJlclxyXG4gICAgd2l0aCAoaW5kZXg6IG51bWJlciwgdmFsdWU6IG51bWJlcik6IFZcclxuICAgIHRvU3RyaW5nICgpOiBzdHJpbmdcclxuICAgIHRvQXJyYXkgKCk6IG51bWJlcltdXHJcbiAgICB0b0Zsb2F0MzJBcnJheSAoKTogRmxvYXQzMkFycmF5XHJcbiAgICBuZXdWZWMgKCk6IE5ld1ZlYzxWPlxyXG4gICAgXHJcbiAgICBpbnYgKCk6IFZcclxuICAgIGFkZCAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBzdWIgKG90aGVyOiBWIHwgbnVtYmVyKTogVlxyXG4gICAgbXVsIChvdGhlcjogViB8IG51bWJlcik6IFZcclxuICAgIGRpdiAob3RoZXI6IFYgfCBudW1iZXIpOiBWXHJcbiAgICBub3JtICgpOiBWXHJcbiAgICBlcXVhbHMgKG90aGVyOiBWKTogYm9vbGVhblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogViwgZXBzaWxvbj86IG51bWJlcik6IGJvb2xlYW5cclxuICAgIGRvdCAob3RoZXI6IFYpOiBudW1iZXJcclxuICAgIGFicyAoKTogVlxyXG4gICAgZmxvb3IgKCk6IFZcclxuICAgIGNlaWwgKCk6IFZcclxuICAgIHJvdW5kICgpOiBWXHJcbiAgICBmcmFjdCAoKTogVlxyXG4gICAgY2xhbXAgKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IFZcclxuICAgIG1peCAob3RoZXI6IFYsIGludGVyUG9zOiBudW1iZXIpOiBWXHJcbiAgICBzdGVwIChlZGdlOiBudW1iZXIpOiBWXHJcbiAgICBzbW9vdGhTdGVwIChlZGdlTG93ZXI6IG51bWJlciwgZWRnZVVwcGVyOiBudW1iZXIpOiBWXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTmV3VmVjPFYgZXh0ZW5kcyBWZWM8Vj4+XHJcbntcclxuICAgIHJlYWRvbmx5IHplcm86IFZcclxuICAgIHVuaWYgKHg6IG51bWJlcik6IFZcclxuICAgIGluaXQgKC4uLnZhbHVlczogbnVtYmVyW10pOiBWXHJcbiAgICBmcm9tQXJyYXkgKGFycmF5OiBudW1iZXJbXSk6IFZcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWZWMyIGV4dGVuZHMgVmVjPFZlYzI+XHJcbntcclxuICAgIHg6IG51bWJlclxyXG4gICAgeTogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmVjMyBleHRlbmRzIFZlYzxWZWMzPlxyXG57XHJcbiAgICB4OiBudW1iZXJcclxuICAgIHk6IG51bWJlclxyXG4gICAgejogbnVtYmVyXHJcblxyXG4gICAgY3Jvc3MgKG90aGVyOiBWZWMzKTogVmVjM1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZlYzQgZXh0ZW5kcyBWZWM8VmVjND5cclxue1xyXG4gICAgeDogbnVtYmVyXHJcbiAgICB5OiBudW1iZXJcclxuICAgIHo6IG51bWJlclxyXG4gICAgdzogbnVtYmVyXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvVmVjdG9ycy50cyIsImltcG9ydCB7IFZlYywgVmVjMiwgVmVjMywgVmVjNCB9IGZyb20gXCIuL1ZlY3RvcnNcIjtcclxuaW1wb3J0IHsgTmV3TWF0LCBOZXdNYXQ0LCBNYXQyLCBNYXQzLCBNYXQ0IH0gZnJvbSBcIi4vTWF0cmljZXNcIjtcclxuaW1wb3J0ICogYXMgRk1hdGggZnJvbSBcIi4vRk1hdGhcIlxyXG5pbXBvcnQgKiBhcyBBcnJheUhlbHBlciBmcm9tIFwiLi9BcnJheUhlbHBlclwiO1xyXG5cclxuY2xhc3MgTmV3QXJyYXlNYXQgaW1wbGVtZW50cyBOZXdNYXQ8TWF0MiwgVmVjMj4sIE5ld01hdDxNYXQzLCBWZWMzPiwgTmV3TWF0NFxyXG57XHJcbiAgICByZWFkb25seSByb3dzOiBudW1iZXJcclxuICAgIHJlYWRvbmx5IGNvbHM6IG51bWJlclxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJvd3M6IG51bWJlciwgY29sczogbnVtYmVyKSBcclxuICAgIHtcclxuICAgICAgICB0aGlzLnJvd3MgPSByb3dzXHJcbiAgICAgICAgdGhpcy5jb2xzID0gY29sc1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaWRlbnRpdHlBcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgYXJyID0gQXJyYXlIZWxwZXIuZmlsbCAoQXJyYXk8bnVtYmVyPiAociAqIGMpLCAwKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKHIsIGMpOyBpKyspIFxyXG4gICAgICAgICAgICBhcnJbaSAqIHIgKyBpXSA9IDFcclxuICAgICAgICByZXR1cm4gYXJyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHplcm8gKCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKEFycmF5SGVscGVyLmZpbGwgKEFycmF5PG51bWJlcj4ociAqIGMpLCAwKSwgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaWRlbnRpdHkgKCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHRoaXMuaWRlbnRpdHlBcnJheSAoKSwgdGhpcy5yb3dzLCB0aGlzLmNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRpb24gKG9mZnNldHM6IG51bWJlcltdfFZlYzJ8VmVjM3xWZWM0KTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgbGV0IG9mZnMgPSBvZmZzZXRzIGluc3RhbmNlb2YgQXJyYXkgPyBvZmZzZXRzIDogb2Zmc2V0cy50b0FycmF5ICgpXHJcbiAgICAgICAgaWYgKG9mZnMubGVuZ3RoID4gcilcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFRvbyBtYW55IG9mZnNldHMgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IGxhc3RDb2wgPSBjIC0gMVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5taW4gKG9mZnMubGVuZ3RoLCByIC0gMSk7IGkrKylcclxuICAgICAgICAgICAgcmVzIFtsYXN0Q29sICogciArIGldID0gb2Zmc1tpXVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBzY2FsaW5nIChmYWN0b3JzOiBudW1iZXJbXXxWZWMyfFZlYzN8VmVjNCk6IE1hdDIgJiBNYXQzICYgTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3M6IHIsIGNvbHM6IGMgfSA9IHRoaXMgICAgICAgIFxyXG4gICAgICAgIGxldCBmYWNzID0gZmFjdG9ycyBpbnN0YW5jZW9mIEFycmF5ID8gZmFjdG9ycyA6ZmFjdG9ycy50b0FycmF5ICgpXHJcbiAgICAgICAgaWYgKGZhY3MubGVuZ3RoID4gcilcclxuICAgICAgICAgICAgdGhyb3cgUmFuZ2VFcnJvciAoYFRvbyBtYW55IGZhY3RvcnMgZm9yICR7cn14JHtjfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbiAoZmFjcy5sZW5ndGgsIHIsIGMpOyBpKyspXHJcbiAgICAgICAgICAgIHJlcyBbaSAqIHIgKyBpXSA9IGZhY3NbaV1cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHIsIGMpXHJcbiAgICB9XHJcblxyXG4gICAgcm90YXRpb25YIChhbmdsZTogbnVtYmVyKTogTWF0MiAmIE1hdDMgJiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93czogciwgY29sczogYyB9ID0gdGhpcyAgICAgICAgXHJcbiAgICAgICAgaWYgKHIgPCAzIHx8IGMgPCAzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChgUm90YXRpb24gYXJvdW5kIFgtYXhpcyBub3QgZGVmaW5lZCBmb3IgJHtyfXgke2N9IG1hdHJpeC5gKVxyXG4gICAgICAgIGxldCByZXMgPSB0aGlzLmlkZW50aXR5QXJyYXkgKClcclxuICAgICAgICBsZXQgc2luYSA9IE1hdGguc2luIChhbmdsZSlcclxuICAgICAgICBsZXQgY29zYSA9IE1hdGguY29zIChhbmdsZSlcclxuICAgICAgICByZXNbciArIDFdID0gY29zYVxyXG4gICAgICAgIHJlc1tyICsgMl0gPSBzaW5hXHJcbiAgICAgICAgcmVzWzIgKiByICsgMV0gPSAtc2luYVxyXG4gICAgICAgIHJlc1syICogciArIDJdID0gY29zYVxyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblkgKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBpZiAociA8IDMgfHwgYyA8IDMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBSb3RhdGlvbiBhcm91bmQgWS1heGlzIG5vdCBkZWZpbmVkIGZvciAke3J9eCR7Y30gbWF0cml4LmApXHJcbiAgICAgICAgbGV0IHJlcyA9IHRoaXMuaWRlbnRpdHlBcnJheSAoKVxyXG4gICAgICAgIGxldCBzaW5hID0gTWF0aC5zaW4gKGFuZ2xlKVxyXG4gICAgICAgIGxldCBjb3NhID0gTWF0aC5jb3MgKGFuZ2xlKVxyXG4gICAgICAgIHJlc1swXSA9IGNvc2E7XHJcbiAgICAgICAgcmVzWzJdID0gLXNpbmE7XHJcbiAgICAgICAgcmVzWzIgKiByXSA9IHNpbmE7XHJcbiAgICAgICAgcmVzWzIgKiByICsgMl0gPSBjb3NhO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICByb3RhdGlvblogKGFuZ2xlOiBudW1iZXIpOiBNYXQyICYgTWF0MyAmIE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgeyByb3dzOiByLCBjb2xzOiBjIH0gPSB0aGlzICAgICAgICBcclxuICAgICAgICBsZXQgcmVzID0gdGhpcy5pZGVudGl0eUFycmF5ICgpXHJcbiAgICAgICAgbGV0IHNpbmEgPSBNYXRoLnNpbiAoYW5nbGUpXHJcbiAgICAgICAgbGV0IGNvc2EgPSBNYXRoLmNvcyAoYW5nbGUpXHJcbiAgICAgICAgcmVzWzBdID0gY29zYTtcclxuICAgICAgICByZXNbMV0gPSBzaW5hO1xyXG4gICAgICAgIHJlc1tyXSA9IC1zaW5hO1xyXG4gICAgICAgIHJlc1tyICsgMV0gPSBjb3NhO1xyXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlNYXQgKHJlcywgciwgYylcclxuICAgIH1cclxuXHJcbiAgICBwZXJzcGVjdGl2ZSAobGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsXHJcbiAgICAgICAgek5lYXI6IG51bWJlciwgekZhcjogbnVtYmVyKTogTWF0NFxyXG4gICAge1xyXG4gICAgICAgIGlmICh6TmVhciA8PSAwIHx8IHpOZWFyID49IHpGYXIpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiek5lYXIgbmVlZHMgdG8gYmUgcG9zaXRpdmUgYW5kIHNtYWxsZXIgdGhhdG4gekZhclwiKVxyXG4gICAgICAgIGxldCB3aWR0aCA9IHJpZ2h0IC0gbGVmdFxyXG4gICAgICAgIGxldCBoZWlnaHQgPSB0b3AgLSBib3R0b21cclxuICAgICAgICBsZXQgZGVwdGggPSB6RmFyIC0gek5lYXJcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgWygyLjAgKiB6TmVhcikgLyB3aWR0aCwgMCwgMCwgMCxcclxuICAgICAgICAgICAgMCwgKDIuMCAqIHpOZWFyKSAvIGhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgKHJpZ2h0ICsgbGVmdCkgLyB3aWR0aCwgKHRvcCArIGJvdHRvbSkgLyBoZWlnaHQsIC0oekZhciArIHpOZWFyKSAvIGRlcHRoLCAtMSxcclxuICAgICAgICAgICAgMCwgMCwgLSgyLjAgKiB6RmFyICogek5lYXIpIC8gZGVwdGgsIDBdLCBcclxuICAgICAgICAgICAgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBvcnRob2dyYXBoaWMgKGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHRvcDogbnVtYmVyLFxyXG4gICAgICAgIHpOZWFyOiBudW1iZXIsIHpGYXI6IG51bWJlcik6IE1hdDRcclxuICAgIHtcclxuICAgICAgICBsZXQgaW52V2lkdGggPSAxLjAgLyAocmlnaHQgLSBsZWZ0KVxyXG4gICAgICAgIGxldCBpbnZIZWlnaHQgPSAxLjAgLyAodG9wIC0gYm90dG9tKVxyXG4gICAgICAgIGxldCBpbnZEZXB0aCA9IDEuMCAvICh6RmFyIC0gek5lYXIpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAoXHJcbiAgICAgICAgICAgIFsyICogaW52V2lkdGgsIDAsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDIgKiBpbnZIZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIC0yICogaW52RGVwdGgsIDAsXHJcbiAgICAgICAgICAgIC0ocmlnaHQgKyBsZWZ0KSAqIGludldpZHRoLCAtKHRvcCArIGJvdHRvbSkgKiBpbnZIZWlnaHQsIC0oekZhciArIHpOZWFyKSAqIGludkRlcHRoLCAxXSxcclxuICAgICAgICAgICAgNCwgNClcclxuICAgIH1cclxuXHJcbiAgICBsb29rQXQgKGRpcmVjdGlvbjogVmVjMywgdXA6IFZlYzMpOiBNYXQ0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHpheGlzID0gZGlyZWN0aW9uLmludiAoKS5ub3JtICgpXHJcbiAgICAgICAgbGV0IHhheGlzID0gdXAuY3Jvc3MgKHpheGlzKS5ub3JtICgpXHJcbiAgICAgICAgbGV0IHlheGlzID0gemF4aXMuY3Jvc3MgKHhheGlzKVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChcclxuICAgICAgICAgICAgW3hheGlzLngsIHlheGlzLngsIHpheGlzLngsIDAsXHJcbiAgICAgICAgICAgIHhheGlzLnksIHlheGlzLnksIHpheGlzLnksIDAsXHJcbiAgICAgICAgICAgIHhheGlzLnosIHlheGlzLnosIHpheGlzLnosIDAsXHJcbiAgICAgICAgICAgIDAsIDAsIDAsIDFdLCA0LCA0KVxyXG4gICAgfVxyXG5cclxuICAgIGZyb21BcnJheSAoYXJyYXk6IG51bWJlcltdLCByb3dzOiBudW1iZXIsIGNvbHM6IG51bWJlcilcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChhcnJheSwgcm93cywgY29scylcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG5ld01hdDI6IE5ld01hdDxNYXQyLCBWZWMyPiA9IG5ldyBOZXdBcnJheU1hdCAoMiwgMilcclxuZXhwb3J0IGNvbnN0IG5ld01hdDM6IE5ld01hdDxNYXQzLCBWZWMzPiA9IG5ldyBOZXdBcnJheU1hdCAoMywgMylcclxuZXhwb3J0IGNvbnN0IG5ld01hdDQ6IE5ld01hdDQgPSBuZXcgTmV3QXJyYXlNYXQgKDQsIDQpXHJcblxyXG5jbGFzcyBBcnJheU1hdCBpbXBsZW1lbnRzIE1hdDIsIE1hdDMsIE1hdDRcclxue1xyXG4gICAgcmVhZG9ubHkgcm93czogbnVtYmVyXHJcbiAgICByZWFkb25seSBjb2xzOiBudW1iZXJcclxuXHJcbiAgICBwcml2YXRlIGFycmF5OiBudW1iZXJbXVxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvciAodmFsdWVzOiBudW1iZXJbXSwgcm93czogbnVtYmVyLCBjb2x1bW5zOiBudW1iZXIpIFxyXG4gICAge1xyXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoICE9PSByb3dzICpjb2x1bW5zKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIkFycmF5IGxlbmd0aCBoYXMgdG8gYmUgZXF1ZWFsIHJvd3MgKiBjb2x1bW5zLlwiKSBcclxuICAgICAgICB0aGlzLmFycmF5ID0gdmFsdWVzXHJcbiAgICAgICAgdGhpcy5yb3dzID0gcm93c1xyXG4gICAgICAgIHRoaXMuY29scyA9IGNvbHVtbnMgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQgKHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlcik6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5W2NvbHVtbiAqIHRoaXMucm93cyArIHJvd11cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1hcCAob3BlcjogKHg6IG51bWJlcikgPT4gbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0ICh0aGlzLmFycmF5Lm1hcCAoXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICh0aGlzLCB2LCBpLCBhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BlciAodilcclxuICAgICAgICAgICAgfSksIHRoaXMuY29scywgdGhpcy5yb3dzKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFwMiAob3RoZXI6IEFycmF5TWF0LCBvcGVyOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29scyAhPSBvdGhlci5jb2xzIHx8IHRoaXMucm93cyAhPSBvdGhlci5yb3dzKVxyXG4gICAgICAgICAgICB0aHJvdyBSYW5nZUVycm9yIChcIk1hdHJpeCBkaW1lbnNpb25zIG11c3QgbWF0Y2guXCIpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAodGhpcy5hcnJheS5tYXAgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodGhpcywgdiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9wZXIgKHYsIG90aGVyLmFycmF5W2ldKVxyXG4gICAgICAgICAgICB9KSwgdGhpcy5jb2xzLCB0aGlzLnJvd3MpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYXRyaXhNdWx0aXBseSAob3RoZXI6IEFycmF5TWF0KTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMucm93c1xyXG4gICAgICAgIGxldCBtID0gdGhpcy5jb2xzXHJcbiAgICAgICAgbGV0IHEgPSBvdGhlci5yb3dzXHJcbiAgICAgICAgbGV0IHAgPSBvdGhlci5jb2xzXHJcbiAgICAgICAgaWYgKG0gIT09IHEpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKGBDYW5ub3QgbXVsdGlwbHkgJHtufXgke219IG1hdHJpeCB3aXRoICR7cX14JHtwfSBtYXRyaXguYClcclxuICAgICAgICBsZXQgcmVzID0gQXJyYXk8bnVtYmVyPiAobiAqIHApXHJcbiAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHJvd3MgYW5kIGNvbHVtbnNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKylcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIFN1bSB1cCByb3dzIGZyb20gdGhpcyB3aXRoIGNvbHVtbnMgZnJvbSBvdGhlciBtYXRyaXguXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gMFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBtOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsICs9IHRoaXMuYXJyYXlbayAqIG4gKyBpXSAqIG90aGVyLmFycmF5W2ogKiBxICsga11cclxuICAgICAgICAgICAgICAgIHJlc1tqICogbiArIGldID0gdmFsIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU1hdCAocmVzLCBuLCBwKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZCAob3RoZXI6IEFycmF5TWF0IHwgbnVtYmVyKTogQXJyYXlNYXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBBcnJheU1hdCA/XHJcbiAgICAgICAgICAgIHRoaXMubWFwMiAob3RoZXIsICh4LCB5KSA9PiB4ICsgeSkgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICsgb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgc3ViIChvdGhlcjogQXJyYXlNYXQgfCBudW1iZXIpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIEFycmF5TWF0ID9cclxuICAgICAgICAgICAgdGhpcy5tYXAyIChvdGhlciwgKHgsIHkpID0+IHggLSB5KSA6XHJcbiAgICAgICAgICAgIHRoaXMubWFwICh4ID0+IHggLSBvdGhlcilcclxuICAgIH1cclxuXHJcbiAgICBtdWwgKG90aGVyOiBBcnJheU1hdCB8IG51bWJlcik6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgQXJyYXlNYXQgP1xyXG4gICAgICAgICAgICB0aGlzLm1hdHJpeE11bHRpcGx5IChvdGhlcikgOlxyXG4gICAgICAgICAgICB0aGlzLm1hcCAoeCA9PiB4ICogb3RoZXIpXHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtPFYgZXh0ZW5kcyBWZWM8Vj4+IChvdGhlcjogVik6IFZcclxuICAgIHtcclxuICAgICAgICBsZXQgdmVjbSA9IG5ldyBBcnJheU1hdCAob3RoZXIudG9BcnJheSAoKSwgdGhpcy5jb2xzLCAxKVxyXG4gICAgICAgIHJldHVybiBvdGhlci5uZXdWZWMgKCkuZnJvbUFycmF5ICh0aGlzLm1hdHJpeE11bHRpcGx5ICh2ZWNtKS5hcnJheSlcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc3Bvc2UgKCk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJvd3MgPSB0aGlzLmNvbHNcclxuICAgICAgICBsZXQgY29scyA9IHRoaXMucm93c1xyXG4gICAgICAgIGxldCByZXMgPSBBcnJheTxudW1iZXI+ICh0aGlzLmFycmF5Lmxlbmd0aClcclxuICAgICAgICBsZXQgaW5kID0gMFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93czsgaSsrKVxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbHM7IGorKylcclxuICAgICAgICAgICAgICAgIHJlc1tqICogcm93cyArIGldID0gdGhpcy5hcnJheVtpbmQrK11cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChyZXMsIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgZGV0ZXJtaW5hbnQgKCk6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRldGVybWluYW50RkEgKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW52ZXJ0ICgpOiBBcnJheU1hdFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBBcnJheU1hdC5mcm9tSmFnZ2VkQXJyYXkgKHRoaXMuaW52ZXJzZUZBICgpKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdG9KYWdnZWRBcnJheSAoKTogbnVtYmVyW11bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCB7IHJvd3MsIGNvbHMsIGFycmF5IH0gPSB0aGlzXHJcbiAgICAgICAgbGV0IHJlcyA9IEFycmF5PG51bWJlcltdPiAocm93cylcclxuICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlc1tyXSA9IEFycmF5PG51bWJlcj4oY29scylcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzOyBjKyspXHJcbiAgICAgICAgICAgICAgICByZXNbcl1bY10gPSBhcnJheVtjICogcm93cyArIHJdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBmcm9tSmFnZ2VkQXJyYXkgKG1hdHJpeDogbnVtYmVyW11bXSk6IEFycmF5TWF0XHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJvd3MgPSBtYXRyaXgubGVuZ3RoXHJcbiAgICAgICAgbGV0IGNvbHMgPSBtYXRyaXhbMF0ubGVuZ3RoXHJcbiAgICAgICAgbGV0IGFyciA9IEFycmF5PG51bWJlcj4oY29scyAqIHJvd3MpXHJcbiAgICAgICAgbGV0IGkgPSAwXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzOyBjKyspXHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgYXJyW2krK10gPSBtYXRyaXhbcl1bY11cclxuICAgICAgICByZXR1cm4gbmV3IEFycmF5TWF0IChhcnIsIHJvd3MsIGNvbHMpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNvbXBvc2VGQSAobWF0cml4OiBudW1iZXJbXVtdKTogWyBudW1iZXJbXSwgbnVtYmVyIF0gXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHsgcm93cywgY29scyB9ID0gdGhpc1xyXG4gICAgICAgIGlmIChyb3dzICE9IGNvbHMpXHJcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IgKFwiQ2Fubm90IGRlY29tcG9zZSBub24tc3F1YXJlIG1hdHJpeFwiKVxyXG4gICAgICAgIC8vIHNldCB1cCByb3cgcGVybXV0YXRpb24gcmVzdWx0XHJcbiAgICAgICAgbGV0IHBlcm0gPSBBcnJheTxudW1iZXI+KHJvd3MpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIFxyXG4gICAgICAgICAgICBwZXJtW2ldID0gaVxyXG4gICAgICAgIC8vIHRvZ2dsZSB0cmFja3Mgcm93IHN3YXBzLiArMSAtPiBldmVuLCAtMSAtPiBvZGQuIHVzZWQgYnkgTWF0cml4RGV0ZXJtaW5hbnRcclxuICAgICAgICBsZXQgdG9nZ2xlID0gMTsgXHJcbiAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb2xzIC0gMTsgYysrKSAvLyBlYWNoIGNvbHVtblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvbE1heCA9IE1hdGguYWJzIChtYXRyaXhbY11bY10pIC8vIGZpbmQgbGFyZ2VzdCB2YWx1ZSBpbiBjb2wgalxyXG4gICAgICAgICAgICBsZXQgcFJvdyA9IGNcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IGMgKyAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgaWYgKG1hdHJpeFtyXVtjXSA+IGNvbE1heClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xNYXggPSBtYXRyaXhbcl1bY11cclxuICAgICAgICAgICAgICAgICAgICBwUm93ID0gclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocFJvdyAhPSBjKSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgbGFyZ2VzdCB2YWx1ZSBub3Qgb24gcGl2b3QsIHN3YXAgcm93c1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvd1B0ciA9IG1hdHJpeFtwUm93XVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W3BSb3ddID0gbWF0cml4W2NdXHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbY10gPSByb3dQdHJcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBzd2FwIHBlcm0gaW5mb1xyXG4gICAgICAgICAgICAgICAgbGV0IHRtcCA9IHBlcm1bcFJvd11cclxuICAgICAgICAgICAgICAgIHBlcm1bcFJvd10gPSBwZXJtW2NdXHJcbiAgICAgICAgICAgICAgICBwZXJtW2NdID0gdG1wXHJcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgdGhlIHJvdy1zd2FwIHRvZ2dsZVxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZSAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBpbnB1dCBtYXRyaXggaXMgc2luZ3VsYXJcclxuICAgICAgICAgICAgaWYgKG1hdHJpeFtjXVtjXSA9PSAwKVxyXG4gICAgICAgICAgICAgICAgbWF0cml4W2NdW2NdID0gMC4wMDAwMDFcclxuICAgICAgICAgICAgZm9yIChsZXQgciA9IGMgKyAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXhbcl1bY10gLz0gbWF0cml4W2NdW2NdXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gYyArIDE7IGsgPCBjb2xzOyBrKyspXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4W3JdW2tdIC09IG1hdHJpeFtyXVtjXSAqIG1hdHJpeFtjXVtrXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbIHBlcm0sIHRvZ2dsZSBdXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRlcm1pbmFudEZBICgpOiBudW1iZXJcclxuICAgIHtcclxuICAgICAgICBsZXQgbWF0cml4ID0gdGhpcy50b0phZ2dlZEFycmF5ICgpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZGVjb21wb3NlRkEgKG1hdHJpeClbMV1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdHJpeC5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgcmVzdWx0ICo9IG1hdHJpeFtpXVtpXVxyXG4gICAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGludmVyc2VGQSAoKTogbnVtYmVyW11bXVxyXG4gICAge1xyXG4gICAgICAgIGxldCBtYXRyaXggPSB0aGlzLnRvSmFnZ2VkQXJyYXkgKClcclxuICAgICAgICBsZXQgcm93cyA9IG1hdHJpeC5sZW5ndGhcclxuICAgICAgICBsZXQgcmVzdWx0ID0gQXJyYXlIZWxwZXIuY2xvbmUgKG1hdHJpeClcclxuICAgICAgICBsZXQgcGVybSA9IHRoaXMuZGVjb21wb3NlRkEgKG1hdHJpeClbMF1cclxuICAgICAgICBsZXQgYiA9IEFycmF5PG51bWJlcj4ocm93cylcclxuICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHJvd3M7IGMrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHIgPSAwOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgICAgICAgICAgYltyXSA9IGMgPT0gcGVybVtyXSA/IDEgOiAwXHJcbiAgICAgICAgICAgIGxldCB4ID0gQXJyYXlNYXQuaGVscGVyU29sdmVmIChtYXRyaXgsIGIpIFxyXG4gICAgICAgICAgICBmb3IgKGxldCByID0gMDsgciA8IHJvd3M7IHIrKylcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtyXVtjXSA9IHhbcl1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGhlbHBlclNvbHZlZiAobHVNYXRyaXg6IG51bWJlcltdW10sIHZlY3RvcjogbnVtYmVyW10pOiBudW1iZXJbXSBcclxuICAgIHtcclxuICAgICAgICAvLyBiZWZvcmUgY2FsbGluZyB0aGlzIGhlbHBlciwgcGVybXV0ZSBiIHVzaW5nIHRoZSBwZXJtIGFycmF5IGZyb20gXHJcbiAgICAgICAgLy8gTWF0cml4RGVjb21wb3NlIHRoYXQgZ2VuZXJhdGVkIGx1TWF0cml4XHJcbiAgICAgICAgbGV0IHJvd3MgPSBsdU1hdHJpeC5sZW5ndGhcclxuICAgICAgICBsZXQgcmVzID0gdmVjdG9yLnNsaWNlICgpXHJcblxyXG4gICAgICAgIGZvciAobGV0IHIgPSAxOyByIDwgcm93czsgcisrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IHJlc1tyXVxyXG4gICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IHI7IGMrKylcclxuICAgICAgICAgICAgICAgIHN1bSAtPSBsdU1hdHJpeFtyXVtjXSAqIHJlc1tjXVxyXG4gICAgICAgICAgICByZXNbcl0gPSBzdW1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzW3Jvd3MgLSAxXSAvPSBsdU1hdHJpeFtyb3dzIC0gMV1bcm93cyAtIDFdXHJcbiAgICAgICAgZm9yIChsZXQgciA9IHJvd3MgLSAyOyByID49IDA7IHItLSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBzdW0gPSByZXNbcl1cclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IHIgKyAxOyBjIDwgcm93czsgYysrKVxyXG4gICAgICAgICAgICAgICAgc3VtIC09IGx1TWF0cml4W3JdW2NdICogcmVzW2NdXHJcbiAgICAgICAgICAgIHJlc1tyXSA9IHN1bSAvIGx1TWF0cml4W3JdW3JdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZXF1YWxzIChvdGhlcjogQXJyYXlNYXQpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPT09IG90aGVyLmFycmF5W2ldXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXBwcm94RXF1YWxzIChvdGhlcjogQXJyYXlNYXQsIGVwc2lsb24/OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkuZXZlcnkgKFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAodiwgaSwgYSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEZNYXRoLmFwcHJveEVxdWFscyAodiwgb3RoZXIuYXJyYXlbaV0sIGVwc2lsb24pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgdG9TdHJpbmcgKCk6IHN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGxldCByZXMgPSBcIlwiXHJcbiAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCB0aGlzLnJvd3M7IHIrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJlcyArPSBcIlsgXCJcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCB0aGlzLmNvbHM7IGMrKylcclxuICAgICAgICAgICAgICAgIHJlcyArPSB0aGlzLmVsZW1lbnQociwgYykgKyBcIiBcIlxyXG4gICAgICAgICAgICByZXMgKz0gXCJdXFxuXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgdG9BcnJheSAoKTogbnVtYmVyW11cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgfVxyXG5cclxuICAgIHRvRmxvYXQzMkFycmF5ICgpOiBGbG9hdDMyQXJyYXlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSAodGhpcy5hcnJheSlcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9BcnJheU1hdC50cyIsImV4cG9ydCB0eXBlIFNoYWRlclR5cGUgPSAndmVydGV4JyB8ICdmcmFnbWVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkZXJcclxue1xyXG4gICAgcHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0XHJcbiAgICByZWFkb25seSBnbFNoYWRlcjogV2ViR0xTaGFkZXJcclxuICAgIHJlYWRvbmx5IHR5cGU6IFNoYWRlclR5cGVcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgdHlwZTogU2hhZGVyVHlwZSwgc291cmNlOiBzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZVxyXG4gICAgICAgIGxldCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodGhpcy5nbFNoYWRlclR5cGUpO1xyXG4gICAgICAgIGlmIChzaGFkZXIgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yIChgRmFpbGVkIHRvIGNyZWF0ZSAke3R5cGV9IHNoYWRlci5gKVxyXG4gICAgICAgIFxyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBlcnJvciA9ICdBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcilcclxuICAgICAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcilcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsU2hhZGVyID0gc2hhZGVyXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdsU2hhZGVyVHlwZSAoKTogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3ZlcnRleCcgPyBcclxuICAgICAgICAgICAgdGhpcy5nbC5WRVJURVhfU0hBREVSIDogXHJcbiAgICAgICAgICAgIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2hhZGVyLnRzIiwiaW1wb3J0IHsgR0xSZXNvdXJjZSwgdXNpbmcgfSBmcm9tIFwiLi9HTFJlc291cmNlXCI7XHJcbmltcG9ydCB7IFZlcnRleEF0dHIsIFZlcnRleEF0dHJUeXBlLCBWZXJ0ZXhEZWYgfSBmcm9tIFwiLi9WZXJ0ZXhBdHRyXCJcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWZmZXIgZXh0ZW5kcyBHTFJlc291cmNlXHJcbntcclxuICAgIHJlYWRvbmx5IHRhcmdldDogbnVtYmVyXHJcbiAgICByZWFkb25seSBnbEJ1ZmZlcjogV2ViR0xCdWZmZXJcclxuICAgIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHRhcmdldDogbnVtYmVyLCBnbEJ1ZmZlcjogV2ViR0xCdWZmZXIsIGxlbmd0aDogbnVtYmVyKVxyXG4gICAge1xyXG4gICAgICAgIHN1cGVyIChnbClcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldFxyXG4gICAgICAgIHRoaXMuZ2xCdWZmZXIgPSBnbEJ1ZmZlclxyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoXHJcbiAgICB9XHJcblxyXG4gICAgdXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyICh0aGlzLnRhcmdldCwgdGhpcy5nbEJ1ZmZlcilcclxuICAgIH1cclxuXHJcbiAgICByZWxlYXNlICgpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyICh0aGlzLnRhcmdldCwgbnVsbClcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZlcnRleEJ1ZmZlcjxWPiBleHRlbmRzIEJ1ZmZlciBcclxue1xyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIHZlcnRleERlZjogVmVydGV4RGVmPFY+LCB2ZXJ0aWNlczogVltdKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWYgPSBnbC5jcmVhdGVCdWZmZXIgKClcclxuICAgICAgICBpZiAoYnVmID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ZhaWxlZCB0byBjcmVhdGUgdmVydGV4IGJ1ZmZlci4nKVxyXG4gICAgICAgIHN1cGVyIChnbCwgZ2wuQVJSQVlfQlVGRkVSLCBidWYsIHZlcnRpY2VzLmxlbmd0aClcclxuICAgICAgICB1c2luZyAodGhpcywgKCkgPT4gXHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEgKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5pbml0QnVmZmVyICh2ZXJ0ZXhEZWYsIHZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpKVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdEJ1ZmZlciAodmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj4sIHZlcnRpY2VzOiBWW10pOiBBcnJheUJ1ZmZlclxyXG4gICAge1xyXG4gICAgICAgIGxldCB2ZXJ0ZXhTaXplID0gdmVydGV4RGVmLnN0cmlkZVxyXG4gICAgICAgIGxldCBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGhcclxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyICh2ZXJ0ZXhTaXplICogbGVuKVxyXG4gICAgICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3IChidWZmZXIpXHJcbiAgICAgICAgdmVydGV4RGVmLnZlcnRleEF0dHJzLmZvckVhY2ggKGF0dHIgPT4gXHJcbiAgICAgICAgeyBcclxuICAgICAgICAgICAgdmFyIHNldHRlciA9IHRoaXMudmVydGV4QXR0clNldHRlciAodmlldywgYXR0ci50eXBlKVxyXG4gICAgICAgICAgICBsZXQgdHlwZVNpemUgPSBhdHRyLnR5cGVTaXplXHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBhdHRyLmdldHRlciAodmVydGljZXNbal0pXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGF0dHIubnVtQ29tcG9uZW50czsgaysrKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldHRlciAoKGogKiB2ZXJ0ZXhTaXplKSArIGF0dHIub2Zmc2V0ICsgKGsgKiB0eXBlU2l6ZSksIHZhbHVlc1trXSkgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBidWZmZXJcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZlcnRleEF0dHJTZXR0ZXIgKHZpZXc6IERhdGFWaWV3LCB0eXBlOiBWZXJ0ZXhBdHRyVHlwZSk6IFxyXG4gICAgICAgIChvZmZzZXQ6IG51bWJlciwgdmFsdWU6IG51bWJlcikgPT4gdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaCAodHlwZSkgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlICdieXRlJzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRJbnQ4IChvZmYsIHZhbClcclxuICAgICAgICAgICAgY2FzZSAndWJ5dGUnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldFVpbnQ4IChvZmYsIHZhbClcclxuICAgICAgICAgICAgY2FzZSAnc2hvcnQnOiByZXR1cm4gKG9mZiwgdmFsKSA9PiB2aWV3LnNldEludDE2IChvZmYsIHZhbCwgdHJ1ZSlcclxuICAgICAgICAgICAgY2FzZSAndXNob3J0JzogcmV0dXJuIChvZmYsIHZhbCkgPT4gdmlldy5zZXRVaW50MTYgKG9mZiwgdmFsLCB0cnVlKVxyXG4gICAgICAgICAgICBjYXNlICdmbG9hdCc6IHJldHVybiAob2ZmLCB2YWwpID0+IHZpZXcuc2V0RmxvYXQzMiAob2ZmLCB2YWwsIHRydWUpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW5kZXhCdWZmZXIgZXh0ZW5kcyBCdWZmZXJcclxue1xyXG4gICAgcmVhZG9ubHkgZ2xCdWZmZXI6IFdlYkdMQnVmZmVyICBcclxuICAgIHJlYWRvbmx5IGxlbmd0aDogbnVtYmVyXHJcblxyXG4gICAgY29uc3RydWN0b3IgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsIGluZGljZXM6IG51bWJlcltdKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWYgPSBnbC5jcmVhdGVCdWZmZXIgKClcclxuICAgICAgICBpZiAoYnVmID09PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvciAoJ0ZhaWxlZCB0byBjcmVhdGUgaW5kZXggYnVmZmVyLicpXHJcbiAgICAgICAgc3VwZXIgKGdsLCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnVmLCBpbmRpY2VzLmxlbmd0aClcclxuICAgICAgICB1c2luZyAodGhpcywgKCkgPT4gXHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEgKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkgKGluZGljZXMpLCBnbC5TVEFUSUNfRFJBVykpXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQnVmZmVycy50cyIsImltcG9ydCB7IFNoYWRlclR5cGUsIFNoYWRlciB9IGZyb20gXCIuL1NoYWRlclwiXHJcbmltcG9ydCB7IFZlcnRleEF0dHIsIFZlcnRleERlZiB9IGZyb20gXCIuL1ZlcnRleEF0dHJcIlxyXG5pbXBvcnQgeyBVbmlmb3JtLCBVbmlmb3JtRGVmIH0gZnJvbSBcIi4vVW5pZm9ybXNcIlxyXG5pbXBvcnQgeyBHTFJlc291cmNlLCB1c2luZyB9IGZyb20gXCIuL0dMUmVzb3VyY2VcIlxyXG5pbXBvcnQgeyBWZXJ0ZXhCdWZmZXIsIEluZGV4QnVmZmVyIH0gZnJvbSBcIi4vQnVmZmVyc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2dyYW08ViwgVT4gZXh0ZW5kcyBHTFJlc291cmNlXHJcbntcclxuICAgIHJlYWRvbmx5IGdsUHJvZ3JhbTogV2ViR0xQcm9ncmFtXHJcbiAgICByZWFkb25seSBzaGFkZXJzOiBTaGFkZXJbXVxyXG4gICAgcmVhZG9ubHkgdmVydGV4RGVmOiBWZXJ0ZXhEZWY8Vj5cclxuICAgIHJlYWRvbmx5IHVuaWZvcm1EZWY6IFVuaWZvcm1EZWY8VT5cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCwgXHJcbiAgICAgICAgc2hhZGVyczogU2hhZGVyW10sIFxyXG4gICAgICAgIHZlcnRleEF0dHJzOiBWZXJ0ZXhBdHRyPFY+W10sXHJcbiAgICAgICAgdW5pZm9ybXM6IFVuaWZvcm08VT5bXSkgXHJcbiAgICB7XHJcbiAgICAgICAgc3VwZXIgKGdsKVxyXG4gICAgICAgIHRoaXMuc2hhZGVycyA9IHNoYWRlcnNcclxuICAgICAgICB0aGlzLmdsUHJvZ3JhbSA9IHRoaXMubGluayAoKVxyXG4gICAgICAgIHRoaXMudmVydGV4RGVmID0gbmV3IFZlcnRleERlZiAodmVydGV4QXR0cnMpXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhEZWYuaW5pdFZlcnRleEF0dHJMb2NhdGlvbnMgKGdsLCB0aGlzLmdsUHJvZ3JhbSlcclxuICAgICAgICB0aGlzLnVuaWZvcm1EZWYgPSBuZXcgVW5pZm9ybURlZiAodW5pZm9ybXMpXHJcbiAgICAgICAgdGhpcy51bmlmb3JtRGVmLmluaXRVbmlmb3JtTG9jYXRpb25zIChnbCwgdGhpcy5nbFByb2dyYW0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsaW5rICgpOiBXZWJHTFByb2dyYW1cclxuICAgIHtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsXHJcbiAgICAgICAgbGV0IHByZyA9IGdsLmNyZWF0ZVByb2dyYW0oKVxyXG4gICAgICAgIGlmIChwcmcgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yIChcIkZhaWxlZCB0byBjcmVhdGUgcHJvZ3JhbVwiKVxyXG4gICAgICAgIHRoaXMuc2hhZGVycy5mb3JFYWNoKHMgPT4gZ2wuYXR0YWNoU2hhZGVyKHByZywgcy5nbFNoYWRlcikpXHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJnKTtcclxuICAgICAgXHJcbiAgICAgICAgaWYgKCFnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByZywgZ2wuTElOS19TVEFUVVMpKSBcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IgKCdVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW06ICcgKyBcclxuICAgICAgICAgICAgICAgIGdsLmdldFByb2dyYW1JbmZvTG9nKHByZykpXHJcbiAgICAgICAgcmV0dXJuIHByZ1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW5hYmxlVmVydGV4QXR0ckFycmF5cyAoKVxyXG4gICAge1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2xcclxuICAgICAgICB0aGlzLnZlcnRleERlZi52ZXJ0ZXhBdHRycy5mb3JFYWNoIChhdHRyID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKFxyXG4gICAgICAgICAgICAgICAgYXR0ci5sb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIGF0dHIubnVtQ29tcG9uZW50cyxcclxuICAgICAgICAgICAgICAgIGF0dHIuZ2xUeXBlIChnbCksXHJcbiAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGV4RGVmLnN0cmlkZSxcclxuICAgICAgICAgICAgICAgIGF0dHIub2Zmc2V0KTtcclxuICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0ci5sb2NhdGlvbik7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICB1c2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0gKHRoaXMuZ2xQcm9ncmFtKVxyXG4gICAgfVxyXG5cclxuICAgIHJlbGVhc2UgKClcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0gKG51bGwpXHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0VsZW1lbnRzIChtb2RlOiBudW1iZXIsIHZidWZmZXI6IFZlcnRleEJ1ZmZlcjxWPiwgaWJ1ZmZlcjogSW5kZXhCdWZmZXIsIHVuaWZvcm1zOiBVKVxyXG4gICAge1xyXG4gICAgICAgIHVzaW5nIChbdGhpcywgdmJ1ZmZlciwgaWJ1ZmZlcl0sIGdsID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnVuaWZvcm1EZWYuc2V0VmFsdWVzIChnbCwgdW5pZm9ybXMpXHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlVmVydGV4QXR0ckFycmF5cyAoKVxyXG4gICAgICAgICAgICBnbC5kcmF3RWxlbWVudHMgKG1vZGUsIGlidWZmZXIubGVuZ3RoLCBnbC5VTlNJR05FRF9TSE9SVCwgMClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Byb2dyYW0udHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiIGF0dHJpYnV0ZSB2ZWM0IGFWZXJ0ZXhQb3NpdGlvbjtcXHJcXG4gdmFyeWluZyBoaWdocCB2ZWMzIHBvc2l0aW9uO1xcclxcbiBcXHJcXG4gdW5pZm9ybSBtYXQ0IHVNb2RlbFZpZXdNYXRyaXg7XFxyXFxuIHVuaWZvcm0gbWF0NCB1UHJvamVjdGlvbk1hdHJpeDtcXHJcXG5cXHJcXG52b2lkIG1haW4oKSB7XFxyXFxuICAgIHBvc2l0aW9uID0gbWF4KGFWZXJ0ZXhQb3NpdGlvbi54eXosIHZlYzMoMCkpO1xcclxcbiAgICBnbF9Qb3NpdGlvbiA9IHVQcm9qZWN0aW9uTWF0cml4ICogdU1vZGVsVmlld01hdHJpeCAqIGFWZXJ0ZXhQb3NpdGlvbjtcXHJcXG4gfVxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2hhZGVycy9zaW1wbGUudmVydFxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcInZhcnlpbmcgaGlnaHAgdmVjMyBwb3NpdGlvbjtcXHJcXG5cXHJcXG52b2lkIG1haW4oKSB7IFxcclxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHBvc2l0aW9uLCAxLjApO1xcclxcbn1cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NoYWRlcnMvc2ltcGxlLmZyYWdcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=