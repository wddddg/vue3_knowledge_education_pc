<template>
  <Card :loading="loading" style="border-radius: 8px" class="index-boxd">
    <template v-if="userInfo.userRoleType == 1">
      <div class="ties">
        <div class="title-tip">讲师收入排行榜</div>
        <div class="more item-pointer" @click="goLink('/cost/incomeList')">更多{{ ' >' }}</div>
      </div>
      <div class="table">
        <div class="t-tit">
          <div>排名</div>
          <div>姓名</div>
          <div>占比</div>
          <div>收入(元)</div>
        </div>
        <div class="t-bot" v-if="lineMultiData && lineMultiData.length > 0">
          <div class="bot-item" v-for="(item, index) in lineMultiData" :key="item">
            <div>{{ index + 1 }}</div>
            <div class="wtip">
              <a-tooltip>
                <template #title>{{ item.name }}</template>
                {{ item.name }}
              </a-tooltip>
            </div>
            <div>
              {{ item.amountPercent }}%
              <div class="progress-bar">
                <div class="progress-bg" :style="{ width: `${item.amountPercent}%` }"></div>
              </div>
            </div>
            <div>{{ item.totalAmount }}</div>
          </div>
        </div>
        <div class="paddingTop" v-else>
          <a-empty />
        </div>
      </div>
    </template>
    <template v-if="userInfo.userRoleType == 2">
      <div class="ties">
        <div class="title-tip">销量排行榜</div>
        <div class="more" @click="goLink('/cost/orderList')">更多{{ ' >' }}</div>
      </div>
      <div class="radioGroup1">
        <a-radio-group v-model:value="paramType" @change="onChange">
          <a-radio-button :value="1">课程</a-radio-button>
          <a-radio-button :value="2">班级</a-radio-button>
          <a-radio-button :value="3">书籍</a-radio-button>
          <a-radio-button :value="4">考点集</a-radio-button>
        </a-radio-group>
      </div>
      <div class="table">
        <div class="t-tit">
          <div>排名</div>
          <div>名称</div>
          <div>占比</div>
          <div>数量</div>
        </div>
        <div class="t-bot" v-if="lineMultiData && lineMultiData.length > 0">
          <div class="bot-item" v-for="(item, index) in lineMultiData" :key="item">
            <div>{{ index + 1 }}</div>
            <div class="wtip">
              <a-tooltip>
                <template #title>{{ item.name }}</template>
                {{ item.name }}
              </a-tooltip>
            </div>
            <div>
              {{ item.amountPercent }}%
              <div class="progress-bar">
                <div class="progress-bg" :style="{ width: `${item.amountPercent}%` }"></div>
              </div>
            </div>
            <div>{{ item.totalAmount }}</div>
          </div>
        </div>
        <div class="paddingTop" v-else>
          <a-empty />
        </div>
      </div>
    </template>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useGo, useRedo } from '/@/hooks/web/usePage';
  // import { pushSalesEchart } from '../api';
  const props = defineProps({
    loading: Boolean,
    countfo: Object,
  });
  const paramType = ref<Number>(1);
  const lineMultiData = ref([]);

  function onChange() {}

  let userInfo = useUserStore().userInfo;
  const go = useGo();
  const goLink = (url) => {
    go(url);
  };
  // function initLogInfo() {
  //   pushSalesEchart({}).then((res) => {
  //     if (res.success) {
  //       lineMultiData.value = res.result;
  //     }
  //   });
  // }

  // initLogInfo();

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      lineMultiData.value = props.countfo.teacherReportVOList || [];
    },
    { immediate: true }
  );
</script>
<style lang="less" scoped>
.item-pointer{
  cursor: pointer;
}
  .index-boxd {
    background: #fff;
  }
  .ties {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;

    .more {
      font-size: 16px;
      color: #7c8db5;
    }
  }

  .title-tip {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 0;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 28px;
      background: #2c6afd;
      margin-right: 14px;
    }
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background: #dee7f2;
    border-radius: 8px;
    position: relative;
    margin-left: 8px;

    .progress-bg {
      position: absolute;
      left: 0;
      height: 10px;
      top: 0;
      background: linear-gradient(90deg, #57a3ff 0%, #2c6afd 100%);
      border-radius: 8px;
    }
  }

  .table {
    width: 100%;
    .t-tit {
      display: flex;
      align-items: center;
      width: 100%;
      background: #f4f9fc;
      padding: 8px 0;
      > div {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:nth-child(1) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 40%;
        }
      }
    }
    .bot-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px 0;
      &:nth-child(2n) {
        background: #f7f8f8;
      }
      > div {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7c8db5;
        &:nth-child(1) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 40%;
          padding-left: 10px;
        }
        &:nth-child(4) {
          color: #d12626;
        }
      }
      .wtip {
        height: 25px;
        line-height: 25px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
  }
  .paddingTop {
    width: 100%;
    position: absolute;
    z-index: 999;
    padding-top: 60px;
    width: 90%;
    margin: 0 auto;
  }
  .radioGroup1 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }
</style>
