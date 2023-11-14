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
    if (!mouseDown)
        return;

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

var mini = false;

document.addEventListener("keydown", (e) => {
    // switch(e.key) {
    //     case 'm':
    //         mini = !mini;
    //         break;
    //     case 'a':
    //         dir -= 5;
    //         break;
    //     case 'd':
    //         dir += 5;
    //         break;
    //     case 's':
    //         speed -= 0.00025;
    //         break;
    //     case 'w':
    //         speed += 0.00025;
    //         break;
    //     case 'q':
    //         angle -= 3;
    //         break;
    //     case 'e':
    //         angle += 3;
    //         break;
    // }
});


var speed = 100;
var length = 25;

function loadUserInteraction() {
    // Ambient RGB sliders
    var slider1 = document.getElementById("ambientR");
    var output1 = document.getElementById("ambientROutput");
    output1.innerHTML = slider1.value/100;
    slider1.oninput = function() { output1.innerHTML = this.value/100; }

    var slider2 = document.getElementById("ambientG");
    var output2 = document.getElementById("ambientGOutput");
    output2.innerHTML = slider2.value/100;
    slider2.oninput = function() { output2.innerHTML = this.value/100; } 

    var slider3 = document.getElementById("ambientB");
    var output3 = document.getElementById("ambientBOutput");
    output3.innerHTML = slider3.value/100;
    slider3.oninput = function() { output3.innerHTML = this.value/100; } 

    // Speed Slider
    var slider13 = document.getElementById("speed");
    var output13 = document.getElementById("speedOutput");
    output13.innerHTML = slider13.value + "%";
    slider13.oninput = function() { output13.innerHTML = this.value + "%"; speed = this.value;} 

    // Length Slider
    var slider14 = document.getElementById("length");
    var output14 = document.getElementById("lengthOutput");
    output14.innerHTML = slider14.value;
    slider14.oninput = function() { output14.innerHTML = this.value; length = this.value;} 
}

function updateDeets() {

    // display the coordinates of the 'head' of the 'snake'
    var x = queue[queue.length-1][0][0];
    var z = queue[queue.length-1][0][1];
    var y = queue[queue.length-1][0][2];
    document.getElementById("deets").innerHTML = `Head-X: ${x} <br> Head-Y: ${z} <br> Head-Z: ${y}`;
}