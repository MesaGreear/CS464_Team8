
/**
 * Constructor: Initialize an empty matrix stack.
 */
function mStack() { this.stack = [mat4.identity(mat4.create())]; this.saved = null; }

/**
 * Pop and return the top of the matrix stack.
 * 
 * @returns the popped stack
 */
mStack.prototype.pop = function() {
    if(this.stack.length < 1)
        throw "Invalid Matrix Stack!!!!!";
    return this.stack.pop();
}

/**
 * Create a copy of the top of the stack and push it to the top.
 */
mStack.prototype.push = function() { this.stack.push(this.getMatrix()); }

/**
 * Get (without removing/popping) the top of the stack.
 * 
 * @returns the top of the stack
 */
mStack.prototype.getMatrix = function() { return this.stack[this.stack.length - 1].slice(); }

/**
 * Set the top of the stack to the given matrix.
 * 
 * @param {mat4} m matrix to set the top of the stack to
 */
mStack.prototype.setMatrix = function(m) { this.stack[this.stack.length - 1] = m; }

/**
 * Translate the top of the stack by the given coordinates.
 * 
 * @param {vec3} coord coordinates representing xyz in 3D space
 */
mStack.prototype.translate = function(coord) { this.setMatrix(mat4.translate(this.getMatrix(), coord)); }

/**
 * Rotate the top of the stack by the given degrees in the given direction.
 * 
 * @param {vec3} axis  the axis to rotate on
 * @param {int} degree degrees to rotate by
 */
mStack.prototype.rotate = function(axis, degree) { this.setMatrix(mat4.rotate(this.getMatrix(), degree/180.0*3.1415, axis)); }

/**
 * Rotate the top of the stack by the given degrees on the X-axis.
 * 
 * @param {int} degree degrees tp rotate by
 */
mStack.prototype.rotateX = function(degree) { this.rotate([1,0,0], degree); }

/**
 * Rotate the top of the stack by the given degrees on the Y-axis.
 * 
 * @param {int} degree degrees tp rotate by
 */
mStack.prototype.rotateY = function(degree) { this.rotate([0,1,0], degree); }

/**
 * Rotate the top of the stack by the given degrees on the Z-axis.
 * 
 * @param {int} degree degrees tp rotate by
 */
mStack.prototype.rotateZ = function(degree) { this.rotate([0,0,1], degree); }

/**
 * Scale the top of the stack by the given scale.
 * 
 * @param {vec3 | int} scale vec3 to scale each axis individually or int to scale
 *                           all axes by the given int
 */
mStack.prototype.scale = function(scale) {
    if(Array.isArray(scale))
        this.setMatrix(mat4.scale(this.getMatrix(), scale));
    else
        this.setMatrix(mat4.scale(this.getMatrix(), [scale, scale, scale]));
}

/**
 * Save the current state of the top of the stack. Can be restored later by restore().
 * Can be used to undo changes that are specific to a drawn object after it has been
 * drawn.
 */
mStack.prototype.save = function() { this.saved = this.getMatrix(); }

/**
 * Restore the previously saved state, undoing any changes that have been made since
 * the last save().
 */
mStack.prototype.restore = function() { this.setMatrix(this.saved); }