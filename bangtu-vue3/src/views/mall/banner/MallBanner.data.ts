import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch } from 'ant-design-vue';
import { switchBtn } from './MallBanner.api';
import { h } from 'vue';
import { cloneDeep } from 'lodash-es';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '封面',
    align: "center",
    dataIndex: 'imgUrl',
    customRender:({ text }) =>{
      return h('img',{ src:text,style:{ width:'120px',margin:'auto',height:'80px' } })
    }
  },
  {
    title: '标题',
    align: "center",
    dataIndex: 'title'
  },
  {
    title: '关联内容',
    align: "center",
    dataIndex: 'businessName',
    customRender: ({ text }) => {
      return render.renderTag(text, 'cyan');
    },
  },
  {
    title: '启动状态',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isEnable')) {
        record.isEnable = false;
      }
      return h(Switch, {
        checked: record.isEnable === 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          // const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isEnable = newStatus;
          switchBtn(data)
            .then(() => {
              record.isEnable = newStatus;
              //createMessage.success(`已成功修改会员状态`);
            })
            .catch(() => {
              // createMessage.error('修改会员状态失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '创建时间',
    align: "center",
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "标题",
    field: 'title',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '跳转链接',
    field: 'businessId',
    component: 'JSelectRelBiz',
    componentProps:({ formModel }) =>{
      return {
          label:formModel.businessName,
          availableTabs:['page-tab', 'link-tab', 'course-tab', 'class-tab', 'exam-tab', 'book-tab', 'goods-tab', 'article-tab'],
        onSelectedClassifyRows(rows){
          formModel['businessId'] = rows[0]?.businessId;
          formModel['businessName'] = rows[0]?.businessName;
          formModel['onclickType'] = rows[0]?.onclickType;
          formModel['jumpUrl'] = rows[0]?.onclickUrl;

        }
      }
    }
  },
  {
    label: '排序',
    field: 'sort',
    component: 'InputNumber',
  },
  {
    label: 'banner图',
    field: 'imgUrl',
    component: 'JMsUpload',
    componentProps: {
        availableTabs:['page-tab'],
        //multiple:true,
        // fileMax:100,
    },
  },
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'businessName',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'jumpUrl',
    component: 'Input',
    show: false
  },

  {
    label: '',
    field: 'onclickType',
    component: 'Input',
    show: false
  },
];
