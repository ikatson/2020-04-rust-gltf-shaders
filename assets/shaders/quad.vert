#version 450
precision highp float;

layout (location=0) in vec2 a_pos;
layout (location=0) out vec2 tx_pos;

void main() {
    gl_Position = vec4(a_pos, 0., 1.);

    vec2 v_pos = vec2(a_pos.x, -a_pos.y);

    // tx_pos origin is top-left corner.
    tx_pos = v_pos.xy * 0.5 + 0.5;
}