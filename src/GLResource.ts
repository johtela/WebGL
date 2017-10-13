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
    let res = resource instanceof Array ? 
        resource.pop () : 
        resource
    if (!res)
        return
    res.use ()
    try
    {
        if (resource instanceof Array && resource.length > 0)
            using (resource, action)
        else
            action (res.gl)
    }
    finally
    {
        res.release ()
    }
}