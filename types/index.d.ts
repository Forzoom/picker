import { CombinedVueInstance, Vue } from 'vue/types/vue';

interface PickerData {
    /**
     * 纵向的移动
     *
     *  tip: 其中-1表示未知状态
     */
    y: number;
    /**
     * 容器大小
     */
    containerRect: {
        width: number,
        height: number,
        left: number,
        top: number,
    };
    /**
     * 是否正在滑动过程中
     */
    inTouchMove: boolean;
}

interface PickerProp {

}

export const Picker: typeof Vue;
export const DatePicker: typeof Vue;