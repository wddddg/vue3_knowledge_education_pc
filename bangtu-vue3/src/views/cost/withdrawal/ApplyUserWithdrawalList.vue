<template>
  <div>
    <a-card v-show="isReport">
      <div>
        <div class="c-right">
          <div class="rt-top">
            <div class="title-tip1"></div>
            <div class="top-tie">
              <a-radio-group v-model:value="queryType" @change="onChange">
                <a-radio-button :value="1">本月</a-radio-button>
                <a-radio-button :value="2">本年</a-radio-button>
              </a-radio-group>
              <a-range-picker v-model:value="times" format="YYYY-MM-DD" style="width: 240px" @change="onChange" />
            </div>
          </div>
          <!-- <div>
            <div ref="chartRef" :style="{ width, height }"></div>
          </div> -->
        </div>
        <LineMulti :chartData="barMultiData" height="50vh" :option="multiBarOption" type="line" />
      </div>
    </a-card>
    <!-- <PageWrapper> -->
    <a-card :bordered="false" style="height: 100%">
      <a-tabs defaultActiveKey="" @change="switchTabs">
        <a-tab-pane tab="全部" key="" forceRender />
        <a-tab-pane tab="待审批" key="1" forceRender />
        <a-tab-pane tab="已通过" key="2" forceRender />
        <a-tab-pane tab="未通过" key="3" forceRender />
      </a-tabs>
    </a-card>
    <!-- </PageWrapper> -->
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <!-- <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button> -->
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出数据</a-button>
        <!-- <j-upload-button  type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button> -->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu v-show="isActions">
              <a-menu-item key="1" @click="showModel(2)">
                <Icon icon="ant-design:delete-outlined" />
                批量通过
              </a-menu-item>
              <a-menu-item key="1" @click="showModel(0)">
                <Icon icon="ant-design:delete-outlined" />
                批量拒绝
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
        <!-- <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/> -->
        <TableAction :actions="getTableAction(record)" v-show="isActions" />
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
    <ApplyUserWithdrawalModal @register="registerModal" @success="handleSuccess" />
    <ApplyUserWithdrawalsModal @register="registerModal2" @success="handleSuccess" @onMoneyBatch="onMoneyBatch" />
  </div>
</template>

<script lang="ts" name="withdrawal-applyUserWithdrawal" setup>
  import { ref, computed, unref, onMounted, watchEffect } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import ApplyUserWithdrawalModal from './components/ApplyUserWithdrawalModal.vue';
  import ApplyUserWithdrawalsModal from './components/ApplyUserWithdrawalsModal.vue';
  import { columns, searchFormSchema } from './ApplyUserWithdrawal.data';
  import { list, deleteOne, applyMoneyBatch, getImportUrl, getExportUrl, getReport } from './ApplyUserWithdrawal.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { PageWrapper } from '/@/components/Page';
  import LineMulti from '/@/components/chart/LineMulti.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  let isReport = ref(true);
  let isActions = ref(true);
  let barMultiData = ref([]);
  let queryType = ref('1');
  let startTime = '';
  let endTime = '';
  let times = ref([]);
  let parem = {
    queryType: queryType.value,
    bookId: '',
  };

  const multiBarOption = {
    title: { text: '基本统计', left: 'center' },
  };
  function Report(data) {
    getReport(data).then((res) => {
      barMultiData.value = [];
      res.forEach((item) => {
        let param = {};
        param.name = item.x;
        param.value = item.y;
        barMultiData.value.push(param);
      });
    });
  }
  watchEffect(() => {
    console.log(queryType.value);
    console.log(times.value);
    if (times.value.length != 0) {
      startTime = times.value[0].format('YYYY-MM-DD') + ' 00:00:00';
      endTime = times.value[1].format('YYYY-MM-DD') + ' 23:59:59';
    } else {
      startTime = null;
      endTime = null;
    }
    console.log(startTime, endTime);
    let param = {};
    param.queryType = queryType.value;
    param.startTime = startTime;
    param.endTime = endTime;
    // param.bookId = roleId.value
    Report(param);
  });

  //注册model
  const [registerModal, { openModal }] = useModal();
  const [registerModal2, { openModal: openModal2 }] = useModal();
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '用户提现审批表',
      api: list,
      columns,
      canResize: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [['datetime', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
      },
      actionColumn: {
        width: 120,
        fixed: 'right',
      }
    },
    exportConfig: {
      name: '用户提现审批表',
      url: getExportUrl,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    }
  });

  const [registerTable, { reload, setProps }, { rowSelection, selectedRowKeys }] = tableContext;

  function switchTabs(k) {
    
    k == '' ? (isReport.value = true) : (isReport.value = false);
    k == '' || k == '1' ? (isActions.value = true) : (isActions.value = false);
    setProps({ searchInfo: { status: k } });
    reload();
  }
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
   * 批量操作事件
   */
  function showModel(status) {
    openModal2(true, {
      status: status,
    });
  }
  async function onMoneyBatch(data) {
    await applyMoneyBatch({ ids: selectedRowKeys.value.join(','), status: data.status, remarks: data.remarks }, handleSuccess);
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
        label: record.status == 1 ? '审批' : '审批',
        onClick: handleEdit.bind(null, record),
        disabled:record.status != 1
      },
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record) {
    return [
      {
        label: '详情',
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

<style lang="less" scoped>
  .c-right {
    width: 84%;
  }

  .title-tip {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 28px;
      background: #2c6afd;
      margin-right: 14px;
    }
  }
  .rt-top {
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-tip1 {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      position: relative;
    }
  }
</style>
