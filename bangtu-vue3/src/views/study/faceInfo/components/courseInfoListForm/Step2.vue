<template>
  <div class="step2">
    <a-card title="课程信息" :bordered="false">
      <BasicForm @register="register" :disabled="!isEdit">
          <template #jAreaLinkage="{ model, field }">
            <JAreaLinkage v-model:value="model[field]" :showArea="true" :showAll="false" :disabled="!isEdit"/>
          </template>
          <template #selectProvince="{ model, field }">
            <a-select :options="provinceOptions"  v-model:value="model[field]" @change="selectProvince" allowClear :disabled="!isEdit"/>
          </template>
          <template #selectCity="{ model, field }">
            <a-select :options="cityOptions"  v-model:value="model[field]" @change="selectCity" allowClear :disabled="!isEdit"/>
          </template>
          <template #selectArea="{ model, field }">
            <a-select :options="areaOptions"  v-model:value="model[field]" @change="selectArea" allowClear :disabled="!isEdit"/>
          </template>
      </BasicForm>
      <div v-show="false">
        <BasicTable @register="registerTable" :rowSelection="rowSelection" >
          <template #tableTitle>
            <!-- 
            <a-tabs type="card"  v-model:activeKey="activeKey" :defaultActiveKey="15" :style="{ width: '1500px' }">
              <a-tab-pane :key="itme.date" :tab="itme.date" v-for="(itme,i) in tabItem" ></a-tab-pane>
            </a-tabs> -->
            <!-- <a-button type="primary" @click="handleCreate"> 新增用户</a-button> -->
            <!-- <a-button type="primary" @click="handleSelect"> 已有用户</a-button> -->

            <!-- <a-dropdown v-if="checkedKeys.length > 0">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="bx:bx-unlink"></Icon>
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button
                >批量操作
                <Icon icon="ant-design:down-outlined"></Icon>
              </a-button>
            </a-dropdown> -->
          </template>
          <!-- <template #action="{ record }">
            <TableAction :actions="getTableAction(record)" />
          </template> -->
        </BasicTable>
        <div>
          <a-button @click="addLine" v-if="isEdit">添加行</a-button>
        </div>
      </div>
    </a-card>
    <a-divider />

      <div class="submit">
        <a-button type="primary" class="but" @click="customResetFunc"> 上一步 </a-button>
        <a-button type="primary" class="but" style="margin-left: 20px" @click="customSubmitFunc"> 完成 </a-button>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, inject, watchEffect, watch, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Alert, Divider, Descriptions } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/src/components/Table';
  import { columnsForm, step2Schemas } from './courseInfoListForm.data';
  import { list } from '../../courseInfo.api';
  import {listArea} from '/@/api/common/api'
  import { cloneDeep } from 'lodash-es';
  let showTable = ref(false);
  let switchType = ref(1)
  let provinceOptions = ref<Object[]>([])
  let cityOptions =  ref<Object[]>([])
  let areaOptions =  ref<Object[]>([])
  const isEdit= inject('isEdit')
  const isUpdate= inject('isUpdate')
  const setFormData = inject('setFormData', 'submitCourse');
  const emit = defineEmits(['next', 'prev', 'submitCourse','redo']);
  const [register, { validate, setProps, getFieldsValue, setFieldsValue,resetFields }] = useForm({
    labelWidth: 120,
    schemas: step2Schemas(showTable,switchType,isEdit,provinceOptions,selectProvince,cityOptions,selectCity,areaOptions,selectArea),
    fieldMapToTime: [
      // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
      // 'YYYY-MM-DD'为时间格式，参考moment
      ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
    ],
    actionColOptions: {
      span: 14,
    },
    resetButtonOptions: {
      text: '上一步',
    },
    submitButtonOptions: {
      text: '提交',
    },
    showActionButtonGroup: false,
    resetFunc: customResetFunc,
    submitFunc: customSubmitFunc,
  });
  console.log(setFormData, 'setFormData');
  let TableData = ref([])
  TableData.value = setFormData.value.coursePriceVOList?cloneDeep(setFormData.value.coursePriceVOList):[]
  const [registerTable, { reload, updateTableDataRecord, setProps: setPropsTable, setTableData }] = useTable({
    title: '用户列表',
    // api: list,
    dataSource:TableData.value,
    columns: columnsForm(isEdit),
    // formConfig: {
    //   labelWidth: 120,
    //   schemas: searchFormPageSchema,
    //   autoSubmitOnEnter: true,
    //   actionColOptions: { pull: 1 },
    // },
    // striped: true,
    // useSearchForm: false,
    // showTableSetting: true,
    // clickToRowSelect: false,
    // bordered: true,
    // showIndexColumn: false,
    // tableSetting: { fullScreen: false },
    pagination: false,
    canResize: false,
    rowKey: 'id',
    searchInfo: {},
    // actionColumn: {
    //   width: 180,
    //   title: '操作',
    //   dataIndex: 'action',
    //   slots: { customRender: 'action' },
    //   fixed: undefined,
    // },
  });

  watchEffect(() => {
    
    setFormData.value.costType==2||setFormData.value.costType==4? showTable.value=true:showTable.value=false
  });


  onMounted(async () => {
    // let switchForm = true
    watch(
      () => setFormData.value,
      (o, n) => {
        
        // if(!switchForm){
        //   return
        // }

          setFormData.value.costType ?setFormData.value.costType:delete setFormData.value.costType
          setFormData.value.province ?setFormData.value.province:delete setFormData.value.province
          setFormData.value.city ?setFormData.value.city:delete setFormData.value.city
          setFormData.value.county ?setFormData.value.county:delete setFormData.value.county
          setFormData.value.address ?setFormData.value.address:delete setFormData.value.address
          setFormData.value.teachDesc ?setFormData.value.teachDesc:delete setFormData.value.teachDesc
        if(isEdit.value&&!isUpdate.value){
          // switchForm = false
          // resetFields()
        }
        setFieldsValue(setFormData.value);
        getAreaOption(setFormData.value.province,0);
        getAreaOption(setFormData.value.city,1);
        // setTableData(setFormData.value.coursePriceVOList);

        reload();
      },
      { deep: true }
    );
    watch(
      TableData.value,
      (o, n) => {
        setTableData(TableData.value);
        reload();
      },
      { deep: true }
    );
    let res = await listArea()
    provinceOptions.value = [];
    res.forEach(element => {
        provinceOptions.value.push({value:element.areaNo, label: element.areaName}) ;
    });
  });
  function getAreaOption(areaParentno, type){
      let me = this;
    listArea({areaParentno:areaParentno}).then(function(resp){
        
        let items = [];
        resp.forEach(element => {
            items.push({value:element.areaNo, label: element.areaName}) ;
        });
        if(!type){
            cityOptions.value = items;
        }else{
            areaOptions.value = items;
        }
      })
  }
  function selectProvince(e){
    console.log(e,'e');
    
      getAreaOption(e,0)
      setFieldsValue({city:null, county:null})
  }

  function selectCity(e){
      getAreaOption(e,1)
      setFieldsValue({ county:null})
  }

  function selectArea(e){

  }


  function addLine() {
    TableData.value.push({});
    console.log(TableData.value, 'TableData');
  }

  async function customResetFunc() {
    emit('prev');
  }

  async function customSubmitFunc() {
    try {
      const values = await validate();
      
      // return
      // values.activityEndTime.format('YYYY-MM-DD HH:mm:ss')
      // Object.assign(values, { coursePriceVOList: TableData.value });
      // setProps({
      //   submitButtonOptions: {
      //     loading: true,
      //   },
      // });
      // setTimeout(() => {
      //   setProps({
      //     submitButtonOptions: {
      //       loading: false,
      //     },
      //   });
      // }, 1500);
      emit('redo');
      emit('submitCourse', values, 'step2');
    } catch (error) {}
  }
</script>
<style lang="less" scoped>
  .step2 {
    // width: 550px;
    margin: 0 auto;
  }
  .but {
    margin-left: 50%;
    transform: translate(-105%);
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
