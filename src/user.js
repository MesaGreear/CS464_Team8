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
var pipeAmount = 1;

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
    var slider4 = document.getElementById("speed");
    var output4 = document.getElementById("speedOutput");
    output4.innerHTML = slider4.value + "%";
    slider4.oninput = function() { output4.innerHTML = this.value + "%"; speed = this.value;} 

    // Length Slider
    var slider5 = document.getElementById("length");
    var output5 = document.getElementById("lengthOutput");
    output5.innerHTML = slider5.value;
    slider5.oninput = function() { output5.innerHTML = this.value; length = this.value;} 

    // Pipe Slider
    var slider6 = document.getElementById("pipe");
    var output6 = document.getElementById("pipeOutput");
    output6.innerHTML = slider6.value;
    slider6.oninput = function() { 
        output6.innerHTML = this.value; pipeAmount = this.value;

        // initialize new pipes till number of pipes on canvas match pipes
        while(pipes.length < pipeAmount)
            pipes.push(new Pipe(coloredTexs[pipes.length]));

        // pop/remove any extra pipes till number of pipes on canvas match pipes
        while(pipes.length > pipeAmount)
            pipes.pop();
    } 
}

function updateDeets() {

    // display the coordinates of the 'head' of the red pipe
    var seg = pipes[0].getLastSegment();
    var x = seg.coord[0];
    var z = seg.coord[1];
    var y = seg.coord[2];
    document.getElementById("deets").innerHTML = `Head-X: ${x} <br> Head-Y: ${z} <br> Head-Z: ${y}`;
}