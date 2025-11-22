import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// 给元素添加提示
export default {
    mounted(el: HTMLElement, binding: any) {
        tippy(el, {
            content: binding.value,
            placement: 'bottom', // 提示位置
        });
    }
}