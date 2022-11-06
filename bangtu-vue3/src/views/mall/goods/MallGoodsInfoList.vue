<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" @click="handleAdd"> 添加商品</a-button>
        <a-button type="primary" key="1" @click="batchHandleDelete"> 批量删除</a-button>
        <a-button type="primary" @click="handleBatchOnline(1)"> 批量启用</a-button>
        <a-button type="primary" @click="handleBatchOnline(0)"> 批量停用</a-button>
        <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
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
        </a-dropdown> -->
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
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
    <MallGoodsInfoModal @register="registerDrawerChak" @success="handleSuccess"></MallGoodsInfoModal>
    <MallGoodsInfoDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="goods-mallGoodsInfo" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import MallGoodsInfoModal from './components/MallGoodsInfoModal.vue';
  import { message } from 'ant-design-vue';
  import { columns, searchFormSchema } from './MallGoodsInfo.data';
  import { list, deleteOne, batchDelete, getImportUrl, batchOnline, getExportUrl } from './MallGoodsInfo.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import MallGoodsInfoDrawer from './components/MallGoodsInfoDrawer.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  import { useDrawer } from '/@/components/Drawer';
  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDrawerChak, { openDrawer:openDrawerChak }] = useDrawer();
  //注册model
  // const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '积分商城商品',
      api: list,
      columns,
      canResize: false,
      // beforeFetch: (params) => {
      //   params.column = 'sort'
      // },
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 140,
        fixed: 'right',
      },
    },
    exportConfig: {
      name: '积分商城商品',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleAdd() {
    // openModal(true, {
    //   isUpdate: false,
    //   showFooter: true,
    // });
    openDrawer(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    // openModal(true, {
    //   record,
    //   isUpdate: true,
    //   showFooter: true,
    // });
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 详情
   */
  function handleDetail(record: Recordable) {
    openDrawerChak(true, {
      record,
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
    if(selectedRowKeys.value.length === 0) return message.error('请先选择需要操作的数据')
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
  }
  /**
   * 批量上下线事件
   */
  async function handleBatchOnline(status) {
    if(selectedRowKeys.value?.length){
      await batchOnline({ ids: selectedRowKeys.value, status }, handleSuccess);
    }else{
      message.error('请先选择需要操作的数据')
    }

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
</script>

<style scoped></style>
