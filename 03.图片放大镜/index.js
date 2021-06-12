/**
 * 比例关系
 *  thumbnail      大图
 * ---------- = --------
 *     mark      origin
 * => 大图大小 = thumbnail / mark * origin
 */

/**
 * ! 第一步：计算大图的大小
 * */

// 获取元素
let $thumbnail = document.querySelector(".thumbnail"),
  $mark = $thumbnail.querySelector(".mark"),
  $origin = document.querySelector(".origin"),
  $originImg = $origin.querySelector("img");
// 获取元素的宽高
let thumbnailW = $thumbnail.clientWidth,
  thumbnailH = $thumbnail.clientHeight,
  markW = $mark.clientWidth,
  markH = $mark.clientHeight,
  originW = $origin.clientWidth,
  originH = $origin.clientHeight,
  originImgW = (thumbnailW / markW) * originW,
  originImgH = (thumbnailH / markH) * originH;

// 设置大图的宽高
$originImg.style.width = originImgW + "px";
$originImg.style.height = originImgH + "px";

/**
 * ! 第二步：thumbnail 绑定鼠标进入，离开，移动事件
 */
$thumbnail.onmouseenter = function (e) {
  $mark.style.visibility = "visible";
  $origin.style.visibility = "visible";
  computedMark(e);
};

$thumbnail.onmousemove = function (e) {
  computedMark(e);
};

$thumbnail.onmouseleave = function (e) {
  $mark.style.visibility = "hidden";
  $origin.style.visibility = "hidden";
};

/**
 * ! 第三步：计算 mark 盒子的位置，控制大图的移动
 *
 * 1. 计算 mark 盒子的位置，让鼠标一直处于 mark 的正中央
 * mark 的 left = 鼠标距离窗口的 X 轴值 - thumbnail 距离 body 的左偏移 - mark 宽度的一半
 * mark 的 top = 鼠标距离窗口的 Y 轴值 - thumbnail 距离 body 的上偏移 - mark 高度的一半
 *
 * 2. 控制大图的移动
 *  mark移动的距离     大图移动的距离
 * -------------- = --------------
 * thumbnail的大小       大图的大小
 * => 大图移动的距离 = markL / thumbnailW * originImgW
 */

// 获取当前元素的大小和相对于视口的位置
let thumbnailOffset = $thumbnail.getBoundingClientRect();
function computedMark(e) {
  // 动态计算 mark 的 left, top
  let markL = e.clientX - thumbnailOffset.left - markW / 2,
    markT = e.clientY - thumbnailOffset.top - markH / 2;

  // mark left, top 最大最小值
  let minL = 0,
    minT = 0,
    maxL = thumbnailW - markW,
    maxT = thumbnailH - markH;

  // 判断边界值
  markL = markL < minL ? minL : markL > maxL ? maxL : markL;
  markT = markT < minT ? minT : markT > maxT ? maxT : markT;

  $mark.style.left = markL + "px";
  $mark.style.top = markT + "px";

  $originImg.style.left = -(markL / thumbnailW) * originImgW + "px";
  $originImg.style.top = -(markT / thumbnailH) * originImgH + "px";
}
