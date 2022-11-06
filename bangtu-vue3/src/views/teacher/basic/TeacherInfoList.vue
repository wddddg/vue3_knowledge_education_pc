<template>
  <div class="p-4">
    <a-card :bordered="false" style="height: 100%">
      <a-tabs defaultActiveKey="all-info">
        <a-tab-pane tab="全部" key="all-info" forceRender>
          <TeacherInfoTab :status="''" />
        </a-tab-pane>
        <a-tab-pane tab="待审批" key="auditing-info" forceRender>
          <TeacherInfoTab :status="'1'" />
        </a-tab-pane>
        <a-tab-pane tab="已通过" key="pass-info" forceRender>
          <TeacherInfoTab :status="'2'" />
        </a-tab-pane>
        <a-tab-pane tab="已拒绝" key="reject-info" forceRender>
          <TeacherInfoTab :status="'3'" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" name="basic-teacherInfo" setup>
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import TeacherInfoDrawer from './components/TeacherInfoDrawer.vue';
  import AccountModal from './components/AccountModal.vue';
  import { columns, searchFormSchema } from './TeacherInfo.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './TeacherInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import TeacherInfoTab from './components/TeacherInfoTab.vue';

  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();

  // 注册table数据
  const { tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '讲师信息表',
      api: list,
      beforeFetch: (params) => {
        if (params.status == '0') {
          delete params.status;
        }
        if (!params.name) {
          delete params.name;
        }
        console.log('params =>', params);
      },
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
        width: 240,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '讲师信息表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  //密码model
  const [registerPasswordModal, { openModal }] = useModal();

  /**
   * 新增事件
   */
  function handleAdd() {
    openDrawer(true, {
      showType: '新增' as '新增' | '编辑' | '详情',
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showType: '编辑' as '新增' | '编辑' | '详情',
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawer(true, {
      record,
      showType: '详情' as '新增' | '编辑' | '详情',
    });
  }
  /**
   * 账号管理
   */
  function handleAccount(record: Recordable) {
    openModal(true, {
      record,
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
        label: '账号管理',
        onClick: handleAccount.bind(null, record),
      },
      {
        label: '查看',
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
</script>

<style scoped></style>
