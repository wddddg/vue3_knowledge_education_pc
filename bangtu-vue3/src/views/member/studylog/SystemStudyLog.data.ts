import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
//列表数据
export const columns: BasicColumn[] = [
    {
     title: '封面',
     align:"center",
     dataIndex: 'headImg',
     customRender:({ text }) =>{
        return h('img',{ src:text,style:{ width:'120px',margin:'auto',height:'80px' } })
      }
    },
    {
     title: '课程名称',
     align:"center",
     dataIndex: 'courseName'
    },
    {
     title: '课程类型',
     align:"center",
     dataIndex: 'courseType',
     customRender: ({ text }) => {
         const keyNameMap = [
             { code:"1", label:'线上课'},
             { code:"2", label:'直播课'},
             { code:"3", label:'面授课'},
             { code:"4", label:'班级课'},
         ]
         let result = "";
         for(let i = 0;i<keyNameMap.length;i++){
             if(keyNameMap[i]['code']==text){
                 result = keyNameMap[i]['label'];
                 break;
             }
         }
         return  result;
     },
    },
    {
     title: '收费类型',
     align:"center",
     dataIndex: 'costType',
     customRender: ({ text }) => {
         const keyNameMap = [
             { code:"1", label:'免费'},
             { code:"2", label:'限时免费'},
             { code:"3", label:'会员免费'},
             { code:"4", label:'全部收费'},
         ]
         let result = "";
         for(let i = 0;i<keyNameMap.length;i++){
             if(keyNameMap[i]['code']==text){
                 result = keyNameMap[i]['label'];
                 break;
             }
         }
         return  result;
     },
    },
    {
     title: '课程分类',
     align:"center",
     dataIndex: 'oneCateName',
     customRender: ({ text,record }) => {
           if(text){
               return text+record['twoCateName']+record['threeCateName']
           }else{
               return "";
           }

     },
    },

    {
     title: '所属讲师',
     align:"center",
     dataIndex: 'teacherName'
    },
    {
     title: '总时长',
     align:"center",
     dataIndex: 'totalDuration',
     customRender: ({ text }) => {
         let mint =Math.floor(text/60);
         let second = text%60;
         return mint +"分钟"+second+"秒"
     },
    },
    {
     title: '已学时长',
     align:"center",
     dataIndex: 'studyDuration',
     customRender: ({ text }) => {
         let mint =Math.floor(text/60);
         let second = text%60;
         return mint +"分钟"+second+"秒"
     },
    },
    {
     title: '开始学习时间',
     align:"center",
     dataIndex: 'createTime'
    },
    {
     title: '最后学习时间',
     align:"center",
     dataIndex: 'updateTime'
    },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "课程名称",
      field: 'courseName',
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
