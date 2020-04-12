layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_ALBEDO_S) uniform sampler s_gbuffer_albedo;
layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_ALBEDO_T) uniform texture2D t_gbuffer_albedo;

layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_NORMAL_S) uniform sampler s_gbuffer_normal;
layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_NORMAL_T) uniform texture2D t_gbuffer_normal;

layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_MR_S) uniform sampler s_gbuffer_mr;
layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_MR_T) uniform texture2D t_gbuffer_mr;

layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_POS_S) uniform sampler s_gbuffer_pos;
layout(set=SET_GBUFFER_TEXTURES, binding = SET_GBUFFER_TEXTURES_POS_T) uniform texture2D t_gbuffer_pos;

vec4 read_gbuffer_normal(vec2 pos) {
    return texture(sampler2D(t_gbuffer_normal, s_gbuffer_normal), pos);
//    vec3 val = texture(sampler2D(t_gbuffer_normal, s_gbuffer_normal), pos).xyz;
//    bool zIsNegative = false;
//    if (val.x > 1.5) {
//        val.x -= 3.;
//        zIsNegative = true;
//    }
//    // clamp is for float error correction
//    val.z = sqrt(clamp(1. - val.x * val.x - val.y * val.y, 0., 1.));
//    if (zIsNegative) {
//        val.z = -val.z;
//    }
//    val = normalize(val);
//    return vec4(val, 0.);
}

struct metallicRoughness {
    float metallic;
    float roughness;
};

void gbufferMetallicRoughness(vec2 coord, out float metallic, out float roughness) {
    vec4 tx = texture(sampler2D(t_gbuffer_mr, s_gbuffer_mr), coord);
    metallic = tx.r;
    roughness = tx.g;
    return;
}

#define GBUFFER_POSITION(coord) (texture(sampler2D(t_gbuffer_pos, s_gbuffer_pos), coord))
#define GBUFFER_NORMAL(coord) (read_gbuffer_normal(coord))
#define GBUFFER_ALBEDO(coord) (texture(sampler2D(t_gbuffer_albedo, s_gbuffer_albedo), coord))
#define GBUFFER_MR(coord, metallic, roughness) gbufferMetallicRoughness(coord, metallic, roughness)