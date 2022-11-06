import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Select,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
import DefaultPicture from "/@/assets/images/default-picture.jpg";
//列表数据
export const columns: BasicColumn[] = [
  //  {
  //   title: '创建人',
  //   align: 'center',
  //   dataIndex: 'createBy'
  //  },
  //  {
  //   title: '创建日期',
  //   align: 'center',
  //   dataIndex: 'createTime',
  //   customRender:({text}) =>{
  //     return !text?"":(text.length>10?text.substr(0,10):text)
  //   },
  //  },
  //  {
  //   title: '父级节点',
  //   align: 'center',
  //   dataIndex: 'pid'
  //  },
  //  {
  //   title: '是否有子节点',
  //   align: 'left',
  //   dataIndex: 'hasChild'
  //  },
   {
    title: '分类名称',
    align: 'center',
    dataIndex: 'name'
   },
    {
      title:'会员是否免费',
      align:"center",
      dataIndex: 'costType',
      customRender:({text}) =>{
        return text==1?"是":text==0?'否':''
      },
    },
  //  {
  //    title:'免费会员类型',
  //    align:"left",
  //    dataIndex: 'memberType',
  //    customRender:({text}) =>{
  //      return text==1?"畅会员":text==2?'超级会员':'畅会员,超级会员'
  //    },
  //  },
  //  {
  //    title:'是否收费',
  //    align:"left",
  //    dataIndex: 'isCharge_dictText'
  //  },
  //  {
  //   title: '3个月费用',
  //   align: 'center',
  //   dataIndex: 'threePrice'
  //  },
  //  {
  //   title: '6个月费用',
  //   align: 'center',
  //   dataIndex: 'junePrice'
  //  },
  //  {
  //   title: '1年费用',
  //   align: 'center',
  //   dataIndex: 'oneYearPrice'
  //  },
   {
    title: '分类图片',
    align: 'center',
    dataIndex: 'img',
    customRender:({record}) =>{
      return h('img',{src:record.img,style:'height:80px;width:120px;', onError(){record.img = DefaultPicture}})
    },
   },
  //  {
  //   title: '价格冗余1',
  //   align: 'center',
  //   dataIndex: 'priceA'
  //  },
  //  {
  //   title: '价格冗余2',
  //   align: 'center',
  //   dataIndex: 'priceB'
  //  },
  //  {
  //   title: '价格冗余3',
  //   align: 'center',
  //   dataIndex: 'priceC'
  //  },
   {
    title: '是否推荐',
    align: 'center',
    dataIndex: 'isRecomment',
    customRender:({text}) =>{
      return text==1?"是":text==0?'否':''
    },
   },
   {
    title: '排序',
    align: 'center',
    dataIndex: 'sort'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
      label: "分类名称",
      field: 'name',
      component: 'Input',
      // componentProps: {
      //   dict:"img_type"
      // },
      colProps: {span: 6},
   },
];
//表单数据
export const formSchema: FormSchema[] = [
  // {
  //   label: '创建人',
  //   field: 'createBy',
  //   component: 'Input',
  // },
  // {
  //   label: '创建日期',
  //   field: 'createTime',
  //   component: 'DatePicker',
  // },
  {
    label: '父级节点',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: "system_category,name,id",
      pidField: "pid",
      pidValue: "0",
      hasChildField: "has_child",
    },
  },
  // {
  //   label: '是否有子节点',
  //   field: 'hasChild',
  //   component: 'Input',
  // },
  {
    label: '分类名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入分类名称!'},
          ];
     },
  },
  // {
  //   label: '3个月费用',
  //   field: 'threePrice',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '6个月费用',
  //   field: 'junePrice',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '1年费用',
  //   field: 'oneYearPrice',
  //   component: 'InputNumber',
  // },
  {
    label: '分类图片',
    field: 'img',
    component: 'JMsUpload',
  },
  // {
  //   label: '价格冗余1',
  //   field: 'priceA',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '价格冗余2',
  //   field: 'priceB',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '价格冗余3',
  //   field: 'priceC',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '是否推荐',
  //   field: 'isRecomment',
  //   component: 'InputNumber',
  // },
  {
    label: '是否推荐',
    field: 'isRecomment',
    component: 'RadioGroup',
    required: true,
    // itemProps: itemProp,
    componentProps:({formModel}) =>{
      return {
        // defaultValue: goodsValue,
        onchange(e) {
        },
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
      }
    },
  },
    {
      label: '会员是否免费',
      field: 'costType',
      component: 'RadioGroup',
      helpMessage: ['选择"否"则免费全部用户都可以练习'],
      required: true,
      // itemProps: itemProp,
      componentProps:({formModel}) =>{
        return {
          // defaultValue: goodsValue,
          onchange(e) {
          },
          options: [
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ],
        }
      },
    },
    {
      label: '免费会员类型',
      field: 'memberType',
      component: 'Select',
      required: true,
      show: ({ model }) => {
        return model.costType == '1';
      },
      dynamicRules({model}){

        if(model.costType == '1'){
          return [{ required: true,message: '不能为空' }]
        }else{
          return [{ required: false, }]
        }
      },
      componentProps:({formModel}) =>{
        return {
          // defaultValue: goodsValue,
          mode:"multiple",
          onchange(e) {
          },
          options: [
            {
              label: '畅会员',
              value: '1',
            },
            {
              label: '超级会员',
              value: '2',
            },
          ],
        }
      },
    },
  {
    label: '排序',
    field: 'sort',
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
