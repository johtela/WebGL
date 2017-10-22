import { Vertex3D } from "./Vertex";
import { Geometry } from "./Geometry"

export class Wrapper<V extends Vertex3D<V>> extends Geometry<V>
{
    constructor (readonly geometry: Geometry<V>)
    {
        super ()
    }

    protected generateVertices(): V[] 
    {
        return this.geometry.vertices
    }

    protected generateIndices(): number[] 
    {
        return this.geometry.indices
    }
}