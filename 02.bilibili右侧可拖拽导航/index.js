import DATA from "./data.js";

init(DATA);

function init(data) {
  // 获取元素
  let tabBox = document.getElementById("tabBox");
  let content = document.getElementById("content");

  // 设置子元素
  let contentStr = ``;
  let tabStr = ``;
  data.forEach((item) => {
    contentStr += `<div id="${item.hash}" style="background:${item.background}">${item.name}</div>`;
    tabStr += `<li><a href="#${item.hash}">${item.name}</a></li>`;
  });

  // 填充内容
  content.innerHTML = contentStr;
  tabBox.innerHTML = tabStr;

  // 拖拽
  // 获取 tabBox 中所有 li
  let liList = tabBox.getElementsByTagName("li");

  let zIndex = 0;

  for (let i = liList.length - 1; i >= 0; i--) {
    liList[i].style.top = liList[i].offsetTop + "px";
    liList[i].style.position = "absolute";
    liList[i].index = data[i].index;

    liList[i].onmousedown = function (e) {
      this.y = e.pageY;
      this.top = parseFloat(this.style.top);

      // 让被拖动的元素在最上方
      this.style.zIndex = ++zIndex;

      // 用事件委托绑定鼠标移动事件
      document.onmousemove = move.bind(this);
    };

    liList[i].onmouseup = function (e) {
      document.onmousemove = null;
      for (let i = 0; i < liList.length; i++) {
        // 把被拖动 li 和其他 li 之间的距离存起来
        liList[i].distance = Math.abs(this.offsetTop - liList[i].offsetTop);
      }

      // 根据 distance 升序排列
      let sortLiList = [...liList].sort((a, b) => a.distance - b.distance);

      // 找出 sortLiList 中 marginTop 不是 0px 的 li
      let close = sortLiList.find(
        (item) => item.style.marginTop && item.style.marginTop !== "0px"
      );

      if (!close) {
        this.style.top = this.top + "px";
        return;
      }

      // 取出当前拖动的 li，然后插入到
      let cur = data.splice(this.index, 1)[0];

      data.splice(close.index, 0, cur);

      data.forEach((item, index) => {
        item.index = index;
      });

      init(data);
    };
  }

  function move(e) {
    // 阻止拖动的默认行为：显示所拖动元素信息
    e.preventDefault();

    // 鼠标跟随
    this.style.top = e.pageY - this.y + this.top + "px";

    // 动画
    for (let i = 0; i < liList.length; i++) {
      let curLi = liList[i];

      // 跳过自身
      if (curLi === this) continue;

      if (this.offsetTop >= curLi.offsetTop && this.index < curLi.index) {
        // 拖动项 offsetTop >= curLi 的 offsetTop，
        // 且拖动项 index < curLi 的 index，就让 curLi 让出自己的位置（上移）
        curLi.style.marginTop = -curLi.offsetHeight + "px";
      }
      if (this.offsetTop <= curLi.offsetTop && this.index < curLi.index) {
        // 拖动项 offsetTop <= curLi 的 offsetTop，
        // 且拖动项 index < curLi 的 index，就重置 curLi 的 marginTop
        curLi.style.marginTop = 0 + "px";
      }
      if (this.offsetTop <= curLi.offsetTop && this.index > curLi.index) {
        // 拖动项 offsetTop <= curLi 的 offsetTop，
        // 且拖动项 index > curLi 的 index，就让 curLi 让出自己的位置（下移）
        curLi.style.marginTop = curLi.offsetHeight + "px";
      }
      if (this.offsetTop >= curLi.offsetTop && this.index > curLi.index) {
        curLi.style.marginTop = 0 + "px";
      }
    }
  }
}
