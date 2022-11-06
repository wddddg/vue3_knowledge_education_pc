import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';
import { getDictItems } from '/@/api/common/api';
import moment from 'moment'

// 部门基础表单
export function useBasicFormSchema() {
  const basicFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '节名称',
      component: 'Input',
      componentProps: {
      },
      colProps: {span: 12},
      required: true,
      // rules: [{ required: true, message: '节名称不能为空' }],
    },
    {
      field: 'sort',
      label: '排序',
      component: 'InputNumber',
      required: true,
      componentProps: {
      },
      colProps: {span: 12},
    },
    {
      field: 'isTryLook',
      label: '试看',
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
    {
      field: 'isPlayBack',
      label: '观看回放',
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
    {
        label: "直播时间",
        field: 'datetime',
        component: 'RangePicker',
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
  ];

  
  
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
  return { basicFormSchema,stctionFormSchema };
}

export const basicFormSchema1: FormSchema[] = function (isTable1) {
  return [
    {
      field: 'isCommerce',
      label: '直播带货',
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
        ],
        onchange:(e)=>{
          
          isTable1.value = e.target.value == 1?true:false
        }
      },
      colProps: {span: 12},
    },
  ]
} 
export const basicFormSchema2: FormSchema[] = function (isTable2){
  return [
    {
      field: 'isExercise',
      label: '关联习题',
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
