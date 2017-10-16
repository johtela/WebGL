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
//# sourceMappingURL=Uniforms.js.map