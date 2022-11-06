<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="500" @ok="handleSubmit">
      <BasicForm @register="registerForm" />
      <template #footer>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </template>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {useFormSchema} from '../WebsiteTheme.data';
    import {useCategory,queryInfoById} from '../WebsiteTheme.api';
    import { message } from 'ant-design-vue';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const useId = ref('')
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: useFormSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        useId.value = data.record.id
        
        if (unref(isUpdate)) {
            //表单赋值
            await queryInfoById({id:data.record.id}).then(async res =>{
                
                // console.log(res.useCategory);
                await setFieldsValue({
                    // ...data.record
                    ...res
                });
            })
        }
        // 隐藏底部时禁用整个表单
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '使用' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
                setModalProps({confirmLoading: true});
                values.id = useId.value
                //提交表单
                await useCategory(values);
                //关闭弹窗
                closeModal();
                //刷新列表
                emit('success');
            
            
        } finally {
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