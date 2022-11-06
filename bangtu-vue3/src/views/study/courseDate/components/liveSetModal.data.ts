import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';


//表单数据
export const liveformSchema: FormSchema[] = [
  {
    label: '推流地址',
    field: 'weight',
    component: 'InputTextArea',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];


