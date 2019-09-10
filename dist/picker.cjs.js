'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var noop = function noop() {};

var AXIS_X = 1;
var AXIS_Y = 2;
var supportTouchEvent = 'ontouchstart' in window;
/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */

var TouchHub =
/** @class */
function () {
  /**
   * onTouchDown
   * onTouchUp
   * onTouchMove
   * onTouchSlide
   * onTouchFling
   */
  function TouchHub() {
    var self = this; // 是否停止检测

    self.active = true;
    self.speedX = [0, 0]; // 速度记录

    self.speedXIdx = 0;
    self.speedY = [0, 0];
    self.speedYIdx = 0;
    self.minFlingSpeed = 1; // px/millsecond

    self.maxFlingSpeed = 1; // 当前主要检测的轴向

    self.coordinate = 'x';
    self.moveCoordinate = null;
    /* 主要依赖：CSSOM/gBCR */
    // 所有的状态

    self.startPos = {
      x: 0,
      y: 0
    }; // touch开始的位置，对应的pageX,pageY

    self.currentPos = {
      x: 0,
      y: 0
    }; // 每次touchMove的情况下，对应的pageX/pageY都是currentPos

    self.lastRecordTime = -1, // 上次数据记录时间
    self._down = self._up = self._move = self._slide = self._fling = noop; // 输出

    if (supportTouchEvent) {
      console.log('[touch] support touch event');
    } else {
      console.log('[touch] fallback to mouse event');
    }
  }

  TouchHub.prototype.start = function (event) {
    console.log('start');
    var self = this;

    if (!self.active) {
      return;
    }

    var e = null;

    if (supportTouchEvent) {
      e = event.changedTouches[0];
    } else {
      e = event;
      self.mouseStatus = 1;
    } // 获得当前的位置数据


    var x = e.clientX;
    var y = e.clientY;

    self._setStartPosition(x, y);

    self._setCurrentPosition(x, y); // 发生点击的开始
    // 分别创建两个不同


    self._down({
      startPos: Object.assign({}, self.startPos),
      currentPos: Object.assign({}, self.currentPos)
    });

    self.lastRecordTime = Date.now();
  };

  TouchHub.prototype.move = function (event) {
    console.log('move');
    var self = this;

    if (!self.active) {
      return;
    }

    var e = null;

    if (supportTouchEvent) {
      e = event.touches[0];
    } else {
      e = event;

      if (self.mouseStatus != 1) {
        return;
      }
    }

    var pageX = e.clientX;
    var pageY = e.clientY;
    var offsetX = pageX - self.currentPos.x;
    var offsetY = pageY - self.currentPos.y;

    self._setCurrentPosition(pageX, pageY);

    var moveCoordinate = Math.abs(offsetX) > Math.abs(offsetY) ? 'x' : 'y';

    if (!self.moveCoordinate) {
      self.moveCoordinate = moveCoordinate;
    }

    self._move({
      x: offsetX,
      y: offsetY,
      startMoveCoordinate: self.moveCoordinate,
      moveCoordinate: moveCoordinate
    });

    var now = Date.now();
    self.recordSpeed(offsetX, AXIS_X, now);
    self.recordSpeed(offsetY, AXIS_Y, now);
    self.lastRecordTime = now; // preventDefault，是为了阻止后面元素的滚动

    if (self.moveCoordinate == self.coordinate) {
      event.preventDefault();
    }
  };

  TouchHub.prototype.end = function (event) {
    console.log('end');
    var self = this;

    if (!self.active) {
      return;
    }

    var e = null;

    if (supportTouchEvent) {
      e = event.changedTouches[0];
    } else {
      e = event;
      self.mouseStatus = 0;
    } // var pageX = touch.clientX;
    // var pageY = touch.clientY;
    // var offsetX = pageX - self.currentPos.x;
    // var offsetY = pageY - self.currentPos.y; // 为了触发touch.move


    self._setCurrentPosition(e.clientX, e.clientY);

    var speedX = (self.speedX[0] + self.speedX[1]) / 2;
    var speedY = (self.speedY[0] + self.speedY[1]) / 2;

    self._up({
      startPos: Object.assign({}, self.startPos),
      currentPos: Object.assign({}, self.currentPos)
    });

    if (self.coordinate === 'x' ? Math.abs(speedX) > self.minFlingSpeed : Math.abs(speedY) > self.minFlingSpeed) {
      self._fling({
        startPos: Object.assign({}, self.startPos),
        currentPos: Object.assign({}, self.currentPos),
        speedX: speedX,
        speedY: speedY
      });
    } else if (self.coordinate === 'x' ? Math.abs(self.currentPos.x - self.startPos.x) > 0 : Math.abs(self.currentPos.y - self.startPos.y) > 0) {
      self._slide({
        startPos: Object.assign({}, self.startPos),
        currentPos: Object.assign({}, self.currentPos)
      });
    } // clearSpeed


    self.speedX[0] = self.speedX[1] = 0;
    self.speedY[0] = self.speedY[1] = 0; //

    self.moveCoordinate = null;
  };

  TouchHub.prototype.recordSpeed = function (offset, axis, now) {
    var self = this;
    var duration = now - self.lastRecordTime;
    var speed = offset / duration; // 记录数据

    if (axis === AXIS_X) {
      self.speedX[self.speedXIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
    } else if (axis === AXIS_Y) {
      self.speedY[self.speedYIdx++ & 1] = speed; // 让speedIdx保存为0或者1的情况
    }
  };

  TouchHub.prototype.work = function (active) {
    this.active = active;
  };

  TouchHub.prototype._setStartPosition = function (x, y) {
    this.startPos.x = x;
    this.startPos.y = y;
  };
  /**
   *
   */


  TouchHub.prototype._setCurrentPosition = function (x, y) {
    this.currentPos.x = x;
    this.currentPos.y = y;
  };

  TouchHub.prototype.onTouchDown = function (cb) {
    this._down = cb;
  };

  TouchHub.prototype.onTouchUp = function (cb) {
    this._up = cb;
  };

  TouchHub.prototype.onTouchMove = function (cb) {
    this._move = cb;
  };

  TouchHub.prototype.onTouchSlide = function (cb) {
    this._slide = cb;
  };

  TouchHub.prototype.onTouchFling = function (cb) {
    this._fling = cb;
  };

  return TouchHub;
}();
/**
 * 事件
 * touch-down(startPos, currentPos)
 * touch-move(x, y)
 * touch-slide(startPos, currentPost)
 * touch-fling
 * touch-up(startPos, currentPos)
 */


var Touch = {
  name: 'ROTouch',
  props: {
    /**
     * 当前正在处理的coordinate
     */
    coordinate: {
      type: String,
      "default": 'x'
    },

    /**
     * 是否active
     */
    active: {
      type: Boolean,
      "default": true
    }
  },
  data: function data() {
    return {
      hub: new TouchHub()
    };
  },
  watch: {
    /**
     * 检查active
     */
    active: function active(val) {
      this.hub.active = val;
    }
  },
  created: function created() {
    var vm = this;
    vm.hub.onTouchDown(function (res) {
      return vm.$emit('touch-down', res);
    });
    vm.hub.onTouchUp(function (res) {
      return vm.$emit('touch-up', res);
    });
    vm.hub.onTouchMove(function (res) {
      return vm.$emit('touch-move', res);
    });
    vm.hub.onTouchSlide(function (res) {
      return vm.$emit('touch-slide', res);
    });
    vm.hub.onTouchFling(function (res) {
      return vm.$emit('touch-fling', res);
    });
  },
  mounted: function mounted() {
    this.hub.coordinate = this.coordinate;
    this.hub.active = this.active;
  },
  render: function render(h) {
    var vm = this;
    var el = document.createElement('div'); // el.style

    var v = {
      'class': ['ro-touch'],
      style: {
        width: '100%',
        height: '100%'
      },
      on: {}
    };

    if (supportTouchEvent) {
      v.on['!touchstart'] = vm.hub.start.bind(vm.hub);
      v.on.touchmove = vm.hub.move.bind(vm.hub);
      v.on.touchend = vm.hub.end.bind(vm.hub);
      v.style.backgroundColor = '#f00';
    } else {
      v.on.mousedown = vm.hub.start.bind(vm.hub);
      v.on.mousemove = vm.hub.move.bind(vm.hub);
      v.on.mouseup = vm.hub.end.bind(vm.hub);
      v.style.backgroundColor = '#0f0';
    }

    return h('div', v, this.$slots["default"]);
  }
};

//
/**
 * 选择器
 */

var script = {
  name: 'Picker',
  components: {
    Touch: Touch
  },
  props: {
    // 所有的内容
    slots: {
      type: Array
    },

    /**
     * 外部传入值
     */
    value: {
      required: true
    },

    /**
     * 加速度
     */
    accelerate: {
      type: Number,
      "default": 0.012
    }
  },
  data: function data() {
    return {
      /**
       * 纵向的移动
       *
       *  tip: 其中-1表示未知状态
       */
      y: 0,

      /**
       * 容器大小
       */
      containerRect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },

      /**
       * 是否正在滑动过程中
       */
      inTouchMove: false
    };
  },
  computed: {
    /**
     * 每个slot的大小
     */
    slotHeight: function slotHeight() {
      var rect = this.containerRect;

      if (!rect || !rect.height) {
        return 0;
      }

      return rect.height / 5;
    },

    /**
     * 最小的y值
     */
    minY: function minY() {
      return (-this.slots.length + 3) * this.slotHeight;
    },

    /**
     * 最大的y值
     */
    maxY: function maxY() {
      return 2 * this.slotHeight;
    },

    /**
     * 所生成的index
     */
    index: function index() {
      return (this.maxY - this.round(this.y)) / this.slotHeight;
    },

    /**
     * 根据slots生成的indexMap
     */
    indexMap: function indexMap() {
      var result = {};

      for (var i = 0, len = this.slots.length; i < len; i++) {
        result[i] = this.slots[i];
      }

      return result;
    },

    /**
     * 根据slots生成的valueMap
     */
    valueMap: function valueMap() {
      var result = {};

      for (var i = 0, len = this.slots.length; i < len; i++) {
        result[this.slots[i].value] = Object.assign({
          index: i
        }, this.slots[i]);
      }

      return result;
    }
  },
  watch: {
    /**
     * 外界传入的值发生了变化
     */
    '$props.value': function $propsValue(val) {
      if (!this.inTouchMove) {
        this.updatePosition();
      }
    },

    /**
     * 最小的y值修改
     */
    minY: function minY(val) {
      if (this.y < val) {
        this.y = val;
      }
    },

    /**
     * 最大的y值
     */
    maxY: function maxY(val) {
      if (this.y > val) {
        this.y = val;
      }
    },

    /**
     * 检查索引变化
     *
     * 只有变化的时候才通知
     */
    index: function index(newVal, oldVal) {
      if (newVal !== oldVal && this.indexMap[newVal]) {
        this.$emit('input', this.indexMap[newVal].value);
      }
    }
  },
  methods: {
    /**
     * 开始
     */
    onTouchStart: function onTouchStart() {
      this.inTouchMove = true;
      console.log('onTouchStart');
    },

    /**
     * 移动
     */
    onTouchMove: function onTouchMove(_ref) {
      var y = _ref.y;
      this.y = this.range(this.y + y);
      console.log('onTouchMove');
    },

    /**
     * 结束
     */
    onTouchEnd: function onTouchEnd() {
      this.inTouchMove = false;
      console.log('onTouchEnd');
    },

    /**
     * touch-fling事件相关的处理函数
     *
     * @param {} speedX
     */
    onTouchFling: function onTouchFling(_ref2) {
      var speedY = _ref2.speedY;
      console.log('onTouchFling');
      var vm = this;
      var height = vm.slotHeight;
      var distance = speedY * speedY / 2 / vm.accelerate;
      distance = speedY < 0 ? -distance : distance;
      var duration = Math.abs(speedY / vm.accelerate);
      vm.abortScroll = false;
      var resultY = vm.y + distance;
      var floorY = vm.range(resultY);

      if (resultY === floorY) {
        vm.scroll(vm.round(resultY, 0, height) - vm.y, duration, function (val) {
          return Math.sqrt(1 - (val - 1) * (val - 1));
        });
      } else {
        var newDistance = floorY - vm.y;
        var newDuration = Math.sqrt(Math.abs(newDistance) / (2 * vm.accelerate));
        var ratio = newDuration / duration;

        var _cache = Math.sqrt(1 - (ratio - 1) * (ratio - 1));

        vm.scroll(newDistance, newDuration, function (val) {
          return Math.sqrt(1 - (ratio * val - 1) * (ratio * val - 1)) / _cache;
        });
      }
    },

    /**
     * 处理slide事件
     */
    onTouchSlide: function onTouchSlide() {
      console.log('onTouchSlide'); // 移动到slot的位置
      // 计算slot的位置

      var vm = this;
      var y = vm.y;
      var slotY = vm.round(vm.range(y));
      var distance = slotY - y;
      vm.abortScroll = false;
      vm.scroll(distance, Math.abs(distance / 0.6), function (val) {
        return val;
      });
    },

    /**
     * 滑动DateSelect组件
     *
     * @param {Number} distance
     * @param {Number} duration
     * @param {Function} interpolation 插值函数
     */
    scroll: function scroll(distance, duration, interpolation, onComplete, onAbort) {
      var vm = this;
      var start = Date.now();
      var y = vm.y;

      if (distance === 0) {
        onComplete && onComplete();
        return;
      }

      function callback() {
        var diff = Date.now() - start;

        if (vm.abortScroll) {
          // do nothing
          vm.abortScroll = false;
          onAbort && onAbort();
        } else if (diff < duration) {
          // 计算最终的滑动距离
          var diffY = interpolation(diff / duration) * distance;
          vm.y = y + diffY;
          window.requestAnimationFrame(callback); // 下次请求
        } else if (diff >= duration) {
          var _diffY = interpolation(1) * distance;

          vm.y = y + _diffY;
          onComplete && onComplete();
        }
      }
      window.requestAnimationFrame(callback);
    },

    /**
     * 数值限定
     */
    range: function range(value) {
      return Math.min(Math.max(value, this.minY), this.maxY);
    },

    /**
     * 四舍五入
     */
    round: function round(value) {
      return this.minY + Math.round((value - this.minY) / this.slotHeight) * this.slotHeight;
    },

    /**
     * 根据当前的值来更新位置
     */
    updatePosition: function updatePosition() {
      // 跳转到当前的位置
      var slotData = this.valueMap[this.value];

      if (slotData) {
        var index = slotData.index;
        this.y = this.maxY - index * this.slotHeight;
      } else {
        console.log('cannot find value', this.value);
      }
    }
  },

  /**
   * 锚定
   */
  mounted: function mounted() {
    var defaultRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }; // 容器大小

    var containerRect = this.$refs.container.getBoundingClientRect && this.$refs.container.getBoundingClientRect() || defaultRect;
    this.containerRect = {
      left: containerRect.left,
      top: containerRect.top,
      width: containerRect.width,
      height: containerRect.height
    };
    this.updatePosition();
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}

