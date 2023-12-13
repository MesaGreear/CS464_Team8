/** Pipe queue */
var pipes = [];
/** Matrix Stack */
var stack;

var draws;
var binds;
var vertexCount;

/**
 * Generates an orthographic projection matrix with bounds set appropriately
 * @returns an orthographic projection matrix
 */
function generateOrthographicProjectionMatrix() {
    var bound = 100 * gl.viewportWidth;
    var top = bound / 2 / gl.viewportWidth;
    var right = bound / 2 / gl.viewportHeight;
    var far = bound * 2;
    var bottom = -1 * top;
    var left = -1 * right;
    var near = 0;
    var orthoMatrix = mat4.ortho(
        left,
        right,
        bottom,
        top,
        near,
        far,
        orthoMatrix
    );
    return orthoMatrix;
}

/**
 * Draw the scene. Uses draw() to draw objects to the scene and performs the
 * operations required to draw coherent scenes.
 */
function drawScene() {
    var canvas = document.getElementById("hellowebgl");
    
    //Resize canvas based on page dimensions, then clamp to viewable area
    canvas.width = document.getElementById("main").clientWidth;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var fov = document.getElementById("fov").value;

    // set perspective matrix
    var pMatrix = mat4.create();
    mat4.perspective(fov,gl.viewportWidth / gl.viewportHeight,0.1,2000.0,pMatrix);
    stack = new MStack();
    stack.save();

    var useOrthographicProjection = document.getElementById("useOrthographicProjection").checked;
    if (useOrthographicProjection) {
        pMatrix = generateOrthographicProjectionMatrix();
    }

    var useLookAtMatrix = document.getElementById("useLookAtMatrix").checked;
    if (useLookAtMatrix) {
        var lookAtMatrix = mat4.lookAt([0, 0, 0], [45, -25, -45], [0, 1, 0]);
        stack.setMatrix(lookAtMatrix);
    } else {
        stack.rotateX(25);
        stack.rotateY(45);
    }

    var ambientLight = new AmbientLight();
    var dirLight = new DirectionalLight();
    var spotLight = new SpotLight();
    var pointLight = new PointLight();

    ambientLight.setUniforms(gl,shaderProgram);
    dirLight.setUniforms(gl,shaderProgram);
    spotLight.setUniforms(gl,shaderProgram);
    pointLight.setUniforms(gl,shaderProgram);

    // ========================================================================================================

    // reset stats
    draws = binds = vertexCount = 0;

    // copy the current shapes array, prevents weird stuff from happening mid-
    // -frame if the geometry changes
    var currShapes = shapes.slice();

    // Our update handler, push a new shape/coordinate to each pipe every x number of frames
    if (totalF % Math.floor(5.0 / (speed / 100.0)) == 0)
        pipes.forEach((pipe) => {
            pipe.addSegment();
        });

    // 'trim' the tail of the pipes till the desired length is reached
    pipes.forEach((pipe) => {
        pipe.trimSegments(length);
    });

    // for each pipe, draw each segment in the pipe's queue
    var segment;
    pipes.forEach((pipe) => {
        for (i = 0; i < pipe.queue.length; i++) {
            segment = pipe.queue[i];

            stack.push();

            // if shape is a cylinder...
            if (segment.shape == 2) {
                // 'count' how many cylinders there are in a row so they can all be drawn as a single stretched
                // cylinder, avoiding draw() calls for each segment
                var sectionLength = 1;
                i++;
                for (; i < pipe.queue.length && pipe.queue[i].shape == 2; i++, sectionLength++);
                i--;

                // move the stretched cylinder between the first and last coordinates in this section
                stack.translate(
                    combineVec3(
                        divideVec3(subtractVec3(pipe.queue[i].coord, segment.coord), 2.0),
                        segment.coord
                    )
                );

                // rotate the section based on the direction it is being drawn in
                if (segment.dir == 0) stack.rotateY(90);
                else if (segment.dir == 1) stack.rotateX(90);

                // lastly, 'stretch' the cylinder to be the appropriate length
                stack.scale([1, 1, sectionLength]);
            }
            // else it is a sphere
            else {
                stack.translate(segment.coord);
                stack.scale(1.65);
            }

            draw(currShapes[segment.shape], pipe.tex, pMatrix);
            stack.pop();
        }
    });

    stack.restore(); // restore stack to pre-rotated version

    // draw the spotlight
    if (spotLight.drawEnabled) {
        stack.push();
        stack.translate(spotLight.position);
        stack.push();
        stack.rotateY(-spotLight.yaw);
        stack.rotateX(spotLight.pitch);
        draw(currShapes[4], glTextures[5], pMatrix, false);
        stack.pop();

        stack.push();
        stack.translate(vec3.scale(spotLight.direction, -1));
        stack.rotateY(-spotLight.yaw);
        stack.rotateX(spotLight.pitch);
        stack.scale([0.5, 0.5, 1.5]);
        draw(currShapes[5], glTextures[6], pMatrix, false);
        stack.pop();

        stack.push();
        stack.translate(vec3.scale(spotLight.direction, 2));
        stack.rotateY(-spotLight.yaw);
        stack.rotateX(spotLight.pitch);
        stack.scale(0.6);
        draw(currShapes[3], glTextures[6], pMatrix, false);
        stack.pop();
        stack.pop();
    }
    // draw the point light
    if (pointLight.drawEnabled) {
        stack.push();
        stack.translate(pointLight.position);
        draw(currShapes[3], glTextures[6], pMatrix, false);
        stack.pop();
    }
}

var oldShape;
var oldTexture;

/**
 * Draw the object contained at the given index in the buffers and apply the
 * given texture to it. Uses the top of the matrix stack as it's model matrix.
 *
 * @param {Shape}         shape   A Shape in the shapes array
 * @param {GL_TEXTURE_2D} texture Image texture to apply to this drawn object
 * @param {mat4}          pMatrix The perspective matrix
 * @param {boolean}   useLighting If false, draws object with texture color only
 */
function draw(shape, texture, pMatrix, useLighting = true) {
    draws++;

    var mvMatrix = mat4.identity(mat4.create());
    mat4.multiply(mvMatrix, stack.getMatrix(), mvMatrix);

    vertexCount += shape.vBuffer.numItems;

    setMatrixUniforms(pMatrix, mvMatrix);

    // only 'rebind' buffers if the shape/texture being drawn is different from the previous frame
    if (oldShape != shape || texture != oldTexture) {
        binds++;

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.vBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,shape.vBuffer.itemSize,gl.FLOAT,false,0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.nBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,shape.nBuffer.itemSize,gl.FLOAT,false,0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, shape.tBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute,shape.tBuffer.itemSize,gl.FLOAT,false,0,0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shaderProgram.colorMapSampler, 0);

        gl.uniform1i(shaderProgram.useLightingUniform, useLighting);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.iBuffer);
    }

    oldShape = shape;
    oldTexture = texture;
    gl.drawElements(lineMode ? gl.LINES : gl.TRIANGLES,shape.iBuffer.numItems,gl.UNSIGNED_SHORT,0);
}