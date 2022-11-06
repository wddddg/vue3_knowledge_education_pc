import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { updateData } from './SystemMember.api';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';
import { getDictItems } from '/@/api/common/api';
import moment from 'moment'
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '会员昵称',
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
  //  {
  //   title: '头像',
  //   align:"center",
  //   dataIndex: 'headImg',
  //   customRender:render.renderImage,
  //  },
  {
    title:'会员分类',
    align:"center",
    dataIndex: 'memberTypeStr'
  },
  {
    title:'开通日期',
    align:"center",
    dataIndex: 'createTime',
    customRender:function ({text}) {
      return !text?"":(text.length>10?text.substr(0,10):text)
    }
  },
  {
    title:'到期日期',
    align:"center",
    dataIndex: 'endTime',
    customRender:function ({text}) {
      return !text?"":(text.length>10?text.substr(0,10):text)
    }
  },
  {
    title:'剩余天数',
    align:"center",
    dataIndex: 'endDay',
    customRender:function ({record}) {
      let dc=(record.createTime.length>10?record.createTime.substr(0,10):record.createTime);
      let dn=(record.endTime.length>10?record.endTime.substr(0,10):record.endTime);
      let time1 = Date.parse(new Date(dc));
         let time2 = Date.parse(dn);
         let nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
         return  nDays;

    }
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "会员姓名",
      field: 'nickName',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "会员手机",
      field: 'phone',
      component: 'Input',
      colProps: {span: 6},
 	},
   {
       label: "会员类型",
       field: 'memberType',
       component: 'Select',
       componentProps: {
         options: [
           {
             label: '畅会员',
             value: 1,
           },
           {
             label: '超级会员',
             value: 2,
           }
         ],
       },
       colProps: {span: 6},
    },
    {
      label: '到期日期',
      field: 'endTime',
      component: 'DatePicker',
      componentProps:({formModel})=> {
        return {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          // showTime:true,
          // disabledDate:function (current){
          //   return current < moment().add(-1, 'd');
          // }
        }
      },
    },
];
//表单数据
export const formSchema: FormSchema[] = function (isUpdate){
  return [
  // {
  //   label: '会员',
  //   field: 'memberId',
  //   component: 'JPopup',
  //   componentProps:({formActionType,formModel}) =>{
  //     return {
  //       multi:"true",
  //       code:"system_member",
  //       fieldConfig:[{ source: 'id', target: 'memberId' },]
  //     }
  //   }
  // },
  {
    label: '会员昵称',
    field: 'userIds',
    component: 'JSelectMember',
    required: !isUpdate.value,
    componentProps: {
      rowKey: 'id',
      labelKey: 'nickName',
      isRadioSelection: false,
      placeholder: '请选择',
      disabled:isUpdate.value
    },
    // show:!(userRoleType==2)
  },
  {
    label: '会员类型',
    field: 'memberType',
    component: 'RadioGroup',
    // required: true,
    componentProps: {
      options: [
        {
          label: '畅会员',
          value: 1,
        },
        {
          label: '超级会员',
          value: 2,
        }
      ],
    },
  },
  // {
  //     label: "行业分类",
  //     field: 'cateName',
  //     component: 'JMsTreeSelect',
  //     required:true,
  //     componentProps: ({formActionType,formModel}) => {
  //       return {
  //         dropdownStyle:{height:'110px'},
  //         onChange:function(e){
  //           console.log(formModel,e)
  //           // formModel.oneCateId = e.oneCateId 
  //           // formModel.twoCateId = e.twoCateId
  //           // formModel.threeCateId = e.threeCateId
  //           formModel.cateId = e.selectCateId
  //         }
  //       }
  //     },
  //  },
  //  {
  //    label: "",
  //    field: 'threeCateId',
  //    show:false,
  //    component: 'Input',
  //    colProps: {span: 6},
  //  },
  //   {
  //     label: "",
  //     field: 'oneCateId',
  //     show:false,
  //     component: 'Input',
  //     colProps: {span: 6},
  //   },
  //   {
  //     label: "",
  //     field: 'twoCateId',
  //     show:false,
  //     component: 'Input',
  //     colProps: {span: 6},
  //   },
  //   {
  //     label: "",
  //     field: 'cateId',
  //     show:false,
  //     component: 'Input',
  //     colProps: {span: 6},
  //   },
    {
      label: '到期日期',
      field: 'endTime',
      required:true,
      component: 'DatePicker',
      componentProps:({formModel})=> {
        return {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          // showTime:true,
          disabledDate:function (current){
            return current < moment().add(-1, 'd');
          }
        }
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