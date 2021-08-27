import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import {
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

var manager = new THREE.LoadingManager();
manager.addHandler(/\.dds$/i, new DDSLoader());
var loader = new OBJLoader(manager)

let width = window.innerHeight
let height = window.innerHeight

let deerL = null
let deerR = null as any
let dirLight = null as any
// 平行光
let pointLight: any = null

const frustumSize = 45;
let aspect = width / height;
var scene = new THREE.Scene(), // 场景
  camera = new THREE.OrthographicCamera(
    frustumSize * aspect / - 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / - 2,
    -1000, 1000),
  renderer = new THREE.WebGLRenderer({ // 渲染器
    antialias: true, //抗锯齿
  }),
  container = null as any, // dom容器
  controls: any,
  lightGroup = new THREE.Group(),
  elementGroup = new THREE.Group(),
  elementLGroup = new THREE.Group(),
  moveY = 0 as number,
  moveX = 0 as number,
  labelRenderer = null as any
renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;



var sceneL = new THREE.Scene()

scene.add(lightGroup)
scene.add(elementGroup)
sceneL.add(elementLGroup)

const animate = () => {
  requestAnimationFrame(animate);
}

// 屏幕尺寸变化
const onWindowResize = () => {
  width = window.innerHeight;
  height = window.innerHeight;
  aspect = width / height;
  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;
  camera.updateProjectionMatrix();
  controls.update(); //更新控制器
  renderer.setSize(window.innerHeight, window.innerHeight);
}
// 地面
const initPlane = function () {
  const geometry = new THREE.PlaneGeometry(300, 150);
  const material = new THREE.MeshLambertMaterial({ color: 0xdcdcdc, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(Math.PI * 0.5)
  plane.receiveShadow = true
  elementGroup.add(plane)

  const material1 = new THREE.MeshBasicMaterial({ color: 0xdcdcdc, side: THREE.DoubleSide });
  const Lplane = new THREE.Mesh(geometry, material1);
  Lplane.rotateX(Math.PI * 0.5)

  elementLGroup.add(Lplane)
}
/**
 * 初始化灯光
 */
const initLight = function () {
  const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
  lightGroup.add(light);

  // 移动点光源
  pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
  pointLight.position.set(50, 30, 50);
  lightGroup.add(pointLight);

  if(dirLight) return
  dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  // dirLight.color = new THREE.Color("rgb(255, 255, 255)");
  dirLight.position.set(- 1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  lightGroup.add(dirLight);

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = - 0.001;

  // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  // lightGroup.add(dirLightHelper);

}

// 渲染
const render = function () {
  const time = Date.now() * 0.0005;
  controls.update(); //更新控制器

  // 移动灯光
  if (dirLight) {

    dirLight.position.x = Math.cos(time * 0.1) * 15;
    dirLight.position.z = Math.sin(time * 0.1) * 15;

    pointLight.position.x = Math.cos(time * 0.1) * 15;
    pointLight.position.z = Math.sin(time * 0.1) * 15;
  }

  camera.position.x = Math.abs(Math.cos(time * 0.2)) * 2
  camera.updateProjectionMatrix()

  // 移动透视场景
  if (deerR && sceneL) {
    renderer.setScissor(0, 0, width, height);
    renderer.render(scene, camera);
    const w = width / 3

    renderer.setScissor(moveX - w / 2, height - moveY - w / 2, w, w);
    renderer.render(sceneL, camera);

    labelRenderer.render(sceneL, camera);
  }
}

// 初始化2d渲染器
const render2d = function () {
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);
}

// 创建基础的场景
const ready = function (id: string) {
  container = document.getElementById(id) as HTMLElement
  container.appendChild(renderer.domElement)

  scene.background = new THREE.Color(0xcfdedb)
  sceneL.background = new THREE.Color(0xcfdedb)

  initLight()

  scene.position.setY(-20)
  sceneL.position.setY(-20)

  renderer.setPixelRatio(window.devicePixelRatio); //设置渲染的比例
  renderer.setSize(width, window.innerHeight); //设置渲染的尺寸
  renderer.setScissorTest(true);
  renderer.setAnimationLoop(render);

  camera.position.set(0, 6, 30)
  const canvasDom = document.querySelector("#" + id + " canvas") as HTMLElement
  controls = new OrbitControls(
    camera,
    canvasDom
  );
  controls.enabled = false

  // var axesHelper = new THREE.AxesHelper(250);
  // scene.add(axesHelper);
  render2d()
  animate()
}

// 模型加载中
const onProgress = function (xhr: any) {
}

// 模型加载错误 
const onError = function (error: any, rejected: any) {
  console.log('错误', error)
  rejected(error)
}

// 加载模型
const loadModel = function (name: string): any {
  return new Promise((resolve, rejected) => {
    loader.setPath('./model/')
      .load(
        name + ".obj",
        function (object) {
          const obj = object.children[0]
          resolve(obj)
        },
        onProgress,
        (error) => onError(error, rejected)
      );
  })
}

// 添加场景内的元素
const pushElement = async function () {
  initPlane()
  await deer()
  await cloud()
  await treeLeaves()
  elementGroup.traverse(ele => {
    if (ele.type !== 'Group') {
      ele.castShadow = true
      ele.receiveShadow = true
    }
  })
}

// 加载树和树叶
const treeLeaves = async function () {
  // 第一棵树
  const tree1 = await loadModel('TreeNoLeavesBig')
  tree1.material.color = new THREE.Color(0x672a00)
  tree1.position.set(15, 0, -15)
  tree1.scale.set(3, 3, 3)
  elementGroup.add(tree1)

  const tree1L = tree1.clone()
  tree1L.material = new THREE.MeshBasicMaterial({
    color: 0x672a00,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(tree1L)
  // 第二棵树
  const tree2 = await loadModel('TreeNoLeavesSmall')
  tree2.material.color = new THREE.Color(0x672a00)
  tree2.position.set(-18, 0, -30)
  tree2.scale.set(3, 3, 3)
  elementGroup.add(tree2)

  const tree2L = tree2.clone()
  tree2L.material = new THREE.MeshBasicMaterial({
    color: 0x672a00,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(tree2L)
  // 第三棵树
  const tree3 = await loadModel('TreeNoLeavesBig')
  tree3.material.color = new THREE.Color(0x672a00)
  tree3.position.set(5, 0, -50)
  tree3.scale.set(2, 2, 2)
  elementGroup.add(tree3)

  const tree3L = tree3.clone()
  tree3L.material = new THREE.MeshBasicMaterial({
    color: 0x672a00,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(tree3L)
  // 第四棵树
  const tree4 = await loadModel('TreeNoLeavesBig')
  tree4.material.color = new THREE.Color(0x672a00)
  tree4.position.set(-7, 0, -35)
  tree4.scale.set(3, 3, 3)
  elementGroup.add(tree4)

  const tree4L = tree4.clone()
  tree4L.material = new THREE.MeshBasicMaterial({
    color: 0x672a00,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(tree4L)
  // 第四棵树的叶子
  const bush1 = await loadModel('SmallBush')
  bush1.material.color = new THREE.Color(0x1dbb4e)
  bush1.position.set(-8, 10, -35)
  bush1.scale.set(6, 6, 5)
  elementGroup.add(bush1)

  const bush1L = bush1.clone()
  bush1L.material = new THREE.MeshBasicMaterial({
    color: 0x1dbb4e,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(bush1L)
  // 第三棵树的叶子
  const bush2 = await loadModel('BigBush')
  bush2.material.color = new THREE.Color(0x1dbb4e)
  bush2.position.set(5, 6.5, -50)
  bush2.scale.set(3, 3, 3)
  elementGroup.add(bush2)

  const bush2L = bush2.clone()
  bush2L.material = new THREE.MeshBasicMaterial({
    color: 0x1dbb4e,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(bush2L)
  // 草丛
  const bush3 = await loadModel('BigBush')
  bush3.material.color = new THREE.Color(0x1dbb4e)
  bush3.position.set(-8, 0, 5)
  bush3.rotateY(Math.PI)

  bush3.scale.set(3, 3, 3)
  elementGroup.add(bush3)

  const bush3L = bush3.clone()
  bush3L.material = new THREE.MeshBasicMaterial({
    color: 0x1dbb4e,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(bush3L)
  // 草丛
  const bush4 = await loadModel('SmallBush')
  bush4.material.color = new THREE.Color(0x1dbb4e)
  bush4.position.set(6, 0, 5)
  bush4.rotateY(Math.PI)
  bush4.scale.set(3, 3, 3)
  elementGroup.add(bush4)

  const bush4L = bush4.clone()
  bush4L.material = new THREE.MeshBasicMaterial({
    color: 0x1dbb4e,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(bush4L)
}

// 加载云彩
const cloud = async function () {
  const cloud1 = await loadModel('Cloud1')
  cloud1.material.color = new THREE.Color(0xffffff)
  cloud1.position.set(15, 26, -10)
  cloud1.scale.set(3, 3, 3)
  elementGroup.add(cloud1)

  const cloud1L = cloud1.clone()
  cloud1L.material = new THREE.MeshBasicMaterial({
    color: 0xffffff,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(cloud1L)

  const cloud2 = await loadModel('Cloud2')
  cloud2.material.color = new THREE.Color(0xffffff)
  cloud2.position.set(0, 35, 0)
  cloud2.scale.set(3, 3, 3)
  elementGroup.add(cloud2)

  const cloud2L = cloud2.clone()
  cloud2L.material = new THREE.MeshBasicMaterial({
    color: 0xffffff,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  elementLGroup.add(cloud2L)

  const cloud3 = await loadModel('Cloud3')
  cloud3.material.color = new THREE.Color(0xffffff)
  cloud3.position.set(-20, 28, 0)
  cloud3.scale.set(2.5, 2.5, 2.5)
  elementGroup.add(cloud3)

  const cloud3L = cloud3.clone()
  cloud3L.material = new THREE.MeshBasicMaterial({
    color: 0xffffff,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });
  // cloud
  elementLGroup.add(cloud3L)
}

// 加载麋鹿
const deer = async function () {
  deerL = await loadModel('deer')
  deerL.material = new THREE.MeshPhongMaterial({
    color: 0xe9d8c8
  })
  deerL.position.setZ(-6)
  // deerL.position.setY(-2)
  deerL.scale.set(0.6, 0.6, 0.6)
  elementGroup.add(deerL)
  deerR = deerL.clone()
  deerR.material = new THREE.MeshBasicMaterial({
    color: 0x000000,   //颜色
    wireframe: true,  //是否只显示网格
    transparent: true,
    opacity: 0.2,
  });;
  elementLGroup.add(deerR)
}

// 鼠标移动事件
const mouseMove = function (event: any) {
  const y = event.pageY
  const x = event.pageX - ((window.innerWidth - width) / 2)
  moveX = x
  moveY = y
}

const init = async function (id: string) {
  ready(id)
  await pushElement()

  window.removeEventListener("mousemove", mouseMove)
  window.removeEventListener("resize", onWindowResize)

  window.addEventListener("mousemove", mouseMove, false);
  window.addEventListener("resize", onWindowResize, false);
}
export default init