import { Scene, PerspectiveCamera, WebGLRenderer, Color, Object3D, ReinhardToneMapping, AxesHelper, BoxGeometry, MeshBasicMaterial, Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { composer } from './drawLight'
import { rendeAnimite, spriteGroup } from './drawLight'
export let width: number = 0; // 渲染dom的宽度
export let height: number = 0; // 渲染dom的高度
let tDom: HTMLDivElement | null = null;
export let scene: Scene | null = null;
export let renderer: WebGLRenderer | null = null
export let camera: PerspectiveCamera | null = null
export let controls: OrbitControls | null = null

export const create = (dom: HTMLDivElement) => {
    tDom = dom
    width = dom.offsetWidth
    height = dom.offsetHeight
    createScene()
    createCamera()
    createRender()
    // createAxesHelper()
    createControls()
}

const createScene = () => {
    scene = new Scene()
    scene.background = new Color('#000')
}
const createCamera = () => {
    camera = new PerspectiveCamera(45, width / height, 1, 1000)
    camera.position.z = 40;
    camera.position.y = 10;
    if (scene) scene.add(camera)
}
const createRender = () => {
    const render = new WebGLRenderer();
    render.setSize(width, height);
    render.toneMapping = ReinhardToneMapping;
    if (tDom) {
        tDom.appendChild(render.domElement);
        renderer = render
    }
}
const createAxesHelper = () => {
    const axesHelper = new AxesHelper(50);

    if (scene) {
        scene.add(axesHelper);
    }
}
// 控制器
const createControls = () => {
    if (camera && renderer && renderer?.domElement)
        controls = new OrbitControls(camera, renderer?.domElement);
}

let finalComposer: rendeAnimite['finalComposer'] | null = null
let bloomComposer: rendeAnimite['bloomComposer'] | null = null
export const rendAnimate = (params?: rendeAnimite | undefined) => {
    if (params) {
        const { finalComposer: f, bloomComposer: b } = params
        finalComposer = f
        bloomComposer = b
    }
    animate()
}
export const animate = () => {
    requestAnimationFrame(render);
    if (controls) {
        controls.update();
    }
}

const render = () => {
    animate();
    const time = Date.now() * 0.00005;
    spriteGroup&&spriteGroup?.rotation.set(0,Math.cos(time * 0.1) * 15,0)
    if (finalComposer) {
        finalComposer.render()
    }
    if (bloomComposer) {
        bloomComposer.render()
    }
    if (renderer && scene && camera) {
        camera.updateProjectionMatrix();
        // renderer.render(scene, camera);
    }

}