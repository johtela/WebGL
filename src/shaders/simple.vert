 attribute vec4 aVertexPosition;
 varying highp vec3 position;
 
 uniform mat4 uModelViewMatrix;
 uniform mat4 uProjectionMatrix;

void main() {
    position = max(aVertexPosition.xyz, vec3(0));
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
 }
