#version 450
precision highp float;

#include "includes/quad_fragment_inputs.frag"

layout(set=0, binding = 0) uniform sampler s_tx;
layout(set=0, binding = 1) uniform texture2D t_tx;

layout(location=0) out vec4 color;

void main() {
    // TODO: what's the difference between Lod and not lod?
    color = textureLod(sampler2D(t_tx, s_tx), tx_pos, 0.);
}