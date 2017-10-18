"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function translate(tf, offsets) {
    return tf.transform(tf.newMat().translation(offsets));
}
function scale(tf, factors) {
    return tf.transform(tf.newMat().scaling(factors));
}
function rotateX(tf, angle) {
    return tf.transform(tf.newMat().rotationX(angle));
}
function rotateY(tf, angle) {
    return tf.transform(tf.newMat().rotationY(angle));
}
function rotateZ(tf, angle) {
    return tf.transform(tf.newMat().rotationZ(angle));
}
function reflectX(tf) {
    return tf.transform(tf.newMat().scaling([-1, 1, 1, 1])).reverseWinding();
}
function reflectY(tf) {
    return tf.transform(tf.newMat().scaling([1, -1, 1, 1])).reverseWinding();
}
function reflectZ(tf) {
    return tf.transform(tf.newMat().scaling([1, 1, -1, 1])).reverseWinding();
}
//# sourceMappingURL=Transformable.js.map