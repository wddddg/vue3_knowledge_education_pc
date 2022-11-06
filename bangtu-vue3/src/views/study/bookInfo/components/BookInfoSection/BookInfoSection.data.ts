import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';

// 部门基础表单
export function useBasicFormSchema() {
  const basicFormSchema: FormSchema[] = [
    {
      field: 'name',
      label: '节名称',
      component: 'Input',
      componentProps: {
      },
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
    },
    {
      field: 'content',
      label: '内容',
      component: 'JEditor',
      // required: true,
      // render: render.renderTinymce,
      componentProps: () =>{
        return {
          defaultValue:'',
        }
      },
      dynamicRules({model}){
        if(model?.type == 'section'){
          return [{ required: false, }]
        }else{
          return [{ required: true,message: '内容不能为空' }]
        }
      }
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
      label: '节名称',
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

// // 机构类型选项
// export const orgCategoryOptions = {
//   // 一级部门
//   root: [{ value: '1', label: '公司' }],
//   // 子级部门
//   child: [
//     { value: '2', label: '部门' },
//     { value: '3', label: '岗位' },
//   ],
// };
