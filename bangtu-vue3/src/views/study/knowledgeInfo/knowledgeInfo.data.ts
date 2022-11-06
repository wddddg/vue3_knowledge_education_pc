import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import {h} from 'vue'
import { Switch } from 'ant-design-vue';
import { render } from '/@/utils/common/renderUtils';
import { cloneDeep } from 'lodash-es';
import { saveOrUpdate } from './knowledgeInfo.api';
import { useMessage } from '/@/hooks/web/useMessage';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '资料信息',
    align:"left",
    dataIndex: 'name',
    width:300,
    // ellipsis:true,
    customRender:({record}) => {
      //
       return h('div',{style:'display:flex;'},[h('img',{src:record.imgUrl,style:'height:80px;width:120px;'}),h('div',{style:'margin-left:10px;display:flex;flex-direction: column;justify-content: space-between; '},[
        h('a-tooltip',{style:'overflow:hidden;word-wrap: break-word;word-break: break-all;white-space: pre-line;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;',title:record.name},record.name),
        h('div',{style:'color:red'},'￥'+record.presentPrice)
       ])])
    },
    // slots:{customRender:'detail'}
   },
   {
    title: '资料分类',
    align:"left",
    // dataIndex: 'oneCateName',
    customRender:({record}) => {
      let one = record.oneCateName?record.oneCateName:''
      let two = record.twoCateName?'-'+record.twoCateName:''
      let three = record.threeCateName?'-'+record.threeCateName:''
       return one+two+three
     },
   },
  {
    title: '收费规则',
    align:"center",
    dataIndex: 'costType',
    customRender: ({ text }) => {
      const color = text == '1' ? 'green' : text == '2' ? 'yellow' : 'red';
      return render.renderTag(text==1?'免费书籍':text==2?'会员免费':'全部收费', color);
    }
  },
   {
    title: '是否推荐',
    align:"center",
    dataIndex: 'isRecommend',
    customRender:({record}) => {
       return h('div',{
        style:record.isRecommend==1?'color:#009c21':'color:#3b87e8',
      },[record.isRecommend==1?'已推荐':'未推荐',h('div',{style:'color:#ff0017'},record.weight&&record.isRecommend==1?'权重 '+record.weight:'')])
     },
   },
   {
    title: '置顶状态',
    align:"center",
    dataIndex: 'isTop',
    customRender:({record}) => {
       return h('div',{
        style:record.isTop==1?'color:#009c21':'color:#3b87e8',
      },[record.isTop==1?'已置顶':'未置顶',h('div',{style:'color:#ff0017'},record.topSort&&record.isTop?'权重 '+record.topSort:'')])
     },
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'isEnable',
    customRender:({record}) => {
       return  h(Switch,{
        checked: record.isEnable == 1,
        checkedChildren: '停用',
        unCheckedChildren: '启用',
        loading: record.pendingStatus,
        onClick(checked:boolean){
          record.pendingStatus = true;
          let newStatus = checked?1:0;
          const { createMessage } = useMessage();
          let data = cloneDeep(record);
          data.isEnable = newStatus;
          saveOrUpdate(data,true).then(res =>{
            record.isEnable = newStatus;
          }).catch(() => {
            createMessage.error('修改状态失败');
          }).finally(() => {
            record.pendingStatus = false;
          });
        }
       })
     },
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,16):text)
    },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资料名称",
      field: 'name',
      component: 'Input',
      componentProps: {
      },
      colProps: {span: 6},
 	},
	{
      label: "讲师名称",
      field: 'teacherId',
      component: 'JSelectTeacher',
      componentProps:{
        isRadioSelection:true,
      },
      colProps: {span: 6},
 	},
   {
       label: "资料分类",
       field: '',
       component: 'JMsTreeSelect',
       componentProps: ({formActionType,formModel}) => {
         return {
           onChange:function(e){
             console.log(formModel,e)
             formModel.oneCateId = e.oneCateId //e.oneCateId
             formModel.twoCateId = e.twoCateId
             formModel.threeCateId = e.threeCateId
           }
         }
       },
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
      field: 'threeCateId',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
   {
       label: "上架状态",
       field: 'isEnable',
       component: 'Select',
       componentProps: {
         options: [
           {
             label: '是',
             value: 1,
           },
           {
             label: '否',
             value: 0,
           }
         ],
       },
       colProps: {span: 6},
    },
    {
        label: "创建时间",
        field: '',
        component: 'RangePicker',
        componentProps:({formModel})=> {
          return {
            format: 'YYYY-MM-DD',
            onChange:function (e,value){

              value[0]? formModel.startTime =  value[0] + ' 00:00:00':formModel.startTime = ''
              value[1]? formModel.endTime =  value[1] + ' 23:59:59':formModel.endTime = ''
            }
          }
        },
        colProps: {span: 6},
     },
     {
      label: "",
      field: 'startTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
    {
      label: "",
      field: 'endTime',
      show:false,
      component: 'Input',
      colProps: {span: 6},
    },
];
