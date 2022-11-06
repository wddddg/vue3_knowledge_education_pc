<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 18:49:28
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 00:01:05
-->
<template>
  <a-row :class="['p-4', `${prefixClsTree}--box`]" :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <a-card :bordered="false" style="height: 100%">
        <a-tabs defaultActiveKey="all-info">
          <a-tab-pane tab="基础配置" key="basic-info" forceRender>
            <BasicTabForm></BasicTabForm>
          </a-tab-pane>
          <a-tab-pane tab="防录屏" key="screen-info">
            <WaterMark></WaterMark>
          </a-tab-pane>
          <a-tab-pane tab="支付开关" key="pay-info"> <PayRule></PayRule> </a-tab-pane>
          <a-tab-pane tab="直播配置" key="live-info"><Live></Live> </a-tab-pane>
          <a-tab-pane tab="短信配置" key="sms-info"> <Sms></Sms></a-tab-pane>
          <a-tab-pane tab="公众号配置" key="official-info"> <Official></Official></a-tab-pane>
          <a-tab-pane tab="开放平台" key="openplatform-info"> <OpenPlatform></OpenPlatform></a-tab-pane>
          <a-tab-pane tab="小程序" key="mini-info"><Applet></Applet></a-tab-pane>
          <a-tab-pane tab="存储配置" key="storage-info"><Storage></Storage> </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" name="SiteSetting" setup>
  import { provide } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import BasicTabForm from './components/BasicTab.vue';
  import WaterMark from './components/WaterMark.vue';
  import PayRule from './components/PayRule.vue';
  import Live from './components/Live.vue';
  import Sms from './components/Sms.vue';
  import Official from './components/Official.vue';
  import OpenPlatform from './components/OpenPlatform.vue';
  import Applet from './components/Applet.vue';
  import Storage from './components/Storage.vue';
  const { prefixClsTree } = useDesign('attachmentinfo');
  provide('prefixClsTree', prefixClsTree);
</script>

<style lang="less">
  :deep(.ant-card-head-title) {
    padding: 16px 0 0 0;
  }
  :deep(.ant-card-body) {
    padding: 12px;
    background-color: rgb(247, 247, 247);
  }
  :deep(.ant-card-head) {
    font-weight: bold;
  }
  .mr10 {
    margin-right: 10px;
  }
  .footer {
    margin-top: 24px;
    padding-left: 200px;
    height: 30px;
  }
</style>
