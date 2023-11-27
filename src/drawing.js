/** Pipe queue */
var pipes = [];
/** Matrix Stack */
var stack;

var draws;
var binds;
var vertices;

/**
 * Draw the scene. Uses draw() to draw objects to the scene and performs the
 * operations required to draw coherent scenes.
 */
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set perspective matrix
    var pMatrix = mat4.create();
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0, pMatrix);
    stack = new MStack();
    stack.save();
    stack.rotateX(25);
    stack.rotateY(45);

    //Get ambient light color from user input
    var ambientLightColor = hexToRGB(document.getElementById("ambientLightColor").value);

    //Get directional light direction from user input and normalize the resulting vector
    var dirLightDirection = [
        parseFloat(document.getElementById("dirLightDirectionX").value),
        parseFloat(document.getElementById("dirLightDirectionY").value),
        parseFloat(document.getElementById("dirLightDirectionZ").value)
    ];    
    dirLightDirection = vec3.normalize(dirLightDirection);        
    var dirLightColor = hexToRGB(document.getElementById("dirLightColor").value);
    
    var spotlightColor = hexToRGB(document.getElementById("spotlightColor").value);
    var spotlightPosition = [
        parseFloat(document.getElementById("spotlightPositionX").value),
        parseFloat(document.getElementById("spotlightPositionY").value),
        parseFloat(document.getElementById("spotlightPositionZ").value)
    ];
    var spotlightPitchYaw = [
        parseFloat(document.getElementById("spotlightDirectionPitch").value),
        parseFloat(document.getElementById("spotlightDirectionYaw").value)
    ];
    var spotlightLimit = Math.cos(parseFloat(document.getElementById("spotlightAngle").value)*Math.PI/180);    

    var pointLightColor = hexToRGB(document.getElementById("pointLightColor").value);
    var pointLightPosition = [
        parseFloat(document.getElementById("pointLightPositionX").value),
        parseFloat(document.getElementById("pointLightPositionY").value),
        parseFloat(document.getElementById("pointLightPositionZ").value)
    ];
    var pointLightDistance = document.getElementById("pointLightDistance").value;
    
    // Rotate spotlight direction vector based on pitch & yaw angles
    stack.push();
    stack.restore();
    stack.rotateY(-spotlightPitchYaw[1]);
    stack.rotateX(spotlightPitchYaw[0]);
    var spotlightDirection = mat4.multiplyVec3(stack.getMatrix(), [0.0, 0.0, 1.0]);
    spotlightDirection = vec3.normalize(spotlightDirection);      
    stack.pop();
    
    gl.uniform3fv(shaderProgram.dirLightDirectionUniform, dirLightDirection);
    gl.uniform3fv(shaderProgram.dirLightColorUniform, dirLightColor);
    gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLightColor);
    gl.uniform3fv(shaderProgram.spotlightColorUniform, spotlightColor);
    gl.uniform3fv(shaderProgram.spotlightPositionUniform, spotlightPosition);
    gl.uniform3fv(shaderProgram.spotlightDirectionUniform, spotlightDirection);
    gl.uniform3fv(shaderProgram.pointLightColorUniform, pointLightColor);
    gl.uniform3fv(shaderProgram.pointLightPositionUniform, pointLightPosition);
    gl.uniform1f(shaderProgram.pointLightDistanceUniform, pointLightDistance);
    gl.uniform1f(shaderProgram.spotlightLimitUniform, spotlightLimit);

    // ========================================================================================================

    // reset stats
    draws = binds = vertices = 0;

    // Our update handler, push a new shape/coordinate to each pipe every x number of frames
    if(totalF % Math.floor(5.0 / (speed/100.0)) == 0)
        pipes.forEach( (pipe) => { pipe.addSegment(); });

    // 'trim' the tail of the pipes till the desired length is reached
    pipes.forEach ( (pipe) => { pipe.trimSegments(length); });

    // rotate the scene to give us our angled view
    //stack.rotateX(25);
    //stack.rotateY(45);

    // for each pipe, draw each segment in the pipe's queue
    var segment;
    pipes.forEach( (pipe) => {
        for(i = 0; i < pipe.queue.length; i++) {

            segment = pipe.queue[i];

            stack.push();

            // if shape is a cylinder...
            if(segment.shape == 2) {

                // 'count' how many cylinders there are in a row so they can all be drawn as a single stretched
                // cylinder, avoiding draw() calls for each segment
                var sectionLength = 1;
                i++;
                for(;i < pipe.queue.length && pipe.queue[i].shape == 2; i++, sectionLength++);
                i--;
                
                // move the stretched cylinder between the first and last coordinates in this section
                stack.translate(
                    combineVec3( divideVec3( subtractVec3(pipe.queue[i].coord, segment.coord), 2.0), segment.coord)
                );

                // rotate the section based on the direction it is being drawn in
                if(segment.dir == 0)
                    stack.rotateY(90);
                else if(segment.dir == 1)
                    stack.rotateX(90);
                
                // lastly, 'stretch' the cylinder to be the appropriate length
                stack.scale([1, 1, sectionLength]);

            }
            // else it is a sphere
            else {
                stack.translate(segment.coord);
                stack.scale(1.65);
            }

            draw(segment.shape, pipe.tex, pMatrix);
            stack.pop();
        }
    });

    if (drawSpotlightObject) {
        stack.push();    
        stack.restore();        
        stack.translate(spotlightPosition);
        stack.push();
        stack.rotateY(-spotlightPitchYaw[1]);
        stack.rotateX(spotlightPitchYaw[0]);    
        draw(1,glTextures[5],pMatrix,false);
        stack.pop();
        stack.translate(vec3.scale(spotlightDirection,-1));    
        stack.rotateY(-spotlightPitchYaw[1]);
        stack.rotateX(spotlightPitchYaw[0]);;    
        stack.scale([0.5,0.5,1.5]);
        draw(2,glTextures[5],pMatrix,false);
        stack.pop();
    }
    if (drawPointLightObject) {
        stack.push();    
        stack.restore();        
        stack.translate(pointLightPosition);
        draw(1,glTextures[5],pMatrix,false);
        stack.pop();
    }
}

var oldIndex;
var oldTexture;

/**
 * Draw the object contained at the given index in the buffers and apply the
 * given texture to it. Uses the top of the matrix stack as it's model matrix.
 * 
 * @param {int}           index   An index corelating to a shape in the shapes array
 * @param {GL_TEXTURE_2D} texture Image texture to apply to this drawn object
 * @param {int}           pMatrix The perspective matrix
 * @param {boolean}   useLighting If true, draws object with texture color only
 */
function draw(index, texture, pMatrix, useLighting=true) {
    draws++;

    var mvMatrix = mat4.identity(mat4.create());
    mat4.multiply(mvMatrix, stack.getMatrix(), mvMatrix);

    var shape = shapes[index];

    vertices += shape.vBuffer.numItems;

    setMatrixUniforms(pMatrix, mvMatrix);

    // only 'rebind' buffers if the shape/texture being drawn is different from the previous frame
    if (oldIndex != index || texture != oldTexture) {
        binds++;

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.vBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, shape.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.nBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, shape.nBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.tBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, shape.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.colorMapSampler, 0);

        gl.uniform1i(shaderProgram.useLightingUniform, useLighting);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.iBuffer);
    }

    oldIndex = index;
    oldTexture = texture;
    gl.drawElements(lineMode ? gl.LINES : gl.TRIANGLES, shape.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}