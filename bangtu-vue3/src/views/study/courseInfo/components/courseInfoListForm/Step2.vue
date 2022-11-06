<template>
  <div class="step2">
    <a-card title="课程信息" :bordered="false">
      <BasicForm @register="register" :disabled="!isEdit"/>
      <div v-show="showTable">
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
        <a-button type="primary" class="but" style="margin-left: 20px" @click="customSubmitFunc"> 下一步 </a-button>
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
  import { cloneDeep } from 'lodash-es';
  let showTable = ref(false);
  let switchType = ref(1)
  const isEdit= inject('isEdit')
  const setFormData = inject('setFormData', 'submitCourse');
  const emit = defineEmits(['next', 'prev', 'submitCourse']);
  const [register, { validate, setProps, getFieldsValue, setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: step2Schemas(showTable,switchType),
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

  onMounted(() => {
    watch(
      () => setFormData.value,
      (o, n) => {
        
        setFormData.value.costType ?setFormData.value.costType:delete setFormData.value.costType
        setFieldsValue(setFormData.value);
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
  });

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
      
      // values.activityEndTime.format('YYYY-MM-DD HH:mm:ss')
      Object.assign(values, { coursePriceVOList: TableData.value });
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
      emit('next');
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
