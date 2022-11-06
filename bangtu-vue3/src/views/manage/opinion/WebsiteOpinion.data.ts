import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
// import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue'
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    align: 'left',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      return h('div', { style:{ display:'flex',"align-items": "center" } }, [
        h(render.renderImage({ text:record.headImg || '' }),{  })
        , h('div',{ style:{ display:'flex',"flex-direction": "column" }
      },[
        h('div',{ style:{ "margin-bottom":'5px' } },[record.nickName]),
        h('div',{style: { "font-size": '12px', "border-radius": '5px', "border":"1px soild rgb(144,146,151)" , color:'rgb(144,146,151)' ,'background-color': 'rgb(243,243,244)', padding:'1px 5px' } },[
           '电话:',record.phone
        ])
      ])]);
    },
  },
  {
    title: '反馈内容',
    align: 'center',
    dataIndex: 'content',
  },
  {
    title: '反馈时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  {
    title: '是否标记',
    align: 'center',
    dataIndex: 'isSign',
    customRender: ({ text }) => {
      const color = text == '1' ? 'red' : 'green';
      return render.renderTag(text == 1 ? '是' : '否', color);
    }
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '学员信息',
    field: 'searchParam',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '反馈时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '用户id',
    field: 'userId',
    component: 'Input',
  },
  {
    label: '是否标记 1、是0、否',
    field: 'isSign',
    component: 'InputNumber',
  },
  {
    label: '反馈建议描述',
    field: 'content',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
