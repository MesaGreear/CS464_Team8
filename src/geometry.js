/** Contains all available shapes that can be drawn */
var shapes = [];

var vertices = [];
var normals = [];
var textures = [];
var indices = [];

// TODO: remove coord parameters from init functions?

/**
 * Generate a square centered around the given coordinates and push its geometry
 * data to vertices, textures, & indices.
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

    textures.push(
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

      indices.push(
        offset + 0, offset + 1, offset + 2,      offset + 0, offset + 2, offset + 3,    // Front face
        offset + 4, offset + 5, offset + 6,      offset + 4, offset + 6, offset + 7,    // Back face
        offset + 8, offset + 9, offset + 10,     offset + 8, offset + 10, offset + 11,  // Top face
        offset + 12, offset + 13, offset + 14,   offset + 12, offset + 14, offset + 15, // Bottom face
        offset + 16, offset + 17, offset + 18,   offset + 16, offset + 18, offset + 19, // Right face
        offset + 20, offset + 21, offset + 22,   offset + 20, offset + 22, offset + 23  // Left face
    );
}

var SPHERE_QUALITY = 12; // quality of the sphere/smoothness
var SPHERE_VERTICES = (SPHERE_QUALITY + 1) * (SPHERE_QUALITY + 1);
var SPHERE_INDICES = SPHERE_QUALITY * SPHERE_QUALITY * 6;


/**
 * Generate a sphere centered around the given coordinates and push its geometry
 * data to vertices, textures, & indices.
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

            vertices.push(si * sj + coord[0],  // X
                          cj + coord[1],       // Y
                          ci * sj + coord[2]); // Z

            normals.push(si * sj + coord[0],  
                         cj + coord[1],       
                         ci * sj + coord[2]); 

            textures.push(i/SPHERE_QUALITY, j/SPHERE_QUALITY);
        }
    }

    //TODO: normals?

    // indices
    var offset = (vertices.length/3) - SPHERE_VERTICES;
    for (j = 0; j < SPHERE_QUALITY; j++) {
        for (i = 0; i < SPHERE_QUALITY; i++) {
          p1 = offset + (j * (SPHERE_QUALITY+1) + i);
          p2 = (p1 + (SPHERE_QUALITY+1));

          indices.push(p1, p2, p1 + 1);
          indices.push(p1 + 1, p2, p2 + 1);
        }
      }
}

var CYLINDER_QUALITY = 8;
var CYLINDER_VERTICES = 2 * (CYLINDER_QUALITY + 1);
var CYLINDER_INDICES = 6 * CYLINDER_QUALITY;

var HEIGHT = 1;
var RADIUS = 1;

/**
 * Generate a cylinder centered around the given coordinates and push its geometry
 * data to vertices, textures, & indices.
 * 
 * @param coord vec3 representing a 3D coordinate
 */
function initCylinder(coord) {
    // Lotsa help from here: https://www.songho.ca/opengl/gl_cylinder.html#cylinder

    var sectorStep = 2 * Math.PI/CYLINDER_QUALITY;
    var unitVertices = [];

    for(i = 0; i <= CYLINDER_QUALITY; i++) {
        var sectorAngle = i * sectorStep;
        unitVertices.push(Math.cos(sectorAngle));
        unitVertices.push(Math.sin(sectorAngle));
        unitVertices.push(0);
    }

    // vertices & textures
    for(i = 0; i < 2; i++) {
        var h = -HEIGHT/2.0 + i * HEIGHT;
        var t = 1.0 - i;

        for(j = 0, k = 0; j <= CYLINDER_QUALITY; j++, k+=3) {
            var ux = unitVertices[k];
            var uy = unitVertices[k+1];
            var uz = unitVertices[k+2];

            var cx = ux * RADIUS;
            var cy = uy * RADIUS;
            var cz = h;

            vertices.push(coord[0] + cx, coord[1] + cy, coord[2] + cz);

            normals.push(ux, uy, uz);

            textures.push((j * 1.0)/CYLINDER_QUALITY, t);
        }
    }

    // indices
    var k1 = 0;
    var k2 = CYLINDER_QUALITY + 1;
    var offset = (vertices.length/3) - CYLINDER_VERTICES;
    for(i = 0; i < CYLINDER_QUALITY; i++, k1++, k2++) {
        indices.push(offset + k1, offset + k1 + 1, offset + k2);
        indices.push(offset + k2, offset + k1 + 1, offset + k2 + 1);
    }


}

/**
 * Empty the vertices, textures, and indices arrays in preparation of new geometry data */
function clearArrs() { vertices.length = 0; normals.length = 0; textures.length = 0; indices.length = 0; }

/**
 * Initialize the scene's geometry data and buffers.
 */
function initGeometry()
{
    // initialize a square and insert it into shapes at index 0
    initSquare([0, 0, 0]);
    shapes.push(null);
    // shapes.push(new Shape(vertices, null, textures, indices));

    clearArrs();

    // initialize a sphere and insert it into shapes at index 1
    initSphere([0, 0, 0]);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();

    // initialize a cylinder and insert it into shapes at index 2
    initCylinder([0, 0, 0]);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();
}