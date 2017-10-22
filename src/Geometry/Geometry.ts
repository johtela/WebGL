import { Vec3 } from "../Math/Vectors";
import { Mat4, NewMat } from "../Math/Matrices";
import { newMat4 } from "../Math/ArrayMat";
import { Aabb, fromPositions } from "./Aabb";
import { Vertex3D } from "./Vertex";
import { Transformable } from "./Transformable";
import { Transform } from "./Transform";

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

    }
}