import { createSphereGeometry, createSprite } from '../../utils/createMesh'

import { scene, renderer, camera, rendAnimate, width, height } from '../../utils/createThree'

import { Vector3, Sprite, Group, Vector2, ShaderMaterial, Object3D } from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
let lightPoints: Vector3[] = []
let sprite: Sprite | null = null
export const spriteGroup: Group = new Group()

export const drawLight = () => {
    getPoints()
    sprite = createSprite()
    formatSprite()
    const params = createComposer()

    rendAnimate(params)

}
const getPoints = () => {
    // const sphereGeometry = createSphereGeometry();

    // const { array, count, itemSize } = sphereGeometry?.geometry?.attributes?.position;
    // for (let i = 0; i < count; i++) {
    //     const arr = []
    //     for (let j = 0; j < itemSize; j++) {
    //         arr.push(array[i * itemSize + j])
    //     }
    //     const v3 = new Vector3().fromArray(arr);
    //     // lightPoints.push(v3)
    // }
    const limit = 40
    for(let i=0;i<1600;i++) {
        const x=  getRandomInt(-limit,limit)
        const y=  getRandomInt(-limit,limit)
        const z = getRandomInt(-limit,limit)
        const v3 = new Vector3(x,y,z)
        lightPoints.push(v3)
    }
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const changeSize = (obj: Object3D | undefined) => {
    setInterval(() => {
        const num: number = getRandomInt(1, 5)
        obj && obj.scale.set(num / 10, num / 10, num / 10)
    }, getRandomInt(800,1600))
}

const formatSprite = () => {
    console.log('spriteGroup',spriteGroup)
    scene?.add(spriteGroup)
    for (let i = 0; i < lightPoints.length; i++) {
        const copySprite = sprite?.clone();
        changeSize(copySprite)
        copySprite?.position.copy(lightPoints[i])
        copySprite && spriteGroup.add(copySprite)
    }
    // const interval = setInterval(scene)
}


export interface rendeAnimite {
    finalComposer: EffectComposer,
    bloomComposer: EffectComposer
}
const createComposer = (): rendeAnimite | undefined => {
    if (renderer && scene && camera) {
        const renderScene = new RenderPass(scene, camera);
        const params = {
            exposure: 1,
            bloomStrength: 5,
            bloomThreshold: 0,
            bloomRadius: 0,
            scene: 'Scene with Glow'
        };
        const bloomPass = new UnrealBloomPass(new Vector2(width, height), 1.5, 0.4, 0.85);
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;

        const bloomComposer = new EffectComposer(renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const finalPass = new ShaderPass(
            new ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                varying vec2 vUv;

                void main() {

                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

                }
                `,
                fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {

                    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

                }
                `,
                defines: {}
            }), 'baseTexture'
        );
        finalPass.needsSwap = true;

        const finalComposer = new EffectComposer(renderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);

        return {
            finalComposer,
            bloomComposer
        }
    }
}