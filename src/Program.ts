import { VertexAttr, VertexDef } from "./VertexAttr"
import { ShaderType, Shader } from "./Shader"
import { VertexBuffer, IndexBuffer } from "./Buffers";

export class Program<V>
{
    readonly gl: WebGLRenderingContext
    readonly glProgram: WebGLProgram
    readonly shaders: Shader[]
    readonly vertexDef: VertexDef<V>

    constructor (gl: WebGLRenderingContext, 
        shaders: Shader[], 
        vertexAttrs: VertexAttr<V>[]) 
    {
        this.gl = gl
        this.shaders = shaders
        this.glProgram = this.link ()
        this.vertexDef = new VertexDef (vertexAttrs)
        this.vertexDef.initVertexAttrLocations (gl, this.glProgram)
    }

    private link (): WebGLProgram
    {
        let gl = this.gl
        let prg = gl.createProgram()
        if (prg === null)
            throw Error ("Failed to create program")
        this.shaders.forEach(s => gl.attachShader(s.glShader, s.glShaderType))
        gl.linkProgram(prg);
      
        if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) 
            throw Error ('Unable to initialize the shader program: ' + 
                gl.getProgramInfoLog(prg))
        return prg
    }

    private initVertexAttrArrays ()
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

    drawElements (mode: number, vbuffer: VertexBuffer<V>, ibuffer: IndexBuffer)
    {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer.glBuffer)
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, ibuffer.glBuffer)
        this.initVertexAttrArrays ()
        gl.drawElements (mode, ibuffer.count, gl.UNSIGNED_SHORT, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, null)
    }
}