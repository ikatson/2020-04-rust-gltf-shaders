#define SET_CAMERA 0
#define SET_GBUFFER_TEXTURES 1
#define SET_SSAO 2
#define SET_SSAO_SECOND_PASS 3

#include "../includes/gbuf_textures.frag"
#include "../includes/camera_uniforms.frag"
#include "../includes/quad_fragment_inputs.frag"
#include "../includes/ssao.frag"

layout(set=SET_SSAO_SECOND_PASS, binding = SET_SSAO_SECOND_PASS_FIRST_PASS_S) uniform sampler s_first;
layout(set=SET_SSAO_SECOND_PASS, binding = SET_SSAO_SECOND_PASS_FIRST_PASS_T) uniform texture2D t_first;

layout(location = 0) out vec4 color;

// This does position and normal-aware "smart-blur".
float getSsaoBlurred(vec4 posVS, vec3 normalVS) {
    vec2 texelSize = vec2(1. / float(SSAO_TEXEL_SIZE_X), 1. / float(SSAO_TEXEL_SIZE_Y));

    if (posVS.a == 0.) {
        return 1.;
    }
    int samples = 1;
    float occlusion = texture(sampler2D(t_first, s_first), tx_pos).r;
    // return occlusion;

    for (int i = -SSAO_NOISE_SCALE / 2; i < SSAO_NOISE_SCALE / 2; i++) {
        for (int j = -SSAO_NOISE_SCALE / 2; j < SSAO_NOISE_SCALE / 2; j++) {
            if (i == 0 && j == 0) {
                continue;
            }
            vec2 offset = tx_pos + texelSize * vec2(float(i), -float(j));

            vec4 posVS_offset = GBUFFER_POSITION(offset);
            if (posVS_offset.a == 0.) {
                continue;
            }

            if (abs(posVS.z - posVS_offset.z) > u_ssaoBlurPositionThreshold) {
                continue;
            }

            vec3 normalVS_offset = GBUFFER_NORMAL(offset).xyz;
            if (abs(dot(normalVS_offset, normalVS)) < u_ssaoBlurNormalThreshold) {
                continue;
            }

            occlusion += texture(sampler2D(t_first, s_first), offset).r;
            samples += 1;
        }
    }
    occlusion /= float(samples);

    return pow(occlusion, u_ssaoStrength);
}

void main() {
    vec3 normalVS = GBUFFER_NORMAL(tx_pos).xyz;
    vec4 posVS = GBUFFER_POSITION(tx_pos);

    color = vec4(vec3(getSsaoBlurred(posVS, normalVS)), 1.);
    // color = vec4(texture(sampler2D(t_first, s_first), tx_pos).xyz, 1.);
}