import { IterableExt } from "../Common/IterableExt"
import { twoPI } from "../Math/FMath"
import { Vec3 } from "../Math/Vectors"
import { Positional } from "./Vertex"

class TessVertex extends IterableExt<TessVertex>
{
    next: TessVertex
    previous: TessVertex

    angle: number
    isEar: boolean

    constructor (public index: number) 
    {
        super ()
    }

    get isReflex(): boolean
    {
        return this.angle >= Math.PI
    }

    static circularList (count: number): TessVertex 
    {
        var first = new TessVertex (0)
        var prev = first;

        for (var i = 1; i < count; i ++)
        {
            var tv = new TessVertex (i)
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
    var count = vertices.length
    if (count < 3)
        throw new Error ("Tesselator needs at least 3 vertices");
    var result = new Array<number> ((count - 2) * 3)
    var resInd = 0
    var tessVerts = TessVertex.circularList (count)

    for (let tv of tessVerts) 
        updateVertexAngle (tv, vertices)
    for (let tv of tessVerts) 
        updateIsEar (tv, vertices)

    while (count > 3)
    {
        var curr = Iter.min (tessVerts.filter (v => v.isEar), v => v.angle)
        var prev = curr.previous
        var next = curr.next
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
    foreach (tessVerts, tv => result[resInd++] = tv.index)
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
        var prev = current.previous
        var next = current.next
        var p0 = vertices[prev.index].position
        var p1 = vertices[current.index].position
        var p2 = vertices[next.index].position

        current.isEar = current.Where (v => v != current && v != prev && v != next && v.IsReflex)
            .All (cv => !pointInTriangle (vertices[cv.Index].position, p0, p1, p2));
    }
}

function angleBetweenEdges<P extends Positional<Vec3>> (prev: number, current: number, 
    next: number, vertices: P[]): number
{
    var vec1 = vertices[prev].position.sub (vertices[current].position)
    var vec2 = vertices[next].position.sub (vertices[current].position)
    var result = Math.atan2 (vec2.y, vec2.x) - Math.atan2 (vec1.y, vec1.x)
    return result < 0 ? twoPI + result : result;
}

function pointInTriangle (p: Vec3, p0: Vec3, p1: Vec3, p2: Vec3)
{
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y)
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y)
    if (s <= 0 || t <= 0)
        return false
    var A = (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
    return (s + t) < A
}
