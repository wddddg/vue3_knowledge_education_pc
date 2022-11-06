import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getDictItems } from '/@/api/common/api';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '页面标题',
    align: "center",
    dataIndex: 'title'
  },
  {
    title: '使用状态',
    align: "center",
    dataIndex: 'useStatus',
    customRender: ({ text }) => {
      const color = text == '1' ? 'green': 'yellow';
      return render.renderTag(text==1?"已使用":"未使用", color);
    },
  },
  {
    title: '使用终端',
    align: "center",
    dataIndex: 'useCategory',
    // customRender({ text }) {
    //   return text === 1 ? '苹果' : text === 2 ? '安卓' : text === 3 ? '小程序' : '公众号'
    // }
  },
  {
    title: '主题颜色',
    align: "center",
    dataIndex: 'themeColorStr',
  },
  {
    title: '更新日期',
    align: "center",
    dataIndex: 'updateTime',
    // customRender:({text}) =>{
    //   return !text?"":(text.length>10?text.substr(0,10):text)
    // },
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
    label: '颜色主题',
    field: 'themeColor',
    component: 'ApiRadioGroup',
    componentProps: {
      api: getDictItems,
      params: 'websiteTheme',
    },
  },
  {
    label: '主题预览',
    field: 'themePreview',
    component: 'Input',
    slot: 'imagePreview'
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
