<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="800" title="账号管理" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formAccountSchema } from '../TeacherInfo.data';
  import { saveAccount, updatePsw } from '../TeacherInfo.api';
  import { ref } from 'vue';

  // 声明Emits
  const emit = defineEmits(['success', 'register']);

  // 判断是否已经注册
  const isReg = ref(false);

  //表单配置
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    schemas: formAccountSchema(isReg),
    showActionButtonGroup: false,
  });

  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false });
    //表单赋值
    await setFieldsValue({ ...{ id: data.record.id, loginName: data.record.loginName } });
    isReg.value = data.record.loginName ? true : false;
  });

  //表单提交事件
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      if (isReg.value) {
        await updatePsw(values);
      } else {
        await saveAccount(values);
      }
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
