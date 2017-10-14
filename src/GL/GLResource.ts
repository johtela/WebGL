export abstract class GLResource
{
    constructor (readonly gl: WebGLRenderingContext) { }
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