<!--角色选择框-->
<template>
  <div>

    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1000px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
        <!-- <a-tabs defaultActiveKey="all-info">
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
        </a-tabs> -->
      <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="findJumpQuestionPageList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
        @selection-change="selectionChange"
      >
        <!--字段回显插槽-->
        <template #htmlSlot="{text}">
          <div v-html="text"></div>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { findJumpQuestionPageList,courseSectionPracticeAdd } from '../../../courseInfo.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { getDictItems } from '/@/api/common/api';
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
      const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(findJumpQuestionPageList, getBindValue);
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
            field: 'questonType',
            component: 'JDictSelectTag',
            componentProps: {
              dictCode: 'questtionType',
            },
          },
        ],
      };
      // let dictList = []
      // getDictItems('questtionType').then(res=>{
      //   dictList = res
      // })
      //定义表格列
      const columns = [
        {
          title: '习题内容',
          dataIndex: 'title',
          width: 40,
          slots:{customRender: 'htmlSlot'}
        },
        {
          title: '习题类型',
          // dataIndex: 'questonType',
          width: 40,
          customRender: ({ record }) => {
            // dictList.forEach(itme=>{
            //   if(itme.value == record.questonType){
            //     record.questonType_dict = itme.label
            //   }
            // })
            return record.questonType_dictText
          },
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
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
      let selectList = []
      function selectionChange(k){
        // emit('selectparam',k.rows)
        selectList = k.rows
      }
      /**
       * 确定选择
       */
      function handleOk() {
          //回传选项和已选择的值
          
          console.log(nodeData,'nodeData')
          let dataList = []
          selectList.forEach((itme,i)=>{
            dataList.push(itme.id) 
          })
          let param = {
            ids:dataList,
            courseId:nodeData.courseId,
            sectionId:nodeData.parentId,
            chapterId:nodeData.id,
          }
          courseSectionPracticeAdd(param).then(res=>{
              emit('reload')
              closeModal();
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
        findJumpQuestionPageList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
        ClassParam,
        CourseParam,
        ExamParam,
        BookParam,
        selectionChange
      };
    },
  });
</script>
