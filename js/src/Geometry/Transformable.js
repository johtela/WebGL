"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function translate(tf, offsets) {
    return tf.transform(tf.newMat().translation(offsets));
}
exports.translate = translate;
function scale(tf, factors) {
    return tf.transform(tf.newMat().scaling(factors));
}
exports.scale = scale;
function rotateX(tf, angle) {
    return tf.transform(tf.newMat().rotationX(angle));
}
exports.rotateX = rotateX;
function rotateY(tf, angle) {
    return tf.transform(tf.newMat().rotationY(angle));
}
exports.rotateY = rotateY;
function rotateZ(tf, angle) {
    return tf.transform(tf.newMat().rotationZ(angle));
}
exports.rotateZ = rotateZ;
function reflectX(tf) {
    return tf.transform(tf.newMat().scaling([-1, 1, 1, 1])).reverseWinding();
}
exports.reflectX = reflectX;
function reflectY(tf) {
    return tf.transform(tf.newMat().scaling([1, -1, 1, 1])).reverseWinding();
}
exports.reflectY = reflectY;
function reflectZ(tf) {
    return tf.transform(tf.newMat().scaling([1, 1, -1, 1])).reverseWinding();
}
exports.reflectZ = reflectZ;
//# sourceMappingURL=Transformable.js.map