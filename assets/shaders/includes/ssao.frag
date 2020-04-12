layout(set=SET_SSAO, binding = SET_SSAO_UNIFORM) uniform SSAOUniform {
    float u_ssaoRadius;
    float u_ssaoBias;
    vec2 u_ssaoNoiseScale;
    float u_ssaoStrength;
    float u_ssaoBlurPositionThreshold;
    float u_ssaoBlurNormalThreshold;
};

layout(set=SET_SSAO, binding = SET_SSAO_SAMPLES) uniform SSAOSamples {
    vec4[SSAO_SAMPLES] u_ssaoSamples;
};

layout(set=SET_SSAO, binding = SET_SSAO_NOISE_S) uniform sampler s_noise;
layout(set=SET_SSAO, binding = SET_SSAO_NOISE_T) uniform texture2D t_noise;