import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue'
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '用户信息',
    align: "left",
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      if (record.headImg) {
        return h('div', {}, [render.renderImage({ text:record.headImg || '' }), record.nickName])
      } else {
        return h('div', {}, [render.renderImage({ text:record.headImg || '' }), record.nickName])
      }
    },
  },
  {
    title: '收货地址',
    align: "left",
    dataIndex: 'receivedName',
    // slots: { customRender: 'receiveName' },
    // slots: 'receiveName',
    customRender: ({ record }) => {
      let text1 = h('div', {}, "姓名：" + record.receivedName);
      let text2 = h('div', {}, "手机号：" + record.receivedPhone);
      let text3 = h('div', {}, "地址：" + record.addressDetails);
      return [text1, text2, text3];
    },
  },
  {
    title: '创建时间',
    align: "center",
    dataIndex: 'createTime'
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "用户信息",
    field: 'searchParam',
    component: 'Input',
    componentProps: {
      "placeholder": '请输入姓名/手机号'
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '用户id',
    field: 'userId',
    icon: '',
    customRender: ({ record }) => {
      // 
      return h('div', {}, [render.renderImage({ text:record.imgUrl || '' }), record.name])
    },
  },
  {
    label: '收货姓名',
    field: 'receivedName',
    component: 'Input',
  },
  {
    label: '详细地址',
    field: 'createTime',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];
