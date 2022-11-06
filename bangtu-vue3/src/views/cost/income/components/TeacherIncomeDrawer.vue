<template>
  <BasicDrawer :isDetail="true" v-bind="$attrs" :title="title" @register="registerDrawer">
    <div>
      <BasicTable @register="registerTable">
        <!--插槽:table标题-->
        <template #tableTitle>
          <a-button type="primary" @click="onExportXls">导出数据</a-button>
        </template>
      </BasicTable>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useDrawer, BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { userRecordColumns, searchForm } from '../TeacherIncome.data';
  import { listForPage, exportXlsTeacherDetails } from '../TeacherIncome.api';

  const teacherId = ref('')
  // 列表页面公共参数、方法
  const { tableContext, onExportXls } = useListPage({
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
      beforeFetch(params){
        params.teacherId = teacherId.value
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
    exportConfig: {
      name: '讲师收入统计明细',
      url: exportXlsTeacherDetails,
    }
  });
  //注册table数据
  const [registerTable, { reload }] = tableContext;

  // 打开弹出框
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    teacherId.value = data.record?.teacherId;
    handleSuccess();
    setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
  });

  //设置标题
  const title = computed(() => '收入明细');

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
