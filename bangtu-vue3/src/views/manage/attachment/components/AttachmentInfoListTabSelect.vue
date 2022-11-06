<template>
  <div>
    <BasicTable
      ref="tableRef"
      :columns="modalTableColumns"
      :scroll="tableScroll"
      v-bind="getBindValue"
      :useSearchForm="true"
      :formConfig="formConfig"
      :api="list"
      :showIndexColumn="false"
      :searchInfo="searchInfo"
      :rowSelection="rowSelection"
      :indexColumnProps="indexColumnProps"
    >
      <!-- update-begin-author:taoyan date:2022-5-25 for: VUEN-1112一对多 用户选择 未显示选择条数，及清空 -->
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 上传素材</a-button>
      </template>
      <template #coverImg="{ record }">
        <img :src="record.coverImg" :style="{ width: '120px', margin: 'auto', height: '80px' }" @click="handleDetail(record)" />
      </template>
      <!-- update-end-author:taoyan date:2022-5-25 for: VUEN-1112一对多 用户选择 未显示选择条数，及清空 -->
    </BasicTable>
    <!-- 表单区域 -->
    <AttachmentInfoModal @register="registerModal" @success="handleSuccess"></AttachmentInfoModal>
    <!-- 编辑表单区域 -->
    <!-- <AttachmentInfoEditModal @register="registerEditModal" @success="handleSuccess"></AttachmentInfoEditModal> -->
    <ChakInfo @register="registerChakInfoModal"></ChakInfo>
  </div>
</template>

<script lang="ts" >
import { defineComponent, ref, computed, unref, provide, watch } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import ChakInfo from './ChakInfo.vue'
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useModal, BasicModal, useModalInner } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import AttachmentInfoModal from './AttachmentInfoModal.vue';
import AttachmentInfoEditModal from './AttachmentInfoEditModal.vue';
import ClassifyTree from '../ClassifyTree.vue';
import { modalTableColumns, searchFormSchema } from '../AttachmentInfo.data';
import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from '../AttachmentInfo.api';
import { downloadFile } from '/@/utils/common/renderUtils';

import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
import { useAttrs } from '/@/hooks/core/useAttrs';
import { selectProps } from '/@/components/Form/src/jeecg/props/props';

