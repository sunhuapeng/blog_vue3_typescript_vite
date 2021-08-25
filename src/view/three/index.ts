import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
var loader  = new GLTFLoader()
loader.setDRACOLoader(new DRACOLoader());

let width = window.innerWidth
let height = window.innerHeight
const frustumSize = 45;
let aspect = width / height;
var scene = new THREE.Scene(), // 场景
  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / - 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / - 2,
    -1000, 1000),
  axesHelper = null,
  renderer = new THREE.WebGLRenderer({ // 渲染器
    antialias: true, //抗锯齿
  }),
  container = null, // dom容器
  controls: any


const animate = () => {
  requestAnimationFrame(animate);
  controls.update(); //更新控制器
  renderer.render(scene, camera);
}

const onWindowResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  aspect = width / height;
  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;
  camera.updateProjectionMatrix();
  controls.update(); //更新控制器
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const ready = function (id: string) {
  container = document.getElementById(id) as HTMLElement
  container.appendChild(renderer.domElement)

  scene.background = new THREE.Color(0xffffff)

  scene.position.setY(-20)

  renderer.setPixelRatio(window.devicePixelRatio); //设置渲染的比例
  renderer.setSize(width, window.innerHeight); //设置渲染的尺寸

  camera.position.set(10, 0, 10)
  const canvasDom = document.querySelector("#" + id + " canvas") as HTMLElement
  controls = new OrbitControls(
    camera,
    canvasDom
  );
  axesHelper = new THREE.AxesHelper(250);
  scene.add(axesHelper);
  animate()
}
export function init(id: string) {
  ready(id)
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  // loader.load('../../../public/model/car.glb', (glb)=>{
  //   console.log(glb)
  // })
  window.addEventListener("resize", onWindowResize, false);
}