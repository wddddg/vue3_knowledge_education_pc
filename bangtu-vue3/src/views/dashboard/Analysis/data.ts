export interface GrowCardItem {
  icon: string;
  title: string;
  value?: number;
  total: number;
  color?: string;
  action?: string;
  footer?: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: '总用户量',
    icon: '/src/assets/images/user-cont.png',
    value: 8738888,
    total: 120000,
    color: 'green',
    action: '月',
  },
  {
    title: '订单总量',
    icon: '/src/assets/images/total-oder.png',
    value: 8738888,
    total: 500000,
    color: 'blue',
    action: '月',
  },
  {
    title: '支付笔数',
    icon: '/src/assets/images/pay.png',
    value: 8738888,
    total: 120000,
    color: 'orange',
    action: '周',
  },
  {
    title: '付费会员',
    icon: '/src/assets/images/vip.png',
    value: 8738888,
    total: 50000,
    color: 'purple',
    action: '年',
  },
];

export const chartCardList: GrowCardItem[] = [
  {
    title: '今日流入',
    icon: '/src/assets/images/icon1.png',
    total: 126560,
    value: 234.56,
    footer: '日均销售额',
  },
  {
    title: '已入驻讲师',
    icon: '/src/assets/images/icon2.png',
    value: 1234,
    total: 8846,
    color: 'blue',
    footer: '日订单量',
  },
  {
    title: '习题数量',
    icon: '/src/assets/images/icon3.png',
    value: 60,
    total: 6560,
    color: 'orange',
    footer: '转化率',
  },
  {
    title: '本月流水',
    icon: '/src/assets/images/icon4.png',
    total: 78,
  },
];

export const bdcCardList: GrowCardItem[] = [
  {
    title: '待上课',
    icon: '/src/assets/images/icon11.png',
    total: 100,
    value: 60,
    footer: '今日受理量',
  },
  {
    title: '教材',
    icon: '/src/assets/images/icon12.png',
    value: 54,
    total: 87,
    color: 'blue',
    footer: '今日办结量',
  },
  {
    title: '考点集',
    icon: '/src/assets/images/icon13.png',
    value: 8888,
    total: 15,
    color: 'orange',
    footer: '用户今日受理量',
  },
  {
    title: '书籍',
    icon: '/src/assets/images/icon14.png',
    total: 9,
    value: 7,
    footer: '用户今日办结量',
  },
  {
    title: '参与的班级',
    icon: '/src/assets/images/icon15.png',
    total: 9,
    value: 7,
    footer: '用户今日办结量',
  },
  {
    title: '文章',
    icon: '/src/assets/images/icon16.png',
    total: 9,
    value: 7,
    footer: '用户今日办结量',
  },
];

export const fastList = [
  {
    title: '课程',
    icon: '/src/assets/images/icon11.png',
    path: '/courseInfo',
  },
  {
    title: '考试',
    icon: '/src/assets/images/icon12.png',
    path: '/question/exam',
  },
  {
    title: '店铺装修',
    icon: '/src/assets/images/icon13.png',
    path: '/manage/diyList',
  },
  {
    title: '书籍',
    icon: '/src/assets/images/icon14.png',
    path: '/bookInfo',
  },
  {
    title: '文章',
    icon: '/src/assets/images/icon15.png',
    path: '/news/questionList',
  },
  {
    title: '订单',
    icon: '/src/assets/images/icon16.png',
    path: '/cost/orderList',
  },
  {
    title: '提现审批',
    icon: '/src/assets/images/icon16.png',
    path: '/cost/applyUserWithdrawalList',
  },
];

