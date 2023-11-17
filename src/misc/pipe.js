
/**
 * Used to create Pipe objects. A Pipe object represents a pipe/tube that can be drawn and
 * contains info necessary to draw said pipe. This information includes a queue of PipeSegments,
 * the remaining length of the current section being drawn, the direction the current section is
 * being drawn in, and the texture of the pipe.
 */
class Pipe {
    
    /**
     * Constructor: Initialize a pipe (just a sphere starting out) at a random coordinate. The
     * section length and direction will be randomly determined.
     * 
     * @param {GL_TEXTURE_2D} tex The texture of this pipe
     */
    constructor (tex) {
        this.queue = [];
        this.queue.push(new PipeSegment([randInt(10, 80), randInt(-40, -10), randInt(-80, -10)], 1, 0));
        this.genNewSectionLength();
        this.dir = randInt(0, 6);
        this.tex = tex;
    }

    /**
     * Add a new PipeSegment to this pipe. If the section being currently drawn is complete, then
     * a new section going in a new valid direction is determined.
     */
    addSegment() {
        // if a section has been fully drawn...
        if(this.length <= 0) {
            // calculate a new length for this pipe section
            this.genNewSectionLength();

            // initialize a sphere segment
            this.initNextSegment(1);

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
            this.initNextSegment(2);
        }
    }

    /**
     * Calculate the next position for a new segment and then initialize and add the PipeSegment
     * to the queue.
     * 
     * This method should not typically be used outside the Pipe class, consider a private utility
     * method.
     * 
     * @param {int} shape An index corelating to a shape in the buffers' arrays
     */
    initNextSegment(shape) {
        var newPos = this.getLastSegment().coord.slice();
        newPos[Math.floor(this.dir/2)] += (this.dir % 2 == 0 ? -1 : 1);
        this.length--;
        
        this.queue.push(new PipeSegment(newPos, shape, Math.floor(this.dir/2)));
    }

    /**
     * Trim the front of the queue till it's length is equal to or less than the given length.
     * 
     * @param {int} length The desired max length of the queue.
     */
    trimSegments(length) { while(this.queue.length > length) this.queue.shift(); }

    /**
     * Set the length of the next/new section to a random value within certain bounds.
     */
    genNewSectionLength() { this.length = randInt(5, 20); }

    /**
     * @returns The last PipeSegment in the queue.
     */
    getLastSegment() { return this.queue[this.queue.length - 1] }
}

/**
 * Used to create PipeSegment Objects. A PipeSegment object is a simple datatype that represents
 * a single segment of a pipe. A PipeSegment contains it's coordinates in 3D space, it's shape,
 * and the direction of the section it is a part of.
 */
class PipeSegment {

    /**
     * Constructor: Initialize a PipeSegment Object with the given values.
     * 
     * @param {vec3}      coord The coordinates of this PipeSegment in 3D space
     * @param {int}       shape An index corelating to a shape in the shapes array
     * @param {1 | 2 | 3} dir   The direction of the section this PipeSegment is a part of (0 = X-axis,
     *                          1 = Y-axis, 2 = Z-axis)
     */
    constructor(coord, shape, dir) {
        this.coord = coord;
        this.shape = shape;
        this.dir = dir;
    }
}