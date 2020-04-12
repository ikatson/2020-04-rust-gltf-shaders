#define SET_CAMERA 0
#define SET_ENTITY 1
#define SET_MATERIAL 2

// #include "includes/camera_uniforms.frag"

layout (location=0) in vec4 v_pos;
layout (location=1) in vec3 v_normView;
layout (location=2) in vec2 v_uv;
layout (location=3) in vec3 v_tangentView;
layout (location=4) in float v_tangentW;

layout(set=SET_MATERIAL, binding = SET_MATERIAL_ALBEDO_S) uniform sampler s_albedo;
layout(set=SET_MATERIAL, binding = SET_MATERIAL_ALBEDO_T) uniform texture2D t_albedo;

layout(set=SET_MATERIAL, binding = SET_MATERIAL_NORMAL_S) uniform sampler s_normal;
layout(set=SET_MATERIAL, binding = SET_MATERIAL_NORMAL_T) uniform texture2D t_normal;

layout(set=SET_MATERIAL, binding = SET_MATERIAL_MR_S) uniform sampler s_mr;
layout(set=SET_MATERIAL, binding = SET_MATERIAL_MR_T) uniform texture2D t_mr;

layout(set=SET_MATERIAL, binding = SET_MATERIAL_MATERIAL) uniform MaterialUniforms {
    vec4 base_color_factor;
    float metallic_factor;
    float roughness_factor;
    uint flags;
};


layout (location=0) out vec4 o_Albedo;
layout (location=1) out vec4 o_Normal;
layout (location=2) out vec4 o_Mr;
layout (location=3) out vec4 o_Position;

void main() {
    bool albedo_exists = (flags & F_ALBEDO_EXISTS) > 0;
    bool albedo_loaded = (flags & F_ALBEDO_LOADED) > 0;
    bool normals_loaded = (flags & F_NORMALS_LOADED) > 0;
    bool normals_exists = (flags & F_NORMALS_EXISTS) > 0;
    bool mr_loaded = (flags & F_MR_LOADED) > 0;
    bool mr_exists = (flags & F_MR_EXISTS) > 0;

    float lodBias = -0.2;

    // Albedo and alpha.
    if (albedo_exists && albedo_loaded) {
        o_Albedo = texture(sampler2D(t_albedo, s_albedo), v_uv, lodBias) * base_color_factor;
    } else {
        o_Albedo = base_color_factor;
    }
    if (o_Albedo.a < 0.001) {
        discard;
    }

    // Normals + normals encoding.
    vec3 normal;
    if (normals_exists && normals_loaded) {
        vec3 normalMapRaw = texture(sampler2D(t_normal, s_normal), v_uv, lodBias).xyz;
        vec3 normalMap = normalMapRaw * 2. - 1.;
        // Z is negative: -1 means looking into the screen. That is still in tangent space.

        vec3 tangentView = normalize(v_tangentView);
        vec3 bitangentView = normalize(cross(v_normView.xyz, tangentView) * v_tangentW);
        mat3 tangentSpaceToViewSpace = mat3(
            tangentView,
            bitangentView,
            v_normView
        );
        normal = tangentSpaceToViewSpace * normalMap;
        // normal = vec3(1, 0, 0) * tangentSpaceToViewSpace;
        // normal = tangent;
        // normal = normalMap;
        // normal = tangent;
        // normal = normal.xxx;
        // normal = v_norm.xyz;
    } else {
        normal = v_normView;
    }
//    // encode Z normal sign in R. This is pretty stupid encoding but does the job.
//    if (normal.z < 0.) {
//        normal.x += 3.;
//    }
    o_Normal = vec4(normal, 0.);

    // Metallic + Roughness
    if (mr_exists && mr_loaded) {
        vec2 mr = texture(sampler2D(t_mr, s_mr), v_uv, lodBias).rg;
        o_Mr.rg = mr;
    } else {
        o_Mr.rg = vec2(metallic_factor, roughness_factor);
    }

    // Position
    o_Position = vec4(v_pos.xyz, 1.0);

    // o_Normal = texture(sampler2D(t_normal, s_normal), v_uv).xy;
    // o_Target = texture(sampler2D(t_normal, s_normal), v_uv);
    // o_Target = texture(sampler2D(t_mr, s_mr), v_uv);
}