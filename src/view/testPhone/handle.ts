import { createTorusKnot } from '../../utils/createMesh'
import { scene, rendAnimate, camera, rotateParamsInter } from '../../utils/createThree'
import { Color, PointLight, Mesh, Euler, Vector3 } from 'three'

let torusKnot: Mesh | null = null
export const HandleCube = () => {
    torusKnot = createTorusKnot()
    if (scene && camera) {
        scene.background = new Color('#fff')
        scene.add(torusKnot)
        camera.position.set(60, 0, 0)
    }
    createLight()
    rendAnimate()
}
export const changeCube = (event: DeviceOrientationEvent) => {
    if (torusKnot) {
        console.log('_event?.gamma', event?.gamma);
        const rotateParams: rotateParamsInter = {
            torusKnot,
            event
        }
        rendAnimate(undefined, rotateParams)

    }

}
const createLight = () => {
    const light = new PointLight(0xffffff, 1, 100);
    light.position.set(20, 40, 30);
    scene && scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 100);
    light2.position.set(-20, -40, -30);
    scene && scene.add(light);
}