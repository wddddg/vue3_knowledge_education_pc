import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import { rules } from '/@/utils/helper/validator';
// import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { render } from '/@/utils/common/renderUtils';
import { Checkbox, InputNumber } from 'ant-design-vue';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '卡密名称',
    align: 'center',
    dataIndex: 'title',
  },
  {
    title: '卡密单价（元）',
    align: 'center',
    dataIndex: 'unitPrice',
    customRender: ({ text }) => {
      return h('div',{style:'color:red'},'￥'+text);
    },
  },
  {
    title: '未使用/全部',
    align: 'center',
    dataIndex: 'totalCount',
    customRender: ({ record }) => {
      return `${record.total || 0} / ${record.totalCount || 0}`;
    },
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'category',
    customRender: ({ text }) => {
      return textLabel(text);
    },
  },
  {
    title: '使用时长（天）',
    align: 'center',
    dataIndex: 'termDay',
    customRender: ({ record, text }) => {
      if (record.isPermanent) {
        return render.renderTag('永久有效', 'cyan');
      } else {
        return render.renderTag(text+'个月', 'blue');
      }

    },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '发布时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];
const textLabel = (txt) => {
  if (txt == 1) {
    return '线上课';
  } else if (txt == 2) {
    return '面授课';
  } else if (txt == 3) {
    return '直播课';
  } else if (txt == 4) {
    return '班级课';
  } else if (txt == 5) {
    return '电子书';
  } else if (txt == 6) {
    return '考点集';
  } else if (txt == 7) {
    return '商城';
  } else if (txt == 8) {
    return '畅会员';
  } else if (txt == 9) {
    return '超级会员';
  } else {
    return '学币充值';
  }
};
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '卡密名称',
    field: 'title',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '卡密分类',
    field: 'category',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '线上课', value: 1 },
        { label: '面授课', value: 2 },
        { label: '直播课', value: 3 },
        { label: '班级课', value: 4 },
        { label: '电子书', value: 5 },
        { label: '考点集', value: 6 },
        { label: '商城', value: 7 },
        { label: '畅会员', value: 8 },
        { label: '超级会员', value: 9 },
        { label: '学币充值', value: 10 },
      ],
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
    label: '卡密分类',
    field: 'category',
    component: 'RadioGroup',
    defaultValue: 1,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '畅会员', value: 8, key: '8' },
          { label: '超级会员', value: 9, key: '9' },
          { label: '商品', value: 7, key: '7' },
        ],
        onChange: () => {
          formModel.category == 7 && (formModel.list = []);
        },
      };
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择卡密名称!' }];
    },
  },
  {
    label: '选取内容',
    field: 'businessName',
    required: false,
    component: 'JSelectRelBiz',
    componentProps: ({ formModel }) => {
      return {
        "v-model": formModel['businessName'],
        value: formModel['businessName'],
        onSelectedClassifyRows(value) {
          formModel['businessId'] = value[0].businessId || value[0].id || ''
          formModel['businessName'] = value[0].businessName
          formModel['onclickType'] = value[0].onclickType
        },
        availableTabs: ['exam-tab','course-tab','book-tab']
      }
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: () => {
      return [{ required: true, message: '请选择卡密名称!' }];
    },
    ifShow: ({ values }) => values.category == 7,
  },
  {
    label: '',
    field: 'businessId',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'onclickType',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'businessName',
    component: 'Input',
    show: false
  },
  {
    label: '使用时长',
    field: 'termDay',
    component: 'InputNumber',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    // dynamicRules: () => {
    //   return [{ required: true, message: '请输入使用时长!' }];
    // },
    required: true,
    defaultValue: 0,
    render: ({ field, model, values }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(InputNumber, {
          value: model[field],
          onChange(value) {
            model[field] = value;
          },
          disabled: model['isPermanent'] == 1,
        }),
        h(
          Checkbox,
          {
            checked: model['isPermanent'],
            style: { margin: '0px 0px 0px 20px', width: '100px' },
            onChange(value) {
              model['isPermanent'] = value.target.checked ? 1 : 0;
            },
          },
          ['永久']
        ),
      ]);
    },
  },
  {
    label: '',
    field: 'isPermanent',
    component: 'Input',
    defaultValue: 0,
    show: false,
  },
  {
    label: '开通数量',
    field: 'totalCount',
    component: 'InputNumber',
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    dynamicRules: () => {
      return [{ required: true, message: '请输入开通数量!' }];
    },
  },
  {
    label: '建议零售价',
    field: 'unitPrice',
    component: 'Input',
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
  },
  {
    label: '卡密备注',
    field: 'remark',
    component: 'InputTextArea',
  },

  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
// 评论数据
export const commentColumns: BasicColumn[] = [
  {
    title: '账号',
    align: 'center',
    dataIndex: 'accountNumber',
  },
  {
    title: '秘钥',
    align: 'center',
    dataIndex: 'accountPassword',
  },
  {
    title: '使用状态',
    align: 'center',
    dataIndex: 'isUse',
    customRender: ({ text }) => {
      return `${text == 1 ? '已' : '未'}使用`;
    },
  },
  {
    title: '用户信息',
    align: 'center',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      //
      return record.nickName ? h('div', {}, [render.renderImage({ text: record.headImg || '' }), record.nickName]) : '';
    },
  },
  {
    title: '使用时间',
    align: 'center',
    dataIndex: 'useTime',
  },
];
//查询数据
export const searchSchema: FormSchema[] = [
  {
    label: '内容',
    field: 'searchParam',
    component: 'Input',
    componentProps: {
      placeholder: '请输入秘钥/手机号/学员姓名',
    },
    colProps: { span: 6 },
  },
  {
    label: '使用状态',
    field: 'isUse',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已使用', value: 1 },
        { label: '未使用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
];
