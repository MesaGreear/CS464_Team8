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
 * Takes two vec3 (3 element arrays), subtracts their values, and returns
 * the result.
 * 
 * @param {vec3} a The first vec3
 * @param {vec3} b The second vec3
 * 
 * @returns The resulting vec3 from a - b
 */
function subtractVec3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }

/**
 * Takes a vec3 (3 element array), divides it's values, and returns
 * the result.
 * 
 * @param {vec3} arr The vec3
 * @param {vec3} div What to divide arr's values by
 * 
 * @returns The resulting vec3 from arr/div
 */
function divideVec3(arr, div) { return [arr[0]/div, arr[1]/div, arr[2]/div]; }

/**
 * Generate a random integer between the min (inclusive) and max (exclusive).
 * 
 * @param {int} min The minimum the generated number can be (inclusive)
 * @param {int} max The maximum the generated number can be (exclusive)
 * 
 * @returns Random integer between the min (inclusive) and max (exclusive).
 */
function randInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; }