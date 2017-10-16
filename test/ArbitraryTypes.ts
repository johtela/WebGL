///<reference types="jsverify"/>

import * as jsc from "jsverify"
import * as ArrayHelper from "../src/Common/ArrayHelper";
import { NewVec, Vec, Vec2, Vec3, Vec4 } from "../src/Math/Vectors"
import { newVec2, newVec3, newVec4 } from "../src/Math/ArrayVec"
import { NewMat, NewMat4, Mat, Mat2, Mat3, Mat4 } from "../src/Math/Matrices";
import { newMat2, newMat3, newMat4 } from "../src/Math/ArrayMat";

export function arbNumArr (size: number): jsc.Arbitrary<number[]>
{
    return jsc.tuple (ArrayHelper.fill (Array<jsc.Arbitrary<number>>(size), jsc.number));
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

export const arbMat2: jsc.Arbitrary<Mat2> = arbNumArr (4).smap (
    a => newMat2.fromArray (a, 2, 2),
    m => m.toArray (), m => m.toString ())
export const arbMat3: jsc.Arbitrary<Mat3> = arbNumArr (9).smap (
    a => newMat3.fromArray (a, 3, 3),
    m => m.toArray (), m => m.toString ())
export const arbMat4: jsc.Arbitrary<Mat4> = arbNumArr (16).smap (
    a => newMat4.fromArray (a, 4, 4),
    m => m.toArray (), m => m.toString ())

