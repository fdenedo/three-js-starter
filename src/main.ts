import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// Set up the three things every Three.js scene needs
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set up the renderer and append it to the #canvas div on the DOM
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('canvas')!.appendChild(renderer.domElement);

// Set up orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

// Set up window resize callback
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add lights
const color = 0xFFFFFF;
const ambientIntensity = 0.5;
const light = new THREE.AmbientLight(color, ambientIntensity);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(color, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

// Set background colour
scene.background = new THREE.Color(0x303030);

// Create a basic cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
const cube     = new THREE.Mesh(geometry, material);

scene.add(cube);

// Move the camera so it can see the cube
camera.position.set(5, 2, 5);
controls.target.set(0, 0, 0);

// Add AxesHelper to visualise orientation
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// GridHelper
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Add stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// This function is the callback called by the renderer whenever it finishes rendering
// Want to use deltaTime eventually so it is not dependent on frame rate
function animate() {
    const delta = clock.getDelta();
    controls.update(delta);
    renderer.render(scene, camera);

    stats.update();
}
