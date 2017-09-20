import { Vec } from "./Vectors";

interface Mat<M extends Mat<M>>
{
    readonly rows: number
    readonly cols: number

    element (row: number, column: number): number
    add (other: M | number): M
    sub (other: M | number): M
    mul (other: M | number): M
    mulVec<V extends Vec<V>> (other: V): V
    transpose (): M

    approxEquals (other: M, epsilon?: number): boolean
    toString (): string
    toFloat32Array (): Float32Array
    
    
}

interface NewMat<M extends Mat<M>>
{
    identity (): M
    translation (...offsets: number[])
    scaling (...factors: number[])
    
}

interface Mat2 extends Mat<Mat2> {}
interface Mat3 extends Mat<Mat3> {}
interface Mat4 extends Mat<Mat4> {}