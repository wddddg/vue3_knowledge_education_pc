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
        :api="systemExamList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
      ></BasicTable>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import onlineListTab from './onlineListTab.vue';
  import liveListTab from './liveListTab.vue';
  import { systemExamList } from '../../../courseInfo.api';

  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
        onlineListTab,
        liveListTab,
      //此处需要异步加载BasicTable
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
        default: '关联',
      },
    },
    emits: ['register', 'getSelectResult'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [register, { closeModal }] = useModalInner();
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
      const searchInfo = ref(props.params);
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
            label: '搜索内容',
            field: 'searchParam',
            component: 'JInput',
          },
          {
            label: '分类',
            field: 'cateId',
            component: 'JInput',
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '考试名称',
          dataIndex: 'name',
          width: 40,
          align: 'center',
        },
        {
          title: '题目数量',
          dataIndex: 'examCount',
          width: 40,
        },
        {
          title: '考试时长',
          dataIndex: 'examTime',
          width: 40,
        },
        {
          title: '考试分值',
          dataIndex: 'fractionCount',
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
      function selectionChange(k){
        selectList = k.rows
        // emit('selectparam',k.rows)
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
        systemExamList,
        selectionChange
      };
    },
  });
</script>
