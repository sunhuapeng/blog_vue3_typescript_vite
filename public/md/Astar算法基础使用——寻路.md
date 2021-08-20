<html>
    <p class="title" style="display:none;">Astar算法基础使用——寻路
    </p>
</html>
<html>
    <p class="article_id" style="display:none;">69635328544205701431</p>
</html>
<html>
    <p class="target" style="display:none;">算法</p>
</html>
<html>
    <p class="create_time" style="display:none;">1621323840000</p>
</html>
<html>
    <p class="update_time" style="display:none;">1621323840006</p>
</html>
<html>
    <p class="cover_image" style="display:none;">https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/126aa081f89d494dbc4ed5faee64b3c5~tplv-k3u1fbpfcp-watermark.image</p>
</html>
<html>
    <p class="brief_content" style="display:none;">ASTAR的应用非常广泛，后续要将结合前端识图技术根据具体的地图去识别可行走路线，从而分析运动轨迹等功能</p>
</html>

#### 技术栈
- html
- javascript
- css
- astar.js

#### 准备工作

文件目录结构

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67b92e9d33684cccbd0764a8cbcaab0e~tplv-k3u1fbpfcp-watermark.image)

##### 第一步先用js循环绘制出 10*10的方格


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2bb70f3918a4b2d94e8306c3a37d32a~tplv-k3u1fbpfcp-watermark.image)

``` javascript
// 初始化地图
let w = h = 40
function createMap () {
    const mapDom = document.querySelector(\"#map\")
  for (let i = 0; i < 10; i++) {
      var ul = document.createElement('ul');
    mapDom.appendChild(ul)
    for (let j = 0; j < 10; j++) {
        var li = document.createElement('li');
      ul.appendChild(li)
      li.innerHTML = i + ',' + j
      li.style.left = i * w + 'px'
      li.style.top = j * h + 'px'
    }
  }
}
createMap()
```
##### 设置随机可行走点
每一个方格都有自己的坐标点，既然要做一个寻路的功能，那就需要一下几个元素，1.起点，2.终点，3.可行走的点，起点可以标注为(0,0)，终点可以标注为(9,9)，中间随机分布一些可行走的点，那么将上面的循环改造一下，要得出一个二维数组，由0，1组成，1为可行走的位置，0为不可行走的位置，用不同的颜色标注，每一个1对应猛男色的方块，每个0对应空白方块，万丈深渊

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb8070fccf93423195957adf07edd25b~tplv-k3u1fbpfcp-watermark.image)
(后补的一张图)

这时候 循环被改造为这样
``` javascript
// 初始化地图
let w = h = 40
const mapArr = []
function createMap () {
    // 获取地图容器
  const mapDom = document.querySelector(\"#map\")
  // 第一层循环
  for (let i = 0; i < 10; i++) {
      let arr = []
    // 将第一层循环的数组加入到map数组中
    mapArr.push(arr)
    // 创建ul
    var ul = document.createElement('ul');
    ul.style.display = 'flex'
    mapDom.appendChild(ul)
    // 第二层循环
    for (let j = 0; j < 10; j++) {
        var li = document.createElement('li');
      const num = getRandom(1, 6)
      if (num > 2) {
          arr.push(1)
        li.style.background = '#ffd9cd'
      } else {
          arr.push(0)
      }
      // 起点和终点始终为可行走
      if(i===0&&j===0 || i===9&&j===9) {
          mapArr[i][j] = 1
        li.style.background = '#ffd9cd'
      }
      ul.appendChild(li)
      li.style.left = j * w + 'px'
      li.style.top = i * h + 'px'
      // 设置一个坐标属性，方便之后查找
      li.setAttribute('coordinate', i + ',' + j)
    }
  }
}
// 生成两个整数之间的随机整数
function getRandom (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
createMap()
```

如果手动标记可行走路线，将粉色方块用线连起来


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5315e930ba2e4ed9bc761b9423f2651f~tplv-k3u1fbpfcp-watermark.image)

