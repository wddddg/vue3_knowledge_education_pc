<!--角色选择框-->
<template>
  <div>
      <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="getGlobalList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
      ></BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRoleList, getGlobalList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';

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
    emits: ['register', 'getSelectResult','selectparam'],
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
      function selectionChange(k){
        emit('selectparam',k.rows)
      }
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(getRoleList, getBindValue);
      // if(props.params){
      //    props.params['businessType'] = 1;
      // }else{
      //     props.params = {'businessType': 1};
      // }
      ;
      const searchInfo = ref({'businessType': 6});

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
            label: '书籍名称',
            field: 'businessName',
            component: 'JInput',
          },
          {
            label: '书籍分类',
            field: 'cateId',
            component: 'JInput',
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '书籍信息',
          dataIndex: 'businessName',
          width: 40,
          align: 'left',
        },
        {
          title: '书籍分类',
          dataIndex: 'businessType',
          width: 40,
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
          //关闭弹窗
          closeModal();
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
        getGlobalList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        selectionChange
      };
    },
  });
</script>
