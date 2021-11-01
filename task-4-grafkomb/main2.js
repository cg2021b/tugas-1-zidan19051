import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';

function init() {
  // canvas
  const canvas = document.querySelector('#meCanvas');

  // scene
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  scene.background = new THREE.Color(0xdddddd);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
  camera.rotation.y = 45 / 180 * Math.PI;
  camera.position.x = 800;
  camera.position.y = 100;
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  hlight = new THREE.AmbientLight(0x404040, 100);
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 100);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  light = new THREE.PointLight(0xc4c4c4, 10);
  light.position.set(0, 300, 500);
  scene.add(light);

  light2 = new THREE.PointLight(0xc4c4c4, 10);
  light2.position.set(500, 100, 0);
  scene.add(light2);

  light3 = new THREE.PointLight(0xc4c4c4, 10);
  light3.position.set(0, 100, -500);
  scene.add(light3);

  light4 = new THREE.PointLight(0xc4c4c4, 10);
  light4.position.set(-500, 300, 500);
  scene.add(light4);

  let loader = new THREE.GLTFLoader();
  loader.load('objects/scene.gltf', function (gltf) {
    car = gltf.scene.children[0];
    car.scale.set(0.5, 0.5, 0.5);
    scene.add(gltf.scene);
    animate();
  });

  let controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', renderer);

  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}
init();

