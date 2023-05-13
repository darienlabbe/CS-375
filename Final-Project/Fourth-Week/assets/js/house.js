/*****************************************************************************/
/* Website: A House Project                                                  */
/* Last Updated: 17 May 2023                                                 */
/* File Name: house.js                                                       */
/*                                                                           */
/* Music Credit:                                                             */
/*     Music from #Uppbeat (free for Creators!):                             */
/*     https://uppbeat.io/t/avbe/night-in-kyoto                              */
/*     License code: A9P4NDGGPDFE8WDK                                        */
/*****************************************************************************/

//Importers
import * as THREE from 'three';
import { PointerLockControls } from "three/addons/controls/PointerLockControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { RGBELoader } from "three/addons/loaders/RGBELoader";

// Setup Variables: Movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Setup Variables: Camera
const fov = 75;
const aspect = window.innerWidth/ window.innerHeight;
const near = 0.1;
const far = 1000;

// Initialize Camera, Scene, and renderer
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();
camera.position.set(10,12,20);

// Loading Screen
const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');
instructions.style.display = 'none';
blocker.style.display = 'none';

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');
loadingManager.onProgress = function (url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');
loadingManager.onLoad = function () {
    progressBarContainer.style.display = 'none';
    blocker.style.display = 'block';
    instructions.style.display = '';
}

// HDRI
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

var rgbeLoader = new RGBELoader(loadingManager);
rgbeLoader.load('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/img/sunrise4k.hdr', function (hdri) {
    hdri.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = hdri;
    scene.environment = hdri;
});

// Auto Window Resize
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Create World Lights
const hemiLight = new THREE.HemisphereLight(0xf7d6a1, 0xf7d6a1, 1.0);
hemiLight.position.set(80, 14, 58);
hemiLight.castShadow = true;
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xf7d6a1, 1.0, 50);
dirLight.position.set(80, 14, 58);
dirLight.castShadow = true;
scene.add(dirLight);

// Background Music
const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);
audioLoader.load('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/music/music.mp3', function(buffer) {
   backgroundSound.setBuffer(buffer);
   backgroundSound.setLoop(true);
   backgroundSound.setVolume(0.06);
});

// Controls and Movement
const controls = new PointerLockControls(camera, renderer.domElement);

instructions.addEventListener('click', function () {
    controls.lock();
});

controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
    backgroundSound.play();
});

controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
    backgroundSound.pause();
});

scene.add(controls.getObject());

const onKeyDown = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Low Poly Grass
const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(500, 500),
    new THREE.MeshPhongMaterial({color: 0xDAF7A6, depthWrite: false}));
groundMesh.rotation.x = - Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// House
const home = new GLTFLoader(loadingManager);
home.load ('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/models/House.gltf',
    function(gltf) {
        gltf.scene.scale.multiplyScalar(8);
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);

// Glass, Floor, and Plants
const ground = new GLTFLoader(loadingManager);
ground.load ('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/models/GlassFloorPlants.gltf',
    function(gltf) {
        gltf.scene.scale.multiplyScalar(8);
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);

// Couches and Living Room
const couch = new GLTFLoader(loadingManager);
couch.load ('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/models/Couches.gltf',
    function(gltf) {
        gltf.scene.scale.multiplyScalar(8);
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);

// Dinning Table
const table = new GLTFLoader(loadingManager);
table.load ('https://blue.cs.sonoma.edu/~dlabbe/Portfolio/assets/models/Table.gltf',
    function(gltf) {
        gltf.scene.scale.multiplyScalar(8);
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log('An error happened');
    }
);

// Main Render Loop
var renderLoop = function () {
    requestAnimationFrame(renderLoop);

    const time = performance.now();

    if (controls.isLocked === true) {
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // for consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);
    }
    prevTime = time;

    renderer.render(scene, camera);
};

renderLoop();
