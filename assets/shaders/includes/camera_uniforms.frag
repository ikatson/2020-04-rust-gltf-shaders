layout(set=SET_CAMERA, binding = SET_CAMERA_CAMERA) uniform Camera {
    mat4 u_worldToCameraMatrix;
    mat4 u_cameraToWorldMatrix;
    mat4 u_perspectiveMatrix;
};