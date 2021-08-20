<html>
    <p class="title" style="display:none;">three.js物理学，物体自然下落
    </p>
</html>
<html>
    <p class="article_id" style="display:none;">6915256491062591502</p>
</html>
<html>
    <p class="target" style="display:none;">threejs</p>
</html>
<html>
    <p class="create_time" style="display:none;">1610083674000</p>
</html>
<html>
    <p class="update_time" style="display:none;">1610083674001</p>
</html>
<html>
    <p class="cover_image" style="display:none;">https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8879ff88a3d0442ca3f780abb6890845~tplv-k3u1fbpfcp-watermark.image</p>
</html>
<html>
    <p class="brief_content" style="display:none;">在之前的文章中写到堆叠游戏，基本上每一步都有写这是之前的实现效果可以在这里体验游戏其中没有做完的无效区域自由下落，将在本文中介绍第一步，引入文件物体自然下落需要物理学的插件，ammo.wasm.js和</p>
</html>


在之前的文章中写到[堆叠游戏](https://juejin.cn/post/6911909496050843655)，
基本上每一步都有写

这是之前的实现效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6da4e5bd36834b0e96fadb4e4c9905f9~tplv-k3u1fbpfcp-watermark.image)

[可以在这里体验游戏](https://sunhuapeng.github.io/#/iframe?url=html%2F%E4%B8%AD%E7%BA%A7%E6%A1%88%E4%BE%8Bhtml%2F%E5%A0%86%E5%8F%A0%E6%B8%B8%E6%88%8F.html)

其中没有做完的无效区域自由下落，将在本文中介绍

#### 第一步，引入文件
物体自然下落需要物理学的插件，`ammo.wasm.js` 和 `AmmoPhysics.js` AmmoPhysics.js是基于ammo.js封装的，

所以需要将两个插件都引入到项目中

``` html
<script src=\"./static/js/ammo.wasm.js\"></script>
```

```typescript
import { AmmoPhysics } from '../utils/AmmoPhysics.js';
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86e908c300f84d148188f12c8a66d443~tplv-k3u1fbpfcp-watermark.image)

源码中`AmmoPhysics`返回的是一个Promise对象

``` typescript
init()

async function init() {
    physics = await AmmoPhysics();
  console.log(physics)
}
```

打印出`physics` 提供两个方法，其中`addmesh`将需要实现物体下落的模型添加进去

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed544c7d5ce2470c9343769bc312d5e9~tplv-k3u1fbpfcp-watermark.image)

#### 第二步：添加底板

```typescript
const floor = new THREE.Mesh(
    new THREE.BoxBufferGeometry(100, 5, 100),
  new THREE.MeshNormalMaterial({ color: 0x111111 })
);
_this.scene.add(floor);
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7772abaa2744fca8f88240da1f3424~tplv-k3u1fbpfcp-watermark.image)

接下来将底板添加到`physics`中

```
physics.addMesh(floor);
```

`addMesh` 接受两个参数，第一个参数是需要施加力的物体，第二个参数是数字，可选，默认为`0`，如果不填，物体将作为底板存在

`addMesh` 部分代码

```javascript
function addMesh( mesh, mass = 0 ) {
  
    const shape = getShape( mesh.geometry );

    if ( shape !== null ) {
  
        if ( mesh.isInstancedMesh ) {
  
            handleInstancedMesh( mesh, mass, shape );

        } else if ( mesh.isMesh ) {
  
            handleMesh( mesh, mass, shape );

        }

    }

}
```

现在将底板的`position.y`设置为100，让底板从高度100的位置降落
```
floor.position.y = 100
physics.addMesh(floor, 1);
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c77f142e443d4e3b83cc985c3653f755~tplv-k3u1fbpfcp-watermark.image)

目前算是实现了某个物体的自由降落，接下来将`floor`恢复，并另创建两个自由落体

```typescript
const material = new THREE.MeshNormalMaterial();

const matrix = new THREE.Matrix4();

const geometryBox = new THREE.BoxBufferGeometry(5, 5, 5);
var boxes = new THREE.InstancedMesh(geometryBox, material, 2);
_this.scene.add(boxes);

