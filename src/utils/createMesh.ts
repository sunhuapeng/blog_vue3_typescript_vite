import { SphereGeometry, BoxGeometry, TorusKnotGeometry,MeshNormalMaterial, MeshBasicMaterial, MeshLambertMaterial, Mesh, TextureLoader, SpriteMaterial, Sprite } from 'three'
import spriteIcon from '@/assets/images/spark1.png'

export const createSphereGeometry = () => {
    const geometry: SphereGeometry = new SphereGeometry(15, 32, 32);
    const material: MeshBasicMaterial = new MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true,
    });
    const sphere: Mesh = new Mesh(geometry, material);
    return sphere
}


export const createSprite = () => {
    const map = new TextureLoader().load(spriteIcon);
    const material: SpriteMaterial = new SpriteMaterial({ map: map });
    const sprite: Sprite = new Sprite(material);
    sprite.scale.set(0.2, 0.2, 0.2)

    return sprite
}

export const createTorusKnot = (): Mesh => {
    const geometry = new TorusKnotGeometry(6, 2, 200, 32).toNonIndexed();

    // const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshNormalMaterial();
    const TorusKnot: Mesh = new Mesh(geometry, material);
    return TorusKnot
}