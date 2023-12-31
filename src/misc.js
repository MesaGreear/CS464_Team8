// For the more misc webgl code that I don't interact with too much

var gl;

function initWebGLContext(aname) {
    console.log("Initializing WebGL context");
    gl = null;
    var canvas = document.getElementById(aname);
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
    } catch (e) {}

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    return gl;
}
// define the function to initial WebGL and Setup Geometry Objects
function initGLScene() {
    // Initialize the WebGL Context - the gl engine for drawing things.
    var gl = initWebGLContext("hellowebgl"); // The id of the Canvas Element
    if (!gl) {
        // if fails simply return
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
    var arf = 0;
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

function getShaderFromFile(gl, filename) {
    var request = new XMLHttpRequest();
    request.open("GET", filename, false);
    request.send(null);
    if (request.status != 200) {
        console.error("Something went wrong retrieving the shader file from the server.");
        return null;
    }

    var fileType = filename.substring(filename.length - 4);
    var shader;
    if (fileType == "vert") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else if (fileType == "frag") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);        
    } else {
        console.error("The filename provided {" + filename + "} is not a valid vertex or fragment shader.");
        return null;
    }

    gl.shaderSource(shader, request.responseText);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    console.log(fileType + " shader successfully loaded from " + filename);
    return shader;
}

var shaderProgram;

function initShaders() {
    var fragmentShader = getShaderFromFile(gl, "./shaders/default.frag");
    if (fragmentShader == null) { 
        fragmentShader = getShader(gl, "shader-fs"); 
    }
    var vertexShader = getShaderFromFile(gl, "./shaders/default.vert");
    if (vertexShader == null) {
        vertexShader = getShader(gl, "shader-vs");
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    //VERTEX ATTRIBUTES
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
        shaderProgram,
        "aVertexPosition"
    );
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(
        shaderProgram,
        "aVertexNormal"
    );
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(
        shaderProgram,
        "aTextureCoord"
    );
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    //UNIFORMS
    shaderProgram.pMatrixUniform = gl.getUniformLocation(
        shaderProgram,
        "uPMatrix"
    );
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(
        shaderProgram,
        "uMVMatrix"
    );
    shaderProgram.tnMatrixUniform = gl.getUniformLocation(
        shaderProgram,
        "uNMatrix"
    );
    shaderProgram.useLightingUniform = gl.getUniformLocation(
        shaderProgram,
        "uUseLighting"
    );
    shaderProgram.ambientEnabledUniform = gl.getUniformLocation(
        shaderProgram,
        "uAmbientEnabled"
    );
    shaderProgram.ambientColorUniform = gl.getUniformLocation(
        shaderProgram,
        "uAmbientColor"
    );
    shaderProgram.dirEnabledUniform = gl.getUniformLocation(
        shaderProgram,
        "uDirLightEnabled"
    );
    shaderProgram.dirLightDirectionUniform = gl.getUniformLocation(
        shaderProgram,
        "uDirLightDirection"
    );
    shaderProgram.dirLightColorUniform = gl.getUniformLocation(
        shaderProgram,
        "uDirLightColor"
    );
    shaderProgram.spotlightEnabledUniform = gl.getUniformLocation(
        shaderProgram,
        "uSpotLightEnabled"
    );
    shaderProgram.spotlightColorUniform = gl.getUniformLocation(
        shaderProgram,
        "uSpotlightColor"
    );
    shaderProgram.spotlightPositionUniform = gl.getUniformLocation(
        shaderProgram,
        "uSpotlightPosition"
    );
    shaderProgram.spotlightDirectionUniform = gl.getUniformLocation(
        shaderProgram,
        "uSpotlightDirection"
    );
    shaderProgram.spotlightLimitUniform = gl.getUniformLocation(
        shaderProgram,
        "uSpotlightLimit"
    );
    shaderProgram.pointlightEnabledUniform = gl.getUniformLocation(
        shaderProgram,
        "uPointLightEnabled"
    );
    shaderProgram.pointLightColorUniform = gl.getUniformLocation(
        shaderProgram,
        "uPointLightColor"
    );
    shaderProgram.pointLightPositionUniform = gl.getUniformLocation(
        shaderProgram,
        "uPointLightPosition"
    );
    shaderProgram.pointLightDistanceUniform = gl.getUniformLocation(
        shaderProgram,
        "uPointLightDistance"
    );

    //SAMPLERS
    shaderProgram.colorMapSampler = gl.getUniformLocation(
        shaderProgram,
        "uColorMap"
    );
}

function setMatrixUniforms(pM, mvM) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pM);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvM);

    // lighting controls for normals
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvM, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.tnMatrixUniform, false, normalMatrix);
}

// Initialize our texture data and prepare it for rendering

var glTextures = [];
var textureFiles = [
    "./textures/red.png",
    "./textures/blue.png",
    "./textures/green.png",
    "./textures/purple.png",
    "./textures/yellow.png",
    "./textures/nullTex.png",
    "./textures/brightNullTex.png",
];
var tempTexture = [];

var coloredTexs = [];

function initTextures() {
    for (let i = 0; i < textureFiles.length; i++) {
        tempTexture.push(gl.createTexture());
        tempTexture[i].image = new Image();
        tempTexture[i].image.onload = function () {
            handleLoadedTexture(tempTexture[i]);
        };
        tempTexture[i].image.src = textureFiles[i];
        glTextures.push(tempTexture[i]);
    }
    coloredTexs = glTextures.slice(0, 6);
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

//Initialize everything for starting up a simple webGL application
function startHelloWebGL() {
    // attach 'Handler' functions to handle events generated by the canvas.
    // for when the browser is resized or closed.

    // get a handle from  the DOM to connect the mouse handlers
    var acanvas = document.getElementById("hellowebgl");

    acanvas.onmousedown = handleMouseDown; // only handle mousedown when on canvas
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    acanvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    loadUserInteraction();

    // first initialize webgl components
    var gl = initGLScene();

    // now build basic geometry objects.
    initShaders();
    initGeometry();
    initTextures();

    // initialize a single pipe in the scene
    pipes.push(new Pipe(coloredTexs[0], [[0, 90], [-50, 0], [-90, 0]], [5, 25]));

    // set background of canvas to black
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Draw the Scene
    Frames();
    // If doing an animation need to add code to rotate our geometry
}

var lastTime = 0;

/* Calculating 'Frames Per Second' stuff */
var iter = 0;
var FPS_ITERATIONS = 100.0;
var fpsCalc = 0;
var fps = 0;

function animate() {
    var timeNow = new Date().getTime();

    if (lastTime != 0) {
        iter++;
        var elapsed = timeNow - lastTime;
        fpsCalc += 1000.0 / elapsed / FPS_ITERATIONS;
        if (iter % FPS_ITERATIONS == 0) {
            iter = 0;
            fps = fpsCalc;
            fpsCalc = 0;
        }
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
    updateDetails();
}
