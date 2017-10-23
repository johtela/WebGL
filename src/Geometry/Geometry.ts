import { Vec3 } from "../Math/Vectors";
import { Mat4, NewMat } from "../Math/Matrices";
import { newMat4 } from "../Math/ArrayMat";
import { Aabb, fromPositions, Alignment } from "./Aabb";
import { Vertex3D, instanceOfVertex3D, copyVertex3D } from "./Vertex";
import { Transformable, translate } from "./Transformable";
import { Transform, ReverseIndices } from "./Transform";

export enum Axis 
{
    x = 1, 
    y = 2, 
    z = 4,
    All = 7
}

export enum AxisDirection
{
    negative = -1,
    positive = 1
}

export abstract class Geometry<V extends Vertex3D<V>> 
    implements Transformable<Geometry<V>, Mat4>
{
    private _boundingBox: Aabb<Vec3> | null
    private _vertices: V[] | null
    private _indices: number[] | null

    protected abstract generateVertices (): V[]
    protected abstract generateIndices (): number[]

    get vertices (): V[]
    {
        if (this._vertices === null)
            this._vertices = Array.from (this.generateVertices ())
        return this._vertices
    }

    get indices (): number[]
    {
        if (this._indices === null)
            this._indices = Array.from (this.generateIndices ())
        return this._indices
    }

    get boundingBox (): Aabb<Vec3>
    {
        if (this._boundingBox === null)
            this._boundingBox = fromPositions (this.vertices.map (v => v.position))
        return this._boundingBox
    }

    newMat (): NewMat<Mat4>
    {
        return newMat4
    }

    transform (matrix: Mat4): Geometry<V>
    {
        if (this instanceof Transform)
        {
            let trans = this as Transform<V>
            return new Transform (trans.geometry, matrix.mul (trans.matrix))
        }
        else 
            return new Transform (this, matrix)
    }

    reverseWinding (): Geometry<V>
    {
        return new ReverseIndices (this)
    }
}

export function center<V extends Vertex3D<V>> (geometry: Geometry<V>): Geometry<V>
{
    let center = geometry.boundingBox.center
    return translate (geometry, center.inv ().toArray ())
}

function snapOffset (pos: Vec3, snapToPos: Vec3, snapAxis: Axis): Vec3
{
    let result = snapToPos.sub (pos)
    if ((snapAxis & Axis.x) === 0)
        result.x = 0
    if ((snapAxis & Axis.y) === 0)
        result.y = 0
    if ((snapAxis & Axis.z) === 0)
        result.z = 0
    return result
}

export function snapVertex<V extends Vertex3D<V>> (geometry: Geometry<V>, position: Vec3 | V, 
    snapToVertex: V, snapAxis: Axis)
{
    var offset = snapOffset (instanceOfVertex3D<V> (position) ? position.position : position, 
        snapToVertex.position, snapAxis)
    return translate (geometry, offset.toArray ());
}

export function normalsAsVertices<V extends Vertex3D<V>> (geometry: Geometry<V>): V[]
{
    let vertices = geometry.vertices
    let result = new Array<V> (vertices.length * 2)
    for (let i = 0; i < vertices.length; i++)
    {
        let vert = vertices[i]
        result [i * 2] = vert
        result [i * 2 + 1] = copyVertex3D (vert, vert.position.add (vert.normal))
    }
    return result
}

function alignmentMatrix (xalign: Alignment, yalign: Alignment, zalign: Alignment,
    alignWith: Aabb<Vec3>, bbox: Aabb<Vec3>): Mat4
{
    return newMat4.translation ([
        alignWith.getAlignmentOffset (bbox, 0, xalign),
        alignWith.getAlignmentOffset (bbox, 1, yalign),
        alignWith.getAlignmentOffset (bbox, 2, zalign)])
}

export function align<V extends Vertex3D<V>> (geometries: Geometry<V>[], 
    xalign: Alignment = Alignment.none, 
    yalign: Alignment = Alignment.none, 
    zalign: Alignment = Alignment.none): Geometry<V>[]
{
    let cnt = geometries.length
    if (cnt === 0)
        throw RangeError ("Geometries array is empty.")
    let result = new Array<Geometry<V>>(cnt)
    let alignWith = geometries[0].boundingBox
    result[0] = geometries[0]
    for (let i = 1; i < cnt; i++)
    {
        let geom = geometries[i]
        result[i] = geom.transform (alignmentMatrix (xalign, yalign, zalign, alignWith, geom.boundingBox))
    }
    return result
}