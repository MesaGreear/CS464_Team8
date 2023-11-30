class AmbientLight {
    constructor() {
        this.color = hexToRGB(
            document.getElementById("ambientLightColor").value
        );
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform3fv(shaderProgram.ambientColorUniform, this.color);
    }
}

class DirectionalLight {
    constructor() {
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
        gl.uniform3fv(shaderProgram.dirLightDirectionUniform, this.direction);
        gl.uniform3fv(shaderProgram.dirLightColorUniform, this.color);
    }
}

class SpotLight {
    constructor() {
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
        gl.uniform3fv(shaderProgram.spotlightColorUniform, this.color);
        gl.uniform3fv(shaderProgram.spotlightPositionUniform, this.position);
        gl.uniform3fv(shaderProgram.spotlightDirectionUniform, this.direction);
        gl.uniform1f(shaderProgram.spotlightLimitUniform, this.limit);
    }
}

class PointLight {
    constructor() {
        this.color = hexToRGB(
            document.getElementById("pointLightColor").value
        );
        this.position = [
            parseFloat(document.getElementById("pointLightPositionX").value),
            parseFloat(document.getElementById("pointLightPositionY").value),
            parseFloat(document.getElementById("pointLightPositionZ").value),
        ];
        this.distance = document.getElementById("pointLightDistance").value;
        this.drawEnabled = document.getElementById("drawPointLightObject").checked;
    }

    setUniforms(gl, shaderProgram) {
        gl.uniform3fv(shaderProgram.pointLightColorUniform, this.color);
        gl.uniform3fv(shaderProgram.pointLightPositionUniform, this.position);
        gl.uniform1f(shaderProgram.pointLightDistanceUniform, this.distance);
    }
}