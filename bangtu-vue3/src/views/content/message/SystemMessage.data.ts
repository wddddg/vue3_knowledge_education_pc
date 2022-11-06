import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Switch,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './SystemMessage.api';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '标题',
    align:"center",
    dataIndex: 'title'
   },
   {
    title: '消息内容',
    align:"center",
    dataIndex: 'tempMessage',
    slots:{ customRender: 'htmlSlot'},
   },
   {
    title: '消息类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
  //  {
  //   title: '推送时间',
  //   align:"center",
  //   dataIndex: 'sendTime'
  //  },
   {
    title: '是否推送APP',
    align:"center",
    dataIndex: 'isSend_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "消息类型",
      field: 'type',
      component: 'JSearchSelect',
      componentProps: {
        dict:"message_type"
      },
      colProps: {span: 6},
   },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入标题!'},
          ];
     },
  },
  {
    label: '消息内容',
    field: 'message',
    component: 'JEditor',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入消息内容!'},
          ];
     },
    //  render: render.renderTinymce,
  },
  {
    label: '消息类型',
    field: 'type',
    component: 'JSearchSelect',
    required:true,
    componentProps: {
      dict:"message_type"
    },
  },
  // {
  //   label: '推送时间',
  //   field: 'sendTime',
  //   component: 'Input',
  // },
  {
    label: '是否推送APP',
    field: 'isSend',
    component: 'Switch',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入是否推送APP!'},
          ];
     },
     componentProps:function({formModel}) {
       formModel.isSend = 0
       return{
         checkedValue:1,
         unCheckedValue:0,
         checked:1,
         checkedChildren: '是',
         unCheckedChildren: '否',
       }
     },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
