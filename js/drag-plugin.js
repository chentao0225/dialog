/**
 * 简易的拖拽插件
 *      new drag([selector],[options])
 * selector
 *      按住谁实现拖拽
 * options={}
 *      element:拖拽中要移动的元素(默认值：当前按住的元素)
 *      boundary:是否进行边界效验
 *      (默认值：true，不能超过要移动元素所在容器的范围，需要保证：当前移动的元素是相对容器定位的)
 *
 *      生命周期函数(钩子函数)
 *      dragstart:拖拽开始
 *      dragmove:拖拽中
 *      dragend:拖拽结束
 */
~(function () {
  class Drag {
    constructor(selector, options) {
      this.initParams(selector, options);
      this._selector.addEventListener("mousedown", this.down.bind(this));
    }
    //参数初始化
    initParams(selector, options = {}) {
      this._selector = document.querySelector(selector);
      let defaultParams = {
        element: this._selector,
        boundary: true,
        dragstart: null,
        dragmove: null,
        dragend: null,
      };
      defaultParams = Object.assign(defaultParams, options);
      //挂载到实例上
      Drag.each(defaultParams, (value, key) => {
        this["_" + key] = value;
      });
    }
    //实现拖拽效果

    down(ev) {
      let { _element } = this;
      console.log(_element);
      this.startX = ev.pageX;
      this.startY = ev.pageY;
      this.startL = Drag.getCss(_element, "left");
      this.startT = Drag.getCss(_element, "top");
      this._move = this.move.bind(this);
      this._up = this.up.bind(this);
      document.addEventListener("mousemove", this._move);
      document.addEventListener("mouseup", this._up);

      //钩子函数
      this._dragstart && this._dragstart(this, ev);
    }
    move(ev) {
      let { _element, _boundary, startX, startY, startT, startL } = this;
      let curL = ev.pageX - startX + startL,
        curT = ev.pageY - startY + startT;
      //边界处理
      if (_boundary) {
        let parent = _element.parentNode,
          minL = 0,
          minT = 0,
          maxL = parent.offsetWidth - _element.offsetWidth,
          maxT = parent.offsetHeight - _element.offsetHeight;
        curL = curL < minL ? minL : curL > maxL ? maxL : curL;
        curT = curT < minT ? minT : curT > maxT ? maxT : curT;
      }
      _element.style.left = curL + "px";
      _element.style.top = curT + "px";

      //钩子函数
      this._dragmove && this._dragmove(this, curL, curT, ev);
    }
    up(ev) {
      document.removeEventListener("mousemove", this._move);
      document.removeEventListener("mouseup", this._up);
      //钩子函数
      this._dragend && this._dragend(this, ev);
    }
    //工具类方法
    static each(arr, callback) {
      if ("length" in arr) {
        for (let i = 0; i < arr.length; i++) {
          callback && callback(arr[i], i);
        }
        return;
      }
      for (let key in arr) {
        if (!arr.hasOwnProperty(key)) break;
        callback && callback(arr[key], key);
      }
    }
    static getCss(curEle, attr) {
      return parseFloat(getComputedStyle(curEle)[attr]);
    }
  }
  window.Drag = Drag;
})();