export default defineComponent({
  name: 'AttachmentInfoListTab',
  components: {
    BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
      loading: true,
    }),
    AttachmentInfoModal,
    ChakInfo
    // AttachmentInfoEditModal
  },
  emits: ['selectRecord'],
  props: {
    ...selectProps,
    //是否多选
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    //选择框标题
    data: {
      type: Object,
      default: null,
    },
    fileType: {
      type: String,
      default: '',
    },
  },
  inheritAttrs: false,
  setup(props, { emit, refs }) {
    const [registerModal, { openModal }] = useModal();
    const [registerChakInfoModal, {openModal: openChakInfoModal}] = useModal();
    const { prefixClsTree } = useDesign('attachmentinfo');
    provide('prefixClsTree', prefixClsTree);
    // const props = defineProps({
    //   data: { require: true, type: Object },
    //   fileType: { require: true, type: String },
    // });
    // const fileType = defineProps({
    //   fileType: { require: true, type: String },
    // });
    const oneCateId = computed(() => props.data?.oneCateId);
    const twoCateId = computed(() => props.data?.twoCateId);
    const parentName = computed(() => props.data?.name);
    const fileType = computed(() => props.fileType);

    const checkedKeys = ref<Array<string | number>>([]);

    const tableScroll = ref<any>({ x: false });
    const tableRef = ref();
    //注册弹框
    const [register, { closeModal }] = useModalInner(() => {
      if (window.innerWidth < 900) {
        tableScroll.value = { x: 900 };
      } else {
        tableScroll.value = { x: false };
      }
      //update-begin-author:taoyan date:2022-6-2 for: VUEN-1112 一对多 用户选择 未显示选择条数，及清空
      setTimeout(() => {
        if (tableRef.value) {
          tableRef.value.setSelectedRowKeys(selectValues['value'] || []);
        }
      }, 800);
      //update-end-author:taoyan date:2022-6-2 for: VUEN-1112 一对多 用户选择 未显示选择条数，及清空
    });

    const attrs = useAttrs();
    //表格配置
    const config = {
      canResize: false,
      bordered: true,
      size: 'small',
    };
    const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
    const [{ rowSelection, visibleChange, selectValues, indexColumnProps, getSelectResult, handleDeleteSelected, selectRows }] = useSelectBiz(list, getBindValue);
    const searchInfo = ref({
      fileType: unref(props).fileType == '0' ? '' : unref(props).fileType,
      oneCateId: oneCateId,
      twoCateId: twoCateId,
    });
    indexColumnProps.width = 40;

    if (props.multiple) {
      rowSelection.type = 'checkbox';
    } else {
      rowSelection.type = 'radio';
    }

    //查询form
    const formConfig = {
      labelWidth: 200,

      //update-end-author:taoyan date:2022-5-24 for: VUEN-1086 【移动端】用户选择 查询按钮 效果不好 列表展示没有滚动条---查询表单按钮的栅格布局和表单的保持一致
      schemas: [
        {
          label: '素材名称',
          field: 'attachName',
          component: 'JInput',
          colProps: {
            span: 12,
          },
        },
      ],
    };

    //注册model

    //注册editmodel
    // const [registerEditModal, {openModal: openEditModal}] = useModal();
    // //注册table数据
    // const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
    //     tableProps:{
    //          title: '素材管理表',
    //          api: list,
    //          columns,
    //          canResize:false,
    //          formConfig: {
    //             labelWidth: 120,
    //             schemas: searchFormSchema,
    //             autoSubmitOnEnter:true,
    //             showAdvancedButton:true,
    //             fieldMapToNumber: [
    //             ],
    //             fieldMapToTime: [
    //             ],
    //           },
    //           // 请求之前对参数做处理
    //           beforeFetch(params) {
    //              params.oneCateId = oneCateId.value;
    //              params.twoCateId = twoCateId.value;
    //              if(fileType.value!="0"){
    //                  params.fileType = fileType.value;
    //              }else{
    //                  params.fileType = "";
    //              }
    //           },
    //          actionColumn: {
    //              width: 150,
    //              fixed:'right'
    //           },
    //     },
    //      exportConfig: {
    //           name:"附件管理表",
    //           url: getExportUrl,
    //         },
    //         importConfig: {
    //           url: getImportUrl,
    //           success: handleSuccess
    //         },
    // })

    // const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext
    //
    watch(
      () => [props.data, props.fileType],
      ([newData, newFileType], [oldData, oldFileType]) => {
        //reload()
        setTimeout(() => {
          if (newFileType) {
            tableRef.value!.reload();
          }
        }, 1000);
      }
    );

    /**
     * 新增事件
     */
    function handleAdd() {
      openModal(true, {
        isUpdate: false,
        showFooter: true,
        record: { twoCateId: twoCateId, oneCateId: oneCateId, parentName: parentName },
      });
    }
    function handleDetail(record) {
      if (record.fileType === 4) return open(record.fileUrl);
      openChakInfoModal(true, {
        record,
      });
    }
    //  /**
    //   * 编辑事件
    //   */
    // function handleEdit(record: Recordable) {
    //    openEditModal(true, {
    //      record,
    //      isUpdate: true,
    //      showFooter: true,
    //    });
    //  }
    //  /**
    //   * 详情
    //  */
    //  /**
    //   * 删除事件
    //   */
    // async function handleDelete(record) {
    //    await deleteOne({id: record.id}, handleSuccess);
    //  }
    //  /**
    //   * 批量删除事件
    //   */
    // async function batchHandleDelete() {
    //    await batchDelete({ids: selectedRowKeys.value}, handleSuccess);
    //  }
    //  /**
    //   * 成功回调
    //   */
    function handleSuccess() {
      tableRef.value.setSelectedRowKeys([]);
      tableRef.value.reload();
      // (selectedRowKeys.value = []) && reload();
    }
    //  /**
    //     * 操作栏
    //     */
    // function getTableAction(record){
    //      return [
    //        {
    //          label: '编辑',
    //          onClick: handleEdit.bind(null, record),
    //       },
    //       {
    //         label: '详情',
    //         onClick: handleDetail.bind(null, record),
    //       }, {
    //         label: '删除',
    //         popConfirm: {
    //           title: '是否确认删除',
    //           confirm: handleDelete.bind(null, record),
    //         }
    //       }
    //      ]
    //  }
    //    /**
    //       * 下拉操作栏
    //       */
    // function getDropDownAction(record){
    //     return [
    //          // {
    //          //   label: '详情',
    //          //   onClick: handleDetail.bind(null, record),
    //          // }, {
    //          //   label: '删除',
    //          //   popConfirm: {
    //          //     title: '是否确认删除',
    //          //     confirm: handleDelete.bind(null, record),
    //          //   }
    //          // }
    //     ]
    //  }

    // 当前选中的部门信息
    let departData = ref({});

    // // 左侧树选择后触发
    // function onTreeSelect(data) {
    //   departData.value = data;
    // }
    return {
      handleDetail,
      handleSuccess,
      registerModal,
      registerChakInfoModal,
      handleAdd,
      searchInfo,
      departData,
      list,
      modalTableColumns,
      rowSelection,
      selectRows,
      handleDeleteSelected,
      tableScroll,
      tableRef,
      getBindValue,
      formConfig,
      indexColumnProps,
    };
  },
});
</script>


<style lang="less">
@import '../index.less';
</style>
