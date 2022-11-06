<!--角色选择框-->
<template>
  <div>
    <BasicTable
      :columns="columns"
      v-bind="config"
      :useSearchForm="true"
      :formConfig="formConfig"
      :api="newsList"
      :searchInfo="searchInfo"
      :rowSelection="rowSelection"
      :indexColumnProps="indexColumnProps"
      @selectionChange="handleOk"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList } from '/@/api/common/api';
  import { newsList } from './data.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'GoodsListTab',
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
      const searchInfo = ref({ teacherId: id });

      //查询form
      const formConfig = {
        labelWidth: 220,
        schemas: [
          {
            label: '文章名称',
            field: 'businessName',
            component: 'JInput',
            colProps: { span: 8 },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          width: 40,
        },
        {
          title: '文章类型',
          dataIndex: 'newsType',
          width: 40,
          customRender: ({ text }) => {
            return text == 2 ? '视频' : '图文';
          },
        },
        {
          title: '文章分类',
          dataIndex: 'category',
          width: 40,
          customRender: ({ text }) => {
            return text == 1 ? '答疑文章' : text == 2 ? '广场文章' : '资讯文章';
          },
        },
        {
          title: '审核状态',
          dataIndex: 'applyStatus',
          width: 40,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: text == 1 ? 'color:#00a7a4' : text == 2 ? 'color:#fe9b2a' : 'color:#ff0053',
              },
              text == 1 ? '已通过' : text == 2 ? '待审批' : '已拒绝'
            );
          },
        },
        {
          title: '点赞数量',
          dataIndex: 'likeCount',
          width: 40,
        },
        {
          title: '评论数量',
          dataIndex: 'discussCount',
          width: 40,
        },
        {
          title: '审核时间',
          dataIndex: 'applyTime',
          width: 40,
        },
        {
          title: '发布时间',
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
        newsList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
      };
    },
  });
</script>
