import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '图片名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '编码',
    align:"center",
    dataIndex: 'code'
   },
   {
    title: '图片类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '跳转路径',
    align:"center",
    dataIndex: 'href'
   },
   {
    title: '图片地址',
    align:"center",
    dataIndex: 'url'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "图片名称",
      field: 'name',
      component: 'Input',
      // componentProps: {
      //   dict:"img_type"
      // },
      colProps: {span: 6},
   },
  {
      label: "图片类型",
      field: 'type',
      component: 'JSearchSelect',
      componentProps: {
        dict:"img_type"
      },
      colProps: {span: 6},
   },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '图片名称',
    field: 'name',
    required:true,
    component: 'Input',
  },
  {
    label: '编码',
    field: 'code',
    required:true,
    component: 'Input',
  },
  {
      label: "图片类型",
      field: 'type',
      required:true,
      component: 'JSearchSelect',
      componentProps: {
        dict:"img_type"
      },
      // colProps: {span: 6},
   },
  {
    label: '跳转路径',
    field: 'href',
    component: 'Input',
  },
  {
    label: '排序',
    field: 'sort',
    required:true,
    component: 'InputNumber',
  },
  {
    label: '图片',
    field: 'url',
    required:true,
    component: 'JMsUpload',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
