<!--角色选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1000px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
      <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="questionsList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @register="registerTable"
        @selection-change="selectionChange"
      >
      <template #htmlSlot="{text}">
         <div v-html="text"></div>
      </template>
      </BasicTable>
    </BasicModal> 
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { questionsList,addList } from '../SystemExamToday.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useTable, TableAction } from '/src/components/Table';

  export default defineComponent({
    name: 'onlineListTab',
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
        default: '添加试题',
      },
    },
    emits: ['register', 'getSelectResult','selectparam','success'],
    setup(props, { emit, refs }) {
      //注册弹框
      const [registerTable, { reload, getSelectRows, setProps,clearSelectedRowKeys }] = useTable()
      let selectRowKeys = []
      function selectionChange(k){
        selectRowKeys = k.keys
      }

      let searchInfo = ref();
      let cateId = ref('')
      let todayId = ref('')
      const [register, { closeModal }] = useModalInner((data)=>{
        cateId.value = data.sysCategory
        todayId.value = data.todayId
        searchInfo.value = {'sysCategory': data.sysCategory} 
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
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(questionsList, getBindValue);
      // if(props.params){
      //    props.params['businessType'] = 1;
      // }else{
      //     props.params = {'businessType': 1};
      // }
      

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
            label: "题目类型",
            field: 'questonType',
            component: 'JSearchSelect',
            componentProps: {
              dict:"questions_type"
            },
          },
          {
              label: "行业分类",
              field: '',
              component: 'JMsTreeSelect',
              componentProps: ({formActionType,formModel}) => {
                return {
                  onChange:function(e){
                    console.log(formModel,e)
                    formModel.oneCateId = e.oneCateId //e.oneCateId
                    formModel.twoCateId = e.twoCateId
                    formModel.threeCateId = e.threeCateId
                    formModel.cateId = e.selectCateId
                  }
                }
              },
              colProps: {span: 6},
            },
            {
              label: "",
              field: 'oneCateId',
              show:false,
              component: 'Input',
              colProps: {span: 6},
            },
            {
              label: "",
              field: 'twoCateId',
              show:false,
              component: 'Input',
              colProps: {span: 6},
            },
            {
              label: "",
              field: 'cateId',
              show:false,
              component: 'Input',
              colProps: {span: 6},
            },
            {
              label: "",
              field: 'threeCateId',
              show:false,
              component: 'Input',
              colProps: {span: 6},
            },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '题目类型',
          dataIndex: 'questonType_dictText',
          width: 40,
        },
        {
          title: '题干',
          dataIndex: 'title',
          slots:{ customRender: 'htmlSlot'},
          width: 40,
        },

      ];

      /**
       * 确定选择
       */
      function handleOk() {
        getSelectResult((options, values) => {
          //回传选项和已选择的值
          let data = []
          selectRowKeys.forEach(itme=>{
            let param = {}
            param.cateId = cateId.value
            param.todayId = todayId.value
            param.questionId = itme
            data.push(param)
          })
          addList(data).then(res=>{
            emit('success');
          })
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
        questionsList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        registerTable,
        selectionChange
      };
    },
  });
</script>
