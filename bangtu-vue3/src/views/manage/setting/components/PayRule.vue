<!--
 * @Descripttion: 
 * @version: 
 * @Author: Xutao
 * @Date: 2022-07-21 19:41:23
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-24 11:42:01
-->
<template>
  <div>
    <a-card :bordered="false">
      <template #title>
        <div class="title-box">
          <div class="title">苹果支付管理</div>
          <!-- <div class="notice"> <Icon icon="ant-design:info-circle-filled" color="#00ABEA" class="mr10"></Icon>防止下架，IOS建议仅启用IOS学币充值</div> -->
          <a-alert style="margin-left: 10px" type="info" showIcon message="防止下架，IOS建议仅启用IOS学币充值" />
        </div>
      </template>
      <BasicForm @register="registerApple" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>

    <a-card title="安卓支付管理" :bordered="false">
      <BasicForm @register="registerAndroid" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }" />
    </a-card>

    <a-card title="公众号支付管理" :bordered="false">
      <BasicForm @register="registerOffcial" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>
    <a-card title="小程序支付管理" :bordered="false">
      <BasicForm @register="registerApplet" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>
    <a-card :bordered="false">
      <template #title>
        <div class="title-box">
          <div class="title">隐藏支付配置</div>
          <div class="notice">
            <a-alert type="info" showIcon message="该配置只会在某个终端全部关闭支付功能下生效（若做IOS上架使用，禁止出现支付等相关字眼）" />
          </div>
        </div>
      </template>
      <BasicForm @register="registerHidden" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 8 }"> </BasicForm>
    </a-card>
    <a-card title="支付相关模块" :bordered="false">
      <BasicForm @register="registerPay" :labelCol="{ style: { width: '140px' } }" :wrapper-col="{ span: 16 }"> </BasicForm>
    </a-card>

    <div class="footer"> <a-button class="mr10" type="primary" @click="handleSubmit"> 确认提交 </a-button></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { paySchema1, paySchema2, paySchema3, paySchema4, paySchema5, paySchema6 } from '../SiteSetting.data';
import { editPayRule, queryPayRule } from '../SiteSetting.api';

const id = ref(0);

//表单配置（支付配置：苹果支付）
const [registerApple, { resetFields: resetFieldsApple, setFieldsValue: setFieldsValueApple, validate: validateApple }] = useForm({
  labelWidth: 120,
  schemas: paySchema1,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单配置（支付配置：安卓支付）
const [registerAndroid, { resetFields: resetFieldsAndriod, setFieldsValue: setFieldsValueAndroid, validate: validateAndroid }] = useForm({
  labelWidth: 120,
  schemas: paySchema2,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});

//表单配置（支付配置：公众号支付）
const [registerOffcial, { resetFields: resetFieldsOffcial, setFieldsValue: setFieldsValueOffcial, validate: validateOffcial }] = useForm({
  labelWidth: 120,
  schemas: paySchema3,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单配置（支付配置：小程序支付）
const [registerApplet, { resetFields: resetFieldsApplet, setFieldsValue: setFieldsValueApplet, validate: validateApplet }] = useForm({
  labelWidth: 120,
  schemas: paySchema4,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单配置（支付配置：隐藏支付配置）
const [registerHidden, { resetFields: resetFieldsHidden, setFieldsValue: setFieldsValueHidden, validate: validateHidden }] = useForm({
  labelWidth: 120,
  schemas: paySchema5,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单配置（支付配置：支付相关模块管理）
const [registerPay, { resetFields: resetFieldsPay, setFieldsValue: setFieldsValuePay, validate: validatePay }] = useForm({
  labelWidth: 120,
  schemas: paySchema6,
  showActionButtonGroup: false,
  baseColProps: { span: 24 },
});
//表单提交事件
async function handleSubmit() {
  try {
    // 认证表单
    const [values1, values2, values3, values4, values5, values6] = await Promise.all([validateApple(), validateAndroid(), validateOffcial(), validateApplet(), validateHidden(), validatePay()]);

    // 提交表单
    let form = { ...values1, ...values2, ...values3, ...values4, ...values5, ...values6 };
    await editPayRule(form);
  } finally {
    getPayRule();
  }
}
// 表单赋值
const getPayRule = async () => {
  let res = await queryPayRule({ id: id.value });
  await Promise.all([resetFieldsApple(), resetFieldsAndriod(), resetFieldsOffcial(), resetFieldsApplet(), resetFieldsHidden(), resetFieldsPay()]);
  id.value = res?.id || 0;
  console.log(res);
  await Promise.all([
    setFieldsValueApple({ ...res }),
    setFieldsValueAndroid({ ...res }),
    setFieldsValueOffcial({ ...res }),
    setFieldsValueApplet({ ...res }),
    setFieldsValueHidden({ ...res }),
    setFieldsValuePay({ ...res }),
  ]);
};
onMounted(async () => {
  getPayRule();
});
</script>

<style lang="less" scoped>
.title-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  // height: 24px;
}
.notice {
  // font-size: 12px;
  // font-weight: 400;
  // height: 24px;
  // line-height: 24px;
  // border: 1px solid rgba(0, 0, 0, 0.45);
  // border-radius: 2px;
  // padding: 0 8px;
  margin-left: 10px;
}
</style>
