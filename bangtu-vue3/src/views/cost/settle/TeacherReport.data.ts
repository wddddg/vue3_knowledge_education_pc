import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '昵称',
    align:"left",
    dataIndex: 'name',
    customRender: ({ record }) => {
      //
      return h('div', { style:{ display:'flex' } }, [render.renderImage({ text:record.headImg || '' }), record.name]);
    },
   },
   {
    title: '所属年月',
    align:"center",
    dataIndex: 'belongDate'
   },
   {
    title: '总收入',
    align:"center",
    dataIndex: 'totalAmount'
   },
   {
    title: '净收入',
    align:"center",
    dataIndex: 'cleanAmount'
   },
   {
    title: '实际结算',
    align:"center",
    dataIndex: 'realAmount'
   },
   {
    title: '是否结算',
    align:"center",
    dataIndex: 'isSettle',
     customRender: ({ text }) => {
       const color = text == '1' ? 'green':'blue';
       return render.renderTag(text == 1?'是':'否', color);
     },
   },
   {
    title: '结算时间',
    align:"center",
    dataIndex: 'settleTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,16):text)
    },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: " 讲师名称",
      field: 'searchParam',
      component: 'Input',
      componentProps: {
        placeholder:'请输入姓名/身份证号'
      },
      colProps: {span: 6},
 	},
   {
       label: "收入时间",
       field: 'belongDate',
       component: 'DatePicker',
       componentProps: {
         format: 'YYYY-MM-DD HH:mm:ss',
       },
       colProps: {span: 6},
    },
    {
        label: "结算状态",
        field: 'isSettle',
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            }
          ],
        },
        colProps: {span: 6},
     },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '实际结算',
    field: 'realAmount',
    component: 'InputNumber',
  },
  {
    label: '结算时间',
    field: 'settleTime',
    componentProps:{
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    component: 'DatePicker',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];

// 使用情况列表数据
export const userRecordColumns: BasicColumn[] = [
  {
    title: '购买标题',
    align: 'left',
    dataIndex: 'spuName',
    customRender: ({ record }) => {
      //
      return h('div',{ },[h('div', { style: 'margin: 0px 0px 10px 0px' },[ '订单编号：',record.orderNumber ]),h('div', { style: 'display:flex;' }, [h('img', { src: record.imgUrl, style: 'height:80px;width:120px;' }), h('div', { style: 'margin-left:10px' }, [
        h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis;min-height:50px' }, record.spuName),
        h('div', { style: 'color:red' }, '￥' + record.unitPrice)
      ])])])
    },
    width:350
  },
  {
    title: '订单类型',
    align: 'center',
    dataIndex: 'categoryStr',
    // customRender: ({ text }) => {
    //   return textLabel(text);
    // },
    width:80
  },
  {
    title: '费用',
    align: 'center',
    dataIndex: 'totalPrice',
    customRender: ({ text }) => {
      return `¥${text}`;
    },
  },
  {
    title: '用户昵称',
    align: 'left',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      return h('div', { style:{ display:'flex',"align-items": "center" } }, [
        h(render.renderImage({ text:record.headImg }),{  })
        , h('div',{ style:{ display:'flex',"flex-direction": "column" }
      },[
        h('div',{ style:{ "margin-bottom":'5px' } },[record.nickName]),
        h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
           '电话:',record.phone
        ])
      ])]);
    },
    width:300
  },
  {
   title: '所属年月',
   align:"center",
   dataIndex: 'belongDate'
  },
  {
    title: '分成后收入',
    align: 'center',
    dataIndex: 'divideAmount',
  },
  {
    title: '支付时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

export const searchForm: FormSchema[] = [
  {
    label: '讲师名称',
    field: 'searchParam',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '收入时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
  {
    label: '订单编号',
    field: 'orderNumber',
    component: 'Input',
    colProps: { span: 8 },
  },
];

const textLabel = (txt) => {
  if (txt == 1) {
    return '全平台';
  } else if (txt == 2) {
    return '普通课程';
  } else if (txt == 3) {
    return '直播课';
  } else if (txt == 4) {
    return '线下课';
  } else if (txt == 5) {
    return '班级课';
  } else if (txt == 6) {
    return '会员';
  } else if (txt == 7) {
    return '电子书';
  } else if (txt == 8) {
    return '资料库';
  }
};
