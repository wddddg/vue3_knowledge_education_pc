<template>
  <BasicModal v-bind="$attrs" :minHeight="400" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm">
            <template #draggerUpload="{ model, field }">
                <p class="ant-upload-drag-icon">
                    <inbox-outlined></inbox-outlined>
                </p>
               <a-upload-dragger v-model:fileList="model[field]" :before-upload="beforeUpload" name="file" :multiple="true"
                  >
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined></inbox-outlined>
                    </p>
                    <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                    <p class="ant-upload-hint">
                      支持扩展名：.rar .zip .doc .docx .pdf .jpg ...
                    </p>
                </a-upload-dragger>
              </template>
      </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    // import { a-upload-dragger } from 'ant-design-vue';
    import { InboxOutlined } from '@ant-design/icons-vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../AttachmentInfo.data';
    import {saveOrUpdate, upload} from '../AttachmentInfo.api';

    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        labelWidth: 150,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });

    interface FileItem {
      uid: string;
      name?: string;
      status?: string;
      response?: string;
      url?: string;
      preview?: string;
      originFileObj?: any;
      file: string | Blob;
    }
    const fileList = ref<FileItem[]>([]);
    const uploading = ref<boolean>(false);


    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });
        }else{
            await setFieldsValue({
                ...data.record,
            });
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '素材上传' : '详情'));
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            setModalProps({confirmLoading: true});

            const formData = new FormData();
            formData.append('oneCateId', values.oneCateId);
            formData.append('twoCateId', values.twoCateId);

            let i= 0;
            unref(fileList).forEach((file) => {
              formData.append('fileList['+i+']', file);
              i++;
            });
            uploading.value = true;
            //提交表单
            let result = await upload(formData);
            fileList.value=[];
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }




    const handleRemove = (file: FileItem) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = (file: FileItem) => {
      fileList.value = [...fileList.value, file];
      return false;
    };
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
