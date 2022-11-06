import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
    {
     title: '获取渠道',
     align:"center",
     dataIndex: 'giveWayStr',
     // customRender: ({ text }) => {
     //     const keyNameMap = [
     //         { code:"1", label:'新用户赠送'},
     //         { code:"2", label:'分销赠送'},
     //         { code:"3", label:'签到赠送'},
     //         { code:"4", label:'签到额外赠送'},
     //         { code:"5", label:'发布文章'},
     //         { code:"6", label:'发布评论'},
     //         { code:"7", label:'观看视频'},
     //         { code:"8", label:'阅读考点'},
     //          { code:"9", label:'阅读书籍'},
     //         { code:"10", label:'参与考试'},
     //         { code:"11", label:'正确答题'},
     //         { code:"12", label:'消费赠送'},
     //         { code:"13", label:'后台赠送'},
     //     ]
     //     let result = "";
     //     for(let i = 0;i<keyNameMap.length;i++){
     //         if(keyNameMap[i]['code']==text){
     //             result = keyNameMap[i]['label'];
     //             break;
     //         }
     //     }
     //     return  result;
     // },
    },
    {
     title: '备注',
     align:"center",
     dataIndex: 'remarks'
    },
    {
     title: '数量',
     align:"center",
     dataIndex: 'integralAmount'
    },
    {
     title: '获取时间',
     align:"center",
     dataIndex: 'createTime',

    }

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
    label: '总积分',
    field: 'examFraction',
    component: 'InputNumber',
    colProps: {span: 16},
    dynamicDisabled: true,
  },
  {
    label: '用户id',
    field: 'userId',
    show:false,
    component: 'Input',
    colProps: {span: 16},
  },
  {
    label: '增加/扣除',
    field: 'integralAmount',
    component: 'InputNumber',
     colProps: {span: 16},
  },
  {
    label: '备注',
    field: 'remarks',
     colProps: {span: 16},
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
