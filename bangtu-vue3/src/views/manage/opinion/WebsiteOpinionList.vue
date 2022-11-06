<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="batchHandleDelete"> 批量删除</a-button>
        <a-button type="primary" @click="batchHandleApply(1)"> 重点标记</a-button>
        <a-button type="primary" @click="batchHandleApply(0)"> 取消标记</a-button>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WebsiteOpinionModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="opinion-websiteOpinion" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import WebsiteOpinionModal from './components/WebsiteOpinionModal.vue';
  import { columns, searchFormSchema } from './WebsiteOpinion.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, batchUpdate } from './WebsiteOpinion.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useMessage } from '/@/hooks/web/useMessage';
  const checkedKeys = ref<Array<string | number>>([]);
  const { createMessage } = useMessage();
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '学员反馈建议',
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
        width: 120,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '学员反馈建议',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 批量通标记
  async function batchHandleApply(status) {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要标记的数据！');
      return;
    }
    await batchUpdate({ ids: selectedRowKeys.value, isSign: status }, handleSuccess);
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
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要删除的数据！');
      return;
    }
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
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
  }
</script>

<style scoped></style>
