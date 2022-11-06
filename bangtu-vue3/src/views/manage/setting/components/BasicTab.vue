<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 19:41:23
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:25:43
-->
<template>
  <div>
    <a-card title="SEO配置" :bordered="false">
      <BasicForm @register="registerSEO" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="公司信息" :bordered="false">
      <BasicForm @register="registerCompany" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }" />
    </a-card>

    <a-card title="联系信息" :bordered="false">
      <BasicForm @register="registerContract" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="通用配置" :bordered="false">
      <BasicForm @register="registerCommon" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="后台管理系统配置" :bordered="false">
      <BasicForm @register="registerSystem" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, Ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema1, formSchema2, formSchema3, formSchemaCommon, formSchemaSystem } from '../SiteSetting.data';
  import { editBaseConfig, queryBaseConfig } from '../SiteSetting.api';

  const id: Ref<number> = ref(0);

  //表单配置（基本信息）
  const [registerSEO, { resetFields: resetFieldsSEO, setFieldsValue: setFieldsValueSEO, validate: validateSEO }] = useForm({
    labelWidth: 120,
    schemas: formSchema1,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单配置（公司信息）
  const [registerCompany, { resetFields: resetFieldsCompany, setFieldsValue: setFieldsValueCompany, validate: validateCompany }] = useForm({
    labelWidth: 120,
    schemas: formSchema2,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单配置（联系信息）
  const [registerContract, { resetFields: resetFieldsContract, setFieldsValue: setFieldsValueContract, validate: validateContract }] = useForm({
    labelWidth: 120,
    schemas: formSchema3,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  
  // 表单配置(通用配置)
  const [registerCommon, { resetFields: resetFieldsCommon, setFieldsValue: setFieldsValueCommon, validate: validateCommon }] = useForm({
    labelWidth: 120,
    schemas: formSchemaCommon,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  // 表单配置(后台管理系统配置)
  const [registerSystem, { resetFields: resetFieldsSystem, setFieldsValue: setFieldsValueSystem, validate: validateSystem }] = useForm({
    labelWidth: 120,
    schemas: formSchemaSystem,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单提交事件
  async function handleSubmit() {
    try {
      // 认证表单
      const [values1, values2, values3, values4, values5] = await Promise.all([validateSEO(), validateCompany(), validateContract(), validateCommon(), validateSystem()]);

      // 提交表单
      let form = { ...values1, ...values2, ...values3, ...values4, ...values5 };
      await editBaseConfig(form);
    } finally {
      getBaseInfo();
    }
  }
  // 表单赋值
  const getBaseInfo = async () => {
    let res = await queryBaseConfig({ id: id.value });
    await Promise.all([resetFieldsSEO(), resetFieldsCompany(), resetFieldsContract(), resetFieldsCommon(), resetFieldsSystem()]);
    id.value = res?.id || 0;
    console.log(res);
    await Promise.all([setFieldsValueSEO({ ...res }), setFieldsValueCompany({ ...res }), setFieldsValueContract({ ...res }), setFieldsValueCommon({ ...res }), setFieldsValueSystem({ ...res })]);
  };
  onMounted(async () => {
    getBaseInfo();
  });
</script>

<style lang="less" scoped></style>
