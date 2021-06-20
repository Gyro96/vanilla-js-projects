/**
 * mousedown：开始拖拽
 * mousemove：随时计算盒子最新的位置，让盒子移动
 * mouseup：结束拖拽
 * 盒子最新位置 = 鼠标当前最新位置 - 鼠标起始的位置 + 盒子起始的位置
 */
let $box = document.getElementById("box");
$box.addEventListener("mousedown", mouseDown);

// 鼠标按下
function mouseDown(e) {
  // 记录鼠标和盒子的起始位置（将值存储在元素的自定义属性上，方便其他事件获取）
  this.startX = e.clientX;
  this.startY = e.clientY;
  let rect = this.getBoundingClientRect();
  this.startL = rect.left;
  this.startT = rect.top;

  /**
   * 按下鼠标才绑定 move 和 up 事件
   * 并且保证执行时的 this 是 $box
   */
  this._MOUSE = mouseMove.bind(this);
  this._UP = mouseUp.bind(this);
  document.addEventListener("mousemove", this._MOUSE);
  document.addEventListener("mouseup", this._UP);

  //   this.setCapture();
}

// 鼠标移动
function mouseMove(e) {
  /**
   * 鼠标移动速度过快，鼠标会脱离盒子（鼠标焦点丢失）
   *    此时在盒子外部移动不会触发盒子的 mousemove
   *    并且在盒子外松开鼠标也不会触发盒子的 mouseup
   * [IE、火狐浏览器]
   *    setCapture/releaseCapture：把元素和鼠标绑定（或者移除）在一起，防止鼠标焦点丢失
   * [谷歌]
   *    move 和 up 方法绑定给 document
   */
  let curL = e.clientX - this.startX + this.startL,
    curT = e.clientY - this.startY + this.startT;
  let minL = 0,
    minT = 0,
    maxL = window.innerWidth - this.offsetWidth,
    maxT = window.innerHeight - this.offsetHeight;
  curL = curL < minL ? minL : curL > maxL ? maxL : curL;
  curT = curT < minT ? minT : curT > maxT ? maxT : curT;
  this.style.cssText = `left: ${curL}px; top: ${curT}px`;
}

// 鼠标松开
function mouseUp(e) {
  //   this.releaseCapture();
  
  // 松开鼠标，解除事件绑定
  document.removeEventListener("mousemove", this._MOUSE);
  document.removeEventListener("mouseup", this._UP);
}
