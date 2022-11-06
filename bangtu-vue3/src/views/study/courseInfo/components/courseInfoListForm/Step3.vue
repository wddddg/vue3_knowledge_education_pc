<template>
  <div class="step3">
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
  import { userColumns  } from './courseInfoListForm.data';
  import {addOrUpdateClassCourse} from '../../courseInfo.api';
  import RelBizSelectModal from './relation/RelBizSelectModal.vue';
  import { useModal,BasicModal  } from '/src/components/Modal';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['redo','submitCourse','next']);
  const emitData = ref<object>();
  const isEdit= inject('isEdit')
  const setFormData = inject('setFormData', 'submitCourse');
  //注册model
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

  function open(){
    openModal(true,{

    })
  }

  let tableData = ref([])
  tableData.value = setFormData.value.classRelationVOList?cloneDeep(setFormData.value.classRelationVOList):[]
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
  
  function setValue(data) {
    console.log(data,'data');
    data.forEach(item=>{
      item.courseName = item.name
      item.courseId = item.id
    })
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
      RelationList.push({courseId:item.courseId})
    })
    let param = {
      id:setFormData.value.id,
      classRelationVOList:RelationList
    }
    addOrUpdateClassCourse(param).then(res=>{
      
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
