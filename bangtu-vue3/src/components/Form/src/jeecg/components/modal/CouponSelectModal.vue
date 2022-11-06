<!--角色选择框-->
<template>
  <div>
    <BasicModal v-bind="$attrs" @register="register" :title="modalTitle" width="1200px" @ok="handleOk" destroyOnClose @visible-change="visibleChange">
      <BasicTable
        :columns="columns"
        v-bind="config"
        :useSearchForm="true"
        :formConfig="formConfig"
        :api="couponList"
        :searchInfo="searchInfo"
        :rowSelection="rowSelection"
        :indexColumnProps="indexColumnProps"
      ></BasicTable>
    </BasicModal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, unref } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { couponList } from '/@/api/common/api';
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import { useSelectBiz } from '/@/components/Form/src/jeecg/hooks/useSelectBiz';
import { selectProps } from '/@/components/Form/src/jeecg/props/props';
import { useAttrs } from '/@/hooks/core/useAttrs';

export default defineComponent({
  name: 'CouponSelectModal',
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
      default: '优惠券',
    },
  },
  emits: ['register', 'getSelectResult'],
  setup(props, { emit, refs }) {
    //注册弹框
    const [register, { closeModal }] = useModalInner();
    const attrs = useAttrs();
    //表格配置
    const config = {
      showIndexColumn:false,
      canResize: false,
      bordered: true,
      size: 'small',
      rowKey: unref(props).rowKey,
    };
    const getBindValue = Object.assign({}, unref(props), unref(attrs), config);
    const [{ rowSelection, indexColumnProps, visibleChange, getSelectResult }] = useSelectBiz(couponList, getBindValue);
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
          label: '优惠券',
          field: 'title',
          component: 'JInput',
          componentProps:{
            type:'title'
          }
        },
      ],
    };
    const textLabel = (txt) => {
      if (txt == 1) {
        return '全平台';
      } else if (txt == 2) {
        return '普通课程';
      } else if (txt == 3) {
        return '直播课';
      } else if (txt == 4) {
        return '线下课';
      } else if (txt == 5) {
        return '班级课';
      } else if (txt == 6) {
        return '会员';
      } else if (txt == 7) {
        return '电子书';
      } else if (txt == 8) {
        return '资料库';
      }
    };
    //定义表格列
    const columns = [
      {
        title: '优惠券名称',
        align: 'center',
        dataIndex: 'title',
      },
      {
        title: '使用场景',
        align: 'center',
        dataIndex: 'useScenes',
        customRender: ({ text }) => {
          return textLabel(text);
        },
        width:100
      },
      {
        title: '分类',
        align: 'center',
        dataIndex: 'useCatagory',
        customRender: ({ text }) => {
          return text == 1 ? '满减券' : text == 2 ? '无门槛券' : '折扣券';
        },
        width:100
      },
      {
        title: '分配数量',
        align: 'center',
        dataIndex: 'assignAmount',
        width:100
      },
      {
        title: '剩余数量',
        align: 'center',
        dataIndex: 'laveAmount',
        width:100
      },
      {
        title: '截止时间',
        align: 'center',
        dataIndex: 'giveTime',
        customRender: ({ text }) => {
          return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
        },
      },
      {
        title: '发放方式',
        align: 'center',
        dataIndex: 'giveType',
        customRender: ({ text }) => {
          return text == 1 ? '平台' : text == 2 ? '兑换码' : '用户奖励';
        },
        width:100
      },
      {
        title: '下线时间',
        align: 'center',
        dataIndex: 'endTime',
        customRender: ({ text }) => {
          return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
        },
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
      couponList,
      formConfig,
      getBindValue,
      columns,
      rowSelection,
    };
  },
});
</script>
