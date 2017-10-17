///<reference types="jsverify"/>

import * as jsc from "jsverify"
import * as Arb from "./ArbitraryTypes"
import { Vec, Vec2, Vec3 } from "../src/Math/Vectors"
import { Dir2D, Dir3D, Positional, Planar, extents, center, furthest, facing, areCoplanar } 
    from "../src/Geometry/Vertex"
import { newVec2, newVec3 } from "../src/Math/ArrayVec";

function testExtents<P extends Positional<V>, V extends Vec<V>> (arb: jsc.Arbitrary<P[]>, zero: V)
{
    let dim = zero.dimensions
    jsc.property (`Positional<Vec${dim}>[]: all positionals are between extents`, 
        jsc.suchthat (arb, ps => ps.length > 0),
        positionals =>
        {
            let [ min, max ] = extents<P, V> (positionals)
            return positionals.every (p => 
                p.position.min (min).equals (min) && p.position.max (max).equals (max))
        })
}

function testCenter<P extends Positional<V>, V extends Vec<V>> (arb: jsc.Arbitrary<P[]>, zero: V)
{
    let dim = zero.dimensions
    jsc.property (`Positional<Vec${dim}>[]: center is inside extents`, 
        jsc.suchthat (arb, ps => ps.length > 0),
        positionals =>
        {
            let [ min, max ] = extents<P, V> (positionals)
            let cent = center<P, V> (positionals)
            return cent.min (min).equals (min) && cent.max (max).equals (max) &&
                cent.equals (min.add (max).div (2))
        })
}

function testFurthest<P extends Positional<V>, V extends Vec<V>> (arbPos: jsc.Arbitrary<P[]>, 
    arbDir: jsc.Arbitrary<V>)
{
    let dim = arbDir.generator (0).dimensions
    jsc.property (`Positional<Vec${dim}>[]: furthest positionals are found`, arbDir, 
        jsc.suchthat (arbPos, ps => ps.length > 0),
        (dir, positionals) =>
        {
            let furth = furthest<P, V> (positionals, dir)
            return positionals.every (p => 
                furth.every (f => 
                    f.position.dot (dir) >= p.position.dot (dir)))
        })
}

describe ("extents of positionals", () =>
{
    testExtents (Arb.positionals2, newVec2.zero)
    testExtents (Arb.positionals3, newVec3.zero)
})

describe ("center location of positionals", () =>
{
    testCenter (Arb.positionals2, newVec2.zero)
    testCenter (Arb.positionals3, newVec3.zero)
})

describe ("find furthest positionals in a direction", () =>
{
    testFurthest (Arb.positionals2, Arb.vec2)
    testFurthest (Arb.positionals3, Arb.vec3)
})

describe ("find planars facing a direction", () =>
{
    jsc.property ("at least one planar is facing the same direction as a random item in array",
        jsc.suchthat (Arb.planars, p => p.length > 0), planars =>
        {
            let randItem = jsc.random (0, planars.length - 1)
            return facing (planars, planars[randItem].normal).length > 0
        })
})

describe ("positionals are coplanar", () => 
{
    let zero = newVec3.zero
    jsc.property ("given two vectors all linear combinations of the vectors are coplanar",
        Arb.vec3, Arb.vec3, jsc.number, jsc.number, (v1, v2, s1, s2) =>
        {
            let positions = [ v1, v2, zero, v1.mul (s1).add (v2.mul (s2)) ]
            return areCoplanar (positions.map (p => new Arb.APositional (p)))
        })
})