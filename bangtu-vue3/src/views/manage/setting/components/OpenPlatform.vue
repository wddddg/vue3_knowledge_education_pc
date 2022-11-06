<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 19:41:23
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:31:45
-->
<template>
  <div>
    <a-card title="微信开放平台配置" :bordered="false">
      <BasicForm @register="registerWx" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="支付宝开放平台配置" :bordered="false">
      <BasicForm @register="registerAli" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>
    <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, Ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { OpenPlatformSchema1, OpenPlatformSchema2 } from '../SiteSetting.data';
  import { editThreeConfigure, queryThreeConfigure } from '../SiteSetting.api';

  const id = ref(0);

  //表单配置（基本信息）
  const [registerWx, { resetFields: resetFieldsWx, setFieldsValue: setFieldsValueWx, validate: validateWx }] = useForm({
    labelWidth: 120,
    schemas: OpenPlatformSchema1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单配置（基本信息）
  const [registerAli, { resetFields: resetFieldsAli, setFieldsValue: setFieldsValueAli, validate: validateAli }] = useForm({
    labelWidth: 120,
    schemas: OpenPlatformSchema2,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单提交事件 liveType:直播平台1、阿里云 2、腾讯云
  async function handleSubmit() {
    try {
      // 认证表单
      const [values1, values2] = await Promise.all([validateWx(), validateAli()]);

      // 提交表单
      let form = { id: id.value, ...values1, ...values2 };
      await editThreeConfigure(form);
    } finally {
      getBaseInfo();
    }
  }
  // 表单赋值
  const getBaseInfo = async () => {
    let res = await queryThreeConfigure({ id: id.value });
    await Promise.all([resetFieldsWx(), resetFieldsAli()]);
    id.value = res?.id || 0;
    console.log(res);
    await Promise.all([setFieldsValueWx({ ...res }), setFieldsValueAli({ ...res })]);
  };
  onMounted(async () => {
    getBaseInfo();
  });
</script>

<style lang="less" scoped></style>
