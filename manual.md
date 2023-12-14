# Manual

## Installation / Usage

This application must be run from a server (local or remote) for the 
individual shader files and texture images to load correctly. VSCode's 
Live Server extension is an easy multiplatform option, but you may use 
any other server that you prefer. Afterwards, simply open `final.html` 
in the browser of your choice to run the application.

## Controls

 There are no mouse or keypress controls for this assignment. All of 
 the user interaction/controls are located
 on the UI panel on the right side of the screen. The UI panel is 
 split up into these sections:

 - **General** - Miscellaneous controls that don't fit into other 
 sections, such as altering the geometry or controlling how fast
                 the scene updates
 - **Projection** - Simple projection options such as FOV, projection 
 type, and using a lookAt matrix
 - **Ambient Light** - Controls for the ambient lighting in the scene, 
 which is just its color
 - **Directional Light** - Controls for the directional lighting in 
 the scene, such as its color and the direction the directional
                           lighting points at
 - **Spotlight** - Controls for the spotlight in the scene, such as 
 its color, location in the scene, and direction it illuminates in. 
 Controls are relative to the camera viewpoint. (*Note*: Angle of 
 effect is the angle from the edge of the light cone to the center. 
 Total angle of the entire spotlight beam is actually double the 
 displayed value.)
 - **Point-Light** - Controls for the point-light in the scene, such 
 as its color, location in the scene, and the furthest distance it can 
 illuminate. Controls are relative to the camera viewpoint.

 There is also an info icon at the top left corner of the scene that 
 can be clicked to reveal some basic debug information.