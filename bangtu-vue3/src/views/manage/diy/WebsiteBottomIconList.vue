<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增底部导航</a-button>
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
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
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WebsiteBottomIconModal @register="registerModal" @success="handleSuccess"></WebsiteBottomIconModal>
    <WebsiteBottomIconUseModal @register="registerUseModal" @success="handleSuccess"></WebsiteBottomIconUseModal>
  </div>
</template>

<script lang="ts" name="bottom-websiteBottomIcon" setup>
import { ref, computed, unref } from 'vue';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { useModal } from '/@/components/Modal';
import { useListPage } from '/@/hooks/system/useListPage';
import WebsiteBottomIconModal from './components/WebsiteBottomIconModal.vue';
import WebsiteBottomIconUseModal from './components/WebsiteBottomIconUseModal.vue'
import { columns, searchFormSchema } from './WebsiteBottomIcon.data';
import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './WebsiteBottomIcon.api';
import { downloadFile } from '/@/utils/common/renderUtils';
const checkedKeys = ref<Array<string | number>>([]);
//注册model
const [registerModal, { openModal }] = useModal();
const [registerUseModal, { openModal:openUseModal }] = useModal();
//注册table数据
const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
  tableProps: {
    title: '网站自定义底部导航',
    api: list,
    columns,
    canResize: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      showActionButtonGroup: false,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
    actionColumn: {
      width: 140,
      fixed: 'right',
    },
  },
  exportConfig: {
    name: '网站自定义底部导航',
    url: getExportUrl,
  },
  importConfig: {
    url: getImportUrl,
    success: handleSuccess,
  },
});

const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

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
  openUseModal(true, {
    record,
    isUpdate: true,
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
      label: '使用',
      onClick: handleDetail.bind(null, record),
    },
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record),
    },
    {
      label: '删除',
      popConfirm: {
        title: '是否确认删除',
        confirm: handleDelete.bind(null, record),
      },
    },
  ];
}
/**
 * 下拉操作栏
 */
// :dropDownActions="getDropDownAction(record)"
// function getDropDownAction(record) {
//   return [
//     {
//       label: '详情',
//       onClick: handleDetail.bind(null, record),
//     },
//     {
//       label: '删除',
//       popConfirm: {
//         title: '是否确认删除',
//         confirm: handleDelete.bind(null, record),
//       },
//     },
//   ];
// }
</script>

<style scoped>
</style>