 attribute vec2 aVertexPosition;
 varying highp vec3 position;
 
 uniform mat4 uModelViewMatrix;
 uniform mat4 uProjectionMatrix;

void main() {
    vec4 pos = vec4 (aVertexPosition, 0, 1);
    position = max(pos.xyz, vec3(0));
    gl_Position = uProjectionMatrix * uModelViewMatrix * pos;
 }
