import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

function main() 
{
    // canvas
    const canvas = document.querySelector('#myCanvas');

    // scene
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({canvas});

    // texture loader
    const loader = new THREE.TextureLoader();

    // sphere camera
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128,
        {format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter});
    let sphereCamera = new THREE.CubeCamera(1, 500, cubeRenderTarget); //be used to create more realistic reflections
    sphereCamera.position.set(0, 0, 0);
    scene.add(sphereCamera);

    let sphereMaterial = new THREE.MeshPhongMaterial // for realistic reflective purpose
        ({
            envMap: sphereCamera.renderTarget
        });

    // camera
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50); // fov, aspect, near, far
    camera.position.z = 10;
    
    // create geometry
    function createGeo(geometry, material, x, y, z) 
    {
        const geo = new THREE.Mesh(geometry, material);
        scene.add(geo);

        geo.position.x = x;
        geo.position.y = y;
        geo.position.z = z;

        return geo;
    }

    // sphere sun 
    let sun = new THREE.SphereGeometry(10, 500, 500);

    const spheres =
        [
            createGeo(new THREE.SphereGeometry(3, 500, 500), sphereMaterial, -4, 0, 0),
            createGeo(sun, new THREE.MeshBasicMaterial
                ({ map: loader.load('images/sun.jpg') }), 25, 0, 0)
        ];
    
    // fog
    const color = 'lightgreen';
    scene.fog = new THREE.Fog(color, 1, 30);
    {
        const light = new THREE.DirectionalLight("rgb(255, 255, 255)", 1);
        light.position.set(-2, 4, 6);
        scene.add(light);
    }

    // panorama
    const texture = loader.load
    ('images/hong.jpg', () => 
        {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt.texture;
        }
    );
       
    // controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(-4, 0, 0);
    controls.update();

    function resizeRendererToDisplaySize(renderer) 
    {
        const canvas = renderer.domElement, width = canvas.clientWidth, height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) 
        {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // rotation
    function render(time) 
    {
        time *= 0.0009;
        spheres.forEach((sphere) => 
        {
            const rot = time * 1;
            sphere.rotation.x = rot;
            sphere.rotation.y = rot;
        });

        if (resizeRendererToDisplaySize(renderer)) 
        {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);
        sphereCamera.update(renderer, scene);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();