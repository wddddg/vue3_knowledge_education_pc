<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <div>
    <a-button type="primary" style="margin:0 20px 50px"> <a href="https://www.baidu.com">直播教程下载</a></a-button>
    <a-button type="primary"><a href="https://www.baidu.com">直播工具下载 </a></a-button>
    </div>
      <!-- <BasicForm  @register="registerForm" /> -->
    <div class="ard">
        <div style="white-space:nowrap">推流地址:</div>
        <a-textarea v-model:value="values" placeholder="请输入推流地址" allow-clear id="bar" />
    </div>
 
    <a-button type="primary" class="but" data-clipboard-target="#bar" data-clipboard-action="copy" >复制</a-button>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {liveformSchema} from './liveSetModal.data';
    import ClipboardJS from 'clipboard'
    import { useMessage } from '/@/hooks/web/useMessage';
    import {queryLiveBySectionId} from '../courseDate.api';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    let values = ref('')
    let Clipboard = new ClipboardJS('.but');
    Clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        let { createMessage } = useMessage()
        createMessage.success('复制成功')
        e.clearSelection();
    });
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: liveformSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        queryLiveBySectionId()
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
    // const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    const title = computed(() => ('推荐'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            setModalProps({confirmLoading: true});
            //提交表单
            await updateRecommend(values);
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
  .ard {
    display: flex;
  }
  .but {
    margin-top: 20px;
    margin-left: 50%;
    transform: translate(-50%);
  }
</style>