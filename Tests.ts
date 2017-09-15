///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>

import * as jsc from "jsverify";

describe ("foobar", () =>
{
    // forall (f : bool -> bool) (b : bool), f (f (f b)) = f(b).
    jsc.property ("foobar2", "bool -> bool", "bool", (f, b) =>
        f(f(f(b))) === b
    );
});
