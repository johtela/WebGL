import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";
import { Mat, Mat2, Mat3, Mat4 } from "./Matrices";

export type UniformType = 'int' | 'float' | 'matrix'

export class Uniform<U>
{
    readonly name: string
    readonly type: UniformType
    readonly numComponents: number
    readonly getter: (U) => number[]

    location: WebGLUniformLocation

    constructor (name: string, type: UniformType, components: number, getter: (U) => number[]) 
    {
        let lowComp = type === 'matrix' ? 2 : 1
        if (components < lowComp || components > 4)
            throw RangeError (`Number of components must be [${lowComp}..4] for ${type}.`)
        this.type = type
        this.numComponents = components
        this.getter = getter
    }

    setValue (gl: WebGLRenderingContext, uniforms: U)
    {
        let val = this.getter (uniforms)
        if (val.length < this.numComponents || val.length % this.numComponents !== 0)
            throw Error ('Invalid number of uniform elements.')
        switch (this.numComponents) 
        {
            case 1:
                if (this.type === 'int')
                    gl.uniform1iv (this.location, val)
                else if (this.type === 'float')
                    gl.uniform1fv (this.location, val)
                break
            case 2:
                if (this.type == 'int')
                    gl.uniform2iv (this.location, val)
                else if (this.type === 'float')
                    gl.uniform2fv (this.location, val)
                else
                    gl.uniformMatrix2fv (this.location, false, val)
                break
            case 3:
                if (this.type == 'int')
                    gl.uniform3iv (this.location, val)
                else if (this.type === 'float')
                    gl.uniform3fv (this.location, val)
                else
                    gl.uniformMatrix3fv (this.location, false, val)
                break
            case 4:
                if (this.type == 'int')
                    gl.uniform4iv (this.location, val)
                else if (this.type === 'float')
                    gl.uniform4fv (this.location, val)
                else
                    gl.uniformMatrix4fv (this.location, false, val)
        }
    }
}

export class UniformDef<U>
{
    readonly uniforms: Uniform<U>[]
    
    constructor (uniforms: Uniform<U>[])
    {
        this.uniforms = uniforms
    }

    initUniformLocations (gl: WebGLRenderingContext, prg: WebGLProgram)
    {
        this.uniforms.forEach(u =>
        {
            var loc = gl.getUniformLocation (prg, u.name)
            if (loc === null)
                throw Error (`Uniform '${u.name}' not found in program.`)
            u.location = loc
        })
    }

    setValues (gl: WebGLRenderingContext, uniforms: U)
    {
        this.uniforms.forEach (unif => unif.setValue (gl, uniforms));
    }
}

export function int<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'int', 1, u => [ u[name] ])
}

export function float<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 1, u => [ u[name] ])
}

export function vec2<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 2, u => (<Vec2>u[name]).toArray ())
}

export function vec3<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 3, u => (<Vec3>u[name]).toArray ())
}

export function vec4<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 4, u => (<Vec4>u[name]).toArray ())
}

export function mat2<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 2, u => (<Mat2>u[name]).toArray ())
}

export function mat3<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 3, u => (<Mat3>u[name]).toArray ())
}

export function mat4<U, A extends keyof U> (name: A): Uniform<U>
{
    return new Uniform (name, 'float', 4, u => (<Mat4>u[name]).toArray ())
}