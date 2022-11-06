import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Switch,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './SystemHistoryExam.api';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
import DefaultPicture from "/@/assets/images/default-picture.jpg";
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '标题',
    align:"center",
    dataIndex: 'title'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'descript'
   },
   {
    title: '封面图',
    align:"center",
    dataIndex: 'img',
    customRender:({record}) => {
       return h('img',{src:record.img,style:'height:80px;width:120px;', onError(){record.img = DefaultPicture}})
    },
   },
   {
    title: '云盘地址',
    align:"center",
    dataIndex: 'dataUrl'
   },
   {
    title: '分类',
    align:"center",
    dataIndex: 'cateId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "行业分类",
      field: '',
      component: 'JMsTreeSelect',
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
      label: '标题',
      field: 'title',
      component: 'Input',
    },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    required:true,
    component: 'Input',
  },
  {
    label: '描述',
    field: 'descript',
    required:true,
    component: 'Input',
  },
  {
    label: '封面图',
    field: 'img',
    required:true,
    component: 'JMsUpload',
  },
  {
    label: '云盘地址',
    field: 'dataUrl',
    required:true,
    component: 'Input',
  },
  {
      label: "行业分类",
      field: 'cateName',
      component: 'JMsTreeSelect',
      required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          dropdownStyle:{height:'200px'},
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.cateId = e.selectCateId
          }
        }
      },
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
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
