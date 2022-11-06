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
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '试题名称',
    align:"center",
    dataIndex: 'name',
    width:250,
    ellipsis:true,
    customRender:({record}) => {
      return h('div',{style:'display:flex;text-align:left;align-items:center'},[h('img',{src:record.imgUrl,style:'height:80px;width:120px;'}),h('div',{style:'margin-left:10px'},[
        h('div',{style:'overflow:hidden;word-wrap: break-word;word-break: break-all;white-space: pre-line;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;',title:record.name},record.name)
      ])])
    },
  },
   {
    title: '行业类型',
    align:"center",
    dataIndex: 'cateId_dictText'
   },
   {
    title: '试题数',
    align:"center",
    dataIndex: 'examCount'
   },
   {
    title: '时长',
    align:"center",
    dataIndex: 'examTime'
   },
   {
    title: '分数',
    align:"center",
    dataIndex: 'fractionCount'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender:({record}) => {
       return  h(Switch,{
        checked: record.status == 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onClick(checked:boolean){
          record.pendingStatus = true;
          let newStatus = checked?1:0;
          const { createMessage } = useMessage();
          let data = cloneDeep(record);
          data.status = newStatus;
          saveOrUpdate(data,true).then(res =>{
            record.status = newStatus;
          }).catch(() => {
            createMessage.error('修改状态失败');
          }).finally(() => {
            record.pendingStatus = false;
          });
        }
       })
     },
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
       label: "试题名称",
       field: 'name',
       component: 'Input',
       componentProps: {
       },
       colProps: {span: 6},
    },
];
//表单数据
export const formSchema: FormSchema[] = [
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
  {
    label: '试题名称',
    field: 'name',
    required:true,
    component: 'Input',
  },
  {
    label: '试题数',
    field: 'examCount',
    component: 'InputNumber',
  },
  {
    label: '时长',
    field: 'examTime',
    component: 'InputNumber',
  },
  {
    label: '分数',
    field: 'fractionCount',
    component: 'InputNumber',
  },
  {
    label: '封面上传',
    field: 'imgUrl',
    component: 'JMsUpload',
    // required: true,
    componentProps: {},
    // colProps: {
    //   span: 12,
    //   offset: 0,
    // },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
