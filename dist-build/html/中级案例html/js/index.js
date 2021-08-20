// 初始化地图
let w = h = 40
const mapArr = []
const lastnum = 9
function createMap () {
  // 获取地图容器
  const mapDom = document.querySelector("#map")
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
      if (i === 0 && j === 0 || i === lastnum && j === lastnum) {
        mapArr[i][j] = 1
        li.style.background = '#009688'
      }
      ul.appendChild(li)
      li.style.left = j * w + 'px'
      li.style.top = i * h + 'px'
      // 设置一个坐标属性，方便之后查找
      li.setAttribute('coordinate', i + ',' + j)
    }
  }
  astarCreate([0, 0], [lastnum, lastnum], mapArr)
}
// 生成两个整数之间的随机整数
function getRandom (max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
createMap()

// 计算路径 astar算法
function astarCreate (star, end, graph) {
  var maps = new Graph(graph);
  var starPosition = maps.grid[star[0]][star[1]];
  var endPosition = maps.grid[end[0]][end[1]];
  var result = astar.search(maps, starPosition, endPosition);
  console.log('result', result)
  // 将可行走点标记出来
  targDom(result)
}
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
        img.style.left = lastnum * w + 'px'
        img.style.top = lastnum * h + 'px'
      }, 300)
    }
  }
}
