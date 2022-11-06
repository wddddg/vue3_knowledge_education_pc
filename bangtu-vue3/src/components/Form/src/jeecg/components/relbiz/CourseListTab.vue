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
  import {  getGlobalList } from '/@/api/common/api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import {h} from 'vue'

  export default defineComponent({
    name: 'CourseListTab',
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
      let selectedClassifyRows = [];
      //表格配置
      const config = {
        canResize: false,
        bordered: true,
        size: 'small',
        rowKey: unref(props).rowKey,
      };
      function selectionChange(k){
        emit('selectparam',k.rows)
        selectedClassifyRows= k.rows;
      }

      const searchInfo = ref({'businessType': 3});
      const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
      getBindValue.labelKey = "businessName";
      getBindValue.isRadioSelection = true;
      getBindValue.searchInfo = searchInfo.value;

      let [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(getGlobalList, getBindValue);



      //查询form
      const formConfig = {
        labelWidth: 120,

        schemas: [
          {
            label: '课程名称',
            field: 'businessName',
            component: 'JInput',
            labelWidth:150,
                colProps: {span: 9},


          },
          {
            labelWidth:150,
            label: "课程分类",
            field: '',
            component: 'JMsTreeSelect',
            componentProps: ({formActionType,formModel}) => {
              return {
                onChange:function(e){
                  formModel.cateId = e.selectCateId;

                }
              }
            },
            colProps: {span: 9},
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '课程信息',
          dataIndex: 'businessName',
          align: 'left',
          width: 200,
          customRender:({record}) => {
            //
            // return h('div',{style:'display:flex;'},[h('img',{src:record.imgUrl,style:'height:80px;width:120px;'}),h('div',{style:'margin-left:10px'},[
            //   h('div',{style:' white-space:nowrap; overflow:hidden; text-overflow:ellipsis;min-height:50px'},record.businessName),
            //   h('div',{style:'color:red;'},'￥'+record.businessPrice)
            // ])])
            return h('div',{style:'display:flex;text-align: left;'},[h('img',{src:record.imgUrl,style:'height:80px;width:120px;'}),h('div',{style:'margin-left:10px;display:flex;flex-direction: column;justify-content: space-between; '},[
              h('a-tooltip',{style:'overflow:hidden;word-wrap: break-word;word-break: break-all;white-space: pre-line;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;',title:record.businessName},record.businessName),
              h('div',{style:'color:red'},'￥'+record.businessPrice)
            ])])
          },
        },
        {
          title: '课程类型',
          dataIndex: 'courseTypeStr', //1、线上课 2、直播课 3、面授课 4、班级课
          width: 40,
        },
        {
          title:'收费类型',
          dataIndex: 'costType',
          width:80,
          customRender: ({ text }) => {
            return h(
              'div',
              {
                style: text == 1 ? 'color:#00a7a4' : text == 2 ? 'color:#CC3300' : text == 3 ? 'color:#fe9b2a' : 'color:#ff0053',
              },
              text == 1 ? '免费' : text == 2 ? '限时免费' : text == 3 ? '会员免费' : '全部收费'
            );
          },
        },
        {
          title: '课程分类',
          dataIndex: 'classifyStr',
          width: 80,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 80,
        },
      ];

      /**
       * 确定选择
       */
      function handleOk() {

        getSelectResult((options, values) => {
          //回传选项和已选择的值
          if(selectedClassifyRows.length>0){
              selectedClassifyRows.forEach(element => {
                  element.onclickType = 3;
                  element.businessId = element.id;
              });
          }
          emit('getSelectResult', options, values, selectedClassifyRows);
          //关闭弹窗
          // closeModal();
        });
      }

      return {
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        getGlobalList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        selectionChange,
      };
    },
  });
</script>
