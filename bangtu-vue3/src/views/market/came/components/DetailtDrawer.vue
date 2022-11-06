<template>
  <BasicDrawer :isDetail="true" v-bind="$attrs" :title="title" @register="registerDrawer">
    <div>
      <BasicTable @register="registerTable" :searchInfo="searchInfo">
        <template #tableTitle>
          <a-button type="primary" @click="onExportXls">导出数据</a-button>
        </template>
      </BasicTable>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { commentColumns, searchSchema } from '../CamePayInfo.data';
  import { camePayRecordInfo, getExportUrl } from '../CamePayInfo.api';

  const searchInfo = { camePayId: '' };

  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
    tableProps: {
      title: '卡密详情',
      rowKey: 'id',
      api: camePayRecordInfo,
      columns: commentColumns,
      canResize: false,
      showActionColumn: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
    },
    exportConfig: {
      name: '卡密详情',
      url: getExportUrl,
    },
  });
  //注册table数据
  const [registerTable, { reload }] = tableContext;

  // 打开弹出框
  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    searchInfo.camePayId = data.record?.id;
    handleSuccess();
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  });

  //设置标题
  const title = computed(() => '使用详情');

  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
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
