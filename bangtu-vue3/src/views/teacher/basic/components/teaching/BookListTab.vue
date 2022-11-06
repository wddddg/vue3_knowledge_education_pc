<!--角色选择框-->
<template>
  <div>
    <BasicTable
      :columns="columns"
      v-bind="config"
      :useSearchForm="true"
      :formConfig="formConfig"
      :api="bookInfoList"
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
  import { bookInfoList } from './data.api';
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
      const searchInfo = ref({ teacherId: id });

      //查询form
      const formConfig = {
        labelWidth: 220,
        schemas: [
          {
            label: '书籍名称',
            field: 'name',
            component: 'JInput',
            colProps: { span: 8 },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '书籍名称',
          dataIndex: 'name',
          width: 40,
        },
        {
          title: '报名人数',
          dataIndex: 'studyCount', //1、线上课 2、直播课 3、面授课 4、班级课
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
          title: '课程分类',
          dataIndex: 'oneCateName',
          width: 40,
        },
        {
          title: '是否完结',
          dataIndex: 'isEnd',
          width: 40,
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
        bookInfoList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
      };
    },
  });
</script>
