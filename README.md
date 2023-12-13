# README

* Final (The Internet is a Series of Tubes)
* CS 464
* December 13, 2023
* Team 8 (Mesa Greear & Joshua Thomas)

<img src="exampleImgs/final.gif" alt="sol" width="50%"/>

## INCLUDED FILES:

 * final.html
 * ./src/drawing.js
 * ./src/geometry.js
 * ./src/misc.js
 * ./src/user.js
 * ./src/misc/glMatrix_util.js
 * ./src/misc/lights.js
 * ./src/misc/matrixStack.js
 * ./src/misc/misc_util.js
 * ./src/misc/pipe.js
 * ./src/misc/shape.js
 * ./src/misc/webgl-utils.js
 * ./src/misc/style.css
 * ./shaders/default.frag
 * ./shaders/default.vert
 * ./icons/*.png
 * ./textures/*.png
 * ./exampleImgs/*.gif
 * manual.md
 * README.md

## OVERVIEW:

### Geometry

 In our geometry code, only 3 types of shapes can be created. A square (which is never used because we didn't add in the normals), a sphere, and a cylinder. A
 sphere and cylinder can be initialized with different parameters such as radius and quality and then stored as a custom datatype we created called Shape which
 simply stores the vertex, normal, texture, and index buffers of the shape. When the shape is drawn in our scene, the buffer information is gathered from the
 Shape object.

 To generate the coordinates a pipe will draw in as well as perform other operations necessary to generate an infinitely and randomly moving pipe, a datatype
 called Pipe was created. There's a lot going on in Pipe and I won't get into it all here, but the main feature of a Pipe object is it's queue where new segments
 of the pipe are added to the head and old segments are removed from the bottom once the queue has reached a user determined length. Each index in the queue
 contains information about what shape to draw, it's coordinates, and the direction/axis this segment is moving along. The Pipe object has several methods which
 are used to handle adding new segments and determining how long a pipe section will be.

### Drawing

 When drawing shapes to our scene, a Matrix Stack is used which made drawing shapes at the correct coordinates much easier to accomplish. It also allowed us to
 easily alter how we look at our scene via manually defining angles to rotate the scene by or setting the top of the stack to a lookAt matrix.

 Our actual draw function is fairly simple, taking in a Shape object, texture, projection matrix, and bool representing if the shape should be effected by light.
 The draw function then sets the mvMatrix based on the top of the Matrix Stack, binds the buffers contained in the passed in Shape object, and then draws the
 elements.

### Lighting

## Sources

- [HTML Checkbox](https://www.w3schools.com/howto/howto_css_switch.asp)
- [Sphere Geometry Code](https://stackoverflow.com/questions/47756053/webgl-try-draw-sphere)
- [Cylinder Geometry Code](https://www.songho.ca/opengl/gl_cylinder.html#cylinder)