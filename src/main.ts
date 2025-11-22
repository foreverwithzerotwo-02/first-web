import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'

// 引入插件normalize.css，清除css默认样式
import 'normalize.css'

// 引入插件animate.css，添加动画效果
import 'animate.css';

// 引入自定义编辑器样式
import './styles/editor.scss'

import 'nprogress/nprogress.css' // 导入 NProgress 样式

// 引入全局样式文件
import './styles/global.scss'
import './styles/func.scss'

// 自定指令-给元素添加提示
import tip from './directives/tip';

import router from './router/index'; // 引入你刚刚创建的 router

const app = createApp(App);

app.use(router); // 挂载 router

app.directive('tip', tip); // 注册自定义指令

app.use(createPinia()) //注册 pinia

app.mount('#app');
