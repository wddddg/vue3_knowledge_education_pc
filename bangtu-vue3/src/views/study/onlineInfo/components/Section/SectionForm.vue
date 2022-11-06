<template>
  <a-spin :spinning="loading">
    <a-steps :current="current" class="steps" v-show="isNode">
      <a-step title="节点配置" />
      <a-step title="关联配置" />
    </a-steps>
    <BasicForm @register="registerForm" v-show="!current" />
    <BasicForm @register="registerForm2" v-show="current" />
    <BasicTable @register="registerTable1" :rowSelection="rowSelection" v-show="isTable1&&nodeType == '3'&&current">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-button type="primary" @click="open" > 关联</a-button>

      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <BasicForm @register="registerForm1" v-show="current" />
    <BasicTable @register="registerTable2" :rowSelection="rowSelection" v-show="isTable2&&current">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-button type="primary" @click="open2" > 关联</a-button>

      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction2(record)" />
      </template>
        <!--字段回显插槽-->
        <template #htmlSlot="{text}">
          <div v-html="text"></div>
        </template>
    </BasicTable>
    <div class="j-box-bottom-button offset-20" style="margin-top: 30px">
      <div class="j-box-bottom-button-float">
        <a-button preIcon="ant-design:sync-outlined" @click="onReset">重置</a-button>
        <a-button type="primary" preIcon="ant-design:save-filled" @click="onSubmit(1)" v-show="!current && isNode">下一步</a-button>
        <a-button type="primary" preIcon="ant-design:save-filled" @click="onSubmit(0)" v-show="current || !isNode">保存</a-button>
      </div>
    </div>
  </a-spin>
    <RelBizSelectModal1 @reload="reload" @register="regModal" @getSelectResult="setValue" v-bind="getBindValue"></RelBizSelectModal1>
    <RelBizSelectModal2 @reload="reload2" @register="regModal2" ></RelBizSelectModal2>
</template>

