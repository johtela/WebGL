///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>

import * as jsc from "jsverify";
import { approxEquals } from "./FMath";
import { Vec, Vec2, Vec3, Vec4 } from "./Vectors"
import { vec2, vec3, vec4 } from "./Float32Vec";

function arbNumArr (size: number): jsc.Arbitrary<number[]>
{
    let arr = Array<jsc.Arbitrary<number>>(size);
    for (var i = 0; i < arr.length; i++)
        arr[i] = jsc.number
    return jsc.tuple (arr)
}

const arbVec2: jsc.Arbitrary<Vec2> = arbNumArr (2).smap (
    a => vec2 (a[0], a[1]),
    v => [v.x, v.y], v => v.toString ())
const arbVec3: jsc.Arbitrary<Vec3> = arbNumArr (3).smap (
    a => vec3 (a[0], a[1], a[2]),
    v => [v.x, v.y, v.z], v => v.toString ())
const arbVec4: jsc.Arbitrary<Vec4> = arbNumArr (4).smap (
    a => vec4 (a[0], a[1], a[2], a[3]),
    v => [v.x, v.y, v.z, v.w], v => v.toString ())

function addAndSubtract<V extends Vec<V>> (arb: jsc.Arbitrary<V>, zero: V)
{
    let dim = zero.dimensions
    jsc.property (`Vec${dim}: v - v = ${zero}`, arb, 
        v => v.sub (v).equals (zero))
    jsc.property (`Vec${dim}: v1 - v2 = v1 + (-v2)`, arb, arb, 
        (v1, v2) => v1.sub (v2).equals (v1.add (v2.inv ())))
    jsc.property (`Vec${dim}: |v + v| = 2 * |v|`, arb,  
        v => v.add (v).len === 2 * v.len)
}

function multiplyWithScalar<V extends Vec<V>> (arb: jsc.Arbitrary<V>)
{
    let dim = arb.generator (0).dimensions
    jsc.property (`Vec${dim}: |v * s| = |s| * |v|`, arb, jsc.number,  
        (v, s) => approxEquals ((v.mul (s)).len, Math.abs (s) * v.len))
}

describe ("vector addition and subtraction", () =>
{
    addAndSubtract<Vec2> (arbVec2, vec2 (0))
    addAndSubtract<Vec3> (arbVec3, vec3 (0))
    addAndSubtract<Vec4> (arbVec4, vec4 (0))
})

describe ("vector multiplication with scalar", () =>
{
    multiplyWithScalar<Vec2> (arbVec2)
    multiplyWithScalar<Vec3> (arbVec3)
    multiplyWithScalar<Vec4> (arbVec4)
})
