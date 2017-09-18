///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>

import * as jsc from "jsverify";
import { approxEquals } from "./FMath";
import { Vec, Vec2, Vec3, Vec4 } from "./Vectors"
import { vec2, vec3, vec4 } from "./Float32Vec";

function arbNumArr (size: number): jsc.Arbitrary<number[]>
{
    return jsc.tuple (Array<jsc.Arbitrary<number>>(size).fill (jsc.number));
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

function multiplyWithVector<V extends Vec<V>> (arb: jsc.Arbitrary<V>, 
    newVec: (number) => V)
{
    let dim = arb.generator (0).dimensions
    jsc.property (`Vec${dim}: v * s = v * v.${'s'.repeat (dim)}`, 
        arb, jsc.number,  
        (v, s) => v.mul (s).approxEquals (v.mul (newVec (s))))
}

function divideWithScalar<V extends Vec<V>> (arb: jsc.Arbitrary<V>)
{
    let dim = arb.generator (0).dimensions
    jsc.property (`Vec${dim}: v / s = v * (1 / s) when s != 0`, 
        arb, jsc.suchthat (jsc.number, s => s != 0),  
        (v, s) => v.div (s).approxEquals (v.mul (1 / s)))
}

function normalize<V extends Vec<V>> (arb: jsc.Arbitrary<V>, zero: V)
{
    let dim = arb.generator (0).dimensions
    jsc.property (`Vec${dim}: |norm (v)| = 1 when v != ${zero}`, 
        jsc.suchthat (arb, v => !v.equals (zero)), 
        v => approxEquals (v.norm ().len, 1))
}

function dotProduct<V extends Vec<V>> (arb: jsc.Arbitrary<V>, zero: V)
{
    let dim = arb.generator (0).dimensions
    var nonzero = jsc.suchthat (arb, v => !v.equals (zero))
    jsc.property (`Vec${dim}: -1 <= norm(v1) . norm(v2) <= 1 when v1, v2 != ${zero}`, 
        nonzero, nonzero,
        (v1, v2) => 
        {
            let dp = v1.norm ().dot (v2.norm ()) 
            return -1 <= dp && dp <= 1
        })
    jsc.property (`Vec${dim}: v1 . v2 == (v1 . norm(v2)) * |v2| when v2 != ${zero}`,
        arb, nonzero,
        (v1, v2) => approxEquals (v1.dot (v2), v1.dot (v2.norm ()) * v2.len, 0.0001))
    jsc.property (`Vec${dim}: v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != ${zero}`,
        nonzero, arb, 
        (v1, v2) => approxEquals (v1.dot (v2), v2.dot (v1.norm ()) * v1.len, 0.0001))
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

describe ("vector multiplication with vector", () =>
{
    multiplyWithVector<Vec2> (arbVec2, vec2)
    multiplyWithVector<Vec3> (arbVec3, vec3)
    multiplyWithVector<Vec4> (arbVec4, vec4)
})

describe ("vector division with scalar", () =>
{
    divideWithScalar<Vec2> (arbVec2)
    divideWithScalar<Vec3> (arbVec3)
    divideWithScalar<Vec4> (arbVec4)
})

describe ("vector normalization", () =>
{
    normalize<Vec2> (arbVec2, vec2 (0))
    normalize<Vec3> (arbVec3, vec3 (0))
    normalize<Vec4> (arbVec4, vec4 (0))
})

describe ("vector dot product", () =>
{
    dotProduct<Vec2> (arbVec2, vec2 (0))
    dotProduct<Vec3> (arbVec3, vec3 (0))
    dotProduct<Vec4> (arbVec4, vec4 (0))
})
