/**
 * Takes two vec3 (3 element arrays), combines their values, and returns
 * the result.
 * 
 * @param {vec3} a The first vec3
 * @param {vec3} b The second vec3
 * 
 * @returns The resulting vec3 from a + b
 */
function combineVec3(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }

/**
 * Generate a random integer between the min (inclusive) and max (exclusive).
 * 
 * @param {int} min The minimum the generated number can be (inclusive)
 * @param {int} max The maximum the generated number can be (exclusive)
 * 
 * @returns Random integer between the min (inclusive) and max (exclusive).
 */
function randInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

/**
 * Converts a single hexadecimal color value to its RGB representation.
 * 
 * @param {String} hexColor string representing the hexadecimal color value
 * 
 * @returns vec3 representing [r,g,b] color
 */
function hexToRGB(hexColor) {
    hexColor = hexColor.replace("#","");
    var hexAsInteger = parseInt(hexColor, 16);
    var r = (hexAsInteger >> 16) & 255;
    var g = (hexAsInteger >> 8) & 255;
    var b = hexAsInteger & 255;

    return [r/255,g/255,b/255];
}