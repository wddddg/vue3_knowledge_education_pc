<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="600" @ok="handleSubmit">
      <BasicForm @register="registerForm"/>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref } from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    // import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../LearnMoneyReport.data';
    import {saveOrUpdate} from '../LearnMoneyReport.api';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const searchInfo = { userId: '' };
    //表单配置
    // let oldNum = ref(0)
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        // schemas: formSchema(oldNum),
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    // 表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        // oldNum.value = data.record.balanceAmount
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '修改'));
    // const [registerDrawer, { setDrawerProps,closeDrawer }] = useDrawerInner(async (data) => {
    //     searchInfo.userId = data.record?.userId;
    //     //   handleSuccess();
    //     await resetFields();
    //     await setFieldsValue({
    //         ...data.record,
    //     });
    //     isUpdate.value = !!data?.isUpdate;
    //     setDrawerProps({ showFooter:true,showOkBtn:true });
    //     setProps({ disabled: !data?.showFooter })
    // });
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            // setDrawerProps({confirmLoading: true});
            setModalProps({confirmLoading: true});
            //提交表单
            await saveOrUpdate(values, isUpdate.value);
            //关闭弹窗
            // closeDrawer();
            closeModal()
            //刷新列表
            emit('success');
        } finally {
            // setDrawerProps({confirmLoading: false});
            setModalProps({confirmLoading: false});
        }
    }
</script>

<style lang="less" scoped>
	/** 时间和数字输入框样式 */
  :deep(.ant-input-number){
		width: 100%
	}

	:deep(.ant-calendar-picker){
		width: 100%
	}
</style>