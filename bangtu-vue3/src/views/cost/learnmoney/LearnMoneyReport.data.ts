import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import dayjs from 'dayjs';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue'
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '昵称',
    align: "left",
    dataIndex: 'nickName',
    customRender: ({ text, record }) => {
      return h('div', { style:{ display:'flex',"align-items": "center" } }, [
        h(render.renderImage({ text:record.headImg || '' }),{  })
        , h('div',{ style:{ display:'flex',"flex-direction": "column" }
      },[
        h('div',{ style:{ "margin-bottom":'5px' } },[record.nickName]),
        h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
           '电话:',record.phone
        ])
      ])]);
    },
  },
  {
    title: '余额',
    align: "center",
    dataIndex: 'balanceAmount'
  },
  {
    title: '累计充值（次）',
    align: "center",
    dataIndex: 'totalCount'
  },
  {
    title: '累计充值（元）',
    align: "center",
    dataIndex: 'totalAmount'
  },
  {
    title: '注册时间',
    align: "center",
    dataIndex: 'createTime'
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "学员信息",
    field: 'searchParam',
    component: 'Input',
    colProps: { span: 6 },
    // componentProps: ({ formModel }) => {
    //   return {
    //     placeholder: '请输入姓名或手机号',
    //     onchange: function (value) {
    //       formModel.phone = value.target.value
    //     }
    //   };
    // },
  },
  {
    label: "",
    field: 'phone',
    component: 'Input',
    show: false
  },
];
//表单数据
// = function (oldNum) { return [] }
export const formSchema: FormSchema[] = [
  {
    label: '总学币',
    field: 'balanceAmount',
    component: 'Input',
    render: ({ model, field }) => {
      return model[field]
    },
  },
  {
    label: '增加/扣除',
    field: 'learnCount',
    component: 'InputNumber',
    // componentProps: ({ formModel, formActionType }) => {
    //   return {
    //     onChange: (value) => {
    //       formModel.balanceAmount = oldNum.value + value
    //     }
    //   }
    // }
  },
  {
    label: '备注',
    field: 'remark',
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

// useRecordColumns, rechargeRecordColumns, rechargeSearchForm, useSearchForm
// 使用记录table
export const useRecordColumns: BasicColumn[] = [
  {
    title: '购买标题',
    align: "center",
    dataIndex: 'spuName'
  },
  {
    title: '购买类型',
    align: "center",
    customRender({ text }) {
      let x = ''
      switch (text) {
        case 1: x = '线上课'
          break;
        case 2: x = '面授课'
          break;
        case 3: x = '直播课'
          break;
        case 4: x = '班级课'
          break;
        case 5: x = '电子书'
          break;
        case 6: x = '考点集'
          break;
        case 7: x = '商城'
          break;
        case 8: x = '畅会员'
          break;
        case 9: x = '超级会员'
          break;
        default: x = ''
          break;
      }
      return x
    },
    dataIndex: 'category'
  },
  {
    title: '学币数量',
    align: "center",
    dataIndex: 'balanceAmount'
  },
  {
    title: '使用时间',
    align: "center",
    dataIndex: 'useTime'
  },
];

// 充值记录table
export const rechargeRecordColumns: BasicColumn[] = [
  {
    title: '充值数量',
    align: "center",
    dataIndex: 'learnCount'
  },
  {
    title: '支付金额',
    align: "center",
    dataIndex: 'payMoney',
    customRender: ({ text }) => {
      return '￥' + text
    }
  },
  {
    title: '充值时间',
    align: "center",
    dataIndex: 'rechargeTime'
  },
  {
    title: '备注',
    align: "center",
    dataIndex: 'remark'
  },
  {
    title: '充值来源',
    align: "center",
    dataIndex: 'rechargeType',
    customRender: ({ text }) => {
      return text === 1 ? '用户充值' : '后台充值'
    }
  },
];

//查询充值数据
export const rechargeSearchForm: FormSchema[] = [
  {
    label: "充值时间：",
    field: 'rechargeTime',
    component: 'RangePicker',
    componentProps: {
      "show-time": {
        hideDisabledOptions: true,
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
        format: "YYYY-MM-DD HH:mm:ss"
      },
      valueFormat: "YYYY-MM-DD HH:mm:ss",
      style:{
        width:'300px',
        margin:'0px 0px 0px 10px'
      }
    },
    colProps: { span: 12, xxl:{ span:12 } },
  },
];

//查询使用数据
export const usesSearchForm: FormSchema[] = [
  {
    label: "订单类型",
    field: 'category',
    component: 'Select',
    componentProps: {
      options: [
        { value: '1', label: '线上课' },
        { value: '2', label: '面授课' },
        { value: '3', label: '直播课' },
        { value: '4', label: '班级课' },
        { value: '5', label: '电子书' },
        { value: '6', label: '考点集' },
        { value: '7', label: '商城' },
        { value: '8', label: '普通会员' },
        { value: '9', label: '畅会员' },
        { value: '10', label: '学币充值' },
      ],
    },
    colProps: { span: 6 , xxl:{ span: 12 } },
  },
];