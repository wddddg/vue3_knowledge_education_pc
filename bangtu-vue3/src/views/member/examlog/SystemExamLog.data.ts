import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
    {
     title: '考试名称',
     align:"center",
     dataIndex: 'examName'
    },
    {
     title: '考试分类',
     align:"center",
     dataIndex: 'cateName'
    },
    {
     title: '题目数量',
     align:"center",
     dataIndex: 'examCount'
    },
    {
     title: '考试时长',
     align:"center",
     dataIndex: 'examTime',
     customRender: ({ text }) => {
         let mint =Math.floor(text/60);
         let second = text%60;
         return mint +"分钟"+second+"秒"
     },
    },
    {
     title: '考试用时',
     align:"center",
     dataIndex: 'useDate',
     customRender: ({ text }) => {
         let mint =Math.floor(text/60);
         let second = text%60;
         return mint +"分钟"+second+"秒"
     },
    },

    {
     title: '总分',
     align:"center",
     dataIndex: 'fractionCount'
    },
    {
     title: '得分',
     align:"center",
     dataIndex: 'examFraction'
    },
    {
     title: '及格状态',
     align:"center",
     dataIndex: 'isPass',
     customRender: ({ text }) => {
       if(text=="1"){
           return "不通过";
       }else{
           return "通过";
       }
     },
    },
    {
     title: '考试时间',
     align:"center",
     dataIndex: 'createTime'
    },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "考试名称",
      field: 'examName',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '成绩(得分)',
    field: 'examFraction',
    component: 'InputNumber',
  },
  {
    label: '总分数（考试总分，缓存字段）',
    field: 'examFractionCount',
    component: 'InputNumber',
  },
  {
    label: '试题名称',
    field: 'examName',
    component: 'Input',
  },
  {
    label: '试题ID',
    field: 'examId',
    component: 'Input',
  },
  {
    label: '是否需要批阅 0、不需要 1、需要',
    field: 'isPy',
    component: 'InputNumber',
  },
  {
    label: '用时秒',
    field: 'useDate',
    component: 'Input',
  },
  {
    label: '是否通过 0、未通过 1、已通过 2、未提交',
    field: 'isPass',
    component: 'InputNumber',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
