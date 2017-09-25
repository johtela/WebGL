///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>

import * as jsc from "jsverify";
import { approxEquals } from "./FMath";
import { NewVec, Vec, Vec2, Vec3, Vec4 } from "./Vectors"
import { newVec2, newVec3, newVec4 } from "./ArrayVec";
import { NewMat, NewMat4, Mat, Mat2, Mat3, Mat4 } from "./Matrices";
import { newMat2, newMat3, newMat4 } from "./ArrayMat";
import { arbNumArr, arbVec2, arbVec3, arbVec4 } from "./VecTests";

const arbMat2: jsc.Arbitrary<Mat2> = arbNumArr (4).smap (
    a => newMat2.fromArray (a, 2, 2),
    m => m.toArray (), m => m.toString ())
const arbMat3: jsc.Arbitrary<Mat3> = arbNumArr (9).smap (
    a => newMat3.fromArray (a, 3, 3),
    m => m.toArray (), m => m.toString ())
const arbMat4: jsc.Arbitrary<Mat4> = arbNumArr (16).smap (
    a => newMat4.fromArray (a, 4, 4),
    m => m.toArray (), m => m.toString ())

function transformationIsLinear<M extends Mat<M, V>, V extends Vec<V>> (
    arbm: jsc.Arbitrary<M>, arbv: jsc.Arbitrary<V>)
{
    let d = arbv.generator (0).dimensions
    jsc.property (`Mat${d}: M(v1) + M(v2) = M(v1 + v2)`, arbm, arbv, arbv, 
        (m, v1, v2) => m.transform (v1).add (m.transform (v2))
            .approxEquals (m.transform (v1.add (v2))))
    jsc.property (`Mat${d}: M(v * s) = s * M(v)`, arbm, arbv, jsc.number, 
        (m, v, s) => m.transform (v.mul (s)).approxEquals (m.transform (v).mul (s)))
}

function addAndSubtract<M extends Mat<M, V>, V extends Vec<V>> (
    arb: jsc.Arbitrary<M>, zero: M)
{
    jsc.property (`Mat${zero.rows}: m - m = [ 0 ... ]`, arb, 
        m => m.sub (m).equals (zero))
    jsc.property (`Mat${zero.rows}: m1 - m2 = m1 + (-m2)`, arb, arb, 
        (m1, m2) => m1.sub (m2).equals (m1.add (m2.mul (-1))))
}

function multiplyWithScalar<M extends Mat<M, V>, V extends Vec<V>> (
    arb: jsc.Arbitrary<M>)
{
    let d = arb.generator (0).rows
    jsc.property (`Mat${d}: m * s * (1 / s) = m when s != 0`, 
        arb, jsc.suchthat (jsc.number, s => s != 0),  
        (m, s) => m.mul (s).mul (1 / s).approxEquals (m))
}

function transpose<M extends Mat<M, V>, V extends Vec<V>> (
    arb: jsc.Arbitrary<M>)
{
    let d = arb.generator (0).rows
    jsc.property (`Mat${d}: m.rows = m^T.cols and m.cols = m^T.rows`, arb, 
        m =>
        {
            let mt = m.transpose ()
            return m.rows == mt.cols && m.cols == mt.rows
        })
    jsc.property (`Mat${d}: m^T^T = m`, arb, 
        m => m.transpose ().transpose ().equals (m))
    jsc.property (`Mat${d}: m1^T + m2^T = (m1 + m2)^T`, arb, arb, 
        (m1, m2) => m1.transpose (). add (m2.transpose ())
            .equals (m1.add (m2).transpose ()))
}

describe ("matrix transformation is linear", () =>
{
    transformationIsLinear (arbMat2, arbVec2)
    transformationIsLinear (arbMat3, arbVec3)
    transformationIsLinear (arbMat4, arbVec4)
})

describe ("matrix addition and subtraction", () =>
{
    addAndSubtract (arbMat2, newMat2.zero ())
    addAndSubtract (arbMat3, newMat3.zero ())
    addAndSubtract (arbMat4, newMat4.zero ())
})

describe ("matrix multiplication with scalar", () =>
{
    multiplyWithScalar (arbMat2)
    multiplyWithScalar (arbMat3)
    multiplyWithScalar (arbMat4)
})

describe ("matrix transpose", () =>
{
    transpose (arbMat2)
    transpose (arbMat3)
    transpose (arbMat4)
})
