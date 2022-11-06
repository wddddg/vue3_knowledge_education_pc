import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue'
import { FormSchema } from '/@/components/Table';
export const columns = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    width: 100,
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  },
];
/**
 * 角色用户Columns
 */
export const userColumns = [
  {
    title: '学员信息',
    dataIndex: 'nickName',
    align:"left",
    customRender:({record}) => {
      return h('div',{},[render.renderImage({ text:record.headImg || '' }),record.nickName])
    },
  },
  {
    title: '已学时长',
    dataIndex: 'studyDuration',
    align:"center",
  },
  {
    title: '学习类型',
    dataIndex: 'lookType',
    align:"center",
    customRender:({record}) => {
       return record.lookType==1?'已购买':'试看'
     },
  },
  {
    title: '学习状态',
    dataIndex: 'isFinish',
    align:"center",
    customRender:({record}) => {
       return record.isFinish==1?'已完成':'未完成'
     },
  },
  {
    title: '最后学习时间',
    dataIndex: 'updateTime',
    align:"center",
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
/**
 * 角色用户搜索form
 */
export const searchUserFormSchema: FormSchema[] = [
  {
    field: 'searchParam',
    label: '搜索内容',
    component: 'Input',
    componentProps: {
      "placeholder": '请输入姓名/手机号'
    },
    colProps: { span: 6 },
  },
  {
    field: 'isFinish',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '启用',
          value: 1,
        },
        {
          label: '停用',
          value: 0,
        }
      ],
    },
    colProps: { span: 6 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '',
    component: 'Input',
    show: false,
  },
  {
    field: 'roleName',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    label: '备注',
    field: 'description',
    component: 'InputTextArea',
  },
];

export const formDescSchema = [
  {
    field: 'roleName',
    label: '角色名称',
  },
  {
    field: 'roleCode',
    label: '角色编码',
  },
  {
    label: '备注',
    field: 'description',
  },
];

export const roleIndexFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '',
    component: 'Input',
    show: false,
  },
  {
    label: '角色编码',
    field: 'roleCode',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '首页路由',
    field: 'url',
    component: 'Input',
    required: true,
  },
  {
    label: '优先级',
    field: 'priority',
    component: 'InputNumber',
  },
  {
    label: '是否开启',
    field: 'status',
    component: 'JSwitch',
    componentProps: {
      options: ['1', '0'],
    },
  },
];

export const getData = (() => {
  let dottedBase = +new Date();
  const barDataSource: any[] = [];
  const barMultiData: any[] = [];
  const barLineData: any[] = [];

  for (let i = 0; i < 20; i++) {
    let obj = { name: '', value: 0 };
    const date = new Date((dottedBase += 1000 * 3600 * 24));
    obj.name = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
    obj.value = Math.random() * 200;
    barDataSource.push(obj);
  }

  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 20; i++) {
      let obj = { name: '', value: 0, type: 2010 + j + '' };
      const date = new Date(dottedBase + 1000 * 3600 * 24 * i);
      obj.name = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
      obj.value = Math.random() * 200;
      barMultiData.push(obj);
    }
  }
  const pieData = [
    { value: 335, name: '客服电话' },
    { value: 310, name: '奥迪官网' },
    { value: 234, name: '媒体曝光' },
    { value: 135, name: '质检总局' },
    { value: 105, name: '其他' },
  ];
  const radarData = [
    { value: 75, name: '政治', type: '文综', max: 100 },
    { value: 65, name: '历史', type: '文综', max: 100 },
    { value: 55, name: '地理', type: '文综', max: 100 },
    { value: 74, name: '化学', type: '文综', max: 100 },
    { value: 38, name: '物理', type: '文综', max: 100 },
    { value: 88, name: '生物', type: '文综', max: 100 },
  ];
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 15; i++) {
      let obj = { name: '', value: 0, type: 2010 + j + '', seriesType: j >= 1 ? 'line' : 'bar' };
      const date = new Date(dottedBase + 1000 * 3600 * 24 * i);
      obj.name = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
      obj.value = Math.random() * 200;
      barLineData.push(obj);
    }
  }
  return { barDataSource, barMultiData, pieData, barLineData, radarData };
})();