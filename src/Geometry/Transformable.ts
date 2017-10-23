import { Mat, NewMat } from "../Math/Matrices";

export interface Transformable<T extends Transformable<T, M>, M extends Mat<M>>
{
    newMat (): NewMat<M>
    transform (matrix: M): T
    reverseWinding (): T
}

export function translate<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, offsets: number[])
{
    return tf.transform (tf.newMat ().translation (offsets))
}

export function scale<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, factors: number[])
{
    return tf.transform (tf.newMat ().scaling (factors))
}

export function rotateX<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationX (angle))
}

export function rotateY<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationY (angle))
}

export function rotateZ<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationZ (angle))
}

export function reflectX<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([-1,1,1,1])).reverseWinding ()
}

export function reflectY<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([1,-1,1,1])).reverseWinding ()
}

export function reflectZ<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([1,1,-1,1])).reverseWinding ()
}