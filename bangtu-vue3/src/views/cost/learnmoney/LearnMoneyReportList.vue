<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
          <a-button  type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
          <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
        <!--  :dropDownActions="getDropDownAction(record)" -->
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <LearnMoneyReportModal @register="registerModal" @success="handleSuccess"></LearnMoneyReportModal>
    <LearnMoneyReportDrawer @register="registerDetail"></LearnMoneyReportDrawer>
  </div>
</template>

<script lang="ts" name="learnmoney-learnMoneyReport" setup>
import { ref, computed, unref } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useDrawer } from '/@/components/Drawer';
import { useListPage } from '/@/hooks/system/useListPage';
import LearnMoneyReportModal from './components/LearnMoneyReportModal.vue';
import LearnMoneyReportDrawer from './components/LearnMoneyReportDrawer.vue';
import { columns, searchFormSchema } from './LearnMoneyReport.data';
import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './LearnMoneyReport.api';
import { downloadFile } from '/@/utils/common/renderUtils';
const checkedKeys = ref<Array<string | number>>([]);
//注册model
const [registerModal, { openModal }] = useModal();
// 注册抽屉
const [registerDetail, { openDrawer }] = useDrawer();
// const [registerDetailEdit, { openDrawer:openDrawerEdit }] = useDrawer();
//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '学员学币',
    api: list,
    columns,
    canResize: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
    actionColumn: {
      width: 200,
      fixed: 'right',
    },
  },
  exportConfig: {
    name: '学员学币',
    url: getExportUrl,
  },
  importConfig: {
    url: getImportUrl,
    success: handleSuccess,
  },
});

const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

// /**
//  * 新增事件
//  */
// function handleAdd() {
//   openModal(true, {
//     isUpdate: false,
//     showFooter: true,
//   });
// }
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
 * 充值记录
 */
function handleDetail(record: Recordable) {
  openDrawer(true, {
    record,
    isUpdate: true,
    showFooter: false,
  });
}
/**
 * 使用记录
 */
function handleMake(record: Recordable) {
  openDrawer(true, {
    record,
    isUpdate: false,
    showFooter: false,
  });
}
/**
 * 删除事件
 */
async function handleDelete(record) {
  await deleteOne({ id: record.id }, handleSuccess);
}
/**
 * 批量删除事件
 */
async function batchHandleDelete() {
  await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
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
function getTableAction(record) {
  return [
    {
      label: '修改',
      onClick: handleEdit.bind(null, record),
    },
    {
      label: '充值记录',
      onClick: handleDetail.bind(null, record),
    },
    {
      label: '使用记录',
      onClick: handleMake.bind(null, record),
    },
  ];
}
/**
 * 下拉操作栏
 */
// function getDropDownAction(record){
//     return [
//          {
//            label: '详情',
//            onClick: handleDetail.bind(null, record),
//          }, {
//            label: '删除',
//            popConfirm: {
//              title: '是否确认删除',
//              confirm: handleDelete.bind(null, record),
//            }
//          }
//     ]
//  }
</script>

<style scoped>
</style>