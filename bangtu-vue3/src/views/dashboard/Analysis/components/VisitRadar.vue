<template>
  <Card :loading="loading" style="border-radius: 8px">
    <template v-if="userInfo.userRoleType == 1">
      <div class="title-tip">统计趋势图</div>
      <div>
        <div class="top-tie">
          <a-radio-group v-model:value="paramType" @change="onChange">
            <a-radio-button :value="1">注册量</a-radio-button>
            <a-radio-button :value="2">销售额</a-radio-button>
            <a-radio-button :value="3">提现金额</a-radio-button>
          </a-radio-group>
          <a-radio-group v-model:value="queryType" @change="onChange">
            <a-radio-button :value="1">本月</a-radio-button>
            <a-radio-button :value="2">本年</a-radio-button>
          </a-radio-group>
          <a-range-picker v-model:value="times" format="YYYY-MM-DD" style="width: 240px" @change="onChange" />
        </div>
        <!-- <div :style="{ height }" v-if="lineXData.length == 0 && lineYData.length == 0" class="paddingTop">
        <a-empty />
      </div> -->
        <div ref="chartRef" :style="{ width, height }"></div>
      </div>
    </template>
    <template v-if="userInfo.userRoleType == 2">
      <div class="title-tip">销售趋势图</div>
      <div>
        <div class="top-tie">
          <a-radio-group v-model:value="queryType" @change="onChange">
            <a-radio-button :value="1">本月</a-radio-button>
            <a-radio-button :value="2">本年</a-radio-button>
          </a-radio-group>
          <a-range-picker v-model:value="times" format="YYYY-MM-DD" style="width: 240px" @change="onChange" />
        </div>
        <!-- <div :style="{ height }" v-if="lineXData.length == 0 && lineYData.length == 0" class="paddingTop">
        <a-empty />
      </div> -->
        <div ref="chartRef" :style="{ width, height }"></div>
      </div>
    </template>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { useECharts } from '/@/hooks/web/useECharts';
  import type { Dayjs } from 'dayjs';
  import { getEchart } from '../api';
  import { useUserStore } from '/@/store/modules/user';

  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '300px',
    },
  });
  let userInfo = useUserStore().userInfo;
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  const queryType = ref<Number>(1);
  const paramType = ref<Number>(2);
  const times = ref<Dayjs>();
  const lineXData = ref([]);
  const lineYData = ref([]);

  function onChange() {
    console.log(times.value);
    initLogInfo();
  }
  function initLogInfo() {
    getEchart({ queryType: queryType.value, paramType: paramType.value, endTime: '', startTime: '' }).then((res) => {
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
        xAxis: {
          type: 'category',
          data: lineXData.value,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: lineYData.value,
            type: 'bar',
            showBackground: false,
            barMaxWidth: 15,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: '#2C6AFD' },
                { offset: 0.5, color: '#2C6AFD' },
                { offset: 0, color: '#57A3FF' },
              ]),
              // barBorderRadius:[150,150,0,0],
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: '#2C6AFD' },
                  { offset: 0.7, color: '#2C6AFD' },
                  { offset: 0, color: '#57A3FF' },
                ]),
              },
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
        xAxis: {
          type: 'category',
          data: lineXData.value,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: lineYData.value,
            type: 'bar',
            showBackground: false,
            barMaxWidth: 15,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: '#2C6AFD' },
                { offset: 0.5, color: '#2C6AFD' },
                { offset: 0, color: '#57A3FF' },
              ]),
              // barBorderRadius:[150,150,0,0],
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 1, color: '#2C6AFD' },
                  { offset: 0.7, color: '#2C6AFD' },
                  { offset: 0, color: '#57A3FF' },
                ]),
              },
            },
          },
        ],
      });
    },
    { immediate: true }
  );
</script>
<style lang="less">
  .top-tie {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
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
  .paddingTop {
    position: absolute;
    z-index: 999;
    padding-top: 80px;
    width: 90%;
    margin: 0 auto;
  }
</style>
