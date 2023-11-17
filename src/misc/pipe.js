/**
 * Constructor: Initialize a pipe (just a sphere starting out) at a random coordinate.
 * 
 * @param {GL_TEXTURE_2D} tex The texture of this pipe
 */
function Pipe(tex) { 
    this.queue = [];
    this.queue.push(new PipeSegment([randInt(10, 80), randInt(-40, -10), randInt(-80, -10)], 1, 0));
    this.genNewSectionLength();
    this.dir = randInt(0, 6);
    this.tex = tex;
}

Pipe.prototype.addSegment = function() {
    // if a section has been fully drawn...
    if(this.length <= 0) {
        // calculate a new length for this pipe section
        this.genNewSectionLength();

        // initialize a sphere segment
        this.initNextSegment(1, 0);

        // generate the 4 valid directions based on the last direction we were drawing in
        var dirs = [];
        if(this.dir == 0 || this.dir == 1)      // X-axis
            dirs.push(2, 3, 4, 5);
        else if(this.dir == 2 || this.dir == 3) // Y-axis
            dirs.push(0, 1, 4, 5);
        else                                    // Z-axis
            dirs.push(0, 1, 2, 3);

        // randomly select a valid direction and check that when the entire section is drawn, the
        // resulting section will be inbounds. If it isn't, try again till a valid direction is found
        var inBounds = false;
        var currPos = this.getLastSegment().coord.slice();

        while(!inBounds) {
            this.dir = dirs[Math.floor(Math.random() * 4)];
            switch(this.dir) {
                case 0:
                    inBounds = currPos[0] - this.length > 0;   break;
                case 1:
                    inBounds = currPos[0] + this.length < 90;  break;
                case 2:
                    inBounds = currPos[1] - this.length > -50; break;
                case 3:
                    inBounds = currPos[1] + this.length < 0;   break;
                case 4:
                    inBounds = currPos[2] - this.length > -90; break;
                case 5:
                    inBounds = currPos[2] + this.length < 0;
            }
        }
    }
    // else just initialize the next cylinder segment
    else {
        this.initNextSegment(2, Math.floor(this.dir/2));
    }
}

Pipe.prototype.initNextSegment = function (shape, dir) {
    var newPos = this.getLastSegment().coord.slice();
    newPos[Math.floor(this.dir/2)] += (this.dir % 2 == 0 ? -1 : 1);
    this.length--;
    
    this.queue.push(new PipeSegment(newPos, shape, dir));
}

Pipe.prototype.trimSegments = function (length) { while(this.queue.length > length) this.queue.shift(); }

Pipe.prototype.genNewSectionLength = function() { this.length = randInt(5, 20); }

Pipe.prototype.getLastSegment = function () {return this.queue[this.queue.length - 1]};

/**
 * Constructor: 
 * 
 * @param {*} coord 
 * @param {*} shape 
 * @param {*} dir 
 */
function PipeSegment(coord, shape, dir) {
    this.coord = coord;
    this.shape = shape;
    this.dir = dir;
}