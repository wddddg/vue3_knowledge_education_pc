import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { cloneDeep } from 'lodash-es';
import { InputNumber } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { saveOrUpdateDict } from './MallGoodsClassify.api'
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '分类名称',
    align: 'left',
    dataIndex: 'name'
  },
  {
    title: '分类图片',
    align: 'center',
    dataIndex: 'imgUrl',
    customRender:({ text }) =>{
      return h('img',{ src:text,style:{ width:'30px',margin:'auto',height:'30px' } })
    }
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.sort || 0,
        loading: record.pendingStatus,
        onChange(value) {
          record.pendingStatus = true;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          saveOrUpdateDict({ id: data.id, sort: value },true)
            .then(() => {})
            .catch(() => {
              createMessage.error('修改排序失败');
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
    align: 'center',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '分类名称',
    field: 'name',
    component: 'Input',
    required:true
  },
  {
    label: '排序',
    field: 'sort',
    component: 'InputNumber',
  },
  {
    label: '分类图片',
    field: 'imgUrl',
    component: 'JMsUpload',
    componentProps: {
    },
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
    field: 'parentId',
    component: 'Input',
    show: false
  },
];
