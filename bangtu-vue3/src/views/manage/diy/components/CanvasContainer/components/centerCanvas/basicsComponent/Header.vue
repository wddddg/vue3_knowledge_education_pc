<template>
    <div class="hearder">
        <!-- 模拟手机布局 -->
        <div class="top">
          <div>00:00 &nbsp;<WifiOutlined /></div>
          <div><PhoneOutlined /></div>
        </div>
        <div class="title">{{pageTitle}}</div>
    </div>
</template>
<script lang="ts" setup >
import { ref, defineProps, watch, unref,watchEffect,inject } from 'vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import { WifiOutlined, PhoneOutlined } from '@ant-design/icons-vue';
let props =  defineProps(['componentContent'])
const listIndex = inject('listIndex');
const pageTitle = inject('pageTitle');


</script>
<style lang="less" scoped>
    .hearder {
      text-align: left;
      background-color: #ccc;
      line-height: 25px;
      .top{
        display: flex;
        justify-content: space-between;
        margin: 0 10px;
      }
      .title {
        height: 30px;
        text-align: center;
      }
    }
</style>