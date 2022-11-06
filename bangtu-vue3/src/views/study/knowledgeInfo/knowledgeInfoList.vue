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
                    批量启用
                  </a-menu-item>
                  <a-menu-item key="1" @click="setOnlineBatch(0)">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    批量停用
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
    <knowledgeInfoRecommend @register="registeRecommend" @success="handleSuccess"></knowledgeInfoRecommend>
    <knowledgeInfoForm @register="registerAddDrawe" @success="handleSuccess"></knowledgeInfoForm>
    <knowledgeInfoTop @register="registeTop" @success="handleSuccess"></knowledgeInfoTop>
  </div>
</template>

<script lang="ts" name="knowledgeInfoList" setup>
  import {ref, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import knowledgeInfoRecommend from './components/knowledgeInfoRecommend.vue'
  import knowledgeInfoTop from './components/knowledgeInfoTop.vue'
  import {columns, searchFormSchema} from './knowledgeInfo.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl,onlineBatch} from './knowledgeInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import {useRouter} from 'vue-router'
  import { useDrawer } from '/@/components/Drawer';
  import knowledgeInfoForm from './components/knowledgeInfoForm.vue'
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registeRecommend, {openModal:openModalRecommend}] = useModal();
  const [registeTop, {openModal:openModalTop}] = useModal();
  //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '书籍信息表',
           api: list,
           columns,
           canResize:false,
           formConfig: {
              labelWidth: 110,
              schemas: searchFormSchema,
              autoSubmitOnEnter:true,
              showAdvancedButton:true,
              fieldMapToNumber: [
              ],
              fieldMapToTime: [
                // ['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']
              ],
            },
           actionColumn: {
               width: 220,
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
  const [registerAddDrawe, { openDrawer: openAddDrawer }] = useDrawer();

   /**
    * 新增事件
    */
  function handleAdd() {
     openAddDrawer(true, {
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
     openAddDrawer(true, {
       record,
       isUpdate: true,
       typeTo: 'Edit',
       id:record.id,
       title:'编辑',
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
     openAddDrawer(true, {
       record,
       isUpdate: true,
       typeTO: 'Detail',
        id:record.id,
       title:'查看',
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
   //推荐
  function handleRecommend(record: Recordable) {
     openModalRecommend(true, {
       record,
       showFooter: true,
        isUpdate:true,
     });
   }
   //阅读统计
  function handleTop(record: Recordable) {
     openModalTop(true, {
       record,
       isUpdate: true,
       showFooter: true,
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
    if(selectedRowKeys.value.length === 0) return createMessage.error('请选择您要操作的数据')
     await batchDelete({ids: selectedRowKeys.value}, handleSuccess);
   }
   /**
    * 批量启停事件
    */
  async function setOnlineBatch(status) {
    if(selectedRowKeys.value.length === 0) return createMessage.error('请选择您要操作的数据')
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
           label: '推荐',
           onClick: handleRecommend.bind(null, record),
         },
         {
           label: '置顶',
           onClick: handleTop.bind(null, record),
         }
       ]
   }
     /**
        * 下拉操作栏
        */
  function getDropDownAction(record){
      return [
        {
          label: '查看',
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

<style scoped>

</style>
