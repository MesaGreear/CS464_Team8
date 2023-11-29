/**
 * Used to create MStack objects. A MStack, or Matrix Stack, contains a stack of 4x4 matrices
 * the top of which can be modified in a variety of ways. When used properly, a Matrix Stack
 * aids in transforming, rotating, or scaling a drawn object in relation to another drawn object.
 */
class MStack {
    /**
     * Constructor: Initialize an empty matrix stack.
     */
    constructor() {
        this.stack = [mat4.identity(mat4.create())];
        this.saved = null;
    }

    /**
     * Pop and return the top of the matrix stack.
     *
     * @returns the popped matrix
     */
    pop() {
        if (this.stack.length < 1) throw "Invalid Matrix Stack!!!!!";
        return this.stack.pop();
    }

    /**
     * Create a copy of the top of the stack and push it to the top.
     */
    push() {
        this.stack.push(this.getMatrix());
    }

    /**
     * @returns the top of the stack
     */
    getMatrix() {
        return this.stack[this.stack.length - 1].slice();
    }

    /**
     * @param {mat4} m matrix to set the top of the stack to
     */
    setMatrix(m) {
        this.stack[this.stack.length - 1] = m;
    }

    /**
     * Translate the top of the stack by the given coordinates.
     *
     * @param {vec3} coord coordinates representing xyz in 3D space
     */
    translate(coord) {
        this.setMatrix(mat4.translate(this.getMatrix(), coord));
    }

    /**
     * Rotate the top of the stack by the given degrees in the given direction.
     *
     * @param {vec3} axis  the axis to rotate on
     * @param {int} degree degrees to rotate by
     */
    rotate(axis, degree) {
        this.setMatrix(
            mat4.rotate(this.getMatrix(), (degree / 180.0) * 3.1415, axis)
        );
    }

    /**
     * Rotate the top of the stack by the given degrees on the X-axis.
     *
     * @param {int} degree degrees tp rotate by
     */
    rotateX(degree) {
        this.rotate([1, 0, 0], degree);
    }

    /**
     * Rotate the top of the stack by the given degrees on the Y-axis.
     *
     * @param {int} degree degrees tp rotate by
     */
    rotateY(degree) {
        this.rotate([0, 1, 0], degree);
    }

    /**
     * Rotate the top of the stack by the given degrees on the Z-axis.
     *
     * @param {int} degree degrees tp rotate by
     */
    rotateZ(degree) {
        this.rotate([0, 0, 1], degree);
    }

    /**
     * Scale the top of the stack by the given scale.
     *
     * @param {vec3 | int} scale vec3 to scale each axis individually or int to scale
     *                           all axes by the given int
     */
    scale(scale) {
        if (Array.isArray(scale))
            this.setMatrix(mat4.scale(this.getMatrix(), scale));
        else
            this.setMatrix(mat4.scale(this.getMatrix(), [scale, scale, scale]));
    }

    /**
     * Save the current state of the top of the stack. Can be restored later by restore().
     * Can be used to undo changes that are specific to a drawn object after it has been
     * drawn.
     */
    save() {
        this.saved = this.getMatrix();
    }

    /**
     * Restore the previously saved state, undoing any changes that have been made since
     * the last save().
     */
    restore() {
        this.setMatrix(this.saved);
    }
}
