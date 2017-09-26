///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>

import * as jsc from "jsverify";
import { approxEquals } from "./FMath";
import { NewVec, Vec, Vec2, Vec3, Vec4 } from "./Vectors"
import { newVec2, newVec3, newVec4 } from "./ArrayVec";

export function arbNumArr (size: number): jsc.Arbitrary<number[]>
{
    return jsc.tuple (Array<jsc.Arbitrary<number>>(size).fill (jsc.number));
}

export const arbVec2: jsc.Arbitrary<Vec2> = arbNumArr (2).smap (
    a => newVec2.fromArray (a),
    v => [v.x, v.y], v => v.toString ())
export const arbVec3: jsc.Arbitrary<Vec3> = arbNumArr (3).smap (
    a => newVec3.fromArray (a),
    v => [v.x, v.y, v.z], v => v.toString ())
export const arbVec4: jsc.Arbitrary<Vec4> = arbNumArr (4).smap (
    a => newVec4.fromArray (a),
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
    newVec: NewVec<V>)
{
    let dim = arb.generator (0).dimensions
    jsc.property (`Vec${dim}: v * s = v * v.${'s'.repeat (dim)}`, 
        arb, jsc.number,  
        (v, s) => v.mul (s).approxEquals (v.mul (newVec.unif (s))))
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
        (v1, v2) => approxEquals (v1.dot (v2), v1.dot (v2.norm ()) * v2.len))
    jsc.property (`Vec${dim}: v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != ${zero}`,
        nonzero, arb, 
        (v1, v2) => approxEquals (v1.dot (v2), v2.dot (v1.norm ()) * v1.len))
}

describe ("vector addition and subtraction", () =>
{
    addAndSubtract (arbVec2, newVec2.zero)
    addAndSubtract (arbVec3, newVec3.zero)
    addAndSubtract (arbVec4, newVec4.zero)
})

describe ("vector multiplication with scalar", () =>
{
    multiplyWithScalar (arbVec2)
    multiplyWithScalar (arbVec3)
    multiplyWithScalar (arbVec4)
})

describe ("vector multiplication with vector", () =>
{
    multiplyWithVector (arbVec2, newVec2)
    multiplyWithVector (arbVec3, newVec3)
    multiplyWithVector (arbVec4, newVec4)
})

describe ("vector division with scalar", () =>
{
    divideWithScalar (arbVec2)
    divideWithScalar (arbVec3)
    divideWithScalar (arbVec4)
})

describe ("vector normalization", () =>
{
    normalize (arbVec2, newVec2.zero)
    normalize (arbVec3, newVec3.zero)
    normalize (arbVec4, newVec4.zero)
})

describe ("vector dot product", () =>
{
    dotProduct (arbVec2, newVec2.zero)
    dotProduct (arbVec3, newVec3.zero)
    dotProduct (arbVec4, newVec4.zero)
})

describe ("vec3 cross product", () =>
{
    var nonzero = jsc.suchthat (arbVec3, v => !v.equals (newVec3.zero))
    jsc.property (`Vec3: norm(v1) x norm(v2) . norm(v1|v2) = 1 when v1, v2 != [0 0 0]`, 
        nonzero, nonzero,
        (v1, v2) =>
        {
            let v1n = v1.norm ()
            let v2n = v2.norm ()
            let cr = v1n.cross (v2n)
            let dt1 = cr.dot (v1n)
            let dt2 = cr.dot (v2n)
            return approxEquals (dt1, 0) && approxEquals (dt2, 0)
        })
})