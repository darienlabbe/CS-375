
"use strict";

var gl;
var ms;

// Planet variables
var sun;
var earth;
var moon;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
   
    // Add your sphere creation and configuration code here
    sun = new Sphere(50, 30);
    earth = new Sphere();
    moon = new Sphere();

    requestAnimationFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    let fovy = (45 * Math.PI) / 180;
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let near = 1;
    let far = 100;

    // Time variables
    sun.time += 0.5;
    earth.time += 0.25;
    moon.time += 0.5;

    // Perspective transformations
    sun.P = perspective(fovy, aspect, near, far);
    earth.P = perspective(fovy, aspect, near, far);
    moon.P = perspective(fovy, aspect, near, far);

    // Matrix Stack
    ms = new MatrixStack();
    let V = translate(0,0,-0.5 * (near + far));
    ms.load(V);

    // Sun
    ms.push();
    ms.scale(sun.radius = 0.05);
    ms.mult(rotateZ(sun.time));
    sun.MV = ms.current();
    sun.render();
    ms.pop();
    // Earth
    ms.push();
    ms.mult(rotateZ(earth.time));
    ms.translate( 0.23, 0.0, 0.0);
    ms.push();
    ms.mult(rotateZ(moon.time));
    ms.scale(earth.radius = 0.012);
    earth.MV = ms.current();
    earth.render();
    ms.pop();
    // Moon
    ms.mult(rotateZ(moon.time));
    ms.translate(0.09, 0.0, 0.0);
    ms.scale(moon.radius = 0.005);
    moon.MV = ms.current();
    moon.render();
    ms.pop();

    // Planet colors
    sun.color = vec4(1.0, 0.8, 0.2, 1.0);       // Sun yellow color
    earth.color = vec4(0.0, 0.7, 1.0, 1.0);     // Earth blue color
    moon.color = vec4(0.7, 0.7, 0.7, 1.0);      // Moon grey color

    requestAnimationFrame(render);
}

window.onload = init;