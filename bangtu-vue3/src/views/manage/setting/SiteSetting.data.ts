import { nextTick } from 'vue';
import { FormSchema } from '/@/components/Table';

// const isDir = (type) => type === 0;
// const isMenu = (type) => type === 1;
const isButton = (type) => (type === true ? 1 : 0);

/**********************基础配置************************/
//表单数据（基础配置：基本信息）
export const formSchema1: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '站点名称',
    field: 'websiteTitle',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '站点简称',
    field: 'simpleTitle',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '搜索标题',
    field: 'searchTitle',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '网站描述',
    field: 'websiteDesc',
    component: 'Input',
    colProps: { span: 24 },
  },
];

//表单数据（基础配置：公司信息）
export const formSchema2: FormSchema[] = [
  {
    label: '公司名称',
    field: 'companyName',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '公司简称',
    field: 'simpleCompanyName',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '备案信息',
    field: 'keepRecord',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '公网备案号',
    field: 'keepRecordNumber',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '网站上线年份',
    field: 'onlineYear',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '页脚内容',
    field: 'footerContent',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '移动端域名',
    field: 'wapUrl',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'PC端域名',
    field: 'webUrl',
    component: 'Input',
    colProps: { span: 24 },
  },
];

//表单数据（基础配置：联系信息）
export const formSchema3: FormSchema[] = [
  {
    label: '联系电话',
    field: 'cellphone',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '联系QQ',
    field: 'contactQq',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '友情链接',
    field: 'friendUrl',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '微信联系二维码',
    field: 'wechatQrcode',
    required: true,
    component: 'JMsUpload',
  },
];

//表单数据（基础配置：通用配置）
export const formSchemaCommon: FormSchema[] = [
  {
    label: '微信公众号图片',
    field: 'publicWechat',
    // required: true,
    component: 'JMsUpload',
  },
  {
    label: 'LOGO图标',
    field: 'logoUrl',
    // required: true,
    component: 'JMsUpload',
  },
  {
    label: 'ICO图标',
    field: 'iconUrl',
    // required: true,
    component: 'JMsUpload',
  },
];

//表单数据（基础配置：后台管理系统配置）
export const formSchemaSystem: FormSchema[] = [
  {
    label: '站点名称',
    field: 'manageTitle',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '备案信息',
    field: 'manageKeepRecord',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '公网备案号',
    field: 'manageKeepRecordNumber',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'logo图标',
    field: 'manageLogoUrl',
    // required: true,
    component: 'JMsUpload',
  },
  {
    label: 'ICO图标',
    field: 'manageIconUrl',
    // required: true,
    component: 'JMsUpload',
  },
];

