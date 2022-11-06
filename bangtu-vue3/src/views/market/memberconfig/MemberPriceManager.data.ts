import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch, InputNumber } from 'ant-design-vue';
import { h } from 'vue';
import { saveOrUpdate } from './MemberPriceManager.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import {render} from "/@/utils/common/renderUtils";
// import { rules} from '/@/utils/helper/validator';
// import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '标题',
    align: 'center',
    dataIndex: 'title',
  },
  {
    title: '价格',
    align: 'center',
    dataIndex: 'price',
    customRender: ({ text }) => {
      return h('div',{style:'color:red'},'￥'+text);
      // return '¥' + text;
    },
  },
  {
    title: '期限',
    align: 'center',
    dataIndex: 'termCount',
    customRender: ({ text }) => {
      if (text == 0){
        return render.renderTag('永久有效', 'cyan');
      }else {
        return render.renderTag(text+'个月', 'blue');
      }
    },
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
          saveOrUpdate({ id: data.id, sort: value }, true)
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
    title: '是否推荐',
    align: 'center',
    dataIndex: 'isRecommend',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'isRecommend')) {
        record.isRecommend = false;
      }
      return h(Switch, {
        checked: record.isRecommend === 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isRecommend = newStatus;
          saveOrUpdate({ id: data.id, isRecommend: newStatus }, true)
            .then(() => {
              record.isRecommend = newStatus;
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '是否启用',
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
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          data.isEnable = newStatus;
          saveOrUpdate({ id: data.id, isEnable: newStatus }, true)
            .then(() => {
              record.isEnable = newStatus;
            })
            .catch(() => {
              createMessage.error('修改失败');
            })
            .finally(() => {
              record.pendingStatus = false;
            });
        },
      });
    },
  },
  {
    title: '更新日期',
    align: 'center',
    dataIndex: 'createTime',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remarks',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入标题!' }];
    },
  },
  {
    label: '价格',
    field: 'price',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入价格!' }];
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
  },
  {
    label: '时间',
    field: 'termCount',
    component: 'RadioGroup',
    componentProps: () => {
      return {
        options: [
          { label: '永久有效', value: 0, key: '0' },
          { label: '自定义月数', value: 1, key: '1' },
        ],
      };
    },
    slot: 'customSlot',
    dynamicRules: () => {
      return [{ required: true, message: '请选择时间!' }];
    },
  },
  {
    label: '排序',
    field: 'sort',
    component: 'InputNumber',
  },
  {
    label: '备注',
    field: 'remarks',
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
