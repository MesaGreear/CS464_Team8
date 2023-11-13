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

/** Coordinates of the 'snake' are kept in a queue. The head is always q[q.length-1] 
 * and the tail is always q[0]. New coordinates are added to the head and old coordinates
 * are expelled from the tail.*/
var q = [[30, -30, -30]]; //starting coordinates

var stack;

/**
 * Given a 3D position, randomly calculate another nearby coordinate within certain bounds.
 * 
 * @param pos vec3 representing coordinates in a 3D space
 * 
 * @returns pos with either an altered x, y, or z value
 */
function nextPos(pos) {

    var r = Math.floor(Math.random() * 3);
    var newPos = [pos[0], pos[1], pos[2]];

    newPos[r] += Math.random() < 0.5 ? -3 : 3; // 3 is the current offset value

    // check bounds, don't let the 'snake' fly off into the aether
    newPos[0] = Math.min(newPos[0], 90);
    newPos[0] = Math.max(newPos[0], 0);

    newPos[1] = Math.min(newPos[1], 0);
    newPos[1] = Math.max(newPos[1], -50);

    newPos[2] = Math.min(newPos[2], 0);
    newPos[2] = Math.max(newPos[2], -90);

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
        q.push(nextPos(q[q.length-1]));

    // 'trim' the tail of the queue till the desired length is reached
    while(q.length > length)
        q.shift();

    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 1);

    stack = new mStack(); // Matrix Stack

    // rotate the scene to give us our angled view
    stack.rotateX(25);
    stack.rotateY(45);

    // for each object/coord in q, draw it
    q.forEach( (obj) => {
        stack.push();
        stack.translate(obj);
        draw(0, exTexture);
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