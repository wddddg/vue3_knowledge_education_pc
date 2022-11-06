import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';
import { render } from '/@/utils/common/renderUtils';
import { saveOrUpdate } from './CouponInfo.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
// import { rules} from '/@/utils/helper/validator';
// import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
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
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'useCatagory',
    customRender: ({ text }) => {
      const color = text == '1' ? 'cyan' : text == '2' ? 'blue' : 'red';
      return render.renderTag(text == 1 ? '满减券' : text == 2 ? '无门槛券' : '折扣券', color);
    },
  },
  {
    title: '分配数量',
    align: 'center',
    dataIndex: 'assignAmount',
  },
  {
    title: '剩余数量',
    align: 'center',
    dataIndex: 'laveAmount',
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
      const color = text == '1' ? 'cyan' : text == '2' ? 'blue' : 'red';
      return render.renderTag(text == 1 ? '平台' : text == 2 ? '兑换码' : '用户奖励', color);
    },
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isEnable')) {
        record.isEnable = false;
      }
      return h(Switch, {
        checked: record.isEnable === 1,
        checkedChildren: '启用',
        unCheckedChildren: '停用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          saveOrUpdate({ id: data.id, isEnable: newStatus }, true)
            .then(() => {
              record.isEnable = newStatus;
            })
            .catch(() => {
              createMessage.error('修改状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '下线时间',
    align: 'center',
    dataIndex: 'endTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '有效状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return text == 1 ? '有效' : '无效';
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '优惠券名称',
    field: 'title',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '使用场景',
    field: 'useScenes',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全平台', value: 1 },
        { label: '普通课程', value: 2 },
        { label: '直播课', value: 3 },
        { label: '线下课', value: 4 },
        { label: '班级课', value: 5 },
        { label: '会员', value: 6 },
        { label: '电子书', value: 7 },
        { label: '资料库', value: 8 },
      ],
      placeholder: '请选择使用场景',
      dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
    },
    colProps: { span: 8 },
  },
  {
    label: '使用分类',
    field: 'useCatagory',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '满减券', value: 1 },
        { label: '无门槛券', value: 2 },
        { label: '折扣券', value: 3 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '发放方式',
    field: 'giveType',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '平台', value: 1 },
        { label: '兑换码', value: 2 },
        { label: '用户奖励', value: 3 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '优惠券状态',
    field: 'status',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '有效', value: 1 },
        { label: '失效', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '基本信息',
  },
  {
    label: '优惠券名称',
    field: 'title',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入优惠券名称!' }];
    },
  },
  {
    label: '优惠券类型',
    field: 'useCatagory',
    component: 'RadioGroup',
    componentProps: () => {
      return {
        options: [
          { label: '满减券', value: 1, key: '1' },
          { label: '无门槛券', value: 2, key: '2' },
          { label: '折扣券', value: 3, key: '3' },
        ],
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择优惠券类型!' }];
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    label: '优惠金额',
    field: 'useLimitAmount',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入优惠金额!' }];
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
    slot: 'customSlot',
    ifShow: ({ values }) => values.useCatagory == 1,
  },
  {
    label: '优惠金额',
    field: 'fullAmount',
    component: 'Input',
    slot: 'customSlot1',
    dynamicRules: () => {
      return [{ required: true, message: '请输入优惠金额!' }];
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
    ifShow: ({ values }) => values.useCatagory == 2,
  },
  {
    label: '优惠折扣',
    field: 'useLimitAmount',
    component: 'Input',
    slot: 'customSlot2',
    componentProps: {
      style: 'width:100%',
      addonAfter: '折',
      type: 'number',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入优惠折扣!' }];
    },
    ifShow: ({ values }) => values.useCatagory == 3,
  },
  {
    label: '使用描述',
    field: 'useDesc',
    component: 'Input',
  },

  {
    label: '使用场景',
    field: 'useScenes',
    // component: 'InputNumber',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全平台', value: 1 },
        { label: '普通课程', value: 2 },
        { label: '直播课', value: 3 },
        { label: '线下课', value: 4 },
        { label: '班级课', value: 5 },
        { label: '会员', value: 6 },
        { label: '电子书', value: 7 },
        { label: '资料库', value: 8 },
      ],
      placeholder: '请选择使用场景',
      dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择使用场景!' }];
    },
  },
  {
    label: '发放方式',
    field: 'giveType',
    component: 'Select',
    componentProps: {
      options: [
        { label: '平台', value: 1 },
        { label: '兑换码', value: 2 },
        { label: '用户奖励', value: 3 },
      ],
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择发放方式!' }];
    },
  },
  {
    field: 'divider-basic',
    component: 'Divider',
    label: '规则配置',
  },
  {
    label: '分配数量',
    field: 'assignAmount',
    component: 'InputNumber',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入分配数量 !' }];
    },
  },
  {
    label: '每人可领',
    field: 'maxReceive',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入每人可领!' }];
    },
  },
  {
    label: '领取截止时间',
    field: 'giveTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择领取截止时间',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择领取截止时间!' }];
    },
  },
  {
    label: '使用截止日期',
    field: 'endTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择使用截止日期',
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择使用截止日期!' }];
    },
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

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

// 使用情况列表数据
export const userRecordColumns: BasicColumn[] = [
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      //
      return h('div', {}, [render.renderImage({ text: record.headImg || '' }), record.nickName]);
    },
  },
  {
    title: '使用状态',
    align: 'center',
    dataIndex: 'useStatus',
    customRender: ({ text }) => {
      console.log('customRender', text);
      let result = '';
      switch (text) {
        case 1:
          result = '已使用';
          break;
        case 2:
          result = '待使用';
          break;
        case 3:
          result = '已过期';
          break;
        default:
          break;
      }
      return result;
    },
  },
  {
    title: '商品名称',
    align: 'center',
    dataIndex: 'spuName',
  },
  {
    title: '优惠金额',
    align: 'center',
    dataIndex: 'couponPrice',
  },
  {
    title: '订单编号',
    align: 'center',
    dataIndex: 'orderNumber',
  },
  {
    title: '领取时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '使用时间',
    align: 'center',
    dataIndex: 'useTime',
  },
];
//查询数据
export const searchForm: FormSchema[] = [
  {
    label: '用户信息',
    field: 'searchParam',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '使用状态',
    field: 'useStatus',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已使用', value: 1 },
        { label: '未使用', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];
// 兑换码列表数据
export const userDayColumns: BasicColumn[] = [
  {
    title: '秘钥',
    align: 'center',
    dataIndex: 'secretKey',
  },
  {
    title: '使用状态',
    align: 'center',
    dataIndex: 'useStatus',
    customRender: ({ text }) => {
      console.log('customRender', text);
      let result = '';
      switch (text) {
        case 0:
          result = '未使用';
          break;
        case 1:
          result = '已使用';
          break;

        default:
          break;
      }
      return result;
    },
  },
  {
    title: '姓名',
    align: 'center',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      //
      return h('div', {}, [render.renderImage({ text: record.headImg || '' }), record.nickName]);
    },
  },
  {
    title: '使用时间',
    align: 'center',
    dataIndex: 'useTime',
  },
];
//表单数据
export const formSchema1: FormSchema[] = [
  {
    label: '开通数量',
    field: 'assignAmount',
    component: 'InputNumber',
    dynamicRules: () => {
      return [{ required: true, message: '请输入开通数量!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
