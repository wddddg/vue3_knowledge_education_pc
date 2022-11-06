<template>
  <PageWrapper :class="prefixCls" >
    <div style="margin: 20px 0  0 20px;font-size: 20px;font-weight:700">教学统计</div>
    <div :class="`${prefixCls}__top`" >
      <a-row justify="space-around">
        <a-col :span="3" :class="`${prefixCls}__top-col`">
            <div>{{teach.onlineCount}}</div>
            <p>线上课</p>
        </a-col>
        <a-col :span="3" :class="`${prefixCls}__top-col`">
          <div>{{teach.offlineCount}}</div>
          <p>线下课</p>
        </a-col>
        <a-col :span="3" :class="`${prefixCls}__top-col`">
          <div>{{teach.liveCount}}</div>
          <p>直播课</p>
        </a-col>
        <a-col :span="3" :class="`${prefixCls}__top-col`">
          <div>{{teach.classCount}}</div>
          <p>班级课</p>
        </a-col>
        <a-col :span="3" :class="`${prefixCls}__top-col`">
          <div>{{teach.bookCount}}</div>
          <p>电子书</p>
        </a-col>
        <a-col :span="3" :class="`${prefixCls}__top-col`">
          <div>{{teach.knowledgeCount}}</div>
          <p>资料库</p>
        </a-col>
      </a-row>
    </div>
    <a-row :justify="'space-between'">
      <a-col :span="12" style="padding:20px">
        <statisticsList @Pushrefresh="Pushrefresh" :URL="'/courseInfo/findStudyReportList'" :titleName="'热门统计'"/>
      </a-col>
      <a-col :span="12" style="padding:20px">
        <statisticsList @Pushrefresh="Pushrefresh" :URL="'/courseInfo/findPushReportList'" :titleName="'发布统计'"/>
      </a-col>
    </a-row>

  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Progress, Row, Col } from 'ant-design-vue';
  import { defineComponent,ref,toRefs,provide } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { List } from 'ant-design-vue';
  import {listForReport,findStudyReportList,findPushReportList} from './statistics.api'
  import statisticsList from './components/statisticsList.vue'


    let prefixCls =ref('list-basic')
    let pagination= ref({
      show: true,
      pageSize: 3,
    })
    let teach = ref({})
    listForReport().then(res=>{
      teach.value = res
      toRefs(teach)
    })


</script>
<style lang="less" scoped>
  .list-basic {
    background-color: #fff;
    margin: 20px;
    &__top {
      // padding: 24px;
      text-align: center;
      &-col {
        background: linear-gradient(90deg, #00cfa3, #05cfcd, #00d3ea);
        // margin: 0 10px;
        padding: 20px 0;
        &:not(:last-child) {
          // border-right: 1px dashed @border-color-base;
        }

        div {
          margin-bottom: 12px;
          font-size: 20px;
          line-height: 22px;
          // color: red;
          color:#fff;
        }

        p {
          margin: 0;
          font-size: 24px;
          line-height: 32px;
          // color: @text-color;
          color:#fff;
        }
      }
    }

  }
</style>
