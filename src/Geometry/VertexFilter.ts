import { Vec3 } from "../Math/Vectors";
import { approxEquals } from "../Math/FMath"
import { Planar } from "./Vertex";

export function facing<P extends Planar> (planar: P, direction: Vec3): boolean
{
    return approxEquals (planar.normal.dot (direction), 1, 0.1)
}