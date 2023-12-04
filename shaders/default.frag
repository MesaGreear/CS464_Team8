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

uniform bool uAmbientEnabled;
uniform bool uDirLightEnabled;
uniform bool uSpotLightEnabled;
uniform bool uPointLightEnabled;

uniform sampler2D uColorMap;

    //testing

void main(void) {
    vec4 tx_FragColor = texture2D(uColorMap, vec2(vTextureCoord.s, vTextureCoord.t));
    float ambientPercent = 0.2;
    
    vec4 amb_fragColor;
    if(uAmbientEnabled)
        amb_fragColor = vec4(tx_FragColor.rgb * (ambientPercent * uAmbientColor), tx_FragColor.a);
    else
        amb_fragColor = vec4(0.0, 0.0, 0.0, tx_FragColor.a);

    vec4 dir_fragColor;
    if(uDirLightEnabled)
        dir_fragColor = vec4(tx_FragColor.rgb * ((1.0 - ambientPercent) * vDirLightWeighting), tx_FragColor.a);
    else
        dir_fragColor = vec4(0.0, 0.0, 0.0, tx_FragColor.a);

    vec4 spotlight_FragColor;
    if(uSpotLightEnabled)
        spotlight_FragColor = vec4(tx_FragColor.rgb * vSpotlightWeighting, tx_FragColor.a);
    else
        spotlight_FragColor = vec4(0.0, 0.0, 0.0, tx_FragColor.a);

    vec4 pointlight_FragColor;
    if(uPointLightEnabled)
        pointlight_FragColor = vec4(tx_FragColor.rgb * vPointLightWeighting, tx_FragColor.a);
    else
        pointlight_FragColor = vec4(0.0, 0.0, 0.0, tx_FragColor.a);

    if(uUseLighting) {
        gl_FragColor = amb_fragColor + dir_fragColor + spotlight_FragColor + pointlight_FragColor;
    } else {
        gl_FragColor = tx_FragColor;
    }

}