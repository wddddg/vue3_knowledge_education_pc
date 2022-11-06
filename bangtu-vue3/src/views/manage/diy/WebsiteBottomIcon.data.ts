import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { h } from 'vue';
import { render } from '/@/utils/common/renderUtils';
import TableImg from '/@/components/Table/src/components/TableImg.vue'
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '导航标题',
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
    title: '底部图片',
    align: "center",
    dataIndex: 'imgList',
    customRender({ text }) {
      return h(TableImg, { imgList: text, size: 60 })
    }
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
  // {
  //   label: '标题',
  //   field: 'title',
  //   component: 'Input',
  //   colProps: { span: 11, offset: 6 }
  // },
  {
    label: '',
    field: 'appAlert',
    component: 'Input',
    slot: 'appAlert',
    colProps: { span: 24, order: 0 }
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];
