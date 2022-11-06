import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';
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
export const schemasClass: FormSchema[] = function(threeCateId,twoCateId,oneCateId,userRoleType){
  return [
    {
        label: '',
        field: 'id',
        show:false,
        component: 'Input',
        colProps: {
          span: 12
        },
    },
    {
        label: '资料名称',
        field: 'name',
        component: 'Input',
        required: true,
        colProps: {
           span: 12
        },
    },
    {
        label: '讲师名称',
        field: 'teacherId',
        component: 'JSelectTeacher',
        required: true,
        colProps: {
           span: 12
        },
        componentProps: {
          rowKey: 'id',
          labelKey: 'name',
          isRadioSelection:true,
          placeholder:'请选择',
          disabled:userRoleType==2,
        },
    },
    // {
    //     label: '资料分类',
    //     field: 'nickName',
    //     component: 'Select',
    //     required: true,
    //     colProps: {
    //        span: 12
    //     },
    // },
    
    {
      label: '资料分类',
      field: 'cateName',
      component: 'JMsTreeSelect',
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
        component: 'InputNumber',
        componentProps:{
          style:'width:100%'
        },
        itemProps: {
          extra: '谨慎填写学习人数',
        },
        colProps: {
           span: 12
        },
    },
    // {
    //   label: '书籍来源',
    //   field: 'sourceType',
    //   component: 'RadioGroup',
    //   required: true,
    //   componentProps: {
    //     options: [
    //       {
    //         label: '原创',
    //         value: 1,
    //       },
    //       {
    //         label: '转载',
    //         value: 2,
    //       }
    //     ],
    //   },
    //   colProps: {
    //      span: 12,
    //      offset: 0
    //   },
    // },
    // {
    //     label: '转载来源',
    //     field: 'sourceContent',
    //     component: 'Input',
    //     colProps: {
    //        span: 12,
    //     },
    // },
    {
      label: '为公共书籍',
      field: 'isCommon',
      component: 'Switch',
      required: true,
      componentProps:function({formModel}) {
        formModel.isCommon = 0
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
         offset: 0
      },
    },
    {
      label: '封面上传',
      field: 'imgUrl',
      required: true,
       component: 'JMsUpload',
       componentProps:{
        },
        colProps: {
           span: 12,
           offset: 0
        },
    },
];
}
export const schemasCharge: FormSchema[] = [
  {
    label: '收费规则',
    field: 'costType',
    component: 'RadioGroup',
    required: true,
    itemProps:itemProp,
    componentProps: {
      options: [
        {
          label: '免费课程',
          value: 1,
        },
        {
          label: '会员免费',
          value: 2,
        },
        {
          label: '全部免费',
          value: 3,
        }
      ],
    },
    colProps: {
       span: 12,
       offset: 6
    },
  },
  {
      label: '原价',
      field: 'originalPrice',
      component: 'Input',
      show: ({ model }) => {
        return model.costType == 3;
      },
      dynamicRules({model}){
        if((model?.costType == 3)){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:{
        style:'width:100%',
        addonAfter:"元",
        type:'number'
      },
      required: true,
      itemProps:itemProp,
      colProps: {
         span: 12,
        //  offset: 0
      },
  },
  {
      label: '现价',
      field: 'presentPrice',
      component: 'Input',
      show: ({ model }) => {
        return model.costType == 3;
      },
      dynamicRules({model}){
        if((model?.costType == 3)){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:{
        style:'width:100%',
        addonAfter:"元",
        type:'number'
      },
      required: true,
      itemProps:itemProp,
      colProps: {
         span: 12,
        //  offset: 0
      },
  },
  {
    label: '会员打折',
    field: 'isMemberDiscount',
    component: 'Switch',
    required: true,
    itemProps:itemProp,
    show: ({ model }) => {
      return model.costType == 3;
    },
    dynamicRules({model}){
      if((model?.costType == 3)){
        return [{ required: true,message: '不能为空' }]
      }else{
        return [{ required: false, }]
      }
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
      //  offset: 0
    },
  },
  {
      label: '会员折扣额度',
      field: 'discountAmount',
      component: 'Input',
      show: ({ model }) => {
        return model.costType == 3&&model.isMemberDiscount == 1;
      },
      dynamicRules({model}){
        if((model?.costType == 3)&&model.isMemberDiscount == 1){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:{
        style:'width:100%',
        addonAfter:"折",
        type:'number'
      },
      required: true,
      itemProps:itemProp,
      colProps: {
         span: 12,
        //  offset: 0
      },
  },
  {
    label: '可否使用优惠卷',
    field: 'isCoupon',
    component: 'Switch',
    required: true,
    itemProps:itemProp,
    show: ({ model }) => {
      return model.costType == 3;
    },
    dynamicRules({model}){
      if((model?.costType == 3)){
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
      //  offset: 0
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
  {
      label: '摘要',
      field: 'summary',
      component: 'InputTextArea',
      required: true,
      colProps: {
         span: 24,
         offset: 0
      },
  },
  {
    field: 'content',
    label: '资料内容',
    component: 'JEditor',
    required: true,
    // render: render.renderTinymce,
    colProps: {
       span: 24,
       offset: 0
    },
  },
  {
    field: 'tryContent',
    label: '试看内容',
    component: 'JEditor',
    required: true,
    // render: render.renderTinymce,
    colProps: {
       span: 24,
       offset: 0
    },
  },
];
//表单数据
export const recommendformSchema: FormSchema[] = [
  {
    label: '推荐状态',
    field: 'isRecommend',
     component: 'JSwitch',
     componentProps:{
      options: ['1', '0'],
     },
  },
  {
    label: '排序',
    field: 'weight',
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

export const topformSchema: FormSchema[] = [
  {
    label: '置顶状态',
    field: 'isTop',
     component: 'JSwitch',
     componentProps:{
      options: ['1', '0'],
     },
  },
  {
    label: '排序',
    field: 'topSort',
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
