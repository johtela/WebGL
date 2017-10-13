import { ShaderType, Shader } from "./Shader"
import { VertexAttr, VertexDef } from "./VertexAttr"
import { Uniform, UniformDef } from "./Uniforms"
import { GLResource, using } from "./GLResource"
import { VertexBuffer, IndexBuffer } from "./Buffers";

export class Program<V, U> extends GLResource
{
    readonly glProgram: WebGLProgram
    readonly shaders: Shader[]
    readonly vertexDef: VertexDef<V>
    readonly uniformDef: UniformDef<U>

    constructor (gl: WebGLRenderingContext, 
        shaders: Shader[], 
        vertexAttrs: VertexAttr<V>[],
        uniforms: Uniform<U>[]) 
    {
        super (gl)
        this.shaders = shaders
        this.glProgram = this.link ()
        this.vertexDef = new VertexDef (vertexAttrs)
        this.vertexDef.initVertexAttrLocations (gl, this.glProgram)
        this.uniformDef = new UniformDef (uniforms)
        this.uniformDef.initUniformLocations (gl, this.glProgram)
    }

    private link (): WebGLProgram
    {
        let gl = this.gl
        let prg = gl.createProgram()
        if (prg === null)
            throw Error ("Failed to create program")
        this.shaders.forEach(s => gl.attachShader(prg, s.glShader))
        gl.linkProgram(prg);
      
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) 
            throw Error ('Unable to initialize the shader program: ' + 
                gl.getProgramInfoLog(prg))
        return prg
    }

    private enableVertexAttrArrays ()
    {
        let gl = this.gl
        this.vertexDef.vertexAttrs.forEach (attr =>
        {
            gl.vertexAttribPointer(
                attr.location,
                attr.numComponents,
                attr.glType (gl),
                false,
                this.vertexDef.stride,
                attr.offset);
            gl.enableVertexAttribArray(attr.location);
        })
    }

    use ()
    {
        this.gl.useProgram (this.glProgram)
    }

    release ()
    {
        this.gl.useProgram (null)
    }

    drawElements (mode: number, vbuffer: VertexBuffer<V>, ibuffer: IndexBuffer, uniforms: U)
    {
        using ([this, vbuffer, ibuffer], gl =>
        {
            this.uniformDef.setValues (gl, uniforms)
            this.enableVertexAttrArrays ()
            // gl.drawElements (mode, ibuffer.length, gl.UNSIGNED_SHORT, 0)
            gl.drawArrays (mode, 0, vbuffer.length)
        })
    }
}