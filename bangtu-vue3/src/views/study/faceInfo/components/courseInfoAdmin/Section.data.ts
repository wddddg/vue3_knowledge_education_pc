import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue'
import { getDictItems } from '/@/api/common/api';

// 部门基础表单
export function useBasicFormSchema() {
  const basicFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '节名称',
      component: 'Input',
      componentProps: {
      },
      colProps: {span: 12,offset:6},
      rules: [{ required: true, message: '节名称不能为空' }],
    },
    {
      field: 'sort',
      label: '排序',
      component: 'Input',
      required: true,
      componentProps: {
      },
      colProps: {span: 12,offset:6},
    },
    {
      field: 'teacherName',
      label: '讲师',
      component: 'Input',
      componentProps: {
      },
      colProps: {span: 12,offset:6},
    },
    // {
    //   field: 'isPlayBack',
    //   label: '是否回放',
    //   component: 'RadioGroup',
    //   componentProps: {
    //     options: [
    //       {
    //         label: '是',
    //         value: 1,
    //       },
    //       {
    //         label: '否',
    //         value: 0,
    //       }
    //     ]
    //   },
    //   colProps: {span: 12},
    // },
    {
        label: "时间",
        field: 'datetime',
        component: 'RangePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        colProps: {span: 12,offset:6},
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
      rules: [{ required: true, message: '节名称不能为空' }],
    },
    {
      field: 'sort',
      label: '排序',
      component: 'Input',
      componentProps: {
      },
      rules: [{ required: true, message: '排序不能为空' }],
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



export const userColumns = [
  {
    title: '姓名',
    dataIndex: 'nickName',
    align:"left",
    customRender:({record}) => {
      return h('div',{},[render.renderImage({ text:record.headImg || '' }),record.nickName])
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '签到时间',
    dataIndex: 'updateTime',
    align: 'center',
  },
  {
    title: '销课状态',
    dataIndex: 'beginsStatus',
    align: 'center',
    customRender: ({record}) => {
      const color = record.beginsStatus == '1' ? 'green' : record.beginsStatus == '2' ? 'blue' : record.beginsStatus == '3' ? 'cyan' : record.beginsStatus == '4' ? 'yellow' : 'red';
      return render.renderTag(record.beginsStatus == 1 ? '销课' : record.beginsStatus == 2 ? '迟到' : record.beginsStatus == 3 ?
        '早退' : record.beginsStatus == 4 ? '缺课' : '请假', color);
    }
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

export const searchFormSchema: FormSchema[] = [
  {
    label: '搜索内容',
    field: 'searchParam',
    component: 'Input',
    colProps: {span: 6},
    componentProps: {
      placeholder:'请输入姓名/手机号'
    },
  },
  {
      label: "状态",
      field: 'beginsStatus',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '销课',
            value: 1,
          },
          {
            label: '迟到',
            value: 2,
          },
          {
            label: '早退',
            value: 3,
          },
          {
            label: '缺课',
            value: 4,
          },
          {
            label: '请假',
            value: 5,
          }
        ],
      },
      colProps: {span: 6},
   },
]
