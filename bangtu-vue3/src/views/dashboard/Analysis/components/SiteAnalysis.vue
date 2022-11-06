<template>
  <Card style="border-radius: 8px">
    <div class="course">
      <div class="c-left">
        <div class="title-tip">课程发布</div>
        <div class="course-total">
          <div class="tit">课程总数量</div>
          <div class="total">{{ countfo.totalCourseCout || 0 }}</div>
        </div>
        <div class="course-total">
          <div class="tit">本周课程数量</div>
          <div class="total">{{ countfo.weekCourseCout || 0 }}</div>
        </div>
      </div>
      <div class="c-right">
        <div class="rt-top">
          <div class="title-tip1">近一周课程发布</div>
          <div class="top-tie">
            <a-radio-group v-model:value="queryType" @change="onChange">
              <a-radio-button :value="1">本月</a-radio-button>
              <a-radio-button :value="2">本年</a-radio-button>
            </a-radio-group>
            <a-range-picker v-model:value="times" format="YYYY-MM-DD" style="width: 240px" @change="onChange" />
          </div>
        </div>
        <div>
          <div ref="chartRef" :style="{ width, height }"></div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { useECharts } from '/@/hooks/web/useECharts';
  import type { Dayjs } from 'dayjs';
  import { pushCourseEchart } from '../api';

  const props = defineProps({
    loading: Boolean,
    countfo: Object,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '400px',
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const queryType = ref<Number>(1);
  const times = ref<Dayjs>();
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const lineXData = ref([]);
  const lineYData = ref([]);

  function onChange() {
    console.log(times.value);
    initLogInfo();
  }

  function initLogInfo() {
    pushCourseEchart({ queryType: queryType.value, endTime: '', startTime: '' }).then((res) => {
      if (res.success) {
        const data = res.result.list;
        let x = [];
        let y = [];
        data.length > 0 &&
          data.map((it) => {
            x.push(it.x);
            y.push(it.y);
          });
        lineXData.value = x;
        lineYData.value = y;
      }
    });
  }
  initLogInfo();

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: lineXData.value,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: lineYData.value,
            type: 'line',
            smooth: true,
            symbolSize: 0,
            areaStyle: {
              opacity: 0.35,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#7895FF',
                },
                {
                  offset: 0,
                  color: '#3359E0',
                },
              ]),
            },
            itemStyle: {
              color: '#5664FF',
            },
          },
        ],
      });
    },
    { immediate: true }
  );
  watch(
    lineXData,
    () => {
      if (lineXData.value.length == 0) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: lineXData.value,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: lineYData.value,
            type: 'line',
            smooth: true,
            symbolSize: 0,
            areaStyle: {
              opacity: 0.35,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#7895FF',
                },
                {
                  offset: 0,
                  color: '#3359E0',
                },
              ]),
            },
            itemStyle: {
              color: '#5664FF',
            },
          },
        ],
      });
    },
    { immediate: true }
  );
</script>
<style lang="less" scoped>
  .top-tie {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 40%;
  }

  .course {
    display: flex;

    .c-left {
      width: 16%;
      box-sizing: border-box;

      .course-total {
        margin-top: 40px;
        padding-left: 30px;
      }

      .tit {
        color: #7c8db5;
        font-size: 18px;
      }

      .total {
        font-size: 30px;
        color: #070f29;
      }
    }

    .c-right {
      width: 84%;
    }

    .title-tip {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      position: relative;

      &::before {
        content: '';
        display: block;
        width: 6px;
        height: 28px;
        background: #2c6afd;
        margin-right: 14px;
      }
    }

    .rt-top {
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title-tip1 {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        position: relative;
      }
    }
  }
</style>
