import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Switch,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './SystemExamToday.api';
import { useMessage } from '/@/hooks/web/useMessage';
//列表数据
export const columns: BasicColumn[] = [
  {
    title:'练习开始日期',
    align:"center",
    dataIndex: 'practiceDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
  },
  {
    title:'练习结束日期',
    align:"center",
    dataIndex: 'practiceDateEnd',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
  },
  {
    title:'行业分类',
    align:"center",
    dataIndex: 'cateId_dictText'
  },
  {
    title:'题目数量',
    align:"center",
    dataIndex: 'questinCount'
  },
  {
    title:'名称',
    align:"center",
    dataIndex: 'name'
  },
  {
    title:'备注',
    align:"center",
    dataIndex: 'descript'
  },
  {
   title: '状态',
   align:"center",
   dataIndex: 'status',
   customRender:({record}) => {
      return  h(Switch,{
       checked: record.status == 1,
       checkedChildren: '停用',
       unCheckedChildren: '启用',
       loading: record.pendingStatus,
       onClick(checked:boolean){
         record.pendingStatus = true;
         let newStatus = checked?1:0;
         const { createMessage } = useMessage();
         let data = cloneDeep(record);
         data.status = newStatus;
         saveOrUpdate(data,true).then(res =>{
           record.status = newStatus;
         }).catch(() => {
           createMessage.error('修改状态失败');
         }).finally(() => {
           record.pendingStatus = false;
         });
       }
      })
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "练习日期",
      field: 'practiceDate',
      component: 'DatePicker',
      componentProps: {
      },
      colProps: {span: 6},
 	},
   {
       label: "行业分类",
       field: '',
       component: 'JMsTreeSelect',
       componentProps: ({formActionType,formModel}) => {
         return {
           onChange:function(e){
             console.log(formModel,e)
             formModel.oneCateId = e.oneCateId //e.oneCateId
             formModel.twoCateId = e.twoCateId
             formModel.threeCateId = e.threeCateId
             formModel.cateId = e.selectCateId
           }
         }
       },
       colProps: {span: 6},
    },
   {
       label: "名称",
       field: 'name',
       component: 'Input',
       componentProps: {
       },
       colProps: {span: 6},
    },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'cateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'threeCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '练习开始日期',
    field: 'practiceDate',
    component: 'DatePicker',
    componentProps:{
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    }
  },
  {
    label: '练习结束日期',
    field: 'practiceDateEnd',
    component: 'DatePicker',
    componentProps:{
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    }
  },
  {
    label: "行业分类ID",
    field: 'cateName',
    component: 'JMsTreeSelect',
    required:true,
    componentProps: ({formActionType,formModel}) => {
      return {
        dropdownStyle:{height:'200px'},
        onChange:function(e){
          console.log(formModel,e)
          formModel.oneCateId = e.oneCateId //e.oneCateId
          formModel.twoCateId = e.twoCateId
          formModel.threeCateId = e.threeCateId
          formModel.cateId = e.selectCateId
        }
      }
    },
 },
 {
   label: "",
   field: 'threeCateId',
   show:false,
   component: 'Input',
   colProps: {span: 6},
 },
  {
    label: "",
    field: 'oneCateId',
    show:false,
    component: 'Input',
    colProps: {span: 6},
  },
  {
    label: "",
    field: 'twoCateId',
    show:false,
    component: 'Input',
    colProps: {span: 6},
  },
  {
    label: "",
    field: 'cateId',
    show:false,
    component: 'Input',
    colProps: {span: 6},
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '题目数量',
    field: 'questinCount',
    component: 'InputNumber',
  },
  {
    label: '备注',
    field: 'descript',
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
