/** Information about each object being drawn are kept in this queue. At any index [i], [i][0]
 * are the coordinates the object will be drawn at, [i][1] is the shape of the object as defined
 * in the Buffers arrays, and [i][2] is the direction the object is being drawn on (0 = X-axis,
 * 1 = Y-axis, 2 = Z-axis).
 * 
 * The head is always queue[queue.length-1] and the tail is always queue[0]. New objects are added
 * to the head and old objects are expelled from the tail. */
var queue = [[[30, -30, -30], 1, 0]]; //starting coordinates & sphere

var s = [[[30, -40, -30], 1, 0]];

var l = [Math.floor(Math.random() * 20) + 5, Math.floor(Math.random() * 20) + 5];
var d = [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)];

// var segmentLength = Math.floor(Math.random() * 20) + 5;
// var dir = Math.floor(Math.random() * 6);

var stack;

/**
 * Generate the next segment and push it to the q. If a segment has been fully drawn (i.e. 
 * segmentLength == 0) then a new valid direction & segmentLength are calculated.
 */
function addSegment(q, index) {

    // if a segment has been fully drawn...
    if(l[index] == 0) {
        // calculate a new segmentLength
        l[index] = Math.floor(Math.random() * 20) + 5;

        // push a sphere to the queue to be drawn
        q.push([nextPos(q[q.length-1][0], index), 1, 0]);

        // generate the 4 valid directions based on the last direction we were drawing in
        var directions = [];
        if(d[index] == 0 || d[index] == 1)      // X-axis
            directions.push(2, 3, 4, 5);
        else if(d[index] == 2 || d[index] == 3) // Y-axis
            directions.push(0, 1, 4, 5);
        else                          // Z-axis
            directions.push(0, 1, 2, 3);

        // randomly select a valid direction and check that when the entire segment is drawn, the
        // resulting segment will be inbounds. If it isn't, try again till a valid direction is found
        var inBounds = false;
        var currPos = q[q.length - 1][0];

        while(!inBounds) {
            d[index] = directions[Math.floor(Math.random() * 4)];
            switch(d[index]) {
                case 0:
                    inBounds = currPos[0] - l[index] > 0;   break;
                case 1:
                    inBounds = currPos[0] + l[index] < 90;  break;
                case 2:
                    inBounds = currPos[1] - l[index] > -50; break;
                case 3:
                    inBounds = currPos[1] + l[index] < 0;   break;
                case 4:
                    inBounds = currPos[2] - l[index] > -90; break;
                case 5:
                    inBounds = currPos[2] + l[index] < 0;
            }
        }
    }
    // else just push a cylinder to the queue.
    else {
        q.push([nextPos(q[q.length-1][0], index), 2, Math.floor(d[index]/2)]);
    }
}

/**
 * Given a 3D position, calculate the next position based on the current direction
 * a segment is being drawn in. Decrements segmentLength when called.
 * 
 * @param pos vec3 representing coordinates in a 3D space
 * 
 * @returns pos with either an altered x, y, or z value
 */
function nextPos(pos, index) {
    var newPos = [pos[0], pos[1], pos[2]];
    newPos[Math.floor(d[index]/2)] += (d[index] % 2 == 0 ? -1 : 1);
    l[index]--;
    return newPos;
}

/**
 * Takes two vec3 (3 element arrays), combines their values, and returns
 * the result.
 * 
 * @param {vec3} a The first vec3
 * @param {vec3} b The second vec3
 * 
 * @returns The resulting vec3 from a + b
 */
function combineVec3(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }

/**
 * Draw the scene. Uses draw() to draw objects to the scene and performs the
 * operations required to draw coherent scenes.
 */
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Our update handler, push a new shape/coordinate to the queue every x number of frames
    if(totalF % Math.floor(30 / (speed/100.0)) == 0) {   
        addSegment(queue, 0);
        addSegment(s, 1);
    }

    // 'trim' the tail of the queue till the desired length is reached
    while(queue.length > length)
        queue.shift();

    while(s.length > length)
        s.shift();

    stack = new mStack(); // Matrix Stack

    // rotate the scene to give us our angled view
    stack.rotateX(25);
    stack.rotateY(45);

    // for each object/coord in q, draw it
    queue.forEach( (obj) => {
        stack.push();
        stack.translate(obj[0]);

        // rotate the obj based on the direction it is being drawn in
        if(obj[2] == 0)
            stack.rotateY(90);
        else if(obj[2] == 1)
            stack.rotateX(90);

        // if the obj is a sphere, draw it slightly bigger
        if(obj[1] == 1)
            stack.scale(1.65);

        draw(obj[1], red);
        stack.pop();
    });

    // for each object/coord in q, draw it
    s.forEach( (obj) => {
        stack.push();
        stack.translate(obj[0]);

        // rotate the obj based on the direction it is being drawn in
        if(obj[2] == 0)
            stack.rotateY(90);
        else if(obj[2] == 1)
            stack.rotateX(90);

        // if the obj is a sphere, draw it slightly bigger
        if(obj[1] == 1)
            stack.scale(1.65);

        draw(obj[1], texture);
        stack.pop();
    });
}

/**
 * Draw the object contained at the given index in the buffers and apply the
 * given texture to it. Uses the top of the matrix stack as it's model matrix.
 * 
 * @param {int} index             index in the 'buffers' arrays to draw this
 *                                object as.
 * @param {GL_TEXTURE_2D} texture image texture to apply to this drawn object
 */
function draw(index, texture) {
    var mvMatrix = mat4.identity(mat4.create());
    mat4.multiply(mvMatrix, stack.getMatrix(), mvMatrix);

    var pMatrix = mat4.create();
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0, pMatrix);

    
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

    //lighting code
    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value/100),
        parseFloat(document.getElementById("ambientG").value/100),
        parseFloat(document.getElementById("ambientB").value/100)
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffers[index]);
    setMatrixUniforms(pMatrix, mvMatrix);
    gl.drawElements(gl.TRIANGLES, iBuffers[index].numItems, gl.UNSIGNED_SHORT, 0);
}