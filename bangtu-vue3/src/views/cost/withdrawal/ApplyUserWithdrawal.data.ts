import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '申请用户id',
    ifShow:false,
    align:"center",
    dataIndex: 'userId'
   },
   {
    title: '申请人',
    align:"center",
    dataIndex: 'createBy',
    customRender:({record}) => {
      //
       return h('div',{style:'display:flex;align-items:center'},[h(render.renderImage({ text:record.headImg || '' }),{  }),h('div',{style:'margin-left:10px'},
        h('div',{style:' white-space:nowrap; overflow:hidden; text-overflow:ellipsis;'},record.nickName),
       )])
    },
   },
   {
    title: '提现金额',
    align:"center",
    dataIndex: 'currentAmount'
   },
   {
    title: '累计提现',
    align:"center",
    dataIndex: 'totalAmount'
   },
   {
    title: '申请时间',
    align:"center",
    dataIndex: 'applyTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,16):text)
    },
   },
  {
    title: '审批状态',
    align:"center",
    dataIndex: 'status',
    customRender: ({ text }) => {
      const color = text == '1' ? 'blue':text == '2' ? 'green': 'red';
      return render.renderTag(text==1?"待审批":text==2?"已通过":"已拒绝", color);
    },
  },
   {
    title: '审批时间',
    align:"center",
    dataIndex: 'approveTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,16):text)
    },
   },
   {
    title: '提现方式',
    align:"center",
    dataIndex: 'category',
    customRender:({text}) =>{
      return text==1?"微信":"支付宝"
    },
   },
   {
    title: '支付宝账号',
    align:"center",
    dataIndex: 'alipayNumber'
   },
   {
    title: '支付宝收款者姓名',
    align:"center",
    dataIndex: 'alipayName'
   },
   {
    title: '打款备注',
    align:"center",
    dataIndex: 'remarks'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: " 学员信息",
      field: 'searchParam',
      component: 'Input',
      componentProps: {
        placeholder:'请输入姓名/手机号'
      },
      colProps: {span: 6},
 	},
   {
       label: "申请时间",
       field: 'datetime',
       component: 'RangePicker',
       componentProps: {
         format: 'YYYY-MM-DD HH:mm:ss',
       },
       colProps: {span: 6},
    },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '状态',
    field: 'status',
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '通过',
          value: 2,
        },
        {
          label: '拒绝',
          value: 3,
        },
      ],
    },
    dynamicRules({model}){
        return [{ required: true,message:'请选择', validator:function(rules,value,callback){

          if(value =='2'||value =='3'){
            callback()
          }else{
            callback('请选择')
          }
        }}]
    },
    colProps: {
      span: 12,
      offset: 6,
    },
  },
  // {
  //   label: '',
  //   field: 'category',
  //   show:false,
  //   component: 'RadioGroup',
  //   colProps: {
  //     span: 12,
  //     offset: 6,
  //   },
  // },
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
    colProps: {
      span: 12,
      offset: 6,
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

export const formSchema2: FormSchema[] = [
  {
    label: '备注',
    field: 'remarks',
    component: 'InputTextArea',
    colProps: {
      span: 12,
      offset: 6,
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
