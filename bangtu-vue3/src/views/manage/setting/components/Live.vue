<!--
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-21 19:41:23
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:27:34
-->
<template>
  <div>
    <a-card :bordered="false">
      <template #title>
        <div class="box">
          <div class="title">直播配置</div>
          <div class="desc">百家云平台</div>
        </div>
      </template>
      <BasicForm @register="register" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { LiveSchema } from '../SiteSetting.data';
  import { editThreeConfigure, queryThreeConfigure } from '../SiteSetting.api';

  const id = ref(0);

  //表单配置（基本信息）
  const [register, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: LiveSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  //表单提交事件
  async function handleSubmit() {
    try {
      // 认证表单
      const [values1] = await Promise.all([validate()]);

      // 提交表单
      let form = { ...values1 };
      await editThreeConfigure(form);
    } finally {
      getBaseInfo();
    }
  }
  // 表单赋值
  const getBaseInfo = async () => {
    let res = await queryThreeConfigure({ id: id.value });
    await Promise.all([resetFields()]);
    id.value = res?.id || 0;
    console.log(res);
    await Promise.all([setFieldsValue({ ...res })]);
  };
  onMounted(async () => {
    getBaseInfo();
  });
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    height: 24px;
  }
  .desc {
    margin-left: 10px;
    color: #3f3f3f;
    font-size: 14px;
    font-weight: 400;
    line-height: 31px;
  }
</style>
