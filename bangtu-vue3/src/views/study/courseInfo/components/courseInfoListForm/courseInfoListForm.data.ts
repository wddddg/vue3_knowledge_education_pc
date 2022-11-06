import { FormSchema } from '/@/components/Form';
import {BasicColumn} from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { h,nextTick } from 'vue';
import { Switch, InputNumber,Radio,Checkbox } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
import { cloneDeep } from 'lodash-es';
import {} from '../../courseInfo.api';
import { useMessage } from '/@/hooks/web/useMessage';
const itemProp = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
export const schemasClass: FormSchema[] = function (userRoleType,threeCateId,twoCateId,oneCateId){
  return [
    {
      label: '',
      field: 'id',
      show: false,
      itemProps:itemProp,
      component: 'Input',
      colProps: {
        span: 12,
      },
    },
    {
      label: '课程名称',
      field: 'name',
      itemProps:itemProp,
      component: 'Input',
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      label: '负责讲师',
      field: 'teacherId',
      itemProps:itemProp,
      component: 'JSelectTeacher',
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        rowKey: 'id',
        labelKey: 'name',
        isRadioSelection: true,
        placeholder: '请选择',
        disabled:userRoleType==2
      },
      // show:!(userRoleType==2)
    },
    {
      label: '课程服务',
      field: 'courseServerVOList',
      itemProps:itemProp,
      component: 'JSelectMultiple',
      required: true,
      componentProps: {
        dictCode: 'course_service',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '课程分类',
      field: 'cateName',
      component: 'JMsTreeSelect',
      itemProps:itemProp,
      required: true,
      componentProps:{
        onChange: function(e){
          threeCateId.value = e.threeCateId
          twoCateId.value = e.twoCateId
          oneCateId.value = e.oneCateId
        }
      },
      colProps: {
         span: 12
      },
    },
    {
      label: '模拟观看人数',
      field: 'studyCount',
      itemProps: {
        ...itemProp,
        extra: '谨慎填写学习人数',
      },
      component: 'InputNumber',
      componentProps:{
        style:'width:100%'
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '封面上传',
      field: 'imgUrl',
      component: 'JMsUpload',
      itemProps:itemProp,
      required: true,
      componentProps: {},
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '开课时间',
      field: 'datetime',
      component: 'RangePicker',
      itemProps:itemProp,
      componentProps:({formModel})=> {
        return {
          format: 'YYYY-MM-DD HH:mm:ss',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          onChange:function (e,value){
            
            value[0]? formModel.startTime =  value[0] :formModel.startTime = ''
            value[1]? formModel.endTime =  value[1] :formModel.endTime = ''
          },
          showTime:true,
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
     {
      label: "",
      field: 'startTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'endTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
  ];
} 
export const schemasCharge: FormSchema[] = [
  {
    label: '微信账号',
    field: 'wechatNumber',
    itemProps:itemProp,
    component: 'Input',
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: 'QQ账号',
    field: 'qqNumber',
    itemProps:itemProp,
    component: 'Input',
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '在线咨询',
    field: 'onlineContactUrl',
    component: 'Input',
    itemProps:itemProp,
    componentProps: {
      placeholder: '请输入在线咨询链接',
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '联系电话',
    field: 'contactPhone',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps: {
      max:99999999999,
      min:0,
      style:"width:100%"
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '微信二维码',
    field: 'contactUrl',
    component: 'JMsUpload',
    itemProps:itemProp,
    componentProps: {},
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '企业微信二维码',
    field: 'enterpriseContactUrl',
    itemProps:itemProp,
    component: 'JMsUpload',
    componentProps: {},
    colProps: {
      span: 12,
      offset: 0,
    },
  },
];
export const schemasCentont: FormSchema[] = [
  // {
  //     label: '书籍导语',
  //     field: 'remark',
  //     component: 'Input',
  //     required: true,
  //     colProps: {
  //        span: 12,
  //        offset: 6
  //     },
  // },
  // {
  //     label: '书籍摘要',
  //     field: 'summary',
  //     component: 'Input',
  //     required: true,
  //     colProps: {
  //        span: 12,
  //        offset: 6
  //     },
  // },
  {
    field: 'summary',
    label: '课程摘要',
    component: 'InputTextArea',
    required: true,
    colProps: {
      span: 24,
      offset: 0,
    },
  },
  {
    field: 'content',
    label: '课程介绍',
    component: 'JEditor',
    // render: render.renderTinymce,
    required: true,
    colProps: {
      span: 24,
      offset: 0,
    },
  },
];
//表单数据
export const step1Schemas: FormSchema[] = [
  {
    field: 'account',
    component: 'Select',
    label: '付款账户',
    required: true,
    defaultValue: '1',
    componentProps: {
      options: [
        {
          label: 'anncwb@126.com',
          value: '1',
        },
      ],
    },
  },
  {
    field: 'fac',
    component: 'InputGroup',
    label: '收款账户',
    required: true,
    defaultValue: 'test@example.com',
    slot: 'fac',
  },
  {
    field: 'pay',
    component: 'Input',
    label: '',
    defaultValue: 'zfb',
    show: false,
  },
  {
    field: 'payeeName',
    component: 'Input',
    label: '收款人姓名',
    defaultValue: 'Jeecg',
    required: true,
  },
  {
    field: 'money',
    component: 'Input',
    label: '转账金额',
    defaultValue: '500',
    required: true,
    renderComponentContent: () => {
      return {
        prefix: () => '￥',
      };
    },
  },
];

export const step2Schemas: FormSchema[] = function (showTable,switchType) {
  return [
    {
      label: '收费规则',
      field: 'costType',
      component: 'RadioGroup',
      required: true,
      itemProps:itemProp,
      componentProps: {
        onchange(e) {
          if (e.target.value == 2 || e.target.value == 4) {
            showTable.value = true;
            switchType.value = e.target.value
          } else {
            showTable.value = false;
            switchType.value = e.target.value
          }
          nextTick()
        },
        options: [
          {
            label: '免费课程',
            value: 1,
          },
          {
            label: '限时免费',
            value: 2,
          },
          {
            label: '会员免费',
            value: 3,
          },
          {
            label: '全部收费',
            value: 4,
          },
        ],
      },
      colProps: {
        span: 12,
        offset: 6,
      },
    },
    {
      label: '限时免费',
      field: 'freeEndTime',
      itemProps:itemProp,
      show: ({ model }) => {
        console.log(model.costType == '2')
        return model.costType == '2';
      },
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD hh:mm:ss',
        showTime:true,
      },
      dynamicRules({model}){
        
        if(model?.costType == '2'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '会员打折',
      field: 'isMemberDiscount',
      component: 'Switch',
      itemProps:itemProp,
      dynamicRules({model}){
        
        if(model?.costType == '2'|| model?.costType == '4'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      show: ({ model }) => {
        return model.costType == '2' || model.costType == '4';
      },
      componentProps:function({formModel}) {
        formModel.isMemberDiscount = 0
        
        return{
          checkedValue:1,
          unCheckedValue:0,
          checked:1,
          checkedChildren: '是',
          unCheckedChildren: '否',
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '会员折扣额度',
      field: 'discountAmount',
      component: 'Input',
      componentProps:{
        style:'width:100%',
        addonAfter:"折",
        type:'number'
      },
      itemProps:itemProp,
      show: ({ model }) => {
        return (model.costType == '2' || model.costType == '4')&&model.isMemberDiscount == 1;
      },
      dynamicRules({model}){
        
        if((model?.costType == '2'|| model?.costType == '4')&&model.isMemberDiscount == 1){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '可否使用优惠卷',
      field: 'isCoupon',
      component: 'Switch',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.costType == '2' || model.costType == '4';
      },
      dynamicRules({model}){
        
        if(model?.costType == '2'|| model?.costType == '4'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:function({formModel}) {
        formModel.isCoupon = 0
        
        return{
          checkedValue:1,
          unCheckedValue:0,
          checked:1,
          checkedChildren: '是',
          unCheckedChildren: '否',
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '限时活动',
      field: 'isActivity',
      component: 'Switch',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.costType == '2' || model.costType == '4';
      },
      dynamicRules({model}){
        
        if(model?.costType == '2'|| model?.costType == '4'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:function({formModel}) {
        formModel.isActivity = 0
        
        return{
          checkedValue:1,
          unCheckedValue:0,
          checked:1,
          checkedChildren: '是',
          unCheckedChildren: '否',
        }
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '活动截止',
      field: 'activityEndTime',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.costType == '2' || model.costType == '4';
      },
      dynamicRules({model}){
        
        if(model?.costType == '2'|| model?.costType == '4'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD hh:mm:ss',
        showTime:true,
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
  ];
};

export const columnsForm: BasicColumn[] = function(isEdit){
  return[
    {
      title: '购买规格(月)',
      align: 'center',
      dataIndex: 'specsCount',
      customRender: ({ record }) => {
        return h('div',{},[
          h(InputNumber, {
            defaultValue: record.specsCount || 0,
            disabled: record.specsCount == 0 || !isEdit.value,
            onChange(value) {
              record.specsCount = value;
            },
          }),
          h('span',{style:'margin-left:10px'},'永久有效'),
          h(Checkbox, {
            checked: record.specsCount==0?true:false,
            disabled:!isEdit.value,
            options:[{value:0}],
            style:'margin-left:10px',
            onChange(value) {
              if(value.target.checked){
                record.specsCount = 0;
              }else{
                record.specsCount = 1;
              }
            },
          }),
        ])
      },
    },
    {
      title: '原价（元）',
      align: 'center',
      dataIndex: 'originalPrice',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.originalPrice || 0,
          disabled:!isEdit.value,
          onChange(value) {
            record.originalPrice = value;
          },
          //  loading: record.pendingStatus,
          //  onClick(checked:boolean){
          //    record.pendingStatus = true;
          //    let newStatus = checked?1:0;
          //    const { createMessage } = useMessage();
          //    // let data = cloneDeep(record);
          //    // data.isEnable = newStatus;
          //    let data = {
          //      status:record.status,
          //      userId:record.userId
          //    }
          //    updateEnable(data).then(res =>{
          //      record.status = newStatus;
          //    }).catch(() => {
          //      createMessage.error('修改状态失败');
          //    }).finally(() => {
          //      record.pendingStatus = false;
          //    });
          //  }
        });
      },
    },
    {
      title: '现价（元）',
      align: 'center',
      dataIndex: 'presentPrice',
      customRender: ({ record }) => {
        return h(InputNumber, {
          defaultValue: record.presentPrice || 0,
          disabled:!isEdit.value,
          onChange(value) {
            record.presentPrice = value;
          },
          //  loading: record.pendingStatus,
          //  onClick(checked:boolean){
          //    record.pendingStatus = true;
          //    let newStatus = checked?1:0;
          //    const { createMessage } = useMessage();
          //    // let data = cloneDeep(record);
          //    // data.isEnable = newStatus;
          //    let data = {
          //      status:record.status,
          //      userId:record.userId
          //    }
          //    updateEnable(data).then(res =>{
          //      record.status = newStatus;
          //    }).catch(() => {
          //      createMessage.error('修改状态失败');
          //    }).finally(() => {
          //      record.pendingStatus = false;
          //    });
          //  }
        });
      },
    },
  ];
} 
/**
 * 角色用户Columns
 */
export const userColumns = [
  {
    title: '课程名称',
    dataIndex: 'courseName',
    align: 'center',
  },
  {
    title: '课程分类',
    dataIndex: 'studyDuration',
    align: 'center',
    customRender:({record}) => {
      return record.oneCateName+'-'+record.twoCateName+'-'+record.threeCateName
    },
  },
  {
    title: '所属教师',
    dataIndex: 'teacherName',
    align: 'center',
  },
  {
    title: '是否完结',
    dataIndex: 'isEnable',
    align: 'center',
    customRender: ({ record }) => {
      return record.isEnable == 1 ? '已完成' : '未完成';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'roleName',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
