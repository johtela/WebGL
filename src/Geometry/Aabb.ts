import { Vec, NewVec, Vec3, Vec4 } from "../Math/Vectors";
import { Mat4 } from "../Math/Matrices";

export enum Alignment
{
    none, negative, center, positive
}

export class Aabb<V extends Vec<V>>
{
    readonly min: V
    readonly max: V

    constructor (pos1: V, pos2: V = pos1)
    {
        this.min = pos1.min (pos2)
        this.max = pos2.max (pos1)
    }

    get left (): number 
    {
        return this.min.component (0)
    }

    get right (): number 
    {
        return this.max.component (0)
    }

    get bottom (): number 
    {
        return this.min.component (1)
    }

    get top (): number 
    {
        return this.max.component (1)
    }

    get back (): number 
    {
        return this.min.component (2)
    }

    get front (): number 
    {
        return this.max.component (2)
    }

    get size (): V
    {
        return this.max.sub (this.min)
    }

    get center (): V
    {
        return this.min.add (this.max).div (2)
    }

    private corner (index: number, dimensions: number): number[]
    {
        let result = new Array<number>(dimensions)
        let minArray = this.min.toArray ()
        let maxArray = this.max.toArray ()
        for (let i = 0; i < dimensions; i++)
        {
            result[i] = (index & 1) === 1 ? maxArray[i] : minArray[i]
            index >>= 1 
        }
        return result
    }

    get corners (): V[]
    {
        let dim = this.min.dimensions
        let newVec = this.min.newVec ()
        let result = new Array<V>(1 << dim)
        for (let i = 0; i < result.length; i++)
            result[i] = newVec.fromArray (this.corner (i, dim))
        return result
    }

    getAlignmentOffset (other: Aabb<V>, dim: number, align: Alignment)
    {
        switch (align)
        {
            case Alignment.negative: 
                return this.min.component (dim) - other.min.component (dim)
            case Alignment.positive: 
                return this.max.component (dim) - other.max.component (dim)
            case Alignment.center: 
                return this.center.component (dim) - other.center.component (dim)
            default: return 0
        }
    }

    add (position: V|V[]): Aabb<V>
    {
        if (position instanceof Array)
        {
            let min = this.min
            let max = this.max
            for (let i = 0; i < position.length; i++)
            {
                min = min.min (position[i])
                max = max.max (position[i])
            }
            return new Aabb<V> (min, max)
        }
        return new Aabb<V> (this.min.min (position), this.max.max (position))
    }

    union (other: Aabb<V>): Aabb<V>
    {
        return new Aabb<V> (this.min.min (other.min), this.max.max (other.max))
    }

    intersects (other: Aabb<V> | V): boolean
    {
        if (other instanceof Aabb)
        {
            for (let i = 0; i < this.min.dimensions; i++)
                if (this.max.component(i) < other.min.component(i) || 
                    this.min.component(i) > other.max.component(i))
                    return false;
        }
        else
        {
            for (let i = 0; i < this.min.dimensions; i++)
                if (this.max.component(i) < other.component(i) || 
                    this.min.component(i) > other.component(i))
                    return false;
        }
        return true;
    }

    equals (other: Aabb<V>): boolean
    {
        return this.min.equals (other.min) && this.max.equals (other.max)
    }

    toString (): string
    {
        return `${this.min} -> ${this.max}`
    }
}

export function fromPositions<V extends Vec<V>> (positions: V[]): Aabb<V>
{
    let first = positions.pop ()
    if (!first)
        throw Error ("No positions given")
    return new Aabb<V> (first).add (positions)
}

export function transformAabb3 (bbox: Aabb<Vec3>, matrix: Mat4): Aabb<Vec3>
{
    return fromPositions (bbox.corners.map (c => matrix.transform (c.toVec4 (1)).toVec3 ()))
}