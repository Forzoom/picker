<template>
    <div>
        <Touch coordinate="y"
            @touch-down="onTouchStart"
            @touch-move="onTouchMove"
            @touch-up="onTouchEnd"
            @touch-fling="onTouchFling"
            @touch-slide="onTouchSlide">
            <div ref="container" class="picker-container">
                <div class="picker-display"></div>
                <div class="picker-slots" :style="{'transform': 'translate3d(0,' + y + 'px,0)'}">
                    <div class="picker-slot" v-for="(slot, index) in slots" :key="index">
                        {{slot.text}}
                    </div>
                </div>
            </div>
        </Touch>
    </div>
</template>

<script>
    import Touch from '@forzoom/touch';
    /**
     * 选择器
     */
    export default {
        name: 'Picker',
        components: {
            Touch,
        },
        props: {
            // 所有的内容
            slots: {
                type: Array,
            },
            /**
             * 外部传入值
             */
            value: {
                required: true,
            },
            /**
             * 加速度
             */
            accelerate: {
                type: Number,
                default: 0.012,
            },
        },
        data: function() {
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
                    top: 0,
                },
                /**
                 * 是否正在滑动过程中
                 */
                inTouchMove: false,
            };
        },
        computed: {
            /**
             * 每个slot的大小
             */
            slotHeight() {
                const rect = this.containerRect;
                if (!rect || !rect.height) {
                    return 0;
                }
                return rect.height / 5;
            },
            /**
             * 最小的y值
             */
            minY() {
                return (-this.slots.length + 3) * this.slotHeight;
            },
            /**
             * 最大的y值
             */
            maxY() {
                return 2 * this.slotHeight;
            },
            /**
             * 所生成的index
             */
            index() {
                return (this.maxY - this.round(this.y)) / this.slotHeight;
            },
            /**
             * 根据slots生成的indexMap
             */
            indexMap() {
                const result = {};
                for (let i = 0, len = this.slots.length; i < len; i++) {
                    result[i] = this.slots[i];
                }
                return result;
            },
            /**
             * 根据slots生成的valueMap
             */
            valueMap() {
                const result = {};
                for (let i = 0, len = this.slots.length; i < len; i++) {
                    result[this.slots[i].value] = Object.assign({
                        index: i,
                    }, this.slots[i]);
                }
                return result;
            },
        },
        watch: {
            /**
             * 外界传入的值发生了变化
             */
            '$props.value': function(val) {
                if (!this.inTouchMove) {
                    this.updatePosition();
                }
            },
            /**
             * 最小的y值修改
             */
            minY(val) {
                if (this.y < val) {
                    this.y = val;
                }
            },
            /**
             * 最大的y值
             */
            maxY(val) {
                if (this.y > val) {
                    this.y = val;
                }
            },
            /**
             * 检查索引变化
             *
             * 只有变化的时候才通知
             */
            index(newVal, oldVal) {
                if (newVal !== oldVal && this.indexMap[newVal]) {
                    this.$emit('input', this.indexMap[newVal].value);
                }
            },
        },
        methods: {
            /**
             * 开始
             */
            onTouchStart() {
                this.inTouchMove = true;
            },
            /**
             * 移动
             */
            onTouchMove({ y, }) {
                this.y = this.range(this.y + y);
            },
            /**
             * 结束
             */
            onTouchEnd() {
                this.inTouchMove = false;
            },
            /**
             * touch-fling事件相关的处理函数
             *
             * @param {} speedX
             */
            onTouchFling({ speedY, }) {
                const vm = this;
                const height = vm.slotHeight;
                let distance = speedY * speedY / 2 / vm.accelerate;
                distance = speedY < 0 ? -distance : distance;
                const duration = Math.abs(speedY / vm.accelerate);
                vm.abortScroll = false;
                const resultY = vm.y + distance;
                const floorY = vm.range(resultY);
                if (resultY === floorY) {
                    vm.scroll(
                        vm.round(resultY, 0, height) - vm.y,
                        duration,
                        (val) => Math.sqrt(1 - (val - 1) * (val - 1))
                    );
                } else {
                    const newDistance = floorY - vm.y;
                    const newDuration = Math.sqrt(Math.abs(newDistance) / (2 * vm.accelerate));
                    const ratio = newDuration / duration;
                    const _cache = Math.sqrt(1 - (ratio - 1) * (ratio - 1));
                    vm.scroll(
                        newDistance,
                        newDuration,
                        (val) => Math.sqrt(1 - (ratio * val - 1) * (ratio * val - 1)) / _cache
                    );
                }
            },
            /**
             * 处理slide事件
             */
            onTouchSlide() {
                // 移动到slot的位置
                // 计算slot的位置
                const vm = this;
                const y = vm.y;
                const slotY = vm.round(vm.range(y));
                const distance = slotY - y;
                vm.abortScroll = false;
                vm.scroll(
                    distance,
                    Math.abs(distance / 0.6),
                    (val) => val
                );
            },
            /**
             * 滑动DateSelect组件
             *
             * @param {Number} distance
             * @param {Number} duration
             * @param {Function} interpolation 插值函数
             */
            scroll(distance, duration, interpolation, onComplete, onAbort) {
                const vm = this;
                const start = Date.now();
                const y = vm.y;
                if (distance === 0) {
                    onComplete && onComplete();
                    return;
                }

                function callback() {
                    const diff = Date.now() - start;
                    if (vm.abortScroll) {
                        // do nothing
                        vm.abortScroll = false;
                        onAbort && onAbort();
                    } else if (diff < duration) {
                        // 计算最终的滑动距离
                        const diffY = interpolation(diff / duration) * distance;
                        vm.y = y + diffY;
                        window.requestAnimationFrame(callback); // 下次请求
                    } else if (diff >= duration) {
                        const diffY = interpolation(1) * distance;
                        vm.y = y + diffY;
                        onComplete && onComplete();
                    }
                };

                window.requestAnimationFrame(callback);
            },
            /**
             * 数值限定
             */
            range: function(value) {
                return Math.min(Math.max(value, this.minY), this.maxY);
            },
            /**
             * 四舍五入
             */
            round: function(value) {
                return this.minY + Math.round((value - this.minY) / this.slotHeight) * this.slotHeight;
            },
            /**
             * 根据当前的值来更新位置
             */
            updatePosition() {
                // 跳转到当前的位置
                const slotData = this.valueMap[this.value];
                if (slotData) {
                    const index = slotData.index;
                    this.y = this.maxY - index * this.slotHeight;
                } else {
                    console.log('cannot find value', this.value);
                }
            },
        },
        /**
         * 锚定
         */
        mounted() {
            const defaultRect = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            };
            // 容器大小
            const containerRect = (this.$refs.container.getBoundingClientRect && this.$refs.container.getBoundingClientRect()) || defaultRect;
            this.containerRect = {
                left: containerRect.left,
                top: containerRect.top,
                width: containerRect.width,
                height: containerRect.height,
            };

            this.updatePosition();
        },
    };
</script>

<style lang="less">
    @import "./lib/style/util.less";
    @import "./lib/style/mixins.less";

    // 显示内容
    .picker-container {
        position: relative;
        .xtr(height, 150);
        overflow: hidden;
    }
    .picker-display {
        position: absolute;
        .xtr(top, 60);
        width: 100%;
        .xtr(height, 30);
        .xtr(font-size, 18);
        background-color: rgba(0,0,0,0.1);
    }
    .picker-slot {
        .xtr(height, 30);
        .xtr(font-size, 18);
        .xtr(line-height, 30);
        text-align: center;
    }
</style>