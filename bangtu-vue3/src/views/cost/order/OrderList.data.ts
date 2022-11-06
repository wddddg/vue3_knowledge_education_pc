import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import dayjs from 'dayjs';
import { h } from 'vue'
import { render } from '/@/utils/common/renderUtils';
import DefaultPicture from "/@/assets/images/default-picture.jpg";
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '订单信息',
    align: "left",
    customRender: ({ record }) => {
      //
      return h('div', {}, [h('div', { style: 'margin: 0px 0px 10px 0px' }, ['订单编号：', record.orderNumber]), h('div', { style: 'display:flex;' }, [h('img', { src: record.imgUrl, style: 'height:80px;width:120px;',onError(){record.imgUrl = DefaultPicture} }), h('div', { style: 'margin-left:10px' }, [
        h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis;min-height:50px' }, record.spuName),
        h('div', { style: 'color:red' }, '￥' + record.unitPrice)
      ])])])
    },
    width: 350
  },
  {
    title: '用户信息',
    align: "left",
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      return h('div', { style: { display: 'flex', "align-items": "center" } }, [
        h(render.renderImage({ text: record.headImg || '' }), {})
        , h('div', {
          style: { display: 'flex', "flex-direction": "column" }
        }, [
          h('div', { style: { "margin-bottom": '5px' } }, [record.nickName]),
          h('div', { style: { "font-size": '12px', "border-radius": '5px', "border": "1px soild rgb(144,146,151)", color: 'rgb(144,146,151)', 'background-color': 'rgb(243,243,244)', padding: '1px 5px' } }, [
            '电话:', record.phone
          ])
        ])]);
    },
  },
  {
    title: '购买类型',
    align: "center",
    dataIndex: 'categoryStr',
    width: 80
  },
  // {
  //   title: '订单编号',
  //   align: "center",
  //   dataIndex: 'orderNumber'
  // },
  // {
  //   title: '费用',
  //   align: "center",
  //   dataIndex: 'unitPrice',
  //   customRender: ({ text }) => {
  //     return '￥' + text
  //   },
  // },
  {
    title: '支付状态',
    align: "center",
    dataIndex: 'payStatus',
    customRender: ({ text }) => {
      const color = text == '1' ? 'green':text == '2' ? 'blue': 'red';
      return render.renderTag(text==1?'成功':text==2?'待支付':'失败', color);
    },
    width: 80
  },
  {
    title: '支付方式',
    align: "center",
    dataIndex: 'payType',
    customRender: ({ text }) => {
      return text === 1 ? '支付宝' : text === 2 ? '微信' : text === 3 ? 'ios' : text === 4 ? '学币支付' : '卡密兑换'
    },
    width: 80
  },
  {
    title: '支付终端',
    align: "center",
    dataIndex: 'buyTerminal',
    customRender: ({ text }) => {
      return text === 1 ? '小程序' : text === 2 ? '公众号' : text === 3 ? '安卓' : 'IOS'
    },
    width: 80
  },
  {
    title: '是否有效',
    align: "center",
    dataIndex: 'isValid',
    customRender: ({ text }) => {
      return text === 1 ? '有效' : '失效'
    },
    width: 80
  },
  {
    title: '支付时间',
    align: "center",
    dataIndex: 'payTime'
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "订单类型",
    field: 'category',
    component: 'Select',
    componentProps: {
      options: [
        { label: '线上课', value: 1 },
        { label: '面授课', value: 2 },
        { label: '直播课', value: 3 },
        { label: '班级课', value: 4 },
        { label: '电子书', value: 5 },
        { label: '考点集', value: 6 },
        { label: '商城', value: 7 },
        { label: '畅会员', value: 8 },
        { label: '超级会员', value: 9 },
        { label: '学币充值', value: 10 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: "订单编号",
    field: 'orderNumber',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: "支付时间",
    field: 'payTime',
    component: 'RangePicker',
    componentProps: {
      "show-time": {
        hideDisabledOptions: true,
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
        format: "YYYY-MM-DD HH:mm:ss"
      },
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
    colProps: { span: 6, xxl: { span: 12 } },
  },
  {
    label: "学员信息",
    field: 'nickName',
    component: 'Input',
    componentProps: ({ formModel, formActionType }) => {
      return {
        placeholder: '请输入姓名/手机号',
        onChange: function (value) {
          formModel.phone = value.target.value
        },
      };
    },
    colProps: { span: 8 },
  },
  {
    label: "",
    field: 'phone',
    show: false,
    component: 'Input',
  },
  {
    label: "支付方式",
    field: 'payType',
    component: 'Select',
    componentProps: {
      options: [
        { label: '支付宝', value: 1 },
        { label: '微信', value: 2 },
        { label: 'ios', value: 3 },
        { label: '学币支付', value: 4 },
        { label: '卡密兑换', value: 5 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: "支付终端",
    field: 'buyTerminal',
    component: 'Select',
    componentProps: {
      options: [
        { label: '小程序', value: 1 },
        { label: '公众号', value: 2 },
        { label: '安卓', value: 3 },
        { label: 'IOS', value: 4 },
      ],
    },
    colProps: { span: 8 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  // {
  //   label: '商品id',
  //   field: 'spuId',
  //   component: 'Input',
  // },
  // {
  //   label: '商品名称',
  //   field: 'spuName',
  //   component: 'Input',
  // },
  // {
  //   label: '单价',
  //   field: 'unitPrice',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '数量',
  //   field: 'buyNumber',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '总价（实际支付价格）',
  //   field: 'totalPrice',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '会员分类：1、畅会员 2、超级会员',
  //   field: 'memberType',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '是否有效：1、有效 0、失效',
  //   field: 'isValid',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '是否使用优惠券 1、是 0、否',
  //   field: 'isCoupon',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '商品图片',
  //   field: 'imgUrl',
  //   component: 'Input',
  // },
  {
    label: '快递名称',
    field: 'spuName',
    component: 'Input',
  },
  {
    label: '快递单号',
    field: 'spuId',
    component: 'Input',
  },
  {
    label: '发货日期',
    field: 'unitPrice',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      placeholder: "发货日期"
    }
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'orderType',
    component: 'Input',
    show: false
  },
];
