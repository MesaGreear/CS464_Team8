// create and initialize our geometry objects
var terVertexPositionBuffer;
var terNormalBuffer;
var terVertexTextureCoordBuffer;
var terVertexIndexBuffer;

var vertices;
var textureCoords;
var vertexIndices;

/** Coordinates of the 'snake' are kept in a queue. The head is always q[q.length-1] 
 * and the tail is always q[0]. New coordinates are added to the head and old coordinates
 * are expelled from the tail.*/
var q = [[30, -30, -30]]; //starting coordinates

/**
 * Generate a square centered around the given coordinates and push its geometry
 * data to vertices, textureCoords, & vertexIndices.
 * 
 * @param coord vec3 representing a 3D coordinate
 */
function initSquare(coord) {

    vertices.push(
        // Front face
        -1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],
         1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],
        -1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],

        // Back face
        -1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],
        -1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],

        // Top face
        -1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],
        -1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],

        // Bottom face
        -1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],
        -1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],

        // Right face
         1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],
         1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],
         1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],

        // Left face
        -1.0 + coord[0], -1.0 + coord[1], -1.0 + coord[2],
        -1.0 + coord[0], -1.0 + coord[1],  1.0 + coord[2],
        -1.0 + coord[0],  1.0 + coord[1],  1.0 + coord[2],
        -1.0 + coord[0],  1.0 + coord[1], -1.0 + coord[2],
    );

    // TODO: normals?

    textureCoords.push(
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
      );

      var offset = (vertices.length/3) - 24;

      vertexIndices.push(
        offset + 0, offset + 1, offset + 2,      offset + 0, offset + 2, offset + 3,    // Front face
        offset + 4, offset + 5, offset + 6,      offset + 4, offset + 6, offset + 7,    // Back face
        offset + 8, offset + 9, offset + 10,     offset + 8, offset + 10, offset + 11,  // Top face
        offset + 12, offset + 13, offset + 14,   offset + 12, offset + 14, offset + 15, // Bottom face
        offset + 16, offset + 17, offset + 18,   offset + 16, offset + 18, offset + 19, // Right face
        offset + 20, offset + 21, offset + 22,   offset + 20, offset + 22, offset + 23  // Left face
    );
}

var SPHERE_QUALITY = 20; // quality of the sphere/smoothness

/**
 * Generate a sphere centered around the given coordinates and push its geometry
 * data to vertices, textureCoords, & vertexIndices.
 * 
 * @param coord vec3 representing a 3D coordinate
 */
function initSphere(coord) {
    // Lotsa help from here (https://stackoverflow.com/questions/47756053/webgl-try-draw-sphere)
    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    // vertices
    for(j = 0; j <= SPHERE_QUALITY; j++) {
        aj = j * Math.PI / SPHERE_QUALITY;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for(i = 0; i <= SPHERE_QUALITY; i++) {
            ai = i * 2 * Math.PI / SPHERE_QUALITY;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            vertices.push(si * sj + coord[0]); // X
            vertices.push(cj + coord[1]);      // Y
            vertices.push(ci * sj + coord[2]); // Z

            textureCoords.push(i/SPHERE_QUALITY, j/SPHERE_QUALITY);
        }
    }

    //TODO: normals?

    // indices
    var offset = (vertices.length/3) - ((SPHERE_QUALITY + 1) * (SPHERE_QUALITY + 1));
    for (j = 0; j < SPHERE_QUALITY; j++) {
        for (i = 0; i < SPHERE_QUALITY; i++) {
          p1 = offset + (j * (SPHERE_QUALITY+1) + i);
          p2 = (p1 + (SPHERE_QUALITY+1));

          vertexIndices.push(p1);
          vertexIndices.push(p2);
          vertexIndices.push(p1 + 1);

          vertexIndices.push(p1 + 1);
          vertexIndices.push(p2);
          vertexIndices.push(p2 + 1);
        }
      }
}

/**
 * Given a 3D position, randomly calculate another nearby coordinate within certain bounds.
 * 
 * @param pos vec3 representing coordinates in a 3D space
 * 
 * @returns pos with either an altered x, y, or z value
 */
function nextPos(pos) {

    var r = Math.floor(Math.random() * 3);
    var newPos = [pos[0], pos[1], pos[2]];

    newPos[r] += Math.random() < 0.5 ? -3 : 3; // 3 is the current offset value

    // check bounds, don't let the 'snake' fly off into the aether
    newPos[0] = Math.min(newPos[0], 90);
    newPos[0] = Math.max(newPos[0], 0);

    newPos[1] = Math.min(newPos[1], 0);
    newPos[1] = Math.max(newPos[1], -50);

    newPos[2] = Math.min(newPos[2], 0);
    newPos[2] = Math.max(newPos[2], -90);

    return newPos;
}

function initGeometry()
{
    // reset geometry data
    vertices = [];
    textureCoords = [];
    vertexIndices = [];

    // push the next random position into q
    q.push( nextPos(q[q.length-1]) );

    // keep q's length below a certain value
    while(q.length > length)
        q.shift();

    // generate all the squares based on the coordinates held in q
    for(i = 0; i < q.length; i++) 
        initSquare(q[i]);

    initSphere([0, 0, 4]);

    terVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, terVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    terVertexPositionBuffer.itemSize = 3;
    terVertexPositionBuffer.numItems = (24 * q.length) + ((SPHERE_QUALITY + 1) * (SPHERE_QUALITY + 1));

    // terNormalBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, terNormalBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nvertices), gl.STATIC_DRAW);
    // terNormalBuffer.itemSize = 3;
    // terNormalBuffer.numItems = vertexCount*vertexCount;

    
    // var textureCoords = [];

    // tc = 0;
    // for(i = 0; i < vertexCount; i++) {
    //     for(j = 0; j < vertexCount; j++) {
    //         textureCoords[tc++] = (j*1.0)/vertexCount;
    //         textureCoords[tc++] = (i*1.0)/vertexCount;
    //     }
    // }

    terVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, terVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    terVertexTextureCoordBuffer.itemSize = 2;
    terVertexTextureCoordBuffer.numItems = (24 * q.length) + ((SPHERE_QUALITY + 1) * (SPHERE_QUALITY + 1));

    terVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    terVertexIndexBuffer.itemSize = 1;
    terVertexIndexBuffer.numItems = (36 * q.length) + (((SPHERE_QUALITY) * (SPHERE_QUALITY)) * 6);
}