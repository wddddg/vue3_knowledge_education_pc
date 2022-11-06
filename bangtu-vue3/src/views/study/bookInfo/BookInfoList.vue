<template>
  <div>
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection">
     <!--插槽:table标题-->
      <template #tableTitle>
          <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
          <a-button type="primary" @click="batchHandleDelete" > 删除</a-button>
          <a-button type="primary" @click="setOnlineBatch(1)" > 批量启用</a-button>
          <a-button type="primary" @click="setOnlineBatch(0)" > 批量停用</a-button>
          <!-- <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button> -->
          <!-- <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
          <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    删除
                  </a-menu-item>
                  <a-menu-item key="1" @click="setOnlineBatch(1)">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    批量上线
                  </a-menu-item>
                  <a-menu-item key="1" @click="setOnlineBatch(0)">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    批量下线
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
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
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
    <!-- 抽屉区域 -->
    <!-- <BookInfoModal @register="registerModal" @success="handleSuccess"></BookInfoModal> -->
    <BookInfoSection @register="registerSectionDrawer" @success="handleSuccess"></BookInfoSection>
    <BookUserStudy @register="registerReadDrawer" @success="handleSuccess"></BookUserStudy>
    <BookInfoList @register="registerFormDrawer" @success="handleSuccess"></BookInfoList>
  </div>
</template>

<script lang="ts" name="bookInfo-bookInfo" setup>
  import {ref, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import BookInfoModal from './components/BookInfoModal.vue'
  import {columns, searchFormSchema} from './BookInfo.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl,onlineBatch} from './BookInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import {useRouter} from 'vue-router'
  import { useDrawer } from '/@/components/Drawer';
  import BookInfoSection from './components/BookInfoSection/BookInfoSection.vue'
  import BookUserStudy from './components/BookUserStudy/BookUserStudy.vue'
  import BookInfoList from './components/BookInfoForm.vue'
import { message } from 'ant-design-vue';
  const checkedKeys = ref<Array<string | number>>([]);
  let cate = ref({})
  //注册model
  const [registerModal, {openModal}] = useModal();
  //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '书籍信息表',
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
                // ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD 23:59:59','YYYY-MM-DD 00:00:00']
              ],
            },
           actionColumn: {
               width: 200,
               fixed:'right'
            },
      },
       exportConfig: {
            name:"书籍信息表",
            url: getExportUrl,
          },
          importConfig: {
            url: getImportUrl,
            success: handleSuccess
          },
  })

  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext
  const router = useRouter()
  // 注册抽屉
  const [registerFormDrawer, { openDrawer: openFormDrawer }] = useDrawer();
  const [registerSectionDrawer, { openDrawer: openSectionDrawer }] = useDrawer();
  const [registerReadDrawer, { openDrawer: openReadDrawer }] = useDrawer();

   /**
    * 新增事件
    */
  function handleAdd() {
     openFormDrawer(true, {
       isUpdate: false,
       typeTo: 'Add',
       title:'新增',
        isEdit:true
     });
    // router.push({
    //   path:'/bookInfo/BookInfoForm',
    //   query:{
    //     isUpdate:false
    //   }
    // })
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     openFormDrawer(true, {
       record,
       isUpdate: true,
       typeTo: 'Edit',
       title:'编辑',
       id:record.id,
        isEdit:true
     });
    // router.push({
    //   path:'/bookInfo/BookInfoForm',
    //   query:{
    //     isUpdate:true,
    //     id:record.id
    //   }
    // })
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openFormDrawer(true, {
       record,
       isUpdate: true,
       typeTO: 'Detail',
       title:'查看',
        id:record.id,
        isEdit:false
     });
    // router.push({
    //   path:'/bookInfo/BookInfoForm',
    //   query:{
    //     isUpdate:true,
    //     id:record.id,
    //     isEdit:false
    //   }
    // })
   }
   //章节管理
  function handleSection(record: Recordable) {
     openSectionDrawer(true, {
       record,
       isUpdate: true,
       showFooter: false,
     });
   }
   //阅读统计
  function handleRead(record: Recordable) {
     openReadDrawer(true, {
       record,
       id:record.id,
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
     if(selectedRowKeys.value.length === 0) return message.error('请选择您要操作的数据')
     await batchDelete({ids: selectedRowKeys.value}, handleSuccess);
   }

   /**
    * 批量上下线事件
    */
  async function setOnlineBatch(status) {
     if(selectedRowKeys.value.length === 0) return message.error('请选择您要操作的数据')
     await onlineBatch({ids: selectedRowKeys.value,status:status}, handleSuccess);
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
           label: '编辑',
           onClick: handleEdit.bind(null, record),
         },
         {
           label: '章节管理',
           onClick: handleSection.bind(null, record),
         },
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
           },
        {
          label: '阅读统计',
          onClick: handleRead.bind(null, record),
        }
      ]
   }
</script>

<style scoped>

</style>