export const table = {
  dataSource: [
    { reBizCode: '1', type: '转移登记', acceptBy: '张三', acceptDate: '2019-01-22', curNode: '任务分派', flowRate: 60 },
    { reBizCode: '2', type: '抵押登记', acceptBy: '李四', acceptDate: '2019-01-23', curNode: '领导审核', flowRate: 30 },
    { reBizCode: '3', type: '转移登记', acceptBy: '王武', acceptDate: '2019-01-25', curNode: '任务处理', flowRate: 20 },
    { reBizCode: '4', type: '转移登记', acceptBy: '赵楼', acceptDate: '2019-11-22', curNode: '部门审核', flowRate: 80 },
    { reBizCode: '5', type: '转移登记', acceptBy: '钱就', acceptDate: '2019-12-12', curNode: '任务分派', flowRate: 90 },
    { reBizCode: '6', type: '转移登记', acceptBy: '孙吧', acceptDate: '2019-03-06', curNode: '任务处理', flowRate: 10 },
    { reBizCode: '7', type: '抵押登记', acceptBy: '周大', acceptDate: '2019-04-13', curNode: '任务分派', flowRate: 100 },
    { reBizCode: '8', type: '抵押登记', acceptBy: '吴二', acceptDate: '2019-05-09', curNode: '任务上报', flowRate: 50 },
    { reBizCode: '9', type: '抵押登记', acceptBy: '郑爽', acceptDate: '2019-07-12', curNode: '任务处理', flowRate: 63 },
    { reBizCode: '20', type: '抵押登记', acceptBy: '林有', acceptDate: '2019-12-12', curNode: '任务打回', flowRate: 59 },
    { reBizCode: '11', type: '转移登记', acceptBy: '码云', acceptDate: '2019-09-10', curNode: '任务签收', flowRate: 87 },
  ],
  columns: [
    {
      title: '业务号',
      align: 'center',
      dataIndex: 'reBizCode',
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'type',
    },
    {
      title: '受理人',
      align: 'center',
      dataIndex: 'acceptBy',
    },
    {
      title: '受理时间',
      align: 'center',
      dataIndex: 'acceptDate',
    },
    {
      title: '当前节点',
      align: 'center',
      dataIndex: 'curNode',
    },
    {
      title: '办理时长',
      align: 'center',
      dataIndex: 'flowRate',
      slots: { customRender: 'flowRate' },
    },
  ],
  ipagination: {
    current: 1,
    pageSize: 5,
    pageSizeOptions: ['10', '20', '30'],
    showTotal: (total, range) => {
      return range[0] + '-' + range[1] + ' 共' + total + '条';
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
  },
};

export const table1 = {
  dataSource: [
    { reBizCode: 'A001', type: '转移登记', acceptBy: '张四', acceptDate: '2019-01-22', curNode: '任务分派', flowRate: 12 },
    { reBizCode: 'A002', type: '抵押登记', acceptBy: '李吧', acceptDate: '2019-01-23', curNode: '任务签收', flowRate: 3 },
    { reBizCode: 'A003', type: '转移登记', acceptBy: '王三', acceptDate: '2019-01-25', curNode: '任务处理', flowRate: 24 },
    { reBizCode: 'A004', type: '转移登记', acceptBy: '赵二', acceptDate: '2019-11-22', curNode: '部门审核', flowRate: 10 },
    { reBizCode: 'A005', type: '转移登记', acceptBy: '钱大', acceptDate: '2019-12-12', curNode: '任务签收', flowRate: 8 },
    { reBizCode: 'A006', type: '转移登记', acceptBy: '孙就', acceptDate: '2019-03-06', curNode: '任务处理', flowRate: 10 },
    { reBizCode: 'A007', type: '抵押登记', acceptBy: '周晕', acceptDate: '2019-04-13', curNode: '部门审核', flowRate: 24 },
    { reBizCode: 'A008', type: '抵押登记', acceptBy: '吴有', acceptDate: '2019-05-09', curNode: '部门审核', flowRate: 30 },
    { reBizCode: 'A009', type: '抵押登记', acceptBy: '郑武', acceptDate: '2019-07-12', curNode: '任务分派', flowRate: 1 },
    { reBizCode: 'A0010', type: '抵押登记', acceptBy: '林爽', acceptDate: '2019-12-12', curNode: '部门审核', flowRate: 16 },
    { reBizCode: 'A0011', type: '转移登记', acceptBy: '码楼', acceptDate: '2019-09-10', curNode: '部门审核', flowRate: 7 },
  ],
  columns: [
    {
      title: '业务号',
      align: 'center',
      dataIndex: 'reBizCode',
    },
    {
      title: '受理人',
      align: 'center',
      dataIndex: 'acceptBy',
    },
    {
      title: '发起时间',
      align: 'center',
      dataIndex: 'acceptDate',
    },
    {
      title: '当前节点',
      align: 'center',
      dataIndex: 'curNode',
    },
    {
      title: '超时时间',
      align: 'center',
      dataIndex: 'flowRate',
      slots: { customRender: 'flowRate' },
    },
  ],
  ipagination: {
    current: 1,
    pageSize: 5,
    pageSizeOptions: ['10', '20', '30'],
    showTotal: (total, range) => {
      return range[0] + '-' + range[1] + ' 共' + total + '条';
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
  },
};
