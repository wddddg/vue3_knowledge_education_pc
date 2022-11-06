<template>
      <a-row :class="['p-4', `${prefixClsTree}--box`]" :gutter="10">
        <a-col :xl="6" :lg="8" :md="10" :sm="24" style="flex: 1">
          <a-card :bordered="false" style="height: 100%">
             <ClassifyTree @select="onTreeSelect" />
          </a-card>
        </a-col>
        <a-col :xl="18" :lg="16" :md="14" :sm="24" style="flex: 1">
          <a-card :bordered="false" style="height: 100%">
            <a-tabs defaultActiveKey="all-info">
              <a-tab-pane tab="全部" key="all-info" forceRender>
                  <AttachmentInfoListTab ref="attachmentInfoListTab" :data="selectedGroupData" :fileType="'0'"></AttachmentInfoListTab>
              </a-tab-pane>
              <a-tab-pane tab="视频" key="vedio-info">
                  <AttachmentInfoListTab ref="attachmentInfoListTab" :data="selectedGroupData" :fileType="'1'"></AttachmentInfoListTab>
              </a-tab-pane>
              <a-tab-pane tab="音频" key="audio-info">
                  <AttachmentInfoListTab ref="attachmentInfoListTab" :data="selectedGroupData" :fileType="'2'"></AttachmentInfoListTab>
              </a-tab-pane>
              <a-tab-pane tab="图像" key="image-info">
                  <AttachmentInfoListTab ref="attachmentInfoListTab" :data="selectedGroupData" :fileType="'3'"></AttachmentInfoListTab>
              </a-tab-pane>
              <a-tab-pane tab="文档" key="document-info">
                  <AttachmentInfoListTab ref="attachmentInfoListTab" :data="selectedGroupData" :fileType="'4'"></AttachmentInfoListTab>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>

      </a-row>
</template>

<script lang="ts" name="AttachmentInfoList" setup>
  import {ref, computed, unref, provide} from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {useModal} from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import AttachmentInfoModal from './components/AttachmentInfoModal.vue'
  import AttachmentInfoEditModal from './components/AttachmentInfoEditModal.vue'
  import ClassifyTree from './components/ClassifyTree.vue'
  import AttachmentInfoListTab from './components/AttachmentInfoListTab.vue'
  import {columns, searchFormSchema} from './AttachmentInfo.data';
  import {list, deleteOne, batchDelete, getImportUrl,getExportUrl} from './AttachmentInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  const { prefixClsTree } = useDesign('attachmentinfo');
  provide('prefixClsTree', prefixClsTree);

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, {openModal}] = useModal();
  //注册editmodel
  const [registerEditModal, {openModal: openEditModal}] = useModal();
  //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '素材管理表',
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
               width: 150,
               fixed:'right'
            },
      },
       exportConfig: {
            name:"附件管理表",
            url: getExportUrl,
          },
          importConfig: {
            url: getImportUrl,
            success: handleSuccess
          },
  })

  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

  // 当前选中的分类信息
  let selectedGroupData = ref({});

  // 左侧树选择后触发
  function onTreeSelect(data) {
      if(data.parentId!="0"){
          selectedGroupData.value = {
              oneCateId:data.parentId,
              twoCateId: data.id,
              name: data.name,
          };

      }else{
          selectedGroupData.value = {
              oneCateId:data.id,
              twoCateId: null,
              name: data.name,
          };
      }

  }

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
     openEditModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openModal(true, {
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
           label: '编辑',
           onClick: handleEdit.bind(null, record),
        },
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
     /**
        * 下拉操作栏
        */
  function getDropDownAction(record){
      return [
           // {
           //   label: '详情',
           //   onClick: handleDetail.bind(null, record),
           // }, {
           //   label: '删除',
           //   popConfirm: {
           //     title: '是否确认删除',
           //     confirm: handleDelete.bind(null, record),
           //   }
           // }
      ]
   }


</script>


<style lang="less">
  @import './index.less';
</style>