for (let i = 0; i < boxes.count; i++) {
  
  matrix.setPosition(Math.random() - 10, (i + 1) * 10, Math.random() - (i * 4));
  boxes.setMatrixAt(i, matrix);
}

physics.addMesh(boxes, 1);
```
创建两个实例化网格，官网上介绍实例化网格可以提升渲染性能

>你可以使用 InstancedMesh 来渲染大量具有相同几何体与材质、但具有不同世界变换的物体。 使用 InstancedMesh 将帮助你减少 draw call 的数量，从而提升你应用程序的整体渲染性能。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8879ff88a3d0442ca3f780abb6890845~tplv-k3u1fbpfcp-watermark.image)

物体自然下落的小例子大概就是这样，接下来需要将自由下落的物体添加到游戏中

在游戏中，`floorGroup`中的每一个物体都将设置为不加力的物体，将所有的无效区域设置为自然下落的物体

#### 嵌入到游戏

##### 底板

在游戏第一次创建底板的时候定义物理学

定义一个`initAmmo`方法用来赋值`AmmoPhysics`方法

然后将底板加入进去

``` typescript 
async initAmmo() {
    this.physics = await AmmoPhysics();
  this.initFloor()
}
```

创建底板的方法，跟改造之前有点区别

``` typescript
initFloor() {
    // 定义物理学插件
  // this.physics = await new AmmoPhysics();
  const w: number = this.size
  const h: number = 50
  const l: number = this.size
  const floorParams = {
      w: w,
    h: h,
    l: l,
    x: w / 2,
    y: h / 2,
    z: l / 2
  }
  this.floorCube = createCube(floorParams);
  // 临时将底板透明度降低0.5 方便观察物体降落
  (this.floorCube.material as THREE.Material).transparent = true;
  (this.floorCube.material as THREE.Material).opacity = 0.5
  // 将第一个底板添加到物理学插件中
  this.floorGroup.add(this.floorCube)
  this.floorGroup.updateMatrix()

  // 创建一个跟底板相同位置信息的实例化网格
  const floor = instancedMesh(this.floorCube)
  this.physics.addMesh(floor)
  console.log(this.physics)
  // 创建一个可降落物体
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 80
  const box = instancedMesh(cube)
  this.floorGroup.add(box)
  // 参数传1 物体将以下落属性进行运动
  this.physics.addMesh(box, 1)
}
```

创建实例化网格的方法

``` typescript
// 创建实体网格
export function instancedMesh(box: any, position?:THREE.Vector3) {
    const size = new THREE.Vector3()
  getSize(box, size)
  const material = new THREE.MeshNormalMaterial();
  // 创建实例化网格
  const geometryBox = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
  var boxes = new THREE.InstancedMesh(geometryBox, material, 1);
  // 定义一个四维矩阵，用来存放物体的位置信息
  const matrix = new THREE.Matrix4();
  // 将位置信息传入到四维矩阵中
  if(position && position instanceof THREE.Vector3) {
      matrix.setPosition(position.clone())
  } else {
      matrix.setPosition(box.position.clone())
  }
  // 将四维矩阵设置到新的实体网格模型中
  boxes.setMatrixAt(0, matrix);
  return boxes
}
```

可以先看一下刚创建的`box`的运动效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fa12cd6c7674244b08897e5b597b2e2~tplv-k3u1fbpfcp-watermark.image)

`box`作为自然降落物体， `floor`作为底板物体不动，当自然降落物体碰撞到底板物体，将进行`物理碰撞`效果，

就像现实中，从比桌子高的位置扔下一个方块，遇到桌子角，将进行碰撞、反转、降落等一系列物理运动

接下来就是要对主角分出的有效区域和无效区域进行操作

##### 有效区域

有效区域的效果和底板的效果是相同的，都不进行运动，所以第一步创建一个与有效区域等同信息的实例化网格

```typescript
// 克隆一个有效区域
const newMesh:any = meshArr[0].clone();

// 临时处理材质为透明
(newMesh.material as THREE.Material).transparent = true;
(newMesh.material as THREE.Material).opacity = 0.5

