import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {h} from 'vue'
import { Switch,Avatar } from 'ant-design-vue';
import Icon from '/@/components/Icon';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './SystemExam.api';
import { useMessage } from '/@/hooks/web/useMessage';
import { tuple } from 'ant-design-vue/lib/_util/type';
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
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '名称',
    align:"center",
    dataIndex: 'name',
    width:250,
    ellipsis:true,
    customRender:({record}) => {
      //
       return h('div',{style:'display:flex;align-items:center'},[h('img',{src:record.imgUrl,style:'height:80px;width:120px;'}),h('div',{style:'margin-left:10px'},[
        h('div',{style:'overflow:hidden;word-wrap: break-word;word-break: break-all;white-space: pre-line;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;'},record.name)
       ])])
    },
   },
   {
    title: '行业分类',
    align:"center",
    dataIndex: 'cateId_dictText'
   },
   {
    title: '摘要',
    align:"center",
    dataIndex: 'examSummary'
   },
   {
    title: '及格分数',
    align:"center",
    dataIndex: 'jgCount'
   },
   {
    title: '试题数',
    align:"center",
    dataIndex: 'examCount'
   },
   {
    title: '时长',
    align:"center",
    dataIndex: 'examTime'
   },
   {
    title: '分数',
    align:"center",
    dataIndex: 'fractionCount'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender:({record}) => {
       return  h(Switch,{
        checked: record.status == 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onClick(checked:boolean){
          record.pendingStatus = true;
          let newStatus = checked?1:0;
          const { createMessage } = useMessage();
          let data = cloneDeep(record);
          data.status = newStatus;
          saveOrUpdate(data,true).then(res =>{
            record.status = newStatus;
          }).catch(() => {
            createMessage.error('修改状态失败');
          }).finally(() => {
            record.pendingStatus = false;
          });
        }
       })
     },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = function(userRoleType){
  return [
  {
      label: "行业分类",
      field: '',
      component: 'JMsTreeSelect',
      // required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.cateId = e.selectCateId
          }
        }
      },
      colProps: {span: 6},
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'cateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "讲师名称",
      field: 'teacherId',
      component: 'JSelectTeacher',
      show:function(){
        return userRoleType!=2
      },
      colProps: {span: 6},
 	},
];
}
//表单数据
export const formSchema: FormSchema[] = function(userRoleType){
  return  [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    required:true,
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '负责讲师',
    field: 'teacherId',
    itemProps:itemProp,
    component: 'JSelectTeacher',
    colProps: {
      span: 12,
    },
    show:function(){
      return userRoleType!=2
    },
    componentProps: {
      rowKey: 'id',
      labelKey: 'name',
      isRadioSelection: true,
      placeholder: '请选择',
      disabled:userRoleType==2
    },
    // show:!(userRoleType==2)
  },
  {
      label: "行业分类",
      field: 'cateName',
      component: 'JMsTreeSelect',
      // required:true,
      required:true,
      componentProps: ({formActionType,formModel}) => {
        return {
          onChange:function(e){
            console.log(formModel,e)
            formModel.oneCateId = e.oneCateId //e.oneCateId
            formModel.twoCateId = e.twoCateId
            formModel.threeCateId = e.threeCateId
            formModel.cateId = e.selectCateId
          }
        }
      },
      itemProps:itemProp,
      colProps: {
        span: 12,
        offset: 0,
      },
   },
   {
     label: "",
     field: 'threeCateId',
     show:false,
     component: 'Input',
     colProps: {span: 6},
   },
    {
      label: "",
      field: 'oneCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'twoCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'cateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
  {
    label: '考试模式',
    field: 'examPattern',
    component: 'JSearchSelect',
    required:true,
    componentProps: {
      dict:"exam_pattern"
    },
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '试题数',
    field: 'examCount',
    component: 'InputNumber',
    required:true,
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '时长',
    field: 'examTime',
    required:true,
    component: 'InputNumber',
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '分数',
    field: 'fractionCount',
    required:true,
    component: 'InputNumber',
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '及格分数',
    field: 'jgCount',
    required:true,
    component: 'InputNumber',
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '单选题数量',
    field: 'danxuanCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '多选题数量',
    field: 'duoxuanCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '单选题分数',
    field: 'dxFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '多选题分数',
    field: 'duxFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '不定项题数量',
    field: 'budingxiangCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '问答题数量',
    field: 'wendaCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '不定项题分数',
    field: 'bdxFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '问答题分数',
    field: 'wdFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '判断题数量',
    field: 'panduanCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: ' 填空题数量',
    field: 'tiankongCount',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '判断题分数量',
    field: 'pdFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '填空题分数',
    field: 'tkFs',
    component: 'InputNumber',
    itemProps:itemProp,
    componentProps:{
      disabled:true
    },
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '摘要',
    field: 'examSummary',
    component: 'Input',
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '考试难度',
    field: 'difficulty',
    component: 'JSearchSelect',
    componentProps: {
      dict:"difficulty"
    },
    itemProps:itemProp,
    colProps: {
      span: 12,
      offset: 0,
    },
  },
  {
    label: '封面上传',
    field: 'imgUrl',
    component: 'JMsUpload',
    itemProps: itemProp,
    // required: true,
    componentProps: {},
    colProps: {
      span: 12,
      offset: 0,
    },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
}
export const addformSchema: FormSchema[] = function (Count) {
  return [
{
  label: '单选题数量',
  field: 'inputDanxuan',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.danxuanCount+'道',
  },
  componentProps:{
    max:Count.value.danxuanCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '多选题数量',
  field: 'inputDuoxuan',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.duoxuanCount+'道',
  },
  componentProps:{
    max:Count.value.duoxuanCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '单选题分数',
  field: 'inputDanxuanFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '多选题分数',
  field: 'inputDuoxuanFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '不定项题数量',
  field: 'inputBdx',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.budingxiangCount+'道',
  },
  componentProps:{
    max:Count.value.budingxiangCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '问答题数量',
  field: 'inputWd',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.wendaCount+'道',
  },
  componentProps:{
    max:Count.value.wendaCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '不定项题分数',
  field: 'inputBdxFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '问答题分数',
  field: 'inputWdFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '判断题数量',
  field: 'inputPd',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.panduanCount+'道',
  },
  componentProps:{
    max:Count.value.panduanCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: ' 填空题数量',
  field: 'inputTk',
  component: 'InputNumber',
  itemProps: {
    ...itemProp,
    extra: '共'+Count.value.tiankongCount+'道',
  },
  componentProps:{
    max:Count.value.tiankongCount
  },
  ifShow: ({ model }) => {
    return model.examPattern == 2;
  },
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '判断题分数',
  field: 'inputPdFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '填空题分数',
  field: 'inputTkFs',
  component: 'InputNumber',
  itemProps:itemProp,
  colProps: {
    span: 12,
    offset: 0,
  },
},
{
  label: '',
  field: 'examPattern',
  component: 'Input',
  show:false,
},
]
}
