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
//# sourceMappingURL=Shader.js.map