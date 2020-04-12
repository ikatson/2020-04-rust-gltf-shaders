#define SET_CAMERA 0
#define SET_GBUFFER_TEXTURES 1
#define SET_FINAL 2

#define SSAO_ENABLED 1

// #define SHOW_SSAO 1
// #define SHOW_NORMALS 1

#define AMBIENT_CONSTANT_HACK 1.

#include "includes/gbuf_textures.frag"
#include "includes/camera_uniforms.frag"
#include "includes/quad_fragment_inputs.frag"

layout(set=SET_FINAL, binding = SET_FINAL_SSAO_FIRST_PASS_S) uniform sampler s_ssao_first;
layout(set=SET_FINAL, binding = SET_FINAL_SSAO_FIRST_PASS_T) uniform texture2D t_ssao_first;
layout(set=SET_FINAL, binding = SET_FINAL_SSAO_S) uniform sampler s_ssao;
layout(set=SET_FINAL, binding = SET_FINAL_SSAO_T) uniform texture2D t_ssao;

layout(location = 0) out vec4 color;

void main() {
    #ifdef SHOW_SSAO
    color = vec4(texture(sampler2D(t_ssao, s_ssao), tx_pos).xyz, 1.);
    // color = vec4(texture(sampler2D(t_ssao_first, s_ssao_first), tx_pos).xyz, 1.);
    return;
    #endif

    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 albedo = GBUFFER_ALBEDO(tx_pos);

    #ifdef SHOW_NORMALS
    color = vec4(normal.xyz * .5 + .5, pos.a);
    // color = normal;
    return;
    #endif

    float metallic;
    float roughness;
    GBUFFER_MR(tx_pos, metallic, roughness);

    // final color.
    vec3 c = vec3(0.);

    #ifdef SSAO_ENABLED
    float ssao = texture(sampler2D(t_ssao, s_ssao), tx_pos).r;
    #else
    float ssao = 1.0;
    #endif

    //ambient
    vec3 ambient = vec3(AMBIENT_CONSTANT_HACK) * albedo.rgb * ssao;
    c += ambient;

    color = vec4(ambient, 1.);

}