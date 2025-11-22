<template>
  <div class="dashboard-container">
    <!-- 顶部管理员信息区域 -->
    <div class="admin-info-card">
      <div class="admin-avatar">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="管理员头像" />
        <div class="online-status"></div>
      </div>
      <div class="admin-details">
        <h2 class="admin-name">张明华</h2>
        <div class="admin-role">超级管理员</div>
        <div class="admin-meta">
          <span><i class="icon-email">📧</i> admin@example.com</span>
          <span><i class="icon-time">🕒</i> 最后登录: 2025-11-18 09:30</span>
        </div>
      </div>
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-value">1,234</div>
          <div class="stat-label">今日访问</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">89</div>
          <div class="stat-label">待处理</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">98.5%</div>
          <div class="stat-label">系统健康</div>
        </div>
      </div>
    </div>

    <!-- 核心数据卡片 -->
    <div class="core-metrics">
      <div class="metric-card forum">
        <div class="metric-icon">💬</div>
        <div class="metric-content">
          <div class="metric-value">3,456</div>
          <div class="metric-label">论坛总帖子</div>
          <div class="metric-trend up">↑ 12.5%</div>
        </div>
      </div>
      <div class="metric-card course">
        <div class="metric-icon">📚</div>
        <div class="metric-content">
          <div class="metric-value">289</div>
          <div class="metric-label">在线课程</div>
          <div class="metric-trend up">↑ 8.3%</div>
        </div>
      </div>
      <div class="metric-card consult">
        <div class="metric-icon">🎯</div>
        <div class="metric-content">
          <div class="metric-value">1,067</div>
          <div class="metric-label">咨询订单</div>
          <div class="metric-trend down">↓ 3.2%</div>
        </div>
      </div>
      <div class="metric-card revenue">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <div class="metric-value">¥128K</div>
          <div class="metric-label">本月收入</div>
          <div class="metric-trend up">↑ 25.7%</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 用户增长趋势 -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>用户增长趋势</h3>
          <div class="chart-legend">
            <span class="legend-item"><i class="dot forum-color"></i>论坛用户</span>
            <span class="legend-item"><i class="dot course-color"></i>课程学员</span>
            <span class="legend-item"><i class="dot consult-color"></i>咨询客户</span>
          </div>
        </div>
        <div ref="userTrendChart" class="chart-content"></div>
      </div>

      <!-- 板块活跃度 -->
      <div class="chart-card medium">
        <div class="chart-header">
          <h3>板块活跃度分布</h3>
        </div>
        <div ref="activityChart" class="chart-content"></div>
      </div>

      <!-- 收入来源 -->
      <div class="chart-card medium">
        <div class="chart-header">
          <h3>收入来源占比</h3>
        </div>
        <div ref="revenueChart" class="chart-content"></div>
      </div>

      <!-- 实时数据流 -->
      <div class="chart-card medium">
        <div class="chart-header">
          <h3>实时访问量</h3>
        </div>
        <div ref="realtimeChart" class="chart-content"></div>
      </div>

      <!-- 课程完成率 -->
      <div class="chart-card medium">
        <div class="chart-header">
          <h3>课程完成率 TOP 10</h3>
        </div>
        <div ref="courseCompletionChart" class="chart-content"></div>
      </div>

      <!-- 热门话题 -->
      <div class="chart-card large">
        <div class="chart-header">
          <h3>论坛热门话题词云</h3>
        </div>
        <div ref="wordCloudChart" class="chart-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

// 图表实例引用
const userTrendChart = ref<HTMLElement>();
const activityChart = ref<HTMLElement>();
const revenueChart = ref<HTMLElement>();
const realtimeChart = ref<HTMLElement>();
const courseCompletionChart = ref<HTMLElement>();
const wordCloudChart = ref<HTMLElement>();

let chartInstances: echarts.ECharts[] = [];
let realtimeInterval: number;

