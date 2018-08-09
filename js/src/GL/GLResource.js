"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GLResource {
    constructor(gl) {
        this.gl = gl;
    }
}
exports.GLResource = GLResource;
function using(resource, action) {
    let res = resource instanceof Array ?
        resource.pop() :
        resource;
    if (!res)
        return;
    res.use();
    try {
        if (resource instanceof Array && resource.length > 0)
            using(resource, action);
        else
            action(res.gl);
    }
    finally {
        res.release();
    }
}
exports.using = using;
//# sourceMappingURL=GLResource.js.map