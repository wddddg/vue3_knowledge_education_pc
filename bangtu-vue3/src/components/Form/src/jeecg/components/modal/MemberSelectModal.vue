<!--职务选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="900px" wrapClassName="j-user-select-modal" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
      <a-row>
        <a-col :span="showSelected ? 18 : 24">
          <BasicTable
            :columns="columns"
            :bordered="true"
            :useSearchForm="true"
            :formConfig="formConfig"
            :api="getMemberList"
            :searchInfo="searchInfo"
            :rowSelection="rowSelection"
            :indexColumnProps="indexColumnProps"
            v-bind="getBindValue"
          ></BasicTable>
        </a-col>
        <a-col :span="showSelected ? 6 : 0">
          <BasicTable v-bind="selectedTable" :dataSource="selectRows" :useSearchForm="true" :formConfig="{ showActionButtonGroup: false, baseRowStyle: { minHeight: '40px' } }">
            <!--操作栏-->
            <template #action="{ record }">
              <a href="javascript:void(0)" @click="handleDeleteSelected(record)"><Icon icon="ant-design:delete-outlined"></Icon></a>
            </template>
          </BasicTable>
        </a-col>
      </a-row>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref,h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getMemberList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { render } from '/@/utils/common/renderUtils';

  export default defineComponent({
    name: 'MemberSelectModal',
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
        default: '会员选择',
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
        rowKey: 'id',
      };
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      const [{ rowSelection, visibleChange, indexColumnProps, getSelectResult, handleDeleteSelected, selectRows }] = useSelectBiz(getMemberList, getBindValue);
      const searchInfo = ref(props.params);
      //查询form
      const formConfig = {
        labelCol: {
          span: 8,
        },
        baseColProps: {
          xs: 24,
          sm: 10,
          md: 10,
          lg: 10,
          xl: 10,
          xxl: 10,
        },
        schemas: [
          {
            label: '电话',
            field: 'phone',
            component: 'Input',
            colProps: { span: 10 },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '',
          dataIndex: 'id',
          ifShow:function (){return false},
          width: 40,
        },
        {
          title: '昵称',
          align: 'left',
          dataIndex: 'nickName',
          width: 40,
          customRender: ({ record }) => {
            return h('div', { style:{ display:'flex',"align-items": "center" } }, [
              h(render.renderImage({ text:record.headImg || '' }),{  })
              , h('div',{ style:{ display:'flex',"flex-direction": "column" }
            },[
              h('div',{ style:{ "margin-bottom":'5px' } },[record.nickName]),
              h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
                '电话:',record.phone
              ])
            ])]);
          },
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          width: 40,
          customRender: ({ text }) => {
            return render.renderDict(text, 'sex');
          },
        },
        {
          title: '状态',
          align: 'center',
          width: 40,
          dataIndex: 'status',
          customRender: ({ text }) => {
            return text==1?'是':'否'
          },
        },
      ];
      //已选择的table信息
      const selectedTable = {
        pagination: false,
        showIndexColumn: false,
        scroll: { y: 390 },
        size: 'small',
        canResize: false,
        bordered: true,
        rowKey: 'id',
        columns: [
          {
            title: '职务名称',
            dataIndex: 'name',
            width: 40,
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 40,
            slots: { customRender: 'action' },
          },
        ],
      };
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
        handleOk,
        getMemberList,
        register,
        visibleChange,
        getBindValue,
        formConfig,
        indexColumnProps,
        columns,
        rowSelection,

        selectedTable,
        selectRows,
        handleDeleteSelected,
      };
    },
  });
</script>
