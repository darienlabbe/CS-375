//Function allows for the initialization and rendering of a cone
function init() {
    //Initializing the canvas and gl
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    //Set NDC workspace color: currently a pale green
    gl.clearColor(0.4, 0.9, 0.4, 1.0);

    //Change the second parameter for number of sides
    cone = new Cone(gl, 20);

    render();
}

//Render function that clears the color buffer and renders a cone
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    cone.render();
}

//init function is only called after page is loaded
window.onload = init;