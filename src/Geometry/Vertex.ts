import { Vec, Vec2, Vec3, Vec4, NewVec } from "../Math/Vectors"
import { newVec2, newVec3 } from "../Math/ArrayVec"
import { approxEquals } from "../Math/FMath"
import { VertexDef } from "../GL/VertexAttr"
import { maxItems, sum } from "../Common/ArrayExt"
import * as VertexFilter from "./VertexFilter" 

export interface Positional<V extends Vec<V>>
{
    position: V
}

export interface Planar
{
    normal: Vec3
}

export interface Vertex<V>
{
    vertexDef: VertexDef<V>
}

export interface Vertex3D<V> extends Vertex<V>, Positional<Vec3>, Planar {}

export class Dir2D
{
    static left: Vec2 = newVec2.init (-1, 0)
    static right: Vec2 = newVec2.init (1, 0)
    static down: Vec2 = newVec2.init (0, -1)
    static up: Vec2 = newVec2.init (0, 1)
}

export class Dir3D
{
    static left: Vec3 = newVec3.init (-1, 0, 0)
    static right: Vec3 = newVec3.init (1, 0, 0)
    static down: Vec3 = newVec3.init (0, -1, 0)
    static up: Vec3 = newVec3.init (0, 1, 0)
    static back: Vec3 = newVec3.init (0, 0, -1)
    static front: Vec3 = newVec3.init (0, 0, 1)
}

export function newVertex3D<V extends Vertex3D<V>> (vertType: new () => V,
    position: Vec3, normal: Vec3): V
{
    let vertex = new vertType ()
    vertex.position = position
    vertex.normal = normal
    return vertex
}

export function copyVertex3D<V extends Vertex3D<V>> (vertex: V, position: Vec3 = vertex.position, 
    normal: Vec3 = vertex.normal): V
{
    let copy = <V>Object.create (vertex)
    copy.position = position
    copy.normal = normal
    return copy
}

export function instanceOfVertex3D<V> (object: any): object is Vertex3D<V>
{
    return 'vertexDef' in object && 'position' in object && 'normal' in object
}

export function center<P extends Positional<V>, V extends Vec<V>> (positionals: P[]): V
{
    let [ min, max ] = extents<P, V> (positionals)
    return min.add (max).div (2)
}

export function extents<P extends Positional<V>, V extends Vec<V>> (positionals: P[]): [V, V]
{
    if (positionals.length === 0)
        throw Error ("Empty argument array.")
    let min = positionals[0].position
    let max = min

    for (let i = 1; i < positionals.length; i++)
    {
        let pos = positionals[i].position 
        min = pos.min (min)
        max = pos.max (max)
    }
    return [ min, max ]
}

export function furthest<P extends Positional<V>, V extends Vec<V>> (positionals: P[],
    direction: V): P[]
{
    return maxItems (positionals, p => p.position.dot (direction))
}

export function facing<P extends Planar> (planars: P[], direction: Vec3): P[]
{
    return planars.filter (p => VertexFilter.facing (p, direction))
}

export function areCoplanar<P extends Positional<Vec3>> (positionals: P[]): boolean 
{
    if (positionals.length < 4)
        return true;
    var first = positionals[0].position
    var ab = positionals[1].position.sub (first)
    var ac = positionals[2].position.sub (first)
    var normal = ab.cross (ac)

    for (let i = 3; i < positionals.length; i++)
        if (!approxEquals (normal.dot (positionals[i].position.sub (first)), 0, 0.1))
            return false
    return true
}