#define SET_CAMERA 0
#define SET_ENTITY 1

#include "includes/camera_uniforms.frag"

layout(location = A_PRIMITIVE_POSITION) in vec3 a_pos;
layout(location = A_PRIMITIVE_NORMAL) in vec3 a_norm;
layout(location = A_PRIMITIVE_UV) in vec2 a_uv;
layout(location = A_PRIMITIVE_TANGENT) in vec4 a_tangent;

layout(set=SET_ENTITY, binding = SET_ENTITY_ENTITY) uniform Entity {
    mat4 u_modelWorldMatrix;
};

layout (location=0) out vec4 v_pos;
layout (location=1) out vec3 v_normView;
layout (location=2) out vec2 v_uv;
layout (location=3) out vec3 v_tangentView;
layout (location=4) out flat float v_tangentW;

void main() {
    mat4 modelViewMatrix = u_worldToCameraMatrix * u_modelWorldMatrix;
    mat3 normalizedModelViewMatrix = transpose(inverse(mat3(modelViewMatrix)));
    v_pos = modelViewMatrix * vec4(a_pos, 1.);
    gl_Position = u_perspectiveMatrix * modelViewMatrix * vec4(a_pos, 1.);
    v_normView = normalize(normalizedModelViewMatrix * a_norm);
    v_uv = a_uv;
    v_tangentView = normalize(normalizedModelViewMatrix * a_tangent.xyz);
    v_tangentW = a_tangent.w;
    gl_PointSize = 2.;
}