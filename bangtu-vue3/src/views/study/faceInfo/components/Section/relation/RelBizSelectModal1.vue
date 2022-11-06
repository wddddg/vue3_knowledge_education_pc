<!--角色选择框-->
<template>
  <div>

    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1000px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
        <a-tabs defaultActiveKey="all-info">
          <a-tab-pane tab="班级" key="ClassListTab-info" forceRender>
              <ClassListTab @selectparam="ClassParam"></ClassListTab>
          </a-tab-pane>
          <a-tab-pane tab="课程" key="CourseListTab-info" forceRender>
              <CourseListTab @selectparam="CourseParam"></CourseListTab>
          </a-tab-pane>
          <a-tab-pane tab="考点" key="ExamListTab-info" forceRender>
              <ExamListTab @selectparam="ExamParam"></ExamListTab>
          </a-tab-pane>
          <a-tab-pane tab="电子书" key="BookListTab-info" forceRender>
              <BookListTab @selectparam="BookParam"></BookListTab>
          </a-tab-pane>
        </a-tabs>
      <!-- <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="courseLiveGoodsList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
      ></BasicTable> -->
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { courseLiveGoodsList,courseLiveGoodsAdd } from '../../../courseInfo.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import liveListTab from './liveListTab.vue';
  import BookListTab from './BookListTab.vue';
  import ClassListTab from './ClassListTab.vue';
  import CourseListTab from './CourseListTab.vue';
  import ExamListTab from './ExamListTab.vue';

  export default defineComponent({
    name: 'RelBizSelectModal',
    components: {
        liveListTab,
        BookListTab,
        ClassListTab,
        CourseListTab,
        ExamListTab,
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
    emits: ['register', 'getSelectResult','reload'],
    setup(props, { emit, refs }) {
      //注册弹框
      let nodeData = {}
      const [register, { closeModal }] = useModalInner(async (data)=>{
        nodeData = data.nodeData
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
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(courseLiveGoodsList, getBindValue);
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
            label: '搜索课程',
            field: 'searchParam',
            component: 'JInput',
            componentProps: {
              placeholder:'请输入姓名/手机号'
            },
          },
          {
            label: '课程分类',
            field: 'roleName',
            component: 'Select',
            componentProps: {
            },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '名称',
          dataIndex: 'roleName',
          width: 40,
        },
        {
          title: '价格',
          dataIndex: 'roleCode',
          width: 40,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 40,
        },
      ];
      let ClassRow = []
      function ClassParam(data){
        ClassRow = data
      }
      let CourseRow = []
      function CourseParam(data){
        CourseRow = data
      }
      let ExamRow = []
      function ExamParam(data){
        ExamRow = data
      }
      let BookRow = []
      function BookParam(data){
        BookRow = data
      }
      function selectionChange(k){
        // emit('selectparam',k.rows)
      }
      /**
       * 确定选择
       */
      function handleOk() {
          //回传选项和已选择的值
          
          console.log(nodeData,'nodeData')
          let dataList = [...ClassRow,...CourseRow,...ExamRow,...BookRow]
          dataList.forEach((itme,i)=>{
            let param = {
              businessId:itme.id,
              goodsName:itme.businessName,
              goodsType:itme.businessType,
              imgUrl:itme.imgUrl,
              price:itme.businessPrice,
              courseId:nodeData.courseId,
              sectionId:nodeData.parentId,
              chapterId:nodeData.id,
            }
            courseLiveGoodsAdd(param).then(res=>{
              if(dataList.length==i+1){
                emit('reload')
                closeModal();
              }
            })
          })
          
          // emit('getSelectResult',[...ClassRow,...CourseRow,...ExamRow,...BookRow]);
          //关闭弹窗
      }

      return {
        config,
        handleOk,
        searchInfo,
        register,
        indexColumnProps,
        visibleChange,
        courseLiveGoodsList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        ClassParam,
        CourseParam,
        ExamParam,
        BookParam
      };
    },
  });
</script>
