(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.formatInput = {}));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var touch_min = createCommonjsModule(function (module, exports) {
	  !function (e, t) {
	     module.exports = t() ;
	  }(commonjsGlobal, function () {
	    return function (e) {
	      function t(n) {
	        if (o[n]) return o[n].exports;
	        var r = o[n] = {
	          i: n,
	          l: !1,
	          exports: {}
	        };
	        return e[n].call(r.exports, r, r.exports, t), r.l = !0, r.exports;
	      }

	      var o = {};
	      return t.m = e, t.c = o, t.i = function (e) {
	        return e;
	      }, t.d = function (e, o, n) {
	        t.o(e, o) || Object.defineProperty(e, o, {
	          configurable: !1,
	          enumerable: !0,
	          get: n
	        });
	      }, t.n = function (e) {
	        var o = e && e.__esModule ? function () {
	          return e["default"];
	        } : function () {
	          return e;
	        };
	        return t.d(o, "a", o), o;
	      }, t.o = function (e, t) {
	        return Object.prototype.hasOwnProperty.call(e, t);
	      }, t.p = "", t(t.s = 2);
	    }([function (e, t, o) {

	      Object.defineProperty(t, "__esModule", {
	        value: !0
	      });
	      var n = o(1);
	      t["default"] = {
	        name: "ROTouch",
	        props: {
	          coordinate: {
	            type: String,
	            "default": "x"
	          }
	        },
	        data: function data() {
	          return {
	            hub: new n.TouchHub()
	          };
	        },
	        created: function created() {
	          var e = this;
	          e.hub.onTouchDown(function (t) {
	            return e.$emit("touch-down", t);
	          }), e.hub.onTouchUp(function (t) {
	            return e.$emit("touch-up", t);
	          }), e.hub.onTouchMove(function (t) {
	            return e.$emit("touch-move", t);
	          }), e.hub.onTouchSlide(function (t) {
	            return e.$emit("touch-slide", t);
	          }), e.hub.onTouchFling(function (t) {
	            return e.$emit("touch-fling", t);
	          });
	        },
	        mounted: function mounted() {
	          this.hub.coordinate = this.coordinate;
	        },
	        render: function render(e) {
	          var t = this,
	              o = {
	            "class": ["ro-touch"],
	            style: {
	              width: "100%",
	              height: "100%"
	            },
	            on: {}
	          };
	          return n.supportTouchEvent ? (o.on.touchstart = t.hub.start.bind(t.hub), o.on.touchmove = t.hub.move.bind(t.hub), o.on.touchend = t.hub.end.bind(t.hub)) : (o.on.mousedown = t.hub.start.bind(t.hub), o.on.mousemove = t.hub.move.bind(t.hub), o.on.mouseup = t.hub.end.bind(t.hub)), e("div", o, this.$slots["default"]);
	        }
	      };
	    }, function (e, t, o) {

	      function n(e, t) {
	        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	      }

	      Object.defineProperty(t, "__esModule", {
	        value: !0
	      });

	      var r = Object.assign || function (e) {
	        for (var t = 1; t < arguments.length; t++) {
	          var o = arguments[t];

	          for (var n in o) {
	            Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
	          }
	        }

	        return e;
	      },
	          u = function () {
	        function e(e, t) {
	          for (var o = 0; o < t.length; o++) {
	            var n = t[o];
	            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
	          }
	        }

	        return function (t, o, n) {
	          return o && e(t.prototype, o), n && e(t, n), t;
	        };
	      }(),
	          i = function i() {},
	          s = t.supportTouchEvent = "ontouchstart" in window;

	      t.TouchHub = function () {
	        function e() {
	          n(this, e);
	          var t = this;
	          t.active = !0, t.speedX = [0, 0], t.speedXIdx = 0, t.speedY = [0, 0], t.speedYIdx = 0, t.minFlingSpeed = 1, t.maxFlingSpeed = 1, t.coordinate = "x", t.moveCoordinate = null, t.startPos = {
	            x: 0,
	            y: 0
	          }, t.currentPos = {
	            x: 0,
	            y: 0
	          }, t.lastRecordTime = -1, t._down = t._up = t._move = t._slide = t._fling = i, s ? console.log("[touch] support touch event") : console.log("[touch] fallback to mouse event");
	        }

	        return u(e, [{
	          key: "start",
	          value: function value(e) {
	            var t = this;

	            if (t.active) {
	              var o = null;
	              s ? o = e.changedTouches[0] : (o = e, t.mouseStatus = 1);
	              var n = o.clientX,
	                  u = o.clientY;
	              t._setStartPosition(n, u), t._setCurrentPosition(n, u), t._down({
	                startPos: r({}, t.startPos),
	                currentPos: r({}, t.currentPos)
	              }), t.lastRecordTime = Date.now();
	            }
	          }
	        }, {
	          key: "move",
	          value: function value(e) {
	            var t = this;

	            if (t.active) {
	              var o = null;
	              if (s) o = e.touches[0];else if (o = e, 1 != t.mouseStatus) return;
	              var n = o.clientX,
	                  r = o.clientY,
	                  u = n - t.currentPos.x,
	                  i = r - t.currentPos.y;

	              t._setCurrentPosition(n, r);

	              var c = Math.abs(u) > Math.abs(i) ? "x" : "y";
	              t.moveCoordinate || (t.moveCoordinate = c), t._move({
	                x: u,
	                y: i,
	                startMoveCoordinate: t.moveCoordinate,
	                moveCoordinate: c
	              });
	              var a = Date.now();
	              t.recordSpeed(u, 1, a), t.recordSpeed(i, 2, a), t.lastRecordTime = a, t.moveCoordinate == t.coordinate && e.preventDefault();
	            }
	          }
	        }, {
	          key: "end",
	          value: function value(e) {
	            var t = this;

	            if (t.active) {
	              var o = null;
	              s ? o = e.changedTouches[0] : (o = e, t.mouseStatus = 0), t._setCurrentPosition(o.clientX, o.clientY);
	              var n = (t.speedX[0] + t.speedX[1]) / 2,
	                  u = (t.speedY[0] + t.speedY[1]) / 2;
	              t._up({
	                startPos: r({}, t.startPos),
	                currentPos: r({}, t.currentPos)
	              }), ("x" === t.coordinate ? Math.abs(n) > t.minFlingSpeed : Math.abs(u) > t.minFlingSpeed) ? t._fling({
	                startPos: r({}, t.startPos),
	                currentPos: r({}, t.currentPos),
	                speedX: n,
	                speedY: u
	              }) : ("x" === t.coordinate ? Math.abs(t.currentPos.x - t.startPos.x) > 0 : Math.abs(t.currentPos.y - t.startPos.y) > 0) && t._slide({
	                startPos: r({}, t.startPos),
	                currentPos: r({}, t.currentPos)
	              }), t.speedX[0] = t.speedX[1] = 0, t.speedY[0] = t.speedY[1] = 0, t.moveCoordinate = null;
	            }
	          }
	        }, {
	          key: "recordSpeed",
	          value: function value(e, t, o) {
	            var n = this,
	                r = o - n.lastRecordTime,
	                u = e / r;
	            1 === t ? n.speedX[1 & n.speedXIdx++] = u : 2 === t && (n.speedY[1 & n.speedYIdx++] = u);
	          }
	        }, {
	          key: "work",
	          value: function value(e) {
	            this.active = e;
	          }
	        }, {
	          key: "_setStartPosition",
	          value: function value(e, t) {
	            this.startPos.x = e, this.startPos.y = t;
	          }
	        }, {
	          key: "_setCurrentPosition",
	          value: function value(e, t) {
	            this.currentPos.x = e, this.currentPos.y = t;
	          }
	        }, {
	          key: "onTouchDown",
	          value: function value(e) {
	            this._down = e;
	          }
	        }, {
	          key: "onTouchUp",
	          value: function value(e) {
	            this._up = e;
	          }
	        }, {
	          key: "onTouchMove",
	          value: function value(e) {
	            this._move = e;
	          }
	        }, {
	          key: "onTouchSlide",
	          value: function value(e) {
	            this._slide = e;
	          }
	        }, {
	          key: "onTouchFling",
	          value: function value(e) {
	            this._fling = e;
	          }
	        }]), e;
	      }();
	    }, function (e, t, o) {

	      Object.defineProperty(t, "__esModule", {
	        value: !0
	      });
	      var n = o(0),
	          r = o.n(n);
	      t["default"] = r.a;
	    }]);
	  });
	});
	var Touch = unwrapExports(touch_min);
	var touch_min_1 = touch_min.touch;

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

	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

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

	var toString = {}.toString;

	var _cof = function _cof(it) {
	  return toString.call(it).slice(8, -1);
	};

	var _core = createCommonjsModule(function (module) {
	  var core = module.exports = {
	    version: '2.6.9'
	  };
	  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _global = createCommonjsModule(function (module) {
	  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
	  : Function('return this')();
	  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _shared = createCommonjsModule(function (module) {
	  var SHARED = '__core-js_shared__';
	  var store = _global[SHARED] || (_global[SHARED] = {});
	  (module.exports = function (key, value) {
	    return store[key] || (store[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: _core.version,
	    mode:  'global',
	    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var px = Math.random();

	var _uid = function _uid(key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _wks = createCommonjsModule(function (module) {
	  var store = _shared('wks');
	  var _Symbol = _global.Symbol;
	  var USE_SYMBOL = typeof _Symbol == 'function';

	  var $exports = module.exports = function (name) {
	    return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : _uid)('Symbol.' + name));
	  };

	  $exports.store = store;
	});

	var TAG = _wks('toStringTag'); // ES3 wrong here

	var ARG = _cof(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function tryGet(it, key) {
	  try {
	    return it[key];
	  } catch (e) {
	    /* empty */
	  }
	};

	var _classof = function _classof(it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
	  : ARG ? _cof(O) // ES3 arguments fallback
	  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _isObject = function _isObject(it) {
	  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function _anObject(it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function _fails(exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', {
	    get: function get() {
	      return 7;
	    }
	  }).a != 7;
	});

	var document$1 = _global.document; // typeof document.createElement is 'object' in old IE

	var is = _isObject(document$1) && _isObject(document$1.createElement);

	var _domCreate = function _domCreate(it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', {
	    get: function get() {
	      return 7;
	    }
	  }).a != 7;
	});

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var _toPrimitive = function _toPrimitive(it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;
	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var _objectDp = {
	  f: f
	};

	var _propertyDesc = function _propertyDesc(bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var _has = function _has(it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _functionToString = _shared('native-function-to-string', Function.toString);

	var _redefine = createCommonjsModule(function (module) {
	  var SRC = _uid('src');
	  var TO_STRING = 'toString';
	  var TPL = ('' + _functionToString).split(TO_STRING);

	  _core.inspectSource = function (it) {
	    return _functionToString.call(it);
	  };

	  (module.exports = function (O, key, val, safe) {
	    var isFunction = typeof val == 'function';
	    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	    if (O[key] === val) return;
	    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));

	    if (O === _global) {
	      O[key] = val;
	    } else if (!safe) {
	      delete O[key];
	      _hide(O, key, val);
	    } else if (O[key]) {
	      O[key] = val;
	    } else {
	      _hide(O, key, val);
	    } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

	  })(Function.prototype, TO_STRING, function toString() {
	    return typeof this == 'function' && this[SRC] || _functionToString.call(this);
	  });
	});

	var test = {};
	test[_wks('toStringTag')] = 'z';

	if (test + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;

	var _toInteger = function _toInteger(it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function _defined(it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// false -> String#codePointAt

	var _stringAt = function _stringAt(TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _aFunction = function _aFunction(it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	var _ctx = function _ctx(fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;

	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

	    out = (own ? target : source)[key]; // bind timers to global for call from export context

	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out; // extend global

	    if (target) _redefine(target, key, out, type & $export.U); // export

	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};

	_global.core = _core; // type bitmap

	$export.F = 1; // forced

	$export.G = 2; // global

	$export.S = 4; // static

	$export.P = 8; // proto

	$export.B = 16; // bind

	$export.W = 32; // wrap

	$export.U = 64; // safe

	$export.R = 128; // real proto method for `library`

	var _export = $export;

	var _iterators = {};

	// eslint-disable-next-line no-prototype-builtins

	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	var _toIobject = function _toIobject(it) {
	  return _iobject(_defined(it));
	};

	var min = Math.min;

	var _toLength = function _toLength(it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	var _toAbsoluteIndex = function _toAbsoluteIndex(index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// true  -> Array#includes

	var _arrayIncludes = function _arrayIncludes(IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if (IS_INCLUDES || index in O) {
	        if (O[index] === el) return IS_INCLUDES || index || 0;
	      }
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var shared = _shared('keys');

	var _sharedKey = function _sharedKey(key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function _objectKeysInternal(object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) {
	    if (key != IE_PROTO) _has(O, key) && result.push(key);
	  } // Don't enum bug & hidden keys


	  while (names.length > i) {
	    if (_has(O, key = names[i++])) {
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	  }

	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;

	  while (length > i) {
	    _objectDp.f(O, P = keys[i++], Properties[P]);
	  }

	  return O;
	};

	var document$2 = _global.document;

	var _html = document$2 && document$2.documentElement;

	var IE_PROTO$1 = _sharedKey('IE_PROTO');

	var Empty = function Empty() {
	  /* empty */
	};

	var PROTOTYPE$1 = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

	var _createDict = function createDict() {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);

	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  _createDict = iframeDocument.F;

	  while (i--) {
	    delete _createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  }

	  return _createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO$1] = O;
	  } else result = _createDict();

	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var def = _objectDp.f;
	var TAG$1 = _wks('toStringTag');

	var _setToStringTag = function _setToStringTag(it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, {
	    configurable: true,
	    value: tag
	  });
	};

	var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

	_hide(IteratorPrototype, _wks('iterator'), function () {
	  return this;
	});

	var _iterCreate = function _iterCreate(Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, {
	    next: _propertyDesc(1, next)
	  });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	var _toObject = function _toObject(it) {
	  return Object(_defined(it));
	};

	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];

	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }

	  return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function returnThis() {
	  return this;
	};

	var _iterDefine = function _iterDefine(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);

	  var getMethod = function getMethod(kind) {
	    if (!BUGGY && kind in proto) return proto[kind];

	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };

	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }

	    return function entries() {
	      return new Constructor(this, kind);
	    };
	  };

	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype; // Fix native

	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));

	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

	      if ( typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  } // fix Array#{values, @@iterator}.name in V8 / FF


	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;

	    $default = function values() {
	      return $native.call(this);
	    };
	  } // Define iterator


	  if ( (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    _hide(proto, ITERATOR, $default);
	  } // Plug for library


	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;

	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }

	  return methods;
	};

	var $at = _stringAt(true); // 21.1.3.27 String.prototype[@@iterator]()

	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target

	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return {
	    value: undefined,
	    done: true
	  };
	  point = $at(O, index);
	  this._i += point.length;
	  return {
	    value: point,
	    done: false
	  };
	});

	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});

	var _addToUnscopables = function _addToUnscopables(key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

	var _iterStep = function _iterStep(done, value) {
	  return {
	    value: value,
	    done: !!done
	  };
	};

	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()


	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target

	  this._i = 0; // next index

	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;

	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }

	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

	_iterators.Arguments = _iterators.Array;
	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$1 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;
	var DOMIterables = {
	  CSSRuleList: true,
	  // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true,
	  // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true,
	  // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;

	  if (proto) {
	    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
	    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) {
	      if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
	    }
	  }
	}

	var _redefineAll = function _redefineAll(target, src, safe) {
	  for (var key in src) {
	    _redefine(target, key, src[key], safe);
	  }

	  return target;
	};

	var _anInstance = function _anInstance(it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
	    throw TypeError(name + ': incorrect invocation!');
	  }

	  return it;
	};

	var _iterCall = function _iterCall(iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	var ITERATOR$2 = _wks('iterator');
	var ArrayProto$1 = Array.prototype;

	var _isArrayIter = function _isArrayIter(it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
	};

	var ITERATOR$3 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3] || it['@@iterator'] || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	  var BREAK = {};
	  var RETURN = {};

	  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	    var iterFn = ITERATOR ? function () {
	      return iterable;
	    } : core_getIteratorMethod(iterable);
	    var f = _ctx(fn, that, entries ? 2 : 1);
	    var index = 0;
	    var length, step, iterator, result;
	    if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!'); // fast case for arrays with default iterator

	    if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
	      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	      if (result === BREAK || result === RETURN) return result;
	    } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	      result = _iterCall(iterator, f, step.value, entries);
	      if (result === BREAK || result === RETURN) return result;
	    }
	  };

	  exports.BREAK = BREAK;
	  exports.RETURN = RETURN;
	});

	var SPECIES = _wks('species');

	var _setSpecies = function _setSpecies(KEY) {
	  var C = _global[KEY];
	  if (_descriptors && C && !C[SPECIES]) _objectDp.f(C, SPECIES, {
	    configurable: true,
	    get: function get() {
	      return this;
	    }
	  });
	};

	var _meta = createCommonjsModule(function (module) {
	  var META = _uid('meta');
	  var setDesc = _objectDp.f;
	  var id = 0;

	  var isExtensible = Object.isExtensible || function () {
	    return true;
	  };

	  var FREEZE = !_fails(function () {
	    return isExtensible(Object.preventExtensions({}));
	  });

	  var setMeta = function setMeta(it) {
	    setDesc(it, META, {
	      value: {
	        i: 'O' + ++id,
	        // object ID
	        w: {} // weak collections IDs

	      }
	    });
	  };

	  var fastKey = function fastKey(it, create) {
	    // return primitive with prefix
	    if (!_isObject(it)) return _typeof(it) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

	    if (!_has(it, META)) {
	      // can't set metadata to uncaught frozen object
	      if (!isExtensible(it)) return 'F'; // not necessary to add metadata

	      if (!create) return 'E'; // add missing metadata

	      setMeta(it); // return object ID
	    }

	    return it[META].i;
	  };

	  var getWeak = function getWeak(it, create) {
	    if (!_has(it, META)) {
	      // can't set metadata to uncaught frozen object
	      if (!isExtensible(it)) return true; // not necessary to add metadata

	      if (!create) return false; // add missing metadata

	      setMeta(it); // return hash weak collections IDs
	    }

	    return it[META].w;
	  }; // add metadata on freeze-family methods calling


	  var onFreeze = function onFreeze(it) {
	    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
	    return it;
	  };

	  var meta = module.exports = {
	    KEY: META,
	    NEED: false,
	    fastKey: fastKey,
	    getWeak: getWeak,
	    onFreeze: onFreeze
	  };
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var _validateCollection = function _validateCollection(it, TYPE) {
	  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};

	var dP$1 = _objectDp.f;
	var fastKey = _meta.fastKey;
	var SIZE = _descriptors ? '_s' : 'size';

	var getEntry = function getEntry(that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index]; // frozen object case

	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      _anInstance(that, C, NAME, '_i');
	      that._t = NAME; // collection type

	      that._i = _objectCreate(null); // index

	      that._f = undefined; // first entry

	      that._l = undefined; // last entry

	      that[SIZE] = 0; // size

	      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }

	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function _delete(key) {
	        var that = _validateCollection(this, NAME);
	        var entry = getEntry(that, key);

	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        }

	        return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn
	      /* , that = undefined */
	      ) {
	        _validateCollection(this, NAME);
	        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;

	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this); // revert to the last existing entry

	          while (entry && entry.r) {
	            entry = entry.p;
	          }
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(_validateCollection(this, NAME), key);
	      }
	    });
	    if (_descriptors) dP$1(C.prototype, 'size', {
	      get: function get() {
	        return _validateCollection(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function def(that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index; // change existing entry

	    if (entry) {
	      entry.v = value; // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true),
	        // <- index
	        k: key,
	        // <- key
	        v: value,
	        // <- value
	        p: prev = that._l,
	        // <- previous entry
	        n: undefined,
	        // <- next entry
	        r: false // <- removed

	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++; // add to index

	      if (index !== 'F') that._i[index] = entry;
	    }

	    return that;
	  },
	  getEntry: getEntry,
	  setStrong: function setStrong(C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    _iterDefine(C, NAME, function (iterated, kind) {
	      this._t = _validateCollection(iterated, NAME); // target

	      this._k = kind; // kind

	      this._l = undefined; // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l; // revert to the last existing entry

	      while (entry && entry.r) {
	        entry = entry.p;
	      } // get next entry


	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return _iterStep(1);
	      } // return step by kind


	      if (kind == 'keys') return _iterStep(0, entry.k);
	      if (kind == 'values') return _iterStep(0, entry.v);
	      return _iterStep(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true); // add [@@species], 23.1.2.2, 23.2.2.2

	    _setSpecies(NAME);
	  }
	};

	var ITERATOR$4 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$4]();

	  riter['return'] = function () {
	    SAFE_CLOSING = true;
	  }; // eslint-disable-next-line no-throw-literal


	  Array.from(riter, function () {
	    throw 2;
	  });
	} catch (e) {
	  /* empty */
	}

	var _iterDetect = function _iterDetect(exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;

	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$4]();

	    iter.next = function () {
	      return {
	        done: safe = true
	      };
	    };

	    arr[ITERATOR$4] = function () {
	      return iter;
	    };

	    exec(arr);
	  } catch (e) {
	    /* empty */
	  }

	  return safe;
	};

	var f$1 = {}.propertyIsEnumerable;
	var _objectPie = {
	  f: f$1
	};

	var gOPD = Object.getOwnPropertyDescriptor;
	var f$2 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) {
	    /* empty */
	  }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};
	var _objectGopd = {
	  f: f$2
	};

	/* eslint-disable no-proto */

	var check = function check(O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};

	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	  function (test, buggy, set) {
	    try {
	      set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	      set(test, []);
	      buggy = !(test instanceof Array);
	    } catch (e) {
	      buggy = true;
	    }

	    return function setPrototypeOf(O, proto) {
	      check(O, proto);
	      if (buggy) O.__proto__ = proto;else set(O, proto);
	      return O;
	    };
	  }({}, false) : undefined),
	  check: check
	};

	var setPrototypeOf = _setProto.set;

	var _inheritIfRequired = function _inheritIfRequired(that, target, C) {
	  var S = target.constructor;
	  var P;

	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  }

	  return that;
	};

	var _collection = function _collection(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = _global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};

	  var fixMethod = function fixMethod(KEY) {
	    var fn = proto[KEY];
	    _redefine(proto, KEY, KEY == 'delete' ? function (a) {
	      return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'has' ? function has(a) {
	      return IS_WEAK && !_isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'get' ? function get(a) {
	      return IS_WEAK && !_isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	    } : KEY == 'add' ? function add(a) {
	      fn.call(this, a === 0 ? 0 : a);
	      return this;
	    } : function set(a, b) {
	      fn.call(this, a === 0 ? 0 : a, b);
	      return this;
	    });
	  };

	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    _redefineAll(C.prototype, methods);
	    _meta.NEED = true;
	  } else {
	    var instance = new C(); // early implementations not supports chaining

	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance; // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false

	    var THROWS_ON_PRIMITIVES = _fails(function () {
	      instance.has(1);
	    }); // most early implementations doesn't supports iterables, most modern - not close it correctly

	    var ACCEPT_ITERABLES = _iterDetect(function (iter) {
	      new C(iter);
	    }); // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same

	    var BUGGY_ZERO = !IS_WEAK && _fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C();
	      var index = 5;

	      while (index--) {
	        $instance[ADDER](index, index);
	      }

	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        _anInstance(target, C, NAME);
	        var that = _inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER); // weak collections should not contains .clear method

	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }

	  _setToStringTag(C, NAME);
	  O[NAME] = C;
	  _export(_export.G + _export.W + _export.F * (C != Base), O);
	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);
	  return C;
	};

	var SET = 'Set'; // 23.2 Set Objects

	var es6_set = _collection(SET, function (get) {
	  return function Set() {
	    return get(this, arguments.length > 0 ? arguments[0] : undefined);
	  };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, _collectionStrong);

	var _arrayFromIterable = function _arrayFromIterable(iter, ITERATOR) {
	  var result = [];
	  _forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};

	var _collectionToJson = function _collectionToJson(NAME) {
	  return function toJSON() {
	    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return _arrayFromIterable(this);
	  };
	};

	_export(_export.P + _export.R, 'Set', {
	  toJSON: _collectionToJson('Set')
	});

	var _setCollectionOf = function _setCollectionOf(COLLECTION) {
	  _export(_export.S, COLLECTION, {
	    of: function of() {
	      var length = arguments.length;
	      var A = new Array(length);

	      while (length--) {
	        A[length] = arguments[length];
	      }

	      return new this(A);
	    }
	  });
	};

	_setCollectionOf('Set');

	var _setCollectionFrom = function _setCollectionFrom(COLLECTION) {
	  _export(_export.S, COLLECTION, {
	    from: function from(source
	    /* , mapFn, thisArg */
	    ) {
	      var mapFn = arguments[1];
	      var mapping, A, n, cb;
	      _aFunction(this);
	      mapping = mapFn !== undefined;
	      if (mapping) _aFunction(mapFn);
	      if (source == undefined) return new this();
	      A = [];

	      if (mapping) {
	        n = 0;
	        cb = _ctx(mapFn, arguments[2], 2);
	        _forOf(source, false, function (nextItem) {
	          A.push(cb(nextItem, n++));
	        });
	      } else {
	        _forOf(source, false, A.push, A);
	      }

	      return new this(A);
	    }
	  });
	};

	_setCollectionFrom('Set');

	var set = _core.Set;

	exports.DatePicker = datePicker;
	exports.Picker = Picker;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
