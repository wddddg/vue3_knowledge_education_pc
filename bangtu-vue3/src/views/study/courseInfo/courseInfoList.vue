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
    <courseInfoListForm @register="registerFormDrawe" @success="handleSuccess"></courseInfoListForm>
    <courseCommentList @register="registerCommentDrawe" @success="handleSuccess"></courseCommentList>
    <courseInfoAdmin @register="registerAdminDrawe" @success="handleSuccess"></courseInfoAdmin>
  </div>
</template>

<script lang="ts" name="knowledgeInfoList" setup>
  import {ref, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  // import knowledgeInfoRecommend from './components/knowledgeInfoRecommend.vue'
  // import knowledgeInfoTop from './components/knowledgeInfoTop.vue'
  import {columns, searchFormSchema} from './courseInfo.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl,onlineBatch} from './courseInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import {useRouter} from 'vue-router'
  import { useDrawer } from '/@/components/Drawer';
  import courseInfoListForm from './components/courseInfoListForm/courseInfoListForm.vue'
  import courseCommentList from './components/courseComment/courseCommentList.vue'
  import courseInfoAdmin from './components/courseInfoAdmin/courseInfoAdmin.vue'
import { message } from 'ant-design-vue';
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
           searchInfo: { courseType: 4 },
           formConfig: {
              labelWidth: 120,
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
               width: 230,
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
  const [registerFormDrawe, { openDrawer: openFormDrawe }] = useDrawer();
  const [registerCommentDrawe, { openDrawer: openCommentDrawe }] = useDrawer();
  const [registerAdminDrawe, { openDrawer: openAdminDrawe }] = useDrawer();

   /**
    * 新增事件
    */
  function handleAdd() {
     openFormDrawe(true, {
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
     openFormDrawe(true, {
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
     openFormDrawe(true, {
       record,
       isUpdate: true,
       typeTo: 'Detail',
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
   //评论答疑
  function handleComment(record: Recordable) {
     openCommentDrawe(true, {
       record,
        id:record.id,
       showFooter: false,
        isUpdate:false,
     });
   }
   //班级管理
  function handleClass(record: Recordable) {
     openAdminDrawe(true, {
       record,
       isUpdate: true,
       showFooter: true,
       radioValue:true
     });
   }
   //课程管理
  function handleCourse(record: Recordable) {
     openAdminDrawe(true, {
       record,
       isUpdate: true,
       showFooter: true,
       radioValue:false
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
    * 批量启停事件
    */
  async function setOnlineBatch(status) {
    if(selectedRowKeys.value.length === 0) return message.error('请选择您要操作的数据')
     await onlineBatch({ids: selectedRowKeys.value,status:status, courseType: 4}, handleSuccess);
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
           label: '课程管理',
           onClick: handleCourse.bind(null, record),
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
        },
           {
             label: '删除',
             popConfirm: {
               title: '是否确认删除',
               confirm: handleDelete.bind(null, record),
             }
           },
        {
          label: '评论答疑',
          onClick: handleComment.bind(null, record),
        },
        {
          label: '班级管理',
          onClick: handleClass.bind(null, record),
        },
      ]
   }
</script>

<style scoped>

</style>
