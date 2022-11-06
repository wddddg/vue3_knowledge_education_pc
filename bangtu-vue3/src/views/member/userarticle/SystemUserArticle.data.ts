import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
    {
     title: '文章类型',
     align:"center",
     dataIndex: 'newsType',
     customRender: ({ text }) => {
         if(text=="1"){
             return "图文"
         }else{
             return "视频"
         }
     },
    },
    {
     title: '文章分类',
     align:"center",
     dataIndex: 'category',
     customRender: ({ text }) => {
        //  const keyNameMap = [
        //      { code:1, label:'答疑文章'},
        //      { code:2, label:'广场文章'},
        //      { code:3, label:'资讯文章'},
        //  ]
        //  let result = "";
        //  for(let i = 0;i<keyNameMap.length;i++){
        //      if(keyNameMap['code']==text){
        //          result = keyNameMap['label'];
        //          break;
        //      }
        //  }
        //  return  result;
        return text === 1? '答疑文章' : text === 2? '广场文章' : '资讯文章'
     },
    },
    {
     title: '审核状态',
     align:"center",
     dataIndex: 'applyStatus',
     customRender: ({ text }) => {
         if(text=="1"){
             return "已通过"
         }else if(text=="1"){
             return "待审批"
         }else if(text=="2"){
             return "已拒绝"
         }
     },
    },
    {
     title: '点赞数量',
     align:"center",
     dataIndex: 'likeCount'
    },
    // {
    //  title: '评论数量',
    //  align:"center",
    //  dataIndex: 'examCount'
    // },
    {
     title: '审核时间',
     align:"center",
     dataIndex: 'applyTime'
    },
    {
     title: '发布时间',
     align:"center",
     dataIndex: 'createTime'
    },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "文章名称",
      field: 'searchParam',
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
