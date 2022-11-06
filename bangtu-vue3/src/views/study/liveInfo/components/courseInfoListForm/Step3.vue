<template>
  <div class="step3">
    <BasicTable @register="registerClassTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-button type="primary" @click="openForm" v-if="isEdit"> 添加</a-button>

      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableClassAction(record)" />
      </template>
    </BasicTable>
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
        <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->
        <a-button type="primary" @click="open" v-if="isEdit"> 关联</a-button>

      </template>
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <a-divider />
    <RelBizSelectModalForm @register="regModalForm" @getSelectResult="setClassValue" @refineResult="refineResult" v-bind="getBindValue"></RelBizSelectModalForm>
    <RelBizSelectModal @register="regModal" @getSelectResult="setValue" v-bind="getBindValue"></RelBizSelectModal>
    <!-- <a-button type="primary" class="but" @click="customSubmitFunc" > 上一步 </a-button> -->

      <div class="submit">
        <a-button type="primary" class="but" @click="redo" > 完成 </a-button>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent,ref,reactive,inject } from 'vue';
  import { Result, Descriptions } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { userColumns,classColumns  } from './courseInfoListForm.data';
  import {addOrUpdateCourseExam} from '../../courseInfo.api';
  import RelBizSelectModal from './relation/RelBizSelectModal.vue';
  import RelBizSelectModalForm from './relation/RelBizSelectModalForm.vue';
  import { useModal,BasicModal  } from '/src/components/Modal';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['redo','submitCourse','next']);
  const emitData = ref<object>();
  const isEdit= inject('isEdit')
  const setFormData = inject('setFormData', 'submitCourse');
  //注册model
  const [regModalForm, { openModal:openModalForm }] = useModal();
  const [regModal, { openModal }] = useModal();
  //表单值
  // const [state] = useRuleFormItem(props, 'value', 'change', emitData);
  //下拉框选项值
  const selectOptions = ref<SelectTypes['options']>([]);
  //下拉框选中值
  let selectValues = reactive<Recordable>({
    value: [],
    change: false,
  });
  // const getBindValue = Object.assign({}, unref(props), unref(attrs));
  function openForm(){
    openModalForm(true,{

    })
  }
  function open(){
    openModal(true,{

    })
  }
  let tableClassData = ref([])
  tableClassData.value = setFormData.value.coursewareVOList?cloneDeep(setFormData.value.coursewareVOList):[]
  const [registerClassTable, { reload:reloadClass, setProps:setPropsClass,setTableData:setTableDataClass }] = useTable({
    title: '课件列表',
    // api: getbookUserStudy,
    columns: classColumns,
    dataSource:tableClassData.value,
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
  let tableData = ref([])
  tableData.value = setFormData.value.courseExamVOList?cloneDeep(setFormData.value.courseExamVOList):[]
  const [registerTable, { reload, updateTableDataRecord, setProps,setTableData }] = useTable({
    title: '用户列表',
    // api: getbookUserStudy,
    columns: userColumns,
    dataSource:tableData.value,
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
  function getTableClassAction(record){
    return [
      {
        label: '编辑',
        onClick: handleClassEite.bind(null, record),
      },
      {
        label: '删除',
        onClick: handleClassDelete.bind(null, record),
      }
    ]
  }
  function handleClassDelete(record){
    let data = []
    tableClassData.value.forEach(itme=>{
      if(record.fileName != itme.fileName){
        data.push(itme)
      }
    })
    tableClassData.value = data
    setTableDataClass(tableClassData.value)
    reload()
  }
  function handleClassEite(record){
    // reload()
    let score = 0
    for(let i=0;i<tableClassData.value.length;i++){
      if(tableClassData.value[i].fileName == record.fileName){
        score = i
        break
      }
    }
    openModalForm(true,{
      record,
      isEdit:true,
      score:score
    })
  }

  function getTableAction(record){
    return [
      {
        label: '删除',
        onClick: handleDelete.bind(null, record),
      }
    ]
  }
  function handleDelete(record){
    let data = []
    tableData.value.forEach(itme=>{
      if(record.id != itme.id){
        data.push(itme)
      }
    })
    tableData.value = data
    setTableData(tableData.value)
    reload()
  }
    /**
   * 设置table的值
   */  
  function setClassValue(data) {
    
    if(data.file.length != 0){
      data.fileLength = data.file[0].fileSizeTxt
      data.fileUrl = data.file[0].fileUrl
      data.coursewareType  = data.file[0].fileSuffix
    }
    let time =  new Date()
    // data.updateTime = time.getFullYear() +'-'+ (time.getMonth()+1) +'-'+ time.getDate() +' '+ time.getHours() +':'+ time.getMinutes()
    tableClassData.value.push(data)
    setTableDataClass(tableClassData.value)
    reload()
  }
  
  function refineResult(data,score){
    
    if(data.file.length != 0){
      data.fileLength = data.file[0].fileSizeTxt
      data.fileUrl = data.file[0].fileUrl
      data.coursewareType  = data.file[0].fileSuffix
    }
    let time =  new Date()
    // data.updateTime = time.getFullYear() +'-'+ (time.getMonth()+1) +'-'+ time.getDate() +' '+ time.getHours() +':'+ time.getMinutes()
    tableClassData.value[score] = data
    setTableDataClass(tableClassData.value)
    reload()
  }

  function setValue(data) {
    
    tableData.value =  [...tableData.value,...data]
    setTableData(tableData.value)
    reload()
  }
  const redo = () => {
      if(!isEdit.value){
        emit('redo');
        return 
      }
    let RelationList = []
    tableData.value.forEach(item=>{
      RelationList.push({examId:item.id})
    })
    let param = {
      id:setFormData.value.id,
      coursewareVOList:tableClassData.value,
      courseExamVOList:RelationList
    }
    addOrUpdateCourseExam(param).then(res=>{
      
      emit('redo');
    })

  }
  async function customSubmitFunc() {
    try {
      emit('next' );
    } catch (error) {}
  }

</script>
<style lang="less" scoped>
  .step3 {
    // width: 600px;
    margin: 0 auto;
  }

  .desc-wrap {
    padding: 24px 40px;
    margin-top: 24px;
    background-color: @background-color-light;
  }
  .but{
    margin-left: 50%;
    transform: translate(-50%);
  }
.submit{
  position:fixed;
  background: #fff;
  width: 1200px;
  right: 0px;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  z-index: 999;
}
</style>
