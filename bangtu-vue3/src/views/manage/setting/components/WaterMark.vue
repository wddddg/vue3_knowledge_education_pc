<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 18:49:28
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:45:37
-->
<template>
  <a-card title="水印配置" :bordered="false">
    <BasicForm @register="register" :wrapper-col="{ span: 8 }"> </BasicForm>
  </a-card>
  <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
</template>

<script lang="ts" name="SiteSetting" setup>
  import { ref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema4 } from '../SiteSetting.data';
  import { queryWatermark, editWatermark } from '../SiteSetting.api';

  const id = ref(0);
  const [register, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema4,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  // 提交表单
  const handleSubmit = async () => {
    try {
      // 认证表单
      const [values1] = await Promise.all([validate()]);
      // const [videoStatus, liveStatus] = values1;
      // 提交表单
      let websiteWatermark = { id: id.value, ...values1 };
      websiteWatermark.videoStatus ? (websiteWatermark.videoStatus = 1) : (websiteWatermark.videoStatus = 0);
      websiteWatermark.liveStatus ? (websiteWatermark.liveStatus = 1) : (websiteWatermark.liveStatus = 0);
      await editWatermark(websiteWatermark);
    } finally {
      getWatermark();
    }
  };
  // 表单赋值
  const getWatermark = async () => {
    let res = await queryWatermark({ id: id.value });
    await Promise.all([resetFields()]);
    id.value = res?.id || 0;
    let data = { ...res };
    data.videoStatus ? (data.videoStatus = true) : (data.videoStatus = false);
    data.liveStatus ? (data.liveStatus = true) : (data.liveStatus = false);
    await Promise.all([setFieldsValue({ ...data })]);
  };
  onMounted(async () => {
    getWatermark();
  });
</script>

<style lang="less"></style>
