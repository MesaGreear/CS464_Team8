//User interaction code
// =================================================================================
//                              Mouse Stuff
// =================================================================================

var mouseDown;
var lastMouseX;
var lastMouseY;
var origMouseY;

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    origMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) return;

    // var newDir = event.clientX;
    // var newX = event.clientX;
    // var newY = event.clientY;

    // // if right mouse & left mouse are held down, handle zooming
    // if(event.buttons & 1 && event.buttons & 2) {
    //     zoom += (newY - lastMouseY)/100;
    // }
    // // if right-mouse-button is held down, handle panning
    // else if (event.buttons & 2) {
    //     xDis += (newX - lastMouseX)/200;
    //     yDis += -(newY - lastMouseY)/200;
    // }
    // // else, handle spinning
    // else {
    //     // Flipping X & Y here works better with the mouse for some reason

    // }

    // dir  += newDir - lastMouseY;
    // yRot += newX - lastMouseX;

    // lastMouseX = newDir;
    // lastMouseY = newY;
    // console.log(dir);
}

// =================================================================================
//                              Key Presses Code
// =================================================================================

var fullScreen = false;

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        // case "f":
        //     fullScreen = !fullScreen;
        //     var canvas = document.querySelector("#hellowebgl");
        //     if (fullScreen) {
        //         canvas.style.width = "90vw";
        //         canvas.style.height = "100vh";
        //     } else {
        //         canvas.style.width = "640px";
        //         canvas.style.height = "480px";
        //     }
        //     break;
    }
});

var speed = 100;
var length = 25;
var pipeAmount = 1;

function loadAmbientLightInteraction() {
    var ambientLightColorPicker = document.getElementById("ambientLightColor");
    var ambientLightColorOutput = document.getElementById(
        "ambientLightColorOutput"
    );
    ambientLightColorOutput.innerHTML = ambientLightColorPicker.value;
    ambientLightColorPicker.oninput = function () {
        ambientLightColorOutput.innerHTML = this.value;
    };
}

function loadDirectionLightInteraction() {
    var dirLightColorPicker = document.getElementById("dirLightColor");
    var dirLightColorOutput = document.getElementById("dirLightColorOutput");
    dirLightColorOutput.innerHTML = dirLightColorPicker.value;
    dirLightColorPicker.oninput = function () {
        dirLightColorOutput.innerHTML = this.value;
    };

    var dirLightDirectionXslider =
        document.getElementById("dirLightDirectionX");
    var dirLightDirectionXoutput = document.getElementById(
        "dirLightDirectionXOutput"
    );
    dirLightDirectionXoutput.innerHTML =
        "x: " +
        (this.value > 0 ? "+" : "") +
        dirLightDirectionXslider.value / 100;
    dirLightDirectionXslider.oninput = function () {
        dirLightDirectionXoutput.innerHTML =
            "x: " + (this.value > 0 ? "+" : "") + this.value / 100;
    };
    var dirLightDirectionYslider =
        document.getElementById("dirLightDirectionY");
    var dirLightDirectionYoutput = document.getElementById(
        "dirLightDirectionYOutput"
    );
    dirLightDirectionYoutput.innerHTML =
        "y: " +
        (this.value > 0 ? "+" : "") +
        dirLightDirectionYslider.value / 100;
    dirLightDirectionYslider.oninput = function () {
        dirLightDirectionYoutput.innerHTML =
            "y: " + (this.value > 0 ? "+" : "") + this.value / 100;
    };
    var dirLightDirectionZslider =
        document.getElementById("dirLightDirectionZ");
    var dirLightDirectionZoutput = document.getElementById(
        "dirLightDirectionZOutput"
    );
    dirLightDirectionZoutput.innerHTML =
        "z: " +
        (this.value > 0 ? "+" : "") +
        dirLightDirectionZslider.value / 100;
    dirLightDirectionZslider.oninput = function () {
        dirLightDirectionZoutput.innerHTML =
            "z: " + (this.value > 0 ? "+" : "") + this.value / 100;
    };
}

