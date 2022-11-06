<template>
  <BasicDrawer :isDetail="true" v-bind="$attrs" :title="title" @register="registerDrawer">
    <div>
      <a-tabs v-model:activeKey="activeKey" @change="changeTab">
        <a-tab-pane key="1" tab="使用情况">
          <BasicTable @register="registerTable" :searchInfo="searchInfo" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="兑换码">
          <BasicTable @register="registerTable1" :searchInfo="searchInfo">
            <template #tableTitle>
              <a-button type="primary" @click="handleAdd">添加</a-button>
            </template>
          </BasicTable>
        </a-tab-pane>
      </a-tabs>
    </div>
    <AddModal @register="registerModal" @success="handleSuccess" />
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer, BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { userRecordColumns, searchForm, userDayColumns } from '../CouponInfo.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { listForPage, IntegralUserDayInfo } from '../CouponInfo.api';
  import AddModal from './AddModal.vue';

  //注册drawer
  // const [registerDrawerComment, { openDrawer: openDrawerComment }] = useDrawer();
  const { createMessage } = useMessage();

  //model
  const [registerModal, { openModal }] = useModal();
  const activeKey = ref<string>('1');

  const searchInfo = { couponId: '' };
  const expandedRowKeys = ref([]);

  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    tableProps: {
      rowKey: 'id',
      api: listForPage,
      showActionColumn: false,
      columns: userRecordColumns,
      canResize: false,
      useSearchForm: false,
      actionColumn: {
        width: 180,
      },
      formConfig: {
        labelWidth: 120,
        schemas: searchForm,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
  });
  //注册table数据
  const [registerTable, { reload }] = tableContext;

  // 列表页面公共参数、方法
  const { tableContext: tableContext1 } = useListPage({
    tableProps: {
      title: '分类字典',
      rowKey: 'id',
      api: IntegralUserDayInfo,
      showActionColumn: false,
      columns: userDayColumns,
      canResize: false,
      useSearchForm: false,
      actionColumn: {
        width: 180,
      },
      formConfig: {
        labelWidth: 120,
        schemas: searchForm,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
  });
  //注册table数据
  const [registerTable1, { reload: reloadFun }] = tableContext1;

  // 打开弹出框
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    searchInfo.couponId = data.record?.id;
    activeKey.value = '1';
    handleSuccess();
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  });

  //设置标题
  const title = computed(() => '优惠券管理');

  /**
   * tab切换
   */
  async function changeTab(key) {
    activeKey.value = key;
    handleSuccess();
  }
  /**
   * 新增事件
   */
  function handleAdd() {
    openModal(true, {
      couponId: searchInfo.couponId,
      isUpdate: false,
      showFooter: true,
    });
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
    reloadFun();
  }
</script>

<style lang="less" scoped>
  /** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
