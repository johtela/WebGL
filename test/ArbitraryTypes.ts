///<reference types="jsverify"/>

import * as jsc from "jsverify"
import * as ArrayExt from "../src/Common/ArrayExt";
import { NewVec, Vec, Vec2, Vec3, Vec4 } from "../src/Math/Vectors"
import { newVec2, newVec3, newVec4 } from "../src/Math/ArrayVec"
import { NewMat, NewMat4, Mat, Mat2, Mat3, Mat4 } from "../src/Math/Matrices";
import { newMat2, newMat3, newMat4 } from "../src/Math/ArrayMat";
import { Positional, Planar } from "../src/Geometry/Vertex";

export function numArr (size: number): jsc.Arbitrary<number[]>
{
    return jsc.tuple (ArrayExt.fill (Array<jsc.Arbitrary<number>>(size), jsc.number));
}

export const vec2: jsc.Arbitrary<Vec2> = numArr (2).smap (
    a => newVec2.fromArray (a),
    v => [v.x, v.y], v => v.toString ())
export const vec3: jsc.Arbitrary<Vec3> = numArr (3).smap (
    a => newVec3.fromArray (a),
    v => [v.x, v.y, v.z], v => v.toString ())
export const vec4: jsc.Arbitrary<Vec4> = numArr (4).smap (
    a => newVec4.fromArray (a),
    v => [v.x, v.y, v.z, v.w], v => v.toString ())

export const mat2: jsc.Arbitrary<Mat2> = numArr (4).smap (
    a => newMat2.fromArray (a, 2, 2),
    m => m.toArray (), m => m.toString ())
export const mat3: jsc.Arbitrary<Mat3> = numArr (9).smap (
    a => newMat3.fromArray (a, 3, 3),
    m => m.toArray (), m => m.toString ())
export const mat4: jsc.Arbitrary<Mat4> = numArr (16).smap (
    a => newMat4.fromArray (a, 4, 4),
    m => m.toArray (), m => m.toString ())

class APositional<V extends Vec<V>> implements Positional<V>
{
    constructor (public position: V) {}
}

export const positional2: jsc.Arbitrary<Positional<Vec2>> = vec2.smap (
    v => new APositional (v),
    p => p.position, p => `{ position: ${p.position} }`)
export const positional3: jsc.Arbitrary<Positional<Vec3>> = vec3.smap (
    v => new APositional (v),
    p => p.position, p => `{ position: ${p.position} }`)
export const positionals2: jsc.Arbitrary<Positional<Vec2>[]> = jsc.array (positional2)
export const positionals3: jsc.Arbitrary<Positional<Vec3>[]> = jsc.array (positional3)

class APlanar implements Planar
{
    constructor (public normal: Vec3) {}
}

export const planar: jsc.Arbitrary<Planar> = vec3.smap (
    v => new APlanar (v.norm ()),
    p => p.normal, p => `{ normal: ${p.normal} }`)
export const planars: jsc.Arbitrary<Planar[]> = jsc.array (planar)
