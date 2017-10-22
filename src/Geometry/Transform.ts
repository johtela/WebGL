import { Vec3 } from "../Math/Vectors";
import { Mat3, Mat4 } from "../Math/Matrices";
import { Vertex3D, copyVertex3D } from "./Vertex";
import { Geometry } from "./Geometry"
import { Wrapper } from "./Wrapper";

export class Transform<V extends Vertex3D<V>> extends Wrapper<V>
{
    constructor (geometry: Geometry<V>, readonly matrix: Mat4)
    {
        super (geometry)
    }

    protected generateVertices(): V[]
    {
        let normalMatrix = this.matrix.toMat3 ().invert ().transpose ()
        return this.geometry.vertices.map (v => 
            copyVertex3D (v, 
                this.matrix.transform (v.position), 
                normalMatrix.transform (v.normal)))
    }
}