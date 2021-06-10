/**
 * 各名字解释
 * HTMLElement.offsetWidth：
 *      是一个只读属性，返回一个元素的布局宽度。
 *      一个典型的offsetWidth是测量包含元素的边框(border)、水平线上的内边距(padding)、竖直方向滚动条(scrollbar)（如果存在的话）、以及CSS设置的宽度(width)的值。
 * HTMLElement.offsetTop：
 *      返回当前元素相对于其 offsetParent 元素的顶部内边距的距离。
 * HTMLElement.offsetParent：
 *      返回一个指向最近的（指包含层级上的最近）包含该元素的定位元素或者最近的 table,td,th,body元素。
 * MouseEvent.pageX：
 *      一个由MouseEvent接口返回的相对于整个文档的x（水平）坐标以像素为单位的只读属性。
 *      这个属性将基于文档的边缘，考虑任何页面的水平方向上的滚动。
 *      举个例子，如果页面向右滚动 200px 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 100px 的位置，pageX 所返回的值将是 300。
 */
let liList = document.getElementsByTagName("li");
let zIndex = 0;
/**
 * 注意我们这里采用倒着循环，如果正序的话，因为元素是浮动的，设置一个元素定位，
 * 后面的就会跑到第一个元素的位置来，最后会导致所有元素的 top,left 值都相同，
 * 所以我们从最后一个元素开始设置 top, left, 就不会导致这个问题
 */
for (let i = liList.length - 1; i >= 0; i--) {
  liList[i].style.top = liList[i].offsetTop - 5 + "px";
  liList[i].style.left = liList[i].offsetLeft - 5 + "px";
  liList[i].style.position = "absolute";

  liList[i].onmousedown = function (e) {
    // 先把盒子原来的位置存储到盒子上
    this.top = parseFloat(this.style.top);
    this.left = parseFloat(this.style.left);

    // 再把鼠标开始的位置记录到盒子上
    // pageX 相对于整个文档的x（水平）坐标以像素为单位的只读属性
    this.x = e.pageX;
    this.y = e.pageY;

    // 让移动元素层级最高
    this.style.zIndex = ++zIndex;

    // 事件委托，绑定 onmousemove
    document.onmousemove = move.bind(this);

    this.overlay = []; // 用于记录和当前元素重叠的元素
  };

  liList[i].onmouseup = function (e) {
    document.onmousemove = null;

    /**
     * 算出当前被拖动盒子的左上角和 overlay 这个数组中每一个 li 的左上角距离的面积，
     * 然后取一个最小的面积，我们就判定这个 li 是离被拖动盒子最近的 li
     */
    let overlay = this.overlay;
    for (let i = 0; i < overlay.length; i++) {
      overlay[i].area =
        Math.abs(this.offsetTop - overlay[i].offsetTop) *
        Math.abs(this.offsetLeft - overlay[i].offsetLeft);
    }

    overlay.sort((a, b) => a.area - b.area);
    // 有和其他元素重叠那么就交换两个元素位置，没有就回到原位
    if (overlay[0]) {
      // 交换两个元素位置
      this.style.top = overlay[0].style.top;
      this.style.left = overlay[0].style.left;

      overlay[0].style.top = this.top + "px";
      overlay[0].style.left = this.left + "px";
    } else {
      this.style.top = this.top + "px";
      this.style.left = this.left + "px";
    }

    this.overlay = [];
  };
}

// 鼠标跟随
function move(e) {
  // e.pageY - this.y 算出元素移动的距离
  this.style.top = this.top + e.pageY - this.y + "px";
  this.style.left = this.left + e.pageX - this.x + "px";

  /**
   * 循环所有元素，获取和当前移动元素发生重叠的元素集
   * 如何知道移动元素是否和其他元素发生了重叠
   * 首先我们要知道什么情况下不会重叠
   * 1. 移动元素.offsetLeft + 移动元素.offsetWidth < 未移动元素.offsetLeft
   * 2. 移动元素.offsetTop + 移动元素.offsetHeight < 未移动元素.offsetTop
   * 3. 未移动元素.offsetLeft + 未移动元素.offsetWidth < 移动元素.offsetLeft
   * 4. 未移动元素.offsetTop + 未移动元素.offsetHeight < 移动元素.offsetTop
   * 取反就可以得到重叠的情况
   */
  for (let i = 0; i < liList.length; i++) {
    let curLi = liList[i];

    // 跳过自身
    if (this === curLi) continue;

    if (
      !(
        this.offsetLeft + this.offsetWidth < curLi.offsetLeft ||
        this.offsetTop + this.offsetHeight < curLi.offsetTop ||
        curLi.offsetLeft + curLi.offsetWidth < this.offsetLeft ||
        curLi.offsetTop + curLi.offsetHeight < this.offsetTop
      )
    ) {
      // 已经存在不需要多次 push
      let flag = this.overlay.find((item) => item === curLi);
      if (flag) continue;

      this.overlay.push(curLi);
    //   console.log(this.overlay);
    }
  }
}
