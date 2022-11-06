import { FormSchema } from '/@/components/Form';
import { render } from '/@/utils/common/renderUtils';
import { saveOrUpdate, byId, loadTreeRoot, loadTreeRootChild } from '../BookInfo.api';
import { v } from 'vxe-table';
import { h } from 'vue';

const itemProp = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
export const schemasClass: FormSchema[] = function (rootTreeData, threeCateId, twoCateId, oneCateId, userRoleType) {
  return [
    {
      label: '',
      field: 'id',
      show: false,
      component: 'Input',
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
    },
    {
      label: '书籍名称',
      field: 'name',
      component: 'Input',
      required: true,
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
    },
    {
      label: '讲师名称',
      field: 'teacherId',
      component: 'JSelectTeacher',
      itemProps: itemProp,
      required: true,
      colProps: {
        span: 12,
      },
      componentProps: {
        rowKey: 'id',
        labelKey: 'name',
        value: 'name',
        isRadioSelection: true,
        placeholder: '请选择',
        disabled: userRoleType == 2,
      },
    },
    {
      label: '资料分类',
      field: 'cateName',
      component: 'JMsTreeSelect',
      required: true,
      itemProps: itemProp,
      componentProps: {
        onChange: function (e) {
          threeCateId.value = e.threeCateId;
          twoCateId.value = e.twoCateId;
          oneCateId.value = e.oneCateId;
        },
      },
      colProps: {
        span: 12,
      },
    },
    // {
    //   label: '资料分类',
    //   field: 'oneCateId',
    //   component: 'TreeSelect',
    //   componentProps: {
    //     treeData: [],
    //     placeholder: '请选择资料分类',
    //     dropdownStyle: { maxHeight: '200px', overflow: 'auto' },
    //     treeDataSimpleMode:true,
    //     loadData: (treeNode: any) => {
    //       return new Promise( async (resolve: (value?: unknown) => void) => {
    //         const { id,hasChild,value:parentValue } = treeNode.dataRef;
    //         
    //         let childrenNode = []
    //         if(hasChild == 1){
    //           await loadTreeRootChild({pid:id }).then(res=>{
    //             res.records.forEach(((item,k)=>{
    //                 item.hasChild == 1?item.isLeaf = false:item.isLeaf = true;
    //                 item.title = item.name;
    //                 item.pId = item.pid;
    //                 if(parentValue.indexOf('b') != -1){
    //                   item.value = parentValue + 'c'+k
    //                 }else{
    //                   item.value = parentValue + 'b'+k
    //                 }
    //             }))
    //             childrenNode = res.records
    //           })
    //         }
    //         setTimeout(() => {
    //           rootTreeData.value = rootTreeData.value.concat([...childrenNode]);
    //           resolve();
    //         }, 300);
    //       });
    //     },
    //     onChange: function(v,l,e){
    //       
    //       let selectNode = e.triggerNode.dataRef
    //       let threeCateId =  ''
    //       let twoCateId =  ''
    //       let oneCateId =  ''
    //       if(v.indexOf('c')!='-1'){
    //         threeCateId = selectNode.id
    //         for(let i = 0;i<rootTreeData.value.length;i++){
    //           if(rootTreeData.value[i].id==selectNode.pId){
    //             twoCateId = rootTreeData.value[i].id
    //             for(let k = 0;k<rootTreeData.value.length;k++){
    //               if(rootTreeData.value[k].id==rootTreeData.value[i].pId){
    //                 oneCateId = rootTreeData.value[k].id
    //                 return
    //               }
    //             }
    //             return
    //           }
    //         }
    //       }else if(v.indexOf('b')!='-1'){
    //         twoCateId = selectNode.id
    //         for(let i = 0;i<rootTreeData.value.length;i++){
    //           if(rootTreeData.value[i].id==selectNode.pId){
    //             oneCateId = rootTreeData.value[i].id
    //             return
    //           }
    //         }
    //       }else if(v.indexOf('a')!='-1'){
    //         oneCateId = e.dataRef.id
    //       }
    //     }
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '请选择资料分类',
    //     },
    //   ],
    //   colProps: {
    //       span: 12
    //   },
    // },
    {
      label: '模拟观看人数',
      field: 'studyCount',
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
      },
      // itemProps:itemProp,
      itemProps: {
        ...itemProp,
        extra: '谨慎填写学习人数',
      },
      colProps: {
        span: 12,
      },
    },
    {
      label: '书籍来源',
      field: 'sourceType',
      component: 'RadioGroup',
      itemProps: itemProp,
      required: true,
      componentProps: {
        options: [
          {
            label: '原创',
            value: 1,
          },
          {
            label: '转载',
            value: 2,
          },
        ],
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '转载来源',
      field: 'sourceContent',
      component: 'Input',
      show: ({ model }) => {
        return model.sourceType == '2';
      },
      itemProps: itemProp,
      colProps: {
        span: 12,
      },
    },
    {
      label: '为公共书籍',
      field: 'isCommon',
      component: 'Switch',
      required: true,
      itemProps: itemProp,
      componentProps: function ({ formModel }) {
        formModel.isCommon = 0;
        
        return {
          checkedValue: 1,
          unCheckedValue: 0,
          checked: 1,
          checkedChildren: '是',
          unCheckedChildren: '否',
        };
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
    {
      label: '封面上传',
      field: 'imgUrl',
      itemProps: itemProp,
      required: true,
      component: 'JMsUpload',
      componentProps: {
        fileMax: 1,
      },
      colProps: {
        span: 12,
        offset: 0,
      },
    },
  ];
};
export const schemasCharge: FormSchema[] = [
  {
    label: '收费规则',
    field: 'costType',
    component: 'RadioGroup',
    required: true,
    itemProps: itemProp,
    componentProps: {
      options: [
        {
          label: '免费课程',
          value: 1,
        },
        {
          label: '会员免费',
          value: 2,
        },
        {
          label: '全部收费',
          value: 3,
        },
      ],
    },
    colProps: {
      span: 12,
       offset: 6
    },
  },
  {
    label: '原价',
    field: 'originalPrice',
    component: 'Input',
    show: ({ model }) => {
      return model.costType == 3;
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
    dynamicRules({ model }) {
      if (model?.costType == 3) {
        return [{ required: true, message: '不能为空' }];
      } else {
        return [{ required: false }];
      }
    },
    required: true,
    itemProps: itemProp,
    colProps: {
      span: 12,
      //  offset: 6
    },
  },
  {
    label: '现价',
    field: 'presentPrice',
    component: 'Input',
    show: ({ model }) => {
      return model.costType == 3;
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '元',
      type: 'number',
    },
    dynamicRules({ model }) {
      if (model?.costType == 3) {
        return [{ required: true, message: '不能为空' }];
      } else {
        return [{ required: false }];
      }
    },
    itemProps: itemProp,
    required: true,
    colProps: {
      span: 12,
      //  offset: 6
    },
  },
  {
    label: '会员打折',
    field: 'isMemberDiscount',
    component: 'Switch',
    itemProps: itemProp,
    required: true,
    show: ({ model }) => {
      return model.costType == 3;
    },
    dynamicRules({ model }) {
      if (model?.costType == 3) {
        return [{ required: true, message: '不能为空' }];
      } else {
        return [{ required: false }];
      }
    },
    componentProps: function ({ formModel }) {
      formModel.isMemberDiscount = 0;
      
      return {
        checkedValue: 1,
        unCheckedValue: 0,
        checked: 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
      };
    },
    colProps: {
      span: 12,
      //  offset: 6
    },
  },
  {
    label: '会员折扣额度',
    field: 'discountAmount',
    component: 'Input',
    show: ({ model }) => {
      return model.costType == 3 && model.isMemberDiscount == 1;
    },
    dynamicRules({ model }) {
      if (model?.costType == 3 && model.isMemberDiscount == 1) {
        return [{ required: true, message: '不能为空' }];
      } else {
        return [{ required: false }];
      }
    },
    componentProps: {
      style: 'width:100%',
      addonAfter: '折',
      type: 'number',
    },
    itemProps: itemProp,
    required: true,
    colProps: {
      span: 12,
      //  offset: 6
    },
  },
  {
    label: '可否使用优惠卷',
    field: 'isCoupon',
    component: 'Switch',
    required: true,
    itemProps: itemProp,
    show: ({ model }) => {
      return model.costType == 3;
    },
    dynamicRules({ model }) {
      if (model?.costType == 3) {
        return [{ required: true, message: '不能为空' }];
      } else {
        return [{ required: false }];
      }
    },
    componentProps: function ({ formModel }) {
      formModel.isCoupon = 0;
      
      return {
        checkedValue: 1,
        unCheckedValue: 0,
        checked: 1,
        checkedChildren: '是',
        unCheckedChildren: '否',
      };
    },
    colProps: {
      span: 12,
      //  offset: 6
    },
  },
];
export const schemasCentont: FormSchema[] = [
  {
    label: '书籍导语',
    field: 'remark',
    component: 'Input',
    itemProps: itemProp,
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    label: '书籍摘要',
    field: 'summary',
    component: 'Input',
    itemProps: itemProp,
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'content',
    label: '内容',
    component: 'JEditor',
    required: true,
    itemProps: {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        sm: { span: 21 },
      },
    },
    // render: render.renderTinymce,
    colProps: {
      span: 24,
    },
  },
];