// 初始化用户增长趋势图
const initUserTrendChart = () => {
  if (!userTrendChart.value) return;
  
  const chart = echarts.init(userTrendChart.value);
  chartInstances.push(chart);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: { color: '#fff' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }
    },
    series: [
      {
        name: '论坛用户',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [1200, 1320, 1450, 1580, 1750, 1920, 2100, 2350, 2580, 2850, 3100],
        itemStyle: { color: '#5470c6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
          ])
        }
      },
      {
        name: '课程学员',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [800, 950, 1100, 1280, 1450, 1650, 1850, 2100, 2350, 2650, 2900],
        itemStyle: { color: '#91cc75' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(145, 204, 117, 0.5)' },
            { offset: 1, color: 'rgba(145, 204, 117, 0.1)' }
          ])
        }
      },
      {
        name: '咨询客户',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [600, 720, 850, 980, 1120, 1280, 1450, 1650, 1850, 2080, 2300],
        itemStyle: { color: '#fac858' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 200, 88, 0.5)' },
            { offset: 1, color: 'rgba(250, 200, 88, 0.1)' }
          ])
        }
      }
    ]
  };

  chart.setOption(option);
};

// 初始化活跃度雷达图
const initActivityChart = () => {
  if (!activityChart.value) return;
  
  const chart = echarts.init(activityChart.value);
  chartInstances.push(chart);

  const option: EChartsOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '日均帖子', max: 100 },
        { name: '用户互动', max: 100 },
        { name: '内容质量', max: 100 },
        { name: '响应速度', max: 100 },
        { name: '用户满意度', max: 100 }
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(84, 112, 198, 0.1)', 'rgba(84, 112, 198, 0.2)', 
                  'rgba(84, 112, 198, 0.3)', 'rgba(84, 112, 198, 0.4)']
        }
      }
    },
    series: [{
      name: '板块活跃度',
      type: 'radar',
      data: [
        {
          value: [85, 92, 78, 88, 90],
          name: '论坛',
          itemStyle: { color: '#5470c6' },
          areaStyle: { color: 'rgba(84, 112, 198, 0.3)' }
        },
        {
          value: [78, 85, 92, 82, 88],
          name: '课程',
          itemStyle: { color: '#91cc75' },
          areaStyle: { color: 'rgba(145, 204, 117, 0.3)' }
        },
        {
          value: [90, 88, 85, 95, 92],
          name: '咨询',
          itemStyle: { color: '#fac858' },
          areaStyle: { color: 'rgba(250, 200, 88, 0.3)' }
        }
      ]
    }]
  };

  chart.setOption(option);
};

// 初始化收入饼图
const initRevenueChart = () => {
  if (!revenueChart.value) return;
  
  const chart = echarts.init(revenueChart.value);
  chartInstances.push(chart);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '收入来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 45000, name: '课程收入', itemStyle: { color: '#91cc75' } },
          { value: 58000, name: '咨询收入', itemStyle: { color: '#fac858' } },
          { value: 15000, name: '会员收入', itemStyle: { color: '#5470c6' } },
          { value: 10000, name: '广告收入', itemStyle: { color: '#ee6666' } }
        ]
      }
    ]
  };

  chart.setOption(option);
};

// 初始化实时数据图
const initRealtimeChart = () => {
  if (!realtimeChart.value) return;
  
  const chart = echarts.init(realtimeChart.value);
  chartInstances.push(chart);

  let data: number[] = [];
  let now = new Date();
  
  for (let i = 0; i < 60; i++) {
    data.push(Math.random() * 100 + 50);
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return params[0].name + '<br/>访问量: ' + Math.round(params[0].value);
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((_, i) => {
        let time = new Date(now.getTime() - (59 - i) * 1000);
        return time.getHours() + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2);
      }),
      axisLine: { lineStyle: { color: '#666' } }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '10%'],
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }
    },
    series: [{
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: data,
      itemStyle: { color: '#ee6666' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(238, 102, 102, 0.5)' },
          { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
        ])
      }
    }]
  };

  chart.setOption(option);

  // 实时更新数据
  realtimeInterval = setInterval(() => {
    data.shift();
    data.push(Math.random() * 100 + 50);
    
    now = new Date();
    const timeData = data.map((_, i) => {
      let time = new Date(now.getTime() - (59 - i) * 1000);
      return time.getHours() + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2);
    });

    chart.setOption({
      xAxis: { data: timeData },
      series: [{ data: data }]
    });
  }, 1000);
};

