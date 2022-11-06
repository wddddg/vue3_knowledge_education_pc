<template>
  <div>
  <a-card >
    <div>
      <div class="c-right">
        <div class="rt-top">
          <div class="title-tip1">
            <div>讲师名称</div>
            <!-- <a-select v-model:value="teacherName" style="width:100px;margin-left:10px" :options="teacherNameList">
            </a-select> -->
            <div style="width:250px;margin-left:10px">
              <JSelectTeacher  @change="getTeacherName" :isRadioSelection='true'></JSelectTeacher>
            </div>
            
          </div>
          <div class="top-tie">
            <a-radio-group v-model:value="queryType" >
              <a-radio-button :value="1">本月</a-radio-button>
              <a-radio-button :value="2">本年</a-radio-button>
            </a-radio-group>
            <a-range-picker v-model:value="times" format="YYYY-MM-DD HH:mm:ss" style="width: 240px"  />
          </div>
        </div>
        <!-- <div>
          <div ref="chartRef" :style="{ width, height }"></div>
        </div> -->
      </div>
      <LineMulti :chartData="barMultiData" height="50vh" :option="multiBarOption" type="line" />
    </div>
  </a-card>
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection" @fetch-success="getTeacherList">
     <!--插槽:table标题-->
      <template #tableTitle>
          <!-- <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button> -->
          <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出数据</a-button>
          <a-button type="primary" @click="batchHandleDelete">删除</a-button>
          <!-- <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
          <!-- <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>批量操作
                <Icon icon="mdi:chevron-down"></Icon>
              </a-button>
        </a-dropdown> -->
      </template>
       <!--操作栏-->
      <template #action="{ record }">
        <!-- <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/> -->
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #htmlSlot="{text}">
         <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{text}">
         {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{text}">
         <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
         <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <TeacherReportModal @register="registerModal" @success="handleSuccess"></TeacherReportModal>
    <TeacherIncomeDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="settle-teacherReport" setup>
  import {ref, computed, unref,watchEffect} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage'
  import TeacherReportModal from './components/TeacherReportModal.vue'
  import {columns, searchFormSchema} from './TeacherReport.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl,getReport} from './TeacherReport.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import TeacherIncomeDrawer from './components/TeacherIncomeDrawer.vue';
  import LineMulti from '/@/components/chart/LineMulti.vue';
  import { message } from 'ant-design-vue';
  import JSelectTeacher from '/@/components/Form/src/jeecg/components/JSelectTeacher.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  let isReport = ref(true)
  let isActions= ref(true)
  let barMultiData = ref([])
  let queryType = ref('1')
  let startTime = ''
  let endTime = ''
  let times = ref([])
  let teacherName = ref('')
  let teacherNameList = ref([{label:'全部',value:''}])
  let parem = {
    queryType: queryType.value,
    bookId:''
  }

  function getTeacherName(e){
    teacherName.value = e[0]
    
  }

  const multiBarOption = {
    title: { text: '基本统计', left: 'center' },
  };
  function Report(data){
    getReport(data).then(res=>{
      barMultiData.value = []
      res.forEach((item)=>{
        let param = {}
        param.name = item.x
        param.value = item.y
        barMultiData.value.push(param)
      })
      console.log(barMultiData.value)
    }) 
  }
  watchEffect(() => {
    console.log(queryType.value)
    console.log(times.value)
    console.log(teacherName.value)
    if(times.value.length!=0){
      startTime = times.value[0].format("YYYY-MM-DD") + ' 00:00:00'
      endTime = times.value[1].format("YYYY-MM-DD")+ ' 23:59:59'
    }else{
      startTime = null
      endTime = null
    }
    console.log(startTime,endTime)
    let param = {}
    param.queryType = queryType.value
    param.teacherId = teacherName.value
    param.startTime = startTime
    param.endTime = endTime
    // param.bookId = roleId.value
    Report(param)
  });

  
  function getTeacherList({items,total}){
    teacherNameList.value = [{label:'全部',value:''}]
    items.forEach(element => {
      let param = {}
      param.label =  element.name
      param.value =  element.name
      teacherNameList.value.push(param)
    });
  }

  //注册model
  const [registerModal, {openModal}] = useModal();
  const [registerDrawer, { openDrawer }] = useDrawer();
  //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '讲师工资结算单',
           api: list,
           columns,
           canResize:false,
           formConfig: {
              labelWidth: 120,
              schemas: searchFormSchema,
              autoSubmitOnEnter:true,
              showAdvancedButton:true,
              fieldMapToNumber: [
              ],
              fieldMapToTime: [
              ],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
            },
      },
       exportConfig: {
            name:"讲师工资结算单",
            url: getExportUrl,
          },
          importConfig: {
            url: getImportUrl,
            success: handleSuccess
          },
  })

  const [registerTable, {reload},{ rowSelection, selectedRowKeys,getDataSource }] = tableContext

   /**
    * 新增事件
    */
  function handleAdd() {
     openModal(true, {
       isUpdate: false,
       showFooter: true,
     });
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
   /**
    * 删除事件
    */
  async function handleDelete(record) {
     await deleteOne({id: record.id}, handleSuccess);
   }
   /**
    * 批量删除事件
    */
  async function batchHandleDelete() {
     if(selectedRowKeys.value.length === 0) return message.error('请选择你要删除的数据')
     await batchDelete({ids: selectedRowKeys.value}, handleSuccess);
   }
   /**
    * 成功回调
    */
  function handleSuccess() {
      (selectedRowKeys.value = []) && reload();
   }
   /**
      * 操作栏
      */
  function getTableAction(record){
       return [
         {
           label: '收入详情',
           onClick: handleDetail.bind(null, record),
         },
         {
           label: record.isSettle?'结算':'',
           onClick: handleEdit.bind(null, record),
           disabled:record.isSettle == 1
         }
       ]
   }
     /**
        * 下拉操作栏
        */
  function getDropDownAction(record){
      return [
           {
             label: '详情',
             onClick: handleDetail.bind(null, record),
           }, {
             label: '删除',
             popConfirm: {
               title: '是否确认删除',
               confirm: handleDelete.bind(null, record),
             }
           }
      ]
   }
</script>

<style lang="less" scoped>
  .c-right {
    width: 84%;
  }

  .title-tip {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 28px;
      background: #2c6afd;
      margin-right: 14px;
    }
  }
  .rt-top {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-tip1 {
      display: flex;
      align-items: center;
      position: relative;
      width: 400px;;
      left: 40%;
    }
  }
</style>