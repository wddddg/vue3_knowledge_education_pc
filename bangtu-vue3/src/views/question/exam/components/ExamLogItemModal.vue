<!--角色选择框-->
<template>
  <div>

    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1000px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
        <!-- <a-tabs defaultActiveKey="all-info">
          <a-tab-pane tab="线上课" key="online-info" forceRender>
              <onlineListTab @selectparam="onlineParam"></onlineListTab>
          </a-tab-pane>
          <a-tab-pane tab="直播课" key="live-info" forceRender>
              <liveListTab @selectparam="liveParam"></liveListTab>
          </a-tab-pane>
        </a-tabs> -->
      <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="LogItemList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
        @register="registerTable"
      >
        <template #tableTitle>
            <a-button type="primary" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1" @click="batchHandleDelete">
                        <Icon icon="ant-design:delete-outlined"></Icon>
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button>批量操作
                    <Icon icon="mdi:chevron-down"></Icon>
                  </a-button>
            </a-dropdown>
        </template>
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)"/>
        </template>
      </BasicTable>
    </BasicModal>
    <!-- <AddListTab @register="registerModal" @success="handleSuccess"> </AddListTab> -->
  </div>

</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner} from '/@/components/Modal';
  import {useModal} from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { LogItemList } from '../SystemExam.api';
  // import AddListTab from './AddListTab.vue'

  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
      //此处需要异步加载BasicTable
      // AddListTab,
      BasicModal,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: '批阅',
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [registerModal, {openModal}] = useModal();
      let searchInfo = ref(props.params);
      let sysCategory = ref('')
      let todayId = ref('')
      const [register, { closeModal }] = useModalInner((data)=>{
        
        sysCategory.value = data.record.cateId
        todayId.value = data.record.id
        searchInfo.value = {examLogId:data.record.id,memberId:data.record.member,examId:data.record.examId}
      });
      const attrs = useAttrs();
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        rowKey: unref(props).rowKey,
      };
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(getRoleList, getBindValue);
      const [registerTable, {reload,setSelectedRowKeys}] = useTable();
      //查询form
      const formConfig = {
        labelWidth: 220,
        baseColProps: {
          xs: 24,
          sm: 24,
          md: 24,
          lg: 14,
          xl: 14,
          xxl: 14,
        },
        schemas: [
          {
            label: "题目名称",
            field: 'questionTitle',
            component: 'Input',

          },
          {
            label: "题型",
            field: 'questonType',
            component: 'JSearchSelect',
            componentProps: {
              dict:"questions_type"
            },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '题目',
          dataIndex: 'questionTitle',
          width: 40,
          align: 'center',
        },
        {
          title: '是否正确',
          dataIndex: 'isOk_dictText',
          width: 40,
        },
        {
          title: '试题类型',
          dataIndex: 'questionType_dictText',
          width: 40,
        },
        {
          title: '用户答案',
          dataIndex: 'inputAnswer',
          width: 40,
        },
        {
          title: '正确答案',
          dataIndex: 'answer',
          width: 40,
        },
      ];
      let selectOnlineRow = []
      function onlineParam(data){
        selectOnlineRow = data
      }
      let selectLiveRow = []
      function liveParam(data){
        selectLiveRow = data
      }
      let selectList = []
      let selectedRowKeys = ref([])
      function selectionChange(k){
        
        selectList = k.rows
        selectedRowKeys.value = k.keys
        // emit('selectparam',k.rows)
      }
      /**
        * 新增事件
        */
      function handleAdd() {
        openModal(true, {
          sysCategory:sysCategory.value,
          todayId:todayId.value,
          isUpdate: false,
          showFooter: true,
        });
      }
      /**
        * 批量删除事件
        */
      async function batchHandleDelete() {
        await todayDeleteBatch({ids: selectedRowKeys.value}, handleSuccess);
      }
      /**
        * 成功回调
        */
      function handleSuccess() {
          (selectedRowKeys.value = []) && reload();
      }
      /**
       * 确定选择
       */
      function handleOk() {
          //回传选项和已选择的值
          emit('getSelectResult',selectList);
          //关闭弹窗
          closeModal();
      }
      function handleLog(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
          showFooter: true,
        });
      }
         /**
      * 操作栏
      */
      function getTableAction(record){
          return [
            {
              label: '批阅',
              onClick: handleLog.bind(null, record),
            },
            {
              label: '详情',
              onClick: handleLog.bind(null, record),
            }
          ]
      }

      return {
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        getRoleList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        onlineParam,
        liveParam,
        selectionChange,
        LogItemList,
        registerTable,
        selectedRowKeys,
        batchHandleDelete,
        handleSuccess,
        registerModal,
        handleAdd,
        getTableAction
      };
    },
  });
</script>
