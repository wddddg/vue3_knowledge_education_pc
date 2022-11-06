<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #customSlot="{ model, field }">
        <a-radio-group v-model:value="model[field]">
          <div class="item">
            <a-radio :value="0">永久有效</a-radio>
          </div>
          <div class="item">
            <a-radio :value="1">自定义月数</a-radio>
            <a-input-number v-if="model[field] == 1" :min="1" placeholder="自定义月数" v-model:value="termCount" />
          </div>
        </a-radio-group>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../MemberPriceManager.data';
  import { saveOrUpdate } from '../MemberPriceManager.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const termCount = ref('');
  const category = ref('');
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    termCount.value = '';
    category.value = data.category;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
        category: data.category,
        termCount: data.record.termCount == 0 ? 0 : 1,
      });
      termCount.value = data.record.termCount == 0 ? '' : data.record.termCount;
    }

    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  //表单提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate({ ...values, category: category.value, termCount: values.termCount == 0 ? 0 : termCount.value }, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
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

  :deep(.ant-radio-group) {
    display: flex;
    align-items: center;
  }

  .item {
    display: flex;
    align-items: center;
  }
</style>
