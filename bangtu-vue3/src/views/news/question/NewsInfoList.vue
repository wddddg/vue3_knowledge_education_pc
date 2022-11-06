<template>
  <div class="p-4">
    <a-card :bordered="false">
      <a-tabs v-model:activeKey="activeKey" @change="changeTab">
        <a-tab-pane key="0" tab="全部">
          <!--引用表格-->
          <BasicTable v-if="activeKey == '0'" @register="registerTable" :searchInfo="searchInfo" :rowSelection="rowSelection">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增文章</a-button>
              <a-button type="primary" @click="batchHandleOnline"> 批量下线 </a-button>
              <a-button type="primary" @click="batchHandleDownline"> 批量上线 </a-button>
              <a-button type="primary" @click="batchHandleDelete"> 批量删除 </a-button>
              <!-- <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
              <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete"> 批量删除 </a-menu-item>
              <a-menu-item key="2" @click="batchHandleOnline"> 批量下线 </a-menu-item>
              <a-menu-item key="3" @click="batchHandleOnline"> 批量上线 </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown> -->
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane key="2" tab="待审批">
          <!--引用表格-->
          <BasicTable v-if="activeKey == '2'" @register="registerTable" :searchInfo="searchInfo" :rowSelection="rowSelection">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="batchHandleApply(1)"> 批量通过 </a-button>
              <a-button type="primary" @click="batchHandleApply(3)"> 批量拒绝 </a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane key="1" tab="已通过">
          <!--引用表格-->
          <BasicTable v-if="activeKey == '1'" @register="registerTable" :searchInfo="searchInfo" :rowSelection="rowSelection">
            <!--插槽:table标题-->
            <template #tableTitle>
              <a-button type="primary" @click="batchHandleOnline"> 批量下线 </a-button>
              <a-button type="primary" @click="batchHandleDownline"> 批量上线 </a-button>
            </template>
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
            </template>
          </BasicTable>
        </a-tab-pane>
        <a-tab-pane key="3" tab="已拒绝">
          <!--引用表格-->
          <BasicTable v-if="activeKey == '3'" @register="registerTable" :searchInfo="searchInfo" :rowSelection="rowSelection">
            <!--操作栏-->
            <template #action="{ record }">
              <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
            </template>
          </BasicTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 表单区域 -->
    <NewsInfoDrawer @register="registerDrawer" @success="handleSuccess" />
    <CommentDrawer @register="registerDetail" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="news-newsInfo" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import NewsInfoDrawer from './components/NewsInfoDrawer.vue';
  import CommentDrawer from './components/CommentDrawer.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './NewsInfo.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl, batchOnline, batchApply, loadTreeRoot } from './NewsInfo.api';
  const checkedKeys = ref<Array<string | number>>([]);
  const activeKey = ref<string>('0');
  const searchInfo = { category: 1, applyStatus: '' };
  const { createMessage } = useMessage();
  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerDetail, { openDrawer: openDrawerDetail }] = useDrawer();

  // 栏目
  // const rootTreeData = ref<any[]>([]);

  //注册table数据
  const { tableContext } = useListPage({
    tableProps: {
      title: '新闻主表',
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
        fieldMapToTime: [['createTime', ['beginDate', 'endDate'], 'YYYY-MM-DD HH:mm:ss']],
      },
      actionColumn: {
        width: 220,
        fixed: 'right',
      },
      // 请求之前对参数做处理
      beforeFetch(params) {
        params.category = searchInfo.category;
        if (params.cate) {
          params.threCateId = params.cate.threeCateId;
          params.twoCateId = params.cate.twoCateId;
          params.oneCateId = params.cate.oneCateId;
          delete params.cate;
        }
        params.applyStatus = searchInfo.applyStatus;
      },
    },
    exportConfig: {
      name: '新闻主表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 树rootTreeData触发
  // function processTreeDataItem(element) {
  //   element.value = element.key;
  //   if (element.children) {
  //     element.children.forEach((element1) => {
  //       processTreeDataItem(element1);
  //     });
  //   }
  // }
  // function onRootTreeData() {
  //   loadTreeRoot({ async: true, pcode: '' }).then((result) => {
  //     result.forEach((element) => {
  //       processTreeDataItem(element);
  //     });
  //     rootTreeData.value = result;
  //   });
  // }

  /**
   * tab切换
   */
  async function changeTab(key) {
    activeKey.value = key;
    searchInfo.applyStatus = key;
    selectedRowKeys.value = [];
    // setTimeout(() => {
    //   reload();
    // }, 1000);
  }

  /**
   * 新增事件
   */
  function handleAdd() {
    openDrawer(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
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
    // onRootTreeData();
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }
  /**
   * o评论
   */
  function handleComment(record: Recordable) {
    openDrawerDetail(true, {
      record,
      isUpdate: true,
      showFooter: false,
    });
  }

  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要删除的数据！');
      return;
    }
    await batchDelete({ ids: selectedRowKeys.value.toString() }, handleSuccess);
    reload();
  }
  // 文章管理-批量下线
  async function batchHandleOnline() {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要下线的数据！');
      return;
    }
    await batchOnline({ ids: selectedRowKeys.value.toString(), status: 0 }, handleSuccess);
    reload();
  }
  // 文章管理-批量上线
  async function batchHandleDownline() {
    if (selectedRowKeys.value.length === 0) {
      createMessage.info('请选中需要上线的数据！');
      return;
    }
    await batchOnline({ ids: selectedRowKeys.value.toString(), status: 1 }, handleSuccess);
    reload();
  }
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
   * 成功回调
   */
  function handleSuccess() {
    selectedRowKeys.value = [];
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
        label: '评论管理',
        onClick: handleComment.bind(null, record),
      },
    ];
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({id: record.id}, handleSuccess);
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record){
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
        }
      },
    ]
  }
</script>

<style scoped>
  ::v-deep .ant-input-number-input {
    text-align: center;
  }
</style>
