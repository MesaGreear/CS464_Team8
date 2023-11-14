// For the more misc webgl code that I don't interact with too much

var gl;

function initWebGLContext(aname) {
  gl = null;
  var canvas = document.getElementById(aname);
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  
  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  return gl;
}
// define the function to initial WebGL and Setup Geometry Objects
function initGLScene()
{
    // Initialize the WebGL Context - the gl engine for drawing things.
    var gl = initWebGLContext("hellowebgl"); // The id of the Canvas Element
        if (!gl) // if fails simply return
     {
          return;
     }
     // succeeded in initializing WebGL system
     return gl;     
}


   function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        // shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        // gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
        
        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

        //code to handle lighting
        shaderProgram.tnMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    }

function setMatrixUniforms(pM, mvM)
{
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pM);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvM);

        // lighting controls for normals
        // var normalMatrix = mat3.create();
        // mat4.toInverseMat3(mvMatrix, normalMatrix);
        // mat3.transpose(normalMatrix);
        // gl.uniformMatrix3fv(shaderProgram.tnMatrixUniform, false, normalMatrix);
}


// Initialize our texture data and prepare it for rendering
var exTexture;

var arrowTexture;
function initTextures()
{
    exTexture = gl.createTexture();
    exTexture.image = new Image();
    exTexture.image.onload = function() {
      handleLoadedTexture(exTexture)
    }

    // get texture source from html
    exTexture.image.src = document.getElementById("texture").value;
  }

function handleLoadedTexture(texture, terrain)
{
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

//Initialize everything for starting up a simple webGL application
function startHelloWebGL()
{
   // attach 'Handler' functions to handle events generated by the canvas.
   // for when the browser is resized or closed.

   // get a handle from  the DOM to connect the mouse handlers
   var acanvas = document.getElementById("hellowebgl");
   
   acanvas.onmousedown = handleMouseDown;  // only handle mousedown when on canvas
   document.onmouseup = handleMouseUp;
   document.onmousemove = handleMouseMove;
   acanvas.oncontextmenu = function (e) {e.preventDefault();}

   loadUserInteraction();

   // first initialize webgl components 
   var gl = initGLScene();
   
   // now build basic geometry objects.
   initShaders();
   initGeometry();
   initTextures();
   
   gl.clearColor(0.4,0.4,0.4,1.0);
   gl.enable(gl.DEPTH_TEST);

   // Draw the Scene
   Frames();
   // If doing an animation need to add code to rotate our geometry
}

/** Information about each object being drawn are kept in this queue. At any index [i], [i][0]
 * are the coordinates the object will be drawn at, [i][1] is the shape of the object as defined
 * in the Buffers arrays, and [i][2] is the direction the object is being drawn on (0 = X-axis,
 * 1 = Y-axis, 2 = Z-axis).
 * 
 * The head is always queue[queue.length-1] and the tail is always queue[0]. New objects are added
 * to the head and old objects are expelled from the tail. */
var queue = [[[30, -30, -30], 1, 0]]; //starting coordinates & sphere

var segmentLength = Math.floor(Math.random() * 20) + 5;
var dir = Math.floor(Math.random() * 6);

var stack;

/**
 * Generate the next segment and push it to the q. If a segment has been fully drawn (i.e. 
 * segmentLength == 0) then a new valid direction & segmentLength are calculated.
 */
function addSegment() {

    // if a segment has been fully drawn...
    if(segmentLength == 0) {
        // calculate a new segmentLength
        segmentLength = Math.floor(Math.random() * 20) + 5;

        // push a sphere to the queue to be drawn
        queue.push([nextPos(queue[queue.length-1][0]), 1, 0]);

        // generate the 4 valid directions based on the last direction we were drawing in
        var directions = [];
        if(dir == 0 || dir == 1)      // X-axis
            directions.push(2, 3, 4, 5);
        else if(dir == 2 || dir == 3) // Y-axis
            directions.push(0, 1, 4, 5);
        else                          // Z-axis
            directions.push(0, 1, 2, 3);

        // randomly select a valid direction and check that when the entire segment is drawn, the
        // resulting segment will be inbounds. If it isn't, try again till a valid direction is found
        var inBounds = false;
        var currPos = queue[queue.length - 1][0];

        while(!inBounds) {
            dir = directions[Math.floor(Math.random() * 4)];
            switch(dir) {
                case 0:
                    inBounds = currPos[0] - segmentLength > 0;   break;
                case 1:
                    inBounds = currPos[0] + segmentLength < 90;  break;
                case 2:
                    inBounds = currPos[1] - segmentLength > -50; break;
                case 3:
                    inBounds = currPos[1] + segmentLength < 0;   break;
                case 4:
                    inBounds = currPos[2] - segmentLength > -90; break;
                case 5:
                    inBounds = currPos[2] + segmentLength < 0;
            }
        }
    }
    // else just push a cylinder to the queue.
    else {
        queue.push([nextPos(queue[queue.length-1][0]), 2, Math.floor(dir/2)]);
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
function nextPos(pos) {
    var newPos = [pos[0], pos[1], pos[2]];
    newPos[Math.floor(dir/2)] += (dir % 2 == 0 ? -1 : 1);
    segmentLength--;
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
    
    updateDeets();

    // Our update handler, push a new shape/coordinate to the queue every x number of frames
    if(totalF % Math.floor(30 / (speed/100.0)) == 0)    
        addSegment();

    // 'trim' the tail of the queue till the desired length is reached
    while(queue.length > length)
        queue.shift();

    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);

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

        draw(obj[1], exTexture);
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


var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        // xRot += 0.25;
        // yRot += 0.25;
    }
    lastTime = timeNow;
}

/** Total frames elapsed */
var totalF = 0;
function Frames() {
    totalF++;
    requestAnimFrame(Frames);
    drawScene();
    animate();
}