<template>
    <div class="date-picker-container">
        <div class="fix-float">
            <div class="column">
                <Picker v-model="year" :slots="yearSlots"></Picker>
            </div>
            <div class="column">
                <Picker v-model="month" :slots="monthSlots"></Picker>
            </div>
            <div class="column">
                <Picker v-model="date" :slots="dateSlots"></Picker>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        _format,
        dateNow,
        getMonthDay,
    } from './lib/utils.js';
    import Picker from './picker.vue';
    /**
     * 日期选择
     */
    export default {
        name: 'DatePicker',
        components: {
            Picker,
        },
        props: [
            'value',
        ],
        data() {
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
                dateSlots: [],
            };
        },
        computed: {
            str() {
                return `${this.year}-${_format(this.month)}-${_format(this.date)}`;
            },
        },
        watch: {
            str(val) {
                this.$emit('input', val);
            },
            year() {
                const date = getMonthDay(this.year, this.month);
                if (date !== this.dateSlots.length) {
                    this.generateDateSlots(date);
                }
            },
            month() {
                const date = getMonthDay(this.year, this.month);
                if (date !== this.dateSlots.length) {
                    this.generateDateSlots(date);
                }
            },
        },
        methods: {
            /**
             * 生成dateSlots
             *
             * @param {} date 多少天
             */
            generateDateSlots(date) {
                const slots = [];
                for (let i = 1; i <= date; i++) {
                    slots.push({
                        value: i,
                        text: i,
                    });
                }
                this.dateSlots = slots;
            },
        },
        created() {
            // 生成slots
            // 创建yearSlots
            const now = dateNow();
            const year = now.getUTCFullYear();
            const yearSlots = [];
            for (let i = 1900; i <= year; i++) {
                yearSlots.push({
                    value: i,
                    text: i,
                });
            }
            this.yearSlots = yearSlots;

            // 创建month
            const monthSlots = [];
            for (let i = 1; i <= 12; i++) {
                monthSlots.push({
                    value: i,
                    text: i,
                });
            }
            this.monthSlots = monthSlots;

            // 创建date，需要根据对应的month创建date
            this.generateDateSlots(this.year, this.month);
        },
        mounted() {
            // 设定默认值
            if (this.value && this.value.length > 0) {
                const chunks = this.value.split('-');
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
        },
    };
</script>

<style lang="less">
    @import "./lib/style/util.less";
    .date-picker-container {
        .column {
            float: left;
            width: 33.33%;
        }
    }
</style>