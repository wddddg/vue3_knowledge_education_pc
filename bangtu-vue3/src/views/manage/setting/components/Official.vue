<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 19:41:23
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:29:23
-->
<template>
  <div>
    <a-card title="公众号基础配置" :bordered="false">
      <BasicForm @register="registerBase" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="公众号支付配置" :bordered="false">
      <BasicForm @register="registerPay" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>
    <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { OfficialSchema1, OfficialSchema2 } from '../SiteSetting.data';
  import { editThreeConfigure, queryThreeConfigure } from '../SiteSetting.api';

  const id = ref(0);

  //表单配置（基本信息）
  const [registerBase, { resetFields: resetFieldsBase, setFieldsValue: setFieldsValueBase, validate: validateBase }] = useForm({
    labelWidth: 120,
    schemas: OfficialSchema1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单配置（基本信息）
  const [registerPay, { resetFields: resetFieldsPay, setFieldsValue: setFieldsValuePay, validate: validatePay }] = useForm({
    labelWidth: 120,
    schemas: OfficialSchema2,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单提交事件 liveType:直播平台1、阿里云 2、腾讯云
  async function handleSubmit() {
    try {
      // 认证表单
      const [values1, values2] = await Promise.all([validateBase(), validatePay()]);

      // 提交表单
      let form = { ...values1, ...values2 };
      await editThreeConfigure(form);
    } finally {
      getBaseInfo();
    }
  }
  // 表单赋值
  const getBaseInfo = async () => {
    let res = await queryThreeConfigure({ id: id.value });
    await Promise.all([resetFieldsBase(), resetFieldsPay()]);
    id.value = res?.id || 0;
    console.log(res);
    await Promise.all([setFieldsValueBase({ ...res }), setFieldsValuePay({ ...res })]);
  };
  onMounted(async () => {
    getBaseInfo();
  });
</script>

<style lang="less" scoped></style>
