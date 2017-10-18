import { Mat, NewMat } from "../Math/Matrices";

export interface Transformable<T extends Transformable<T, M>, M extends Mat<M>>
{
    newMat (): NewMat<M>
    transform (matrix: M): T
    reverseWinding (): T
}

function translate<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, offsets: number[])
{
    return tf.transform (tf.newMat ().translation (offsets))
}

function scale<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, factors: number[])
{
    return tf.transform (tf.newMat ().scaling (factors))
}

function rotateX<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationX (angle))
}

function rotateY<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationY (angle))
}

function rotateZ<T extends Transformable<T, M>, M extends Mat<M>> (tf: T, angle: number)
{
    return tf.transform (tf.newMat ().rotationZ (angle))
}

function reflectX<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([-1,1,1,1])).reverseWinding ()
}

function reflectY<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([1,-1,1,1])).reverseWinding ()
}

function reflectZ<T extends Transformable<T, M>, M extends Mat<M>> (tf: T)
{
    return tf.transform (tf.newMat ().scaling ([1,1,-1,1])).reverseWinding ()
}