function loadSpotlightInteraction() {
    var spotlightColorPicker = document.getElementById("pointLightColor");
    var spotlightColorOutput = document.getElementById("spotlightColorOutput");
    spotlightColorOutput.innerHTML = spotlightColorPicker.value;
    spotlightColorPicker.oninput = function () {
        spotlightColorOutput.innerHTML = this.value;
    };

    var spotlightAngleSlider = document.getElementById("spotlightAngle");
    var spotlightAngleOutput = document.getElementById("spotlightAngleOutput");
    spotlightAngleOutput.innerHTML =
        "\u03B8: " + spotlightAngleSlider.value + "\u00B0";
    spotlightAngleSlider.oninput = function () {
        spotlightAngleOutput.innerHTML = "\u03B8: " + this.value + "\u00B0";
    };

    var spotlightPositionXslider =
        document.getElementById("spotlightPositionX");
    var spotlightPositionXoutput = document.getElementById(
        "spotlightPositionXOutput"
    );
    spotlightPositionXoutput.innerHTML =
        "x: " + (this.value > 0 ? "+" : "") + spotlightPositionXslider.value;
    spotlightPositionXslider.oninput = function () {
        spotlightPositionXoutput.innerHTML = "x: " + this.value;
    };
    var spotlightPositionYslider =
        document.getElementById("spotlightPositionY");
    var spotlightPositionYoutput = document.getElementById(
        "spotlightPositionYOutput"
    );
    spotlightPositionYoutput.innerHTML = "y: " + spotlightPositionYslider.value;
    spotlightPositionYslider.oninput = function () {
        spotlightPositionYoutput.innerHTML = "y: " + this.value;
    };
    var spotlightPositionZslider =
        document.getElementById("spotlightPositionZ");
    var spotlightPositionZoutput = document.getElementById(
        "spotlightPositionZOutput"
    );
    spotlightPositionZoutput.innerHTML = "z: " + spotlightPositionZslider.value;
    spotlightPositionZslider.oninput = function () {
        spotlightPositionZoutput.innerHTML = "z: " + this.value;
    };

    var spotlightDirectionPitchslider = document.getElementById(
        "spotlightDirectionPitch"
    );
    var spotlightDirectionPitchoutput = document.getElementById(
        "spotlightDirectionPitchOutput"
    );
    spotlightDirectionPitchoutput.innerHTML =
        "pitch: " + spotlightDirectionPitchslider.value + "\u00B0";
    spotlightDirectionPitchslider.oninput = function () {
        spotlightDirectionPitchoutput.innerHTML =
            "pitch: " + this.value + "\u00B0";
    };
    var spotlightDirectionYawSlider = document.getElementById(
        "spotlightDirectionYaw"
    );
    var spotlightDirectionYawOutput = document.getElementById(
        "spotlightDirectionYawOutput"
    );
    spotlightDirectionYawOutput.innerHTML =
        "yaw: " + spotlightDirectionYawSlider.value + "\u00B0";
    spotlightDirectionYawSlider.oninput = function () {
        spotlightDirectionYawOutput.innerHTML = "yaw: " + this.value + "\u00B0";
    };
}

