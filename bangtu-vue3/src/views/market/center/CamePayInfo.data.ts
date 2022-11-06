import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { InputNumber, Button } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
// import { rules } from '/@/utils/helper/validator';
// import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '分销姓名',
    align: 'center',
    dataIndex: 'userName',
    customRender: ({ record }) => {
      // 
      return h('div', {}, [render.renderImage({ text: record.userHeadImg || '' }), record.userName]);
    },
  },
  {
    title: '上级推广员',
    align: 'center',
    dataIndex: 'superiorName',
    customRender: ({ record }) => {
      // 
      return h('div', {}, [render.renderImage({ text: record.superiorHeadImg || '' }), record.superiorName]);
    },
  },
  {
    title: '申请中提现',
    align: 'center',
    dataIndex: 'applyMoney',
  },
  {
    title: '累计提现',
    align: 'center',
    dataIndex: 'totalMoney',
  },
  {
    title: '佣金总计',
    align: 'center',
    dataIndex: 'totalMaxMoney',
  },
  {
    title: '邀新数量',
    align: 'center',
    dataIndex: 'inviteTotal',
  },
  {
    title: '注册时间',
    align: 'center',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '一级分销员',
    field: 'superiorParam',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名或手机号',
    },
    colProps: { span: 6 },
  },
  {
    label: '二级分销员',
    field: 'userParam',
    component: 'Input',
    componentProps: {
      placeholder: '请输入姓名或手机号',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '卡密名称',
    field: 'title',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入卡密名称!' }];
    },
  },
  {
    label: '建议零售单价',
    field: 'unitPrice',
    component: 'InputNumber',
  },
  {
    label: '卡密数量',
    field: 'totalCount',
    component: 'InputNumber',
  },
  {
    label: '已使用数量',
    field: 'useCount',
    component: 'InputNumber',
  },
  {
    label: '购买分类',
    field: 'category',
    component: 'InputNumber',
  },
  {
    label: '使用时长（天）',
    field: 'termDay',
    component: 'InputNumber',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
  {
    label: '业务名称',
    field: 'businessName',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//提现规则
export const formSchema1: FormSchema[] = [
  {
    label: '最低提现额度',
    field: 'lowAmount',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入最低提现额度!' }];
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
  },
  {
    label: '提现方式',
    field: 'withdrawType',
    component: 'JCheckbox',
    dynamicRules: () => {
      return [{ required: true, message: '请输入最低提现额度!' }];
    },
    componentProps: {
      options: [
        { label: '微信提现', value: '1' },
        { label: '线下打款', value: '2' },
      ],
    },
  },
  {
    label: '分销规则说明',
    field: 'content',
    component: 'JEditor',
    dynamicRules: () => {
      return [{ required: true, message: '请输入分销规则说明!' }];
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

// 使用情况列表数据
export const userRecordColumns: BasicColumn[] = [
  {
    title: '分销姓名',
    align: 'center',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      // 
      return h('div', {}, [render.renderImage({ text: record.headImg || '' }), record.nickName]);
    },
  },
  {
    title: '获取类型',
    align: 'center',
    dataIndex: 'getType',
    customRender: ({ text }) => {
      return text == 1 ? '用户邀请' : '佣金提成';
    },
  },
  {
    title: '购买类型',
    align: 'center',
    dataIndex: 'category',
    customRender: ({ text }) => {
      const keyNameMap = [
        { code: '1', label: '线上课' },
        { code: '2', label: '面授课' },
        { code: '3', label: '直播课' },
        { code: '4', label: '班级课' },
        { code: '5', label: '电子书' },
        { code: '6', label: '考点集' },
        { code: '7', label: '商城' },
        { code: '8', label: '普通会员' },
        { code: '9', label: '畅会员' },
        { code: '10', label: '学币充值' },
      ];
      let result = '';
      for (let i = 0; i < keyNameMap.length; i++) {
        if (keyNameMap[i]['code'] == text) {
          result = keyNameMap[i]['label'];
          break;
        }
      }
      return result;
    },
  },
  {
    title: '奖励类型',
    align: 'center',
    dataIndex: 'rewardType',
    customRender: ({ text }) => {
      return text == 1 ? '现金' : text == 2 ? '积分' : '优惠券';
    },
  },
  {
    title: '佣金总计',
    align: 'center',
    dataIndex: 'amount',
  },
  {
    title: '获取时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

//查询数据
export const searchForm: FormSchema[] = [
  {
    label: '购买类型',
    field: 'category',
    component: 'Select',
    componentProps: {
      options: [
        { value: '1', label: '线上课' },
        { value: '2', label: '面授课' },
        { value: '3', label: '直播课' },
        { value: '4', label: '班级课' },
        { value: '5', label: '电子书' },
        { value: '6', label: '考点集' },
        { value: '7', label: '商城' },
        { value: '8', label: '普通会员' },
        { value: '9', label: '畅会员' },
        { value: '10', label: '学币充值' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '获取类型',
    field: 'getType',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '用户邀请', value: 1 },
        { label: '佣金提成', value: 2 },
      ],
    },
    colProps: { span: 8 },
  },
];

//	佣金升级奖励
export const columnsForm1: BasicColumn[] = function (data) {
  return [
    {
      title: '梯度',
      align: 'center',
      dataIndex: 'sort',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.sort || 0,
          onChange(value) {
            record.sort = value;
          },
        });
      },
    },
    {
      title: '累计佣金(元)',
      align: 'center',
      dataIndex: 'thresholdCount',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.thresholdCount || 0,
          onChange(value) {
            record.thresholdCount = value;
          },
        });
      },
    },
    {
      title: '奖励（元）',
      align: 'center',
      dataIndex: 'rewardCount',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.rewardCount || 0,
          onChange(value) {
            record.rewardCount = value;
          },
        });
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: '',
      customRender: ({ index }) => {
        return h(
          Button,
          {
            type: 'link',
            onClick() {
              data.value.splice(index, 1);
            },
          },
          ['删除']
        );
      },
    },
  ];
};

//海报上传
export const schemas: FormSchema[] = [
  {
    label: '海报图片',
    field: 'coverImg',
    component: 'JImageUpload',
    // componentProps: {
    //   fileMax: 1,
    // },
    rules: [
      {
        required: false,
        message: '请上传海报图片',
      },
    ],
  },
];
