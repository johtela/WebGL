import { VertexAttr, VertexDef } from "./VertexAttr"
import { ShaderType, Shader } from "./Shader"

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

}