//init function is only called after page is loaded
window.onload = init;

//Function allows for the initialization and rendering of a cube
function init() {
    //Initializing the canvas and gl
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    //Set NDC color to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    cube = new Cube(gl);

    requestAnimationFrame(render);
}

//Render function that clears the color buffer and renders a cube
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Update transforms and objects with updated motion variables
    let fovy = (45 * Math.PI) / 180; // in radians
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let near = 1;
    let far = 100;
    cube.time += 0.5;
    let rotX = rotateX(cube.time);
    let rotY = rotateY(cube.time);
    let rotZ = rotateZ(cube.time);
    let V = translate(0,0,-0.5 * (near + far));
    let S = scalem(0.35,0.35,0.35);

    //Set transforms and render
    cube.P = perspective(fovy, aspect, near, far);
    cube.MV = mult(mult(mult(mult(V, rotX), rotY), rotZ), S);

    cube.render();
    requestAnimationFrame(render);
}