function loadPointLightInteraction() {
    var pointLightColorPicker = document.getElementById("pointLightColor");
    var pointLightColorOutput = document.getElementById(
        "pointLightColorOutput"
    );
    pointLightColorOutput.innerHTML = pointLightColorPicker.value;
    pointLightColorPicker.oninput = function () {
        pointLightColorOutput.innerHTML = this.value;
    };

    var pointLightPositionXslider = document.getElementById(
        "pointLightPositionX"
    );
    var pointLightPositionXoutput = document.getElementById(
        "pointLightPositionXOutput"
    );
    pointLightPositionXoutput.innerHTML =
        "x: " + (this.value > 0 ? "+" : "") + pointLightPositionXslider.value;
    pointLightPositionXslider.oninput = function () {
        pointLightPositionXoutput.innerHTML = "x: " + this.value;
    };
    var pointLightPositionYslider = document.getElementById(
        "pointLightPositionY"
    );
    var pointLightPositionYoutput = document.getElementById(
        "pointLightPositionYOutput"
    );
    pointLightPositionYoutput.innerHTML =
        "y: " + pointLightPositionYslider.value;
    pointLightPositionYslider.oninput = function () {
        pointLightPositionYoutput.innerHTML = "y: " + this.value;
    };
    var pointLightPositionZslider = document.getElementById(
        "pointLightPositionZ"
    );
    var pointLightPositionZoutput = document.getElementById(
        "pointLightPositionZOutput"
    );
    pointLightPositionZoutput.innerHTML =
        "z: " + pointLightPositionZslider.value;
    pointLightPositionZslider.oninput = function () {
        pointLightPositionZoutput.innerHTML = "z: " + this.value;
    };

    var pointLightDistanceSlider =
        document.getElementById("pointLightDistance");
    var pointLightDistanceOutput = document.getElementById(
        "pointLightDistanceOutput"
    );
    pointLightDistanceOutput.innerHTML =
        "distance: " + pointLightDistanceSlider.value;
    pointLightDistanceSlider.oninput = function () {
        pointLightDistanceOutput.innerHTML = "distance: " + this.value;
    };
}

function loadProjectionOptionsInteraction() {
    var fovSlider = document.getElementById("fov");
    var fovOutput = document.getElementById("fovOutput");
    fovOutput.innerHTML = fovSlider.value + "\u00B0";
    fovSlider.oninput = function () {
        fovOutput.innerHTML = fovSlider.value + "\u00B0";
    };
}

