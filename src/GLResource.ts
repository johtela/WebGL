export abstract class GLResource
{
    readonly gl: WebGLRenderingContext

    constructor (gl: WebGLRenderingContext)
    {
        this.gl = gl
    }

    abstract use ()
    abstract release ()
}

export function using (resource: GLResource | GLResource[], 
    action: (gl: WebGLRenderingContext) => void)
{
    if (resource instanceof Array)
        resource.forEach (res => res.use ())
    else
        resource.use ()
    try
    {
        action (this.gl)
    }
    finally
    {
        if (resource instanceof Array)
            resource.forEach (res => res.release ())
        else
            resource.release ()
    }
}