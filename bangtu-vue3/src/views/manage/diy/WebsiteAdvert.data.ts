import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '广告标题',
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
    title: '图片',
    align: "center",
    dataIndex: 'imgUrl',
    // customRender: render.renderImage,
    customRender({ text }) {
      return h('img',{ src:text, style:{ width:'50px',margin:'auto' } })
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
  //   colProps: { span: 11, offset: 6 },
  //   slot: 'appTitle',
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

export const formSchemaAdvert: FormSchema[] = [
  {
    label: '图片',
    field: 'imgUrl',
    component: 'JMsUpload',
    slot: 'imgUrl'
  },
  {
    label: '链接',
    field: 'business',
    component: 'JSelectRelBiz',
    componentProps:({ formModel }) =>{
      return {
        label: formModel['businessName'],
        onSelectedClassifyRows(value){
          formModel['businessId'] = value[0].id || value[0].businessId || ''
          formModel['businessName'] = value[0].businessName || ''
          formModel['onclickType'] = value[0].onclickType || ''
          formModel['onclickUrl'] = value[0].onclickUrl || ''
        },
        showButton:false,
        availableTabs:['page-tab', 'link-tab', 'course-tab', 'class-tab', 'exam-tab', 'book-tab', 'goods-tab', 'article-tab']
      }
    }
  },
  {
    label: '',
    field: 'businessId',
    component: 'Input',
    show:false
  },
  {
    label: '',
    field: 'businessName',
    component: 'Input',
    show:false
  },
  {
    label: '',
    field: 'onclickType',
    component: 'Input',
    show:false
  },
  {
    label: '',
    field: 'onclickUrl',
    component: 'Input',
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
