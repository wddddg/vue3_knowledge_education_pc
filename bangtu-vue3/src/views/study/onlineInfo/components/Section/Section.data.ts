import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';
import { getDictItems } from '/@/api/common/api';
import { Switch, InputNumber,RadioGroup } from 'ant-design-vue';
import { h } from 'vue';
import moment from 'moment'
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
// 部门基础表单
export function useBasicFormSchema() {
  const stctionFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '章名称',
      component: 'Input',
      componentProps: {
      },
      required: true,
      // rules: [{ required: true, message: '节名称不能为空' }],
    },
    {
      field: 'sort',
      label: '排序',
      component: 'Input',
      componentProps: {
      },
      required: true,
      // rules: [{ required: true, message: '排序不能为空' }],
    },
    {
      field: 'bookId',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
  ];
  return { stctionFormSchema };
}

export const basicFormSchema: FormSchema[] = function (minute,second,nodeType,isSectionType){
  return[
    {
      field: 'name',
      label: '节名称',
      component: 'Input',
      itemProps:itemProp,
      componentProps: {
      },
      colProps: {span: 12},
      required: true,
      // rules: [{ required: true, message: '节名称不能为空' }],
    },
    {
      field: 'sort',
      label: '排序',
      itemProps:itemProp,
      component: 'InputNumber',
      required: true,
      componentProps: {
      },
      colProps: {span: 12},
    },
    {
      field: 'isTryLook',
      label: '试看',
      itemProps:itemProp,
      component: 'RadioGroup',
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
        ]
      },
      colProps: {span: 12},
    },
  ];
}
export const basicFormSchema1: FormSchema[] = function (nodeType,isTable2) {
  return [
    {
      field: 'isExercise',
      label: '关联习题',
      component: 'RadioGroup',
      // show: ({ model }) => {
      //   return nodeType.value == '1'|| nodeType.value == '2'|| nodeType.value == '5'
      // },
      itemProps:itemProp,
      componentProps: { 
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
        onchange:(e)=>{
          isTable2.value = e.target.value == 1?true:false
        }
      },
      colProps: {span: 12},
    },
  ]
} 
export const basicFormSchema2: FormSchema[] = function ({isTable1,minute,second,nodeType,isSectionType,current}){
  return [
    {
      field: 'sectionType',
      label: '节类型',
      component: 'RadioGroup',
      itemProps:itemProp,
      dynamicRules({model}){
        if(model?.type == 'addNode'||model?.type == 'node'){
          if(current.value){
            return [{ required: true,message: '请选择' }]
          }else{
            return [{ required: false, }]
          }
        }else{
          return [{ required: false, }]
        }
      },
      componentProps: { 
        options: [
          {
            label: '视频',
            value: 1,
          },
          {
            label: '音频',
            value: 5,
          },
          {
            label: '图文',
            value: 2,
          },
          {
            label: '直播',
            value: 3,
          }
        ],
        disabled:isSectionType,
        onchange:(e)=>{
          nodeType.value = e.target.value 
        }
      },
      colProps: {span: 12},
    },
    {
      field: 'isPlayBack',
      label: '观看回放',
      component: 'RadioGroup',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.sectionType == '3'
      },
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
        ]
      },
      colProps: {span: 12},
    },
    {
        label: "直播时间",
        field: 'datetime',
        component: 'RangePicker',
        itemProps:itemProp,
        show: ({ model }) => {
          return model.sectionType == '3'
        },
        componentProps:({formModel})=> {
          return {
            format: 'YYYY-MM-DD HH:mm:ss',
            valueFormat: 'YYYY-MM-DD HH:mm:ss',
            onChange:function (e,value){
              
              value[0]? formModel.startTime =  value[0] :formModel.startTime = ''
              value[1]? formModel.endTime =  value[1] :formModel.endTime = ''
            },
            showTime:true,
            disabledDate:function (current){
              return current < moment().add(-1, 'd');
            }
          }
        },
        colProps: {span: 12},
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
     
     {
      label: '使用素材库',
      field: 'videoUrl',
      component: 'JMsUpload',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.sectionType == '1' || model.sectionType == '5'
      },
      dynamicRules({model}){
        
        if(model?.sectionType == '1'||model?.sectionType == '5'){
          return [{ required: true,message: '请选择素材' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:({formModel})=> {
        return {
          fileType: formModel.sectionType=='1'?'mp4':formModel.sectionType=='5'?'mp3':'',
          onUpdatefileData:function(data){
            console.log(data,'fileDat')
            formModel.duration = data[0].videoDuration
          }
        }
      },
      // required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'duration',
      label: '视频时长',
      component: 'Input',
      itemProps:itemProp,
      show: false,
      // render: render.renderTinymce,
      colProps: {
        span: 12,
      },
    },
    {
      label: '时长',
      field: 'time',
      component: 'InputNumber',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.sectionType == '2'
      },
      required: false,
      colProps: {
        span: 12,
      },
      render: ( {model} ) => {
        return h('div',{},[h(InputNumber,{value:minute}),h('span',{},'分'),h(InputNumber,{value:second,max:60}),h('span',{},'秒')])
      },
    },
    {
      field: 'content',
      label: '内容',
      component: 'JEditor',
      itemProps:itemProp,
      show: ({ model }) => {
        return model.sectionType == '2'
      },
      // render: render.renderTinymce,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'isCommerce',
      label: '直播带货',
      component: 'RadioGroup',
      itemProps:itemProp,
      show: ({ model }) => {
        return nodeType.value == '3'
      },
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
        onchange:(e)=>{
          
          isTable1.value = e.target.value == 1?true:false
        }
      },
      colProps: {span: 12},
    },
    {
      field: 'bookId',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
    {
      field: 'parentId',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
    {
      field: 'id',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
    {
      field: 'courseId',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
    {
      field: 'type',
      label: '',
      component: 'Input',
      show:false,
      componentProps: {},
    },
  ]
} 

export const userColumns1 = [
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    align: 'center',
  },
  {
    title: '价格',
    dataIndex: 'price',
    align: 'center',
  },
  {
    title: '分类',
    dataIndex: 'goodsType',
    align: 'center',
    customRender: ({ record }) => {
      return record.goodsType == 1 ? '普通课程' :record.goodsType == 2 ? '班级课程':record.goodsType == 3 ? 
      '面授课程':record.goodsType == 4 ? '书籍':record.goodsType == 5 ? '考点':'商城商品';
    },
  },
];
// let dictList = []
// getDictItems('questtionType').then(res=>{
//   dictList = res
// })
export const userColumns2 = [
  {
    title: '习题名称',
    dataIndex: 'title',
    align: 'center',
    slots:{customRender: 'htmlSlot'}
  },
  {
    title: '题目类型',
    dataIndex: 'questonType',
    align: 'center',
    customRender: ({ record }) => {
      // dictList.forEach(itme=>{
      //   if(itme.value == record.questonType){
      //     record.questonType_dict = itme.label
      //   }
      // })
      return record.questionTypeStr
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
];
