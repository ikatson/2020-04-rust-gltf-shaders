#include "includes/quad_fragment_inputs.frag"

layout(set=0, binding = 0) uniform sampler s_tx;
layout(set=0, binding = 1) uniform texture2D t_tx;

layout(location=0) out vec4 color;

void main() {
    // DEBUGGING
    // color = vec4(texture(sampler2D(t_tx, s_tx), tx_pos).rrr, 1.);

    color = vec4(texture(sampler2D(t_tx, s_tx), tx_pos).xyz, 1.);
    // color = vec4(0.5, 0.5, 0.5, 1.);
}