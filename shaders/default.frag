// =================================================================================
//                              FRAGMENT SHADER
// =================================================================================

precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vDirLightWeighting;
varying vec3 vSpotlightWeighting;
varying vec3 vPointLightWeighting;

uniform vec3 uAmbientColor;
uniform bool uUseLighting;

uniform sampler2D uColorMap;

    //testing

void main(void) {
    vec4 tx_FragColor = texture2D(uColorMap, vec2(vTextureCoord.s, vTextureCoord.t));
    float ambientPercent = 0.2;
    vec4 dirAmb_fragColor = vec4(tx_FragColor.rgb * ((1.0 - ambientPercent) * vDirLightWeighting + ambientPercent * uAmbientColor), tx_FragColor.a);
    vec4 spotlight_FragColor = vec4(tx_FragColor.rgb * vSpotlightWeighting, tx_FragColor.a);
    vec4 pointlight_FragColor = vec4(tx_FragColor.rgb * vPointLightWeighting, tx_FragColor.a);
    if(uUseLighting) {
        gl_FragColor = dirAmb_fragColor + spotlight_FragColor + pointlight_FragColor;
    } else {
        gl_FragColor = tx_FragColor;
    }

}