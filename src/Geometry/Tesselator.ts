import * as Iter from "../Common/IterableExt"
import { twoPI } from "../Math/FMath"
import { Vec3 } from "../Math/Vectors"
import { Positional } from "./Vertex"

class TessVertex implements Iterable<TessVertex>
{
    next: TessVertex
    previous: TessVertex
    angle: number
    isEar: boolean

    constructor (public index: number) {}

    get isReflex(): boolean
    {
        return this.angle >= Math.PI
    }

    static circularList (count: number): TessVertex 
    {
        let first = new TessVertex (0)
        let prev = first;

        for (let i = 1; i < count; i ++)
        {
            let tv = new TessVertex (i)
            prev.next = tv
            tv.previous = prev
            prev = tv
        }
        prev.next = first
        first.previous = prev
        return first
    }

    delete ()
    {
        this.previous.next = this.next
        this.next.previous = this.previous
    }

    *[Symbol.iterator] (): Iterator<TessVertex>
    {
        let first = <TessVertex>this
        let curr = first
        do
        {
            yield curr
            curr = curr.next
        }
        while (curr != first)
    }
}

export function tesselatePolygon<P extends Positional<Vec3>> (vertices: P[]): number[]
{
    let count = vertices.length
    if (count < 3)
        throw new Error ("Tesselator needs at least 3 vertices");
    let result = new Array<number> ((count - 2) * 3)
    let resInd = 0
    let tessVerts = TessVertex.circularList (count)

    for (let tv of tessVerts) 
        updateVertexAngle (tv, vertices)
    for (let tv of tessVerts) 
        updateIsEar (tv, vertices)

    while (count > 3)
    {
        let curr = Iter.min (Iter.filter (tessVerts, v => v.isEar), v => v.angle)!
        let prev = curr.previous
        let next = curr.next
        result[resInd++] = prev.index
        result[resInd++] = curr.index
        result[resInd++] = next.index
        curr.delete ()
        updateVertexAngle (prev, vertices)
        updateVertexAngle (next, vertices)
        updateIsEar (prev, vertices)
        updateIsEar (next, vertices)
        tessVerts = next
        count--
    }
    for (let tv of tessVerts)
        result[resInd++] = tv.index
    return result;
}

function updateVertexAngle<P extends Positional<Vec3>> (tessVert: TessVertex, vertices: P[])
{
    tessVert.angle = angleBetweenEdges (
        tessVert.previous.index, tessVert.index, tessVert.next.index, vertices);
}

function updateIsEar<P extends Positional<Vec3>> (current: TessVertex, vertices: P[])
{
    if (current.isReflex)
        current.isEar = false
    else
    {
        let prev = current.previous
        let next = current.next
        let p0 = vertices[prev.index].position
        let p1 = vertices[current.index].position
        let p2 = vertices[next.index].position

        current.isEar = Iter.every ( 
            Iter.filter (current, v => v != current && v != prev && v != next && v.isReflex),
            v => !pointInTriangle (vertices[v.index].position, p0, p1, p2))
    }
}

function angleBetweenEdges<P extends Positional<Vec3>> (prev: number, current: number, 
    next: number, vertices: P[]): number
{
    let vec1 = vertices[prev].position.sub (vertices[current].position)
    let vec2 = vertices[next].position.sub (vertices[current].position)
    let result = Math.atan2 (vec2.y, vec2.x) - Math.atan2 (vec1.y, vec1.x)
    return result < 0 ? twoPI + result : result;
}

function pointInTriangle (p: Vec3, p0: Vec3, p1: Vec3, p2: Vec3)
{
    let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y)
    let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y)
    if (s <= 0 || t <= 0)
        return false
    let A = (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
    return (s + t) < A
}