// 初始化课程完成率柱状图
const initCourseCompletionChart = () => {
  if (!courseCompletionChart.value) return;
  
  const chart = echarts.init(courseCompletionChart.value);
  chartInstances.push(chart);

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: '#666' } },
      splitLine: { lineStyle: { color: '#eee', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: ['Python入门', 'Web开发', '数据分析', '机器学习', 'UI设计', 
             '产品经理', '项目管理', '市场营销', '财务管理', 'HR管理'],
      axisLine: { lineStyle: { color: '#666' } }
    },
    series: [{
      name: '完成率',
      type: 'bar',
      data: [95, 92, 89, 87, 85, 83, 81, 78, 75, 72],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%'
      }
    }]
  };

  chart.setOption(option);
};

// 初始化词云图
const initWordCloudChart = () => {
  if (!wordCloudChart.value) return;
  
  const chart = echarts.init(wordCloudChart.value);
  chartInstances.push(chart);

  const keywords = [
    { name: 'Vue3', value: 1500 },
    { name: 'TypeScript', value: 1200 },
    { name: 'Python', value: 1100 },
    { name: 'JavaScript', value: 1000 },
    { name: 'React', value: 950 },
    { name: '前端开发', value: 900 },
    { name: '后端开发', value: 850 },
    { name: '数据库', value: 800 },
    { name: '算法', value: 750 },
    { name: 'AI', value: 720 },
    { name: '机器学习', value: 680 },
    { name: '云计算', value: 650 },
    { name: 'Docker', value: 620 },
    { name: 'Kubernetes', value: 600 },
    { name: 'Node.js', value: 580 },
    { name: 'Git', value: 550 },
    { name: 'UI设计', value: 520 },
    { name: '产品设计', value: 500 },
    { name: '敏捷开发', value: 480 },
    { name: 'DevOps', value: 450 }
  ];

  const option: EChartsOption = {
    tooltip: {
      show: true
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      sizeRange: [14, 60],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      data: keywords
    }]
  };

  chart.setOption(option);
};

// 窗口大小改变时重新调整图表
const handleResize = () => {
  chartInstances.forEach(chart => chart.resize());
};

onMounted(() => {
  initUserTrendChart();
  initActivityChart();
  initRevenueChart();
  initRealtimeChart();
  initCourseCompletionChart();
  initWordCloudChart();

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  chartInstances.forEach(chart => chart.dispose());
  clearInterval(realtimeInterval);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.admin-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.5s ease;

  .admin-avatar {
    position: relative;
    
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 4px solid #667eea;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .online-status {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 18px;
      height: 18px;
      background: #52c41a;
      border: 3px solid #fff;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }

  .admin-details {
    flex: 1;

    .admin-name {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px 0;
    }

    .admin-role {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .admin-meta {
      display: flex;
      gap: 20px;
      color: #666;
      font-size: 14px;

      span {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  .quick-stats {
    display: flex;
    gap: 40px;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }
    }
  }
}

.core-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  .metric-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .metric-icon {
      font-size: 48px;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
    }

    &.forum .metric-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    &.course .metric-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    &.consult .metric-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    &.revenue .metric-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .metric-content {
      flex: 1;

      .metric-value {
        font-size: 32px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 4px;
      }

      .metric-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }

      .metric-trend {
        font-size: 14px;
        font-weight: 600;

        &.up {
          color: #52c41a;
        }

        &.down {
          color: #ff4d4f;
        }
      }
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  .chart-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: fadeInUp 0.6s ease;

    &.large {
      grid-column: span 2;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
      }

      .chart-legend {
        display: flex;
        gap: 20px;
        font-size: 14px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;

            &.forum-color {
              background: #5470c6;
            }

            &.course-color {
              background: #91cc75;
            }

            &.consult-color {
              background: #fac858;
            }
          }
        }
      }
    }

    .chart-content {
      height: 300px;
    }

    &.large .chart-content {
      height: 350px;
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
  }
}

@media (max-width: 1400px) {
  .core-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-info-card {
    flex-direction: column;
    text-align: center;

    .quick-stats {
      width: 100%;
      justify-content: space-around;
    }
  }

  .core-metrics {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;

    .chart-card.large {
      grid-column: span 1;
    }
  }
}
</style>