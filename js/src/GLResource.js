"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GLResource = (function () {
    function GLResource(gl) {
        this.gl = gl;
    }
    return GLResource;
}());
exports.GLResource = GLResource;
function using(resource, action) {
    if (resource instanceof Array)
        resource.forEach(function (res) { return res.use(); });
    else
        resource.use();
    try {
        action(this.gl);
    }
    finally {
        if (resource instanceof Array)
            resource.forEach(function (res) { return res.release(); });
        else
            resource.release();
    }
}
exports.using = using;
//# sourceMappingURL=GLResource.js.map