import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { Switch, InputNumber, Radio, Input } from 'ant-design-vue';
import JMsUpload from '/@/components/Form/src/jeecg/components/JMsUpload.vue';
import { h, unref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { switchBtn, classify } from './MallGoodsInfo.api';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import JSelectCoupon from '/@/components/Form/src/jeecg/components/JSelectCoupon.vue'
import JSelectRelBiz from '/@/components/Form/src/jeecg/components/JSelectRelBiz.vue'
import { useMessage } from '/@/hooks/web/useMessage';
import DefaultPicture from "/@/assets/images/default-picture.jpg";
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '商品名称',
    align: "left",
    dataIndex: 'name',
    customRender: ({ record }) => {
      //
      return h('div', { style: 'display:flex;' }, [h('img', { src: record.imgUrl, style: 'height:80px;width:120px;', onError() { record.imgUrl = DefaultPicture } }), h('div', { style: 'margin-left:10px;display:flex;flex-direction: column;' }, [
        h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;' }, record.name),
        h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; color: rgb(254, 155, 42) ;' }, '积分：' + record.integralAmount),
        h('div', { style: ' white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; color: red ;' }, '￥' + record.price)
      ])])
    },
    width: 300
  },
  {
    title: '收费规则',
    align: "center",
    dataIndex: 'payRule',
    customRender: ({ text }) => {
      const color = text == '1' ? 'yellow' : text == '2' ? 'red' : 'blue';
      return render.renderTag(text === 1 ? '积分' : text === 2 ? '人民币' : '混合支付', color);
    },
    width: 80
  },
  {
    title: '商品类型',
    align: "center",
    dataIndex: 'goodsType',
    customRender({ text }) {
      let x = ''
      switch (text) {
        case 1: x = '实物商品'
          break;
        case 2: x = '优惠券'
          break;
        case 3: x = '线上课'
          break;
        case 4: x = '直播课'
          break;
        case 5: x = '线下课'
          break;
        case 6: x = '班级课'
          break;
        case 7: x = '电子书'
          break;
        case 8: x = '考点集'
          break;
        case 9: x = '畅会员'
          break;
        default: x = '超级会员'
          break;
      }
      return render.renderTag(x, 'cyan');
    },
    width: 80
  },
  {
    title: '商品分类',
    align: "center",
    dataIndex: 'oneClassifyName',
    customRender({ record }) {
      if (record?.twoClassifyName) {
        return record.oneClassifyName + '-' + record.twoClassifyName
      } else {
        return record.oneClassifyName
      }
    }
  },
  {
    title: '销量',
    align: "center",
    dataIndex: 'sales',
    width: 80
  },
  {
    title: '库存',
    align: "center",
    dataIndex: 'stockAmount',
    width: 80
  },
  {
    title: '上架状态',
    align: "center",
    dataIndex: 'status',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false;
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          // const { createMessage } = useMessage();
          // const data = cloneDeep(record);
          // data.status = newStatus;
          // data.ids = record.id ;
          let data = {}
          data.status = newStatus
          data.id = record.id
          switchBtn(data)
            .then(() => {
              record.status = newStatus;
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
    width: 80
  },
  {
    title: '是否推荐',
    align: "center",
    dataIndex: 'isRecommend',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false;
      }
      return h(Switch, {
        checked: record.isRecommend === 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
        loading: record.pendingStatus,
        onClick(checked: boolean) {
          record.pendingStatus = true;
          const newStatus = checked ? 1 : 0;
          // const { createMessage } = useMessage();
          // const data = cloneDeep(record);
          // data.status = newStatus;
          let data = {}
          data.isRecommend = newStatus
          data.id = record.id
          switchBtn(data)
            .then(() => {
              record.isRecommend = newStatus;
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
    width: 80
  },
  {
    title: '置顶排序',
    align: "center",
    dataIndex: 'sort',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.sort || 0,
        loading: record.pendingStatus,
        onChange(value) {
          record.pendingStatus = true;
          const { createMessage } = useMessage();
          const data = cloneDeep(record);
          switchBtn({ id: data.id, sort: value })
            .then(() => { })
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
    align: "center",
    dataIndex: 'createTime'
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "商品名称",
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: "商品类型",
    field: 'goodsType',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '实物商品', value: 1 },
        { label: '优惠券', value: 2 },
        { label: '线上课', value: 3 },
        { label: '线下课', value: 4 },
        { label: '班级课', value: 5 },
        { label: '电子书', value: 6 },
        { label: '考点集', value: 7 },
      ],
    },
  },
  {
    label: "商品分类",
    field: '',
    component: 'ApiTreeSelect',
    componentProps: ({ formActionType, formModel }) => {
      return {
        api: classify,
        resultField: 'records',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'subClassifyVOList',
        onChange: (value, name, list) => {
          if (list.triggerNode.dataRef.parentId != '0') {
            formModel.twoClassifyId = value
            formModel.oneClassifyId = list.triggerNode.dataRef.parentId
          } else {
            formModel.oneClassifyId = value
          }
        }
      }
    },
    colProps: { span: 6 },
  },
  {
    label: "",
    field: 'oneClassifyId',
    component: 'Input',
    defaultValue: '',
    show: false
  },
  {
    label: "",
    field: 'twoClassifyId',
    component: 'Input',
    defaultValue: '',
    show: false
  },
  {
    label: "上架状态",
    field: 'status',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '已上架', value: 1 },
        { label: '未上架', value: 0 },
      ],
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '基本信息',
    field: 'divider-basic',
    component: 'Divider',
  },
  {
    label: '商品名称',
    field: 'name',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入商品名称',
      },
    ],
  },
  {
    label: '所属分类',
    field: 'zeroClassifyId',
    component: 'ApiTreeSelect',
    componentProps: ({ formActionType, formModel }) => {
      return {
        api: classify,
        resultField: 'records',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'subClassifyVOList',
        onChange: (value, name, list) => {
          if (list.triggerNode.dataRef.parentId != '0') {
            formModel.twoClassifyId = value
            formModel.oneClassifyId = list.triggerNode.dataRef.parentId
          } else {
            formModel.oneClassifyId = value
          }
        }
      }
    },
    rules: [
      {
        required: true,
        message: '请选择所属分类',
      },
    ],
  },
  {
    label: '',
    field: 'oneClassifyId',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'twoClassifyId',
    component: 'Input',
    show: false
  },
  {
    label: '商品轮播图',
    field: 'imgUrl',
    component: 'JMsUpload',
    required: true,
    render: ({ model, field }) => {
      return h(JMsUpload, { value: model[field], onChange(value) { model[field] = value }, fileMax: 999 })
    },
  },
  {
    label: '',
    field: 'mallGoodsImgVOList',
    component: 'Input',
    show: false
  },
  {
    label: '购买信息',
    field: 'buy-basic',
    component: 'Divider',
  },
  {
    label: '收费规则',
    field: 'payRule',
    component: 'ApiRadioGroup',
    componentProps: {
      options: [
        { label: '积分', value: 1 },
        { label: '人民币', value: 2 },
        { label: '混合支付', value: 3 },
      ],
    },
    required: true,
  },
  {
    label: '商品类型',
    field: 'goodsType',
    component: 'ApiRadioGroup',
    required: true,
    componentProps: ({ formActionType, formModel }) => {
      return {
        options: [
          { label: '实物商品', value: 1 },
          { label: '优惠券', value: 2 },
          { label: '线上课', value: 3 },
          { label: '直播课', value: 4 },
          { label: '线下课', value: 5 },
          { label: '班级课', value: 6 },
          { label: '电子书', value: 7 },
          { label: '考点集', value: 8 },
          { label: '畅会员', value: 9 },
          { label: '超级会员', value: 10 },
        ],
        onChange(text) {
          formModel['goodsType'] = text
          formModel.businessId = []
          if (formModel.goodsType === 2 ||
            formModel.goodsType === 3 ||
            formModel.goodsType === 4 ||
            formModel.goodsType === 5 ||
            formModel.goodsType === 6 ||
            formModel.goodsType === 7 ||
            formModel.goodsType === 8) {
            formActionType.updateSchema({ field: 'businessId', ifShow: false })
            setTimeout(() => {
              formActionType.updateSchema({ field: 'businessId', ifShow: true })
            }, 100)
            formModel["expressType"] = 1
          } else {
            formActionType.updateSchema({ field: 'businessId', ifShow: false })
          }

        },
        value: formModel['goodsType']
      }
    },
  },
  {
    label: '选择名称',
    field: 'businessId',
    component: 'Input',
    required: true,
    render: ({ model, field }) => {
      if (!model.goodsType) return h('div')
      if (model.goodsType === 2) {
        return h(JSelectCoupon, {
          value: model[field],
          onChange(value) {
            model[field] = value
          },
          isRadioSelection: true,
        });
      } else if (model.goodsType === 3 || model.goodsType === 4 || model.goodsType === 5 || model.goodsType === 6) {
        return h(JSelectRelBiz, {
          showButton: false,
          "v-model": model['businessName'],
          value: model[field],
          onSelectedClassifyRows(value) {
            model[field] = value[0].businessId || value[0].id || ''
            model['businessName'] = value[0].businessName
            model['onclickType'] = value[0].onclickType
          },
          availableTabs: ['course-tab'],
        });
      } else if (model.goodsType === 7) {
        return h(JSelectRelBiz, {
          showButton: false,
          "v-model": model['businessName'],
          value: model[field],
          onSelectedClassifyRows(value) {
            model[field] = value[0].businessId || value[0].id || ''
            model['businessName'] = value[0].businessName
            model['onclickType'] = value[0].onclickType
          },
          availableTabs: ['book-tab']
        });
      } else {
        return h(JSelectRelBiz, {
          showButton: false,
          "v-model": model['businessName'],
          value: model[field],
          onSelectedClassifyRows(value) {
            model[field] = value[0].businessId || value[0].id || ''
            model['businessName'] = value[0].businessName
            model['onclickType'] = value[0].onclickType
          },
          availableTabs: ['exam-tab']
        });
      }
    },
    ifShow: ({ model }) => {
      if (model['goodsType']) {
        return true
      } else {
        return false
      }
    }
  },
  {
    label: '',
    field: 'businessId',
    component: 'Input',
    show: false
  },
  {
    label: '',
    field: 'onclickType',
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
    label: '所需积分',
    field: 'integralAmount',
    component: 'Input',
    defaultValue: '',
    ifShow({ values }) {
      return values.goodsType == 2
    },
  },
  {
    label: '所需价格',
    field: 'price',
    component: 'Input',
    defaultValue: '',
    ifShow({ values }) {
      return values.goodsType == 2
    },
  },
  {
    label: '商品设置',
    field: 'goodsSettings',
    component: 'Input',
    slot: 'alertSlot',
    defaultValue: '',
    ifShow({ values }) {
      return values.goodsType != 2
    },
  },
  {
    label: '',
    field: 'mallGoodsNorms',
    component: 'Input',
    slot: 'normsSlot',
    ifShow({ values }) {
      return values.goodsType != 2
    },
    itemProps: {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    },
  },
  {
    label: '销量',
    field: 'sales',
    component: 'Input',
    defaultValue: 0
  },
  {
    label: '快递类型',
    field: 'expressType',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '无需物流', value: '1' },
        { label: '免运费', value: '2' },
        { label: '运费金额', value: '3' },
      ],
    },
    slot: 'expressSlot',
    required: true,
  },
  {
    label: '详细信息',
    field: 'detailed-basic',
    component: 'Divider',
  },
  {
    label: '商品介绍',
    field: 'content',
    component: 'Input',
    required: true,
    render: render.renderTinymce,
    rules: [
      {
        required: true,
        message: '请输入商品介绍',
      },
    ],
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
];
// 编辑页商品设置数据
export const columnsForm: BasicColumn[] = [
  {
    title: '规格名称(或使用时长（月） 0为永久)',
    align: 'center',
    dataIndex: 'norms',
    customRender: ({ record }) => {
      return h('div', {}, [
        h(Input, {
          defaultValue: record.norms || '',
          onChange(value) {
            record.norms = value.target.value;
          },
        })
      ])
    },
  },
  {
    title: '所需价格',
    align: 'center',
    dataIndex: 'price',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.price || 0,
        onChange(value) {
          record.price = value;
        },
      });
    },
  },
  {
    title: '所需积分',
    align: 'center',
    dataIndex: 'integralAmount',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.integralAmount || 0,
        onChange(value) {
          record.integralAmount = value;
        },
      });
    },
  },
  {
    title: '库存',
    align: 'center',
    dataIndex: 'stockAmount',
    customRender: ({ record }) => {
      return h(InputNumber, {
        defaultValue: record.stockAmount || 0,
        onChange(value) {
          record.stockAmount = value;
        },
      });
    },
  },
];
