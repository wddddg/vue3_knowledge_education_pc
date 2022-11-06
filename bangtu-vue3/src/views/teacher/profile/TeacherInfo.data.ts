import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';

//表单数据（基本信息）
export const formSchema1: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '讲师名称',
    field: 'name',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '擅长科目',
    field: 'subjectName',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
      ],
    },
    colProps: { span: 12 },
  },
  {
    label: '身份证号',
    field: 'idCard',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '头像',
    field: 'headImg',
    component: 'JMsUpload',
    componentProps: {},
    colProps: { span: 12 },
  },
  {
    label: '年龄',
    field: 'age',
    component: 'InputNumber',
    colProps: { span: 12 },
  },

  {
    label: '地区',
    field: 'province',
    component: 'Select',
    slot: 'selectProvince',
    colProps: { span: 12 },
  },
  {
    label: '市',
    field: 'city',
    component: 'Select',
    show: false,
  },
  {
    label: '区',
    field: 'county',
    component: 'Select',
    show: false,
  },
];

//表单数据（联系信息）
export const formSchema2: FormSchema[] = [
  {
    label: '微信账号',
    field: 'wechatNum',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: 'QQ账号',
    field: 'qqNum',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '在线咨询',
    field: 'onlineUrl',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '联系电话',
    field: 'cellphone',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ ...rules.phone(true)[0] }];
    },
  },
  {
    label: '邮箱',
    field: 'email',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ ...rules.email(true)[0] }];
    },
  },
  {
    label: '微信二维码',
    field: 'wechatUrl',
    component: 'JMsUpload',
    colProps: { span: 12 },
  },
  {
    label: '企业微信二维码',
    field: 'wechatEnterpriseUrl',
    component: 'JMsUpload',
    colProps: { span: 12 },
  },
];

//表单数据（收款信息）
export const formSchema3: FormSchema[] = [
  {
    label: '银行账号',
    field: 'account',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '银行名称',
    field: 'bankName',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },

  {
    label: '开户行',
    field: 'openBank',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '所属省份',
    field: 'bankProvince',
    required: true,
    component: 'Select',
    slot: 'selectBankProvince',
    colProps: { span: 12 },
  },

  {
    label: '支付宝收款号',
    field: 'alipayNumber',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '真实姓名',
    field: 'receiptsName',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
];

//表单数据（自我介绍）
export const formSchema4: FormSchema[] = [
  {
    label: '摘要',
    field: 'summary',
    required: true,
    component: 'InputTextArea',
  },
  {
    label: '宣传图',
    field: 'publicImg',
    required: true,
    component: 'JMsUpload',
  },

  {
    label: '详细介绍',
    field: 'content',
    required: true,
    component: 'Input',
    slot: 'editContent',
  },
];

// 账号管理
export const formAccountSchema: FormSchema[] = [
  {
    label: '登录账号',
    field: 'summary',
    required: true,
    component: 'Input',
  },
  {
    label: '登录密码',
    field: 'publicImg',
    required: true,
    component: 'Input',
    componentProps: {
      type: 'password',
    },
  },

  {
    label: '确认密码',
    field: 'content',
    required: true,
    component: 'Input',
    componentProps: {
      type: 'password',
    },
  },
];
