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
    exTexture.image.src = "./textures/" + document.getElementById("texture").value;
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
   
   gl.clearColor(0,0,0,1.0);
   gl.enable(gl.DEPTH_TEST);

   // Draw the Scene
   Frames();
   // If doing an animation need to add code to rotate our geometry
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
    updateDeets();
}