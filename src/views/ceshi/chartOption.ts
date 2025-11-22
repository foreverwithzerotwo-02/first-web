import **as* echarts from 'echarts/core';
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 按需引入 ECharts 模块
echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

// ECharts 配置项 (Option)
export const lineChartOption: echarts.EChartsOption = {
  // === 1. 调整图表位置，使其充满容器 ===
  grid: {
    top: '10%',
    left: '0',
    right: '0',
    bottom: '0',
    containLabel: false // 我们不需要标签空间
  },
  
  // === 2. X轴：时间/日期 ===
  xAxis: {
    type: 'category',
    boundaryGap: false, // 关键：让面积图贴合Y轴边缘
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    
    // --- 极简设计 ---
    axisLabel: { // 轴标签
      show: true,
      color: '#AAB8D7' // 坐标轴文字颜色
    },
    axisLine: { // 轴线
      show: false 
    },
    axisTick: { // 轴刻度
      show: false
    }
  },

  // === 3. Y轴：访问量 ===
  yAxis: {
    type: 'value',
    
    // --- 极简设计：隐藏Y轴所有元素 ---
    axisLabel: { show: false }, // 隐藏标签
    axisLine: { show: false }, // 隐藏轴线
    axisTick: { show: false }, // 隐藏刻度
    splitLine: { show: false } // 隐藏网格线
  },

  // === 4. 提示框：交互核心 ===
  tooltip: {
    trigger: 'axis', // 轴触发
    axisPointer: {
      type: 'line', // 使用 'line' 而不是 'shadow' 更简洁
      lineStyle: {
        color: '#8E9BBD',
        type: 'dashed'
      }
    },
    backgroundColor: 'rgba(10, 24, 60, 0.8)', // 提示框背景色
    borderColor: '#3A4DE9', // 边框
    borderWidth: 1,
    textStyle: {
      color: '#FFF' // 文字颜色
    },
    formatter: (params: any) => {
      // 自定义 formatter
      const param = params[0];
      return `
        <div style="padding: 4px 8px;">
          <div>${param.name}</div>
          <div style="margin-top: 8px;">
            <span style="display:inline-block; margin-right:5px; border-radius:50%; width:10px; height:10px; background-color:${param.color};"></span>
            ${param.seriesName}：<strong style="font-size: 14px; margin-left: 4px;">${param.value}</strong>
          </div>
        </div>
      `;
    }
  },
  
  // === 5. 系列（Series）：图表核心与“炫酷”特效 ===
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true, // 关键：平滑曲线
      showSymbol: false, // 隐藏数据点，使线条更流畅
      data: [820, 932, 901, 934, 1290, 1330, 1320],

      // --- 线的样式 ---
      lineStyle: {
        width: 3, // 线条宽度
        color: '#3A4DE9' // 线条颜色
      },
      
      // --- 渐变面积填充：炫酷核心 ---
      areaStyle: {
        // 使用 ECharts 的线性渐变
        color: new echarts.graphic.LinearGradient(
          0, 0, 0, 1, // (x0, y0, x1, y1) - 顶部到底部渐变
          [
            {
              offset: 0,
              color: 'rgba(58, 77, 233, 0.4)' // 渐变开始色（较浓）
            },
            {
              offset: 1,
              color: 'rgba(58, 77, 233, 0.0)' // 渐变结束色（透明）
            }
          ]
        )
      },

      // --- 鼠标悬停时的高亮效果 ---
      emphasis: {
        focus: 'series', // 聚焦高亮
        lineStyle: {
          width: 4 // 悬停时线条加粗
        }
      }
    }
  ]
};