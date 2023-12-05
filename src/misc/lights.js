class AmbientLight {
    constructor() {
        this.enabled = document.getElementById("toggleAmbient").checked;
        this.color = hexToRGB(
            document.getElementById("ambientLightColor").value
        );
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform1i(shaderProgram.ambientEnabledUniform, this.enabled);
        gl.uniform3fv(shaderProgram.ambientColorUniform, this.color);
    }
}

class DirectionalLight {
    constructor() {
        this.enabled = document.getElementById("toggleDirectional").checked;
        this.direction = [
            parseFloat(document.getElementById("dirLightDirectionX").value),
            parseFloat(document.getElementById("dirLightDirectionY").value),
            parseFloat(document.getElementById("dirLightDirectionZ").value),
        ];
        this.direction = vec3.normalize(this.direction);
        this.color = hexToRGB(
            document.getElementById("dirLightColor").value
        );
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform1i(shaderProgram.dirEnabledUniform, this.enabled);
        gl.uniform3fv(shaderProgram.dirLightDirectionUniform, this.direction);
        gl.uniform3fv(shaderProgram.dirLightColorUniform, this.color);
    }
}

class SpotLight {
    constructor() {
        this.enabled = document.getElementById("toggleSpot").checked;
        this.color = hexToRGB(
            document.getElementById("spotlightColor").value
        );
        this.position = [
            parseFloat(document.getElementById("spotlightPositionX").value),
            parseFloat(document.getElementById("spotlightPositionY").value),
            parseFloat(document.getElementById("spotlightPositionZ").value),
        ];
        this.pitch = parseFloat(document.getElementById("spotlightDirectionPitch").value);
        this.yaw = parseFloat(document.getElementById("spotlightDirectionYaw").value);
        this.limit = Math.cos(
            (parseFloat(document.getElementById("spotlightAngle").value) * Math.PI) / 180
        );
        var rotationMatrix = mat4.identity(mat4.create());
        rotationMatrix = mat4.rotate(rotationMatrix, (-this.yaw / 180.0) * Math.PI, [0,1,0]);
        rotationMatrix = mat4.rotate(rotationMatrix, (this.pitch / 180.0) * Math.PI, [1,0,0]);
        this.direction = mat4.multiplyVec3(rotationMatrix, [0.0, 0.0, 1.0]);
        this.direction = vec3.normalize(this.direction);
        this.drawEnabled = document.getElementById("drawSpotlightObject").checked;
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform1i(shaderProgram.spotlightEnabledUniform, this.enabled);
        gl.uniform3fv(shaderProgram.spotlightColorUniform, this.color);
        gl.uniform3fv(shaderProgram.spotlightPositionUniform, this.position);
        gl.uniform3fv(shaderProgram.spotlightDirectionUniform, this.direction);
        gl.uniform1f(shaderProgram.spotlightLimitUniform, this.limit);
    }
}

var pointPipe;

class PointLight {
    constructor() {
        this.enabled = document.getElementById("togglePoint").checked;
        this.color = hexToRGB(
            document.getElementById("pointLightColor").value
        );

        // if a pointPipe has not been created yet, create one (This is the 'AI' for pointlight's auto-move)
        if(!pointPipe)
            pointPipe = new Pipe(null, [[-50, 50], [-50, 50], [-100, -5]], [10, 40]);

        // if auto-move is checked, then every 3rd frame update it's position
        if(document.getElementById("autoPointLightObject").checked && totalF % 3 == 0) {
            pointPipe.getLastSegment().coord = [
                parseFloat(document.getElementById("pointLightPositionX").value),
                parseFloat(document.getElementById("pointLightPositionY").value),
                parseFloat(document.getElementById("pointLightPositionZ").value),
            ];
            pointPipe.addSegment();
            pointPipe.trimSegments(1);
            var coord = pointPipe.getLastSegment().coord;
            document.getElementById("pointLightPositionX").value = coord[0];
            document.getElementById("pointLightPositionY").value = coord[1];
            document.getElementById("pointLightPositionZ").value = coord[2];

            document.getElementById("pointLightPositionXOutput").innerHTML = "x: " + coord[0];
            document.getElementById("pointLightPositionYOutput").innerHTML = "y: " + coord[1];
            document.getElementById("pointLightPositionZOutput").innerHTML = "z: " + coord[2];
        }

        this.position = [
            parseFloat(document.getElementById("pointLightPositionX").value),
            parseFloat(document.getElementById("pointLightPositionY").value),
            parseFloat(document.getElementById("pointLightPositionZ").value),
        ];
        this.distance = document.getElementById("pointLightDistance").value;
        this.drawEnabled = document.getElementById("drawPointLightObject").checked;
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform1i(shaderProgram.pointlightEnabledUniform, this.enabled);
        gl.uniform3fv(shaderProgram.pointLightColorUniform, this.color);
        gl.uniform3fv(shaderProgram.pointLightPositionUniform, this.position);
        gl.uniform1f(shaderProgram.pointLightDistanceUniform, this.distance);
    }
}