import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { cloneDeep } from 'lodash-es';
import { Input } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { editTitle } from './WebsiteHtmlCustom.api'
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '页面备注',
    align:"center",
    dataIndex: 'title',
    customRender: ({ record }) => {
      return h(Input, {
        defaultValue: record.title || '',
        loading: record.pendingStatus,
        onChange(value) {
          console.log(value);
          
          record.pendingStatus = true;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          editTitle({ id: data.id, title: value.target.value })
            .then(() => {})
            .catch(() => {
              createMessage.error('修改页面备注失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
   },
   
   {
    title: '使用状态',
    align:"center",
    dataIndex: 'useStatus',
     customRender: ({ text }) => {
       const color = text == '1' ? 'green': 'yellow';
       return render.renderTag(text==1?"已使用":"未使用", color);
     },
   },
   {
    title: '使用终端',
    align:"center",
    dataIndex: 'useCategory',
    // customRender:({text}) =>{
    //   return text==1?"苹果":text==2?"安卓":text==3?"小程序":"公众号"
    // },
   },
   {
    title: '页面类型',
    align:"center",
    dataIndex: 'pageType',
    customRender:({text}) =>{
      return render.renderTag(text==1?"首页":"首页", 'cyan');
      // return text==1?"首页":"首页"
    },
   },
   {
    title: '更新日期',
    align:"center",
    dataIndex: 'updateTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,16):text)
    },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '使用状态 1、已使用 0、未使用',
    field: 'useStatus',
    component: 'InputNumber',
  },
  {
    label: '使用终端1、苹果 2、安卓3、小程序4、公众号',
    field: 'useCategory',
    component: 'Input',
  },
  {
    label: '页面类型：1、首页',
    field: 'pageType',
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

// useFormSchema
export const useFormSchema: FormSchema[] = [
  {
    label: '终端',
    field: 'useCategory',
    component: 'JCheckbox',
    componentProps: {
      options: [
        { label: '苹果', value: '1' },
        { label: '安卓', value: '2' },
        { label: '小程序', value: '3' },
        { label: '公众号', value: '4' },
      ],
    },
  },
  {
    label: '',
    field: 'useStatus',
    component: 'Input',
    defaultValue: '1',
    show:false
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];
