import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";

export interface Mat<M extends Mat<M, V>, V extends Vec<V>>
{
    readonly rows: number
    readonly cols: number

    element (row: number, column: number): number
    add (other: M | number): M
    sub (other: M | number): M
    mul (other: M | number): M
    transform (other: V): V
    transpose (): M
    determinant (): number
    invert (): M

    equals (other: M): boolean
    approxEquals (other: M, epsilon?: number): boolean
    toString (): string
    toArray (): number[]
    toFloat32Array (): Float32Array
}

export interface NewMat<M extends Mat<M, V>, V extends Vec<V>>
{
    readonly rows: number
    readonly cols: number
    readonly zero: M
    readonly identity: M
    translation (offsets: V|number[]): M
    scaling (factors: V|number[]): M
    rotationX (angle: number): M
    rotationY (angle: number): M
    rotationZ (angle: number): M
    fromArray (array: number[], rows: number, cols: number)
}

export interface Mat2 extends Mat<Mat2, Vec2> {}
export interface Mat3 extends Mat<Mat3, Vec3> {}
export interface Mat4 extends Mat<Mat4, Vec4> {}

export interface NewMat4 extends NewMat<Mat4, Vec4>
{
    perspective (left: number, right: number, bottom: number, top: number,
        zNear: number, zFar: number): Mat4
    orthographic (left: number, right: number, bottom: number, top: number,
        zNear: number, zFar: number): Mat4
    lookAt (direction: Vec3, up: Vec3): Mat4
}