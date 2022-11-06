<!--角色选择框-->
<template>
  <div>
    <BasicTable
      :columns="columns"
      v-bind="config"
      :useSearchForm="true"
      :formConfig="formConfig"
      :api="courseInfoList"
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
  import { courseInfoList } from './data.api';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
  import { selectProps } from '/@/components/Form/src/jeecg/props/props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useUserStore } from '/@/store/modules/user';
  import { object } from 'vue-types';

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
      // 获取当前用户信息
      const id = localStorage.getItem('tes');
      // let userInfo = useUserStore().userInfo;
      const searchInfo = ref({ teacherId: id });

      //查询form
      const formConfig = {
        labelWidth: 220,
        schemas: [
          {
            label: '课程名称',
            field: 'businessName',
            component: 'JInput',
            colProps: { span: 8 },
          },
        ],
      };
      //定义表格列
      const columns = [
        {
          title: '课程名称',
          dataIndex: 'name',
          width: 40,
        },
        {
          title: '课程类型',
          dataIndex: 'courseType', //1、线上课 2、直播课 3、面授课 4、班级课
          width: 40,
          customRender: ({ text }) => {
            return text === 1 ? '线上课' : text === 2 ? '直播课' : text === 3 ? '面授课' : '班级课';
          },
        },
        {
          title: '收费类型',
          dataIndex: 'costType',
          width: 40,
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
          dataIndex: 'oneCateName',
          width: 40,
        },
        {
          title: '所属讲师',
          dataIndex: 'teacherName',
          width: 40,
        },
        {
          title: '总时长',
          dataIndex: 'courseTimeCount',
          width: 40,
        },
        {
          title: '已学时长',
          dataIndex: 'activityEndTime',
          width: 40,
        },
        {
          title: '开始学习时间',
          dataIndex: 'startTime',
          width: 40,
        },
        {
          title: '最后学习时间',
          dataIndex: 'freeEndTime',
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
        courseInfoList,
        formConfig,
        getBindValue,
        columns,
        rowSelection,
      };
    },
  });
</script>
