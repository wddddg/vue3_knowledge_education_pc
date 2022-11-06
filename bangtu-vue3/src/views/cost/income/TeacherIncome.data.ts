import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import { rules } from '/@/utils/helper/validator';
import { h } from 'vue';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '讲师信息',
    align: 'left',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      return h('div', { style:{ display:'flex',"align-items": "center" } }, [
        h(render.renderImage({ text:record.headImg }),{  })
        , h('div',{ style:{ display:'flex',"flex-direction": "column" }
      },[
        h('div',{ style:{ "margin-bottom":'5px' } },[record.name]),
        h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
           '电话:',record.cellphone
        ])
      ])]);
    },
  },
  {
    title: '总订单数量',
    align: 'center',
    dataIndex: 'totalCount',
  },
  {
    title: '总收入',
    align: 'center',
    dataIndex: 'totalMoney',
  },
  {
    title: '净收入',
    align: 'center',
    dataIndex: 'cleanMoney',
  },
  // {
  //   title: '实际结算',
  //   align: 'center',
  //   dataIndex: 'realAmount',
  // },
  {
    title: '入职时间',
    align: 'center',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
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
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属日期',
    field: 'belongDate',
    component: 'Input',
  },
  {
    label: '主键id',
    field: 'teacherId',
    component: 'Input',
  },
  {
    label: '总收入',
    field: 'totalAmount',
    component: 'InputNumber',
  },
  {
    label: '净收入',
    field: 'cleanAmount',
    component: 'InputNumber',
  },
  {
    label: '实际结算',
    field: 'realAmount',
    component: 'InputNumber',
  },
  {
    label: '是否结算 1、是 0、否',
    field: 'isSettle',
    component: 'InputNumber',
  },
  {
    label: '结算时间',
    field: 'settleTime',
    component: 'DatePicker',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
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
  },
  {
    title: '分成后收入',
    align: 'center',
    dataIndex: 'divideAmount',
    width:350
  },
  {
    title: '支付时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];

//查询数据
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
