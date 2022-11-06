<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm"/>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {formSchema} from '../SystemQuestionsChapter.data';
    import {saveOrUpdate} from '../SystemQuestionsChapter.api';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const expandedRowKeys = ref([]);
    const treeData = ref([]);
    // 当前编辑的数据
    let model:Nullable<Recordable> = null;
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue, validate,updateSchema}] = useForm({
        labelWidth: 150,
        schemas: formSchema(isUpdate),
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        expandedRowKeys.value = [];
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        if (data?.record) {
            //表单赋值
            model = data.record;
            let param = {
                threeCateId:data.record?.threeCateId,
                twoCateId:data.record?.twoCateId,
                oneCateId:data.record.cateId,
            }
            data.record['cateName'] = param
            await setFieldsValue({
                ...data.record,
            });
        }else {
            model = null;
        }
        if(model?.pid=="0"||!model){
            updateSchema([
                { field: 'chapterId', show: true,required:true },
                { field: 'sectionrId', show: false },
            ]);
        }else{
            updateSchema([
                { field: 'chapterId', show: false,required:false },
                { field: 'sectionrId', show: true },
            ]);
        }
        // 隐藏底部时禁用整个表单
    //    setProps({ disabled: !data?.showFooter })
    });
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
    /**
     * 根据pid获取展开的节点
     * @param pid
     * @param arr
     */
    function getExpandKeysByPid(pid,arr){
        if(pid && arr && arr.length>0){
        for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid && unref(expandedRowKeys).indexOf(pid)<0){
            expandedRowKeys.value.push(arr[i].key);
            getExpandKeysByPid(arr[i]['parentId'],unref(treeData))
            }else{
            getExpandKeysByPid(pid,arr[i].children)
            }
        }
        }
    }
    //表单提交事件
    async function handleSubmit() {
        try {
        let values = await validate();
        delete values.cateName
        if(values.pid == "0"||!values.pid){
            values.hasChild = "1"
            values.pid = ""
        }
        setModalProps({confirmLoading: true});
        //提交表单
        await saveOrUpdate(values, isUpdate.value);
        //关闭弹窗
        closeModal();
        //展开的节点信息
        await getExpandKeysByPid(values[''],unref(treeData))
        //刷新列表(isUpdate:是否编辑;values:表单信息;expandedArr:展开的节点信息)
        emit('success', {
            isUpdate: unref(isUpdate),
            values: {...values},
            expandedArr: unref(expandedRowKeys).reverse(),
            // 是否更改了父级节点
            changeParent: model != null && (model[''] != values['']),
        });
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