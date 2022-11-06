import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import component from '/@/locales/lang/en/component';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '题目名称',
    align:"center",
    dataIndex: 'questionsName',
    slots:{customRender:'htmlSlot'}
   },
   {
    title: '所属分类',
    align:"center",
    dataIndex: 'cateName'
   },
   {
    title: '提交用户',
    align:"center",
    dataIndex: 'memberName'
   },
   {
    title: '提交时间',
    align:"center",
    dataIndex: 'createTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
     {
       label: "行业分类",
       field: '',
       component: 'JMsTreeSelect',
       componentProps: ({formActionType,formModel}) => {
         return {
           onChange:function(e){
            debugger
             console.log(e,'e')
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
      label: "用户昵称",
      field: 'memberName',
      component: 'Input',
      componentProps: {
      },
      colProps: {span: 6},
 	},
   {
       label: "题目",
       field: 'questionsName',
       component: 'Input',
       componentProps: {
       },
       colProps: {span: 6},
    },
    //影响行业类别报错
  { 
      label: "创建时间",
      field: '',
      component: 'RangePicker',
      componentProps:({formModel})=> {
        return {
          format: 'YYYY-MM-DD',
          onChange:function (e,value){
            
            value[0]? formModel.startTime =  value[0] + ' 00:00:00':formModel.startTime = ''
            value[1]? formModel.endTime =  value[1] + ' 23:59:59':formModel.endTime = ''
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
      label: "",
      field: 'startTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'endTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '题目名称',
    field: 'questionsName',
    component: 'Input',
    componentProps:{
      disabled:false
    }
  },
  {
    label: '错误描述',
    field: 'errorDescript',
    component: 'InputTextArea',
    componentProps:{
      disabled:false
    }
  },
  {
    label: '错误图片',
    field: 'errorImg',
    component: 'JMsUpload',
    componentProps:{
      disabled:false
    }
  },
  {
    label: '题目ID',
    field: 'questionsId',
    component: 'Input',
    componentProps:{
      disabled:false
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入题目ID!'},
          ];
     },
  },
  {
    label: '所属分类',
    field: 'cateName',
    component: 'Input',
    componentProps:{
      disabled:false
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入分类ID!'},
          ];
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
