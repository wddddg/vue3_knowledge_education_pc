import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
    {
    title: '章',
    align:"center",
    dataIndex: 'chapterId_dictText'
    },
    {
    title: '节',
    align:"center",
    dataIndex: 'sectionrId_dictText'
    },
   {
    title: '行业分类',
    align:"center",
    dataIndex: 'cateId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "行业分类",
      field: '',
      component: 'JMsTreeSelect',
      // required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.cateId = e.selectCateId
          }
        }
      },
      colProps: {span: 6},
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'cateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
        label: "章名称",
        field: 'chapterId',
        component: 'JSearchSelect',
        // required:true,
        componentProps: {
          dict:"questions_chapter"
        },
        colProps: {span: 6},
     },
     {
         label: "节名称",
         field: 'sectionName',
         component: 'JSearchSelect',
         componentProps: {
          dict:"questions_chapter_section"
         },
         colProps: {span: 6},
      },
      {
        label: "名称",
        field: 'name',
        component: 'Input',
        colProps: {span: 6},
      },
];
//表单数据
export const formSchema: FormSchema[] = function(isUpdate){
  return [
  {
      label: "行业分类",
      field: 'cateName',
      component: 'JMsTreeSelect',
      required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          dropdownStyle:{height:'150px'},
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.cateId = e.selectCateId
          },
          disabled:isUpdate.value
        }
      },
   },
   {
     label: "",
     field: 'cateId',
     show:false,
     component: 'Input',
   },
  {
    label: '章',
    field: 'chapterId',
    required:false,
    show:false,
    component: 'JSearchSelect',
    // required:true,
    componentProps: {
      dict:"questions_chapter"
    },
  },
  {
    label: '节',
    field: 'sectionrId',
    show:false,
    component: 'JSearchSelect',
    componentProps: {
     dict:"questions_chapter_section"
    },
  },
  {
    label: '名称',
    field: 'name',
    required:true,
    component: 'Input',
  },
    {
      label: '排序',
      field: 'sortNum',
      required:true,
      component: 'InputNumber',
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
    field: 'pid',
    component: 'Input',
    show: false
  },
];
}