// 获取主角的中心点作为有效区域底板的位置
const center = new THREE.Vector3()
getCenter(newMesh, center)

const phyMesh = instancedMesh(this.floorCube, center)
// 有效区域不动，第二参数默认不传
this.physics.addMesh(phyMesh)
```

`getCenter` 是封装好的获取元素中心点的方法，新创建的实例化网格将以这个中心点作为`pisition`信息

```typescript 
export function getCenter(mesh:THREE.Object3D, v3: THREE.Vector3) {
    if (v3 instanceof THREE.Vector3) {
      getBox(mesh).getCenter(v3);
  }
}
```

接下来再创建一个可移动方块对新创建的实例化网格进行测试

```typescript
// 获取主角的中心点作为有效区域底板的位置
const center = new THREE.Vector3()
getCenter(newMesh, center)
// console.log(center)

const phyMesh = instancedMesh(newMesh, center.clone())
// this.floorGroup.add(phyMesh)
// 有效区域不动，第二参数默认不传
this.physics.addMesh(phyMesh,1)
// 创建一个测试方块
const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
const newCenter = center.clone()
// 获取有效区域尺寸，将测试方块放置在有效区域边缘
const size = new THREE.Vector3()
getSize(newMesh, size)
newCenter.y = newCenter.y + 15
newCenter.x = newCenter.x + size.x/2
cube.position.copy(newCenter)
cube.updateMatrix ()

// 创建一个实例化网格
const phyCube = instancedMesh(cube)
this.floorGroup.add(phyCube)
// 将测试方块创建的实例化网格作为可移动对象进行测试
this.physics.addMesh(phyCube, 1)
```
测试方块遇到有效区域边缘，碰撞，翻滚，降落，再遇到底板边缘，碰撞，翻滚，降落

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08cb4269a07e4d279844ddc27b39d47a~tplv-k3u1fbpfcp-watermark.image)

有效区域的处理大致就是这样，接下来将处理一下无效区域，作为自由降落的物体

##### 无效区域处理

堆叠层外面的视为无效区域

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/414a53d9024b4395b94c4e3e69ed8072~tplv-k3u1fbpfcp-watermark.image)

```typescript
// 判断无效区域
if (meshArr[1]) {
    // 创建无效区域实体网格
  const newMesh = meshArr[1]

  // 获取无效区域中心点
  const center = new THREE.Vector3()
  getCenter(newMesh, center)

  // 创建无效区域实体化网格
  const phyMesh = instancedMesh(newMesh, center)

  this.invalidGroup.add(phyMesh)
  // 自由落体
  this.physics.addMesh(phyMesh, 1)

}
```

一层的实现效果，可能看不出来效果，如果是多层可以体验到更好的效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/874a6e8d8dbe4f6bb572181fada62bd8~tplv-k3u1fbpfcp-watermark.image)


多层的效果，可能动图比较大，加载比较慢

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed5df53582604d26a9972ac928aa3442~tplv-k3u1fbpfcp-watermark.image)

#### 结束

好啦，堆叠游戏写到这里就可以宣告结束了，可能会有一些bug或者其他问题，有时间慢慢优化吧~

在之前的文章写过其他的步骤

[第一步 基础 初始化游戏](https://juejin.cn/post/6911909496050843655)

[第二步 控制 控制主角移动以及停止](https://juejin.cn/post/6911947391369216013)

[第三步 切割等功能](https://juejin.cn/post/6912306652632842247)

[第四步 结束判定，记分器等](https://juejin.cn/post/6912362707928907790)

[代码](https://github.com/sunhuapeng/stacking-blocks/tree/master)

感兴趣的童鞋可以[体验一下](https://sunhuapeng.github.io/#/iframe?url=html%2F%E4%B8%AD%E7%BA%A7%E6%A1%88%E4%BE%8Bhtml%2F%E5%A0%86%E5%8F%A0%E6%B8%B8%E6%88%8F.html)，欢迎童鞋们在评论区打出你们的分数哦

> 没有bug的程序 不是好程序!!!"
