/**
 * * 处理图片加载失败 - 全局监听 error 事件
 * 该事件需要在DOM加载之前进行绑定，不然不起作用
 * 因为 error 事件不支持冒泡，所以我们需要在捕获阶段处理
 * 如何优雅处理图片异常： https://juejin.cn/post/6844904046705246216
 * 图片加载失败后CSS样式处理最佳实践： https://www.zhangxinxu.com/wordpress/2020/10/css-style-image-load-fail/
 */
document.addEventListener(
  "error",
  function (e) {
    // console.log(e);
    if (e.target.tagName.toLowerCase() === "img") {
      e.target.classList.add("error");
    }
  },
  true
);
