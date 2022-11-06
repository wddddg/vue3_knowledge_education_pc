<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :showFooter="showFooter" :width="600" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <!-- 满减券 -->
      <template #customSlot="{ model, field }">
        <span>满</span>
        <a-input-number :disabled="isDetailst" :min="0" placeholder="优惠金额" v-model:value="model[field]" addon-after="元" />
        <span style="width: 80px">优惠</span>
        <a-input :disabled="isDetailst" :min="0" placeholder="优惠金额" v-model:value="fullAmount" addon-after="元" />
        <span></span>
      </template>
      <!-- 无门槛 -->
      <template #customSlot1="{ model, field }">
        <a-input-number :disabled="isDetailst" :min="0" placeholder="优惠金额" v-model:value="model[field]" addon-after="元" />
        <span></span>
      </template>
      <!-- 折扣券 -->
      <template #customSlot2="{ model, field }">
        <span>满</span>
        <a-input-number :disabled="isDetailst" :min="0" placeholder="优惠金额" v-model:value="model[field]" addon-after="元" />
        <span>打</span>
        <a-input-number :disabled="isDetailst" :min="0" placeholder="优惠金额" v-model:value="discount" addon-after="折" />
        <span></span>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDrawer, BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  import { formSchema } from '../CouponInfo.data';
  import { saveOrUpdate } from '../CouponInfo.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const discount = ref('');
  const fullAmount = ref('');
  const isDetailst = ref(false);
  const showFooter = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 160,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    //重置表单
    await resetFields();
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    isDetailst.value = !!data?.isDetailst;
    discount.value = '';
    if (unref(isUpdate)) {
      discount.value = data?.record.useCatagory != 2 ? data?.record.discount : '';
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增优惠券' : unref(isDetailst) ? '查看优惠券' : '编辑优惠券'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setDrawerProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate({ ...values, discount: discount.value }, isUpdate.value);
      //关闭弹窗
      discount.value = '';
      closeDrawer();
      //刷新列表
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
  :deep(#fullAmount) > div {
    display: flex;
    align-items: center;
  }
  :deep(#fullAmount) > div .ant-input-number {
    width: 10%;
    margin: 0 10px;
  }
  :deep(#useLimitAmount) > div {
    display: flex;
    align-items: center;
  }
  :deep(#useLimitAmount) > div .ant-input-number {
    width: 10%;
    margin: 0 10px;
  }
</style>
