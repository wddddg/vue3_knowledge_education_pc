<!--角色选择框-->
<template>
  <div>
    <BasicTable
      :columns="columns"
      v-bind="config"
      :useSearchForm="true"
      :formConfig="formConfig"
      :api="knowledgeInfoList"
      :searchInfo="searchInfo"
      :rowSelection="rowSelection"
      @selectionChange="handleOk"
      :indexColumnProps="indexColumnProps"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { knowledgeInfoList } from './data.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'BookListTab',
    components: {
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
        default: '全局选择',
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
      // if(props.params){
      //    props.params['businessType'] = 1;
      // }else{
      //     props.params = {'businessType': 1};
      // }
      const id = localStorage.getItem('tes');
      // let userInfo = useUserStore().userInfo;
      // teacherId: userInfo.id
      const searchInfo = ref({ teacherId: id });

      //查询form
      const formConfig = {
        labelWidth: 220,
        schemas: [
          {
            label: '资料名称',
            field: 'businessName',
            component: 'JInput',
            colProps: { span: 8 },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '资料名称',
          dataIndex: 'name',
          width: 40,
        },
        {
          title: '资料分类',
          dataIndex: 'oneCateName',
          width: 40,
        },
        {
          title: '收费规则',
          dataIndex: 'costType',
          width: 40,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: text == 1 ? 'color:#00a7a4' : text == 2 ? 'color:#fe9b2a' : 'color:#ff0053',
              },
              text == 1 ? '免费' : text == 2 ? '会员免费' : '全部收费'
            );
          },
        },
        {
          title: '是否推荐',
          dataIndex: 'isRecommend',
          width: 40,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: text == 1 ? 'color:#00a7a4' : 'color:#108DE9',
              },
              text == 1 ? '已推荐' : '未推荐'
            );
          },
        },
        {
          title: '置顶状态',
          dataIndex: 'isTop',
          width: 40,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: text == 1 ? 'color:#00a7a4' : 'color:#108DE9',
              },
              text == 1 ? '已置顶' : '未置顶'
            );
          },
        },
        {
          title: '状态',
          dataIndex: 'isEnable',
          width: 40,
          customRender: ({ text }) => {
            return text === 1 ? '启用' : '停用';
          },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 40,
        },
      ];

      /**
       * 确定选择
       */
      function handleOk() {
        getSelectResult((options, values) => {
          //回传选项和已选择的值
          emit('getSelectResult', options, values);
        });
      }

      return {
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        getRoleList,
        knowledgeInfoList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
      };
    },
  });
</script>