具体案例 [迷宫游戏](https://sunhuapeng.github.io/#/gamemaze)的充值VIP 

现在我们有了一个二维数组，里面有一堆可行走的点，还有一个起点(0,0)，终点(9,9)，那现在要做的就是引入`astar` 算法

``` html
<script src=\"./js/astar.js\"></script>
```

#### 使用算法工具
稍微看一下astar源码


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e465a408bc3745ff816f294693269049~tplv-k3u1fbpfcp-watermark.image)

`gridIn`字段为二维数组字段，`diagonal`选项确定是否可走对角线 `this.diagonal = !!options.diagonal;` 不填为false

先调用一下Graph方法

``` javascript
// 计算路径 astar算法
function astarCreate (star, end, graph) {
    var maps = new Graph(graph);
  console.log(maps)
}
```
``` javascript
astarCreate([0,0], [9,9], mapArr)
```

打印出来的maps：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62013516fb3b4ae1a4fcdf30eb6b8f98~tplv-k3u1fbpfcp-watermark.image)

grid输出的是二维GridNode节点，nodes输出的是平铺的节点

接下来用到`search`方法


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd7fee8cdcf94e40b83a71680324c3f9~tplv-k3u1fbpfcp-watermark.image)

通过起点终点和刚才`new graph`返回的gridnode节点，计算出可行走路线，如果指定没返回，则没有从起点到终点的路径

``` javascript
// 计算路径 astar算法
function astarCreate (star, end, graph) {
    var maps = new Graph(graph);
  var starPosition = maps.grid[star[0]][star[1]];
  var endPosition = maps.grid[end[0]][end[1]];
  var result = astar.search(maps, starPosition, endPosition);
  console.log('result', result)
}
```

这是没有可到路线的情况


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca901a064daf42d4acfad58a42d34efe~tplv-k3u1fbpfcp-watermark.image)

因为对角线的属性没设置为`true`


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b49e09078de4bde93830560c122b25d~tplv-k3u1fbpfcp-watermark.image)

`result`有值 说明有可行走路线，画的可能不是返回的值

#### 将可行走点标记出来

``` javascript
targDom(result)

function targDom(result){
    for(let i=0; i<result.length; i++) {
      const x = result[i].x
    const y = result[i].y
    const coordinate = x + ',' + y
    console.log(coordinate)
  }
}

```


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35309084b04b4c2e9da8728c5adaf7e4~tplv-k3u1fbpfcp-watermark.image)

#### 让元素动起来

```js
function targDom (result) {
    for (let i = 0; i < result.length - 1; i++) {
      const x = result[i].x
    const y = result[i].y
    const coordinate = x + ',' + y
    // 通过之前设置的coordinate属性寻找具体的dom
    const dom = document.querySelector(`[coordinate^='${coordinate}']`)
    if (dom) {
        dom.style.background = '#FFEB3B' // 修改dom节点的背景色
      setTimeout(() => {
          moveImg(x, y, i === result.length - 2)
      }, 200 * i)
    }
  }
}

// 让图片动起来
function moveImg (t, l, last) {
    const img = document.querySelector('#first-li')
  if (img) {
      img.style.left = l * w + 'px'
    img.style.top = t * h + 'px'
    // 判断是否为最后一个，最后一个要滑到终点去
    if (last) {
        setTimeout(() => {
          img.style.left = 9 * w + 'px'
        img.style.top = 9 * h + 'px'
      }, 300)
    }
  }
}
```

![11111.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c0dde61ea1a4d8299d0c8999b2b509e~tplv-k3u1fbpfcp-watermark.image)

#### astar在3d模型中的应用


![11111.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ac0e4f50c164f3fbd8a79bec05b5a6a~tplv-k3u1fbpfcp-watermark.image)

[戳我体验](https://sunhuapeng.github.io/#/iframe?url=html%2F%E4%B8%AD%E7%BA%A7%E6%A1%88%E4%BE%8Bhtml%2Fastar%E7%AE%97%E6%B3%95%E5%9F%BA%E7%A1%80%E4%BD%BF%E7%94%A8.html)

代码可能不是很精深，希望大家能够多提宝贵意见"