<script lang="ts" setup>
  import { watch, computed, inject, ref, unref, onMounted,defineExpose,watchEffect } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { courseSectionEdit,courseSectionAdd } from '../../courseInfo.api';
  import { useBasicFormSchema, userColumns1,userColumns2,basicFormSchema1,basicFormSchema2,basicFormSchema } from './Section.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { cloneDeep, now } from 'lodash-es';
  import RelBizSelectModal1 from './relation/RelBizSelectModal1.vue';
  import RelBizSelectModal2 from './relation/RelBizSelectModal2.vue';
  import { useModal,BasicModal  } from '/src/components/Modal';
  import { courseLiveGoodsList,courseLiveGoodsDelete,courseSectionPracticeList,courseSectionPracticeDelete } from '../../courseInfo.api';

  const emit = defineEmits(['success']);
  defineExpose({clearNode,onReset})
  const props = defineProps({
    data: { type: Object, default: () => ({}) },
    rootTreeData: { type: Array, default: () => [] },
    showCurrent: { type:Number, default: 0 }
  });
  const current = ref(0)
  const isNode = ref(true)
  const correlationId = ref('')
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
    let data = { ...props.data }
    if(correlationId.value){
      data.parentId = data.id
      data.id = correlationId.value
    }
    openModal(true,{
      nodeData:data
    })
  }
  function open2(){
    let data = { ...props.data }
    if(correlationId.value){
      data.parentId = data.id
      data.id = correlationId.value
    }
    openModal2(true,{
      nodeData:data
    })
  }
  let isTable1 = ref(false)
  let isTable2 = ref(false)
  let minute= ref<number>(0)
  let second= ref<number>(0)
  let nodeType = ref(null);
  
  let isSectionType = ref(props.data.sectionType)
  //注册表单
  const [registerForm, { resetFields, setFieldsValue, validate, updateSchema,getFieldsValue }] = useForm({
    schemas:basicFormSchema(minute,second,nodeType,isSectionType),
    showActionButtonGroup: false,
    fieldMapToTime: [
      // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
      // 'YYYY-MM-DD'为时间格式，参考moment
      // ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
    ],
  });1
  const [registerForm1, { resetFields:resetFields1, setFieldsValue:setFieldsValue1, validate:validate1, updateSchema:updateSchema1,getFieldsValue:getFieldsValue1 }] = useForm({
    schemas:basicFormSchema1(nodeType,isTable2),
    showActionButtonGroup: false,
  });
  const [registerForm2, { resetFields:resetFields2, setFieldsValue:setFieldsValue2, validate:validate2, updateSchema:updateSchema2,getFieldsValue:getFieldsValue2 }] = useForm({
    schemas: basicFormSchema2({isTable1,minute,second,nodeType,isSectionType,current }),
    showActionButtonGroup: false,
  });


  //点击添加按钮，清除form
  async function clearNode(){
    let values = { ...await getFieldsValue(), ...await getFieldsValue2() }
    console.log(values.type,'values.type');
    
    // if(values.type != 'section'){
    //   const { createMessage } = useMessage()
    //   createMessage.error('请选择要添加节的章')
    //   return
    // }
    if(props.data.type != 'section'){
      const { createMessage } = useMessage()
      createMessage.error('请选择要添加节的章')
      return
    }
    
    updateSchema([
      { field: 'isTryLook', show: true },
    ]);
    updateSchema1([
      { field: 'isExercise', show: true },
    ]);
    updateSchema2([
      { field: 'sectionType', show: true },
      { field: 'isPlayBack', show: ({ model }) => {
        return model.sectionType == '3'
      }, },
      { field: 'datetime', show: ({ model }) => {
        return model.sectionType == '3'
      }, },
      { field: 'videoUrl', show: ({ model }) => {
        return model.sectionType == '1' || model.sectionType == '5'
      }, },
      { field: 'time', show: ({ model }) => {
        return model.sectionType == '2'
      }, },
      { field: 'content', show: ({ model }) => {
        return model.sectionType == '2'
      }, },
    ]);
    isNode.value = true
    let param = {
      id : '',
      courseId : props.data.courseId,
      // name : '',
      // title: '',
      // sort : '',
      isTryLook : '',
      isPlayBack : '',
      isCommerce:'',
      isExercise:'',
      sectionType:'',
      videoUrl:'',
      duration:'',
      content:'',
      datetime:['',''],
      type:'addNode',
      parentId:props.data.id,
      startTime : '',
      endTime : '',
    }
    await resetFields()
    await resetFields1()
    await resetFields2()
    setProps({ searchInfo: { sectionId: '',chapterId:values.id } });
    setProps2({ searchInfo: { sectionId: '',chapterId:values.id } });
    reload()
    reload2()
    setFieldsValue(param)
    setFieldsValue1(param)
    setFieldsValue2(param)
  }
  //点击树节点，更新form
  onMounted(()=>{
    let isSwitch = false
    watch(
      ()=>props.data,
      async () => {
        onReset()
        console.log(props.data,'props.data')
        setProps({ searchInfo: { sectionId: props.data.parentId,chapterId:props.data.id } });
        setProps2({ searchInfo: { sectionId: props.data.parentId,chapterId:props.data.id } });
        reload()
        reload2()
        if(props.data.parentId){
          updateSchema([
            { field: 'isTryLook', show: true },
          ]);
          updateSchema1([
            { field: 'isExercise', show: true },
          ]);
          updateSchema2([
            { field: 'sectionType', show: true },
            { field: 'isPlayBack', show: ({ model }) => {
              return model.sectionType == '3'
            }, },
            { field: 'datetime', show: ({ model }) => {
              return model.sectionType == '3'
            }, },
            { field: 'videoUrl', show: ({ model }) => {
              return model.sectionType == '1' || model.sectionType == '5'
            }, },
            { field: 'time', show: ({ model }) => {
              return model.sectionType == '2'
            }, },
            { field: 'content', show: ({ model }) => {
              return model.sectionType == '2'
            }, },
          ]);
          await setFieldsValue(props.data)
          await setFieldsValue1(props.data)
          await setFieldsValue2(props.data)
          isNode.value = true
        }else{
          updateSchema([
            { field: 'isTryLook', show: false },
          ]);
          updateSchema1([
             { field: 'isExercise', show: false },
          ]);
          updateSchema2([
            { field: 'sectionType', show: false },
            { field: 'isPlayBack', show: false },
            { field: 'datetime', show: false },
            { field: 'videoUrl', show: false },
            { field: 'time', show: false },
            { field: 'content', show: false },
          ]);
          isNode.value = false
          await setFieldsValue(props.data)
          await setFieldsValue1(props.data)
          await setFieldsValue2(props.data)
        }
        nodeType.value =  props.data.sectionType
        isSectionType.value = props.data.sectionType
        isSwitch = true
        minute.value = props.data.durationCh?parseInt(props.data.durationCh.slice(0,props.data.durationCh.indexOf('分'))):0
        second.value = props.data.durationCh?parseInt(props.data.durationCh.slice(props.data.durationCh.indexOf('分')+1,props.data.durationCh.length-1)):0
        // props.data.isCommerce==1? isTable1.value=true:isTable1.value=false
        // props.data.isExercise==1? isTable2.value=true:isTable2.value=false
        if(props.data.sectionType == '3'&&props.data.isCommerce){
          isTable1.value = true
        }else{
          isTable1.value = false
        }
        if(props.data.isExercise){
          isTable2.value = true
        }else{
          isTable2.value = false
        }
        current.value = 0
        // correlationId.value = ''
        // let values00 = await getFieldsValue();
        // let values11 = await getFieldsValue1();
        // let values22 = await getFieldsValue2();
        // console.log(values00,values11,values22,'getFieldsValue222');
      },
    )
    watch(
      ()=>nodeType.value,
      async (o,n)=>{
        
        if(isSwitch){
          return isSwitch = false
        }
        let values1 = await validate1();
        let values2 = await validate2();
        if(n == '3'&&values1.isCommerce){
          isTable1.value = true
        }else{
          isTable1.value = false
        }
        if(values1.isExercise){
          isTable2.value = true
        }else{
          isTable2.value = false
        }
      }
    )
    watch(() => props.showCurrent,() =>{
      current.value = 0
    }, {
      deep:true,
      immediate:true
    })
  })

  // let tableData = ref([])
  // tableData.value = cloneDeep() 
  const [registerTable1, { reload,  setProps,setTableData }] = useTable({
    title: '用户列表',
    api: courseLiveGoodsList,
    columns: userColumns1,
    // dataSource:tableData.value,
    // formConfig: {
    //   labelWidth: 120,
    //   schemas: searchUserFormSchema,
    //   autoSubmitOnEnter: true,
    //   actionColOptions: { pull: 1 },
    // },
    // striped: true,
    // useSearchForm: false,
    // showTableSetting: true,
    // clickToRowSelect: false,
    // bordered: true,
    // showIndexColumn: false,
    // tableSetting: { fullScreen: true },
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  const [registerTable2, { reload:reload2, setProps:setProps2,setTableData:setTableData2 }] = useTable({
    title: '用户列表',
    api: courseSectionPracticeList,
    columns: userColumns2,
    // dataSource:tableData.value,
    // formConfig: {
    //   labelWidth: 120,
    //   schemas: searchUserFormSchema,
    //   autoSubmitOnEnter: true,
    //   actionColOptions: { pull: 1 },
    // },
    // striped: true,
    // useSearchForm: false,
    // showTableSetting: true,
    // clickToRowSelect: false,
    // bordered: true,
    // showIndexColumn: false,
    // tableSetting: { fullScreen: true },
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
    },
  });
  function getTableAction(record){
    return [
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      }
    ]
  }
  function getTableAction2(record){
    return [
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete2.bind(null, record),
        },
      }
    ]
  }
  async function handleDelete(record){
    
    await courseLiveGoodsDelete({ id: record.id});
    reload()
  }
  async function handleDelete2(record){
    
    await courseSectionPracticeDelete({ id: record.id});
    reload2()
  }
  // 重置表单
  async function onReset(allReset = false) {
    
    let param = {}
    if(current.value){
      param = {
        courseId : '',
        isCommerce:'',
        isExercise:'',
        isPlayBack : '',
        datetime:['',''],
        content:'',
        videoUrl:'',
      }
      isTable1.value = false
      isTable2.value = false
      if(isSectionType.value === undefined || isSectionType.value === null){
        param.sectionType = ''
      }
    }else{
      param = {
        id : props.data.id,
        // name : '',
        // sort : '',
        // isTryLook : '',
        // sectionType:'',
        parentId:props.data.parentId,
        duration:'',
        type:props.data.type
      }
    }
    console.log(param);
    await resetFields()
    await resetFields1()
    await resetFields2()
    setFieldsValue(param)
    setFieldsValue1(param)
    setFieldsValue2(param)
    if(allReset){
      await resetFields();
    }
    // await setFieldsValue({ ...model.value });
  }

  // 提交事件
  async function onSubmit(value) {
    try {
      
      loading.value = true;
      let values = await validate();
      let values1 = await validate1();
      let values2 = await validate2();
      values.duration = parseInt(minute.value)*60 + parseInt(second.value)
      values = Object.assign(values,values1,values2)
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
          isTryLook : values.isTryLook,
          isPlayBack : values.isPlayBack,
          isCommerce: values.isCommerce,
          isExercise: values.isExercise,
          startTime : values.startTime,
          sectionType : values.sectionType,
          endTime : values.endTime,
          videoUrl:values.videoUrl,
          duration:values.duration,
          content:values.content,
          parentId:values.parentId
        }
        await courseSectionEdit(param);
      }else if(values.type == 'addNode'){
        let param = {
          courseId : values.courseId,
          name : values.name,
          sort : values.sort,
          isTryLook : values.isTryLook,
          isPlayBack : values.isPlayBack,
          isCommerce: values.isCommerce,
          isExercise: values.isExercise,
          startTime : values.startTime,
          sectionType : values.sectionType,
          endTime : values.endTime,
          videoUrl:values.videoUrl,
          duration:values.duration,
          content:values.content,
          parentId:values.parentId
        }
        if(value){
          await courseSectionAdd(param).then(res =>{
            correlationId.value = res.id
          })
          setProps2({ searchInfo: { sectionId: props.data.parentId,chapterId:correlationId.value } })
          setProps({ searchInfo: { sectionId: props.data.parentId,chapterId:correlationId.value } })
          reload2()
          reload()
        }else{
          param.id = correlationId.value
          await courseSectionEdit(param);
          current.value = value
          onReset()
        }
      }

      current.value = value
      //刷新列表
      emit('success');
      console.log(model.value,values,'model.values3333333');
      Object.assign(model.value, values);
      
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="less" scoped>
.steps{
  margin: 0px auto 20px;
  padding: 10px;
  width: 50%;
}
</style>