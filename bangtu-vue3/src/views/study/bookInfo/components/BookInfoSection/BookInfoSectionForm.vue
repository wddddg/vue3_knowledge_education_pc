<template>
  <a-spin :spinning="loading">
    <BasicForm @register="registerForm" />
    <div class="j-box-bottom-button offset-20" style="margin-top: 30px">
      <div class="j-box-bottom-button-float">
        <a-button preIcon="ant-design:sync-outlined" @click="onReset">重置</a-button>
        <a-button type="primary" preIcon="ant-design:save-filled" @click="onSubmit">保存</a-button>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
  import { watch, computed, inject, ref, unref, onMounted,defineExpose } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { setBookEditSection,setBookEditChapter,setBookAddChapterr } from '../../BookInfo.api';
  import { useBasicFormSchema, orgCategoryOptions } from './BookInfoSection.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['success']);
  defineExpose({clearNode,onReset})
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
  });
  const prefixCls = inject('prefixCls');
  const loading = ref<boolean>(false);
  // 当前是否是更新模式
  const isUpdate = ref<boolean>(true);
  // 当前的弹窗数据
  const model = ref<object>({});

  //注册表单
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema,getFieldsValue }] = useForm({
    schemas: useBasicFormSchema().basicFormSchema,
    showActionButtonGroup: false,
  });
  //点击添加按钮，清除form
  async function clearNode(){
    
    let values = await getFieldsValue();
    if(props.data.type != 'section'){
      const { createMessage } = useMessage()
      createMessage.error('请选择要添加节的章')
      return
    }
    updateSchema([
      { field: 'isTryLook', show: true },
      { field: 'content', ifShow: true },
    ]);
    let param = {
      // id : '',
      bookId : props.data.bookId,
      // name : '',
      // title: '',
      // sort : '',
      // isTryLook : '',
      // content : '',
      type:'addNode',
      parentId:props.data.id
    }
    await resetFields()
    setFieldsValue(param)
  }
  //点击树节点，更新form
  onMounted(()=>{
    watch(
      ()=>props.data,
      async () => {
        onReset()
        console.log(props.data,'props.data')
        if(props.data.parentId){
          setFieldsValue(props.data)
          updateSchema([
            { field: 'isTryLook', show: true },
            { field: 'content', ifShow: false },
          ]);
          setTimeout(() => {
            updateSchema([
            { field: 'content', ifShow: true },
          ]);
          }, 10);
        }else{
          setFieldsValue(props.data)
          updateSchema([
            { field: 'isTryLook', show: false },
            { field: 'content', ifShow: false, required:false },
          ]);
        }
      },
    )
  })
  // const categoryOptions = computed(() => {
  //   if (!!props?.data?.parentId) {
  //     return orgCategoryOptions.child;
  //   } else {
  //     return orgCategoryOptions.root;
  //   }
  // });

  // onMounted(() => {
  //   // 禁用字段
  //   updateSchema([
  //     { field: 'parentId', componentProps: { disabled: true } },
  //     { field: 'orgCode', componentProps: { disabled: true } },
  //   ]);
  //   // data 变化，重填表单
  //   watch(
  //     () => props.data,
  //     async () => {
  //       let record = unref(props.data);
  //       if (typeof record !== 'object') {
  //         record = {};
  //       }
  //       model.value = record;
  //       await resetFields();
  //       await setFieldsValue({ ...record });
  //     },
  //     { deep: true, immediate: true }
  //   );
  //   // 更新 父部门 选项
  //   watch(
  //     () => props.rootTreeData,
  //     async () => {
  //       updateSchema([
  //         {
  //           field: 'parentId',
  //           componentProps: { treeData: props.rootTreeData },
  //         },
  //       ]);
  //     },
  //     { deep: true, immediate: true }
  //   );
  //   // 监听并更改 orgCategory options
  //   watch(
  //     categoryOptions,
  //     async () => {
  //       updateSchema([
  //         {
  //           field: 'orgCategory',
  //           componentProps: { options: categoryOptions.value },
  //         },
  //       ]);
  //     },
  //     { immediate: true }
  //   );
  // });

  // 重置表单
  async function onReset() {
    let param = {
      id : props.data.id,
      bookId : props.data.bookId,
      // name : '',
      // sort : '',
      // isTryLook : '',
      // content : '',
      parentId:props.data.parentId,
      type:props.data.type
    }
    await resetFields();
    setFieldsValue(param)
    // await setFieldsValue({ ...model.value });
  }

  // 提交事件
  async function onSubmit() {
    try {
      loading.value = true;
      let values = await validate();
      console.log(values,'values')
      if(values.type == 'section'){
        let param = {
          id : values.id,
          bookId : values.bookId,
          name : values.name,
          sort : values.sort,
        }
        await setBookEditSection(param)
      }else if(values.type == 'node'){
        let param = {
          id : values.id,
          bookId : values.bookId,
          name : values.name,
          sort : values.sort,
          isTryLook : values.isTryLook,
          content : values.content,
          parentId:values.parentId
        }
        await setBookEditChapter(param);
      }else if(values.type == 'addNode'){
        let param = {
          bookId : values.bookId,
          name : values.name,
          sort : values.sort,
          isTryLook : values.isTryLook,
          content : values.content,
          parentId:values.parentId
        }
        await setBookAddChapterr(param);
      }


      //刷新列表
      emit('success');
      Object.assign(model.value, values);
    } finally {
      loading.value = false;
    }
  }
</script>
