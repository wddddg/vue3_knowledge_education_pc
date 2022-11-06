import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '文档类型',
    align:"center",
    width:150,
    dataIndex: 'type_dictText'
   },
   {
    title: '文档内容',
    align:"center",
    width:1000,
    dataIndex: 'content',
    slots:{ customRender: 'htmlSlot'},
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "文档类型",
      field: 'type',
      component: 'JSearchSelect',
      componentProps: {
        dict:"tpe_content"
      },
      colProps: {span: 6},
   },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
      label: "文档类型",
      field: 'type',
      component: 'JSearchSelect',
      required:true,
      componentProps: {
        dict:"tpe_content"
      },
      // colProps: {span: 6},
   },
  {
    label: '文档内容',
    field: 'content',
    required:true,
    component: 'JEditor',
    // render: render.renderTinymce,
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
