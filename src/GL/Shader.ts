export type ShaderType = 'vertex' | 'fragment'

export class Shader
{
    readonly glShader: WebGLShader

    constructor (private gl: WebGLRenderingContext, readonly type: ShaderType, source: string)
    {
        this.gl = gl
        this.type = type
        let shader = gl.createShader(this.glShaderType);
        if (shader === null)
            throw Error (`Failed to create ${type} shader.`)
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
        {
            let error = 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
            gl.deleteShader(shader)
            throw Error(error);
        }
        this.glShader = shader
    }

    get glShaderType (): number
    {
        return this.type === 'vertex' ? 
            this.gl.VERTEX_SHADER : 
            this.gl.FRAGMENT_SHADER
    }
}