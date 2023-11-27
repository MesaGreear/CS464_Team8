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

    //lighting code
    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value/100),
        parseFloat(document.getElementById("ambientG").value/100),
        parseFloat(document.getElementById("ambientB").value/100)
    );

    // ========================================================================================================

    // reset stats
    draws = binds = vertices = 0;

    // Our update handler, push a new shape/coordinate to each pipe every x number of frames
    if(totalF % Math.floor(5.0 / (speed/100.0)) == 0)
        pipes.forEach( (pipe) => { pipe.addSegment(); });

    // 'trim' the tail of the pipes till the desired length is reached
    pipes.forEach ( (pipe) => { pipe.trimSegments(length); });

    stack = new MStack(); // Matrix Stack

    // rotate the scene to give us our angled view
    stack.rotateX(25);
    stack.rotateY(45);

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
 */
function draw(index, texture, pMatrix) {
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

        gl.uniform1i(shaderProgram.samplerUniform, 0);
        gl.uniform1i(shaderProgram.useLightingUniform, true);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shape.iBuffer);
    }

    oldIndex = index;
    oldTexture = texture;
    gl.drawElements(lineMode ? gl.LINES : gl.TRIANGLES, shape.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}