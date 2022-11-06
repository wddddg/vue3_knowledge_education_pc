<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button> -->
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!-- <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
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
      <!--字段回显插槽-->
      <template #htmlSlot="{ text }">
        <div v-html="text"></div>
      </template>
      <!--省市区字段回显插槽-->
      <template #pcaSlot="{ text }">
        {{ getAreaTextByCode(text) }}
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <CostOrderInfoDrawer @register="registerDetail" @success="handleSuccess" :rootTreeData="rootTreeData" />
    <!-- 订单物流弹窗 -->
    <SystemMemberOrderDeliveryModal @register="registerDeliveryModal" @success="handleSuccess"></SystemMemberOrderDeliveryModal>
  </div>
</template>

<script lang="ts" name="order-OrderList" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import CostOrderInfoDrawer from './components/CostOrderInfoDrawer.vue';
  import { columns, searchFormSchema } from './OrderList.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './OrderList.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  const checkedKeys = ref<Array<string | number>>([]);
  //注册drawer
  const [registerDetail, { openDrawer: openDrawerDetail }] = useDrawer();
  // 当前选中的订单信息
  const rootTreeData = ref<any[]>([]);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '会员订单表',
      api: list,
      columns,
      canResize: false,
      beforeFetch(params) {
        params.orderType = 1;
      },
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 130,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '会员订单表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
  /**
   * 详情
   */
  function handleComment(record: Recordable) {
    openDrawerDetail(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
    rootTreeData.value = record
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
        label: '订单信息',
        onClick: handleComment.bind(null, record),
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

<style scoped></style>
