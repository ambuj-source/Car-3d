import * as THREE from "https://unpkg.com/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.180.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const host=document.getElementById("viewer");
const status=document.getElementById("status");
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x111111);

const camera=new THREE.PerspectiveCamera(45,1,.01,1000);
camera.position.set(3,1.8,4);

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.setSize(host.clientWidth,host.clientHeight);
host.appendChild(renderer.domElement);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.target.set(0,0,0);
controls.minDistance=.1;
controls.maxDistance=30;

scene.add(new THREE.HemisphereLight(0xffffff,0x222222,2.4));
const key=new THREE.DirectionalLight(0xffffff,3.2);
key.position.set(5,8,5);
scene.add(key);

function resize(){
  const w=host.clientWidth,h=host.clientHeight;
  camera.aspect=w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w,h);
}
addEventListener("resize",resize);

let startPos=camera.position.clone(), startTarget=controls.target.clone();

function fit(obj){
  const box=new THREE.Box3().setFromObject(obj);
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const max=Math.max(size.x,size.y,size.z);
  const dist=max/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));
  camera.position.copy(center).add(new THREE.Vector3(dist*1.0,dist*.45,dist*1.15));
  controls.target.copy(center);
  controls.update();
  startPos.copy(camera.position);
  startTarget.copy(controls.target);
}

new GLTFLoader().load(
  "./models/MG-EV-Car.glb",
  gltf=>{
    scene.add(gltf.scene);
    fit(gltf.scene);
    status.textContent="Ready — drag to rotate";
  },
  xhr=>{
    status.textContent=xhr.total ? `Loading ${Math.round(xhr.loaded/xhr.total*100)}%` : "Loading 3D model…";
  },
  err=>{
    console.error(err);
    status.textContent="Model failed to load";
  }
);

document.getElementById("reset").onclick=()=>{
  camera.position.copy(startPos);
  controls.target.copy(startTarget);
  controls.update();
};

function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}
animate();
