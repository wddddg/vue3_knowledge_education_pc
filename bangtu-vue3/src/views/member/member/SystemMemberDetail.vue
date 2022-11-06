<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="学员监控" :isDetail="true" @close="handleClose">
    <div class="p-4" v-if="!isShow">
      <a-card :bordered="false" style="height: 100%">
        <a-tabs defaultActiveKey="study-log" destroyInactiveTabPane>
          <a-tab-pane tab="学习记录" key="study-log">
            <MemberSystemStudyLog :userId="setComponentsUserId" />
          </a-tab-pane>
          <a-tab-pane tab="考试记录" key="exam-log">
            <MemberSystemExamLog :userId="setComponentsUserId" />
          </a-tab-pane>
          <a-tab-pane tab="用户订单" key="user-order">
            <MemberSystemUserOrder :userId="setComponentsUserId" />
          </a-tab-pane>
          <a-tab-pane tab="积分订单" key="point-order">
            <MemberSystemPointOrder :userId="setComponentsUserId" />
          </a-tab-pane>
          <a-tab-pane tab="积分明细" key="point-item">
            <MemberSystemPointItem :userId="setComponentsUserId" />
          </a-tab-pane>
          <a-tab-pane tab="用户文章" key="user-article">
            <MemberSystemUserArticle :userId="setComponentsUserId" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" name="member-systemMemberDetail" setup>
  import { ref, computed, unref, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import SystemMemberModal from './components/SystemMemberModal.vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { columns, searchFormSchema } from './SystemMember.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './SystemMember.api';
  import { downloadFile } from '/@/utils/common/renderUtils';

  import MemberSystemStudyLog from '../studylog/SystemStudyLogList.vue';
  import MemberSystemExamLog from '../examlog/SystemExamLogList.vue';
  import MemberSystemUserOrder from '../userorder/SystemUserOrderList.vue';
  import MemberSystemPointOrder from '../pointorder/SystemPointOrderList.vue';
  import MemberSystemPointItem from '../pointitem/SystemPointItemList.vue';
  import MemberSystemUserArticle from '../userarticle/SystemUserArticleList.vue';

  const checkedKeys = ref<Array<string | number>>([]);
  //注册model
  // const [registerModal, { openModal }] = useModal();
  const setComponentsUserId = ref('');
  const isShow = ref(true);
  // 注册弹窗
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setComponentsUserId.value = data.userId;
    isShow.value = data.status;
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  });

  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '会员基础信息表',
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
        width: 180,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '会员基础信息表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  const handleClose = () => {
    isShow.value = true;
  };

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
    (selectedRowKeys.value = []) && reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '学员监控',
        // onClick: handleEdit.bind(null, record),
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
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
    ];
  }
</script>

<style scoped></style>
