import { flatMap, sum } from "../Common/ArrayExt"
import { Vertex3D } from "./Vertex"
import { Geometry } from "./Geometry"

export class Composite<V extends Vertex3D<V>> extends Geometry<V>
{
    constructor (readonly geometries: Geometry<V>[])
    {
        super ()
    }

    static create<V extends Vertex3D<V>> (...geometries: Geometry<V>[])
    {
        return new Composite<V> (geometries)
    }

    protected generateVertices (): V[]
    {
        return flatMap (this.geometries, g => g.vertices)
    }

    protected generateIndices (): number[]
    {
        let resLen = sum (this.geometries.map (g => g.indices.length))
        let result = new Array<number> (resLen)
        for (let g = 0, r = 0, c = 0; g < this.geometries.length; g++)
        {
            let geom = this.geometries[g]
            for (let i = 0; i < geom.indices.length; i++)
                result[r++] = c + geom.indices[i]
            c += geom.vertices.length
        }
        return result
    }
}