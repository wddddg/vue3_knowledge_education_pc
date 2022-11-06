import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Switch,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './SystemMessage.api';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '设备',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '版本号',
    align:"center",
    dataIndex: 'version'
   },
   {
    title: '安装包大小',
    align:"center",
    dataIndex: 'size'
   },
   {
    title: '版本描述',
    align:"center",
    dataIndex: 'dispersion'
   },
   {
    title: '是否强制更新',
    align:"center",
    dataIndex: 'isElide_dictText',
    // customRender:({text}) =>{
    //   return text==1?"强制更新":"非强制"
    // },
   },
   {
    title: '下载路径',
    align:"center",
    dataIndex: 'downUrl'
   },
   {
    title: '安装包',
    align:"center",
    dataIndex: 'fileApk',
    slots:{customRender:'fileSlot'}
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "请选择设备",
      field: 'type',
      component: 'JSearchSelect',
      componentProps: {
        dict:"app_type"
      },
      // colProps: {span: 6},
   },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
      label: "设备",
      field: 'type',
      component: 'JSearchSelect',
      required:true,
      componentProps: {
        dict:"app_type"
      },
      // colProps: {span: 6},
   },
  {
    label: '版本号',
    field: 'version',
    required:true,
    component: 'Input',
  },
  {
    label: '安装包大小',
    field: 'size',
    required:true,
    component: 'Input',
  },
  {
    label: '版本描述',
    field: 'dispersion',
    required:true,
    component: 'Input',
  },
  {
    label: '是否强制更新',
    field: 'isElide',
    required:true,
    component: 'Switch',
    componentProps:function({formModel}) {
      formModel.isElide = 0
      return{
        checkedValue:1,
        unCheckedValue:0,
        checked:1,
        checkedChildren: '是',
        unCheckedChildren: '否',
      }
    },
  },
  {
    label: '下载路径',
    field: 'downUrl',
    required:true,
    component: 'Input',
  },
  {
    label: '安装包',
    field: 'fileApk',
    component: 'JUpload',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
