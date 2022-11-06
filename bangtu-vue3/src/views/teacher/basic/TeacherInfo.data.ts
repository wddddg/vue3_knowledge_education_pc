import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
// import { loadTreeRoot } from './TeacherInfo.api';
import { h } from 'vue';
import { Input, Switch } from 'ant-design-vue';
import { updateStatus } from './TeacherInfo.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { rules } from '/@/utils/helper/validator';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '讲师名称',
    align: 'left',
    dataIndex: 'name',
    customRender: ({ record }) => {
      return h('div', { style: { display: 'flex', 'align-items': 'center' } }, [
        h(render.renderImage({ text: record.headImg }), {}),
        h(
          'div',
          {
            style: { display: 'flex', 'flex-direction': 'column' },
          },
          [record.name]
        ),
      ]);
    },
  },
  {
    title: '教学科目',
    align: 'center',
    dataIndex: 'subjectName',
    customRender: ({ text }) => {
      return render.renderTag(text, 'cyan');
    },
  },

  {
    title: '联系方式',
    align: 'center',
    dataIndex: 'cellphone',
  },
  {
    title: '账号',
    align: 'center',
    dataIndex: 'loginName',
    customRender: ({ text }) => {
      return render.renderTag(text, 'blue');
    },
  },
  {
    // ：1、启用 0、停用
    title: '状态',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isEnable')) {
        record.status = false;
      }
      return h(Switch, {
        checked: record.isEnable === 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isEnable = newStatus;
          updateStatus(data)
            .then(() => {
              record.isEnable = newStatus;
              //createMessage.success(`已成功修改会员状态`);
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    // ：1、待审批 2、已通过 3、已拒绝'
    title: '审批状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      if (text == 1) {
        return '待审批';
      } else if (text == 2) {
        return '已通过';
      } else {
        return '已拒绝';
      }
    },
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

//查询数据
export const searchFormSchema: FormSchema[] = [
  // {
  //   label: '状态',
  //   field: 'status',
  //   component: 'RadioButtonGroup',
  //   defaultValue: '0',
  //   componentProps: {
  //     options: [
  //       { label: '全部', value: '0' },
  //       { label: '待审批', value: '1' },
  //       { label: '已通过', value: '2' },
  //       { label: '已拒绝', value: '3' },
  //     ],
  //   },
  //   colProps: { span: 4 },
  // },
  {
    label: '讲师名称',
    field: 'name',
    component: 'Input',
    componentProps: {
      placeholder: '请输入讲师名称查询',
    },
    colProps: { span: 4 },
  },
];

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
    label: '讲师名字',
    field: 'name',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '教学科目',
    field: 'subjectName',
    required: true,
    component: 'Input',
    colProps: { span: 12 },
  },

  // {
  //   label: '讲师分类',
  //   field: 'categoryType',
  //   required: true,
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: loadTreeRoot,
  //     mode: 'tags',
  //     labelField: 'title',
  //     valueField: 'key',
  //   },
  //   colProps: { span: 12 },
  // },

  {
    label: '分类',
    field: 'categoryType',
    required: true,
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '讲师', value: 1 },
        { label: '机构', value: 2 },
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
    label: '聘用形式',
    field: 'employType',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '外聘', value: 1 },
        { label: '自营', value: 2 },
      ],
    },
    colProps: { span: 12 },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
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
export const formSchema2: FormSchema[] = function (showType) {
  return [
    {
      label: '联系电话',
      field: 'cellphone',
      component: 'Input',
      colProps: { span: 12 },
      dynamicRules: ({ model, schema }) => {
        if (showType.value == '详情') return [];
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
        if (showType.value == '详情') return [];
        return [{ ...rules.email(true)[0] }];
      },
    },
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
};

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
    component: 'Input',
  },
  {
    label: '宣传图',
    field: 'publicImg',
    required: true,
    component: 'JMsUpload',
    itemProps: {
      extra: '背景图将会展示给用户',
    },
  },

  {
    label: '详细介绍',
    field: 'content',
    required: true,
    component: 'Input',
    slot: 'editContent',
  },
];

//抽屉配置
// export const formSchema5: FormSchema[] = [
//   {
//     label: '摘要',
//     field: 'summary',
//     required: true,
//     component: 'Input',
//   },
// ];

// 账号管理
export const formAccountSchema: FormSchema[] = function (data) {
  return [
    {
      label: 'id',
      field: 'id',
      required: true,
      component: 'Input',
      show: false,
    },
    {
      label: '登录账号',
      field: 'loginName',
      required: true,
      component: 'Input',
      render: ({ model, field }) => {
        if (data.value) {
          return h(Input, { value: model[field], disabled: true });
        } else {
          return h(Input, {
            value: model[field],
            onChange(value) {
              model[field] = value.target.value;
            },
          });
        }
      },
    },
    {
      label: '登录密码',
      field: 'password',
      required: true,
      component: 'Input',
      componentProps: {
        type: 'password',
      },
    },

    {
      label: '确认密码',
      field: 'password1',
      component: 'Input',
      dynamicRules({ model }) {
        return [
          {
            required: true,
            validator: async (rule, value) => {
              if (model?.password != value) {
                return Promise.reject('两次密码不一致');
              }
              return Promise.resolve();
            },
            trigger: 'change',
          },
        ];
      },
      componentProps: {
        type: 'password',
      },
    },
  ];
};
