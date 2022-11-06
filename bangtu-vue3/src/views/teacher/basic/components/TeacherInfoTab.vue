<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button v-if="status == ''" type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 添加讲师</a-button>
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <template v-if="status == '1'">
          <a-button type="primary" @click="batchHandleApply(2)"> 批量通过 </a-button>
          <a-button type="primary" @click="batchHandleApply(3)"> 批量拒绝 </a-button>
        </template>

        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>

      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
      <template #fileSlot="{ text }">
        <span v-if="!text" style="font-size: 12px; font-style: italic">无文件</span>
        <a-button v-else :ghost="true" type="primary" preIcon="ant-design:download-outlined" size="small" @click="downloadFile(text)">下载</a-button>
      </template>
    </BasicTable>

    <!-- 表单区域 -->
    <TeacherInfoDrawer @register="registerDrawer" @success="handleSuccess" />
    <RelBizSelectModal @register="regModal" @success="handleSuccess" />
    <!-- 账号管理 -->
    <AccountModal @register="registerPasswordModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="TeacherInfoTab" setup>
  import { ref, computed, reactive, provide, watch, unref } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import TeacherInfoDrawer from './TeacherInfoDrawer.vue';
  import AccountModal from './AccountModal.vue';
  import { columns, searchFormSchema } from '../TeacherInfo.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, batchApply } from '../TeacherInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import RelBizSelectModal from './teaching/RelBizSelectModal.vue';
  import { SelectTypes } from 'ant-design-vue/es/select';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const props = defineProps({
    status: { require: false, type: String },
  });

  const status = computed(() => props.status);

  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
  // 教学详细drawer
  const [regModal, { openDrawer: teachingDrawer }] = useDrawer();

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

        params.status = status.value;

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
        width: 300,
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
  // 文章管理-批量通过或拒绝
  async function batchHandleApply(status) {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要审批的数据！');
      return;
    }
    await batchApply({ ids: selectedRowKeys.value.toString(), status: status }, handleSuccess);
    reload();
  }

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
   * 教学情况
   */
  function handleTechingInfo(record: Recordable) {
    teachingDrawer(true, {
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
        label: '编辑',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '账号管理',
        onClick: handleAccount.bind(null, record),
      },
      {
        label: '教学情况',
        onClick: handleTechingInfo.bind(null, record),
      },
    ];
  }

  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
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

  //表单值
  const [state] = useRuleFormItem(props, 'value', 'change');
  const selectOptions = ref<SelectTypes['options']>([]);
  let selectValues = reactive<Recordable>({
    value: [],
    change: false,
  });
  //下发 selectOptions,xxxBiz组件接收
  provide('selectOptions', selectOptions);
  //下发 selectValues,xxxBiz组件接收
  provide('selectValues', selectValues);
  /**
   * 设置下拉框的值
   */
  const setValue = (options, values) => {
    selectOptions.value = options;
    //emitData.value = values.join(",");
    state.value = values;
    selectValues.value = values;
  };
  const getBindValue = Object.assign({}, unref(props));

  watch(
    () => props.status,
    () => {
      if (props.status) {
      }
    },
    { immediate: true }
  );
</script>

<style scoped></style>
