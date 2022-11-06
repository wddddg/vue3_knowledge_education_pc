import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { updateData } from './SystemMember.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { getDictItems } from '/@/api/common/api';

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '昵称',
    align: 'left',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      return h('div', { style:{ display:'flex',"align-items": "center" } }, [
        h(render.renderImage({ text:record.headImg || '' }),{  })
        , h('div',{ style:{ display:'flex',"flex-direction": "column" }
      },[
        h('div',{ style:{ "margin-bottom":'5px' } },[record.nickName]),
        h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
           '电话:',record.phone
        ])
      ])]);
    },
  },
  {
    title: '真实姓名',
    align: 'center',
    dataIndex: 'realName',
  },
  // {
  //   title: '手机号',
  //   align: 'center',
  //   dataIndex: 'phone',
  // },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'sex',
    customRender: ({ text }) => {
      return render.renderDict(text, 'sex');
    },
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false;
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '启用',
        unCheckedChildren: '停用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.status = newStatus;
          updateData(data)
            .then(() => {
              record.status = newStatus;
              //createMessage.success(`已成功修改会员状态`);
            })
            .catch(() => {
              createMessage.error('修改会员状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '最后登录时间',
    align: 'center',
    dataIndex: 'lastTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '关键词',
    field: 'searchParam',
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号/昵称',
    },
    colProps: { span: 6 },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'ApiSelect',
    componentProps: {
      api: getDictItems,
      params: 'sex',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'phone',
    component: 'ApiSelect',
    componentProps: {
      api: getDictItems,
      params: 'status',
    },
    colProps: { span: 6 },
  },
];

const itemProp = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
//表单数据
export const getFormSchema: FormSchema[] = function (provinceOptions, cityOptions, areaOptions) {

  return [
    {
      label: '昵称',
      field: 'nickName',
      component: 'Input',
      disabledLabelWidth: true,
      itemProps: itemProp,
      dynamicRules: ({ model, schema }) => {
        return [{ required: true, message: '请输入昵称!' }];
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '真实姓名',
      field: 'realName',
      component: 'Input',
      disabledLabelWidth: true,
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
    },
    {
      label: '电话',
      field: 'phone',
      component: 'Input',
      disabledLabelWidth: true,
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
      dynamicRules: ({ model, schema }) => {
        return [{ ...rules.phone(true)[0] }];
      },
    },
    {
      label: '性别',
      field: 'sex',
      disabledLabelWidth: true,
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
      componentProps: {
        dictCode: 'sex',
        placeholder: '请选择性别',
        stringToNumber: true,
      },
      component: 'JDictSelectTag',
    },
    {
      label: '头像',
      field: 'headImg',
      component: 'JMsUpload',
      componentProps: {},
    },
    {
      label: '省选择',
      field: 'province',
      component: 'Select',
      slot: 'selectProvince',
      componentProps: {
        placeholder:'请选择省份'
        //   options: provinceOptions,
        //  onChange: (e) => {
        //
        //    console.log(e);

        //  },
       },
      itemProps: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
      colProps: {
        span: 8,
      },
      // component: 'JAreaLinkage',
      // component: 'Select',
      //  slot: 'jAreaLinkage',
      // defaultValue: ['130000', '130200'],
    },
    {
      label: '市',
      field: 'city',
      component: 'Select',
      slot: 'selectCity',
      componentProps: {
        placeholder:'请选择城市'
       },
      itemProps: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: '区',
      field: 'area',
      component: 'Select',
      slot: 'selectArea',
      componentProps: {
        placeholder:'请选择地区'
       },
      itemProps: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      label: '详细地址',
      field: 'address',
      component: 'Input',
    },
    {
      label: '个性签名',
      field: 'signDesc',
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
};
