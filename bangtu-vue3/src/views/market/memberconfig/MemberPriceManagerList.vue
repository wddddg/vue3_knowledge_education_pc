<template>
  <div class="p-4">
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeKey" @change="changeTab">
        <a-tab-pane key="1" tab="畅会员">
          <!--引用表格-->
          <BasicTable @register="registerTable" :searchInfo="searchInfo">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="handleAdd"> 新增期限</a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" />
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane key="2" tab="超级会员">
          <!--引用表格-->
          <BasicTable @register="registerTable" :searchInfo="searchInfo">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="handleAdd"> 新增期限</a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" />
            </template>
          </BasicTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 表单区域 -->
    <MemberPriceManagerModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="memberconfig-memberPriceManager" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MemberPriceManagerModal from './components/MemberPriceManagerModal.vue';
  import { columns, searchFormSchema } from './MemberPriceManager.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './MemberPriceManager.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  const [registerModal, { openModal }] = useModal();

  const activeKey = ref<string>('1');
  const searchInfo = { category: 1 };

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '会员价格管理',
      api: list,
      columns,
      canResize: false,
      useSearchForm: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '会员价格管理',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * tab切换
   */
  async function changeTab(key) {
    activeKey.value = key;
    searchInfo.category = key;
    selectedRowKeys.value = [];
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      category: activeKey.value,
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
      category: activeKey.value,
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
    reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
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
</script>

<style scoped>
  ::v-deep .ant-input-number-input {
    text-align: center;
  }
</style>
