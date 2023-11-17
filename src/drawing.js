/** Information about each object being drawn are kept in this queue. At any index [i], [i][0]
 * are the coordinates the object will be drawn at, [i][1] is the shape of the object as defined
 * in the Buffers arrays, and [i][2] is the direction the object is being drawn on (0 = X-axis,
 * 1 = Y-axis, 2 = Z-axis).
 * 
 * The head is always queue[queue.length-1] and the tail is always queue[0]. New objects are added
 * to the head and old objects are expelled from the tail. */

/**
 * The pipes array is an overly complicated massive data-structure that holds all the information
 * about every pipe in the scene.
 * 
 * Each index of pipes holds 4 values:
 * pipes[i][0] - A queue containing information about each object needed to draw the pipe
 * pipes[i][1] - The remaining length of the current segment of the pipe being drawn
 * pipes[i][2] - The direction/axis the current segment of the pipe is being drawn in (0 = X-axis,
 *               1 = Y-axis, 2 = Z-axis)
 * pipes[i][3] - The texture of this pipe
 * 
 * Each index of the queue contained at pipes[i][0] also has multiple values:
 * pipes[i][0][j][0] - Coordinate (3-element array) of the object in 3D space
 * pipes[i][0][j][0] - 
 * pipes[i][0][j][0] - 
 */
var pipes = [];

var stack; /** Matrix Stack */

/**
 * Initialize a new pipe to be drawn. The new pipe's information is appended to the end of
 * the pipes array.
 * 
 * @param {GL_TEXTURE_2D} tex The texture of this pipe
 */
// function initPipe(tex) {
//     pipes.push([ [[[randInt(10, 80), randInt(-40, -10), randInt(-80, -10)], 1, 0]], genLength(), genDirection(), tex ]);
// }

/**
 * Generate a valid length value.
 * 
 * @returns A valid length value
 */
// function genLength() { return randInt(5, 20); }

/**
 * Generate a valid direction value.
 * 
 * @returns A valid direction value
 */
// function genDirection() { return randInt(0, 6); }

/**
 * Destroy/remove the last initialized pipe.
 */
// function destroyPipe() { pipes.pop(); }

/**
 * Generate the next segment for the pipe at the given index in pipes. If a segment has been
 * fully drawn (i.e. pipes[index][1] == 0) then a new valid direction (pipes[index][2]) &
 * length are calculated.
 * 
 * @param {int} index Which pipe in pipes to add a segment to.
 */
// function addSegment(index) {
//     var pipe = pipes[index];
//     var queue = pipe[0];
//     var direction = pipe[2];

    
// }

/**
 * Given a 3D position, calculate the next position based on the current direction
 * a segment is being drawn in. Decrements segmentLength when called.
 * 
 * @param pos vec3 representing coordinates in a 3D space
 * 
 * @returns pos with either an altered x, y, or z value
 */
// function nextPos(pipe) {
//     var newPos = [pipe[0][pipe[0].length-1][0][0], pipe[0][pipe[0].length-1][0][1], pipe[0][pipe[0].length-1][0][2]];
//     newPos[Math.floor(pipe[2]/2)] += (pipe[2] % 2 == 0 ? -1 : 1);
//     pipe[1]--;
//     return newPos;
// }

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

    // Our update handler, push a new shape/coordinate to each pipe every x number of frames
    if(totalF % Math.floor(30 / (speed/100.0)) == 0)
        pipes.forEach( (pipe) => { pipe.addSegment(); });

    // 'trim' the tail of the pipes till the desired length is reached
    pipes.forEach ( (pipe) => { pipe.trimSegments(length); });

    stack = new MStack(); // Matrix Stack

    // rotate the scene to give us our angled view
    stack.rotateX(25);
    stack.rotateY(45);

    // for each pipe, draw each object in the pipe's queue
    pipes.forEach( (pipe) => {
       pipe.queue.forEach( (segment) => {
            stack.push();
            stack.translate(segment.coord);
    
            // rotate the obj based on the direction it is being drawn in
            if(segment.dir == 0)
                stack.rotateY(90);
            else if(segment.dir == 1)
                stack.rotateX(90);
    
            // if the obj is a sphere, draw it slightly bigger
            if(segment.shape == 1)
                stack.scale(1.65);
    
            draw(segment.shape, pipe.tex, pMatrix);
            stack.pop();
        });
    });
}

var oldIndex;
var oldTexture;

/**
 * Draw the object contained at the given index in the buffers and apply the
 * given texture to it. Uses the top of the matrix stack as it's model matrix.
 * 
 * @param {int}           index   index in the 'buffers' arrays to draw this
 *                                object as.
 * @param {GL_TEXTURE_2D} texture image texture to apply to this drawn object
 * @param {int}           pMatrix The perspective matrix
 */
function draw(index, texture, pMatrix) {
    var mvMatrix = mat4.identity(mat4.create());
    mat4.multiply(mvMatrix, stack.getMatrix(), mvMatrix);

    setMatrixUniforms(pMatrix, mvMatrix);

    // only 'rebind' buffers if the shape/texture being drawn is different from the previous frame
    if (oldIndex != index || texture != oldTexture) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffers[index]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vBuffers[index].itemSize, gl.FLOAT, false, 0, 0);

        // numVertices += vBuffers[index].numItems;

        // gl.bindBuffer(gl.ARRAY_BUFFER, terNormalBuffer);
        // gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, terNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffers[index]);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, tBuffers[index].itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // gl.uniform1i(shaderProgram.samplerUniform, 0);
        // gl.uniform1i(shaderProgram.useLightingUniform, true)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffers[index]);
    }

    oldIndex = index;
    oldTexture = texture;
    gl.drawElements(gl.TRIANGLES, iBuffers[index].numItems, gl.UNSIGNED_SHORT, 0);
}