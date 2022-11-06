<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="title" :width="1000">
    <div>
      <BasicTable @register="rechargeRegisterTable" :searchInfo="searchInfo" v-if="isUpdate"></BasicTable>
      <BasicTable @register="useRegisterTable" :searchInfo="searchInfo" v-else></BasicTable>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
import { ref, computed, unref } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicTable, TableAction } from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage';
import { useRecordColumns, rechargeRecordColumns, rechargeSearchForm, usesSearchForm } from '../LearnMoneyReport.data';
import { useDetailslisList, rechargeDetailsList } from '../LearnMoneyReport.api';
// Emits声明
const emit = defineEmits(['register', 'success']);
const isUpdate = ref(true);
const searchInfo = { userId: '' };
// 列表页面公共参数、方法
const { tableContext:rechargeTableContext } = useListPage({
  tableProps: {
    rowKey: 'id',
    api: rechargeDetailsList,
    showActionColumn: false,
    columns: rechargeRecordColumns,
    canResize: false,
    actionColumn: {
      width: 180,
    },
    formConfig: {
      labelWidth: 140,
      schemas: rechargeSearchForm,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      submitButtonOptions:{},
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
  },
});

const { tableContext:useTableContext } = useListPage({
  tableProps: {
    rowKey: 'id',
    api: useDetailslisList,
    showActionColumn: false,
    columns: useRecordColumns,
    canResize: false,
    actionColumn: {
      width: 180,
    },
    formConfig: {
      labelWidth: 120,
      schemas: usesSearchForm,
      autoSubmitOnEnter: true,
      showAdvancedButton: true,
      fieldMapToNumber: [],
      fieldMapToTime: [],
    },
  },
});

//注册table数据
const [rechargeRegisterTable, { reload:rechargeReload }] = rechargeTableContext;
const [useRegisterTable, { reload:useReload } ] = useTableContext
//表单赋值
const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
  searchInfo.userId = data.record?.userId;
  console.log(searchInfo.userId);
  handleSuccess();
  isUpdate.value = !!data?.isUpdate;
  setDrawerProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
});
//设置标题
const title = computed(() => (unref(isUpdate) ? '充值记录' : '使用记录'));
/**
 * 成功回调
 */
function handleSuccess() {
  isUpdate.value? rechargeReload() : useReload()
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