var HEAD;
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);

      if (HEAD === undefined) {
        HEAD = document.head || document.getElementsByTagName('head')[0];
      }

      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "Touch",
        {
          attrs: { coordinate: "y" },
          on: {
            "touch-down": _vm.onTouchStart,
            "touch-move": _vm.onTouchMove,
            "touch-up": _vm.onTouchEnd,
            "touch-fling": _vm.onTouchFling,
            "touch-slide": _vm.onTouchSlide
          }
        },
        [
          _c("div", { ref: "container", staticClass: "picker-container" }, [
            _c("div", { staticClass: "picker-display" }),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "picker-slots",
                style: { transform: "translate3d(0," + _vm.y + "px,0)" }
              },
              _vm._l(_vm.slots, function(slot, index) {
                return _c("div", { key: index, staticClass: "picker-slot" }, [
                  _vm._v(
                    "\n                    " +
                      _vm._s(slot.text) +
                      "\n                "
                  )
                ])
              }),
              0
            )
          ])
        ]
      )
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-85e704f4_0", { source: ".picker-container {\n  position: relative;\n  height: 4.6875rem;\n  overflow: hidden;\n}\n.picker-display {\n  position: absolute;\n  top: 1.875rem;\n  width: 100%;\n  height: 0.9375rem;\n  font-size: 0.5625rem;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n.picker-slot {\n  height: 0.9375rem;\n  font-size: 0.5625rem;\n  line-height: 0.9375rem;\n  text-align: center;\n}\n", map: {"version":3,"sources":["picker.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,aAAa;EACb,WAAW;EACX,iBAAiB;EACjB,oBAAoB;EACpB,oCAAoC;AACtC;AACA;EACE,iBAAiB;EACjB,oBAAoB;EACpB,sBAAsB;EACtB,kBAAkB;AACpB","file":"picker.vue","sourcesContent":[".picker-container {\n  position: relative;\n  height: 4.6875rem;\n  overflow: hidden;\n}\n.picker-display {\n  position: absolute;\n  top: 1.875rem;\n  width: 100%;\n  height: 0.9375rem;\n  font-size: 0.5625rem;\n  background-color: rgba(0, 0, 0, 0.1);\n}\n.picker-slot {\n  height: 0.9375rem;\n  font-size: 0.5625rem;\n  line-height: 0.9375rem;\n  text-align: center;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Picker = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var monthDay = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * 是否是闰年
 */

function isLeapYear(year) {
  if (year % 4 !== 0) {
    return false;
  }

  if (year % 400 === 0) {
    return true;
  }

  if (year % 100 === 0) {
    return false;
  }

  return true;
}
/**
 * 获得一个月有多少天
 *
 * @param {} year
 * @param {} month
 */

function getMonthDay(year, month) {
  if (isLeapYear(year) && month === 2) {
    return 29;
  }

  return monthDay[month];
}
/**
 * 是否是null或者undefined
 *
 * @param {} v 参数
 *
 * @return {boolean}
 */

function isUndef(v) {
  return v === null || v === undefined;
}
/**
 * 获得当前的时间
 *
 * @return {Date} 当天
 */

function dateNow() {
  var utcDate = new Date(new Date().valueOf() + 8 * 3600000);
  return dateParse("".concat(utcDate.getUTCFullYear(), "-").concat(utcDate.getUTCMonth() + 1, "-").concat(utcDate.getUTCDate(), " ").concat(utcDate.getUTCHours(), ":").concat(utcDate.getUTCMinutes(), ":").concat(utcDate.getUTCSeconds()));
}
/**
 * 日期文本解析
 *
 * @param {String} v 要求必须是 1. Y-m-d H:i:s 2. Y-m-d
 *
 * @return {Date} 解析后的日期 UTC+08:00
 */

function dateParse(v) {
  if (isUndef(v) || v === '') {
    return v;
  }

  var chunk = v.split(' ');
  var date = chunk[0];
  var time = chunk[1];
  var dateChunk = date.split('-');
  var d = new Date();
  d.setUTCFullYear(dateChunk[0]);
  d.setUTCMonth(dateChunk[1] - 1);
  d.setUTCMonth(dateChunk[1] - 1);
  d.setUTCDate(dateChunk[2]);
  var hour = 0;
  var minute = 0;
  var second = 0;

  if (!isUndef(time)) {
    var timeChunk = time.split(':');
    hour = timeChunk[0];
    minute = timeChunk[1];
    second = timeChunk[2];
  }

  d.setUTCHours(hour);
  d.setUTCMinutes(minute);
  d.setUTCSeconds(second);
  d.setUTCMilliseconds(0);
  return new Date(d.valueOf() + 8 * 3600000);
}
/**
 * 对于数字进行format操作
 */

function _format(number) {
  if (number < 0) {
    return number;
  } else if (number < 10) {
    return '0' + number;
  } else {
    return number;
  }
}
/**
 * 是否是某种类型
 */

function isType(name) {
  return function (val) {
    return Object.prototype.toString.call(val) === "[object ".concat(name, "]");
  };
}
var isArray = Array.isArray || isType(name);

//
/**
 * 日期选择
 *
 * @input 数据更新
 */

var script$1 = {
  name: 'DatePicker',
  components: {
    Picker: Picker
  },
  props: ['value'],
  data: function data() {
    return {
      // 年份
      year: 0,
      // 月份
      month: 0,
      // 日期
      date: 0,
      // 年份
      yearSlots: [],
      // 月份
      monthSlots: [],
      // 日期
      dateSlots: []
    };
  },
  computed: {
    str: function str() {
      return "".concat(this.year, "-").concat(_format(this.month), "-").concat(_format(this.date));
    }
  },
  watch: {
    str: function str(val) {
      this.$emit('input', val);
    },
    year: function year() {
      var date = getMonthDay(this.year, this.month);

      if (date !== this.dateSlots.length) {
        this.generateDateSlots(date);
      }
    },
    month: function month() {
      var date = getMonthDay(this.year, this.month);

      if (date !== this.dateSlots.length) {
        this.generateDateSlots(date);
      }
    }
  },
  methods: {
    /**
     * 生成dateSlots
     *
     * @param {} date 多少天
     */
    generateDateSlots: function generateDateSlots(date) {
      var slots = [];

      for (var i = 1; i <= date; i++) {
        slots.push({
          value: i,
          text: i
        });
      }

      this.dateSlots = slots;
    }
  },
  created: function created() {
    // 生成slots
    // 创建yearSlots
    var now = dateNow();
    var year = now.getUTCFullYear();
    var yearSlots = [];

    for (var i = 1900; i <= year; i++) {
      yearSlots.push({
        value: i,
        text: i
      });
    }

    this.yearSlots = yearSlots; // 创建month

    var monthSlots = [];

    for (var _i = 1; _i <= 12; _i++) {
      monthSlots.push({
        value: _i,
        text: _i
      });
    }

    this.monthSlots = monthSlots; // 创建date，需要根据对应的month创建date

    this.generateDateSlots(this.year, this.month);
  },
  mounted: function mounted() {
    // 设定默认值
    if (this.value && this.value.length > 0) {
      var chunks = this.value.split('-');

      if (chunks.length === 3) {
        this.year = parseInt(chunks[0]);
        this.month = parseInt(chunks[1]);
        this.date = parseInt(chunks[2]);
      }
    } else {
      this.year = 1990;
      this.month = 1;
      this.date = 1;
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "date-picker-container" }, [
    _c("div", { staticClass: "fix-float" }, [
      _c(
        "div",
        { staticClass: "column" },
        [
          _c("Picker", {
            attrs: { slots: _vm.yearSlots },
            model: {
              value: _vm.year,
              callback: function($$v) {
                _vm.year = $$v;
              },
              expression: "year"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "column" },
        [
          _c("Picker", {
            attrs: { slots: _vm.monthSlots },
            model: {
              value: _vm.month,
              callback: function($$v) {
                _vm.month = $$v;
              },
              expression: "month"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "column" },
        [
          _c("Picker", {
            attrs: { slots: _vm.dateSlots },
            model: {
              value: _vm.date,
              callback: function($$v) {
                _vm.date = $$v;
              },
              expression: "date"
            }
          })
        ],
        1
      )
    ])
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-05717b2e_0", { source: ".date-picker-container .column {\n  float: left;\n  width: 33.33%;\n}\n", map: {"version":3,"sources":["datePicker.vue"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,aAAa;AACf","file":"datePicker.vue","sourcesContent":[".date-picker-container .column {\n  float: left;\n  width: 33.33%;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var datePicker = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

exports.DatePicker = datePicker;
exports.Picker = Picker;