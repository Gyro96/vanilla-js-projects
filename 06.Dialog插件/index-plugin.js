/**
 * 扩展到内置 window.alert
 * alert([content], [options])
 */
window.alert = (function () {
  class Dialog {
    constructor(content, options) {
      this.content = content;
      this.options = options;
      this.init();
    }
    // 初始化：创建元素 + 逻辑操作
    init() {
      this.createElement();
      // 获取一次 offsetWidth 强制触发一次回流，阻断渲染队列，好让动画效果显示
      this.$DIALOG.offsetWidth;
      this.show();

      // 基于事件委托实现 关闭 / 确定 / 取消 按钮的点击操作
      this.$DIALOG.addEventListener("click", (e) => {
        let target = e.target;
        if (/^(BUTTON|I)$/i.test(target.tagName)) {
          clearTimeout(this.$timer);
          this.hide(target.innerHTML === "确定" ? "CONFIRM" : "CANCEL");
        }
      });

      // 拖拽
      this.$HEADER.addEventListener("mousedown", this.down.bind(this));
    }
    // 显示 Dialog
    show() {
      this.$DIALOG.style.opacity = "1";
      this.$MAIN.style.transform = "translateY(0)";

      // 没有确定和取消按钮，默认3s自动隐藏 Dialog
      if (!this.options.confirm) {
        this.$timer = setTimeout(() => {
          this.hide();
          clearTimeout(this.$timer);
        }, 3000);
      }
    }
    /**
     * 隐藏 Dialog
     * @param {*} type CONFIRM / CANCEL
     */
    hide(type = "CANCEL") {
      this.$MAIN.style.transform = "translateY(-1000px)";
      this.$DIALOG.style.opacity = "0";
      let endFn = () => {
        // 触发用户传入的回调函数 handle
        if (typeof this.options.handle === "function") {
          this.options.handle.call(this, type);
        }

        this.$DIALOG.removeEventListener("transitionend", endFn);
        document.body.removeChild(this.$DIALOG);
      };
      // 动画结束时，从 DOM 中移除元素
      this.$DIALOG.addEventListener("transitionend", endFn);
    }
    // 创建元素
    create(type, cssText) {
      let element = document.createElement(type);
      element.style.cssText = cssText;
      return element;
    }
    createElement() {
      this.$DIALOG = this.create(
        "div",
        `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9998;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        user-select: none;
        opacity: 0;
        transition: opacity 0.3s;
        `
      );
      this.$MAIN = this.create(
        "div",
        `
      position: absolute;
      top: 100px;
      left: 50%;
      margin-left: -200px;
      z-index: 9999;
      width: 400px;
      background: #fff;
      border-radius: 3px;
      overflow: hidden;
      transform: translateY(-1000px);
      transition: transform 0.3s;
      `
      );
      this.$HEADER = this.create(
        "div",
        `
      position: relative;
      box-sizing: border-box;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      background: #2299ee;
      cursor: move;
      `
      );
      this.$TITLE = this.create(
        "h3",
        `
      font-size: 18px;
      color: #fff;
      font-weight: normal;
      `
      );
      this.$CLOSE = this.create(
        "i",
        `
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      font-style: normal;
      color: #fff;
      font-family: "Courier New";
      cursor: pointer;
      `
      );
      this.$BODY = this.create(
        "div",
        `
      padding: 30px 10px;
      line-height: 30px;
      font-size: 16px;
      `
      );
      this.$FOOTER = this.create(
        "div",
        `
      text-align: right;
      padding: 10px 10px;
      border-top: 1px solid #eee;
      `
      );
      this.$CONFIRM = this.create(
        "button",
        `
      margin: 0 5px;
      padding: 0 15px;
      height: 28px;
      line-height: 28px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      color: #fff;
      background: #2299ee;
      `
      );
      this.$CANCEL = this.create(
        "button",
        `
      margin: 0 5px;
      padding: 0 15px;
      height: 28px;
      line-height: 28px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      color: #000;
      background: #ddd;
      `
      );

      // 从内到外创建
      let { title, confirm } = this.options;
      this.$TITLE.innerHTML = title;
      this.$CLOSE.innerHTML = "×";
      this.$HEADER.appendChild(this.$TITLE);
      this.$HEADER.appendChild(this.$CLOSE);

      this.$BODY.innerHTML = this.content;

      this.$MAIN.appendChild(this.$HEADER);
      this.$MAIN.appendChild(this.$BODY);

      if (confirm) {
        this.$CONFIRM.innerHTML = "确定";
        this.$CANCEL.innerHTML = "取消";
        this.$FOOTER.appendChild(this.$CONFIRM);
        this.$FOOTER.appendChild(this.$CANCEL);

        this.$MAIN.appendChild(this.$FOOTER);
      }

      this.$DIALOG.appendChild(this.$MAIN);

      // 一次性插入到页面中，减少回流和重绘
      document.body.appendChild(this.$DIALOG);
    }
    // 拖拽实现
    down(e) {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startL = this.$MAIN.offsetLeft;
      this.startT = this.$MAIN.offsetTop;
      this._MOVE = this.move.bind(this);
      this._UP = this.up.bind(this);
      document.addEventListener("mousemove", this._MOVE);
      document.addEventListener("mouseup", this._UP);
    }
    move(e) {
      let curL = e.clientX - this.startX + this.startL,
        curT = e.clientY - this.startY + this.startT;
      let minL = 0,
        minT = 0,
        maxL = this.$DIALOG.offsetWidth - this.$MAIN.offsetWidth,
        maxT = this.$DIALOG.offsetHeight - this.$MAIN.offsetHeight;
      curL = curL < minL ? minL : curL > maxL ? maxL : curL;
      curT = curT < minT ? minT : curT > maxT ? maxT : curT;
      this.$MAIN.style.left = curL + "px";
      this.$MAIN.style.top = curT + "px";
      this.$MAIN.style.marginLeft = 0;
    }
    up(e) {
      document.removeEventListener("mousemove", this._MOVE);
      document.removeEventListener("mouseup", this._UP);
    }
  }

  return function anonymous(content, options = {}) {
    // 参数验证
    if (typeof content === "undefined") {
      throw new Error("错误：提示内容必须传递！");
    }
    if (options == null && typeof options !== "object") {
      throw new Error("错误：配置项必须是一个对象");
    }

    // 参数合并
    options = Object.assign(
      {
        title: "温馨提示",
        confirm: false,
        handle: null,
      },
      options
    );

    new Dialog(content, options);
  };
})();
