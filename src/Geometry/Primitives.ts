import { twoPI } from "../Math/FMath"
import { Vec3 } from "../Math/Vectors"
import { newVec3 } from "../Math/ArrayVec"
import { Mat3, Mat4 } from "../Math/Matrices"
import { Vertex3D, newVertex3D } from "./Vertex"
import { Geometry } from "./Geometry"

export abstract class Primitive<V extends Vertex3D<V>> extends Geometry<V>
{
    protected constructor (readonly vertices: V[])
    {
        super ()
    }

    protected generateVertices(): V[] 
    {
        return this.vertices
    }
}

export class Circular<V extends Vertex3D<V>> extends Primitive<V>
{
    protected constructor (vertices: V[], private fullCircle: boolean)
    {
        super (vertices)
    }

    static pie<V extends Vertex3D<V>> (vertType: new () => V, width: number, height: number, 
        stepAngle: number, startAngle: number, endAngle: number): Circular<V>
    {
        if (startAngle > endAngle)
            throw RangeError ("Start angle must be bigger than end angle")
        var fullCircle = startAngle == endAngle
        if (fullCircle)
            endAngle += twoPI
        var vertCount =  Math.ceil ((endAngle - startAngle) / stepAngle) + (fullCircle ? 1 : 2);
        var normal = newVec3.init (0, 0, 1)
        var vertices = new Array<V>(vertCount)
        vertices[0] = newVertex3D (vertType, newVec3.zero, normal)
        var angle = startAngle;
        for (var i = 1; i < vertCount; i++)
        {
            var pos = newVec3.init (width * Math.cos (angle), height * Math.sin (angle), 0)
            vertices [i] = newVertex3D (vertType, pos, normal)
            angle = Math.min (angle + stepAngle, endAngle);
        }
        return new Circular<V> (vertices, fullCircle);
    }

    static ellipse<V extends Vertex3D<V>> (vertType: new () => V, width: number, height: number, 
        stepAngle: number = Math.PI / 18): Circular<V>
    {
        return Circular.pie<V> (vertType, width, height, stepAngle, 0, 0)        
    }

    static circle<V extends Vertex3D<V>> (vertType: new () => V, diameter: number, 
        stepAngle: number = Math.PI / 18): Circular<V>
    {
        return Circular.pie<V> (vertType, diameter, diameter, stepAngle, 0, 0)        
    }

    protected generateIndices (): number[]
    {
        let cnt = (this.vertices.length - 2) * 3 + (this.fullCircle ? 3 : 0) 
        let result = new Array<number>(cnt)
        for (var i = 2; i < cnt; i++) 
        {
            result[i - 2] = 0
            result[i - 2] = i
            result[i - 2] = i - 1            
        }
        if (this.fullCircle)
        {
            result [cnt - 3] = 0
            result [cnt - 2] = 1
            result [cnt - 1] = cnt - 4
        }
        return result
    }
}