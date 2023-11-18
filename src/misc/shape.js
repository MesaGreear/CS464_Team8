/**
 * Used to create Shape Objects. A Shape Object is a simple datatype that contains
 * important buffer information necessary to draw whatever shape it represents.
 */
class Shape {

    /**
     * Constructor: Using the given arrays, initialize this Shape's buffers.
     * 
     * @param {int[]} vertices Array representing vertex coordinates
     * @param {int[]} normals  Array representing normal coordinates
     * @param {int[]} textures Array representing texture coordinates
     * @param {int[]} indices  Array representing vertex indices
     */
    constructor(vertices, normals, textures, indices) {
        // initialize vertex buffer
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = vertices.length/3;

        // initialize normal buffer
        this.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.nBuffer.itemSize = 3;
        this.nBuffer.numItems = normals.length/3;

        // initialize texture buffer
        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textures), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = textures.length/2;

        // initialize index buffer
        this.iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.iBuffer.itemSize = 1;
        this.iBuffer.numItems = indices.length;

    }
}