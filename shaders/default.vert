// =================================================================================
//                              VERTEX SHADER
// =================================================================================

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vDirLightWeighting;
varying vec3 vSpotlightWeighting;
varying vec3 vPointLightWeighting;

// lighting components
uniform mat3 uNMatrix;
uniform vec3 uDirLightDirection;
uniform vec3 uDirLightColor;
uniform vec3 uSpotlightColor;
uniform vec3 uSpotlightPosition;
uniform vec3 uSpotlightDirection;
uniform float uSpotlightLimit;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightPosition;
uniform float uPointLightDistance;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

        // Directional Light Calculation
    vec3 transformedNormal = uNMatrix * aVertexNormal;
    float directionalLightWeighting = max(dot(transformedNormal, uDirLightDirection), 0.0);
    vDirLightWeighting = uDirLightColor * directionalLightWeighting;

        // Point Light Calculation
    vec3 distToPointLight = uPointLightPosition - vec3(uMVMatrix * vec4(aVertexPosition, 1.0));
    vPointLightWeighting = uPointLightColor * smoothstep(-1.0 * uPointLightDistance, 0.0, -1.0 * length(distToPointLight));
    float pointLightWeighting = max(dot(transformedNormal, normalize(distToPointLight)), 0.0);
    vPointLightWeighting *= pointLightWeighting;

        // Spotlight Calculation
    vec3 distToSpotlight = uSpotlightPosition - vec3(uMVMatrix * vec4(aVertexPosition, 1.0));
    vSpotlightWeighting = uSpotlightColor * smoothstep(-100.0, -50.0, -1.0 * length(distToSpotlight));
    float spotlightWeighting = 0.0;
    if(max(dot(uSpotlightDirection, normalize(distToSpotlight)), 0.0) >= uSpotlightLimit) {
        spotlightWeighting = max(dot(transformedNormal, uSpotlightDirection), 0.0);
    }
    vSpotlightWeighting = uSpotlightColor * spotlightWeighting;

}