/** Contains all available shapes that can be drawn */
var shapes = [];

var vertices = [];
var normals = [];
var textures = [];
var indices = [];

/**
 * Generate a square and push its geometry data to vertices, textures, & indices.
 */
function initSquare() {
    vertices.push(
        // Front face
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,

        // Back face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,

        // Top face
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,

        // Bottom face
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,

        // Right face
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,

        // Left face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0
    );

    // TODO: normals?

    textures.push(
        // Front face
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,

        // Back face
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        0.0,
        0.0,

        // Top face
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,

        // Bottom face
        1.0,
        1.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,

        // Right face
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        0.0,
        0.0,

        // Left face
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0
    );

    var offset = vertices.length / 3 - 24;

    indices.push(
        0,
        1,
        2,
        0,
        2,
        3, // Front face
        4,
        5,
        6,
        4,
        6,
        7, // Back face
        8,
        9,
        10,
        8,
        10,
        11, // Top face
        12,
        13,
        14,
        12,
        14,
        15, // Bottom face
        16,
        17,
        18,
        16,
        18,
        19, // Right face
        20,
        21,
        22,
        20,
        22,
        23 // Left face
    );
}

/**
 * Generate a sphere and push its geometry data to vertices, textures, & indices.
 *
 * @param {Int}   quality The quality/smoothness of the sphere
 * @param {Float} radius  The radius of the sphere
 * @param {Float} bump    The 'bumpiness'/'spikiness' of this sphere
 */
function initSphere(quality, radius, bump) {
    // Lotsa help from here (https://stackoverflow.com/questions/47756053/webgl-try-draw-sphere)
    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;
    bump *= radius;

    // vertices
    var b;
    for (j = 0; j <= quality; j++) {
        aj = (j * Math.PI) / quality;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= quality; i++) {
            ai = (i * 2 * Math.PI) / quality;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            // calculate the 'added bumpiness' of this vertex
            b = radius + (i % 2 == 0 && j % 2 == 1 ? bump : -bump);

            vertices.push(
                si * sj * b, // X
                cj * b, // Y
                ci * sj * b
            ); // Z

            normals.push(si * sj * b, cj * b, ci * sj * b);

            textures.push(i / quality, j / quality);
        }
    }

    // indices
    for (j = 0; j < quality; j++) {
        for (i = 0; i < quality; i++) {
            p1 = (j * (quality + 1) + i);
            p2 = p1 + (quality + 1);

            indices.push(p1, p2, p1 + 1);
            indices.push(p1 + 1, p2, p2 + 1);
        }
    }
}

/**
 * Generate a cylinder push its geometry data to vertices, textures, & indices.
 * 
 * @param {Int}   quality The quality/smoothness of the cylinder
 * @param {Float} radius  The radius of the cylinder
 * @param {Float} height  The height of the cylinder
 */
function initCylinder(quality, radius, height) {
    // Lotsa help from here: https://www.songho.ca/opengl/gl_cylinder.html#cylinder

    var sectorStep = (2 * Math.PI) / quality;
    var unitVertices = [];

    for (i = 0; i <= quality; i++) {
        var sectorAngle = i * sectorStep;
        unitVertices.push(Math.cos(sectorAngle));
        unitVertices.push(Math.sin(sectorAngle));
        unitVertices.push(0);
    }

    // vertices & textures
    for (i = 0; i < 2; i++) {
        var h = -height / 2.0 + i * height;
        var t = 1.0 - i;

        for (j = 0, k = 0; j <= quality; j++, k += 3) {
            var ux = unitVertices[k];
            var uy = unitVertices[k + 1];
            var uz = unitVertices[k + 2];

            var cx = ux * radius;
            var cy = uy * radius;
            var cz = h;

            vertices.push(cx, cy, cz);

            normals.push(ux, uy, uz);

            textures.push((j * 1.0) / quality, t);
        }
    }

    // indices
    var k1 = 0;
    var k2 = quality + 1;
    for (i = 0; i < quality; i++, k1++, k2++) {
        indices.push(k1, k1 + 1, k2);
        indices.push(k2, k1 + 1, k2 + 1);
    }
}

/**
 * Empty the vertices, textures, and indices arrays in preparation of new geometry data */
function clearArrs() {
    vertices.length = 0;
    normals.length = 0;
    textures.length = 0;
    indices.length = 0;
}

var SPHERE_QUALITY;
var SPHERE_RADIUS;
var SPHERE_SPIKE;

var CYLINDER_QUALITY;
var CYLINDER_RADIUS;


/**
 * Initialize the scene's geometry data and buffers.
 */
function initGeometry() {
    // empty shapes array if it has anything in it
    shapes.length = 0;

    // initialize a square and insert it into shapes at index 0
    initSquare();
    shapes.push(null);
    // shapes.push(new Shape(vertices, null, textures, indices));

    clearArrs();

    // initialize a sphere (that can change via user input) and insert it into shapes at index 1
    initSphere(SPHERE_QUALITY, SPHERE_RADIUS, SPHERE_SPIKE);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();

    // initialize a cylinder (that can change via user input) and insert it into shapes at index 2
    initCylinder(CYLINDER_QUALITY, CYLINDER_RADIUS, 1.0);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();

    // initialize a spiky sphere and insert it into shapes at index 3
    initSphere(15, 1.0, 0.15);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();

    // initialize a sphere and insert it into shapes at index 4
    initSphere(15, 1.0, 0.0);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();

    // initialize a cylinder and insert it into shapes at index 5
    initCylinder(15, 1.0, 1.0);
    shapes.push(new Shape(vertices, normals, textures, indices));

    clearArrs();
}
