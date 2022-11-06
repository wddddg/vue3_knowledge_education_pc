<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title"  :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm"/>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema1} from '../SystemQuestions.data';
    import {saveOrUpdate,importExcel} from '../SystemQuestions.api';
    import { useUserStore } from '/@/store/modules/user';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    let userInfo = useUserStore().userInfo;
    const fileList = ref([]);
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: formSchema1(userInfo.userRoleType,fileList),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            // let param = {
            //   threeCateId:data.record?.threeCateId,
            //   twoCateId:data.record?.twoCateId,
            //   oneCateId:data.record?.cateId,
            // }
            // data.record['cateName'] = param
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
    //    setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            const formData = new FormData();
            debugger
            fileList.value.forEach(file => {
                formData.append('files[]', file);
            });
            formData.append("sysCategory",values.sysCategory);
            formData.append("questionsTag",values.questionsTag);
            formData.append("questionTagId",values.questionTagId&&values.questionsTag==2?values.questionTagId:'');
            formData.append("chapterName",values.chapterName&&values.questionsTag==1?values.chapterName:'');
            formData.append("sectionName",values.sectionName&&values.questionsTag==1?values.sectionName:'');
            setModalProps({confirmLoading: true});
            //提交表单
            await importExcel(formData);
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