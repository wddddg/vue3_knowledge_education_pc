<template>
  <a-spin :spinning="loading">
    <!-- <BasicForm @register="registerForm" /> -->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button>
        <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-button type="primary" @click="onExportXls" >导出数据</a-button>
        <a-button type="primary" @click="batchHandleDelete" >批量销课</a-button>
        <!-- <a-dropdown v-if="checkedKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="bx:bx-unlink"></Icon>
                批量销课
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="ant-design:down-outlined"></Icon>
          </a-button>
        </a-dropdown> -->
      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <div class="j-box-bottom-button offset-20" style="margin-top: 30px">
      <div class="j-box-bottom-button-float">
        <!-- <a-button preIcon="ant-design:sync-outlined" @click="onReset">重置</a-button> -->
        <!-- <a-button type="primary" preIcon="ant-design:save-filled" @click="onSubmit">保存</a-button> -->
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
  import { watch, computed, inject, ref, unref, onMounted,defineExpose,watchEffect } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { courseSectionEdit,courseSectionAdd,rollcallBatch} from '../../courseInfo.api';
  import { useBasicFormSchema, userColumns,searchFormSchema } from './Section.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { cloneDeep, now } from 'lodash-es';
  import { useModal,BasicModal  } from '/src/components/Modal';
  import { courseOfflineUserRecord,courseOfflineUserRecordEdit,courseSectionPracticeList,courseSectionPracticeDelete,getExportUrl } from '../../courseInfo.api';
  import { useListPage } from '/@/hooks/system/useListPage';

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
  //注册model
  const [regModal, { openModal }] = useModal();
  const [regModal2, { openModal:openModal2 }] = useModal();
  function open(){
    openModal(true,{
      nodeData:props.data
    })
  }
  function open2(){
    openModal2(true,{
      nodeData:props.data
    })
  }
  //注册表单
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
    schemas: useBasicFormSchema().basicFormSchema,
    showActionButtonGroup: false,
    fieldMapToTime: [
      // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
      // 'YYYY-MM-DD'为时间格式，参考moment
      ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
    ],
  });


  //点击添加按钮，清除form
  async function clearNode(){
    let values = await validate();
    if(values.type != 'section'){
      const { createMessage } = useMessage()
      createMessage.error('请选择要添加的章')
      return
    }
    let param = {
      id : '',
      courseId : values.courseId,
      name : '',
      title: '',
      sort : '',
      isTryLook : '',
      isPlayBack : '',
      isCommerce:'',
      isExercise:'',
      teacherName:'',
      datetime:[new Date(),new Date()],
      type:'addNode',
      parentId:values.id
    }
    // setProps({ searchInfo: { sectionId: '',chapterId:values.id } });
    // setProps2({ searchInfo: { sectionId: '',chapterId:values.id } });
    // reload()
    // reload2()
    setFieldsValue(param)
    // setFieldsValue1(param)
    // setFieldsValue2(param)
  }
  //点击树节点，更新form
  onMounted(()=>{
    watch(
      ()=>props.data,
      async () => {
        
        onReset()
        console.log(props.data,'props.data')
        setProps({ searchInfo: {courseId:props.data.courseId, sectionId: props.data.parentId,chapterId:props.data.id } });
        reload()
        setFieldsValue(props.data)
        // setFieldsValue1(props.data)
        // setFieldsValue2(props.data)
        // props.data.isCommerce==1? isTable1.value=true:isTable1.value=false
        // props.data.isExercise==1? isTable2.value=true:isTable2.value=false
      },
    )
  })

  // let tableData = ref([])
  // tableData.value = cloneDeep() 

  const checkedKeys = ref<Array<string | number>>([]);


  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
    title: '用户列表',
    api: courseOfflineUserRecord,
    columns: userColumns,
    searchInfo: { courseId: '999999999999999' },
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      actionColOptions: { pull: 1 },
    },
    striped: true,
    useSearchForm: true,
    showTableSetting: true,
    clickToRowSelect: false,
    bordered: true,
    showIndexColumn: false,
    tableSetting: { fullScreen: true },
    canResize: false, 
    rowKey: 'id',
    actionColumn: {
      width: 280,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
    },
    exportConfig: {
      name: '学习统计详情',
      url: getExportUrl,
    },
  });
  const [registerTable, { reload, updateTableDataRecord, setProps }] = tableContext

  // const [registerTable, { reload,  setProps }] = useTable({
  //   title: '用户列表',
  //   api: courseOfflineUserRecord,
  //   columns: userColumns,
  //   formConfig: {
  //     labelWidth: 120,
  //     schemas: searchFormSchema,
  //     autoSubmitOnEnter: true,
  //     actionColOptions: { pull: 1 },
  //   },
  //   striped: true,
  //   useSearchForm: true,
  //   showTableSetting: true,
  //   clickToRowSelect: false,
  //   bordered: true,
  //   showIndexColumn: false,
  //   tableSetting: { fullScreen: true },
  //   canResize: false,
  //   rowKey: 'id',
  //   actionColumn: {
  //     width: 280,
  //     title: '操作',
  //     dataIndex: 'action',
  //     slots: { customRender: 'action' },
  //     fixed: undefined,
  //   },
  // });
  /**
   * 选择列配置
   */
  const rowSelection = {
    type: 'checkbox',
    columnWidth: 50,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
  };
  /**
   * 选择事件
   */
  function onSelectChange(selectedRowKeys: (string | number)[], selectionRows) {
    checkedKeys.value = selectedRowKeys;
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await rollcallBatch({ ids: checkedKeys.value.join(','), }, reload);
  }

  function getTableAction(record){
    return [
      // {
      //   label: '删除',
      //   popConfirm: {
      //     title: '是否确认删除',
      //     confirm: handleDelete.bind(null, record),
      //   },
      // },
      {
        label: '销课',
        // color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record,1),
      },
      {
        label: '迟到',
        // color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record,2),
      },
      {
        label: '早退',
        // color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record,3),
      },
      {
        label: '缺课',
        // color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record,4),
      },
      {
        label: '请假',
        // color: record.replyContent?'error':'success',
        onClick: handleEdit.bind(null, record,5),
      },
    ]
  }
  async function handleEdit(record,num){
    
    await courseOfflineUserRecordEdit({ id: record.id,beginsStatus:num});
    reload()
  }
  // 重置表单
  async function onReset() {
    
    let param = {
      id : '',
      courseId : '',
      name : '',
      sort : '',
      isTryLook : '',
      isPlayBack : '',
      teacherName:'',
      parentId:'',
      type:''
    }
    setFieldsValue(param)
    // await resetFields();
    // await setFieldsValue({ ...model.value });
  }

  // 提交事件
  async function onSubmit() {
    try {
      
      loading.value = true;
      let values = await validate();
      // let values1 = await validate1();
      // let values2 = await validate2();
      // values = Object.assign(values,values1,values2)
      console.log(values,'values')
      // return
      if(values.type == 'section'){
        let param = {
          id : values.id,
          courseId : values.courseId,
          name : values.name,
          sort : values.sort,
        }
        await courseSectionEdit(param)
      }else if(values.type == 'node'){
        let param = {
          id : values.id,
          courseId : values.courseId,
          name : values.name,
          sort : values.sort,
          teacherName : values.teacherName,
          // isTryLook : values.isTryLook,
          // isPlayBack : values.isPlayBack,
          // isCommerce: values.isCommerce,
          // isExercise: values.isExercise,
          startTime : values.startTime,
          endTime : values.endTime,
          parentId:values.parentId
        }
        await courseSectionEdit(param);
      }else if(values.type == 'addNode'){
        let param = {
          courseId : values.courseId,
          name : values.name,
          sort : values.sort,
          teacherName : values.teacherName,
          // isTryLook : values.isTryLook,
          // isPlayBack : values.isPlayBack,
          // isCommerce: values.isCommerce,
          // isExercise: values.isExercise,
          startTime : values.startTime,
          endTime : values.endTime,
          parentId:values.parentId
        }
        await courseSectionAdd(param);
      }


      //刷新列表
      emit('success');
      Object.assign(model.value, values);
    } finally {
      loading.value = false;
    }
  }
</script>