function loadUserInteraction() {
    loadAmbientLightInteraction();
    loadDirectionLightInteraction();
    loadSpotlightInteraction();
    loadPointLightInteraction();
    loadProjectionOptionsInteraction();

    // SPOTLIGHT CONTROLS -------------------------------------------------------------------------

    // Speed Slider
    var slider4 = document.getElementById("speed");
    var output4 = document.getElementById("speedOutput");
    output4.innerHTML =
        slider4.value + "% (FPU = " + Math.floor(5.0 / (speed / 100.0)) + ")";
    slider4.oninput = function () {
        speed = this.value;
        output4.innerHTML =
            this.value + "% (FPU = " + Math.floor(5.0 / (speed / 100.0)) + ")";
    };

    // Length Slider
    var slider5 = document.getElementById("length");
    var output5 = document.getElementById("lengthOutput");
    output5.innerHTML = slider5.value;
    slider5.oninput = function () {
        output5.innerHTML = this.value;
        length = this.value;
    };

    // Pipe Slider
    var slider6 = document.getElementById("pipe");
    var output6 = document.getElementById("pipeOutput");
    output6.innerHTML = slider6.value;
    slider6.oninput = function () {
        output6.innerHTML = this.value;
        pipeAmount = this.value;

        // initialize new pipes till number of pipes on canvas match pipes
        while (pipes.length < pipeAmount)
            pipes.push(new Pipe(coloredTexs[pipes.length]));

        // pop/remove any extra pipes till number of pipes on canvas match pipes
        while (pipes.length > pipeAmount) pipes.pop();
    };

    // Sphere Quality Slider
    var slider7 = document.getElementById("sphereQ");
    var output7 = document.getElementById("sphereQOutput");
    output7.innerHTML = slider7.value;
    SPHERE_QUALITY = Number(slider7.value);
    slider7.oninput = function () { output7.innerHTML = this.value; SPHERE_QUALITY = Number(this.value); initGeometry(); };

    // Sphere Radius Slider
    var slider8 = document.getElementById("sphereR");
    var output8 = document.getElementById("sphereROutput");
    output8.innerHTML = slider8.value;
    SPHERE_RADIUS = Number(slider8.value);
    slider8.oninput = function () { output8.innerHTML = this.value; SPHERE_RADIUS = Number(slider8.value); initGeometry(); };
    
    // Sphere Radius Slider
    var slider11 = document.getElementById("sphereS");
    var output11 = document.getElementById("sphereSOutput");
    output11.innerHTML = slider11.value;
    SPHERE_SPIKE = Number(slider11.value);
    slider11.oninput = function () { output11.innerHTML = this.value; SPHERE_SPIKE = Number(slider11.value); initGeometry(); };
    
    // Cylinder Quality Slider
    var slider9 = document.getElementById("cylinderQ");
    var output9 = document.getElementById("cylinderQOutput");
    output9.innerHTML = slider9.value;
    CYLINDER_QUALITY = Number(slider9.value);
    slider9.oninput = function () { output9.innerHTML = this.value; CYLINDER_QUALITY = Number(this.value); initGeometry(); };

    // Cylinder Radius Slider
    var slider12 = document.getElementById("cylinderS");
    var output12 = document.getElementById("cylinderSOutput");
    output12.innerHTML = slider12.value;
    CYLINDER_SEGMENT = Number(slider12.value);
    slider12.oninput = function () { output12.innerHTML = this.value; CYLINDER_SEGMENT = Number(slider12.value); initGeometry(); };

    // Cylinder Radius Slider
    var slider10 = document.getElementById("cylinderR");
    var output10 = document.getElementById("cylinderROutput");
    output10.innerHTML = slider10.value;
    CYLINDER_RADIUS = Number(slider10.value);
    slider10.oninput = function () { output10.innerHTML = this.value; CYLINDER_RADIUS = Number(slider10.value); initGeometry(); };

    // hide/reveal details when clicked
    document.getElementById("details").onclick = function () {
        if (document.getElementById("deets").style.visibility == "hidden") {
            document.getElementById("deets").style.visibility = "visible";
            document.getElementById("deets2").style.visibility = "visible";
            document.getElementById("details").style.width = "auto";
            document.getElementById("details").style.height = "auto";
            document.getElementById("details").style.backgroundImage = "";
        } else {
            document.getElementById("deets").style.visibility = "hidden";
            document.getElementById("deets2").style.visibility = "hidden";
            document.getElementById("details").style.width = "30px";
            document.getElementById("details").style.height = "30px";
            document.getElementById("details").style.backgroundImage =
                "url(./icons/info.png)";
            document.getElementById("details").style.backgroundRepeat =
                "no-repeat";
            document.getElementById("details").style.backgroundSize = "cover";
        }
    };
    document.getElementById("details").onclick(); // run the 'onclick()' function

    // run onclick function for all the UI controls (collapse them all) except for the 'General' controls
    Array.from(document.getElementsByClassName("UISectionTitle")).forEach((elem) => {
        elem.onclick();
    });
    document.getElementById("UIGeneral").style.display = "block";
}

/**
 * Toggle the collapsed stated of the given HTML element
 * 
 * @param {String} id The ID of the HTML element to collapse or expand
 */
function collapse(id) {
    document.getElementById(id).style.display = (document.getElementById(id).style.display == "none" ? "block" : "none");
}


/** Line Mode flag */
var lineMode = false;

/**
 * Function to apply to an HTML checkBox that toggles lineMode when changed.
 *
 * @param {HTMLInputElement} box The checkBox HTML element
 */
function toggleLine(box) {
    lineMode = box.checked;
}

/**
 * Update the details that are above the canvas. Mostly for curiosity or debug purposes.
 */
function updateDetails() {
    // display the coordinates of the 'head' of the red pipe
    var seg = pipes[0].getLastSegment();
    var x = seg.coord[0];
    var z = seg.coord[1];
    var y = seg.coord[2];
    document.getElementById(
        "deets"
    ).innerHTML = `Head-X: ${x} <br> Head-Y: ${z} <br> Head-Z: ${y}`;

    // display the number of draw calls, how many times the buffers were rebinded, and the total number of vertices in the scene
    document.getElementById(
        "deets2"
    ).innerHTML = `Draw() Calls: ${draws} <br> Vertex Count: ${vertexCount} <br> FPS: &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ${Math.floor(
        fps
    )}`;
}
