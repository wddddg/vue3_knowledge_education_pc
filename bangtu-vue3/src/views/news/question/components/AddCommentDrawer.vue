<template>
  <BasicModal v-bind="$attrs" @register="registerDrawer" destroyOnClose :title="title" :showFooter="showFooter" :width="adaptiveWidth" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, watch } from 'vue';
  // import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { commentFormSchema } from '../NewsInfo.data';
  import { newsCommentsaveOrUpdate } from '../NewsInfo.api';
  import { useDrawerAdaptiveWidth } from '/@/hooks/jeecg/useAdaptiveWidth';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const showFooter = ref(true);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    labelWidth: 150,
    schemas: commentFormSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerDrawer, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    showFooter.value = data?.showFooter ?? true;
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        newsId: data.newsId,
        ...data.record,
        authorName: data.record.createBy,
      });
    } else {
      await setFieldsValue({
        newsId: data.newsId,
        parentId: (data.record && data.record.id) || '',
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });

  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const { adaptiveWidth } = useDrawerAdaptiveWidth();
  //提交事件
  async function handleSubmit() {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      values.userIdentity === 1 && (values.departIds = '');
      //提交表单
      await newsCommentsaveOrUpdate({ ...values }, isUpdate.value);
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
</style>
