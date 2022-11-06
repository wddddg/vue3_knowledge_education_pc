import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from "vue";
//列表数据
export const columns: BasicColumn[] = [
    {
     title: '封面',
     align:"left",
     dataIndex: 'headImg',
     customRender: ({ record }) => {
      // 
        return h('div',{ },[h('div', { style: 'margin: 0px 0px 10px 0px' },[ '订单编号：',record.orderNumber ]),h('div', { style: 'display:flex;' }, [h('img', { src: record.imgUrl, style: 'height:80px;width:120px;' }), h('div', { style: 'margin-left:10px' }, [
          h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis;min-height:50px' }, record.spuName),
          h('div', { style: 'color:red' }, '￥' + record.totalPrice)
        ])])])
      },
      width:350
    },
    {
     title: '积分',
     align:"center",
     dataIndex: 'integralAmount'
    },
    {
     title: '支付状态',
     align:"center",
     dataIndex: 'payStatus',
     customRender: ({ text }) => {
         if(text=="1"){
             return "成功"
         }else{
             return "失败"
         }
     },
    },
    {
     title: '支付渠道',
     align:"center",
     dataIndex: 'buyTerminal',
     customRender: ({ text }) => {
         const keyNameMap = [
             { code:"1", label:'小程序'},
             { code:"2", label:'公众号'},
             { code:"3", label:'安卓'},
             { code:"4", label:'IOS'},
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
     title: '是否有效',
     align:"center",
     dataIndex: 'isValid',
     customRender: ({ text }) => {
          if(text=="1"){
              return "有效"
          }else{
              return "无效"
          }
      }
    },
    {
     title: '支付时间',
     align:"center",
     dataIndex: 'payTime'
    },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "商品名称",
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
