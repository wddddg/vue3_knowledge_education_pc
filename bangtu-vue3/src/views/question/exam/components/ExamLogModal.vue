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
        :api="LogList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
        @register="registerTable"
        :actionColumn="actionColumn" 
      >
        <!-- <template #tableTitle>
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
        </template> -->
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" />
        </template>
      </BasicTable>
    </BasicModal>
    <ExamLogItemModal @register="registerModal" @success="handleSuccess"> </ExamLogItemModal>
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
  import { LogList } from '../SystemExam.api';
  import ExamLogItemModal from './ExamLogItemModal.vue'

  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
      //此处需要异步加载BasicTable
      // AddListTab,
      BasicModal,
      ExamLogItemModal,
      TableAction,
      BasicTable: createAsyncComponent(() => import('/@/components/Table/src/BasicTable.vue'), {
        loading: true,
      }),
    },
    props: {
      ...selectProps,
      //选择框标题
      modalTitle: {
        type: String,
        default: '考试记录',
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
        searchInfo.value = {examId:data.record.id}
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
          lg: 12,
          xl: 12,
          xxl: 12,
        },
        schemas: [
          {
            label: "用户昵称",
            field: 'memberName',
            component: 'Input',
            // componentProps: {
            //   dict:"questions_type"
            // },
          },
          {
            label: "用户手机",
            field: 'memberPhone',
            component: 'Input',
          },
        ],
      };
      let actionColumn = {
        width: 50,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
        fixed: undefined,
      }
      //定义表格列
      const columns = [
        {
          title: '用户昵称',
          dataIndex: 'memberName',
          width: 40,
          align: 'center',
        },
        {
          title: '手机号',
          dataIndex: 'memberPhone',
          width: 40,
        },
        {
          title: '考试用时',
          dataIndex: 'useDate',
          width: 40,
        },
        {
          title: '得分',
          dataIndex: 'examFraction',
          width: 40,
        },
        {
          title: '及格分数',
          dataIndex: 'passScore',
          width: 40,
        },
        {
          title: '满分分数',
          dataIndex: 'examFractionCount',
          width: 40,
        },
        {
          title: '是否需要批阅',
          dataIndex: 'isPy_dictText',
          width: 40,
        },
        // {
        //   title: '操作',
        //   dataIndex: '',
        //   slots: 'option',
        //   width: 40,
        // },
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
        LogList,
        registerTable,
        selectedRowKeys,
        batchHandleDelete,
        handleSuccess,
        registerModal,
        handleAdd,
        getTableAction,
        actionColumn
      };
    },
  });
</script>
