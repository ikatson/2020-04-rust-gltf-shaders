#define SET_CAMERA 0
#define SET_GBUFFER_TEXTURES 1
#define SET_SSAO 2

#include "../includes/gbuf_textures.frag"
#include "../includes/camera_uniforms.frag"
#include "../includes/quad_fragment_inputs.frag"
#include "../includes/ssao.frag"

layout(location = 0) out vec4 color;

// This is actually a float, but vec3 for debugging.
vec3 ssao(vec3 normalVS, vec4 posVS, vec2 tx_pos) {
    vec3 random = normalize(texture(sampler2D(t_noise, s_noise), tx_pos * u_ssaoNoiseScale).xyz);
    vec3 tangent = cross(random, normalVS);
    vec3 bitangent = cross(normalVS, tangent);

    mat3 tangentToViewSpaceMatrix = mat3(tangent, bitangent, normalVS);
    // return vec4(normal, 1.);
    // return vec4(tangentToViewSpaceMatrix * normalVS, 1.);
    float radius = u_ssaoRadius;
    float occlusion = 0.;
    float bias = u_ssaoBias;
    float countedSamples = 1.;

    for (int i = 0; i < SSAO_SAMPLES; i++) {
        vec3 sampleVectorVS = tangentToViewSpaceMatrix * u_ssaoSamples[i].xyz;
        // vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * vec3(0., 0., 1.), 0.);
        // Sample in view space.
        vec3 samplePointVS = posVS.xyz + sampleVectorVS * radius;
        vec4 sampleSS = u_perspectiveMatrix * vec4(samplePointVS, 1.);
        sampleSS /= sampleSS.w;

        vec2 absSampleSS = abs(sampleSS.xy);
        if (absSampleSS.x >= 1. || absSampleSS.y >= 1.) {
            continue;
        }

        countedSamples += 1.;

        vec2 sampleTexCoord = sampleSS.xy * vec2(.5, -.5) + 0.5;
        vec4 storedPosVS = GBUFFER_POSITION(sampleTexCoord);
        float storedDepthVS = storedPosVS.z;
        float diff = storedDepthVS - samplePointVS.z;
        if (diff > bias) {
            // occlusion is at its maximum if the diff is within the radius.
            // when the value is outside the radius, it smoothly stops affecting the result.

            float falloff = max(0., 1. - length(storedPosVS.xyz - posVS.xyz) / radius);

            // float weight = 1. - smoothstep(0.0, 1.0, diff / radius);
            // falloff *= weight;

            // float falloff = smoothstep(0.0, 1.0, radius / diff);
            // float falloff = 1. - smoothstep(0.8, 1.2, length(storedPosVS.xyz - posVS.xyz) / radius);
            occlusion += falloff;
        }
    }
    occlusion = 1. - (occlusion / countedSamples);
    return vec3(occlusion);
}
void main() {
    vec3 normal = GBUFFER_NORMAL(tx_pos).xyz;
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec3 occlusion = ssao(normal, pos, tx_pos);

    color = vec4(occlusion, pos.a);
    /// color = pos.rrrr;
    // color = vec4(normalize(texture(sampler2D(t_noise, s_noise), tx_pos * u_ssaoNoiseScale).xyz).y);
}