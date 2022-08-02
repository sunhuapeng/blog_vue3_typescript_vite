import {Scene,PerspectiveCamera} from 'three'
export default class CreateThree{
    private width: number = 0; // 渲染dom的宽度
    private height: number = 0; // 渲染dom的高度
    public scene: Scene|null = null;
    camera:PerspectiveCamera|null = null
    constructor(tDom: HTMLDivElement){
        this.width = tDom.offsetWidth
        this.height = tDom.offsetHeight
        this.createScene()
    }
    createScene(){
        this.scene = new Scene()
    }
    createCamera(){
        this.camera = new PerspectiveCamera(75, this.width/this.height, 0.1, 1000)
    }
}