/**********************防录屏************************/
//表单数据（防录屏）
export const formSchema4: FormSchema[] = [
  {
    field: 'videoStatus',
    label: '视频水印',
    component: 'Switch',
    defaultValue: 0,
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    colProps: { span: 24 },
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    label: '内容类型',
    field: 'videoCategory',
    component: 'RadioGroup',
    defaultValue: 1,
    itemProps: {
      extra: '默认为用户昵称+手机号',
    },
    componentProps: {
      options: [
        { label: '默认', value: 1 },
        { label: '自定义', value: 2 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '自定义内容',
    field: 'videoContent',
    component: 'Input',
    colProps: { span: 24 },
    show: ({ values }) => values.videoCategory === 2,
  },
  {
    field: 'liveStatus',
    label: '直播水印',
    component: 'Switch',
    defaultValue: 0,
    componentProps: {
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
    colProps: { span: 24 },
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    label: '内容类型',
    field: 'liveCategory',
    component: 'RadioGroup',
    defaultValue: 1,
    itemProps: {
      extra: '默认为用户昵称+手机号',
    },
    componentProps: {
      options: [
        { label: '默认', value: 1 },
        { label: '自定义', value: 2 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '自定义内容',
    field: 'liveContent',
    component: 'Input',
    colProps: { span: 24 },
    show: ({ values }) => values.liveCategory === 2,
  },
];

/**********************支付配置************************/
//表单数据（支付配置：苹果支付）
export const paySchema1: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'IOS支付',
    field: 'appleIosPay',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '微信支付',
    field: 'appleWechatPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '支付宝支付',
    field: 'appleAliPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '学币支付',
    field: 'appleLearnPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
];

//表单数据（支付配置：安卓支付）
export const paySchema2: FormSchema[] = [
  {
    label: '微信支付',
    field: 'androidWechatPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '支付宝支付',
    field: 'androidAppleAliPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '学币支付',
    field: 'androidLearnPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
];

//表单数据（支付配置：公众号支付）
export const paySchema3: FormSchema[] = [
  {
    label: '微信支付',
    field: 'officialWechatPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '学币支付',
    field: 'officialLearnPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
];
//表单数据（支付配置：小程序支付）
export const paySchema4: FormSchema[] = [
  {
    label: 'IOS微信支付',
    field: 'appletIosWechatPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '安卓微信支付',
    field: 'appletWechatPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: 'IOS学币支付',
    field: 'appletIosLearnPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
  {
    label: '安卓学币支付',
    field: 'appletLearnPay',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
    colProps: { span: 24 },
  },
];

//表单数据（支付配置：隐藏支付配置）
export const paySchema5: FormSchema[] = [
  {
    label: '按钮名称',
    field: 'buttonName',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '弹窗标题',
    field: 'alertTitle',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '弹窗图片',
    field: 'alertUrl',
    required: true,
    component: 'JMsUpload',
  },
];

//表单数据（支付配置：支付相关模块管理）
export const paySchema6: FormSchema[] = [
  {
    field: 'memberJoin',
    component: 'CheckboxGroup',
    label: '会员入口',
    colProps: {
      span: 20,
    },
    componentProps: {
      options: [
        {
          label: 'IOS',
          value: '1',
        },
        {
          label: '安卓',
          value: '2',
        },
        {
          label: '公众号',
          value: '3',
        },
        {
          label: '小程序',
          value: '4',
        },
      ],
    },
  },
  {
    field: 'couponJoin',
    component: 'CheckboxGroup',
    label: '优惠券入口',
    colProps: {
      span: 20,
    },
    componentProps: {
      options: [
        {
          label: 'IOS',
          value: '1',
        },
        {
          label: '安卓',
          value: '2',
        },
        {
          label: '公众号',
          value: '3',
        },
        {
          label: '小程序',
          value: '4',
        },
      ],
    },
  },
  {
    field: 'retailJoin',
    component: 'CheckboxGroup',
    label: '分销中心',
    colProps: {
      span: 20,
    },
    componentProps: {
      options: [
        {
          label: 'IOS',
          value: '1',
        },
        {
          label: '安卓',
          value: '2',
        },
        {
          label: '公众号',
          value: '3',
        },
        {
          label: '小程序',
          value: '4',
        },
      ],
    },
  },
  {
    field: 'learnMoneyJoin',
    component: 'CheckboxGroup',
    label: '学币充值',
    colProps: {
      span: 20,
    },
    componentProps: {
      options: [
        {
          label: 'IOS',
          value: '1',
        },
        {
          label: '安卓',
          value: '2',
        },
        {
          label: '公众号',
          value: '3',
        },
        {
          label: '小程序',
          value: '4',
        },
      ],
    },
  },
];
/**********************直播配置************************/
//表单数据（直播配置）
export const LiveSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '百家云key',
    field: 'baijiaPartnerKey',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '百家云id',
    field: 'baijiaPartnerId',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '百家云key',
    field: 'baijiaPrivateDomain',
    component: 'Input',
    colProps: { span: 24 },
  },
];

/**********************短信配置************************/
//表单数据（短信配置）
export const SmsSchema: FormSchema[] = [
  {
    label: 'accessKey',
    field: 'aliyunKey',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'secretKey',
    field: 'aliyunSecretKey',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '模板签名',
    field: 'aliyunTemplate',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '模板ID',
    field: 'aliyunCode',
    component: 'Input',
    colProps: { span: 24 },
  },
];
/**********************公众号配置************************/
//表单数据（公众号配置）
export const OfficialSchema1: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'appId',
    field: 'officialAppid',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'appSecretKey',
    field: 'officialSecret',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'js验证文件',
    field: 'officialFilePath',
    component: 'JUpload',
    colProps: { span: 24 },
    itemProps: {
      extra: '请上传微信校验文件',
    },
  },
];
export const OfficialSchema2: FormSchema[] = [
  {
    label: '微信商户号',
    field: 'officialMerchantNumber',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '微信商户key',
    field: 'officialMerchantKey',
    component: 'Input',
    colProps: { span: 24 },
  },
];

/**********************开放平台************************/
//表单数据（微信开放平台配置）
export const OpenPlatformSchema1: FormSchema[] = [
  {
    label: 'appId',
    field: 'wechatOppenAppid',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'appSecretKey',
    field: 'wechatOppenSecret',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'apiclient_cert.pem文件',
    field: 'wechatOppenCertPath',
    component: 'JUpload',
    colProps: { span: 24 },
    itemProps: {
      extra: '请上传微信校验文件',
    },
  },
  {
    label: 'apiclient_key文件',
    field: 'wechatOppenKeyPath',
    component: 'JUpload',
    colProps: { span: 24 },
    itemProps: {
      extra: '请上传微信校验文件',
    },
  },
];
//表单数据（支付宝开放平台配置）
export const OpenPlatformSchema2: FormSchema[] = [
  {
    label: 'appId',
    field: 'alipayAppid',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '支付宝公钥',
    field: 'alipayPublicSecret',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '支付宝私钥',
    field: 'alipaySecret',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];

/**********************小程序************************/
//表单数据（微信开放平台配置）
export const AppletSchema: FormSchema[] = [
  {
    label: 'appId',
    field: 'appletAppid',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: 'appSecret',
    field: 'appletSecret',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '校验域名文件',
    field: 'appletFilePath',
    component: 'JUpload',
    colProps: { span: 24 },
    itemProps: {
      extra: '请上传小程序校验文件',
    },
  },
];

/**********************存储配置************************/
//表单数据（存储配置）
export const StorageSchema: FormSchema[] = function (type) {
  return [
    {
      label: '存储平台',
      field: 'storageType',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        onchange(e) {
          type.value = e.target.value;
          nextTick();
        },
        options: [
          { label: '本地存储', value: 1 },
          { label: '阿里云oss', value: 2 },
          { label: '七牛云存储', value: 3 },
        ],
      },
      colProps: { span: 24 },
    },
    /**********************阿里云OSS************************/
    {
      label: 'sccessKey',
      field: 'aliyunStorageKey',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        console.log(model.storageType === 2);
        return model.storageType === 2;
      },
    },
    {
      label: 'secretKey',
      field: 'aliyunSecretKey',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 2;
      },
    },
    {
      label: 'Bucket名称',
      field: 'aliyunStorageBucket',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 2;
      },
    },
    {
      label: 'Endpoint',
      field: 'aliyunEndpoint',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 2;
      },
    },
    {
      label: '点播存储地址',
      field: 'aliyunStorageUrl',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 2;
      },
    },
    {
      label: '转码格式',
      field: 'aliyunEncodeType',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: 'mp4', value: 1 },
          { label: 'm3u8', value: 2 },
        ],
      },
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 2;
      },
    },
    /********************七牛云*****************************/
    {
      label: 'accessKey',
      field: 'qiniuStorageKey',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: 'secretKey',
      field: 'aliyunSecretKey',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: 'Bucket名称',
      field: 'qiniuStorageBucket',
      component: 'Input',
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: '点播存储地址',
      field: 'qiniuStorageAddress',
      component: 'JDictSelectTag',
      componentProps: {
        dictCode: 'qiniu_storage_address',
        placeholder: '请选择点播存储地址',
        stringToNumber: false,
      },
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: '业务域名',
      field: 'qiniuStorageUrl',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务域名地址',
      },
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: '是否转码',
      field: 'qinniuEncode',
      component: 'ApiRadioGroup',
      componentProps: ({ formModel }) => {
        return {
          options: [
            { label: '开启', value: 1 },
            { label: '关闭', value: 0 },
          ]
        }
      },
      colProps: { span: 24 },
      show: ({ model }) => {
        return model.storageType === 3;
      },
    },
    {
      label: '转码格式',
      field: 'qinniuEncodeType',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: 'mp4', value: 1 },
          { label: 'm3u8', value: 2 },
        ],
      },
      show: ({ model }) => {
        return model.storageType === 3;
      },
      colProps: { span: 24 },
    },
  ];
};
