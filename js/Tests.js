"use strict";
///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
var jsc = require("jsverify");
describe("foobar", function () {
    // forall (f : bool -> bool) (b : bool), f (f (f b)) = f(b).
    jsc.property("foobar2", "bool -> bool", "bool", function (f, b) {
        return f(f(f(b))) === b;
    });
});
//# sourceMappingURL=Tests.js.map