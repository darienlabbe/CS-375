//---------------------------------------------------------------------------
//
//  --- Cube.js ---
//
//    A simple, encapsulated Cube object

//  All of the parameters of this function are optional, although, it's
//    possible that the WebGL context (i.e., the "gl" parameter) may not
//    be global, so passing that is a good idea.
//
//  Further, the vertex- and fragment-shader ids assume that the HTML "id"
//    attributes for the vertex and fragment shaders are named
//
//      Vertex shader:   "Cube-vertex-shader"
//      Fragment shader: "Cube-fragment-shader"
//
function Cube( gl, vertexShaderId, fragmentShaderId ) {
    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    const vertShdr = vertexShaderId || "Cube-vertex-shader";
    const fragShdr = fragmentShaderId || "Cube-fragment-shader";

    // Initialize the object's shader program from the provided vertex
    //   and fragment shaders.  We make the shader program private to
    //   the object for simplicity's sake.
    //
    const shaderProgram = initShaders( gl, vertShdr, fragShdr );
    if ( shaderProgram < 0 ) {
        alert( "Error: Cube shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return;
    }

    // Initialize arrays for the Cube's vertex positions, indices, and colors
    let positions = [
        -0.5, -0.5, -0.5,   // v0
        -0.5,  0.5, -0.5,   // v1
         0.5, -0.5, -0.5,   // v2
         0.5,  0.5, -0.5,   // v3
         0.5,  0.5,  0.5,   // v4
         0.5, -0.5,  0.5,   // v5
        -0.5, -0.5,  0.5,   // v6
        -0.5,  0.5,  0.5 ]; // v7
    let numComponents = 3;  // (x,y,z)

    indices = [
        0, 1, 2,  2, 1, 3,      // Front
        0, 2, 6,  2, 5, 6,      // Top
        6, 5, 4,  6, 4, 7,      // Back
        4, 3, 7,  7, 3, 1,      // Bottom
        2, 3, 5,  5, 3, 4,      // Right
        1, 0, 7,  0, 6, 7 ];    // Left

    let colors = [
        1.0, 0.0, 0.0, 1.0,    // c1: Red
        1.0, 1.0, 0.0, 1.0,    // c2: Orange
        0.0, 1.0, 1.0, 1.0,    // c3: Light Blue
        1.0, 0.0, 1.0, 1.0,    // c4: Magenta
        0.0, 1.0, 0.0, 1.0,    // c5: Green
        0.0, 0.0, 1.0, 1.0 ];  // c6: Blue
    let numColors = 4;         //(r,g,b,a)

    // Make new Attributes for aPosition and aColor, and create a new indices
    //   using helper.js
    //
    let aPosition = new Attribute(gl, shaderProgram, positions,
        "aPosition", numComponents, gl.FLOAT );
    let aColor = new Attribute(gl, shaderProgram, colors,
        "aColor", numColors, gl.FLOAT);
    indices = new Indices(gl, indices);

    // Make new uniforms for HTML file and give the uniforms default values to
    //   be changed in main.js. Also create set a default value for the motion
    //   variable.
    //
    let MV = new Uniform(gl, shaderProgram, "MV");
    let P = new Uniform(gl, shaderProgram, "P");
    this.P = mat4();
    this.MV = mat4();
    this.time = 0.0;

    // Create a render function that can be called from our main application.
    //   In this case, we're using JavaScript's "closure" feature, which
    //   automatically captures variable values that are necessary for this
    //   routine, so we can be less particular about variables scopes. As
    //   you can see, our "positions", and "indices" variables went out of
    //   scope when the Cube() constructor exited, but their values were
    //   automatically saved so that calls to render() succeed.
    //
    this.render = () => {
        // Enable our shader program
        gl.useProgram( shaderProgram );

        // Update the uniforms
        MV.update(this.MV);
        P.update(this.P);

        // Activate our vertex, enabling the vertex attribute we want data
        //   to be read from, and tell WebGL how to decode that data.
        //   Likewise, enable our index buffer, so we can use it for rendering
        //
        aPosition.enable();
        aColor.enable();
        indices.enable();

        // Draw the cube in its entirety!
        gl.drawElements( gl.TRIANGLES, indices.count, indices.type, 0 );

        // Finally, reset our rendering state so that other objects we
        //   render don't try to use the Cube's data
        //
        aPosition.disable();
        aColor.disable();
        indices.disable();
    };
}
